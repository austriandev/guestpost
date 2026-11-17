// Traffic bands, shared by the price tiers, the order builder and the marketplace filter.
export type BandKey = "any" | "starter" | "growth" | "authority" | "premium";
export const BANDS: { key: BandKey; label: string; min: number; max: number }[] = [
  { key: "any", label: "Any", min: 0, max: Infinity },
  { key: "starter", label: "Under 1K", min: 0, max: 999 },
  { key: "growth", label: "1K–10K", min: 1_000, max: 9_999 },
  { key: "authority", label: "10K–50K", min: 10_000, max: 49_999 },
  { key: "premium", label: "50K+", min: 50_000, max: Infinity },
];
