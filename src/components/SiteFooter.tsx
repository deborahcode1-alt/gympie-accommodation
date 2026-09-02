import { SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-black/10 py-8 text-center text-sm text-black/60 dark:border-white/10 dark:text-white/60">
      <p>&copy; {new Date().getFullYear()} {SITE_NAME}. Direct booking, no platform fees.</p>
    </footer>
  );
}
