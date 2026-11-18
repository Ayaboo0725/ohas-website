import { settings, telHref } from "@/lib/content";
import { PhoneIcon, PinIcon } from "@/components/ui/Icons";

/** Persistent call + directions bar on phones and small tablets. */
export function MobileCallBar() {
  return (
    <div
      className="intro fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 lg:hidden"
      style={{ ["--d" as string]: "0.9s" }}
    >
      <div className="flex gap-2 rounded-full bg-flour/90 p-1.5 shadow-[0_10px_40px_-10px_rgba(42,26,18,0.45)] ring-1 ring-espresso/10 backdrop-blur-md">
        <a href={telHref} className="btn flex-1 !min-h-[50px]" aria-label={`Call OHAS at ${settings.phone.display}`}>
          <PhoneIcon /> Call OHAS
        </a>
        <a
          href={settings.links.googleMaps}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost !min-h-[50px] !px-5"
          aria-label="Get directions to OHAS on Google Maps (opens in a new tab)"
        >
          <PinIcon /> Directions
        </a>
      </div>
    </div>
  );
}
