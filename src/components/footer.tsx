import * as React from "react";
import { useTranslations } from "next-intl";
import { Phone, Mail, Send, MapPin, Clock } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

// Clean Lucide-compatible Facebook icon
function Facebook({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const tNav = useTranslations("nav");
  const tFooter = useTranslations("footer");
  const tCommon = useTranslations("common");

  const currentYear = new Date().getFullYear();

  const navLinks = [
    { key: "home", href: "/" },
    { key: "menu", href: "/menu" },
    { key: "wholesale", href: "/wholesale" },
    { key: "bakery", href: "/bakery" },
    { key: "promotions", href: "/promotions" },
    { key: "contact", href: "/contact" },
  ] as const;

  return (
    <footer
      className={cn(
        "bg-espresso text-warm-white border-t border-espresso/20 relative z-10",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        {/* Main 4-column Grid: Brand info + 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-warm-white/10">
          {/* Brand Info (2 cols on large screen) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link
              href="/"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden rounded-lg"
              aria-label="NOST Bakery & Pastry"
            >
              <Logo variant="light" width={160} />
            </Link>

            <p className="text-sm text-warm-white/75 leading-relaxed max-w-md pt-2">
              Artisan French breads, fresh croissants, and handcrafted pastries baked fresh daily in Siem Reap. Trusted frozen bakery supplies for hotels, cafés, and restaurants across Cambodia.
            </p>

            <div className="flex items-center gap-2.5 text-xs text-warm-white/70 pt-1">
              <Clock className="h-4 w-4 text-golden shrink-0" aria-hidden="true" />
              <span>Open Daily: 7:00 AM – 8:00 PM</span>
            </div>
          </div>

          {/* Column 1: Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-lg font-semibold tracking-wide text-warm-white">
              {tFooter("quickLinks")}
            </h3>
            <ul className="flex flex-col gap-2 pt-1 text-sm text-warm-white/75">
              {navLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="hover:text-golden hover:translate-x-1 transition-all duration-200 inline-block py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-golden rounded"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Contact Us */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-lg font-semibold tracking-wide text-warm-white">
              {tFooter("contactUs")}
            </h3>
            <ul className="flex flex-col gap-3 pt-1 text-sm text-warm-white/75">
              <li>
                <a
                  href="tel:+85592123456"
                  className="flex items-center gap-2.5 hover:text-golden transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-golden rounded"
                >
                  <Phone className="h-4 w-4 text-golden group-hover:scale-110 transition-transform shrink-0" aria-hidden="true" />
                  <span>+855 (0) 92 123 456</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@nostbakery.com"
                  className="flex items-center gap-2.5 hover:text-golden transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-golden rounded"
                >
                  <Mail className="h-4 w-4 text-golden group-hover:scale-110 transition-transform shrink-0" aria-hidden="true" />
                  <span>info@nostbakery.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/nostbakery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-golden transition-colors group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-golden rounded"
                >
                  <Send className="h-4 w-4 text-golden group-hover:scale-110 transition-transform shrink-0" aria-hidden="true" />
                  <span>{tCommon("telegram")}: @nostbakery</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <MapPin className="h-4 w-4 text-golden shrink-0 mt-1" aria-hidden="true" />
                <span className="leading-snug text-warm-white/70">
                  Angkor Mansion &amp; Residence, Wat Bo Road, Siem Reap, Cambodia
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Follow Us */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-lg font-semibold tracking-wide text-warm-white">
              {tFooter("followUs")}
            </h3>
            <p className="text-xs text-warm-white/70 leading-relaxed pt-1">
              Follow our daily bakery creations, seasonal specialties, and behind-the-scenes stories in Siem Reap.
            </p>
            <div className="pt-2">
              <a
                href="https://facebook.com/nostbakery"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-warm-white/10 hover:bg-warm-white/15 hover:scale-105 active:scale-95 text-warm-white text-xs font-semibold tracking-wide border border-warm-white/15 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden shadow-xs"
                aria-label={tCommon("followFacebook")}
              >
                <Facebook className="h-4 w-4 text-golden" />
                <span>{tCommon("followFacebook")}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-warm-white/70">
          <p className="text-center sm:text-left">
            &copy; {currentYear} NOST Bakery &amp; Pastry. {tFooter("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
