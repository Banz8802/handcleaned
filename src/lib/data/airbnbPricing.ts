// ---------------------------------------------------------------------------
// Airbnb Pricing Data Contract & Admin CMS Migration Interface
//
// When the future Admin Dashboard / CMS is connected, replace the static default
// constants with API calls or database queries inside `getAirbnbPricingData()`.
// ---------------------------------------------------------------------------

export type PropertyType =
  | "Studio"
  | "1 Bed + 1 to 1.5 Bath"
  | "2 Bed + 1 to 2 Bath"
  | "3 Bed + 1 to 2 Bath"
  | "4 Bed + 1 to 2 Bath"
  | "5 Bed + 1 to 2 Bath";

export type StoreyType = "Single" | "Two-Storey" | "Three-Storey";

export interface PricingCardConfig {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  shortDescription: string;
  inclusions: string[];
  prices: Record<PropertyType, Partial<Record<StoreyType, number>>>;
}

export interface PricingMatrixRow {
  type: string;
  departure: string;
  midstayLinen: string;
  midstayOnly: string;
  deep: string;
}

export const DEFAULT_PROPERTY_TYPES: PropertyType[] = [
  "Studio",
  "1 Bed + 1 to 1.5 Bath",
  "2 Bed + 1 to 2 Bath",
  "3 Bed + 1 to 2 Bath",
  "4 Bed + 1 to 2 Bath",
  "5 Bed + 1 to 2 Bath",
];

export const DEFAULT_STOREY_TYPES: StoreyType[] = ["Single", "Two-Storey", "Three-Storey"];

export const DEFAULT_AIRBNB_PRICING_CARDS: PricingCardConfig[] = [
  {
    id: "departure",
    name: "Airbnb Departure Cleaning",
    badge: "Most Popular",
    isPopular: true,
    shortDescription: "Complete turnover clean after guest checkout to prepare for your next guests.",
    inclusions: [
      "Full departure turnover clean",
      "Fresh bed linen placement & bed making",
      "Bathroom & kitchen sanitization",
      "Restock guest amenities & essentials",
      "Trash removal & host inspection ready",
    ],
    prices: {
      Studio: { Single: 123.0 },
      "1 Bed + 1 to 1.5 Bath": { Single: 135.54, "Two-Storey": 156.54 },
      "2 Bed + 1 to 2 Bath": { Single: 161.6, "Two-Storey": 182.6 },
      "3 Bed + 1 to 2 Bath": { Single: 191.6, "Two-Storey": 212.6, "Three-Storey": 233.6 },
      "4 Bed + 1 to 2 Bath": { Single: 221.6, "Two-Storey": 242.6, "Three-Storey": 263.6 },
      "5 Bed + 1 to 2 Bath": { Single: 256.0, "Two-Storey": 277.0, "Three-Storey": 298.0 },
    },
  },
  {
    id: "midstay-linen",
    name: "Airbnb Midstay (Linen Changeover)",
    shortDescription: "Mid-stay refresh for longer guest stays including full linen & towel swap.",
    inclusions: [
      "Mid-stay guest property refresh",
      "Full bed linen changeover",
      "Fresh bath towel placement",
      "Light surface dusting & floor vacuum",
      "Bathroom & kitchen quick tidy",
    ],
    prices: {
      Studio: { Single: 123.0 },
      "1 Bed + 1 to 1.5 Bath": { Single: 135.54, "Two-Storey": 156.54 },
      "2 Bed + 1 to 2 Bath": { Single: 161.6, "Two-Storey": 182.6 },
      "3 Bed + 1 to 2 Bath": { Single: 191.6, "Two-Storey": 212.6, "Three-Storey": 233.6 },
      "4 Bed + 1 to 2 Bath": { Single: 221.6, "Two-Storey": 242.6, "Three-Storey": 263.6 },
      "5 Bed + 1 to 2 Bath": { Single: 256.0, "Two-Storey": 277.0, "Three-Storey": 298.0 },
    },
  },
  {
    id: "midstay-only",
    name: "Airbnb Midstay Cleaning Only",
    shortDescription: "Surface refresh clean during extended stays (without linen swap).",
    inclusions: [
      "Surface refresh during guest stay",
      "Vacuum & mop high traffic floors",
      "Bathroom surface wipe & sanitize",
      "Kitchen counter & sink tidy up",
      "Empty trash & replenish paper products",
    ],
    prices: {
      Studio: { Single: 118.4 },
      "1 Bed + 1 to 1.5 Bath": { Single: 115.0, "Two-Storey": 120.4 },
      "2 Bed + 1 to 2 Bath": { Single: 145.6, "Two-Storey": 166.6 },
      "3 Bed + 1 to 2 Bath": { Single: 167.6, "Two-Storey": 188.6, "Three-Storey": 209.6 },
      "4 Bed + 1 to 2 Bath": { Single: 189.6, "Two-Storey": 210.6, "Three-Storey": 236.6 },
      "5 Bed + 1 to 2 Bath": { Single: 216.0, "Two-Storey": 237.0, "Three-Storey": 258.0 },
    },
  },
  {
    id: "initial-deep",
    name: "Airbnb Initial / Deep Cleaning",
    badge: "Recommended for New Listings",
    shortDescription: "Comprehensive deep setup clean to launch new listings or seasonal deep resets.",
    inclusions: [
      "First-time listing setup & deep clean",
      "Comprehensive deep sanitization",
      "Oven, rangehood & appliance detailing",
      "Inside cupboards & drawers wiped",
      "Skirting boards & high-touch point detail",
    ],
    prices: {
      Studio: { Single: 220.46 },
      "1 Bed + 1 to 1.5 Bath": { Single: 253.02, "Two-Storey": 284.52 },
      "2 Bed + 1 to 2 Bath": { Single: 302.54, "Two-Storey": 334.54 },
      "3 Bed + 1 to 2 Bath": { Single: 359.54, "Two-Storey": 391.04, "Three-Storey": 422.54 },
      "4 Bed + 1 to 2 Bath": { Single: 416.54, "Two-Storey": 448.04, "Three-Storey": 479.54 },
      "5 Bed + 1 to 2 Bath": { Single: 481.9, "Two-Storey": 513.4, "Three-Storey": 544.9 },
    },
  },
];

