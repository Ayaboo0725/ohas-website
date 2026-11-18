"use client";

import { useEffect, useRef, useState } from "react";
import { NAV, settings, telHref } from "@/lib/content";
import { getLenis } from "@/components/motion/SmoothScroll";
import { Wordmark } from "@/components/layout/Wordmark";
import { PhoneIcon } from "@/components/ui/Icons";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#top");
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Solid background once the page moves
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section in view
  useEffect(() => {
    const sections = NAV.map((n) => document.querySelector(n.href)).filter(Boolean) as Element[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Mobile menu: lock scroll, Esc to close, keep focus inside
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const btn = menuBtn.current;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const f = Array.from(panel.current.querySelectorAll<HTMLElement>("a, button"));
        const firstEl = f[0];
        const lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
      btn?.focus({ preventScroll: true });
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ${
          solid
            ? "bg-flour/85 shadow-[0_1px_0_rgba(42,26,18,0.08)] backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[var(--header-h)] max-w-[1600px] items-center justify-between gap-6 px-[var(--gutter)]">
          <a href="#top" aria-label="OHAS Boulangerie & Café — back to top" className="relative z-10 shrink-0">
            <Wordmark />
          </a>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-6 xl:gap-8">
              {NAV.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    aria-current={active === n.href ? "true" : undefined}
                    className="link-underline py-2 text-[0.88rem] font-medium tracking-[0.01em] text-espresso/80 transition-colors hover:text-espresso aria-[current=true]:text-espresso"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-2">
            <a href={telHref} className="btn btn-ghost hidden !min-h-[44px] !px-5 text-sm lg:inline-flex">
              <PhoneIcon />
              <span className="hidden xl:inline">{settings.phone.display}</span>
              <span className="xl:hidden">Call</span>
            </a>
            <button
              ref={menuBtn}
              type="button"
              className="group flex h-11 items-center gap-3 rounded-full pl-4 pr-3 text-sm font-semibold lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span className="relative block h-3 w-6" aria-hidden="true">
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-6 bg-espresso transition-transform duration-500 ${
                    open ? "translate-y-[5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] w-6 bg-espresso transition-transform duration-500 ${
                    open ? "-translate-y-[5px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile / tablet menu */}
      <div
        id="mobile-menu"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={`fixed inset-0 z-40 flex flex-col bg-cream px-[var(--gutter)] pb-8 pt-[calc(var(--header-h)+24px)] transition-[clip-path,visibility] duration-700 ease-[var(--ease-quint)] lg:hidden ${
          open ? "visible [clip-path:inset(0_0_0_0)]" : "invisible [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <nav aria-label="Mobile" className="flex-1 overflow-y-auto">
          <ul className="flex flex-col">
            {NAV.map((n, i) => (
              <li key={n.href} className="border-b border-espresso/10">
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  style={{ transitionDelay: open ? `${120 + i * 45}ms` : "0ms" }}
                  className={`flex min-h-[60px] items-center justify-between py-2 font-display text-[2.4rem] leading-none transition-[opacity,transform] duration-700 ease-[var(--ease-expo)] ${
                    open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                >
                  {n.label}
                  <span className="text-base text-crust" aria-hidden="true">
                    0{i + 1}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6 grid gap-3 text-sm">
          <a href={telHref} tabIndex={open ? 0 : -1} className="btn w-full">
            <PhoneIcon /> Call {settings.phone.display}
          </a>
          <div className="flex justify-between pt-2 text-mocha">
            <span>
              {settings.address.line1}, {settings.address.locality}
            </span>
          </div>
          <div className="flex gap-5 font-semibold">
            <a href={settings.links.facebook} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className="link-underline">
              Facebook
            </a>
            <a href={settings.links.instagram} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className="link-underline">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
