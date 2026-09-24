import { autoHomeCoverage, commercialLinesCoverage } from "@/lib/site-config";

// Kinyarwanda copy for the default services, keyed by their English title.
// Seeded into the database once (see lib/db.js) and used by the fallback list
// in lib/services.js; after that, admins edit it from the dashboard.
const autoHomeCoverageRw = {
  Auto: "Imodoka",
  Homeowners: "Ba nyir'amazu",
  Renters: "Abakodesha",
  Condo: "Inzu z'amagorofa (Condo)",
  Landlord: "Abakodesha amazu yabo (Landlord)",
  "Umbrella Insurance": "Ubwishingizi bw'inyongera (Umbrella)",
};

const commercialLinesCoverageRw = {
  "Commercial Auto Insurance": "Ubwishingizi bw'imodoka z'ubucuruzi",
  "Commercial Property / Building Insurance": "Ubwishingizi bw'imitungo n'inyubako by'ubucuruzi",
  "General Liability Insurance": "Ubwishingizi bw'uburyozwe rusange",
  "Business Owners Policy (BOP)": "Amasezerano ahuriweho ya ba nyir'ubucuruzi (BOP)",
  "Contractor Insurance": "Ubwishingizi bw'abakora imirimo y'ubwubatsi",
  "Workers' Compensation Insurance": "Ubwishingizi bw'abakozi (Workers' Compensation)",
  "Equipment & Business Assets Coverage": "Ubwishingizi bw'ibikoresho n'imitungo y'ubucuruzi",
  "Professional Liability (E&O)": "Ubwishingizi bw'uburyozwe mu mwuga (E&O)",
  "Cyber Liability": "Ubwishingizi bw'uburyozwe ku ikoranabuhanga (Cyber)",
  "Umbrella Insurance": "Ubwishingizi bw'inyongera (Umbrella)",
  Other: "Ibindi",
};

const noPressureRw =
  "Nta gahato, nta gusunikwa, kandi nta mafaranga yihishe. Ntabwo tugurisha amakuru yawe, kandi ntuzigera uhamagarwa n'abacuruzi cyangwa ngo wakire ubutumwa bw'ubwamamare budakenewe, turabyemeza.";

export const SERVICE_TRANSLATIONS_RW = {
  Life: {
    title: "Ubwishingizi bw'Ubuzima",
    description:
      "Gereranya ibiciro nyabyo by'ubwishingizi bw'ubuzima ako kanya, biturutse ku bigo by'ubwishingizi bikomeye, mu minota mike. Nta nimero ya telefoni cyangwa imeri bisabwa, turabyemeza. Nta imeri z'ubwamamare, nta guhamagarwa n'abacuruzi, kandi nta gahato. Igihe witeguye, saba kuri interineti maze wemererwe mu minota mike ku masezerano amwe n'amwe.",
    ctaLabel: "Saba ubwishingizi bw'ubuzima",
    accordionItems: [],
  },
  "Auto & Home": {
    title: "Imodoka n'Inzu",
    description: `Uzuza ifishi ngufi maze abakozi bacu bafite impushya bagukorere akazi. Tuzagereranya ibiciro by'ibigo by'ubwishingizi bikomeye tuguhe ibiciro by'ubwishingizi bw'imodoka n'inzu bijyanye n'ibyo ukeneye n'ubushobozi bwawe. ${noPressureRw}`,
    ctaLabel: "Reba ubwoko bw'ubwishingizi",
    accordionItems: autoHomeCoverage.map((item) => autoHomeCoverageRw[item] || item),
  },
  "Commercial Lines": {
    title: "Ubwishingizi bw'Ubucuruzi",
    description: `Uzuza ifishi ngufi uyohereze ku itsinda ryacu. Tuzagereranya ubwishingizi n'ibiciro by'ibigo bikomeye by'ubwishingizi bw'ubucuruzi kugira ngo tubone uburinzi bukwiye ubucuruzi bwawe. ${noPressureRw} Ubwishingizi burimo ${commercialLinesCoverage
      .map((item) => commercialLinesCoverageRw[item] || item)
      .join(", ")}.`,
    ctaLabel: "Saba igiciro cy'ubucuruzi",
    accordionItems: [],
  },
  "Tax & Financial Services": {
    title: "Imisoro na Serivisi z'Imari",
    description:
      "Ishimire serivisi zacu zo gutegura imenyekanisha ry'umusoro ku nyungu n'ubufasha umwaka wose. Ibiciro byacu bidahinduka bivuze ko nta bitunguranye. Twishingira akazi kacu dutanga ibaruwa yemeza kubahiriza amabwiriza ya IRS n'ukuri kw'imibare, kugira ngo ugire amahoro, nta kiguzi cy'inyongera.",
    ctaLabel: "Gereranya igiciro cyo gutegura imisoro",
    accordionItems: [],
  },
  "Mortgage Support": {
    title: "Ubufasha ku Nguzanyo z'Amazu",
    description:
      "Menya serivisi z'ubufasha ku nguzanyo z'amazu zitangwa n'umukozi ufite uruhushya rwo gutegura inguzanyo z'amazu, akorera mu kigo cy'ubuhuza cyemewe (NMLS #320841). Ukanze link iri hasi, uzoherezwa ku rubuga rw'undi muntu, kandi uzagengwa n'amabwiriza ye y'ibanga n'imikoreshereze.",
    ctaLabel: "Saba Igiciro ku Buntu",
    accordionItems: [],
  },
};
