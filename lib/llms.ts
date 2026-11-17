import { bookable, catalogEntry, UPDATED } from "./catalog";
import { CATEGORIES } from "./categories";
import { FAQ, SITE, STEPS } from "./content";
import { GUIDE } from "./guide";
import { formatPrice, nicheLabel } from "./niches";
import { availableSites, medianPrice, nicheCount, tiers } from "./stats";

const u = (path: string) => `${SITE.url}${path}`;

/** Short, link-first summary for AI assistants (llmstxt.org format). */
export function llmsTxt(): string {
  return `# Guest Post Live

> Guest Post Live (guestpostlive.com, also branded GPL Media) is a guest post marketplace. Buyers order articles on ${availableSites} vetted publisher websites across ${nicheCount} niches. Every listing shows monthly organic traffic, Ahrefs DR, Moz DA, Semrush Authority Score and price before purchase, and payment is released only after the buyer approves the live post.

Updated ${UPDATED}.

## Key facts

- ${availableSites} bookable publisher sites, ${nicheCount} niches. Median price ${formatPrice(medianPrice)} per post.
${tiers.map((t) => `- ${t.name} (${t.range}): typical ${formatPrice(t.median)}, from ${formatPrice(t.from)}, ${t.count} sites.`).join("\n")}
- Most posts go live in 5 to 10 business days.
- Full refund if a post isn't published as agreed; replacement or refund if removed within 12 months.
- Article writing can be added at checkout.

## How to order (for people and agents)

${STEPS.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`).join("\n")}

Each site has a product page at \`${u("/guestposts/{slug}/")}\`. A listing can be added to the cart directly with \`${u("/?add-to-cart={id}")}\`; ids and slugs are in the JSON catalogue below.

## Data

- [Full catalogue (JSON)](${u("/data/listings.json")}): every bookable site with price, metrics, niches, product URL and add-to-cart URL
- [Full text for LLMs](${u("/llms-full.txt")}): this summary plus the buying guide, FAQ and every listing

## Pages

- [Marketplace](${u("/media-store/")}): all listings with filters
- [Guest post price guide](${u("/guest-post-cost-2026/")})
- [Article writing](${u("/article-writing/")})
- [Buyer FAQ](${u("/client-faq/")})
- [Publisher FAQ](${u("/publisher-faq/")})
- [About](${u("/about/")})

## Categories

${CATEGORIES.map((c) => `- [${c.name}](${u(c.href)}): ${c.count} sites`).join("\n")}
`;
}

/** Everything in one file: summary, guide, FAQ and the full listing table. */
export function llmsFullTxt(): string {
  const rows = bookable
    .slice()
    .sort((a, b) => b.traffic - a.traffic)
    .map((l) => {
      const e = catalogEntry(l);
      return `| [${l.domain}](${e.url}) | ${formatPrice(l.price)} | ${l.trafficLabel} | ${l.dr} | ${l.da} | ${l.as} | ${l.niches.slice(0, 3).map(nicheLabel).join(", ")} |`;
    });
  return `${llmsTxt()}
## Buying guide

${GUIDE.map((g) => `### ${g.title}\n\n${g.body.join("\n\n")}`).join("\n\n")}

## FAQ

${FAQ.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n")}

## All listings

Traffic is monthly organic visits. DR = Ahrefs Domain Rating, DA = Moz Domain Authority, AS = Semrush Authority Score. Prices in USD.

| Site | Price | Traffic | DR | DA | AS | Niches |
| --- | --- | --- | --- | --- | --- | --- |
${rows.join("\n")}
`;
}
