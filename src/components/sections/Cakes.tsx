"use client";

import { useState } from "react";
import { cakes, confirmedPrices, formatDate, formatPrice, settings, telHref, type Price } from "@/lib/content";
import { Media } from "@/components/ui/Media";
import { FacebookIcon, PhoneIcon } from "@/components/ui/Icons";
import { Pending } from "@/lib/review";
import { CakeOrderForm } from "@/components/sections/CakeOrderForm";

export function Cakes() {
  return (
    <section id="cakes" aria-labelledby="cakes-title" className="relative overflow-hidden bg-flour px-[var(--gutter)] py-28 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        {/* Heading + primary actions */}
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow" data-reveal>
              Cakes &amp; Orders
            </p>
            <h2 id="cakes-title" className="h-section mt-6" data-split>
              A cake for the <span className="italic text-crust">occasion.</span>
            </h2>
          </div>
          <div className="self-end lg:col-span-5" data-reveal="0.1">
            <p className="lede">
              Pre-order a whole cake for a birthday or celebration. Call us, or send us a message on Facebook, and we&apos;ll
              go through the details with you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={telHref} className="btn">
                <PhoneIcon /> Call to Order
              </a>
              <a href={settings.links.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <FacebookIcon /> Message us on Facebook
              </a>
            </div>
          </div>
        </div>

        {/* Sizes + how to order */}
        <div className="mt-20 grid gap-14 md:mt-28 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <SizeExplorer />
          </div>
          <div className="lg:col-span-5">
            <HowToOrder />
          </div>
        </div>

        {/* Seasonal collections */}
        {cakes.collections.map((col) => (
          <div key={col.id} className="mt-24 md:mt-32">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-espresso/12 pb-6">
              <div>
                <p className="eyebrow">{col.label ?? (col.current ? "In the case now" : "Seasonal collections · from a past season")}</p>
                <h3 className="mt-4 font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-none" data-split>
                  {col.title}
                </h3>
              </div>
              <p className="max-w-sm text-sm text-mocha">
                {col.note ??
                  (col.current
                    ? col.season
                    : "OHAS runs seasonal cake collections through the year. Ask what's in the case this season.")}
              </p>
            </div>
            <ul
              className={`no-scrollbar -mx-[var(--gutter)] mt-10 flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-5 overflow-x-auto px-[var(--gutter)] pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 ${
                col.cakes.length > 6 ? "xl:grid-cols-4" : "xl:grid-cols-6"
              }`}
            >
              {col.cakes.map((c, i) => (
                <li key={c.id} className="w-[72vw] shrink-0 snap-start sm:w-[44vw] md:w-auto" data-reveal={String((i % 6) * 0.05)}>
                  <div className="group relative aspect-[3/4] overflow-hidden rounded-[24px]">
                    <Media art={c.art} tone={c.tone} photo={c.photo} alt={`${c.name}, ${c.kind.toLowerCase()}`} className="absolute inset-0 transition-transform duration-1000 group-hover:scale-[1.03]" />
                  </div>
                  <h4 className="mt-4 font-display text-[1.7rem] leading-tight">{c.name}</h4>
                  <p className="text-sm text-mocha">{c.kind}</p>
                  <CakePrice prices={c.prices} />
                </li>
              ))}
            </ul>
            {col.desserts.length > 0 && (
              <p className="mt-6 text-sm text-mocha">
                <span className="font-semibold text-espresso">Also in that collection:</span> {col.desserts.join(" · ")}
              </p>
            )}
          </div>
        ))}

        {settings.cakeOrderForm.enabled && (
          <div className="mt-24 md:mt-32">
            <CakeOrderForm />
          </div>
        )}
      </div>
    </section>
  );
}

function CakePrice({ prices }: { prices: Price[] }) {
  const live = confirmedPrices(prices);
  if (live.length) {
    const p = live[live.length - 1];
    return (
      <p className="mt-1 text-sm">
        <span className="font-semibold">{formatPrice(p.amount)}</span>{" "}
        <span className="text-xs text-mocha">(as of {formatDate(p.confirmedOn!)})</span>
      </p>
    );
  }
  if (!prices.length) return null;
  return (
    <Pending inline label="Price pending" className="mt-2 text-xs text-mocha">
      <span>
        Posted {formatPrice(prices[prices.length - 1].amount)} · {formatDate(prices[prices.length - 1].postedOn)}
      </span>
    </Pending>
  );
}

/* ---------- Sizes, drawn to scale ---------- */

function SizeExplorer() {
  // Sizes as OHAS posts them: regular 8.5 in. round, party 14 × 14 in., and (for some cakes) small 7 in.
  const round = cakes.sizes.find((s) => s.id === "regular")!;
  const square = cakes.sizes.find((s) => s.shape === "square")!;
  const small = cakes.sizes.find((s) => s.id === "small");
  const order = [small, round, square].filter(Boolean) as typeof cakes.sizes;
  const [sel, setSel] = useState<string>(round.id);
  const scale = 20; // px per inch in the drawing
  const sq = square.inches * scale; // 280
  const d = round.inches * scale; // 170
  const ds = small ? small.inches * scale : 0; // 140
  const area = (s: (typeof cakes.sizes)[number]) => (s.shape === "square" ? s.inches ** 2 : Math.PI * (s.inches / 2) ** 2);
  const live = confirmedPrices(cakes.regularPrices);
  const words = ["", "One", "Two", "Three", "Four"];
  const current = order.find((s) => s.id === sel) ?? round;
  const ease = { transition: "all .6s cubic-bezier(.16,1,.3,1)" };
  const on = (id: string) => sel === id;

  return (
    <div className="rounded-[32px] bg-cream p-6 md:p-10" data-reveal>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-display text-3xl md:text-4xl">{words[order.length] ?? order.length} sizes</h3>
        <div role="radiogroup" aria-label="Cake size" className="flex flex-wrap rounded-[22px] bg-flour p-1 ring-1 ring-espresso/10">
          {order.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={on(s.id)}
              onClick={() => setSel(s.id)}
              className={`min-h-[44px] rounded-full px-4 text-sm font-semibold transition-colors ${
                on(s.id) ? "bg-espresso text-flour" : "text-espresso/70 hover:text-espresso"
              }`}
            >
              {s.shape === "square" ? `${s.inches} × ${s.inches} in.` : `${s.inches} in.`}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid items-center gap-8 md:grid-cols-[1.1fr_1fr]">
        <svg
          viewBox={`-30 -30 ${sq + 60} ${sq + 76}`}
          className="mx-auto w-full max-w-[360px]"
          role="img"
          aria-label={`Drawn to scale: ${order.map((s) => s.display).join(", ")}`}
        >
          <rect x="0" y="0" width={sq} height={sq} rx="10" fill="#ecc272" fillOpacity={on(square.id) ? 0.55 : 0} stroke="#2a1a12" strokeOpacity={on(square.id) ? 0.9 : 0.3} strokeWidth="2" strokeDasharray={on(square.id) ? "0" : "6 6"} style={ease} />
          <circle cx={sq / 2} cy={sq / 2} r={d / 2} fill={on(round.id) ? "#ecc272" : "#fbf7f0"} fillOpacity={on(round.id) ? 0.75 : 0.6} stroke="#2a1a12" strokeOpacity={on(round.id) ? 0.9 : 0.35} strokeWidth="2" style={ease} />
          {small && (
            <circle cx={sq / 2} cy={sq / 2} r={ds / 2} fill={on(small.id) ? "#ecc272" : "transparent"} fillOpacity={on(small.id) ? 0.85 : 0} stroke="#2a1a12" strokeOpacity={on(small.id) ? 0.9 : 0.3} strokeWidth="2" strokeDasharray={on(small.id) ? "0" : "5 5"} style={ease} />
          )}
          <g stroke="#8f511c" strokeWidth="1.5" fill="#8f511c" fontSize="15" style={{ fontFamily: "var(--font-dm)", fontWeight: 600 }}>
            <line x1={sq / 2 - (on("small") ? ds : d) / 2} y1={sq / 2} x2={sq / 2 + (on("small") ? ds : d) / 2} y2={sq / 2} strokeDasharray="3 4" style={ease} />
            <text x={sq / 2} y={sq / 2 - 8} textAnchor="middle" stroke="none">
              {on("small") && small ? small.inches : round.inches} in.
            </text>
            <line x1="0" y1={sq + 16} x2={sq} y2={sq + 16} />
            <text x={sq / 2} y={sq + 34} textAnchor="middle" stroke="none" fontSize="14">
              {square.inches} in.
            </text>
            <line x1={sq + 16} y1="0" x2={sq + 16} y2={sq} />
          </g>
        </svg>

        <div aria-live="polite">
          <p className="eyebrow">{current.id === square.id ? "Party size" : current.label}</p>
          <p className="mt-3 font-display text-4xl">{current.display}</p>
          <p className="mt-3 text-mocha">{current.note}</p>
          {current.id === round.id && live.length > 0 && (
            <p className="mt-3 text-sm">
              From <strong>{formatPrice(live[live.length - 1].amount)}</strong>{" "}
              <span className="text-xs text-mocha">(as of {formatDate(live[live.length - 1].confirmedOn!)})</span>
            </p>
          )}
          {current.id === round.id && live.length === 0 && (
            <Pending inline label="Price pending" className="mt-3 text-xs text-mocha">
              <span>Posted {cakes.regularPrices.map((p) => `${formatPrice(p.amount)} (${formatDate(p.postedOn)})`).join(", ")}</span>
            </Pending>
          )}
          {current.id !== round.id && (
            <p className="mt-3 text-sm text-mocha">
              {current.id === square.id
                ? `About ${Math.round((area(square) / area(round)) * 2) / 2}× the top of a regular ${round.inches} in. cake`
                : `About ${Math.round((area(current) / area(round)) * 100)}% of the top of a regular ${round.inches} in. cake`}{" "}
              — drawn to scale.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- How to order ---------- */

function HowToOrder() {
  const o = cakes.ordering;
  const steps = [
    { t: "Choose", d: "Pick a cake and a size — or ask us what's in the case this season." },
    { t: "Call or message", d: `Call ${settings.phone.display}, or message OHAS on Facebook with your date and the message for the cake.` },
    { t: "Confirmed", d: "Your order is set once OHAS has confirmed the details with you." },
  ];
  return (
    <div className="flex h-full flex-col" data-reveal="0.1">
      <h3 className="font-display text-3xl md:text-4xl">How to order</h3>
      <ol className="mt-8 grid gap-0">
        {steps.map((s, i) => (
          <li key={s.t} className="grid grid-cols-[48px_1fr] gap-4 border-t border-espresso/12 py-6">
            <span className="font-display text-3xl leading-none text-crust">{i + 1}</span>
            <div>
              <p className="font-semibold">{s.t}</p>
              <p className="mt-1 text-mocha">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-auto rounded-2xl bg-cream p-5 text-sm">
        {o.confirmed ? (
          <dl className="grid gap-2">
            {o.noticeNeeded && <Row k="Notice" v={o.noticeNeeded} />}
            {o.customMessages && <Row k="Messages & designs" v={o.customMessages} />}
            {o.deposit && <Row k="Deposit" v={o.deposit} />}
            {o.pickupOrDelivery && <Row k="Pickup" v={o.pickupOrDelivery} />}
          </dl>
        ) : (
          <p className="text-mocha">{o.unconfirmedMessage}</p>
        )}
        {!o.confirmed && (
          <Pending label="To confirm with OHAS" className="mt-4">
            {(o.noticeNeeded || o.deposit) && (
              <ul className="mb-2 grid gap-1">
                {o.noticeNeeded && <li>{o.noticeNeeded}</li>}
                {o.deposit && <li>{o.deposit}</li>}
                {o.source && <li className="text-xs text-mocha">Source: {o.source}</li>}
              </ul>
            )}
            <p className="text-mocha">Still to confirm: custom messages or designs · pickup only or delivery.</p>
          </Pending>
        )}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-6">
      <dt className="font-semibold">{k}</dt>
      <dd className="text-right text-mocha">{v}</dd>
    </div>
  );
}
