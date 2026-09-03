export function toProjectSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type CaseStudyListing = {
  img: string;
  name: string;
  category: string;
};

export type CaseStudySectionType =
  | "hero"
  | "featured"
  | "narrative"
  | "experience"
  | "showcase"
  | "closing";

export type ScrollRange = [number, number];

export type CaseStudySection = {
  id: string;
  type: CaseStudySectionType;
  /** Inclusive start / exclusive end on the page scroll range 0–1 */
  range: ScrollRange;
  title?: string;
  kicker?: string;
  headline?: string;
  body?: string;
  paragraphs?: string[];
  visual: string;
  visuals?: string[];
};

export type CaseStudyAdjacent = {
  slug: string;
  name: string;
  img: string;
};

export type ChatMessage = {
  from: "ai" | "user";
  text: string;
  tips?: string[];
};

export type CaseStudyProductSample = {
  productName: string;
  copilotName: string;
  brandFont: string;
  brandMessage: string;
  coach: { name: string; role: string };
  client: {
    name: string;
    status: string;
    email: string;
    phone: string;
    company: string;
    joined: string;
    profession: string;
    gender: string;
    age: string;
    bio: string;
  };
  appUser: { name: string };
  mobileCoach: { name: string };
  tabs: string[];
  metrics: {
    resilienceStage: { value: number; max: number; label: string };
    resilienceScore: { value: number; max: number };
    overallWellness: number;
    habitCompletion: { done: number; total: number };
    dailyHabits: { done: number; total: number };
    burnoutScale: { value: number; max: number };
    resilienceLevel: { value: number; max: number };
  };
  coachingTopics: {
    title: string;
    priority: "High" | "Medium" | "Low";
    date: string;
  }[];
  assignedItems: { title: string; status: string }[];
  vitals: { label: string; color: string }[];
  wellnessStages: string[];
  drivers: { name: string; value: number }[];
  chat: ChatMessage[];
  habits: {
    name: string;
    frequency: string;
    days: string[];
    activeDay: string;
    done: boolean;
  }[];
  priorities: { name: string; description: string }[];
  reflections: { label: string; text: string }[];
  sliders: { name: string; description: string; value: number }[];
  assessment: {
    title: string;
    question: string;
    scale: { value: number; label: string }[];
  };
  testimonial: { quote: string; author: string; role: string };
};

export type CaseStudyDetail = CaseStudyListing & {
  slug: string;
  disciplines: string[];
  accent: string;
  sections: CaseStudySection[];
  testimonial: { quote: string; author: string; role: string };
  product?: CaseStudyProductSample;
  prev: CaseStudyAdjacent;
  next: CaseStudyAdjacent;
};

const PL = "/case-studies/prescribe-life";

