# Top Code Media — Scroll-Driven Single Page Site — Build Spec

## Brief

Client: Top Code Media LLC, a UAE-based digital marketing agency (licensed in the UAE, serves businesses worldwide). Services: performance marketing, paid advertising, organic search, social media marketing, content/creative design, websites and landing pages.

Goal: a scroll-driven single page brand site. Motion should feel confident and editorial, not experimental or heavy. Reference: Nod Marketing (nodmarketing.se) is the closest match in tone and approach, since it's the same industry and built specifically to demonstrate capability through restrained motion rather than spectacle.

## Stack

- Next.js (App Router), TypeScript
- GSAP + ScrollTrigger + SplitText, loaded client side only
- Lenis for smooth scroll, synced to ScrollTrigger's ticker
- Tailwind for layout and spacing; animation logic stays in JS, not CSS
- `next/font` for type loading
- `next/image` for any client-supplied photography or icons
- Deploy target: Vercel

## Project structure

```
app/
  layout.tsx          → fonts, smooth scroll provider, metadata
  page.tsx             → assembles sections in order
components/
  sections/
    Hero.tsx
    KineticWords.tsx
    Intro.tsx
    Services.tsx
    ProcessStepper.tsx
    Results.tsx
    ScaleSection.tsx
    FinalCTA.tsx
  ui/
    ServiceCard.tsx
    ProcessStep.tsx
lib/
  gsap.ts              → registers plugins once, exports configured gsap
  useScrollTrigger.ts   → reusable hook wrapping ScrollTrigger + cleanup
  lenis-provider.tsx    → wraps Lenis, syncs with ScrollTrigger's ticker
```

## Optimization rules (Next.js specific)

1. **Client component boundaries.** Every animated section is a Client Component (`"use client"`), but keep the page shell and static text resolvable at build time. Don't mark the whole page client side, only the interactive leaf components.
2. **GSAP loading.** Import GSAP and its plugins via `next/dynamic` with `ssr: false`, or register plugins inside a `useEffect` / `useGSAP` hook. GSAP touches `window` and breaks SSR if imported at module top level in a server-rendered tree.
3. **Cleanup discipline.** Every `ScrollTrigger.create()` needs a matching `.kill()` in a `useEffect` cleanup, scoped with `gsap.context()` to a ref. Prevents jank and memory leaks.
4. **Font loading.** Use `next/font/google` or `next/font/local` for self-hosted, preloaded, layout-shift-free fonts. Matters most for the hero text, since it's the first thing animating in.
5. **Images.** Route all service icons, illustrations, and background textures through `next/image` with explicit sizes. `priority` only on the hero's above-the-fold asset; everything else lazy loads.
6. **Mobile-lighter animation.** Use `gsap.matchMedia()` to run a lighter set below ~768px: skip pinned horizontal scroll, use word-level (not character-level) SplitText staggering. Respect `prefers-reduced-motion` by disabling scrub animations entirely.
7. **Bundle size.** Only import the GSAP plugins actually used (core + ScrollTrigger + SplitText, roughly 40-60kb gzipped combined). Don't pull in MorphSVG, Physics, etc. unless needed.
8. **Performance targets.** LCP under 2.5s, with the hero text (not an image) as the LCP element. Code-split below-the-fold sections with `next/dynamic` so their animation code doesn't block initial hydration.

## Section-by-section plan

Mapped directly to the content the client provided.

### 1. Hero
Logo mark, "Connect Convert Grow" tagline, headline, "Start Your Growth Journey" CTA. Simple fade/scale entrance on load, not scroll-dependent.

### 2. Kinetic word sequence (highest-risk section, build first)
Words: Reach → Engage → Convert → Retain → Grow.
Pinned section; each word assembles from a character stagger synced to scroll progress via `ScrollTrigger` scrub. On mobile, fall back to word-level (not character-level) reveal for performance.

### 3. Intro statement
"We Do Not Just Market We Create Growth" + the two supporting paragraphs. Slide-up + fade reveal on scroll enter, reused as the base pattern for other text blocks.

### 4. What We Do — service cards
Five services: Performance Marketing, Paid Advertising Campaigns, Organic Search Optimization, Social Media Marketing, Content and Creative Design, Websites and Landing Pages.
Pinned horizontal scroll or staggered grid reveal; each card animates in as it enters the viewport.

### 5. Built Around Your Business + process stepper
Copy: "No fixed solutions" messaging.
Process: Understand → Strategize → Create → Launch → Optimize → Scale.
Pin the section and drive the six-step progress indicator by scroll offset.

### 6. Results That Matter
Six outcomes: Relevant Audience Reach, Customer Engagement, Qualified Leads, Conversions, Repeat Customers, Business Growth.
Staggered icon/text reveal; consider animated counters for extra polish if scope allows.

### 7. No Matter Your Size, We Help You Scale
Text block, reuse the section 3 reveal pattern.

### 8. Final CTA + footer
"Your Next Stage of Growth Starts Here", UAE licensing line, contact CTA. Simple fade in.

## Build order

1. Scaffold app: fonts, Tailwind, base layout, static content for all sections, no animation yet.
2. Add Lenis provider + GSAP setup in `lib/`. Confirm smooth scroll works with zero jank before adding any triggers.
3. Build `KineticWords.tsx` in isolation — highest risk section, get scrub timing right before wiring into the full page.
4. Build `Services.tsx` cards and `ProcessStepper.tsx`.
5. Build remaining reveal sections — these reuse one shared `fadeUp` utility.
6. Mobile `matchMedia` fallback pass + `prefers-reduced-motion` pass.
7. Lighthouse audit: fix LCP/CLS issues, verify GSAP cleanup with a memory profiler.
8. Deploy to Vercel.

## Open decisions to confirm with the client before or during build

- SplitText is a paid GSAP Club plugin. Confirm budget, or substitute a free alternative like `splitting.js` for the character-stagger effect.
- Any client-supplied photography, icons, or brand assets not included in the content brief above.
- Whether animated counters in the Results section are in scope.
