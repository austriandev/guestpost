import { bookable, productUrl, UPDATED } from "./catalog";
import { FAQ, SITE, STEPS } from "./content";
import { nicheLabel } from "./niches";
import { availableSites, nicheCount, tiers } from "./stats";

const org = `${SITE.url}/#organization`;
const prices = bookable.map((l) => l.price);
const top = bookable
  .slice()
  .sort((a, b) => b.traffic - a.traffic || b.dr - a.dr)
  .slice(0, 20);

/** Homepage JSON-LD graph. Every value is derived from the same data the page shows. */
export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": org,
      name: SITE.name,
      alternateName: ["GuestPostLive", "GPL Media"],
      url: SITE.url,
      logo: { "@type": "ImageObject", url: `${SITE.url}/brand/gpl-logo.png` },
      email: SITE.email,
      contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: SITE.email },
      sameAs: SITE.sameAs,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      publisher: { "@id": org },
      inLanguage: "en-US",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/media-store/?s={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE.url}/#webpage`,
      url: `${SITE.url}/`,
      name: "Buy guest posts on sites with real traffic",
      isPartOf: { "@id": `${SITE.url}/#website` },
      about: { "@id": `${SITE.url}/#service` },
      dateModified: UPDATED,
    },
    {
      "@type": "Service",
      "@id": `${SITE.url}/#service`,
      name: "Guest post publishing",
      serviceType: "Guest posting",
      description: `Sponsored articles on ${availableSites} vetted publisher websites across ${nicheCount} niches, with traffic and authority metrics shown before purchase.`,
      provider: { "@id": org },
      areaServed: "Worldwide",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: Math.min(...prices),
        highPrice: Math.max(...prices),
        offerCount: bookable.length,
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Guest posts by monthly traffic",
        itemListElement: tiers.map((t) => ({
          "@type": "Offer",
          name: `${t.name} guest posts (${t.range})`,
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "USD",
            minPrice: t.from,
            price: t.median,
          },
          eligibleQuantity: { "@type": "QuantitativeValue", value: t.count, unitText: "sites" },
        })),
      },
    },
    {
      "@type": "ItemList",
      "@id": `${SITE.url}/#top-publishers`,
      name: "Highest-traffic guest post sites",
      numberOfItems: top.length,
      itemListElement: top.map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: `Guest post on ${l.domain}`,
          url: productUrl(l),
          ...(l.logo ? { image: l.logo } : {}),
          description: l.blurb,
          category: l.niches.slice(0, 3).map(nicheLabel).join(", "),
          additionalProperty: [
            { "@type": "PropertyValue", name: "Monthly organic traffic", value: l.trafficLabel },
            { "@type": "PropertyValue", name: "Ahrefs Domain Rating", value: l.dr },
            { "@type": "PropertyValue", name: "Moz Domain Authority", value: l.da },
          ],
          offers: {
            "@type": "Offer",
            price: l.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            url: productUrl(l),
            seller: { "@id": org },
          },
        },
      })),
    },
    {
      "@type": "HowTo",
      name: "How to order a guest post",
      totalTime: "P14D",
      step: STEPS.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.body })),
    },
    {
      "@type": "Dataset",
      name: "Guest Post Live publisher catalogue and price index",
      description: `Prices, monthly organic traffic, Ahrefs DR, Moz DA and Semrush Authority Score for ${bookable.length} guest post publishers, with typical price by traffic band.`,
      url: `${SITE.url}/`,
      creator: { "@id": org },
      dateModified: UPDATED,
      variableMeasured: ["Price (USD)", "Monthly organic traffic", "Ahrefs Domain Rating", "Moz Domain Authority", "Semrush Authority Score"],
      distribution: [
        { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: `${SITE.url}/data/listings.json` },
        { "@type": "DataDownload", encodingFormat: "text/plain", contentUrl: `${SITE.url}/llms-full.txt` },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE.url}/#faq`,
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};
