"use client";

import { useEffect, useState } from "react";
import { Arrow } from "./Arrow";

type Review = { quote: string; name: string; org: string };

const INTERVAL = 7000;

export function Reviews({ items }: { items: readonly Review[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((n) => (n + 1) % items.length), INTERVAL);
    return () => clearTimeout(t);
  }, [i, paused, items.length]);

  const go = (d: number) => setI((n) => (n + d + items.length) % items.length);

  return (
    <div
      className="quotes"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="quotes__stage" aria-live="polite">
        {items.map((r, n) => (
          <figure key={r.name} className={`quote${n === i ? " is-on" : ""}`} aria-hidden={n !== i}>
            <blockquote>{r.quote}</blockquote>
            <figcaption>
              <strong>{r.name}</strong>
              <span>{r.org}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="quotes__nav">
        <div className="quotes__bars">
          {items.map((r, n) => (
            <button
              key={r.name}
              type="button"
              aria-label={`Show review ${n + 1}`}
              aria-current={n === i}
              className={`quotes__bar${n === i ? " is-on" : ""}${n < i ? " is-done" : ""}${paused ? " is-paused" : ""}`}
              style={{ ["--t" as string]: `${INTERVAL}ms` }}
              onClick={() => setI(n)}
            >
              <span />
            </button>
          ))}
        </div>
        <div className="carousel__btns">
          <button type="button" className="round round--light" onClick={() => go(-1)} aria-label="Previous review">
            <Arrow flip />
          </button>
          <button type="button" className="round round--light" onClick={() => go(1)} aria-label="Next review">
            <Arrow />
          </button>
        </div>
      </div>
    </div>
  );
}
