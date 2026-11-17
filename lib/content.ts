export const SITE = {
  name: "Guest Post Live",
  url: "https://guestpostlive.com",
  email: "info@guestpostlive.com",
  description:
    "Guest posts on vetted publishers with real readers: the articles Google ranks and AI tools like ChatGPT and Perplexity quote. See traffic, DR, DA and price before you order, and pay only when your post is live.",
  sameAs: [
    "https://www.linkedin.com/company/guestpostlive",
    "https://www.facebook.com/guestpostlive/",
    "https://x.com/GuestPostLive",
    "https://www.instagram.com/guestpostlive/",
    "https://www.tiktok.com/@guestpostlive",
  ],
};

export const NAV = [
  { label: "Marketplace", href: "/media-store/" },
  { label: "Article writing", href: "/article-writing/" },
  { label: "How it works", href: "#how" },
  { label: "Prices", href: "#prices" },
  { label: "Blog", href: "/blog/" },
];

export const STEPS = [
  {
    title: "Pick a publisher",
    body: "Filter by niche, traffic and budget. Each listing shows its rules up front: word count, link limit, turnaround and excluded topics.",
  },
  {
    title: "Send your article",
    body: "Upload your own draft, or add article writing at checkout and we write it to the publisher's guidelines.",
  },
  {
    title: "The publisher reviews and publishes",
    body: "Message the publisher from your order page. Most posts go live in 5 to 10 business days.",
  },
  {
    title: "Approve the live link",
    body: "Check the post and the link. Payment is released to the publisher only after you approve.",
  },
];

export const GUARANTEES = [
  {
    title: "Full refund if it isn't published as agreed",
    body: "If the post doesn't go live, or doesn't match the listing terms, you get your money back.",
  },
  {
    title: "Replacement if the post disappears within 12 months",
    body: "If a placement is removed for reasons outside your control, we replace it on a comparable site or refund you.",
  },
  {
    title: "Metrics before money",
    body: "Traffic, DR, DA and Authority Score are on every listing, along with niches the site won't accept.",
  },
  {
    title: "Your payment waits for the link",
    body: "We hold the payment until you confirm the live URL. Card and PayPal checkout; we never store card details.",
  },
];

// Sample rows for the dashboard preview, taken from the current site's dashboard screenshot.
export const SAMPLE_ORDERS = [
  { id: "2284", site: "resident.com", status: "Live", price: 165, date: "Jun 8" },
  { id: "2281", site: "luxurytravelmagazine.com", status: "Live", price: 95, date: "Jun 5" },
  { id: "2275", site: "educba.com", status: "Live", price: 75, date: "Jun 2" },
  { id: "2247", site: "thehansindia.com", status: "Waiting for your approval", price: 55, date: "May 14" },
  { id: "2241", site: "breakingac.com", status: "With publisher", price: 35, date: "May 10" },
] as const;

// TODO before launch: replace with attributed reviews (full name, company, link or photo),
// or embed Trustpilot / G2. Anonymous quotes don't build trust. Text below is from the current site.
export const REVIEWS = [
  {
    quote:
      "We've tested plenty of guest post vendors and most sell links on sites with inflated traffic. This was the first marketplace where the metrics held up.",
    name: "Founder",
    org: "Link-building agency",
  },
  {
    quote:
      "I filtered by my niche, saw the sample URLs and traffic before buying, and the post went live in under three days. No back-and-forth.",
    name: "Store owner",
    org: "Ecommerce",
  },
  {
    quote:
      "I see exactly where each order stands, message the publisher in one place, and only release payment once the live link checks out.",
    name: "SEO consultant",
    org: "Freelance",
  },
];

export const FAQ = [
  {
    q: "Do guest posts help my brand show up in ChatGPT and Google AI Overviews?",
    a: "They can. AI tools build their answers from pages they can read and trust, and articles on established sites with real readers are a large part of that. A guest post puts your brand, facts and link in one of those articles. No one can guarantee a citation in an AI answer, so pick publishers that are relevant to the questions your buyers ask.",
  },
  {
    q: "How much does a guest post cost?",
    a: "Prices are set by each publisher. On Guest Post Live the typical post costs about $40 on sites under 1K monthly visits and about $75 on sites above 50K. The exact price is on every listing before you order.",
  },
  {
    q: "How do I choose the right site for a guest post?",
    a: "Choose sites that cover your topic and get real organic traffic. Check the listing's traffic, niche, link rules and turnaround, then read a few recent articles on the site to make sure it publishes for readers.",
  },
  {
    q: "What link rules apply to a guest post?",
    a: "Each listing states its link rules before you order, including the number of links allowed and any link attributes or labels the publisher uses. If the published post doesn't match the listing, you get a refund.",
  },
  {
    q: "What is a guest post and how does it help SEO?",
    a: "A guest post is an article published on another website that links back to yours. Links from sites with real readers and relevant topics tell search engines your site is trusted, which helps your pages rank.",
  },
  {
    q: "Are these real websites with actual traffic?",
    a: "Yes. Every site is checked for organic traffic, indexed pages and active editorial standards before it's listed. Traffic, DR, DA and categories are shown on each listing before you buy.",
  },
  {
    q: "How long does publishing take?",
    a: "Most placements go live within 5 to 10 business days. Some publishers turn posts around in 48 hours; each listing shows its own turnaround.",
  },
  {
    q: "Do you offer a money-back guarantee?",
    a: "Yes. If a placement isn't delivered or doesn't match the listing terms, we refund you in full. If a post is removed within 12 months for reasons outside your control, we replace it or refund you.",
  },
  {
    q: "Can I send my own article, or do you write it?",
    a: "Both. Submit your own draft, or add article writing at checkout. Every article is checked against the publisher's guidelines before it goes live.",
  },
  {
    q: "Is there a machine-readable list of sites for tools and AI agents?",
    a: "Yes. The full catalogue with prices, metrics and order links is published as JSON at /data/listings.json, and a plain-text summary for AI assistants is at /llms.txt.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Visa, Mastercard, Amex, debit cards and PayPal. Payments are processed by our payment providers; we never store card details.",
  },
];

