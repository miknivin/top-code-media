"use client";

import { useEffect, useRef, useState } from "react";
import { navLinks, site } from "@/content/site";
import { gsap, loadGsap } from "@/lib/gsap";
import { useLenis, useScrollTo } from "@/lib/lenis-provider";
import { AnchorLink } from "./AnchorLink";
import { Arrow } from "./Arrow";
import { Logo } from "./Logo";
import { MagneticButton } from "./MagneticButton";

type Theme = "light" | "dark" | "signal";

const themes: Record<Theme, Record<string, string>> = {
  light: { "--nav-fg": "#0f0e0c", "--nav-bg": "rgba(243, 239, 231, 0.92)", "--nav-pill-bg": "#0f0e0c", "--nav-pill-fg": "#f3efe7", "--logo-cut": "#f3efe7" },
  dark: { "--nav-fg": "#f3efe7", "--nav-bg": "rgba(15, 14, 12, 0.9)", "--nav-pill-bg": "#f3efe7", "--nav-pill-fg": "#0f0e0c", "--logo-cut": "#0f0e0c" },
  signal: { "--nav-fg": "#0f0e0c", "--nav-bg": "rgba(242, 78, 23, 0.94)", "--nav-pill-bg": "#0f0e0c", "--nav-pill-fg": "#f3efe7", "--logo-cut": "#f24e17" },
};

