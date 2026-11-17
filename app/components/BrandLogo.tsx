import Image from "next/image";
import Link from "next/link";
import logo from "@/public/brand/gpl-logo.png";
import { SITE } from "@/lib/content";

/** The GPL Media wordmark from the live site, recoloured white + green for dark backgrounds. */
export function BrandLogo({ height = 34, priority = false }: { height?: number; priority?: boolean }) {
  return (
    <Link className="brand" href="/" aria-label={`${SITE.name} home`}>
      <Image
        src={logo}
        alt={`${SITE.name} (GPL Media)`}
        height={height}
        style={{ width: "auto", height }}
        priority={priority}
      />
    </Link>
  );
}
