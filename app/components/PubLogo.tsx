import Image from "next/image";

/** Publisher logo on a white tile. Falls back to the domain's first letter when the store has no logo. */
export function PubLogo({ src, domain, w = 64, h = 40 }: { src: string; domain: string; w?: number; h?: number }) {
  return (
    <span className="publogo" style={{ width: w, height: h }}>
      {src ? (
        <Image src={src} alt={`${domain} logo`} width={w} height={h} loading="lazy" />
      ) : (
        <span className="publogo__letter" aria-hidden="true">
          {domain[0]}
        </span>
      )}
    </span>
  );
}
