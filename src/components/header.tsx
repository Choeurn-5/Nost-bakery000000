"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, usePathname } from "@/i18n/routing";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

interface NavItem {
  key: "home" | "menu" | "wholesale" | "bakery" | "promotions" | "contact";
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: "home", href: "/" },
  { key: "menu", href: "/menu" },
  { key: "wholesale", href: "/wholesale" },
  { key: "bakery", href: "/bakery" },
  { key: "promotions", href: "/promotions" },
  { key: "contact", href: "/contact" },
];

export interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = React.useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);

  // Monitor scroll for header background transition
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is active
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          isScrolled
            ? "bg-warm-white/95 backdrop-blur-md border-b border-espresso/10 shadow-[0_4px_20px_rgba(58,36,24,0.06)] py-3"
            : "bg-warm-white/90 backdrop-blur-md border-b border-espresso/8 py-3.5 md:py-4 shadow-xs",
          className
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo Left */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden rounded-lg"
              aria-label="NOST Bakery & Pastry - Homepage"
            >
              <Logo variant="dark" width={135} className="md:w-[155px]" />
            </Link>
          </div>

          {/* Desktop Navigation Center */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2"
          >
            {NAV_ITEMS.map((item) => {
              const active = isActiveLink(item.href);
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "relative px-3 py-2 text-xs xl:text-sm font-medium transition-colors select-none rounded-lg",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden",
                    active
                      ? "text-espresso font-semibold"
                      : "text-espresso/75 hover:text-espresso hover:bg-cream/40"
                  )}
                >
                  <span>{tNav(item.key)}</span>
                  {active && (
                    <motion.span
                      layoutId="header-active-nav-underline"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-golden rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Order Button (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className={cn(
                "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs xl:text-sm font-semibold tracking-wide",
                "bg-golden hover:bg-caramel text-warm-white shadow-sm hover:shadow-md transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden focus-visible:ring-offset-2",
                "min-h-[40px]"
              )}
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              <span>{tCommon("orderNow")}</span>
            </Link>
          </div>

          {/* Mobile Right Controls: Hamburger */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              className="p-2.5 rounded-xl text-espresso hover:bg-cream/70 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-cream flex flex-col justify-between p-6 lg:hidden overflow-y-auto"
          >
            {/* Top Bar of Mobile Menu */}
            <div className="flex items-center justify-between border-b border-espresso/10 pb-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden rounded-lg"
              >
                <Logo variant="dark" width={140} />
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-2.5 rounded-xl text-espresso hover:bg-espresso/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Nav Links Stack */}
            <nav aria-label="Mobile menu navigation" className="py-8 flex flex-col gap-2">
              {NAV_ITEMS.map((item, idx) => {
                const active = isActiveLink(item.href);
                return (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx, duration: 0.25 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between py-3 px-4 rounded-xl text-lg font-medium transition-colors min-h-[48px]",
                        active
                          ? "bg-golden/15 text-espresso font-semibold border-l-4 border-golden"
                          : "text-espresso/80 hover:text-espresso hover:bg-warm-white/60"
                      )}
                    >
                      <span className="font-heading text-xl">{tNav(item.key)}</span>
                      {active && (
                        <span className="h-2 w-2 rounded-full bg-golden" aria-hidden="true" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom Controls inside Mobile Menu */}
            <div className="pt-6 border-t border-espresso/10 flex flex-col gap-4">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-golden hover:bg-caramel text-warm-white font-semibold text-base shadow-sm transition-colors min-h-[48px]"
              >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                <span>{tCommon("orderNow")}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
