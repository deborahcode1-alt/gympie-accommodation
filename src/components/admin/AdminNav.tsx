"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/listings", label: "Listings" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="text-lg font-semibold tracking-tight">Host Admin</span>
          <nav className="flex items-center gap-5 text-sm">
            {links.map((link) => {
              const active =
                link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={active ? "font-medium underline" : "text-black/60 hover:underline dark:text-white/60"}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={logout}
          className="text-sm text-black/60 hover:underline dark:text-white/60"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
