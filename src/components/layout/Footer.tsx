import { NAV, fullAddress, settings, telHref } from "@/lib/content";
import { Hours } from "@/components/layout/Hours";
import { Wordmark } from "@/components/layout/Wordmark";
import { ArrowIcon, FacebookIcon, InstagramIcon, PhoneIcon, PinIcon } from "@/components/ui/Icons";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-espresso text-flour">
      {/* Contact */}
      <section id="contact" aria-labelledby="contact-title" className="relative px-[var(--gutter)] pb-20 pt-28 md:pt-40">
        <div className="mx-auto max-w-[1600px]">
          <p className="eyebrow !text-butter" data-reveal>
            Contact
          </p>
          <h2 id="contact-title" className="h-section mt-6 max-w-[14ch]" data-split>
            See you on Beach Road.
          </h2>

          <div className="mt-14 grid gap-12 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-7" data-reveal>
              <p className="text-sm uppercase tracking-[0.2em] text-flour/60">Call OHAS</p>
              <a
                href={telHref}
                className="group mt-3 inline-flex items-baseline gap-4 font-display text-[clamp(2.6rem,7vw,6.5rem)] leading-none tracking-[-0.02em] transition-colors hover:text-butter"
              >
                {settings.phone.display}
                <ArrowIcon size={36} className="hidden translate-y-[-0.1em] opacity-60 transition-transform group-hover:translate-x-2 md:block" />
              </a>
              <p className="mt-6 max-w-md text-flour/70">
                For cake orders and questions, call us or send a message on Facebook.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={telHref} className="btn btn-light">
                  <PhoneIcon /> Call OHAS
                </a>
                <a href={settings.links.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
                  <FacebookIcon /> Message us on Facebook
                </a>
              </div>
            </div>

            <div className="grid gap-10 md:col-span-5 md:pl-10" data-stagger>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-flour/60">Find us</p>
                <address className="mt-3 not-italic leading-relaxed">
                  {settings.address.line1}
                  <br />
                  {settings.address.locality}, {settings.address.island}, {settings.address.region} {settings.address.postalCode}
                </address>
                <a
                  href={settings.links.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline mt-3 inline-flex items-center gap-2 font-semibold text-butter"
                >
                  <PinIcon /> Get directions
                </a>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-flour/60">Hours</p>
                <div className="mt-3">
                  <Hours tone="light" showStatus={false} />
                </div>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-flour/60">Follow</p>
                <ul className="mt-3 flex gap-3">
                  <li>
                    <a
                      href={settings.links.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="OHAS on Facebook (opens in a new tab)"
                      className="grid h-12 w-12 place-items-center rounded-full ring-1 ring-flour/30 transition hover:bg-flour hover:text-espresso"
                    >
                      <FacebookIcon />
                    </a>
                  </li>
                  <li>
                    <a
                      href={settings.links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`OHAS on Instagram, ${settings.links.instagramHandle} (opens in a new tab)`}
                      className="grid h-12 w-12 place-items-center rounded-full ring-1 ring-flour/30 transition hover:bg-flour hover:text-espresso"
                    >
                      <InstagramIcon />
                    </a>
                  </li>
                  <li className="self-center pl-1 text-flour/70">{settings.links.instagramHandle}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer proper */}
      <div className="relative px-[var(--gutter)] pb-28 lg:pb-10">
        <div className="mx-auto max-w-[1600px] border-t border-flour/15 pt-10">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              {/* OHAS emblem, lifted from OHAS's own logo card — replace with the vector file when supplied */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/emblem-light.webp"
                alt="OHAS Boulangerie & Café emblem"
                width={420}
                height={484}
                loading="lazy"
                decoding="async"
                className="mb-6 h-auto w-[112px]"
              />
              <Wordmark light />
              <p className="mt-5 font-display text-3xl italic text-butter">{settings.brandLine}</p>
            </div>
            <nav aria-label="Footer" className="md:col-span-3">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-flour/80">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} className="link-underline py-1">
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="text-sm leading-relaxed text-flour/80 md:col-span-5 md:text-right">
              <p>{fullAddress}</p>
              <p className="mt-1">{settings.address.landmarks}</p>
              <p className="mt-1">
                <a href={telHref} className="link-underline">
                  {settings.phone.display}
                </a>
              </p>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none mt-14 select-none text-center font-display text-[30vw] leading-[0.72] tracking-[-0.03em] text-flour/[0.06]"
          >
            OHAS
          </div>

          <div className="mt-6 flex flex-col justify-between gap-3 text-xs text-flour/55 md:flex-row">
            <p>
              © {year} {settings.name}
            </p>
            <p>French-style bakery &amp; café · Garapan, Saipan</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
