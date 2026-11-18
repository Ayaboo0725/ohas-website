"use client";

import { settings } from "@/lib/content";
import { Pending } from "@/lib/review";

/** Building facts; unconfirmed amenities (Wi-Fi, parking…) only appear in review mode. */
export function SpaceList() {
  const confirmed = settings.space.items.filter((i) => i.confirmed);
  const pending = settings.space.items.filter((i) => !i.confirmed);
  return (
    <>
      <ul className="grid gap-3">
        {confirmed.map((i) => (
          <li key={i.label} className="flex gap-3">
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-crust" aria-hidden="true" />
            <span>
              <span className="font-semibold">{i.label}</span>
              {i.detail && <span className="block text-sm text-mocha">{i.detail}</span>}
            </span>
          </li>
        ))}
      </ul>
      {pending.length > 0 && (
        <Pending label="Amenities to confirm" className="mt-5 text-sm">
          <ul className="grid gap-1">
            {pending.map((i) => (
              <li key={i.label}>
                <span className="font-semibold">{i.label}</span>
                {i.source && <span className="text-mocha"> — {i.source}</span>}
              </li>
            ))}
          </ul>
        </Pending>
      )}
    </>
  );
}