const prescribeLifeProduct: CaseStudyProductSample = {
  productName: "PrescribeLife.AI",
  copilotName: "Preslie.AI™",
  brandFont: "Space Grotesk",
  brandMessage:
    "Daily support that reinforces coaching priorities between sessions",
  coach: { name: "Alec Duncan", role: "Senior Coach" },
  client: {
    name: "Mark Scott",
    status: "Active",
    email: "mark.scott@abccorp.com",
    phone: "+41 2235 11231",
    company: "ABC",
    joined: "Oct 1, 2023",
    profession: "Leadership Advisor",
    gender: "Male",
    age: "42",
    bio: "Executive coach working across EMEA leadership teams, focused on recovery, resilience, and sustainable high performance.",
  },
  appUser: { name: "Holly" },
  mobileCoach: { name: "Dr. David Wallace" },
  tabs: [
    "Overview",
    "Wellness Dashboard",
    "Health Metrics",
    "Insights",
    "Coaching",
  ],
  metrics: {
    resilienceStage: { value: 23, max: 40, label: "Potential Burnout" },
    resilienceScore: { value: 8.0, max: 10 },
    overallWellness: 47,
    habitCompletion: { done: 9, total: 15 },
    dailyHabits: { done: 1, total: 5 },
    burnoutScale: { value: 11, max: 20 },
    resilienceLevel: { value: 10, max: 20 },
  },
  coachingTopics: [
    { title: "Preparation Anxiety", priority: "Medium", date: "12 Jun 2025" },
    { title: "Follow-up Fatigue", priority: "Low", date: "14 Jun 2025" },
    { title: "Post meeting Stress", priority: "High", date: "17 Jun 2025" },
  ],
  assignedItems: [
    {
      title: "Try this: Pause before reacting in the next high-stakes meeting",
      status: "In progress",
    },
    {
      title: "Log one energy dip and what preceded it",
      status: "Assigned",
    },
  ],
  vitals: [
    { label: "Activity", color: "#ffffff" },
    { label: "Sleep", color: "#60a5fa" },
    { label: "Readiness", color: "#facc15" },
    { label: "Wellbeing", color: "#c084fc" },
  ],
  wellnessStages: [
    "Burnout",
    "Overextended",
    "Maintenance",
    "Recovery",
    "Flourishing",
  ],
  drivers: [
    { name: "Physical Health", value: 0.72 },
    { name: "Mental Health", value: 0.48 },
    { name: "Emotional Health", value: 0.61 },
  ],
  chat: [
    {
      from: "ai",
      text: "Hey Holly! What's top of mind for you today?",
    },
    {
      from: "user",
      text: "I have so much work to do, not sure where to start",
    },
    {
      from: "ai",
      text: "Sounds like a lot on your plate — let's simplify. Here are some tips you can try:",
      tips: [
        "Tackle your hardest task first: Starting with the toughest task clears mental space and builds momentum for the rest of the day.",
        "Block 45 minutes for focused work: Give yourself an uninterrupted window to dive deep — no distractions, just progress.",
        "End the day by prioritizing tomorrow: Spend a few minutes planning your next day so you start with clarity.",
      ],
    },
    {
      from: "user",
      text: "Thanks! that is very helpful",
    },
  ],
  habits: [
    {
      name: "Yoga class",
      frequency: "5x/week",
      days: ["M", "T", "W", "T", "F", "S", "S"],
      activeDay: "M",
      done: true,
    },
    {
      name: "Meditate for 5 mins",
      frequency: "7x/week",
      days: ["M", "T", "W", "T", "F", "S", "S"],
      activeDay: "M",
      done: true,
    },
  ],
  priorities: [
    {
      name: "Mental Priming",
      description:
        "Begin the day with clear intention and mindset prep to focus attention and align actions.",
    },
    {
      name: "Recovery / Rest",
      description:
        "Take breaks and structured time to down-regulate the nervous system and restore capacity.",
    },
    {
      name: "Sleep Quality",
      description:
        "Safe, consistent, restorative sleep to support cognitive performance, mood and physical recovery.",
    },
    {
      name: "Nutritional Strategy",
      description: "Fuel daily and post-workout with mostly whole foods.",
    },
  ],
  reflections: [
    {
      label: "Intentions",
      text: "Protect energy by limiting calls after 5pm.",
    },
    {
      label: "Win",
      text: "Early 1 hour activity goal achieved.",
    },
    {
      label: "Gratitude",
      text: "Learned to appreciate better recovery windows.",
    },
  ],
  sliders: [
    {
      name: "Mental Priming",
      description:
        "Begins the day with clear intention and mindset prep to focus attention and align actions.",
      value: 3.5,
    },
    {
      name: "Sleep Quality",
      description:
        "Gets consistent, restorative sleep to support cognitive performance, mood & physical recovery.",
      value: 5.5,
    },
  ],
  assessment: {
    title: "Burnout assessment",
    question: "I often feel emotionally drained after a typical workday.",
    scale: [
      { value: 0, label: "Not true at all" },
      { value: 1, label: "Rarely true" },
      { value: 2, label: "Sometimes true" },
      { value: 3, label: "Often true" },
      { value: 4, label: "True nearly all the time" },
    ],
  },
  testimonial: {
    quote:
      "Preslie felt like it was developed completely from imagination at first but then as we started seeing more and more.",
    author: "Oli Johnson",
    role: "Client",
  },
};

function rangesFor(count: number): ScrollRange[] {
  const step = 1 / count;
  return Array.from({ length: count }, (_, i) => {
    const start = i * step;
    const end = i === count - 1 ? 1 : (i + 1) * step;
    return [start, end];
  });
}

