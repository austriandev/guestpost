export function Arrow({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      className="arrow"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
