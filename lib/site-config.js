export const siteConfig = {
  name: "AGUKA Financial Group",
  shortName: "AGUKA",
  tagline: "Building and Protecting What Matters Most",
  description:
    "Insurance, mortgage solutions support and tax services with clear, personal guidance for individuals, families, and small businesses in Irving, Texas.",
  url: "https://www.agukafinancial.com",
  phone: "502-212-0201",
  phoneHref: "tel:+15022120201",
  email: "info@agukafinancial.com",
  address: {
    line1: "7301 N State Highway 161 #148",
    line2: "Irving, TX 75039",
  },
  license: {
    npn: "19907163",
    agent: "Paul R. Kempton, MBA | NMLS #2593958",
    broker: "Loan Factory | NMLS #320841",
  },
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact Us", href: "/#contact" },
];

// TODO: replace with AGUKA Financial Group's real social profile URLs.
export const socialLinks = [
  { label: "Facebook", href: "#", icon: "Facebook" },
  { label: "Instagram", href: "#", icon: "Instagram" },
  { label: "LinkedIn", href: "#", icon: "Linkedin" },
];

export const values = [
  "Integrity",
  "Transparency",
  "Professionalism",
  "Heart of Service",
];

export const personalLinesCoverage = [
  "Auto",
  "Home",
  "Boat",
  "Earthquake",
  "Equipment Breakdown",
  "Flood",
  "Motorcycle",
  "Pet",
  "Property",
  "Recreational Vehicle",
  "Umbrella",
  "Cyber Liability",
];

export const serviceOptions = [
  { group: null, options: ["General Consultation"] },
  {
    group: "Life",
    options: [
      "Life",
      "Life: Term",
      "Life: Universal",
      "Life: IUL",
      "Life: Fixed Annuities",
    ],
  },
  {
    group: "Personal Lines",
    options: [
      "Personal Lines",
      ...personalLinesCoverage.map((item) => `Personal Lines: ${item}`),
    ],
  },
  { group: "Commercial Lines", options: ["Commercial Lines"] },
  { group: null, options: ["Tax Services", "Others"] },
];

export const taxSupportOptions = [
  "Individual tax preparation",
  "Small-business tax preparation",
  "Year-round tax support",
  "Not sure yet",
];

export const preferredContactOptions = ["Phone call", "Email", "Text message"];

export const insuranceServicePrefix = /^(Life|Personal Lines|Commercial Lines)(:|$)/;

export const lifeInsuranceApplyUrl = "https://app.back9ins.com/apply/PaulKempton";

// Placeholder quotes — swap in real, permissioned client testimonials before launch.
export const testimonials = [
  {
    quote:
      "They walked us through every option in plain language and never pushed a policy we didn't need. We finally feel like our family is properly covered.",
    name: "Personal Lines Client",
    role: "Irving, TX",
  },
  {
    quote:
      "Fast, clear communication from the first call to closing. Questions were answered the same day, every time.",
    name: "Mortgage Client",
    role: "Dallas-Fort Worth, TX",
  },
  {
    quote:
      "As a small business owner, I needed someone who could explain commercial coverage without the jargon. That's exactly what I got.",
    name: "Small Business Owner",
    role: "Irving, TX",
  },
];
