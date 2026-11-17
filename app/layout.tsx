import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { SITE } from "@/lib/content";
import "./globals.css";

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const title = "Buy Guest Posts on Sites With Real Traffic | Guest Post Live";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title,
  description: SITE.description,
  applicationName: SITE.name,
  alternates: {
    canonical: "/",
    types: { "application/json": "/data/listings.json", "text/plain": "/llms.txt" },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title,
    description: SITE.description,
    locale: "en_US",
    images: [
      {
        url: "/wp-content/uploads/2026/05/gpl-og-image.png",
        width: 1200,
        height: 630,
        alt: "Guest Post Live: guest post marketplace with verified traffic",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@GuestPostLive",
    title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

// Marks the document as JS-capable before paint, so scroll-reveal styles only
// hide content when the script that reveals it will actually run.
const jsFlag = "document.documentElement.classList.add('js')";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={sans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
