import Link from "next/link";
import { company, navLinks, site } from "@/content/site";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { Arrow } from "@/components/ui/Arrow";
import { DubaiClock } from "@/components/ui/DubaiClock";
import { FooterWordmark } from "@/components/ui/FooterWordmark";
import { Logo } from "@/components/ui/Logo";

const heading = "font-mono text-[0.68rem] tracking-[0.2em] text-paper/60 uppercase";
const contactLink = "underline decoration-paper/30 underline-offset-4 transition-colors hover:text-signal-soft hover:decoration-current";

export function Footer() {
  return (
    <footer
      data-nav="dark"
      className="relative z-10 -mt-10 overflow-hidden rounded-t-[2.5rem] bg-ink px-5 pt-20 pb-6 text-paper md:px-10 md:pt-24"
    >
      <div className="grid gap-12 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-6 max-w-sm leading-relaxed text-paper/60">{site.description}</p>
        </div>

        <nav aria-label="Footer" className="md:col-span-2">
          <p className={heading}>Explore</p>
          <ul className="mt-5 space-y-2 text-lg">
            {navLinks.map((link) => (
              <li key={link.href}>
                <AnchorLink href={`/${link.href}`} className="transition-colors hover:text-signal-soft">
                  {link.label}
                </AnchorLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className={heading}>Company</p>
          <address className="mt-5 space-y-1 leading-relaxed text-paper/75 not-italic">
            <p className="font-semibold tracking-wide text-paper">{company.name}</p>
            <p>{company.licence}</p>
            <p>{company.tradeLicence}</p>
            <p>{company.address}</p>
            <p>
              Email:{" "}
              <a href={`mailto:${company.email}`} className={contactLink}>
                {company.email}
              </a>
            </p>
            <p>
              Phone:{" "}
              <a href={company.phoneHref} className={contactLink}>
                {company.phone}
              </a>
            </p>
          </address>
          <Link
            href="/privacy-policy"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-paper/35 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-paper hover:bg-paper hover:text-ink"
          >
            Privacy Policy <Arrow direction="up-right" />
          </Link>
        </div>

        <div className="md:col-span-2">
          <p className={heading}>Local time</p>
          <DubaiClock className="mt-5 block text-lg" />
        </div>
      </div>

      <FooterWordmark />

      <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 pt-5 font-mono text-[0.68rem] tracking-[0.2em] text-paper/60 uppercase">
        <p>
          © {new Date().getFullYear()} {site.legalName}
        </p>
        <AnchorLink href="#top" className="inline-flex items-center gap-2 transition-colors hover:text-signal-soft">
          Back to top <Arrow direction="up" />
        </AnchorLink>
      </div>
    </footer>
  );
}
