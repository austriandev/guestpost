"use client";

import { useMemo, useState } from "react";
import type { Listing } from "@/lib/listings";
import { BANDS } from "@/lib/bands";
import { BUDGETS, DEFAULT_FILTERS, matches, showInMarketplace, type Filters } from "@/lib/filter";
import { formatPrice, nicheLabel } from "@/lib/niches";
import { Arrow } from "./Arrow";
import { PubLogo } from "./PubLogo";

/**
 * Hero order widget: three choices narrow the marketplace to a live shortlist
 * with prices and order buttons, so a buyer can go straight to checkout.
 */
export function OrderBuilder({ listings, niches }: { listings: Listing[]; niches: string[] }) {
  const [f, setF] = useState<Filters>(DEFAULT_FILTERS);
  const set = (patch: Partial<Filters>) => setF((prev) => ({ ...prev, ...patch }));

  const results = useMemo(
    () => listings.filter((l) => l.price >= 10 && matches(l, f)).sort((a, b) => b.traffic - a.traffic || b.dr - a.dr),
    [listings, f],
  );
  const from = results.length ? Math.min(...results.map((l) => l.price)) : 0;
  const top = results.slice(0, 3);
  const key = `${f.niche}-${f.band}-${f.budget}`;

  return (
    <div className="builder" aria-labelledby="builder-title">
      <div className="builder__head">
        <h2 id="builder-title">Find your sites</h2>
        <p>Choose a niche, traffic and budget. Matching sites and prices update as you click</p>
      </div>

      <fieldset className="builder__group">
        <legend>Niche</legend>
        <div className="seg seg--wrap">
          {["all", ...niches].map((n) => (
            <button key={n} type="button" aria-pressed={f.niche === n} onClick={() => set({ niche: n })}>
              {n === "all" ? "All" : nicheLabel(n)}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="builder__group">
        <legend>Monthly traffic</legend>
        <div className="seg">
          {BANDS.map((b) => (
            <button key={b.key} type="button" aria-pressed={f.band === b.key} onClick={() => set({ band: b.key })}>
              {b.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="builder__group">
        <legend>Budget per post</legend>
        <div className="seg">
          {BUDGETS.map((b) => (
            <button key={b.key} type="button" aria-pressed={f.budget === b.key} onClick={() => set({ budget: b.key })}>
              {b.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="builder__result" aria-live="polite">
        <p className="builder__count">
          <strong key={key} className="pop-num">
            {results.length}
          </strong>{" "}
          {results.length === 1 ? "site matches" : "sites match"}
          {results.length > 0 && (
            <span>
              from <strong>{formatPrice(from)}</strong> per post
            </span>
          )}
        </p>

        <ul className="builder__list" key={key}>
          {top.map((l, i) => (
            <li key={l.slug} style={{ ["--i" as string]: i }}>
              <a href={`/guestposts/${l.slug}/`} className="builder__site">
                <PubLogo src={l.logo} domain={l.domain} w={56} h={36} />
                <span className="builder__domain">{l.domain}</span>
                <span className="builder__meta">
                  DR {l.dr} <span aria-hidden="true">/</span> {l.trafficLabel} visits
                </span>
              </a>
              <span className="builder__price">{formatPrice(l.price)}</span>
              <a className="btn btn--cta btn--xs" href={`/guestposts/${l.slug}/`}>
                Order<span className="visually-hidden"> a post on {l.domain}</span>
              </a>
            </li>
          ))}
          {top.length === 0 && (
            <li className="builder__empty">No sites match yet. Widen the budget or traffic range.</li>
          )}
        </ul>

        <button
          type="button"
          className="btn btn--dark btn--block magnetic"
          onClick={() => showInMarketplace(f)}
          disabled={results.length === 0}
        >
          <span>See all {results.length} matching sites</span>
          <Arrow />
        </button>
      </div>
    </div>
  );
}
