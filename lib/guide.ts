import { formatPrice } from "./niches";
import { availableSites, medianPrice, nicheCount, tiers } from "./stats";

// Long-form buying guide shown on the homepage and in llms-full.txt.
// Answer-first paragraphs: each section opens with the direct answer, so search
// snippets and AI assistants can quote it on its own.

const t = Object.fromEntries(tiers.map((x) => [x.key, x]));

export type GuideSection = { id: string; title: string; body: string[] };

export const GUIDE: GuideSection[] = [
  {
    id: "what-is",
    title: "What a guest post marketplace is",
    body: [
      "A guest post marketplace is a catalogue of websites that publish articles from outside writers for a fee. You choose a site, send an article or have one written, and the site publishes it with a link to your website.",
      `Guest Post Live lists ${availableSites} publishers across ${nicheCount} niches. Every listing shows the site's monthly organic traffic, Ahrefs Domain Rating, Moz Domain Authority, Semrush Authority Score and price before you order, and payment is released to the publisher only after you approve the live post.`,
    ],
  },
  {
    id: "choose",
    title: "How to choose a guest post site",
    body: [
      "Pick sites that real people read in your topic. Organic traffic and topical relevance matter more than a single authority score, because a page that gets visits is a page search engines keep crawling and ranking.",
      "Check four things on every listing: monthly organic traffic, whether the site regularly covers your niche, the link rules (how many links and of what type), and the turnaround time. Then open a few recent articles on the site and make sure they are written for readers, not only for links.",
      "Spread orders across several relevant sites instead of buying many links on one domain. A natural mix of publishers, anchor texts and pages on your site looks like earned coverage and is more durable.",
    ],
  },
  {
    id: "cost",
    title: "What guest posts cost",
    body: [
      `The median guest post on Guest Post Live costs ${formatPrice(medianPrice)}. Price follows traffic: the typical post costs ${formatPrice(t.starter.median)} on sites under 1K monthly visits, ${formatPrice(t.growth.median)} at 1K to 10K, ${formatPrice(t.authority.median)} at 10K to 50K and ${formatPrice(t.premium.median)} on sites above 50K.`,
      "Each publisher sets its own price, so the number on the listing is the price you pay. Article writing can be added at checkout if you don't have your own draft.",
    ],
  },
  {
    id: "ai-search",
    title: "Guest posts and AI search",
    body: [
      "AI assistants such as ChatGPT, Perplexity, Gemini and Google's AI Overviews answer questions by reading and citing pages on sites they consider trustworthy. A guest post on an established, relevant publisher puts your brand name, your facts and a link in one of those pages.",
      "To make an article easy for AI tools to quote, answer one clear buyer question, state facts plainly with numbers and dates, name your brand in full, and keep the page free of filler. No one can guarantee that an AI assistant will cite a specific page, so choose publishers that cover the questions your customers actually ask.",
    ],
  },
  {
    id: "timeline",
    title: "How long a guest post takes to work",
    body: [
      "Most posts go live within 5 to 10 business days of ordering. Search engines usually find and index a new article within days to a few weeks, and the effect on your own rankings builds over the following weeks and months.",
      "Track the live URL, its indexing status and the pages it links to. Results compound when several relevant placements point to the same pages over time.",
    ],
  },
  {
    id: "safety",
    title: "How your order is protected",
    body: [
      "You approve the live link before the publisher is paid. If a post isn't published as agreed you get a full refund, and if it is removed within 12 months for reasons outside your control it is replaced on a comparable site or refunded.",
    ],
  },
];
