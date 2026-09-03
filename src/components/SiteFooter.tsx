import { SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-header-bg py-8 text-center text-sm text-header-fg/70">
      <p>&copy; {new Date().getFullYear()} {SITE_NAME}. Direct booking, no platform fees.</p>
    </footer>
  );
}
