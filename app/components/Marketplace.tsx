"use client";

import { useEffect, useMemo, useState } from "react";
import type { Listing } from "@/lib/listings";
import { BANDS } from "@/lib/bands";
import { BUDGETS, DEFAULT_FILTERS, FILTER_EVENT, matches, type Filters } from "@/lib/filter";
import { formatPrice, nicheLabel } from "@/lib/niches";
import { Arrow } from "./Arrow";
import { PubLogo } from "./PubLogo";

type SortKey = "traffic" | "dr" | "price-asc" | "price-desc";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "traffic", label: "Most traffic" },
  { key: "dr", label: "Highest DR" },
  { key: "price-asc", label: "Lowest price" },
  { key: "price-desc", label: "Highest price" },
];

const PAGE = 12;
const LOG_MIN = Math.log10(100);
const LOG_MAX = Math.log10(200_000);

function meterWidth(traffic: number): number {
  const v = (Math.log10(Math.max(traffic, 100)) - LOG_MIN) / (LOG_MAX - LOG_MIN);
  return Math.round(Math.min(1, Math.max(0.04, v)) * 100);
}

export function Marketplace({ listings, niches }: { listings: Listing[]; niches: string[] }) {
  const [f, setF] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("traffic");
  const [limit, setLimit] = useState(PAGE);
  const set = (patch: Partial<Filters>) => {
    setF((prev) => ({ ...prev, ...patch }));
    setLimit(PAGE);
  };

  useEffect(() => {
    const onFilter = (e: Event) => {
      setF((prev) => ({ ...prev, ...(e as CustomEvent<Partial<Filters>>).detail }));
      setLimit(PAGE);
    };
    window.addEventListener(FILTER_EVENT, onFilter);
    return () => window.removeEventListener(FILTER_EVENT, onFilter);
  }, []);

  const filtered = useMemo(() => {
    // Listings under $10 look like data-entry errors on the source site; hidden until checked.
    const rows = listings.filter((l) => l.price >= 10 && matches(l, f));
    const by: Record<SortKey, (a: Listing, b: Listing) => number> = {
      traffic: (a, b) => b.traffic - a.traffic || b.dr - a.dr,
      dr: (a, b) => b.dr - a.dr || b.traffic - a.traffic,
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
    };
    return rows.sort(by[sort]);
  }, [listings, f, sort]);

  const shown = filtered.slice(0, limit);
  const nicheList = f.niche === "all" || niches.includes(f.niche) ? niches : [...niches, f.niche];

  return (
    <section className="market" aria-labelledby="market-title">
      <div className="market__bar">
        <h2 id="market-title" className="market__title">
          <span className="live-dot" aria-hidden="true" />
          {filtered.length} sites available
        </h2>

        <label className="select">
          <span className="visually-hidden">Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <div className="market__niches" role="group" aria-label="Filter by niche">
          {["all", ...nicheList].map((n) => (
            <button key={n} type="button" className="chip" aria-pressed={f.niche === n} onClick={() => set({ niche: n })}>
              {n === "all" ? "All niches" : nicheLabel(n)}
            </button>
          ))}
        </div>

        <div className="market__filters">
          <div className="seg seg--sm" role="group" aria-label="Monthly traffic">
            <span className="seg__label">Traffic</span>
            {BANDS.map((b) => (
              <button key={b.key} type="button" aria-pressed={f.band === b.key} onClick={() => set({ band: b.key })}>
                {b.label}
              </button>
            ))}
          </div>
          <div className="seg seg--sm" role="group" aria-label="Budget per post">
            <span className="seg__label">Budget</span>
            {BUDGETS.map((b) => (
              <button key={b.key} type="button" aria-pressed={f.budget === b.key} onClick={() => set({ budget: b.key })}>
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <table className="ledger">
        <caption className="visually-hidden">Guest post publishers with traffic, authority metrics and price</caption>
        <thead>
          <tr>
            <th scope="col">Site</th>
            <th scope="col" className="num">
              <abbr title="Ahrefs Domain Rating">DR</abbr>
            </th>
            <th scope="col" className="num">
              <abbr title="Moz Domain Authority">DA</abbr>
            </th>
            <th scope="col" className="num">
              <abbr title="Semrush Authority Score">AS</abbr>
            </th>
            <th scope="col">Monthly organic traffic</th>
            <th scope="col" className="num">
              Price
            </th>
            <th scope="col">
              <span className="visually-hidden">Order</span>
            </th>
          </tr>
        </thead>
        <tbody key={`${f.niche}-${f.band}-${f.budget}-${sort}`}>
          {shown.map((l, i) => (
            <tr key={l.slug} style={{ ["--i" as string]: i % PAGE }}>
              <th scope="row" className="ledger__site">
                <div className="ledger__id">
                  <PubLogo src={l.logo} domain={l.domain} w={72} h={46} />
                  <div className="ledger__text">
                    <a href={`/guestposts/${l.slug}/`}>{l.domain}</a>
                    <span className="ledger__blurb">{l.blurb}</span>
                    <span className="ledger__niches">
                      {(f.niche === "all" ? l.niches : [f.niche, ...l.niches.filter((n) => n !== f.niche)])
                        .slice(0, 3)
                        .map(nicheLabel)
                        .join(" / ")}
                    </span>
                  </div>
                </div>
              </th>
              <td className="num" data-label="DR">
                {l.dr}
              </td>
              <td className="num" data-label="DA">
                {l.da}
              </td>
              <td className="num" data-label="AS">
                {l.as}
              </td>
              <td className="ledger__trafficcell">
                <div className="ledger__traffic">
                  <span className="meter" aria-hidden="true">
                    <span
                      className="meter__fill"
                      style={{ width: `${meterWidth(l.traffic)}%`, animationDelay: `${(i % PAGE) * 45}ms` }}
                    />
                  </span>
                  <span className="meter__label">{l.trafficLabel}</span>
                </div>
              </td>
              <td className="num ledger__price">{formatPrice(l.price)}</td>
              <td className="ledger__action">
                <a className="btn btn--line btn--xs" href={`/guestposts/${l.slug}/`}>
                  <span>
                    Order<span className="visually-hidden"> a post on {l.domain}</span>
                  </span>
                  <Arrow />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {shown.length === 0 && (
        <p className="market__empty">No sites match these filters. Widen the traffic range or budget.</p>
      )}

      <div className="market__foot">
        <p>
          Showing {shown.length} of {filtered.length}. DR from Ahrefs, DA from Moz, AS from Semrush; traffic is
          monthly organic visits.
        </p>
        <div className="market__more">
          {limit < filtered.length && (
            <button type="button" className="btn btn--line" onClick={() => setLimit(limit + PAGE)}>
              Show {Math.min(PAGE, filtered.length - limit)} more
            </button>
          )}
          <a className="btn btn--dark magnetic" href="/media-store/">
            <span>Open the full store</span>
            <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}
