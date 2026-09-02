import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/#listings" className="hover:underline">
            Stays
          </Link>
          <Link href="/#contact" className="hover:underline">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
