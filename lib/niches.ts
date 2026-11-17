const LABELS: Record<string, string> = {
  ai: "AI",
  "art-culture": "Art & culture",
  "e-commerce": "Ecommerce",
  "food-drink": "Food & drink",
  "home-garden": "Home & garden",
  "real-estate": "Real estate",
  "social-media": "Social media",
  "press-release": "Press release",
};

export function nicheLabel(slug: string): string {
  if (LABELS[slug]) return LABELS[slug];
  const s = slug.replace(/-/g, " ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatPrice(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(n) ? 0 : 2,
  }).format(n);
}
