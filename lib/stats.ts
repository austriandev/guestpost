import { listings, type Listing } from "./listings";
import { BANDS, type BandKey } from "./bands";

export { BANDS, type BandKey };

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

type Band = { label: string; count: number; median: number };

function bands(
  pick: (l: Listing) => number,
  ranges: { label: string; min: number; max: number }[],
): Band[] {
  return ranges.map(({ label, min, max }) => {
    const prices = listings
      .filter((l) => pick(l) >= min && pick(l) <= max)
      .map((l) => l.price);
    return { label, count: prices.length, median: median(prices) };
  });
}

export const priceByTraffic = bands((l) => l.traffic, [
  { label: "Under 1K visits", min: 0, max: 999 },
  { label: "1K–5K visits", min: 1000, max: 5999 },
  { label: "10K–20K visits", min: 6000, max: 29999 },
  { label: "50K+ visits", min: 30000, max: Infinity },
]);

export const priceByDr = bands((l) => l.dr, [
  { label: "DR 30–49", min: 30, max: 49 },
  { label: "DR 70+", min: 70, max: 100 },
]);

export const totalSites = listings.length;
export const medianPrice = median(listings.map((l) => l.price));

const nicheCounts = new Map<string, number>();
for (const l of listings) for (const n of l.niches) nicheCounts.set(n, (nicheCounts.get(n) ?? 0) + 1);

export const nicheCount = nicheCounts.size;
export const topNiches = [...nicheCounts.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)
  .map(([slug]) => slug);

// How much more the top traffic band costs than the bottom one, in percent.
export const trafficPremium = Math.round(
  (priceByTraffic[priceByTraffic.length - 1].median / priceByTraffic[0].median - 1) * 100,
);

// Listings priced under $10 look like data-entry errors on the source site; keep them
// out of featured spots until they're checked.
const featured = listings.filter((l) => l.price >= 10);

export const bigAudiences = [...featured]
  .filter((l) => l.traffic >= 50_000)
  .sort((a, b) => b.traffic - a.traffic || b.dr - a.dr)
  .slice(0, 12);

const HUES = [228, 262, 196, 330, 158, 24];
export const marqueeDomains = [...featured]
  .sort((a, b) => b.traffic - a.traffic || b.dr - a.dr)
  .slice(0, 28)
  .map((l, i) => ({ domain: l.domain, dr: l.dr, logo: l.logo, hue: HUES[i % HUES.length] }));

const TIER_NAMES: Partial<Record<BandKey, string>> = {
  starter: "Starter",
  growth: "Growth",
  authority: "Authority",
  premium: "Premium",
};

// Prices under $10 are excluded from "from" prices (see note on `featured`).
export const tiers = BANDS.filter((b) => b.key !== "any").map((b) => {
  const inTier = featured.filter((l) => l.traffic >= b.min && l.traffic <= b.max);
  const prices = inTier.map((l) => l.price);
  return {
    key: b.key,
    name: TIER_NAMES[b.key]!,
    range: `${b.label} visits/mo`,
    count: inTier.length,
    from: Math.min(...prices),
    median: median(prices),
    avgDr: Math.round(inTier.reduce((sum, l) => sum + l.dr, 0) / inTier.length),
  };
});

export const fromPrice = Math.min(...featured.map((l) => l.price));
export const allNiches = [...nicheCounts.entries()].sort((a, b) => b[1] - a[1]).map(([slug]) => slug);

// Listings a buyer can actually order on this page (see note on `featured`).
export const availableSites = featured.length;
