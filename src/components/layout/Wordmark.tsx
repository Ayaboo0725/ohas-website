/**
 * Type-only wordmark used until OHAS supplies its real logo files.
 * Swap this component's contents for the official SVG logo.
 */
export function Wordmark({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <span className={`flex flex-col leading-none ${light ? "text-flour" : "text-espresso"} ${className}`}>
      <span className="font-display text-[1.95rem] tracking-[0.02em]">OHAS</span>
      <span className="mt-[3px] text-[0.52rem] font-semibold uppercase tracking-[0.34em] opacity-75">
        Boulangerie &amp; Café
      </span>
    </span>
  );
}
