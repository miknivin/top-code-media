import type { Metadata } from "next";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { privacyPolicy, type PolicyBlock } from "@/content/privacy";
import { company } from "@/content/site";
import { Footer } from "@/components/sections/Footer";
import { AnchorLink } from "@/components/ui/AnchorLink";
import { Arrow } from "@/components/ui/Arrow";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Privacy Policy | Top Code Media",
  description:
    "How TOP CODE MEDIA LLC handles personal information received through its website, enquiries and service relationships.",
  alternates: { canonical: "/privacy-policy" },
};

const inlineLink =
  "font-semibold text-ink underline decoration-signal/40 decoration-2 underline-offset-4 transition-colors hover:text-signal hover:decoration-signal";

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const contactPattern = new RegExp(`(${escape(company.email)}|${escape(company.phone)})`);

function linkify(text: string): ReactNode {
  return text.split(contactPattern).map((part, i) => {
    if (part === company.email) {
      return (
        <a key={i} href={`mailto:${part}`} className={inlineLink}>
          {part}
        </a>
      );
    }
    if (part === company.phone) {
      return (
        <a key={i} href={company.phoneHref} className={inlineLink}>
          {part}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function Block({ block }: { block: PolicyBlock }) {
  switch (block.type) {
    case "p":
      return <p>{linkify(block.text)}</p>;
    case "label":
      return <p className="font-semibold text-ink">{block.text}</p>;
    case "term":
      return (
        <p>
          <strong className="font-semibold text-ink">{block.term}</strong> {linkify(block.text)}
        </p>
      );
    case "list":
      return (
        <ul className="space-y-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3.5">
              <span aria-hidden className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-signal" />
              <span>{linkify(item)}</span>
            </li>
          ))}
        </ul>
      );
    case "lines":
      return (
        <p className="rounded-2xl bg-bone px-5 py-5 ring-1 ring-ink/10 ring-inset max-md:text-base md:px-6">
          {block.lines.map((line, i) => (
            <span key={line} className={i === 0 && block.leadStrong ? "block font-semibold text-ink" : "block"}>
              {linkify(line)}
            </span>
          ))}
        </p>
      );
  }
}

export default function PrivacyPolicyPage() {
  const { sections } = privacyPolicy;
  return (
    <>
      <header className="flex items-center justify-between gap-6 px-5 pt-5 md:px-10 md:pt-6">
        <Link href="/" aria-label="Top Code Media home">
          <Logo />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-signal"
        >
          <Arrow direction="right" className="rotate-180" /> Back to home
        </Link>
      </header>

      <main id="main" className="px-5 pb-32 md:px-10 md:pb-40">
        <div className="border-b border-ink/15 pt-20 pb-14 md:pt-28 md:pb-20">
          <p className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.2em] uppercase">
            <span aria-hidden className="inline-block size-1.5 rounded-full bg-signal" />
            {privacyPolicy.company}
          </p>
          <h1 className="mt-8 text-[clamp(3.2rem,11vw,11rem)] leading-[0.86] font-bold tracking-tighter">
            Privacy <em className="font-serif font-normal tracking-[-0.02em] text-signal italic">Policy</em>
            <span aria-hidden className="ml-[0.04em] inline-block size-[0.14em] rounded-full bg-signal align-baseline" />
          </h1>
          <p className="mt-8 text-lg text-ink/70">
            Last updated: <time dateTime={privacyPolicy.updatedIso}>{privacyPolicy.updated}</time>
          </p>
        </div>

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-x-10">
          <nav aria-label="Policy sections" className="hidden md:col-span-4 md:block lg:col-span-3">
            <div className="sticky top-10">
              <p className="font-mono text-[0.68rem] tracking-[0.2em] text-ink/60 uppercase">On this page</p>
              <ol className="mt-5 space-y-2.5">
                {sections.map((section, i) => (
                  <li key={section.id}>
                    <AnchorLink
                      href={`#${section.id}`}
                      className="group flex gap-3 text-[0.95rem] leading-snug text-ink/70 transition-colors hover:text-ink"
                    >
                      <span className="w-5 shrink-0 font-mono text-xs leading-[1.6] text-signal">{i + 1}.</span>
                      <span className="underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-current">
                        {section.title}
                      </span>
                    </AnchorLink>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="md:col-span-8 lg:col-span-8 lg:col-start-5">
            {sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="scroll-mt-10 border-t border-ink/15 py-12 first:border-t-0 first:pt-0 md:py-14"
              >
                <h2
                  id={`${section.id}-title`}
                  className="flex items-baseline gap-4 text-[clamp(1.75rem,3vw,2.75rem)] leading-[1.05] font-bold tracking-[-0.035em]"
                >
                  <span className="font-mono text-base font-normal tracking-normal text-signal">{i + 1}.</span>
                  {section.title}
                </h2>
                <div className="mt-7 max-w-[68ch] space-y-5 text-lg leading-relaxed text-ink/80">
                  {section.blocks.map((block, j) => (
                    <Block key={j} block={block} />
                  ))}
                </div>
              </section>
            ))}
          </article>
        </div>
      </main>

      <Footer />
    </>
  );
}