export const DEFAULT_PRICING_MATRIX: PricingMatrixRow[] = [
  {
    type: "Studio",
    departure: "$123.00",
    midstayLinen: "$123.00",
    midstayOnly: "$118.40",
    deep: "$220.46",
  },
  {
    type: "1 Bed + 1 to 1.5 Bath",
    departure: "$135.54 – $156.54",
    midstayLinen: "$135.54 – $156.54",
    midstayOnly: "$115.00 – $120.40",
    deep: "$253.02 – $284.52",
  },
  {
    type: "2 Bed + 1 to 2 Bath",
    departure: "$161.60 – $182.60",
    midstayLinen: "$161.60 – $182.60",
    midstayOnly: "$145.60 – $166.60",
    deep: "$302.54 – $334.54",
  },
  {
    type: "3 Bed + 1 to 2 Bath",
    departure: "$191.60 – $233.60",
    midstayLinen: "$191.60 – $233.60",
    midstayOnly: "$167.60 – $209.60",
    deep: "$359.54 – $422.54",
  },
  {
    type: "4 Bed + 1 to 2 Bath",
    departure: "$221.60 – $263.60",
    midstayLinen: "$221.60 – $263.60",
    midstayOnly: "$189.60 – $236.60",
    deep: "$416.54 – $479.54",
  },
  {
    type: "5 Bed + 1 to 2 Bath",
    departure: "$256.00 – $298.00",
    midstayLinen: "$256.00 – $298.00",
    midstayOnly: "$216.00 – $258.00",
    deep: "$481.90 – $544.90",
  },
];

/**
 * Data fetcher wrapper for Airbnb pricing.
 * When backend CMS integration is ready, replace this logic with API / database fetch calls.
 */
export async function getAirbnbPricingData() {
  // TODO (Future Admin Backend): Fetch from DB or CMS API endpoint e.g., /api/admin/airbnb-pricing
  return {
    pricingCards: DEFAULT_AIRBNB_PRICING_CARDS,
    propertyTypes: DEFAULT_PROPERTY_TYPES,
    storeyTypes: DEFAULT_STOREY_TYPES,
    pricingMatrix: DEFAULT_PRICING_MATRIX,
  };
}
