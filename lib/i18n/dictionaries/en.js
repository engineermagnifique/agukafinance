// English copy for the public site. Every key here must also exist in rw.js.
// Placeholders like {name} are filled in with format() from lib/i18n/config.js.
const en = {
  common: {
    skipToContent: "Skip to content",
    closeDialog: "Close dialog",
    logoHome: "{name} home",
    contactUs: "Contact Us",
    breadcrumb: "Breadcrumb",
  },

  language: {
    label: "Language",
    switchTo: "Switch language to {language}",
  },

  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    contact: "Contact Us",
    primary: "Primary",
    mobilePrimary: "Mobile primary",
    openNav: "Open navigation",
    closeNav: "Close navigation",
    getQuote: "Get a Free Quote",
    scheduleConsultation: "Schedule a Free Consultation",
    call: "Call {phone}",
  },

  meta: {
    tagline: "Building & Protecting Wealth at an Affordable Cost",
    description:
      "Insurance, mortgage solutions support and tax services with clear, personal guidance for individuals, families, and small businesses in Irving, Texas.",
    homeTitle: "Insurance, Mortgage & Tax Services in Irving, TX",
    aboutTitle: "About AGUKA Financial Group LLC",
    aboutDescription:
      "AGUKA Financial Group LLC (“AFG”) is an independent insurance and financial solutions support firm that puts the client's interest first.",
    servicesTitle: "Insurance, Mortgage & Tax Services",
    servicesDescription: "Explore {name}'s insurance, mortgage and tax services support.",
    privacyTitle: "Privacy Policy",
    privacyDescription: "How {name} collects, uses and protects your information.",
    termsTitle: "Terms of Service",
    termsDescription: "The terms that govern your use of {name}'s website.",
    accessibilityTitle: "Accessibility Statement",
    accessibilityDescription: "{name}'s commitment to a website usable by everyone.",
    unsubscribeTitle: "Unsubscribe",
  },

  hero: {
    badge: "Insurance. Taxes. Financial Services.",
    titleLead: "Building and",
    titleFlip: "Protecting",
    titleLine2: "What Matters Most",
    subtitle:
      "Personalized trusted insurance and financial product strategies delivered with professionalism, transparency and honesty.",
    cta: "Check Quote Today",
    experience: "Backed by 5+ years of professional experience",
    imageAlt: "A family standing in front of their home at sunset, arms around each other",
  },

  servicesSection: {
    eyebrow: "HOW WE CAN HELP",
    title: "Insurance, Tax & Mortgage Support",
  },

  serviceCard: {
    viewMore: "View more",
    learnMore: "Learn more",
    requestInformation: "Request information",
    viewCoverage: "View coverage options",
  },

  trust: {
    eyebrow: "MESSAGE OF THE MONTH",
    message:
      "In the pursuit of your dreams, financial security, personal dignity, and family legacy, wealth creation and wealth protection go hand in hand. Whether you are building a career, growing a business, planning for retirement, creating generational wealth, or acquiring valuable assets, protecting those achievements is just as important as building them. Properly structured insurance coverage can serve as a vital shield, helping safeguard what matters most today while preserving the foundation of your legacy for generations to come.",
    founderRole: "Founder, AGUKA Financial Group",
    imageAlt: "A family smiling together in front of their home and cars in the driveway",
  },

  contact: {
    eyebrow: "LET’S CONNECT",
    title: "Start with a simple conversation",
    intro:
      "Give us a call or send us a text message or fill out the free consultation form, our representative will be more than happy to help.",
    callUs: "Call us",
    emailUs: "Email us",
    visitUs: "Visit us",
  },

  form: {
    modalTitle: "Request a free consultation",
    eyebrow: "FREE CONSULTATION",
    title: "How can we help?",
    insurances: "Insurances",
    financialServices: "Financial Services",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone",
    coverageLabel: "What would you like to protect?",
    coveragePlaceholder: "Tell us briefly about your coverage needs.",
    taxSupportLabel: "Tax support needed",
    preferredContact: "Preferred contact method",
    messageLabel: "Anything else we should know?",
    messagePlaceholder: "Optional — add any extra details.",
    attachLabel: "Attach a file (optional)",
    attachHint: "PDF, PNG or JPEG, up to 5MB.",
    removeAttachment: "Remove attachment",
    attachmentType: "Attachments must be a PDF, PNG or JPEG file.",
    attachmentSize: "Attachments must be 5MB or smaller.",
    honeypot: "Leave this field empty",
    consent:
      "I agree to be contacted about my request. Submitting this form does not create a client relationship or guarantee eligibility, coverage, rates, or tax outcomes.",
    submit: "Request Free Consultation →",
    submitting: "Sending…",
    success: "Thank you. Your free consultation request was sent to AGUKA Financial Group.",
    genericError: "Something went wrong.",
    fallbackError:
      "We could not send your request. Please email info@agukafinancial.com or call 502-212-0201.",
  },

  // Labels for option values. The values themselves stay in English because
  // they are stored with each request and read by the team in the dashboard.
  options: {
    Life: "Life",
    Auto: "Auto",
    Home: "Home",
    "Commercial Lines": "Commercial Lines",
    "Income Tax Preparation": "Income Tax Preparation",
    "Mortgage Pre-Approval Support": "Mortgage Pre-Approval Support",
    Others: "Others",
    "Individual tax preparation": "Individual tax preparation",
    "Small-business tax preparation": "Small-business tax preparation",
    "Year-round tax support": "Year-round tax support",
    "Not sure yet": "Not sure yet",
    "Phone call": "Phone call",
    Email: "Email",
    "Text message": "Text message",
    "General Consultation": "General Consultation",
  },

  newsletter: {
    eyebrow: "STAY INFORMED",
    titleLine1: "Stay updated in your inbox",
    titleLine2: "with AGUKA Financial",
    subtitle: "Stay informed with AGUKA Financial Group services.",
    emailLabel: "Email address",
    placeholder: "Enter email",
    subscribe: "Subscribe",
    subscribing: "Subscribing…",
    success: "Thanks for subscribing!",
    genericError: "Something went wrong.",
    fallbackError: "We could not subscribe you. Please try again.",
  },

  unsubscribe: {
    eyebrow: "NEWSLETTER",
    title: "Unsubscribe from our newsletter",
    intro: "Click the button below to stop receiving newsletter emails at {email}.",
    button: "Unsubscribe",
    success: "You have been unsubscribed. You will no longer receive our newsletter.",
    invalid: "This unsubscribe link is invalid or has expired. Please contact us and we'll remove you.",
    backHome: "Back to home",
  },

  cookie: {
    label: "Cookie consent",
    message:
      "We use cookies to understand site traffic and improve your experience. You can accept or reject non-essential cookies at any time.",
    reject: "Reject",
    accept: "Accept",
  },

  footer: {
    quickLinks: "Quick Links",
    ourServices: "Our Services",
    contactUs: "Contact Us",
    legal: "Legal",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    accessibility: "Accessibility Statement",
    contact: "Contact",
    city: "Irving, Texas",
    license: "License Information",
    nmls: "NMLS Consumer Access",
    equalHousing: "Equal Housing Opportunity",
    disclaimer:
      "Insurance products and availability vary by state and carrier. Coverage is subject to underwriting, policy terms, conditions and exclusions. Tax services do not constitute legal advice. AGUKA Financial Group is neither a carrier nor a bank or lender.",
    mortgageLabel: "Mortgage disclosure:",
    mortgageDisclosure:
      "Mortgage services are provided by a licensed mortgage loan originator through an approved mortgage broker firm. The third-party rate link opens a separate website. Programs, rates and eligibility are subject to lender guidelines and approval. AGUKA Financial Group supports the Equal Credit Opportunity Act and the Fair Housing Act.",
    copyright: "© {year} AGUKA Financial Group.",
    poweredBy: "Powered by Magnifique N",
  },

  about: {
    eyebrow: "ABOUT US",
    title: "About AGUKA Financial Group LLC",
    breadcrumb: "About",
    sectionEyebrow: "ABOUT AGUKA FINANCIAL GROUP LLC",
    heading:
      "AGUKA Financial Group LLC (“AFG”) is an independent insurance and financial solutions support firm that puts the client's interest first.",
    intro:
      "It was created to help individuals, families, and small businesses across the American communities we serve to navigate insurance and financial growth decisions with confidence.",
    visionLabel: "VISION",
    vision:
      "To become the most trusted and reliable independent one-stop-hub for affordable insurance and financial products for the American communities we serve.",
    missionLabel: "MISSION",
    mission:
      "To provide transparent, and/or educate, affordable insurance and financial strategies that equip families and small businesses with the means to accelerate their financial growth.",
    mottoLabel: "MOTTO",
    motto: "Build & Protect Wealth at an Affordable Cost.",
    coreValues: "Core Values",
    values: {
      Integrity: "Integrity",
      Transparency: "Transparency",
      Professionalism: "Professionalism",
      Affordability: "Affordability",
    },
    pledgeTitle: "Our Pledge",
    pledge:
      "We are committed to affordability, honesty, transparency, and professionalism. Our goal is to give every client clear, honest guidance that helps reduce costs and supports long-term financial stability — always presented as options for your consideration, with the final decision resting with you.",
  },

  servicesPage: {
    eyebrow: "OUR SERVICES",
    title: "Insurance, Mortgage & Tax Services",
    subtitle: "Explore how we can help you protect what matters and plan ahead with confidence.",
    ctaTitle: "Are you ready to get started?",
    ctaText:
      "Reach out for a free, no-pressure consultation and let’s find the right coverage for you.",
  },

  legal: {
    eyebrow: "LEGAL",
    lastUpdated: "Last updated: January 2026",
    contactHeading: "Contact Us",
    or: "or",
  },

  privacy: {
    title: "Privacy Policy",
    intro:
      "{name} (“AGUKA,” “we,” “us” or “our”) respects your privacy. This policy explains what information we collect through {url}, how we use it, and the choices available to you.",
    sections: [
      {
        heading: "Information We Collect",
        paragraphs: [
          "When you submit a consultation request or subscribe to our newsletter, we collect the information you provide, such as your name, email address, phone number, and the service you are interested in. We also automatically collect limited technical information (such as page visited and referring URL) to help us understand how our site is used, subject to your cookie preferences.",
        ],
      },
      {
        heading: "How We Use Your Information",
        paragraphs: [
          "We use the information we collect to respond to your requests, provide the insurance, mortgage and tax services support you ask about, send newsletter updates you opt into, and improve our website. We do not sell your personal information.",
        ],
      },
      {
        heading: "Cookies",
        paragraphs: [
          "We use cookies to support basic site functionality and, with your consent, to understand site traffic. You can accept or reject non-essential cookies at any time using the cookie banner displayed on your first visit.",
        ],
      },
      {
        heading: "Third Parties",
        paragraphs: [
          "Some requests (for example, life insurance applications or mortgage rate lookups) are completed on a third-party partner’s website. Those sites have their own privacy practices, which we encourage you to review.",
        ],
      },
      {
        heading: "Your Choices",
        paragraphs: [
          "You may ask us to update or delete the information we hold about you, or unsubscribe from newsletter emails at any time, by contacting us using the details below.",
        ],
      },
    ],
    contact: "Questions about this policy can be sent to",
  },

  terms: {
    title: "Terms of Service",
    intro:
      "These Terms of Service govern your use of {url}. By using this site, you agree to these terms. If you do not agree, please do not use the site.",
    sections: [
      {
        heading: "No Professional Advice",
        paragraphs: [
          "Content on this site is provided for general informational purposes only and does not constitute insurance, financial, tax or legal advice. Submitting a form does not create a client relationship or guarantee eligibility, coverage, rates or tax outcomes. Insurance and mortgage products are subject to underwriting, carrier and lender approval.",
        ],
      },
      {
        heading: "Company Disclaimer",
        paragraphs: [
          "{name} is an independent insurance and financial services support limited liability company. AGUKA is not a bank, lender, depository financial institution, mortgage broker, or insurance carrier. AGUKA does not directly fund loans, make credit decisions, underwrite insurance, issue insurance policies, or pay insurance claims.",
          "Mortgage loan origination services are provided by a licensed mortgage loan originator through and under the supervision of an approved sponsoring mortgage broker or lender. All mortgage applications, products, interest rates, terms, disclosures, underwriting decisions, approvals, and closing services are provided or managed through the sponsoring mortgage company and applicable third parties. Submitting an inquiry or application does not guarantee loan approval or constitute a commitment to lend. Loan programs, rates, terms, and eligibility requirements are subject to change and depend on the applicant’s qualifications and applicable underwriting guidelines.",
          "Insurance services are provided through appropriately licensed insurance producers and authorized insurance carriers. AGUKA may assist clients with exploring coverage options and completing applications but does not make final underwriting decisions, determine premiums, guarantee coverage, issue policies, or pay claims. Insurance products and availability vary by state and carrier. All coverage is subject to underwriting, policy terms, conditions, limitations, and exclusions. Coverage is not effective or bound until confirmed in writing by the applicable insurance carrier or its authorized representative.",
          "AFG does not provide advice or recommendations regarding securities, stocks, mutual funds, or other investment products unless a separate client relationship has been established with a properly licensed investment adviser and all required disclosures have been provided. Any such investment advisory services are offered solely through the applicable licensed entity and are subject to separate agreements and regulatory requirements.",
          "Services are offered only where properly licensed and authorized. Information provided by AGUKA is for general educational and informational purposes and should not be considered a guarantee of financing, insurance coverage, rates, premiums, benefits, or financial results.",
        ],
      },
      {
        heading: "Use of This Site",
        paragraphs: [
          "You agree to use this site only for lawful purposes and not to interfere with its operation, attempt unauthorized access, or submit false information through our forms.",
        ],
      },
      {
        heading: "Intellectual Property",
        paragraphs: [
          "The content, logo and design of this site are owned by {name} and may not be reproduced without permission.",
        ],
      },
      {
        heading: "Third-Party Links",
        paragraphs: [
          "This site may link to third-party websites (such as a life insurance carrier’s application portal). We are not responsible for the content or practices of those sites.",
        ],
      },
      {
        heading: "Limitation of Liability",
        paragraphs: [
          "To the fullest extent permitted by law, {name} is not liable for any indirect or consequential damages arising from your use of this site.",
        ],
      },
      {
        heading: "Governing Law",
        paragraphs: [
          "These terms are governed by the laws of the State of Texas, without regard to conflict-of-law principles.",
        ],
      },
    ],
    contact: "Questions about these terms can be sent to",
  },

  accessibility: {
    title: "Accessibility Statement",
    intro:
      "{name} is committed to making {url} usable by everyone, including people with disabilities, in line with the Americans with Disabilities Act (ADA) and the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA.",
    sections: [
      {
        heading: "Our Approach",
        paragraphs: [
          "We aim to provide clear navigation, readable text and color contrast, keyboard-accessible controls, and descriptive labels for interactive elements such as forms and buttons.",
        ],
      },
      {
        heading: "Ongoing Work",
        paragraphs: [
          "Accessibility is an ongoing effort. As we add or update features, we review them for usability across assistive technologies, including screen readers.",
        ],
      },
    ],
    contactHeading: "Feedback",
    contact:
      "If you encounter a barrier using this site, please let us know so we can address it. Contact us at",
  },

  api: {
    invalidBody: "Invalid request body.",
    captcha: "We could not verify you're human. Please try again.",
    required: "Please complete all required fields.",
    consent: "Please agree to be contacted before submitting.",
    invalidEmail: "Please provide a valid email address.",
    sendFailed: "We could not send your request. Please call us instead.",
    subscribeFailed: "We could not save your subscription. Please try again.",
  },

  // Strings for the ALTCHA captcha widget. English ships with the widget, so
  // this is only registered for other languages (see components/ui/altcha.js).
  altcha: null,
};

export default en;
