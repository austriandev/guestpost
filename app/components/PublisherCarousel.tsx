"use client";

import { useEffect, useRef, useState } from "react";
import type { Listing } from "@/lib/listings";
import { formatPrice, nicheLabel } from "@/lib/niches";
import { Arrow } from "./Arrow";
import { PubLogo } from "./PubLogo";

const HUES = [228, 262, 196, 330, 158, 24];

function hueFor(domain: string) {
  let h = 0;
  for (const c of domain) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return HUES[h % HUES.length];
}

export function PublisherCarousel({ items }: { items: Listing[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const hovering = useRef(false);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const w = card ? card.getBoundingClientRect().width + 16 : el.clientWidth;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 8;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      setPages(Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth)));
      setPage(Math.round(el.scrollLeft / el.clientWidth));
    };
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = reduce
      ? undefined
      : setInterval(() => {
          const r = el.getBoundingClientRect();
          const visible = r.top < window.innerHeight && r.bottom > 0;
          if (!hovering.current && visible && !el.contains(document.activeElement)) step(1);
        }, 3600);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      if (id) clearInterval(id);
    };
  }, []);

  const spotlight = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <div
      className="carousel"
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => (hovering.current = false)}
    >
      <ul className="carousel__track" ref={track} aria-label="High-traffic publishers">
        {items.map((l, i) => (
          <li key={l.slug} className="pub" style={{ ["--h" as string]: hueFor(l.domain), ["--i" as string]: i }}>
            <a href={`/guestposts/${l.slug}/`} onPointerMove={spotlight} className="pub__link">
              <span className="pub__top">
                <PubLogo src={l.logo} domain={l.domain} w={92} h={56} />
                <span className="pub__niche">{l.niches.slice(0, 2).map(nicheLabel).join(", ")}</span>
              </span>
              <span className="pub__domain">{l.domain}</span>
              <span className="pub__blurb">{l.blurb}</span>
              <span className="pub__stats">
                <span>
                  <b>{l.dr}</b>
                  <small>DR</small>
                </span>
                <span>
                  <b>{l.da}</b>
                  <small>DA</small>
                </span>
                <span>
                  <b>{l.trafficLabel}</b>
                  <small>visits/mo</small>
                </span>
              </span>
              <span className="pub__foot">
                <span className="pub__price">{formatPrice(l.price)}</span>
                <span className="pub__cta">
                  Order a post
                  <Arrow />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div className="carousel__nav">
        <div className="carousel__dots" aria-hidden="true">
          {Array.from({ length: pages }, (_, i) => (
            <span key={i} className={i === page ? "is-on" : ""} />
          ))}
        </div>
        <div className="carousel__btns">
          <button type="button" className="round" onClick={() => step(-1)} aria-label="Previous publishers">
            <Arrow flip />
          </button>
          <button type="button" className="round" onClick={() => step(1)} aria-label="Next publishers">
            <Arrow />
          </button>
        </div>
      </div>
    </div>
  );
}
