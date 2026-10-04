# Top Code Media — scroll-driven site

Scroll-driven brand site for Top Code Media LLC, plus a privacy policy page at `/privacy-policy`. Next.js (App Router) + GSAP (ScrollTrigger, SplitText) + Lenis + Tailwind v4. Built from `top-code-media-build-spec.md`.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Deploys to Vercel as-is (the page is fully static). Set `NEXT_PUBLIC_SITE_URL` to the production domain so Open Graph URLs resolve; on Vercel it falls back to the project's production URL.

## Before launch

- **Copy**: every line of site text lives in `content/site.ts`, including the registered company details shown in the footer (`company`). The headline, captions, service descriptions and process copy were written for this build and should be checked by the client.
- **Privacy policy**: the text in `content/privacy.ts` is transcribed from the client's PDF (last updated 1 October 2026). Update it there, including the date, whenever the policy changes.

## Brand assets

- `logo.png` (project root) is the client's source logo: white strokes and a #9600ff triangle on a transparent 1000×1000 canvas.
- `assets/brand/logo-mark.png` is that artwork trimmed to its edges, pixels untouched. Because the strokes are white, the site always shows it on an ink tile (`components/ui/Logo.tsx`).
- `app/favicon.ico`, `app/icon.png` and `app/apple-icon.png` are the mark centred on the same ink tile, so it stays visible in light browser tabs. Regenerate all four if the source logo changes.
- Brand colour is `--color-signal: #9600ff` in `app/globals.css`. Text on purple surfaces is paper (4.9:1); small purple text on ink uses the lighter `--color-signal-soft` (#b066ff), because #9600ff only reaches 3.4:1 there.

## The concept

"Top" drives the hero ("Top of feed. Top of search. Top of mind."). The recurring motif is the **signal dot**: it's the full stop on every headline, echoing the purple triangle in the logo, the point riding the process chart, and the period after "scale" that floods the screen before the final CTA.

| Section | What happens on scroll |
| --- | --- |
| Hero | CSS entrance on first paint; letters near the cursor swing weight on the variable font (desktop) |
| Marquee | Tilted service ribbon; speed and direction follow scroll velocity |
| Growth loop | Pinned. Letters fly in and assemble each word (desktop) or roll like a ticker (mobile); "Grow" climbs like a chart |
| Intro | Masked line reveal, inline chart chip, words brighten as you read |
| Services | Pinned horizontal rail (desktop); cards deal in and draw their illustrations |
| Process | Strike-through "No fixed packages"; pinned chart draws step by step (desktop), vertical timeline (mobile) |
| Results | Rows draw in, titles decode, direction-aware hover fill |
| Scale | "scale" gains weight, then its dot floods the screen into the CTA |
| CTA + footer | Magnetic round CTA; wordmark rises in; company details and Privacy Policy link |

## How it's put together

- `lib/gsap.ts` loads GSAP + plugins lazily (after first paint, when idle) and registers them once.
- `lib/useScrollTrigger.ts` wraps each section's setup in `gsap.matchMedia()`, so every tween, ScrollTrigger and SplitText is reverted on unmount or breakpoint change. Sections set up one idle task at a time, in page order, which keeps pin measurements correct.
- `lib/lenis-provider.tsx` drives Lenis from GSAP's ticker and feeds ScrollTrigger.
- Desktop / mobile / reduced-motion share one set of queries (`motionQueries`). With reduced motion there is no smooth scroll, no pinning and no scrubbing, and every section falls back to a readable static layout.
- Sections that change layout in motion mode toggle a `data-motion` / `data-rail` attribute and style both states with Tailwind `group-data-*` variants, so the static layout is the default without JS.

Gotchas worth knowing if you edit animations:

- Don't put Tailwind `translate-*` / `scale-*` / `rotate-*` classes on elements GSAP transforms; Tailwind v4 uses the individual `translate`/`scale`/`rotate` properties, which stack with GSAP's `transform` instead of being replaced.
- Don't add `invalidateOnRefresh` to timelines built from staggered `from()` tweens (growth loop, scale). A refresh reverts them and the staggered targets show up all at once.
- The hero entrance is the only CSS animation, on purpose: it starts before hydration, keeping the headline (the LCP element) fast.

## Measured (production build, local)

- Lighthouse mobile: Performance ~83–89, Accessibility 100, Best Practices 100, SEO 100. CLS 0.
- Lighthouse desktop: Performance 99, LCP 0.8 s.
- Mobile LCP under Lighthouse's simulated slow-4G is ~2.9–3.5 s (observed paint ~0.6–0.9 s). The remaining cost is React + Next runtime hydration and the 75 KB display font; see the notes in `app/layout.tsx`.
