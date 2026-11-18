import { Illustration } from "@/components/art/Illustration";
import type { Photo, Tone } from "@/lib/content";

interface MediaProps {
  art: string;
  tone: Tone;
  alt: string;
  photo?: Photo | null;
  brief?: string;
  className?: string;
  /** Show rising steam on hover (fresh bakes). */
  steam?: boolean;
  /** Hide the small "Placeholder" flag (only for tiny thumbnails that sit beside a flagged image). */
  compact?: boolean;
  /** Circular frame: centre the label so the mask never hides it. */
  round?: boolean;
  /** Pass-through data attributes for motion hooks. */
  innerProps?: Record<string, string>;
}

/**
 * A real OHAS photo when one is supplied in the data files, otherwise a
 * clearly labelled, art-directed placeholder carrying the shot brief.
 */
export function Media({ art, tone, alt, photo, brief, className = "", steam, compact, round, innerProps }: MediaProps) {
  if (photo) {
    return (
      <div
        className={`${/\b(absolute|fixed)\b/.test(className) ? "" : "relative"} overflow-hidden bg-cream ${steam ? "steamable" : ""} ${className}`}
        style={photo.bg ? { background: photo.bg } : undefined}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static export: pre-sized WebP/AVIF supplied by OHAS */}
        <img
          src={photo.src}
          alt={photo.alt ?? alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          className="ph-photo"
          style={{
            objectFit: photo.fit ?? "cover",
            objectPosition: photo.position ?? "50% 50%",
            padding: photo.fit === "contain" ? "6%" : undefined,
          }}
          {...innerProps}
        />
        {steam && <Steam />}
      </div>
    );
  }

  return (
    <div
      className={`ph ${steam ? "steamable" : ""} ${className}`}
      data-tone={tone}
      role="img"
      aria-label={`Placeholder for a photo: ${alt}`}
    >
      <div className="ph-art" {...innerProps}>
        <Illustration name={art} />
      </div>
      {steam && <Steam />}
      {!compact && (
        <span className={`ph-flag ${round ? "ph-flag-round" : ""}`} aria-hidden="true">
          Placeholder
        </span>
      )}
      {brief && !compact && !round && (
        <span className="ph-brief" aria-hidden="true">
          Shot: {brief}
        </span>
      )}
    </div>
  );
}

function Steam() {
  return (
    <svg className="steam" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d="M32 100 C20 76 44 58 30 30 C24 18 30 8 34 0" />
      <path d="M52 100 C40 74 64 56 50 28 C44 16 50 8 54 0" />
      <path d="M72 100 C60 78 84 60 70 32 C64 20 70 10 74 0" />
    </svg>
  );
}
