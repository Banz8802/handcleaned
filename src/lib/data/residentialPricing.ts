// ---------------------------------------------------------------------------
// Residential Cleaning Data Contract & Admin CMS Interface
// ---------------------------------------------------------------------------

export interface ResidentialPackageConfig {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  ratePerCleanerPerHour: number;
  shortDescription: string;
  inclusions: string[];
}

export const DEFAULT_RESIDENTIAL_PACKAGES: ResidentialPackageConfig[] = [
  {
    id: "regular-cleaning",
    name: "Regular Cleaning",
    badge: "Popular for Weekly / Fortnightly Cleans",
    isPopular: true,
    ratePerCleanerPerHour: 60,
    shortDescription: "Routine home cleaning to keep your living space consistently clean, fresh, and welcoming.",
    inclusions: [
      "Dusting & wiping all reachable surfaces",
      "Vacuuming & mopping all floors",
      "Bathroom & toilet sanitization",
      "Kitchen benchtop & sink cleaning",
      "Emptying trash bins & light bed making",
    ],
  },
  {
    id: "deep-cleaning",
    name: "Deep Cleaning",
    badge: "Recommended for First Time & Seasonal Cleans",
    ratePerCleanerPerHour: 68,
    shortDescription: "Comprehensive deep sanitization focusing on stubborn grime, high-touch points, and detailed areas.",
    inclusions: [
      "Detailed dusting of high & low surfaces",
      "Deep scrub of bathrooms, tiles & shower screen",
      "Kitchen stovetop, splashback & cabinet exteriors",
      "Wiping skirting boards, door frames & light switches",
      "Cobweb removal & interior window sills",
    ],
  },
];

export interface CleanerRateOption {
  cleaners: number;
  regularHourlyTotal: number;
  deepHourlyTotal: number;
}

export const DEFAULT_CLEANER_RATES: CleanerRateOption[] = [
  { cleaners: 1, regularHourlyTotal: 60, deepHourlyTotal: 68 },
  { cleaners: 2, regularHourlyTotal: 120, deepHourlyTotal: 136 },
  { cleaners: 3, regularHourlyTotal: 180, deepHourlyTotal: 204 },
  { cleaners: 4, regularHourlyTotal: 240, deepHourlyTotal: 272 },
  { cleaners: 5, regularHourlyTotal: 300, deepHourlyTotal: 340 },
];

export async function getResidentialPricingData() {
  return {
    packages: DEFAULT_RESIDENTIAL_PACKAGES,
    cleanerRates: DEFAULT_CLEANER_RATES,
  };
}