function buildSections({
  visuals,
  screens,
  closing,
  title,
  paragraphs,
  narrative,
  experience,
}: {
  visuals: [string, string, string, string];
  screens: [string, string, string];
  closing: string;
  title: string;
  paragraphs: string[];
  narrative: { headline: string; body: string };
  experience: { kicker: string; headline: string; body: string };
}): CaseStudySection[] {
  const ranges = rangesFor(8);
  return [
    {
      id: "hero",
      type: "hero",
      range: ranges[0],
      title,
      paragraphs,
      visual: visuals[0],
    },
    {
      id: "featured",
      type: "featured",
      range: ranges[1],
      visual: visuals[1],
    },
    {
      id: "narrative",
      type: "narrative",
      range: ranges[2],
      headline: narrative.headline,
      body: narrative.body,
      visual: visuals[2],
    },
    {
      id: "experience",
      type: "experience",
      range: ranges[3],
      kicker: experience.kicker,
      headline: experience.headline,
      body: experience.body,
      visual: visuals[3],
    },
    ...screens.map((visual, index) => ({
      id: `showcase-${index + 1}`,
      type: "showcase" as const,
      range: ranges[4 + index],
      visual,
    })),
    {
      id: "closing",
      type: "closing",
      range: ranges[7],
      visual: closing,
    },
  ];
}

type CaseStudyRecord = Omit<CaseStudyDetail, "prev" | "next">;

