import { AiAnswer } from "./components/AiAnswer";
import { Arrow } from "./components/Arrow";
import { BrandLogo } from "./components/BrandLogo";
import { Globe } from "./components/Globe";
import { Marketplace } from "./components/Marketplace";
import { Motion } from "./components/Motion";
import { OrderBuilder } from "./components/OrderBuilder";
import { PriceTiers } from "./components/PriceTiers";
import { PubLogo } from "./components/PubLogo";
import { PublisherCarousel } from "./components/PublisherCarousel";
import { Reviews } from "./components/Reviews";
import { TypedWords } from "./components/TypedWords";
import { listings } from "@/lib/listings";
import { CATEGORIES } from "@/lib/categories";
import { AI_SCENARIOS, FAQ, GUARANTEES, REVIEWS, SITE, STEPS } from "@/lib/content";
import { GUIDE } from "@/lib/guide";
import { homeJsonLd } from "@/lib/schema";
import { availableSites, bigAudiences, marqueeDomains, nicheCount, tiers, topNiches } from "@/lib/stats";

const NICHE_WORDS = ["finance", "tech", "travel", "health", "business"];

const NAV = [
  { label: "Sites", href: "#sites" },
  { label: "Pricing", href: "#pricing" },
  { label: "How it works", href: "#how" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "/blog/" },
];

const STRIP = [
  "Pay only when your post is live",
  "Free replacement within 12 months",
  `${availableSites} sites with verified traffic`,
];

// Footer: four equal columns of five links, so the block reads symmetric.
const FOOTER_COLS = [
  {
    title: "Buy",
    links: [
      { label: "Marketplace", href: "/media-store/" },
      { label: "Categories", href: "/guestposts-categories/" },
      { label: "Article writing", href: "/article-writing/" },
      { label: "Pricing", href: "#pricing" },
      { label: "Buyer FAQ", href: "/client-faq/" },
    ],
  },
  {
    title: "Publish",
    links: [
      { label: "List your site", href: "/my-account/?register=publisher" },
      { label: "Publisher FAQ", href: "/publisher-faq/" },
      { label: "Publisher terms", href: "/publisher-terms/" },
      { label: "Writing FAQ", href: "/article-faq/" },
      { label: "Log in", href: "/my-account/" },
    ],
  },
  {
    title: "Guides",
    links: [
      { label: "Guest post prices", href: "/guest-post-cost-2026/" },
      { label: "Sponsored vs guest posts", href: "/sponsored-post-vs-guest-post/" },
      { label: "How long backlinks take", href: "/how-long-do-backlinks-take-to-work/" },
      { label: "Press release vs guest post", href: "/press-release-vs-guest-post/" },
      { label: "Healthcare link building", href: "/healthcare-link-building/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about/" },
      { label: "Blog", href: "/blog/" },
      { label: "Terms", href: "/terms-and-conditions/" },
      { label: "Privacy", href: "/privacy-policy/" },
      { label: "Cookies", href: "/cookie-policy/" },
    ],
  },
];

