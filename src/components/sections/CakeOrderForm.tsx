"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { cakes, settings, telHref } from "@/lib/content";
import { FacebookIcon, PhoneIcon } from "@/components/ui/Icons";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "ready"; summary: string } | { kind: "error"; message: string };

interface Errors {
  name?: string;
  phone?: string;
  date?: string;
}

const MESSAGE_MAX = 40;
const NOTES_MAX = 300;

/** Today's date in Saipan, as YYYY-MM-DD, for the date picker minimum. */
function saipanToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: settings.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  return parts; // en-CA formats as YYYY-MM-DD
}

const cakeOptions = [
  ...cakes.collections.filter((c) => c.current).flatMap((c) => c.cakes.map((k) => `${k.name} (${k.kind})`)),
  "A celebration cake — please advise",
  "Not sure yet",
];

/**
 * Cake order REQUEST. Without an endpoint configured, nothing is sent:
 * the form prepares a summary for the customer to call or message OHAS.
 * With settings.cakeOrderForm.endpoint set, the request is POSTed as JSON.
 * No payment, no sensitive data.
 */
export function CakeOrderForm() {
  const endpoint = settings.cakeOrderForm.endpoint.trim();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const startedAt = useRef(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the date depends on the visitor's clock
    setMinDate(saipanToday());
  }, []);

  useEffect(() => {
    if (status.kind === "ready" || status.kind === "sent") summaryRef.current?.focus();
  }, [status.kind]);

  const validate = (fd: FormData): Errors => {
    const e: Errors = {};
    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const date = String(fd.get("date") ?? "");
    if (name.length < 2) e.name = "Please enter your name.";
    if (!/^[+()\d\s-]{7,20}$/.test(phone)) e.phone = "Please enter a phone number we can call back.";
    if (!date) e.date = "Please choose the date you need the cake.";
    else if (minDate && date < minDate) e.date = "Please choose today or a later date.";
    return e;
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);

    // Spam traps: hidden honeypot field and an impossibly fast submit
    if (String(fd.get("company") ?? "") !== "" || Date.now() - startedAt.current < 2500) {
      setStatus({ kind: "error", message: "Something went wrong. Please call us instead." });
      return;
    }

    const e = validate(fd);
    setErrors(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    const data = {
      name: String(fd.get("name")).trim(),
      phone: String(fd.get("phone")).trim(),
      date: String(fd.get("date")),
      cake: String(fd.get("cake")),
      size: String(fd.get("size")),
      messageOnCake: String(fd.get("message") ?? "").trim(),
      notes: String(fd.get("notes") ?? "").trim(),
    };

    if (endpoint) {
      setStatus({ kind: "sending" });
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...data, source: "ohas-website-cake-request" }),
        });
        if (!res.ok) throw new Error(String(res.status));
        setStatus({ kind: "sent" });
        form.reset();
        setMessage("");
      } catch {
        setStatus({ kind: "error", message: "We couldn't send your request. Please call us — we'd be glad to help." });
      }
      return;
    }

    const summary = [
      `Cake order request for OHAS`,
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Date needed: ${data.date}`,
      `Cake: ${data.cake}`,
      `Size: ${data.size}`,
      data.messageOnCake ? `Message on cake: "${data.messageOnCake}"` : null,
      data.notes ? `Notes: ${data.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    setStatus({ kind: "ready", summary });
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const errList = Object.entries(errors).filter(([, v]) => v);

  return (
    <div className="grid gap-10 rounded-[32px] bg-espresso p-6 text-flour md:p-12 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-4">
        <p className="eyebrow !text-butter">Cake order request</p>
        <h3 className="mt-4 font-display text-[clamp(2.2rem,3.6vw,3.4rem)] leading-[1]">Plan your cake.</h3>
        <p className="mt-5 text-flour/75">
          {endpoint
            ? "Send us the details and OHAS will call you back to confirm."
            : "Fill in the details and we'll put your request together, ready to read out on the phone or paste into a message."}
        </p>
        <p className="mt-6 rounded-2xl bg-flour/10 p-4 text-sm leading-relaxed text-flour/85">
          <strong className="text-butter">This is a request, not an order.</strong>{" "}
          {endpoint
            ? "Your cake is confirmed only when OHAS calls you back."
            : "Your cake is confirmed only once you've spoken with OHAS and they've confirmed it."}{" "}
          No payment is taken online.
        </p>
      </div>

      <div className="lg:col-span-8">
        {status.kind === "ready" || status.kind === "sent" ? (
          <div ref={summaryRef} tabIndex={-1} className="rounded-[24px] bg-flour p-6 text-espresso outline-none md:p-8" aria-live="polite">
            {status.kind === "sent" ? (
              <>
                <p className="font-display text-3xl">Request sent — thank you.</p>
                <p className="mt-3 text-mocha">OHAS will call you back to confirm. Your order is confirmed only then.</p>
                <button type="button" className="btn btn-ghost mt-6" onClick={() => setStatus({ kind: "idle" })}>
                  Send another request
                </button>
              </>
            ) : (
              <>
                <p className="font-display text-3xl">Your request is ready.</p>
                <p className="mt-2 text-mocha">
                  Nothing has been sent yet. Call OHAS, or copy it and send it as a Facebook message.
                </p>
                <pre className="mt-5 whitespace-pre-wrap rounded-2xl bg-cream p-5 font-sans text-sm leading-relaxed">{status.summary}</pre>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={telHref} className="btn">
                    <PhoneIcon /> Call {settings.phone.display}
                  </a>
                  <button type="button" className="btn btn-ghost" onClick={() => copy(status.summary)}>
                    {copied ? "Copied" : "Copy request"}
                  </button>
                  <a href={settings.links.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    <FacebookIcon /> Open Facebook
                  </a>
                </div>
                <span className="sr-only" aria-live="polite">
                  {copied ? "Request copied to clipboard" : ""}
                </span>
                <button type="button" className="link-underline mt-6 text-sm font-semibold" onClick={() => setStatus({ kind: "idle" })}>
                  Edit request
                </button>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="grid gap-5 md:grid-cols-2">
            {errList.length > 0 && (
              <div ref={errorRef} tabIndex={-1} role="alert" className="rounded-2xl bg-[#c8475e]/20 p-4 text-sm md:col-span-2">
                <p className="font-semibold">Please check {errList.length === 1 ? "one thing" : "a few things"}:</p>
                <ul className="mt-1 list-disc pl-5">
                  {errList.map(([k, v]) => (
                    <li key={k}>
                      <a href={`#cake-${k}`} className="underline" onClick={(e) => { e.preventDefault(); document.getElementById(`cake-${k}`)?.focus(); }}>
                        {v}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Field id="cake-name" label="Your name" error={errors.name}>
              <input id="cake-name" name="name" autoComplete="name" required maxLength={80} aria-invalid={!!errors.name} aria-describedby={errors.name ? "cake-name-err" : undefined} className={inputCls} />
            </Field>
            <Field id="cake-phone" label="Phone" error={errors.phone}>
              <input id="cake-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={20} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "cake-phone-err" : undefined} className={inputCls} />
            </Field>
            <Field id="cake-date" label="Date needed" error={errors.date}>
              <input id="cake-date" name="date" type="date" required min={minDate} aria-invalid={!!errors.date} aria-describedby={errors.date ? "cake-date-err" : undefined} className={`${inputCls} [color-scheme:dark]`} />
            </Field>
            <Field id="cake-cake" label="Cake">
              <select id="cake-cake" name="cake" className={inputCls} defaultValue={cakeOptions[0]}>
                {cakeOptions.map((o) => (
                  <option key={o} value={o} className="text-espresso">
                    {o}
                  </option>
                ))}
              </select>
            </Field>

            <fieldset className="md:col-span-2">
              <legend className="mb-2 text-sm font-semibold text-flour/80">Size</legend>
              <div className="flex flex-wrap gap-2">
                {[...cakes.sizes.map((s) => `${s.display}${s.shape === "square" ? " (premium cakes)" : ""}`), "Not sure"].map((label, i) => (
                  <label key={label} className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full px-4 ring-1 ring-flour/25 has-[:checked]:bg-flour has-[:checked]:text-espresso">
                    <input type="radio" name="size" value={label} defaultChecked={i === 0} className="accent-[#8f511c]" />
                    <span className="text-sm font-medium">{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <Field id="cake-message" label="Message on the cake (optional)" hint={`${message.length}/${MESSAGE_MAX}`}>
              <input id="cake-message" name="message" maxLength={MESSAGE_MAX} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Happy Birthday!" className={inputCls} />
            </Field>
            <Field id="cake-notes" label="Anything else? (optional)">
              <input id="cake-notes" name="notes" maxLength={NOTES_MAX} className={inputCls} />
            </Field>

            {/* Honeypot — hidden from people, tempting to bots */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="cake-company">Company</label>
              <input id="cake-company" name="company" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex flex-wrap items-center gap-4 md:col-span-2">
              <button type="submit" className="btn btn-light" disabled={status.kind === "sending"}>
                {status.kind === "sending" ? "Sending…" : endpoint ? "Send request" : "Prepare my request"}
              </button>
              <p className="text-xs text-flour/60">We only use these details to arrange your cake.</p>
            </div>
            {status.kind === "error" && (
              <p role="alert" className="text-sm text-butter md:col-span-2">
                {status.message}{" "}
                <a href={telHref} className="underline">
                  {settings.phone.display}
                </a>
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "min-h-[52px] w-full rounded-2xl bg-flour/10 px-4 text-flour placeholder:text-flour/35 ring-1 ring-flour/20 transition focus:bg-flour/15 focus:outline-none focus:ring-2 focus:ring-butter aria-[invalid=true]:ring-[#e8899a]";

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-flour/80">
          {label}
        </label>
        {hint && <span className="text-xs text-flour/50">{hint}</span>}
      </div>
      {children}
      {error && (
        <p id={`${id}-err`} className="text-sm text-[#f3b0bc]">
          {error}
        </p>
      )}
    </div>
  );
}
