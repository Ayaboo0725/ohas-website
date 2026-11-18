"use client";

import { useEffect, useState } from "react";
import { confirmedHours, formatDate, settings, telHref, type DaySchedule } from "@/lib/content";
import { Pending } from "@/lib/review";

/** Hours from settings.json. Hidden until OHAS confirms them. */
export function Hours({ tone = "dark", showStatus = true }: { tone?: "dark" | "light"; showStatus?: boolean }) {
  const lines = confirmedHours();
  const muted = tone === "light" ? "text-flour/70" : "text-mocha";

  return (
    <div>
      {lines ? (
        <>
          {showStatus && <OpenStatus />}
          <dl className="grid gap-1.5">
            {lines.map((l) => (
              <div key={l.days} className="flex justify-between gap-6">
                <dt>{l.days}</dt>
                <dd className="tabular-nums">{l.time}</dd>
              </div>
            ))}
          </dl>
          {settings.hours.confirmedOn && (
            <p className={`mt-2 text-xs ${muted}`}>Confirmed {formatDate(settings.hours.confirmedOn)}</p>
          )}
        </>
      ) : (
        <p className={muted}>
          {settings.hours.unconfirmedMessage}{" "}
          <a href={telHref} className="link-underline font-semibold whitespace-nowrap">
            {settings.phone.display}
          </a>
        </p>
      )}

      {!lines && (
        <Pending label="Hours pending — sources disagree" className="mt-4 text-left text-sm">
          <ul className="grid gap-1 text-espresso">
            {settings.hours.candidates.map((c) => (
              <li key={c.source}>
                <strong className="font-semibold">{c.value}</strong>{" "}
                <span className="text-mocha">— {c.source}</span>
              </li>
            ))}
          </ul>
        </Pending>
      )}
    </div>
  );
}

const DAY_IDX: Record<string, number> = { Su: 0, Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6 };

/** "Open now" in Saipan time — only rendered when hours are confirmed. */
function OpenStatus() {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const compute = () => {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: settings.timeZone,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(new Date());
      const wd = parts.find((p) => p.type === "weekday")?.value.slice(0, 2) ?? "Mo";
      const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
      const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
      const now = h * 60 + m;
      const today = (settings.hours.schedule as DaySchedule[]).find((s) =>
        s.days.some((d) => DAY_IDX[d] === DAY_IDX[wd]),
      );
      if (!today) return setStatus("Closed today");
      const [oh, om] = today.opens.split(":").map(Number);
      const [ch, cm] = today.closes.split(":").map(Number);
      const open = oh * 60 + om;
      const close = ch * 60 + cm;
      if (now >= open && now < close) setStatus("Open now");
      else setStatus("Closed now");
    };
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!status) return null;
  const isOpen = status === "Open now";
  return (
    <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold">
      <span className={`h-2 w-2 rounded-full ${isOpen ? "bg-avocado" : "bg-crust"}`} aria-hidden="true" />
      {status} <span className="font-normal opacity-70">· Saipan time</span>
    </p>
  );
}
