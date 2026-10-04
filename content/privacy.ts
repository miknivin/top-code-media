// Transcribed from Top_Code_Media_Privacy_Policy.pdf (last updated 1 October 2026).
// Email addresses and the phone number are turned into links when rendered.

export type PolicyBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "lines"; lines: string[]; leadStrong?: boolean }
  | { type: "label"; text: string }
  | { type: "term"; term: string; text: string };

export type PolicySection = { id: string; title: string; blocks: PolicyBlock[] };

export const privacyPolicy: {
  company: string;
  title: string;
  updated: string;
  updatedIso: string;
  sections: PolicySection[];
} = {
  company: "TOP CODE MEDIA LLC",
  title: "Privacy Policy",
  updated: "1 October 2026",
  updatedIso: "2026-10-01",
  sections: [
    {
      id: "who-we-are",
      title: "Who We Are",
      blocks: [
        {
          type: "p",
          text: "TOP CODE MEDIA LLC provides digital marketing, creative content, website design and related services to businesses worldwide.",
        },
        {
          type: "lines",
          lines: [
            "Licensed by Sharjah Media City (Shams), UAE",
            "Trade Licence No.: 2644784.01",
            "Registered Address: Sharjah Media City, Sharjah, UAE",
            "Email: support@topcodemedia.com",
            "Phone: +971 58 691 2878",
          ],
        },
        {
          type: "p",
          text: "This policy explains how we handle personal information received through our website, enquiries and service relationships.",
        },
      ],
    },
    {
      id: "information-we-collect",
      title: "Information We Collect",
      blocks: [
        {
          type: "p",
          text: "When you contact us or engage our services, we may receive your name, email address, telephone number, company details, website address and information about your project.",
        },
        {
          type: "p",
          text: "If required to deliver agreed services, we may also process information supplied through your advertising accounts, website or business systems. Please avoid sending passwords or unnecessary sensitive personal information.",
        },
        {
          type: "p",
          text: "Our website hosting provider may process technical information, such as IP addresses and request logs, to operate and secure the website.",
        },
      ],
    },
    {
      id: "how-we-use-your-information",
      title: "How We Use Your Information",
      blocks: [
        { type: "p", text: "We use personal information to:" },
        {
          type: "list",
          items: [
            "Respond to enquiries and communicate with you.",
            "Prepare quotations and proposals.",
            "Deliver and manage agreed services.",
            "Maintain relevant business records.",
            "Protect our systems and comply with applicable legal obligations.",
          ],
        },
        {
          type: "p",
          text: "We rely on consent or another lawful basis available under applicable law, depending on the purpose of the processing.",
        },
      ],
    },
    {
      id: "sharing-your-information",
      title: "Sharing Your Information",
      blocks: [
        {
          type: "p",
          text: "Where necessary, information may be processed by providers supporting our website hosting, email communications and service delivery. We may also disclose information where legally required.",
        },
        { type: "label", text: "Providers we use and their purposes:" },
        {
          type: "term",
          term: "Vercel:",
          text: "hosts and delivers our website and may process technical request information for website operation and security.",
        },
        {
          type: "term",
          term: "Zoho Mail:",
          text: "handles email communications, including enquiry messages, sender details and attachments.",
        },
        { type: "p", text: "We limit sharing to what is necessary for the relevant purpose." },
      ],
    },
    {
      id: "processing-outside-the-uae",
      title: "Processing Outside the UAE",
      blocks: [
        {
          type: "p",
          text: "As we operate internationally, personal information may be accessed or processed outside the UAE, including in India and in locations used by our service providers.",
        },
        {
          type: "p",
          text: "Where applicable, we use the safeguards required by law for international transfers. You may contact us for information about the arrangements relevant to your data.",
        },
      ],
    },
    {
      id: "how-long-we-keep-information",
      title: "How Long We Keep Information",
      blocks: [
        {
          type: "p",
          text: "We retain enquiry information while responding to your request and considering any resulting work. We retain client and transaction records for service delivery, applicable legal requirements and the resolution of disputes.",
        },
        {
          type: "p",
          text: "Retention depends on the type of information, its purpose and applicable obligations. When information is no longer needed, we delete or anonymise it.",
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      blocks: [
        {
          type: "p",
          text: "We use access controls and appropriate security measures to protect personal information. Access is limited to people who need it for their work.",
        },
        { type: "p", text: "No internet transmission or storage system is completely secure." },
      ],
    },
    {
      id: "your-privacy-rights",
      title: "Your Privacy Rights",
      blocks: [
        {
          type: "p",
          text: "Subject to applicable law, you may request access to or correction of your personal information, request deletion, withdraw consent, or object to or restrict certain processing.",
        },
        {
          type: "p",
          text: "Some information may need to be retained to meet legal obligations. We may verify your identity before responding to a request.",
        },
        { type: "p", text: "Contact support@topcodemedia.com to make a privacy request or raise a concern." },
      ],
    },
    {
      id: "cookies-and-marketing",
      title: "Cookies and Marketing",
      blocks: [
        { type: "label", text: "Website cookies and tracking:" },
        {
          type: "p",
          text: "Website hosting may involve technical logs and technologies needed to deliver and secure the site. These are separate from the tracking used in advertising campaigns we manage for clients.",
        },
        {
          type: "p",
          text: "If we introduce optional website analytics or advertising tracking, we will update this policy and provide any notices and consent controls required by applicable law before using them.",
        },
        {
          type: "p",
          text: "You can manage cookies through your browser settings. Contact us if you have questions about website tracking.",
        },
        {
          type: "p",
          text: "Responding to an enquiry does not automatically mean you have subscribed to promotional messages. Where we send marketing communications, we follow applicable requirements and provide a way to stop receiving them.",
        },
        {
          type: "p",
          text: "You can contact support@topcodemedia.com to withdraw consent to marketing where consent is the basis for those messages.",
        },
      ],
    },
    {
      id: "changes-and-contact",
      title: "Changes and Contact",
      blocks: [
        {
          type: "p",
          text: "We may update this policy when our practices or applicable requirements change. The latest version will show its updated date.",
        },
        { type: "p", text: "For questions or concerns about this policy, contact:" },
        {
          type: "lines",
          leadStrong: true,
          lines: ["TOP CODE MEDIA LLC", "Email: support@topcodemedia.com", "Phone: +971 58 691 2878"],
        },
      ],
    },
  ],
};