export const GUIDES = [
  {
    title: "How much do guest posts cost? Real pricing by DR and niche",
    href: "/guest-post-cost-2026/",
    topic: "Buying guide",
  },
  {
    title: "Sponsored post vs guest post: the real difference",
    href: "/sponsored-post-vs-guest-post/",
    topic: "Buying guide",
  },
  {
    title: "How long do backlinks take to work? A realistic timeline",
    href: "/how-long-do-backlinks-take-to-work/",
    topic: "Link building",
  },
  {
    title: "Press release vs guest post: which one helps SEO?",
    href: "/press-release-vs-guest-post/",
    topic: "Link building",
  },
  {
    title: "Healthcare link building: 7 sources, ranked by what they're worth",
    href: "/healthcare-link-building/",
    topic: "By industry",
  },
  {
    title: "Law firm link building: 7 sources that work",
    href: "/law-firm-link-building/",
    topic: "By industry",
  },
];

export const FOOTER = [
  {
    title: "Buy",
    links: [
      { label: "Marketplace", href: "/media-store/" },
      { label: "Categories", href: "/guestposts-categories/" },
      { label: "Article writing", href: "/article-writing/" },
      { label: "Buyer FAQ", href: "/client-faq/" },
    ],
  },
  {
    title: "Publish",
    links: [
      { label: "List your site", href: "/my-account/?register=publisher" },
      { label: "Publisher FAQ", href: "/publisher-faq/" },
      { label: "Publisher terms", href: "/publisher-terms/" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "Blog", href: "/blog/" },
      { label: "Price guide", href: "/guest-post-cost-2026/" },
      { label: "Writing FAQ", href: "/article-faq/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about/" },
      { label: "Terms", href: "/terms-and-conditions/" },
      { label: "Privacy", href: "/privacy-policy/" },
      { label: "Cookies", href: "/cookie-policy/" },
    ],
  },
];

// Hero illustration: how an AI answer cites published articles. Sources are real
// marketplace listings; the questions and answers are illustrative, not captured output.
export type AiScenario = {
  niche: string;
  question: string;
  answer: { text: string; cite?: number }[];
  sources: { domain: string; title: string }[];
  pick: number; // index of the source shown as a marketplace listing
};

export const AI_SCENARIOS: AiScenario[] = [
  {
    niche: "Travel",
    question: "Where should a family stay for a week at the Jersey Shore?",
    answer: [
      { text: "Ocean City is the usual pick for families: a dry town, a long boardwalk and calm beaches with lifeguards all summer.", cite: 1 },
      { text: " Rentals between 9th and 34th Street keep you walkable to both.", cite: 2 },
      { text: " Book by March for July weeks." },
    ],
    sources: [
      { domain: "ocnjdaily.com", title: "Best blocks in Ocean City for families" },
      { domain: "resident.com", title: "The Jersey Shore, town by town" },
      { domain: "re-thinkingthefuture.com", title: "Boardwalk towns worth the drive" },
    ],
    pick: 0,
  },
  {
    niche: "Finance",
    question: "How should a freelancer set aside money for taxes?",
    answer: [
      { text: "Most accountants suggest moving 25 to 30% of every payment into a separate account the day it arrives.", cite: 1 },
      { text: " Paying quarterly estimates avoids a penalty and a large bill in April.", cite: 2 },
      { text: " Track expenses monthly so deductions don't get missed." },
    ],
    sources: [
      { domain: "flaru.com", title: "A tax plan for your first freelance year" },
      { domain: "thedatascientist.com", title: "Quarterly taxes, explained with numbers" },
      { domain: "businessabc.net", title: "Bookkeeping basics for solo businesses" },
    ],
    pick: 0,
  },
  {
    niche: "Tech",
    question: "What should I check before buying a used iPhone?",
    answer: [
      { text: "Check battery health in Settings first: below 85% means a replacement soon.", cite: 1 },
      { text: " Confirm Activation Lock is off and the IMEI isn't blacklisted.", cite: 2 },
      { text: " Test Face ID, speakers and every camera before you pay." },
    ],
    sources: [
      { domain: "ilounge.com", title: "The used iPhone checklist" },
      { domain: "tuttotek.it", title: "Come verificare un iPhone usato" },
      { domain: "thehansindia.com", title: "Refurbished phones: what to ask" },
    ],
    pick: 0,
  },
];

export const FLOW = [
  {
    title: "Your article goes live",
    body: "Published on a site with real readers, in your niche, with your brand and link in the text.",
  },
  {
    title: "Search engines and AI read it",
    body: "Google, ChatGPT, Perplexity and Gemini crawl established publishers and treat them as sources.",
  },
  {
    title: "Your brand shows up",
    body: "In rankings, and in the answers buyers get when they ask AI what to choose.",
  },
];