const records: CaseStudyRecord[] = [
  {
    slug: "prescribe-life",
    img: "/projects/demo/pl.png",
    name: "Prescribe Life",
    category: "Web App",
    disciplines: [
      "Product Design",
      "Web Design",
      "Web Development",
      "Rebranding",
    ],
    accent: "#e11d8f",
    product: prescribeLifeProduct,
    testimonial: prescribeLifeProduct.testimonial,
    sections: buildSections({
      visuals: [
        `${PL}/01-hero.png`,
        `${PL}/02-featured.png`,
        `${PL}/03-narrative.png`,
        `${PL}/04-experience.png`,
      ],
      screens: [
        `${PL}/05-mobile-home.png`,
        `${PL}/06-widgets.png`,
        `${PL}/07-app-flows.png`,
      ],
      closing: `${PL}/08-gallery.png`,
      title: "Prescribe Life",
      paragraphs: [
        "PrescribeLife.AI is a performance intelligence platform for leadership coaches, using behavioral science, biometric data, and AI to surface what's affecting a client's resilience, recovery, and wellbeing between sessions.",
        "Its AI co-pilot Preslie.AI™ tracks patterns, flags risks, and delivers personalized micro-strategies, while coaches get a full 360° portal view of client goals, habits, and readiness to coach smarter and prevent burnout.",
      ],
      narrative: {
        headline:
          "Making healthcare feel more human without making it less intelligent.",
        body: "Health technology often leans heavily into clinical visual language. For Resilience Coach, we wanted to move in a different direction: an experience that could communicate trust and intelligence while still feeling warm, approachable and deeply human. The visual language became a balance between clarity and emotion, structure and softness, intelligence and calm.",
      },
      experience: {
        kicker: "Smart Coaching Experience",
        headline: "AI wasn't added to the product. It shaped the experience.",
        body: "Rather than treating AI as another feature competing for attention, we explored how intelligence could quietly work across the experience: interpreting patterns, personalising interactions and helping surface meaningful information when it matters. The challenge was making something inherently complex feel almost effortless to use.",
      },
    }),
  },
  {
    slug: "reform-ai",
    img: "/flip.png",
    name: "Reform AI",
    category: "UI/UX",
    disciplines: [
      "Product Design",
      "Web Design",
      "Web Development",
      "Rebranding",
    ],
    accent: "#cd1717",
    testimonial: {
      quote:
        "Reform went from a dense research tool to something our operators actually open every morning.",
      author: "Lena Ortiz",
      role: "Head of Product",
    },
    sections: buildSections({
      visuals: ["/flip.png", "/flip.png", "/flip.png", "/flip.png"],
      screens: ["/flip.png", "/flip.png", "/flip.png"],
      closing: "/flip.png",
      title: "Reform AI",
      paragraphs: [
        "Reform AI helps policy and operations teams turn unstructured documents into decisions they can act on, without losing the nuance that usually dies in a spreadsheet.",
        "We rebuilt the workspace around review, confidence, and exception handling so experts stay in the loop while the model does the heavy lifting.",
      ],
      narrative: {
        headline: "Make the machine feel like a colleague, not a black box.",
        body: "The original product buried answers under model metadata. We inverted the hierarchy: a human-readable recommendation first, evidence second, and model internals only when someone asks. Trust came from pacing, not from dumping more charts on the page.",
      },
      experience: {
        kicker: "Guided Review",
        headline: "The interface got quieter so the work could get sharper.",
        body: "Every screen now has a single job: capture a document, resolve an exception, or confirm a recommendation. AI sits in the margins until it has something worth interrupting for.",
      },
    }),
  },
  {
    slug: "quicli",
    img: "/sample.png",
    name: "Quicli",
    category: "Mobile App",
    disciplines: [
      "Product Design",
      "Web Design",
      "Web Development",
      "Rebranding",
    ],
    accent: "#f59e0b",
    testimonial: {
      quote:
        "Quicli finally feels like the product we described in the first workshop — fast, opinionated, and a little bit fun.",
      author: "Priya Menon",
      role: "Founder",
    },
    sections: buildSections({
      visuals: ["/sample.png", "/sample.png", "/sample.png", "/sample.png"],
      screens: ["/sample.png", "/sample.png", "/sample.png"],
      closing: "/sample.png",
      title: "Quicli",
      paragraphs: [
        "Quicli is a mobile command layer for service businesses that live in WhatsApp threads and forgotten CRMs. One gesture captures the job, the client, and the next step.",
        "We designed a thumb-first system that keeps the full picture one swipe away: schedule, payments, and a running log of what was promised.",
      ],
      narrative: {
        headline: "Speed is a design material, not a performance metric.",
        body: "Field teams do not have a spare hand or a spare minute. We stripped chrome, grew tap targets, and made the most common actions feel like muscle memory instead of navigation.",
      },
      experience: {
        kicker: "Field OS",
        headline: "If it takes more than two taps, it does not ship.",
        body: "The product is a stack of short loops: create, confirm, collect, close. Notifications are written like a colleague tapping you on the shoulder, not a system shouting for attention.",
      },
    }),
  },
  {
    slug: "dd-group",
    img: "/about2.png",
    name: "DD Group",
    category: "Branding",
    disciplines: [
      "Product Design",
      "Web Design",
      "Web Development",
      "Rebranding",
    ],
    accent: "#a3a3a3",
    testimonial: {
      quote:
        "The new identity finally matches how the firm actually behaves: precise, calm, and a little unexpected.",
      author: "Daniel Scott",
      role: "CEO",
    },
    sections: buildSections({
      visuals: ["/about2.png", "/about2.png", "/about2.png", "/about2.png"],
      screens: ["/about2.png", "/about2.png", "/about2.png"],
      closing: "/about2.png",
      title: "DD Group",
      paragraphs: [
        "DD Group needed a brand system that could travel from boardrooms to building sites without looking like two different companies.",
        "We rebuilt the identity around a tighter wordmark, a quieter palette, and a digital language that treats every property as a story instead of a listing.",
      ],
      narrative: {
        headline: "Restraint reads as confidence when the work is this large.",
        body: "The previous brand competed with the architecture. We pulled color back, let photography lead, and designed type that holds up on a site hoarding and a 13-inch laptop alike.",
      },
      experience: {
        kicker: "Spatial Identity",
        headline: "The website is a showroom, not a brochure.",
        body: "Each project opens like a physical walkthrough: material, light, then the brief. Motion is used to reveal space, not to decorate empty modules.",
      },
    }),
  },
  {
    slug: "kommerz-os",
    img: "/careersstuff/2.png",
    name: "Kommerz OS",
    category: "Web App",
    disciplines: [
      "Product Design",
      "Web Design",
      "Web Development",
      "Rebranding",
    ],
    accent: "#22c55e",
    testimonial: {
      quote:
        "Kommerz OS stopped feeling like a back office and started feeling like a product our merchants are proud to open.",
      author: "Ravi Kapoor",
      role: "COO",
    },
    sections: buildSections({
      visuals: [
        "/careersstuff/2.png",
        "/careersstuff/2.png",
        "/careersstuff/2.png",
        "/careersstuff/2.png",
      ],
      screens: [
        "/careersstuff/2.png",
        "/careersstuff/2.png",
        "/careersstuff/2.png",
      ],
      closing: "/careersstuff/2.png",
      title: "Kommerz OS",
      paragraphs: [
        "Kommerz OS is an operating layer for multi-brand retail: inventory, storefronts, and finance in one place that does not feel like an ERP from 2014.",
        "We redesigned the information architecture around the merchant's day — what moved, what stalled, and what needs a human — instead of around database tables.",
      ],
      narrative: {
        headline: "Complexity can be honest without being hostile.",
        body: "Retail operators live in exceptions. We designed dense screens that still breathe: color for status, type for hierarchy, and empty space only where a decision needs room.",
      },
      experience: {
        kicker: "Merchant Console",
        headline: "One surface for stock, storefront, and cash.",
        body: "Instead of bouncing between tools, merchants get a single timeline of the business. Alerts are clustered by action, not by which microservice happened to fire.",
      },
    }),
  },
  {
    slug: "sochcast-campus-gal",
    img: "/placeholder.png",
    name: "Sochcast/Campus Gal",
    category: "Graphics",
    disciplines: [
      "Product Design",
      "Web Design",
      "Web Development",
      "Rebranding",
    ],
    accent: "#8b5cf6",
    testimonial: {
      quote:
        "The campaign finally looked like the community it was speaking to — loud, specific, and impossible to scroll past.",
      author: "Ananya Rao",
      role: "Creative Director",
    },
    sections: buildSections({
      visuals: [
        "/placeholder.png",
        "/placeholder.png",
        "/placeholder.png",
        "/placeholder.png",
      ],
      screens: ["/placeholder.png", "/placeholder.png", "/placeholder.png"],
      closing: "/placeholder.png",
      title: "Sochcast/Campus Gal",
      paragraphs: [
        "Campus Gal needed a visual system that could move from podcast covers to campus takeovers without losing the voice that made the show matter.",
        "We built a graphic language of cropped portraits, electric type, and stickers that feel collected rather than designed.",
      ],
      narrative: {
        headline: "Youth culture is not a filter you apply at the end.",
        body: "The work started with how students already remix the show. We turned those instincts into a kit: type lockups, collage rules, and motion that can be handed to a campus chapter without a 40-page PDF.",
      },
      experience: {
        kicker: "Campaign System",
        headline: "Every asset is a poster, even when it is a story.",
        body: "Stories, merch, and episode art share the same crop logic and the same attitude. The brand is allowed to be messy, as long as it is recognisable from across a quad.",
      },
    }),
  },
  {
    slug: "zimkey",
    img: "/careersstuff/1.png",
    name: "Zimkey",
    category: "Mobile App",
    disciplines: [
      "Product Design",
      "Web Design",
      "Web Development",
      "Rebranding",
    ],
    accent: "#38bdf8",
    testimonial: {
      quote:
        "Zimkey now feels like the key itself: small, certain, and gone the moment you do not need it.",
      author: "Noah Park",
      role: "Product Lead",
    },
    sections: buildSections({
      visuals: [
        "/careersstuff/1.png",
        "/careersstuff/1.png",
        "/careersstuff/1.png",
        "/careersstuff/1.png",
      ],
      screens: [
        "/careersstuff/1.png",
        "/careersstuff/1.png",
        "/careersstuff/1.png",
      ],
      closing: "/careersstuff/1.png",
      title: "Zimkey",
      paragraphs: [
        "Zimkey is a mobile access product for homes and small sites. Unlocking should feel as obvious as pulling a physical key from a pocket.",
        "We redesigned the app around a single primary action, with everything else — guests, logs, devices — one layer underneath.",
      ],
      narrative: {
        headline: "Security products fail when they feel like security products.",
        body: "People hesitate when a lock looks complicated. We used large, physical motion, plain language, and a home screen that has almost nothing on it besides the door in front of you.",
      },
      experience: {
        kicker: "Access Loop",
        headline: "Unlock, share, forget.",
        body: "Guest access is a timed card, not a settings maze. Logs are written in sentences. The app gets out of the way the second the door opens.",
      },
    }),
  },
];

export const caseStudyListings: CaseStudyListing[] = records.map(
  ({ img, name, category }) => ({ img, name, category }),
);

export function getCaseStudySlugs() {
  return records.map((record) => record.slug);
}

export function getCaseStudy(slug: string): CaseStudyDetail | undefined {
  const index = records.findIndex((record) => record.slug === slug);
  if (index < 0) return undefined;

  const study = records[index];
  const prev = records[(index - 1 + records.length) % records.length];
  const next = records[(index + 1) % records.length];

  return {
    ...study,
    prev: { slug: prev.slug, name: prev.name, img: prev.img },
    next: { slug: next.slug, name: next.name, img: next.img },
  };
}
