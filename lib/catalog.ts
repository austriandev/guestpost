import { listings, type Listing } from "./listings";
import { SITE } from "./content";
import { nicheLabel } from "./niches";

// Listings a buyer can order (prices under $10 look like data errors; see lib/stats.ts).
export const bookable = listings.filter((l) => l.price >= 10);

export const productUrl = (l: Listing) => `${SITE.url}/guestposts/${l.slug}/`;
// Standard WooCommerce add-to-cart link: adds the listing and opens the cart.
export const addToCartUrl = (l: Listing) => `${SITE.url}/?add-to-cart=${l.id}`;

/** Machine-readable listing for agents and data consumers. */
export function catalogEntry(l: Listing) {
  return {
    domain: l.domain,
    description: l.blurb,
    niches: l.niches.map(nicheLabel),
    priceUsd: l.price,
    monthlyOrganicTraffic: l.trafficLabel,
    ahrefsDomainRating: l.dr,
    mozDomainAuthority: l.da,
    semrushAuthorityScore: l.as,
    url: productUrl(l),
    addToCartUrl: addToCartUrl(l),
    logo: l.logo || null,
  };
}

export const UPDATED = "2026-11-17";
