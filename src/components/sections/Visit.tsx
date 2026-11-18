import { activeServices, settings, telHref } from "@/lib/content";
import { Hours } from "@/components/layout/Hours";
import { MapEmbed } from "@/components/sections/MapEmbed";
import { SpaceList } from "@/components/sections/SpaceList";
import { ArrowIcon, ClockIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";

export function Visit() {
  const services = activeServices();
  const { sisterLocation } = settings.story;

  return (
    <section id="visit" aria-labelledby="visit-title" className="relative bg-flour px-[var(--gutter)] py-28 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <p className="eyebrow" data-reveal>
          Visit us
        </p>
        <div className="mt-6 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 id="visit-title" className="h-section" data-split>
              Corner of Beach Road <span className="italic text-crust">&amp; Orchid Street.</span>
            </h2>
            <address className="mt-8 not-italic" data-reveal>
              <p className="text-lg">
                {settings.address.locality}, {settings.address.island}, {settings.address.region} {settings.address.postalCode}
              </p>
              <p className="mt-1 text-mocha">{settings.address.landmarks}.</p>
            </address>

            <div className="mt-8 flex flex-wrap gap-3" data-reveal="0.1">
              <a href={settings.links.googleMaps} target="_blank" rel="noopener noreferrer" className="btn">
                <PinIcon /> Get Directions <ArrowIcon />
              </a>
              <a href={telHref} className="btn btn-ghost">
                <PhoneIcon /> {settings.phone.display}
              </a>
            </div>

            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" data-stagger>
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-crust">
                  <ClockIcon /> Hours
                </h3>
                <div className="mt-4">
                  <Hours />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-crust">The space</h3>
                <div className="mt-4">
                  <SpaceList />
                </div>
              </div>
            </div>

            {services.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-3">
                {services.map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    {s.label}
                  </a>
                ))}
              </div>
            )}

            {sisterLocation.enabled && (
              <p className="mt-10 text-sm text-mocha">
                Also: {sisterLocation.name}, {sisterLocation.area}.
              </p>
            )}
          </div>

          <div className="lg:col-span-7" data-reveal="0.1">
            <MapEmbed />
          </div>
        </div>
      </div>
    </section>
  );
}
