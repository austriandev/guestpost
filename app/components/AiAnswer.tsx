"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AiScenario } from "@/lib/content";
import type { Listing } from "@/lib/listings";
import { formatPrice } from "@/lib/niches";

type Phase = "ask" | "search" | "answer" | "match" | "hold";

type State = { phase: Phase; q: number; a: number; s: number };
const START: State = { phase: "ask", q: 0, a: 0, s: 0 };
const FULL: State = { phase: "hold", q: Infinity, a: Infinity, s: Infinity };

/**
 * Hero demo: a question is typed into an AI assistant, sources are gathered,
 * the answer streams in with numbered citations, then the cited publisher is
 * revealed as a marketplace listing. Cycles through scenarios; tabs jump.
 */
export function AiAnswer({
  scenarios,
  listings,
}: {
  scenarios: AiScenario[];
  listings: Pick<Listing, "domain" | "slug" | "dr" | "trafficLabel" | "price" | "niches">[];
}) {
  const [active, setActive] = useState(0);
  const [st, setSt] = useState<State>(START);
  const [paused, setPaused] = useState(false);
  const reduce = useRef(false);

  const sc = scenarios[active];
  const words = useMemo(
    () =>
      sc.answer.flatMap((seg, si) => {
        const parts = seg.text.split(/(?<=\s)/);
        return parts.map((w, wi) => ({ w, cite: wi === parts.length - 1 ? seg.cite : undefined, si }));
      }),
    [sc],
  );
  const listing = listings.find((l) => l.domain === sc.sources[sc.pick].domain);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setSt(reduce.current ? FULL : START);
  }, [active]);

  useEffect(() => {
    if (reduce.current || paused) return;
    let t: ReturnType<typeof setTimeout>;
    const { phase, q, a, s } = st;
    if (phase === "ask") {
      t =
        q < sc.question.length
          ? setTimeout(() => setSt({ ...st, q: q + 1 }), 26 + Math.random() * 30)
          : setTimeout(() => setSt({ ...st, phase: "search" }), 450);
    } else if (phase === "search") {
      t =
        s < sc.sources.length
          ? setTimeout(() => setSt({ ...st, s: s + 1 }), 380)
          : setTimeout(() => setSt({ ...st, phase: "answer" }), 500);
    } else if (phase === "answer") {
      t =
        a < words.length
          ? setTimeout(() => setSt({ ...st, a: a + 1 }), 48)
          : setTimeout(() => setSt({ ...st, phase: "match" }), 650);
    } else if (phase === "match") {
      t = setTimeout(() => setSt({ ...st, phase: "hold" }), 600);
    } else {
      t = setTimeout(() => setActive((active + 1) % scenarios.length), 5200);
    }
    return () => clearTimeout(t);
  }, [st, paused, sc, words.length, active, scenarios.length]);

  const asked = sc.question.slice(0, st.q);
  const typing = st.phase === "ask";
  const matched = st.phase === "match" || st.phase === "hold";

  return (
    <div
      className="ai"
      data-phase={st.phase}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="ai__tabs" role="tablist" aria-label="Example questions">
        {scenarios.map((s, i) => (
          <button
            key={s.niche}
            role="tab"
            type="button"
            aria-selected={i === active}
            className="ai__tab"
            onClick={() => setActive(i)}
          >
            {s.niche}
            <span className="ai__tabbar" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="ai__window" role="tabpanel" aria-label={`${sc.niche} example`}>
        <div className="ai__ask">
          <span className="ai__avatar" aria-hidden="true">
            You
          </span>
          <p className="ai__question">
            {asked}
            {typing && <span className="ai__caret" aria-hidden="true" />}
          </p>
        </div>

        <div className="ai__reply">
          <span className="ai__spark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path
                d="M12 2c.6 4.8 2.7 7.4 8 8.4v1.2c-5.3 1-7.4 3.6-8 8.4h-1.2c-.6-4.8-2.7-7.4-8-8.4v-1.2c5.3-1 7.4-3.6 8-8.4z"
                fill="currentColor"
              />
            </svg>
          </span>
          <div className="ai__body">
            <p className="ai__status">
              {st.phase === "ask"
                ? "Waiting for a question"
                : st.phase === "search"
                  ? `Reading ${st.s} of ${sc.sources.length} sources`
                  : `Answer based on ${sc.sources.length} sources`}
            </p>
            <ol className="ai__sources">
              {sc.sources.map((src, i) => (
                <li
                  key={src.domain}
                  className={`ai__source${i < st.s ? " is-on" : ""}${matched && i === sc.pick ? " is-pick" : ""}`}
                  style={{ ["--d" as string]: `${i * 60}ms` }}
                >
                  <span className="ai__num">{i + 1}</span>
                  <span className="ai__srcdomain">{src.domain}</span>
                  <span className="ai__srctitle">{src.title}</span>
                </li>
              ))}
            </ol>
            <p className="ai__answer">
              {words.slice(0, st.a).map((w, i) => (
                <span key={i} className="ai__word">
                  {w.w}
                  {w.cite && (
                    <sup className={`ai__cite${matched && w.cite - 1 === sc.pick ? " is-pick" : ""}`}>
                      {w.cite}
                    </sup>
                  )}
                </span>
              ))}
              {st.phase === "answer" && <span className="ai__dot" aria-hidden="true" />}
            </p>
          </div>
        </div>

        {listing && (
          <a className={`ai__match${matched ? " is-on" : ""}`} href={`/guestposts/${listing.slug}/`} tabIndex={matched ? 0 : -1}>
            <span className="ai__matchlabel">Source 1 is on Guest Post Live</span>
            <span className="ai__matchrow">
              <strong>{listing.domain}</strong>
              <span>DR {listing.dr}</span>
              <span>{listing.trafficLabel} visits/mo</span>
              <span className="ai__price">{formatPrice(listing.price)}</span>
            </span>
            <span className="ai__order">Order a post</span>
          </a>
        )}
      </div>
      <p className="ai__note">Illustration with real listings. Questions and answers are examples.</p>
    </div>
  );
}