const DATA_LINKS = [
  { label: "llms.txt", href: "/llms.txt" },
  { label: "Full catalogue (JSON)", href: "/data/listings.json" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

const GUARANTEE_ICONS = [
  <path key="a" d="M4 12.5 9.5 18 20 6.5" />,
  <path key="b" d="M4 12a8 8 0 0 1 13.7-5.6M20 12a8 8 0 0 1-13.7 5.6M17.5 3v3.6h-3.6M6.5 21v-3.6h3.6" />,
  <path key="c" d="M4 19V11M10 19V5M16 19v-6M22 19H2" />,
  <path key="d" d="M6 10V8a6 6 0 0 1 12 0v2M5 10h14v10H5zM12 14v2" />,
];

function Check() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Home() {
  const half = Math.ceil(marqueeDomains.length / 2);
  const rows = [marqueeDomains.slice(0, half), marqueeDomains.slice(half)];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }} />
      <Motion />

      <a className="skip" href="#main">
        Skip to content
      </a>

      {/* Header: trust strip + sticky bar */}
      <div className="strip">
        <ul className="wrap strip__list">
          {STRIP.map((s) => (
            <li key={s}>
              <Check />
              {s}
            </li>
          ))}
        </ul>
      </div>
      <header className="bar">
        <div className="wrap bar__inner">
          <BrandLogo priority />
          <nav aria-label="Main" className="bar__nav">
            {NAV.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="bar__actions">
            <a href="/my-account/" className="bar__login">
              Log in
            </a>
            <a className="btn btn--cta btn--sm magnetic" href="#order">
              <span>Order a post</span>
              <Arrow />
            </a>
          </div>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__glow" aria-hidden="true">
            <span />
            <span />
          </div>
          <div className="wrap hero__grid">
            <div className="hero__copy">
              <h1 id="hero-title" className="hero__title">
                <span className="line" style={{ ["--i" as string]: 0 }}>
                  <span>Buy guest posts</span>
                </span>
                <span className="line" style={{ ["--i" as string]: 1 }}>
                  <span>
                    on real{" "}
                    <TypedWords words={NICHE_WORDS} srText="finance, tech, travel, health and business" />
                  </span>
                </span>
                <span className="line" style={{ ["--i" as string]: 2 }}>
                  <span>sites</span>
                </span>
              </h1>
              <p className="hero__lede">
                Pick a site, send your article, approve the live link. You pay only when it&rsquo;s
                published. Traffic, DR and price are on every listing before you order.
              </p>
              <div className="hero__ctas">
                <a className="btn btn--cta btn--lg magnetic" href="#order">
                  <span>Find your sites</span>
                  <Arrow />
                </a>
                <a className="btn btn--line btn--lg" href="#pricing">
                  <span>See pricing</span>
                </a>
              </div>
              <dl className="hero__stats" data-reveal>
                <div>
                  <dt>Publishers</dt>
                  <dd data-count={availableSites}>{availableSites}</dd>
                </div>
                <div>
                  <dt>Niches</dt>
                  <dd data-count={nicheCount}>{nicheCount}</dd>
                </div>
                <div>
                  <dt>Business days to go live</dt>
                  <dd>5–10</dd>
                </div>
              </dl>
            </div>
            <div className="hero__visual">
              <Globe />
            </div>
          </div>
        </section>

        {/* Order builder */}
        <section className="order" id="order" aria-label="Find and order sites">
          <div className="wrap">
            <OrderBuilder listings={listings} niches={topNiches.filter((n) => n !== "news").slice(0, 6)} />
          </div>
        </section>

        {/* Publisher marquee */}
        <section className="logos" aria-label="Publishers on the marketplace" data-reveal>
          <p className="logos__caption">Publish on sites with real readers, from 1K to 200K+ monthly visits</p>
          {rows.map((row, r) => (
            <div key={r} className={`marquee${r ? " marquee--rev" : ""}`}>
              <div className="marquee__track">
                {[0, 1].map((copy) => (
                  <ul key={copy} className="marquee__list" aria-hidden={copy === 1}>
                    {row.map((d, i) => (
                      <li key={d.domain} className="logo-tile" style={{ ["--i" as string]: i }}>
                        <PubLogo src={d.logo} domain={d.domain} w={54} h={34} />
                        <span className="logo-tile__name">{d.domain}</span>
                        <span className="logo-tile__dr">DR {d.dr}</span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Pricing */}
        <section className="section" id="pricing" aria-labelledby="pricing-title">
          <div className="wrap">
            <div className="head head--row" data-reveal>
              <h2 id="pricing-title" className="h2">
                Pick a budget and see every price upfront
              </h2>
              <p>
                Each publisher sets its own price. These ranges come from today&rsquo;s {availableSites} listings, so
                what you see is what you pay.
              </p>
            </div>
            <PriceTiers tiers={tiers} />
            <p className="pricing__note" data-reveal>
              Need the article written? <a href="/article-writing/">Add article writing</a> at checkout.
            </p>
          </div>
        </section>

        {/* Marketplace */}
        <section className="section section--alt" id="sites" aria-labelledby="sites-title">
          <div className="wrap">
            <div className="head head--row" data-reveal>
              <h2 id="sites-title" className="h2">
                Every site and every number before you pay
              </h2>
              <p>Filter by niche, traffic and budget, then order straight from the list.</p>
            </div>
            <div data-reveal>
              <Marketplace listings={listings} niches={topNiches} />
            </div>
          </div>
        </section>

        {/* Browse by niche */}
        <section className="section" id="niches" aria-labelledby="niches-title">
          <div className="wrap">
            <div className="head head--row" data-reveal>
              <h2 id="niches-title" className="h2">
                Browse guest posts by niche
              </h2>
              <p>Every category page lists its sites with traffic, authority and price.</p>
            </div>
            <ul className="niches">
              {CATEGORIES.map((c, i) => (
                <li key={c.slug} data-reveal style={{ ["--i" as string]: i % 8 }}>
                  <a href={c.href}>
                    <span className="niches__name">{c.name} guest posts</span>
                    <span className="niches__count">{c.count} {c.count === 1 ? "site" : "sites"}</span>
                    <Arrow />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section className="section" id="how" aria-labelledby="how-title">
          <div className="wrap">
            <div className="head head--row" data-reveal>
              <h2 id="how-title" className="h2">
                Ordered in minutes, live in days
              </h2>
              <a className="btn btn--dark magnetic" href="#order">
                <span>Start an order</span>
                <Arrow />
              </a>
            </div>
            <ol className="steps" data-progress>
              <span className="steps__rail" aria-hidden="true">
                <span />
              </span>
              {STEPS.map((s, i) => (
                <li key={s.title} data-reveal style={{ ["--i" as string]: i }}>
                  <span className="steps__n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Biggest audiences */}
        <section className="section section--dark" aria-labelledby="big-title">
          <div className="wrap">
            <div className="head head--row" data-reveal>
              <h2 id="big-title" className="h2">
                The biggest audiences, ready to order
              </h2>
              <p>Sites with 50K to 200K+ monthly organic visits.</p>
            </div>
            <div data-reveal>
              <PublisherCarousel items={bigAudiences} />
            </div>
          </div>
        </section>

        {/* AI search */}
        <section className="section" aria-labelledby="ai-title">
          <div className="wrap split">
            <div className="split__intro" data-reveal>
              <h2 id="ai-title" className="h2">
                Show up in Google and in AI answers
              </h2>
              <p>
                ChatGPT, Perplexity and Google&rsquo;s AI Overviews build answers from articles on sites
                people already read. A guest post puts your brand in those articles.
              </p>
              <ul className="ticks">
                <li>
                  <Check /> Links and brand mentions on established publishers
                </li>
                <li>
                  <Check /> Pick sites that match the questions your buyers ask
                </li>
                <li>
                  <Check /> Pages Google ranks and AI tools can read and quote
                </li>
              </ul>
            </div>
            <div data-reveal>
              <AiAnswer
                scenarios={AI_SCENARIOS}
                listings={listings.filter((l) => AI_SCENARIOS.some((s) => s.sources.some((x) => x.domain === l.domain)))}
              />
            </div>
          </div>
        </section>

        {/* Guarantees */}
        <section className="section section--alt" aria-labelledby="cover-title">
          <div className="wrap">
            <div className="head" data-reveal>
              <h2 id="cover-title" className="h2">
                Your money is protected on every order
              </h2>
            </div>
            <ul className="cover">
              {GUARANTEES.map((g, i) => (
                <li key={g.title} data-reveal style={{ ["--i" as string]: i }}>
                  <span className="cover__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {GUARANTEE_ICONS[i]}
                    </svg>
                  </span>
                  <h3>{g.title}</h3>
                  <p>{g.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Reviews */}
        <section className="section section--dark" aria-labelledby="reviews-title">
          <div className="wrap">
            <div className="head" data-reveal>
              <h2 id="reviews-title" className="h2">
                What buyers say
              </h2>
            </div>
            <div data-reveal>
              <Reviews items={REVIEWS} />
            </div>
          </div>
        </section>

        {/* Buying guide (long-form SEO content) */}
        <section className="section section--alt" id="guide" aria-labelledby="guide-title">
          <div className="wrap guide">
            <aside className="guide__toc" data-reveal>
              <h2 id="guide-title" className="h2">
                How to buy guest posts that work
              </h2>
              <p>A short guide for marketers, founders and agencies, based on the {availableSites} sites listed here</p>
              <nav aria-label="Guide sections">
                <ol>
                  {GUIDE.map((g) => (
                    <li key={g.id}>
                      <a href={`#${g.id}`}>{g.title}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
            <div className="guide__body">
              {GUIDE.map((g) => (
                <article key={g.id} id={g.id} className="guide__part" data-reveal>
                  <h3>{g.title}</h3>
                  {g.body.map((p, k) => (
                    <p key={k}>{p}</p>
                  ))}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section" id="faq" aria-labelledby="faq-title">
          <div className="wrap split">
            <div className="split__intro" data-reveal>
              <h2 id="faq-title" className="h2">
                Before you order
              </h2>
              <p>
                Something else? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
              </p>
            </div>
            <div className="faq">
              {FAQ.map((f, i) => (
                <details key={f.q} open={i === 0} data-reveal style={{ ["--i" as string]: i }}>
                  <summary>
                    {f.q}
                    <span className="faq__icon" aria-hidden="true" />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="close" aria-labelledby="close-title">
          <div className="wrap">
            <div className="close__box" data-reveal>
              <div className="hero__glow" aria-hidden="true">
                <span />
                <span />
              </div>
              <div className="close__grid">
                <div>
                  <h2 id="close-title" className="close__title">
                    Most posts go live in 5 to 10 business days
                  </h2>
                  <form className="search" action="/media-store/" method="get" role="search">
                    <label htmlFor="q" className="visually-hidden">
                      Search publishers
                    </label>
                    <input id="q" name="s" type="search" placeholder="Search a niche or domain" autoComplete="off" />
                    <button className="btn btn--cta magnetic" type="submit">
                      <span>Search {availableSites} sites</span>
                      <Arrow />
                    </button>
                  </form>
                </div>
                <div className="close__pub">
                  <h3>Own a site with real readers?</h3>
                  <p>Set your price, accept the articles you want, get paid when each post goes live.</p>
                  <a className="btn btn--line" href="/my-account/?register=publisher">
                    <span>List your site</span>
                    <Arrow />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer__top">
            <BrandLogo height={40} />
            <p>
              Guest post marketplace with {availableSites} vetted publishers. Real organic traffic, every price upfront,
              payment only when your post is live.
            </p>
            <a className="btn btn--cta magnetic" href="#order">
              <span>Order a post</span>
              <Arrow />
            </a>
          </div>

          <div className="footer__cols">
            {FOOTER_COLS.map((col) => (
              <nav key={col.title} aria-label={col.title} className="footer__col">
                <h2>{col.title}</h2>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="footer__meta">
            <p>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
            <ul className="footer__data" aria-label="Data for tools and AI agents">
              {DATA_LINKS.map((d) => (
                <li key={d.href}>
                  <a href={d.href}>{d.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__base">
            <p>© 2026 Guest Post Live</p>
            <ul className="footer__social">
              {SITE.sameAs.map((u, i) => (
                <li key={u}>
                  <a href={u} rel="me">
                    {["LinkedIn", "Facebook", "X", "Instagram", "TikTok"][i]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>

    </>
  );
}
