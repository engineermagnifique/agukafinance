export const siteConfig = {
  name: "AGUKA Financial Group",
  shortName: "AGUKA",
  tagline: "Building & Protecting Wealth at an Affordable Cost",
  description:
    "Insurance, mortgage solutions support and tax services with clear, personal guidance for individuals, families, and small businesses in Irving, Texas.",
  url: "https://www.agukafinancial.com",
  phone: "502-212-0201",
  phoneHref: "tel:+15022120201",
  email: "info@agukafinancial.com",
  address: {
    line1: "4157 Northgate Dr # 1035",
    line2: "Irving, TX 75062",
  },
  license: {
    npn: "22335901 | 19907136",
    ptin: "P02296897",
    agent: "Paul R. Kempton | NMLS #2593958",
    broker: "Loan Factory | NMLS #320841",
  },
};

// `key` looks up the translated label in the dictionary's `nav` section.
export const navLinks = [
  { key: "home", label: "Home", href: "/" },
  { key: "about", label: "About", href: "/about" },
  { key: "services", label: "Services", href: "/services" },
  { key: "contact", label: "Contact Us", href: "/#contact" },
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
  "Affordability",
];

export const autoHomeCoverage = [
  "Auto",
  "Homeowners",
  "Renters",
  "Condo",
  "Landlord",
  "Umbrella Insurance",
];

export const commercialLinesCoverage = [
  "Commercial Auto Insurance",
  "Commercial Property / Building Insurance",
  "General Liability Insurance",
  "Business Owners Policy (BOP)",
  "Contractor Insurance",
  "Workers' Compensation Insurance",
  "Equipment & Business Assets Coverage",
  "Professional Liability (E&O)",
  "Cyber Liability",
  "Umbrella Insurance",
  "Other",
];

export const commercialLinesQuoteUrl =
  "https://esales.farmers.com/quote/business/business-info";

export const taxSupportOptions = [
  "Individual tax preparation",
  "Small-business tax preparation",
  "Year-round tax support",
  "Not sure yet",
];

export const preferredContactOptions = ["Phone call", "Email", "Text message"];

export const insuranceInterestOptions = ["Life", "Auto", "Home", "Commercial Lines"];

export const financialInterestOptions = [
  "Income Tax Preparation",
  "Mortgage Pre-Approval Support",
  "Others",
];

export const attachmentAccept = ".pdf,.png,.jpg,.jpeg";
export const attachmentMaxBytes = 5 * 1024 * 1024; // 5MB

export const lifeInsuranceApplyUrl = "https://app.back9ins.com/apply/PaulKempton";

export const mortgagePortalUrl = "https://www.loanfactory.com/paulkempton";
