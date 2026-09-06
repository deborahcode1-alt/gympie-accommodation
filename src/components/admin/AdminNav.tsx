"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/account", label: "Account" },
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
    <header className="bg-header-bg text-header-fg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <span className="text-lg font-semibold tracking-wide">Host Admin</span>
          <nav className="flex items-center gap-5 text-sm">
            {links.map((link) => {
              const active =
                link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    active
                      ? "font-medium text-header-fg"
                      : "text-header-fg/70 transition hover:text-header-fg"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={logout}
          className="text-sm text-header-fg/70 transition hover:text-header-fg"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
