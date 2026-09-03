import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="bg-header-bg text-header-fg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/#listings" className="text-header-fg/85 transition hover:text-header-fg">
            Stays
          </Link>
          <Link href="/#contact" className="text-header-fg/85 transition hover:text-header-fg">
            Contact
          </Link>
          <Link
            href="/#listings"
            className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold tracking-wide text-white uppercase transition hover:bg-accent-deep"
          >
            Book now
          </Link>
        </nav>
      </div>
    </header>
  );
}