export function Nav() {
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const themeRef = useRef<Theme | null>(null);
  const hiddenRef = useRef(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const scrollTo = useScrollTo();

  // Theme follows whatever section is under the bar; the bar tucks away on scroll down.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let detach: (() => void) | undefined;
    let cancelled = false;
    loadGsap().then(() => {
      if (!cancelled) detach = attach(header);
    });
    return () => {
      cancelled = true;
      detach?.();
    };

    function attach(header: HTMLElement) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let lastY = window.scrollY;
      let frame = 0;
      let solid: boolean | null = null;

      const applyTheme = (theme: Theme) => {
        if (theme === themeRef.current) return;
        themeRef.current = theme;
        gsap.to(header, { ...themes[theme], duration: reduced ? 0 : 0.45, ease: "power2.out", overwrite: "auto" });
      };

      const update = () => {
        frame = 0;
        if (openRef.current) return;
        const probeY = header.offsetHeight / 2;
        const hit = document
          .elementsFromPoint(window.innerWidth / 2, probeY)
          .find((el) => !header.contains(el) && !menuRef.current?.contains(el));
        const theme = (hit?.closest("[data-nav]")?.getAttribute("data-nav") ?? "light") as Theme;
        applyTheme(theme in themes ? theme : "light");

        const y = window.scrollY;
        if (y > 40 !== solid) {
          solid = y > 40;
          gsap.to(backdropRef.current, { autoAlpha: solid ? 1 : 0, duration: reduced ? 0 : 0.4 });
        }
        const shouldHide = y > lastY + 2 && y > 160;
        const shouldShow = y < lastY - 2 || y < 160;
        if (shouldHide && !hiddenRef.current) {
          hiddenRef.current = true;
          gsap.to(header, { yPercent: -130, duration: reduced ? 0 : 0.6, ease: "power3.out" });
        } else if (shouldShow && hiddenRef.current) {
          hiddenRef.current = false;
          gsap.to(header, { yPercent: 0, duration: reduced ? 0 : 0.6, ease: "expo.out" });
        }
        lastY = y;
      };
      const onScroll = () => {
        if (!frame) frame = requestAnimationFrame(update);
      };

      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        cancelAnimationFrame(frame);
        gsap.killTweensOf(header);
      };
    }
  }, []);

  // Mobile menu open/close
  useEffect(() => {
    openRef.current = open;
    const menu = menuRef.current;
    const header = headerRef.current;
    if (!menu || !header) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);

    if (open) {
      lenis?.stop();
      themeRef.current = "dark";
      hiddenRef.current = false;
      window.addEventListener("keydown", onKey);
    } else {
      lenis?.start();
    }

    // Before GSAP has arrived (a tap in the first moment), switch states without animating.
    if (!gsap) {
      menu.style.visibility = open ? "visible" : "hidden";
      menu.style.clipPath = "none";
      Object.entries(open ? themes.dark : themes.light).forEach(([key, value]) => header.style.setProperty(key, value));
      if (!open) themeRef.current = null;
    } else {
      animate(menu, header);
    }
    return () => window.removeEventListener("keydown", onKey);

    function animate(menu: HTMLElement, header: HTMLElement) {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (open) {
        gsap.to(header, { ...themes.dark, yPercent: 0, duration: 0.3, overwrite: "auto" });
        gsap.set(menu, { visibility: "visible" });
        gsap.fromTo(
          menu,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: reduced ? 0 : 0.8, ease: "expo.inOut" },
        );
        gsap.fromTo(
          menu.querySelectorAll("[data-menu-item]"),
          { yPercent: 110 },
          { yPercent: 0, duration: reduced ? 0 : 1, ease: "expo.out", stagger: 0.06, delay: reduced ? 0 : 0.3 },
        );
        return;
      }
      if (menu.style.visibility !== "visible") return;
      gsap.to(menu, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: reduced ? 0 : 0.7,
        ease: "expo.inOut",
        onComplete: () => {
          gsap.set(menu, { visibility: "hidden" });
          window.dispatchEvent(new Event("scroll"));
        },
      });
    }
  }, [open, lenis]);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 isolate px-5 pt-4 pb-3 text-(--nav-fg) md:px-10 md:pt-5 md:pb-4"
        style={themes.light as React.CSSProperties}
      >
        <div ref={backdropRef} aria-hidden className="invisible absolute inset-0 -z-10 bg-(--nav-bg) opacity-0" />
        <div className="flex items-center justify-between gap-6">
          <AnchorLink href="#top" aria-label={`${site.name}, back to top`} onClick={() => setOpen(false)}>
            <Logo />
          </AnchorLink>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8 text-[0.95rem]">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <AnchorLink
                    href={link.href as `#${string}`}
                    className="group relative inline-block py-1 font-medium tracking-[-0.01em]"
                  >
                    {link.label}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-current transition-transform duration-500 ease-expo group-hover:origin-left group-hover:scale-x-100"
                    />
                  </AnchorLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <MagneticButton
                href="#contact"
                className="rounded-full bg-(--nav-pill-bg) px-5 py-3 text-sm font-semibold text-(--nav-pill-fg)"
                hoverColor="#0f0e0c"
              >
                Start a project <Arrow direction="up-right" />
              </MagneticButton>
            </div>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex items-center gap-2 rounded-full bg-(--nav-pill-bg) px-4 py-2.5 text-sm font-semibold text-(--nav-pill-fg) md:hidden"
            >
              {open ? "Close" : "Menu"}
              <span aria-hidden className="inline-block size-1.5 rounded-full bg-signal" />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        id="mobile-menu"
        className="invisible fixed inset-0 z-40 flex flex-col justify-between bg-ink px-5 pt-28 pb-8 text-paper md:hidden"
        aria-hidden={!open}
        data-nav="dark"
      >
        <ul className="space-y-1">
          {navLinks.map((link, index) => (
            <li key={link.href} className="overflow-hidden">
              <a
                data-menu-item
                href={link.href}
                tabIndex={open ? 0 : -1}
                onClick={(event) => {
                  event.preventDefault();
                  setOpen(false);
                  window.setTimeout(() => scrollTo(link.href), 350);
                }}
                className="flex items-baseline gap-4 text-[13vw] font-bold leading-[1.05] tracking-tighter"
              >
                <span className="font-mono text-xs font-normal tracking-normal text-signal">0{index + 1}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="overflow-hidden">
          <p data-menu-item className="font-mono text-xs uppercase tracking-[0.2em] text-paper/60">
            {site.tagline.join(" · ")}
            <br />
            {site.licence}
          </p>
        </div>
      </div>
    </>
  );
}
