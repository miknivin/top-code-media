import { navLinks, site } from "@/content/site";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { Arrow } from "@/components/ui/Arrow";
import { DubaiClock } from "@/components/ui/DubaiClock";
import { FooterWordmark } from "@/components/ui/FooterWordmark";
import { Logo } from "@/components/ui/Logo";

const heading = "font-mono text-[0.68rem] tracking-[0.2em] text-paper/60 uppercase";

export function Footer() {
  return (
    <footer
      data-nav="dark"
      className="relative z-10 -mt-10 overflow-hidden rounded-t-[2.5rem] bg-ink px-5 pt-20 pb-6 text-paper [--logo-cut:var(--color-ink)] md:px-10 md:pt-24"
    >
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-6 max-w-sm leading-relaxed text-paper/60">{site.description}</p>
        </div>

        <nav aria-label="Footer" className="md:col-span-2 md:col-start-6">
          <p className={heading}>Explore</p>
          <ul className="mt-5 space-y-2 text-lg">
            {navLinks.map((link) => (
              <li key={link.href}>
                <AnchorLink href={link.href as `#${string}`} className="transition-colors hover:text-signal">
                  {link.label}
                </AnchorLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className={heading}>Contact</p>
          <a
            href={`mailto:${site.email}`}
            className="mt-5 inline-flex items-center gap-2 text-lg transition-colors hover:text-signal"
          >
            {site.email} <Arrow direction="up-right" />
          </a>
          <p className="mt-2 text-paper/60">{site.licence}</p>
        </div>

        <div className="md:col-span-2 md:col-start-11">
          <p className={heading}>Local time</p>
          <DubaiClock className="mt-5 block text-lg" />
        </div>
      </div>

      <FooterWordmark />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 pt-5 font-mono text-[0.68rem] tracking-[0.2em] text-paper/60 uppercase">
        <p>
          © {new Date().getFullYear()} {site.legalName}. {site.licence}.
        </p>
        <AnchorLink href="#top" className="inline-flex items-center gap-2 transition-colors hover:text-signal">
          Back to top <Arrow direction="up" />
        </AnchorLink>
      </div>
    </footer>
  );
}
