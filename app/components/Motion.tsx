"use client";

import { useEffect } from "react";

/**
 * Page-wide motion driver. Renders nothing; wires up:
 * - [data-reveal]       fade/slide in when scrolled into view (stagger via --i)
 * - [data-count]        count up to the element's number when revealed
 * - [data-scrub]        words fill from muted to ink as the paragraph scrolls past
 * - [data-progress]     sets --p (0..1) as the element scrolls through the viewport
 * - .magnetic           buttons lean toward the pointer
 * - body[data-scrolled] once the page has moved, for the header
 */
export function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    // Reveal + count-up
    const countUp = (el: HTMLElement) => {
      const target = Number(el.dataset.count);
      const prefix = el.dataset.prefix ?? "";
      const suffix = el.dataset.suffix ?? "";
      if (reduce || !Number.isFinite(target)) {
        el.textContent = `${prefix}${target}${suffix}`;
        return;
      }
      const dur = 1400;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("is-in");
          el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
          if (el.dataset.count) countUp(el);
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    // Scrubbed paragraphs (words are pre-split on the server by <Scrub>)
    const scrubs = [...document.querySelectorAll<HTMLElement>("[data-scrub]")].map((el) => ({
      el,
      words: [...el.querySelectorAll<HTMLElement>(".scrub__w")],
    }));

    const progressEls = [...document.querySelectorAll<HTMLElement>("[data-progress]")];

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const vh = window.innerHeight;
        document.body.toggleAttribute("data-scrolled", window.scrollY > 24);

        for (const { el, words } of scrubs) {
          const r = el.getBoundingClientRect();
          // 0 when the top hits 85% of the viewport, 1 when the bottom reaches 45%
          const p = reduce ? 1 : (vh * 0.85 - r.top) / (r.height + vh * 0.4);
          const lit = Math.round(Math.max(0, Math.min(1, p)) * words.length);
          words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
        }
        for (const el of progressEls) {
          const r = el.getBoundingClientRect();
          const p = reduce ? 1 : (vh * 0.6 - r.top) / r.height;
          el.style.setProperty("--p", String(Math.max(0, Math.min(1, p))));
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Magnetic buttons (fine pointers only)
    const cleanups: (() => void)[] = [];
    if (!reduce && window.matchMedia("(pointer: fine)").matches) {
      document.querySelectorAll<HTMLElement>(".magnetic").forEach((el) => {
        const move = (ev: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const x = (ev.clientX - r.left - r.width / 2) / r.width;
          const y = (ev.clientY - r.top - r.height / 2) / r.height;
          el.style.setProperty("--mx", `${x * 10}px`);
          el.style.setProperty("--my", `${y * 8}px`);
        };
        const leave = () => {
          el.style.setProperty("--mx", "0px");
          el.style.setProperty("--my", "0px");
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    }

    root.classList.add("motion-ready");

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cleanups.forEach((c) => c());
    };
  }, []);

  return null;
}
