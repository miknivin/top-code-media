export const site = {
  name: "Top Code Media",
  legalName: "Top Code Media LLC",
  tagline: ["Connect", "Convert", "Grow"],
  // Placeholder — confirm the real inbox with the client before launch.
  email: "hello@topcodemedia.com",
  timeZone: "Asia/Dubai",
  licence: "Licensed in the United Arab Emirates",
  reach: "Serving businesses worldwide",
  description:
    "Top Code Media is a UAE-licensed digital marketing agency. Performance marketing, paid advertising, SEO, social media, content and websites that turn attention into growth, for businesses worldwide.",
};

export const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Results", href: "#results" },
  { label: "Contact", href: "#contact" },
];

export const hero = {
  eyebrow: "Digital growth agency",
  lines: [
    { lead: "Top of", word: "feed." },
    { lead: "Top of", word: "search." },
    { lead: "Top of", word: "mind", accent: true },
  ],
  body: "We connect your brand with the right people, convert their attention into action and grow what works, from the first click to the hundredth order.",
  cta: "Start your growth journey",
  secondary: "See what we do",
};

export const marquee = [
  "Performance marketing",
  "Paid advertising",
  "Organic search",
  "Social media",
  "Content & creative",
  "Websites & landing pages",
];

export const growthLoop = [
  { word: "Reach", line: "Put your brand in front of the people who actually matter." },
  { word: "Engage", line: "Give them a reason to stop scrolling and start caring." },
  { word: "Convert", line: "Turn that interest into leads, sales and sign-ups." },
  { word: "Retain", line: "Keep customers coming back long after the first click." },
  { word: "Grow", line: "Compound every win into growth that lasts." },
];

export const intro = {
  title: ["We don’t just market.", "We create"],
  accent: "growth.",
  statement:
    "Growth isn’t a lucky campaign or a viral moment. It’s what happens when strategy, creative and data work as one system, and that system is what we build.",
  paragraphs: [
    "Top Code Media is a digital marketing agency licensed in the UAE and working with businesses around the world. We pair data-led performance marketing with creative people actually want to watch, read and share.",
    "Every plan starts with your numbers, not ours. We learn how your business makes money, find where growth is hiding and build campaigns that keep improving long after launch.",
  ],
  stats: [
    { value: 6, label: "Growth services under one roof" },
    { value: 6, label: "Steps from first call to scale" },
    { value: 5, label: "Stages in every growth loop" },
    { value: 1, label: "Team accountable for the result" },
  ],
};

export type ServiceArtKind = "performance" | "paid" | "organic" | "social" | "content" | "web";
export type CardTheme = "ink" | "signal" | "sand" | "white";

export const services: {
  id: string;
  kicker: string;
  title: string;
  body: string;
  tags: string[];
  art: ServiceArtKind;
  theme: CardTheme;
}[] = [
  {
    id: "performance",
    kicker: "Return first",
    title: "Performance Marketing",
    body: "Full-funnel campaigns built around one question: what’s the return? We plan, track and optimise every dirham against revenue, not vanity metrics.",
    tags: ["Funnel strategy", "Tracking", "CRO"],
    art: "performance",
    theme: "ink",
  },
  {
    id: "paid",
    kicker: "Budget, aimed",
    title: "Paid Advertising Campaigns",
    body: "Google, Meta, TikTok, Snapchat and LinkedIn campaigns, structured, tested and scaled to put your budget where the buyers are.",
    tags: ["Search ads", "Social ads", "Retargeting"],
    art: "paid",
    theme: "signal",
  },
  {
    id: "organic",
    kicker: "Found, not bought",
    title: "Organic Search Optimization",
    body: "Technical SEO, content and authority building that earn rankings and keep them, so customers find you without you paying for every click.",
    tags: ["Technical SEO", "Content", "Local SEO"],
    art: "organic",
    theme: "sand",
  },
  {
    id: "social",
    kicker: "Audience to community",
    title: "Social Media Marketing",
    body: "Strategy, content calendars and community management that turn followers into an audience and an audience into customers.",
    tags: ["Strategy", "Community", "Creators"],
    art: "social",
    theme: "white",
  },
  {
    id: "content",
    kicker: "Made to stop thumbs",
    title: "Content and Creative Design",
    body: "Scroll-stopping visuals, video and copy designed for the platform they live on and the action you want people to take.",
    tags: ["Ad creative", "Video", "Brand design"],
    art: "content",
    theme: "ink",
  },
  {
    id: "web",
    kicker: "Where traffic converts",
    title: "Websites and Landing Pages",
    body: "Fast, conversion-focused websites and landing pages that turn all that hard-won traffic into leads and sales.",
    tags: ["UX / UI", "Development", "Landing pages"],
    art: "web",
    theme: "signal",
  },
];

export const approach = {
  title: ["Built around", "your", "business."],
  struck: ["fixed packages", "one-size-fits-all plans", "copy-paste playbooks"],
  body: "Every strategy is shaped by your goals, your market and your numbers, then refined until it performs. Here’s how it comes together.",
};

export const processSteps = [
  { title: "Understand", body: "We dig into your business, audience, competitors and data to find where growth is hiding." },
  { title: "Strategize", body: "A clear plan: channels, budgets, messaging and the KPIs that actually matter to you." },
  { title: "Create", body: "Campaigns, content and pages crafted to connect with the right people." },
  { title: "Launch", body: "We go live with full tracking in place, so every click and conversion is measured." },
  { title: "Optimize", body: "Daily monitoring, testing and refining to improve performance week over week." },
  { title: "Scale", body: "When it works, we push further: new audiences, new channels, bigger results." },
];

export type ResultIconKind = "reach" | "engage" | "leads" | "convert" | "repeat" | "growth";

export const results: { title: string; body: string; icon: ResultIconKind }[] = [
  { title: "Relevant Audience Reach", body: "Your brand in front of people who are ready to buy, not just anyone with a screen.", icon: "reach" },
  { title: "Customer Engagement", body: "Content and conversations that build genuine interest and trust.", icon: "engage" },
  { title: "Qualified Leads", body: "Enquiries from people who fit your business, ready for your sales team.", icon: "leads" },
  { title: "Conversions", body: "More visitors turning into customers, at a lower cost per acquisition.", icon: "convert" },
  { title: "Repeat Customers", body: "Retention and remarketing that turn first-time buyers into regulars.", icon: "repeat" },
  { title: "Business Growth", body: "Revenue that compounds, backed by reporting you can actually read.", icon: "growth" },
];

export const scale = {
  sizes: ["Start-ups", "Growing businesses", "Established brands"],
  lead: ["No matter", "your size,", "we help you"],
  word: "scale",
  body: "Launching your first product or taking an established brand into new markets, we shape the plan around where you are today and build it for where you’re going.",
};

export const finalCta = {
  title: ["Your next", "stage of growth", "starts"],
  accent: "here.",
  body: "Tell us where your business is today and where you want it to be. We’ll come back with honest ideas, not a sales script.",
  cta: "Start your growth journey",
};
