import { useTransform } from "motion/react";

export type CircularTestimonial = {
  name: string;
  testimonial: string;
  image: string;
};

export const circularTestimonials: CircularTestimonial[] = [
  {
    name: "james cordon",
    testimonial:
      "Working with Asymmetry felt like having a top-tier product team on demand. Sharp ideas, smooth execution, zero drama. Loved the process.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "maya ellison",
    testimonial:
      "Working with this team has completely transformed our digital presence. Their attention to detail and commitment to quality is unmatched.",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    name: "noah park",
    testimonial:
      "Their innovative strategies helped us grow our customer base faster than we imagined. Highly professional and reliable.",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    name: "sara nguyen",
    testimonial:
      "From start to finish, the experience was seamless. The results exceeded our expectations in every way.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "eli roth",
    testimonial:
      "A truly outstanding service. Their expertise and dedication made a significant impact on our business growth.",
    image: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    name: "priya shah",
    testimonial:
      "We saw immediate improvements after implementing their solutions. The team is knowledgeable and easy to work with.",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
  },
  {
    name: "lucas meyer",
    testimonial:
      "Their sprint-based process kept us aligned and shipping every week. It felt like our internal team got stronger overnight.",
    image: "https://randomuser.me/api/portraits/men/57.jpg",
  },
  {
    name: "ava chen",
    testimonial:
      "We needed clarity, speed, and polish. They delivered all three with a calm, collaborative workflow from kickoff to launch.",
    image: "https://randomuser.me/api/portraits/women/9.jpg",
  },
];

export function returnTestimonials({
  pageScroll,
  isCompact,
  tabletBelowFoldPx,
}: {
  pageScroll: any;
  isCompact: any;
  tabletBelowFoldPx: any;
}) {
  const testimonialLayerY0 = useTransform(
    pageScroll,
    [0, 0.8, 0.86],
    isCompact
      ? [tabletBelowFoldPx + 112, tabletBelowFoldPx + 112, 0]
      : [1040, 1040, 0],
  );
  const testimonialLayerY1 = useTransform(
    pageScroll,
    [0, 0.802, 0.862],
    isCompact
      ? [tabletBelowFoldPx + 88, tabletBelowFoldPx + 88, 0]
      : [980, 980, 0],
  );
  const testimonialLayerY2 = useTransform(
    pageScroll,
    [0, 0.804, 0.864],
    isCompact
      ? [tabletBelowFoldPx + 132, tabletBelowFoldPx + 132, 0]
      : [1120, 1120, 0],
  );
  const testimonialLayerY3 = useTransform(
    pageScroll,
    [0, 0.806, 0.866],
    isCompact
      ? [tabletBelowFoldPx + 72, tabletBelowFoldPx + 72, 0]
      : [960, 960, 0],
  );
  const testimonialLayerY4 = useTransform(
    pageScroll,
    [0, 0.808, 0.868],
    isCompact
      ? [tabletBelowFoldPx + 124, tabletBelowFoldPx + 124, 0]
      : [1080, 1080, 0],
  );
  const testimonialLayerY5 = useTransform(
    pageScroll,
    [0, 0.81, 0.86],
    isCompact
      ? [tabletBelowFoldPx + 56, tabletBelowFoldPx + 56, 0]
      : [920, 920, 0],
  );
  const testimonialLayerY6 = useTransform(
    pageScroll,
    [0, 0.812, 0.87],
    isCompact
      ? [tabletBelowFoldPx + 148, tabletBelowFoldPx + 148, 0]
      : [1160, 1160, 0],
  );
  const testimonialLayerY7 = useTransform(
    pageScroll,
    [0, 0.814, 0.859],
    isCompact
      ? [tabletBelowFoldPx + 68, tabletBelowFoldPx + 68, 0]
      : [940, 940, 0],
  );
  const testimonialLayerY8 = useTransform(
    pageScroll,
    [0, 0.8, 0.86],
    isCompact
      ? [tabletBelowFoldPx + 96, tabletBelowFoldPx + 96, 0]
      : [1020, 1020, 0],
  );

  return [
    {
      company: "TechNova Solutions",
      testimonial:
        "Working with this team has completely transformed our digital presence. Their attention to detail and commitment to quality is unmatched.",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      layerY: testimonialLayerY0,
    },
    {
      company: "GreenLeaf Marketing",
      testimonial:
        "Their innovative strategies helped us grow our customer base faster than we imagined. Highly professional and reliable.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      layerY: testimonialLayerY1,
    },
    {
      company: "UrbanBuild Co.",
      testimonial:
        "From start to finish, the experience was seamless. The results exceeded our expectations in every way.",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      layerY: testimonialLayerY2,
    },
    {
      company: "FinEdge Consulting",
      testimonial:
        "A truly outstanding service. Their expertise and dedication made a significant impact on our business growth.",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      layerY: testimonialLayerY3,
    },
    {
      company: "BrightPath Education",
      testimonial:
        "We saw immediate improvements after implementing their solutions. The team is knowledgeable and easy to work with.",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
      layerY: testimonialLayerY4,
    },
    {
      company: "BlueOrbit Labs",
      testimonial:
        "Their sprint-based process kept us aligned and shipping every week. It felt like our internal team got stronger overnight.",
      image: "https://randomuser.me/api/portraits/men/11.jpg",
      layerY: testimonialLayerY5,
    },
    {
      company: "Lumen Health",
      testimonial:
        "We needed clarity, speed, and polish. They delivered all three with a calm, collaborative workflow from kickoff to launch.",
      image: "https://randomuser.me/api/portraits/women/9.jpg",
      layerY: testimonialLayerY6,
    },
    {
      company: "Northline Retail",
      testimonial:
        "The redesign helped customers find products faster and boosted conversions right away. The quality of execution was excellent.",
      image: "https://randomuser.me/api/portraits/men/57.jpg",
      layerY: testimonialLayerY7,
    },
    {
      company: "Astra Mobility",
      testimonial:
        "They translated complex technical requirements into a product experience that feels simple, fast, and dependable.",
      image: "https://randomuser.me/api/portraits/women/30.jpg",
      layerY: testimonialLayerY8,
    },
  ];
}
