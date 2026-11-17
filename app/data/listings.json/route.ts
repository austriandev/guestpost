import { bookable, catalogEntry, UPDATED } from "@/lib/catalog";
import { SITE } from "@/lib/content";

export const dynamic = "force-static";

// Machine-readable catalogue for tools and AI agents. Regenerated on every build.
export function GET() {
  const body = {
    name: `${SITE.name} guest post catalogue`,
    publisher: SITE.url,
    updated: UPDATED,
    currency: "USD",
    count: bookable.length,
    howToOrder:
      "Open `url` to see the listing's rules, or use `addToCartUrl` to add it to the cart. Payment is released to the publisher after the buyer approves the live post.",
    listings: bookable.slice().sort((a, b) => b.traffic - a.traffic).map(catalogEntry),
  };
  return Response.json(body);
}
