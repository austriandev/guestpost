"use client";

import type { BandKey } from "@/lib/bands";
import { showInMarketplace } from "@/lib/filter";
import { formatPrice } from "@/lib/niches";
import { Arrow } from "./Arrow";

type Tier = {
  key: BandKey;
  name: string;
  range: string;
  count: number;
  from: number;
  median: number;
  avgDr: number;
};

const BLURB: Partial<Record<BandKey, string>> = {
  starter: "Newer sites with a real audience. Good for volume and niche relevance.",
  growth: "The marketplace sweet spot: steady traffic at an everyday price.",
  authority: "Established publishers that rank for competitive terms.",
  premium: "The biggest audiences. Best for brand mentions and AI visibility.",
};

export function PriceTiers({ tiers }: { tiers: Tier[] }) {
  const biggest = tiers.reduce((a, b) => (b.count > a.count ? b : a)).key;
  return (
    <ul className="tiers">
      {tiers.map((t, i) => (
        <li
          key={t.key}
          className={`tier${t.key === biggest ? " tier--pick" : ""}`}
          data-reveal
          style={{ ["--i" as string]: i }}
        >
          {t.key === biggest && <span className="tier__flag">Largest selection</span>}
          <h3 className="tier__name">{t.name}</h3>
          <p className="tier__range">{t.range}</p>
          <p className="tier__price">
            <span>Typical price per post</span>
            <strong>{formatPrice(t.median)}</strong>
          </p>
          <p className="tier__blurb">{BLURB[t.key]}</p>
          <ul className="tier__facts">
            <li>
              <b>{t.count}</b> sites
            </li>
            <li>
              From <b>{formatPrice(t.from)}</b>
            </li>
            <li>
              <b>DR {t.avgDr}</b> average
            </li>
          </ul>
          <button type="button" className="btn btn--block magnetic btn--tier" onClick={() => showInMarketplace({ band: t.key, niche: "all", budget: "any" })}>
            <span>See {t.count} sites</span>
            <Arrow />
          </button>
        </li>
      ))}
    </ul>
  );
}
