import type { Listing } from "./listings";
import { BANDS, type BandKey } from "./bands";

export type Budget = "any" | "50" | "100" | "200";

export type Filters = {
  niche: string; // "all" or a niche slug
  band: BandKey;
  budget: Budget;
};

export const DEFAULT_FILTERS: Filters = { niche: "all", band: "any", budget: "any" };

export const BUDGETS: { key: Budget; label: string }[] = [
  { key: "any", label: "Any" },
  { key: "50", label: "Up to $50" },
  { key: "100", label: "Up to $100" },
  { key: "200", label: "Up to $200" },
];

export function matches(l: Listing, f: Filters): boolean {
  const band = BANDS.find((b) => b.key === f.band) ?? BANDS[0];
  return (
    (f.niche === "all" || l.niches.includes(f.niche)) &&
    l.traffic >= band.min &&
    l.traffic <= band.max &&
    (f.budget === "any" || l.price <= Number(f.budget))
  );
}

/** Ask the marketplace table to apply filters and scroll into view. */
export const FILTER_EVENT = "gpl:filter";

export function showInMarketplace(f: Partial<Filters>) {
  window.dispatchEvent(new CustomEvent<Partial<Filters>>(FILTER_EVENT, { detail: f }));
  document.getElementById("sites")?.scrollIntoView({ behavior: "smooth", block: "start" });
}
