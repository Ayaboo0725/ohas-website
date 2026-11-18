import { gallery, settings } from "@/lib/content";
import { Media } from "@/components/ui/Media";

const shot = (id: string) => gallery.shots.find((s) => s.id === id)!;

const MARQUEE = [
  "Baked in-house, every day",
  "Breads",
  "Pastries",
  "Cakes",
  "Illy coffee",
  "Natural, low-temperature fermentation",
  "Beach Road & Orchid Street",
];

export function Marquee() {
  const row = [...MARQUEE, ...MARQUEE];
  return (
    <div className="relative overflow-hidden border-y border-espresso/10 bg-cream py-5" aria-hidden="true">
      <div className="marquee">
        {row.map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap font-display text-[1.7rem] italic text-espresso md:text-[2.2rem]">
            <span className="px-8">{t}</span>
            <svg viewBox="0 0 20 20" className="h-3 w-3 text-crust" aria-hidden="true">
              <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Story() {
  const counter = shot("counter");
  const exterior = shot("exterior");
  const { sisterLocation, mentionOperator, operatorName } = settings.story;

  return (
    <section id="story" aria-labelledby="story-title" className="relative overflow-hidden bg-flour px-[var(--gutter)] py-28 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        {/* Name */}
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="eyebrow" data-reveal>
              Our story
            </p>
            <h2 id="story-title" className="h-section mt-6" data-split>
              Boulangerie <span className="italic text-crust">(n.)</span>
              <br />
              French for bakery.
            </h2>
          </div>
          <div className="self-end lg:col-span-4" data-reveal="0.15">
            <p className="lede">
              OHAS is a French-style bakery and café on the corner of Beach Road and Orchid Street in Garapan. Breads,
              pastries and cakes are baked in-house, every day.
            </p>
          </div>
        </div>

        {/* Philosophy + imagery */}
        <div className="mt-20 grid gap-12 md:mt-28 lg:grid-cols-12 lg:gap-8">
          <div className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px]" data-reveal>
              <Media
                art={counter.art}
                tone={counter.tone}
                alt={counter.alt}
                photo={counter.photo}
                brief={counter.brief}
                className="absolute inset-0"
                innerProps={{ "data-scale-in": "" }}
              />
            </div>
            <p className="mt-4 text-sm text-mocha">Fresh bakes at the ground-floor counter.</p>
          </div>

          <div className="flex flex-col justify-between gap-16 lg:col-span-6 lg:col-start-7">
            <div>
              <p className="font-display text-[clamp(3.2rem,8.5vw,8.5rem)] leading-[0.88] tracking-[-0.03em]" data-split>
                French,
                <br />
                <span className="italic text-crust">Fresh,</span>
                <br />
                Fit.
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2" data-stagger>
                <div className="border-t border-espresso/15 pt-5">
                  <p className="font-display text-2xl">{settings.mantra}</p>
                  <p className="mt-2 text-mocha">Every OHAS bread is made using natural, low-temperature fermentation.</p>
                </div>
                <div className="border-t border-espresso/15 pt-5">
                  <p className="font-display text-2xl">Coffee by Illy.</p>
                  <p className="mt-2 text-mocha">Our coffee is made with Illy beans — the classics, plus signatures inspired by the island.</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] lg:-mr-[var(--gutter)] lg:rounded-r-none" data-mask>
              <Media
                art={exterior.art}
                tone={exterior.tone}
                alt={exterior.alt}
                photo={exterior.photo}
                brief={exterior.brief}
                className="absolute inset-0"
              />
            </div>
          </div>
        </div>

        {/* Journey */}
        <div className="mt-28 md:mt-40">
          <p className="eyebrow" data-reveal>
            The journey
          </p>
          <ol className="relative mt-10 grid gap-14 md:grid-cols-2 md:gap-10">
            <span className="absolute left-0 right-0 top-[2.1rem] hidden h-px bg-espresso/15 md:block" aria-hidden="true" />
            <li className="relative" data-reveal>
              <span className="relative z-10 inline-flex items-center gap-3 bg-flour pr-4">
                <span className="h-3 w-3 rounded-full border-2 border-crust bg-flour" aria-hidden="true" />
                <span className="font-display text-[3.4rem] leading-none">2020</span>
              </span>
              <h3 className="mt-6 font-display text-3xl md:text-4xl">It began in a hotel lobby.</h3>
              <p className="mt-3 max-w-md text-mocha">
                The first OHAS café opened in the lobby of Kensington Hotel Saipan, in San Roque. Guests asked for
                something closer.
              </p>
            </li>
            <li className="relative" data-reveal="0.12">
              <span className="relative z-10 inline-flex items-center gap-3 bg-flour pr-4">
                <span className="h-3 w-3 rounded-full bg-crust" aria-hidden="true" />
                <span className="font-display text-[3.4rem] leading-none">2023</span>
              </span>
              <h3 className="mt-6 font-display text-3xl md:text-4xl">A bakery-café in Garapan.</h3>
              <p className="mt-3 max-w-md text-mocha">
                On September 30, 2023, OHAS opened its Garapan bakery-café at the corner of Beach Road and Orchid Street —
                two floors, an upstairs seating area, a terrace and a counter of fresh bakes.
              </p>
            </li>
          </ol>
          {(mentionOperator || sisterLocation.enabled) && (
            <p className="mt-10 max-w-2xl text-sm text-mocha">
              {mentionOperator && <>OHAS is operated by {operatorName}. </>}
              {sisterLocation.enabled && (
                <>
                  Visit our sister café, {sisterLocation.name}, in {sisterLocation.area}.
                </>
              )}
            </p>
          )}
        </div>

        {/* Numbers */}
        <dl className="mt-24 grid grid-cols-2 border-t border-espresso/15 md:mt-32 lg:grid-cols-4" data-stagger>
          {[
            { k: "≈70", v: "baked goods, on rotation" },
            { k: "Daily", v: "breads, pastries & cakes baked in-house" },
            { k: "Illy", v: "the beans behind our coffee" },
            { k: "2", v: "floors on Beach Road" },
          ].map((s) => (
            <div key={s.k} className="border-b border-espresso/15 py-8 pr-4 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0">
              <dt className="sr-only">{s.v}</dt>
              <dd>
                <span className="block font-display text-[clamp(3rem,6vw,5.5rem)] leading-none">{s.k}</span>
                <span className="mt-3 block max-w-[16ch] text-sm text-mocha">{s.v}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
