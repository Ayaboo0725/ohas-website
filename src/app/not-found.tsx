import Link from "next/link";
import { settings, telHref } from "@/lib/content";

export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center bg-flour px-[var(--gutter)] text-center">
      <div>
        <p className="eyebrow">Page not found</p>
        <h1 className="h-section mt-6">This one isn&apos;t on the counter.</h1>
        <p className="lede mx-auto mt-6 max-w-md">The page you were looking for doesn&apos;t exist. Head back to the bakery.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn">
            Back to OHAS
          </Link>
          <a href={telHref} className="btn btn-ghost">
            Call {settings.phone.display}
          </a>
        </div>
      </div>
    </main>
  );
}
