"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { confirmedPrices, formatDate, formatPrice, menu, type MenuItem, type Price } from "@/lib/content";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Media } from "@/components/ui/Media";
import { Pending, useReview } from "@/lib/review";

export const MENU_TAB_EVENT = "ohas:menu-tab";

const STEAMY = new Set(["breads", "pastries"]);

export function Menu() {
  const review = useReview();
  const [active, setActive] = useState(menu.categories[0].id);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // Other sections can open a tab (e.g. "Find it on the menu")
  useEffect(() => {
    const onTab = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (menu.categories.some((c) => c.id === id)) setActive(id);
    };
    window.addEventListener(MENU_TAB_EVENT, onTab);
    return () => window.removeEventListener(MENU_TAB_EVENT, onTab);
  }, []);

  // Animate the panel in on change
  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      if (prefersReducedMotion()) return;
      const panel = panels.current?.querySelector(`[data-panel="${active}"]`);
      if (!panel) return;
      gsap.from(panel.querySelectorAll("[data-anim]"), {
        y: 26,
        autoAlpha: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.06,
      });
    },
    { dependencies: [active], scope: panels },
  );

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = menu.categories.length;
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % n;
    if (e.key === "ArrowLeft") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next >= 0) {
      e.preventDefault();
      setActive(menu.categories[next].id);
      tabs.current[next]?.focus();
      tabs.current[next]?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    }
  };

  return (
    <section id="menu" aria-labelledby="menu-title" className="relative bg-flour px-[var(--gutter)] py-28 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow" data-reveal>
              Menu
            </p>
            <h2 id="menu-title" className="h-section mt-6" data-split>
              See what&apos;s fresh.
            </h2>
          </div>
          <p className="lede self-end lg:col-span-4 lg:col-start-9" data-reveal="0.1">
            {menu.note}
          </p>
        </div>

        {/* Tabs */}
        <div className="sticky top-[var(--header-h)] z-20 -mx-[var(--gutter)] mt-14 bg-flour/90 px-[var(--gutter)] py-3 backdrop-blur-md">
          <div role="tablist" aria-label="Menu categories" className="no-scrollbar flex gap-2 overflow-x-auto">
            {menu.categories.map((c, i) => {
              const selected = active === c.id;
              return (
                <button
                  key={c.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`tab-${c.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${c.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(c.id)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`relative min-h-[44px] shrink-0 rounded-full px-5 text-sm font-semibold transition-colors duration-300 ${
                    selected ? "bg-espresso text-flour" : "text-espresso/70 ring-1 ring-espresso/15 hover:text-espresso hover:ring-espresso/40"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Panels — all rendered so every item is real, indexable text */}
        <div ref={panels} className="mt-10 md:mt-14">
          {menu.categories.map((c) => {
            const items = menu.items.filter(
              (i) => (i.category === c.id || i.alsoIn?.includes(c.id)) && (i.available || review),
            );
            // Lead with a signature that has a real photo, then any item with a photo
            const feature =
              items.find((i) => i.signature && i.available && i.photo) ??
              items.find((i) => i.available && i.photo) ??
              items.find((i) => i.signature && i.available) ??
              items.find((i) => i.available) ??
              items[0];
            const rest = items.filter((i) => i !== feature);
            return (
              <div
                key={c.id}
                role="tabpanel"
                id={`panel-${c.id}`}
                aria-labelledby={`tab-${c.id}`}
                data-panel={c.id}
                hidden={active !== c.id}
                tabIndex={0}
                className="focus-visible:outline-offset-8"
              >
                <p data-anim className="mb-8 max-w-xl font-display text-2xl italic text-crust md:text-3xl">
                  {c.intro}
                </p>

                {items.length === 0 || !feature ? (
                  <div data-anim className="rounded-[28px] border border-dashed border-espresso/25 p-10 text-center md:p-16">
                    <p className="mx-auto max-w-lg font-display text-3xl">{c.emptyMessage ?? "Ask at the counter for today's selection."}</p>
                  </div>
                ) : (
                  <div className={`grid gap-10 lg:gap-16 ${rest.length ? "lg:grid-cols-12" : ""}`}>
                    <FeatureItem item={feature} steam={STEAMY.has(c.id)} wide={!rest.length} />
                    {rest.length > 0 && (
                      <ul className="lg:col-span-5">
                        {rest.map((item) => (
                          <ListItem key={item.id} item={item} steam={STEAMY.has(c.id)} />
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-16 max-w-2xl text-sm text-mocha" data-reveal>
          Allergies or dietary needs? Please ask our team before you order. Menu items and availability change — the
          counter always has the final word.
        </p>
      </div>
    </section>
  );
}

function Tags({ item }: { item: MenuItem }) {
  return (
    <div className="flex flex-wrap gap-2">
      {item.signature && <Tag className="bg-butter/60 text-espresso">Signature</Tag>}
      {item.todaysBake && <Tag className="bg-avocado text-flour">Today&apos;s bake</Tag>}
      {item.seasonal && <Tag className="bg-ube-soft text-ube">Seasonal{item.season ? ` · ${item.season}` : ""}</Tag>}
      {!item.available && (
        <Pending inline label="Switched off — hidden on live site" />
      )}
    </div>
  );
}

function Tag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${className}`}>
      {children}
    </span>
  );
}

function PriceLine({ prices }: { prices: Price[] }) {
  const live = confirmedPrices(prices);
  return (
    <>
      {live.length > 0 && (
        <p className="text-sm">
          {live.map((p) => (
            <span key={`${p.amount}${p.confirmedOn}`} className="mr-4 inline-block">
              <span className="font-semibold tabular-nums">{formatPrice(p.amount)}</span>
              {p.label && <span className="text-mocha"> · {p.label}</span>}
              <span className="text-xs text-mocha"> (as of {formatDate(p.confirmedOn!)})</span>
            </span>
          ))}
        </p>
      )}
      {prices.length > 0 && live.length === 0 && (
        <Pending inline label="Price pending" className="text-xs text-mocha">
          {prices.map((p) => (
            <span key={`${p.amount}${p.postedOn}`}>
              Posted {formatPrice(p.amount)}
              {p.label ? ` (${p.label})` : ""} on {formatDate(p.postedOn)}
            </span>
          ))}
        </Pending>
      )}
    </>
  );
}

function Allergens({ item }: { item: MenuItem }) {
  if (!item.allergens.notes.length) return null;
  if (item.allergens.confirmed) {
    return <p className="text-xs font-medium text-mocha">{item.allergens.notes.join(" · ")}</p>;
  }
  return (
    <Pending inline label="Allergen note pending" className="text-xs text-mocha">
      <span>{item.allergens.notes.join(" · ")}</span>
    </Pending>
  );
}

function FeatureItem({ item, steam, wide }: { item: MenuItem; steam: boolean; wide: boolean }) {
  return (
    <article data-anim className={`${wide ? "grid gap-8 md:grid-cols-2 md:items-end" : "lg:col-span-7"} ${item.available ? "" : "opacity-60"}`}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[28px]">
        <Media
          art={item.art}
          tone={item.tone}
          alt={item.name}
          photo={item.photo}
          brief={item.photoBrief}
          steam={steam}
          className="absolute inset-0"
        />
      </div>
      <div className={wide ? "" : "mt-7"}>
        <Tags item={item} />
        <h3 className="mt-4 font-display text-[clamp(2.4rem,4.2vw,4rem)] leading-[0.98] tracking-[-0.02em]">{item.name}</h3>
        {item.description && <p className="mt-4 max-w-xl text-lg leading-relaxed text-mocha">{item.description}</p>}
        <div className="mt-4 grid gap-2">
          <PriceLine prices={item.prices} />
          <Allergens item={item} />
        </div>
        {item.link && (
          <a href={item.link} className="btn btn-ghost mt-6">
            Order a cake
          </a>
        )}
      </div>
    </article>
  );
}

function ListItem({ item, steam }: { item: MenuItem; steam: boolean }) {
  return (
    <li
      data-anim
      className={`grid gap-5 border-t border-espresso/12 py-6 first:border-t-0 first:pt-0 ${
        item.photo ? "grid-cols-[76px_1fr]" : "grid-cols-1 sm:pl-[96px]"
      } ${item.available ? "" : "opacity-60"}`}
    >
      {/* Only real photos get a thumbnail; items without one read as a plain menu line */}
      {item.photo && (
        <div className="relative aspect-square overflow-hidden rounded-2xl">
          <Media art={item.art} tone={item.tone} alt={item.name} photo={item.photo} steam={steam} compact className="absolute inset-0" />
        </div>
      )}
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="font-display text-[1.75rem] leading-tight">{item.name}</h3>
        </div>
        {item.description && <p className="mt-1 leading-relaxed text-mocha">{item.description}</p>}
        <div className="mt-3 grid gap-2">
          <Tags item={item} />
          <PriceLine prices={item.prices} />
          <Allergens item={item} />
        </div>
      </div>
    </li>
  );
}
