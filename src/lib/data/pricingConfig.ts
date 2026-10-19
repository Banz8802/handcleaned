import pricingRatesData from "./pricingRates.json";

export interface PricingRatesConfig {
  extraFullBathroomFee: number;
  extraHalfBathroomFee: number;
  contractedBathrooms: {
    studio: number;
    oneBed: number;
    twoPlusBeds: number;
  };
  deepCleanExtraBedroom: {
    extraBedroomFee: number;
    includedBedrooms: number;
  };
  storeySurcharges: {
    standardTwoStorey: number;
    standardThreeStorey: number;
    deepTwoStorey: number;
    deepThreeStorey: number;
  };
  hourlyRates: {
    regularCleaningPerHour: number;
    deepCleaningPerHour: number;
    commercialCleaningPerHour: number;
  };
  updatedAt?: string;
  updatedBy?: string;
}

export const DEFAULT_PRICING_RATES: PricingRatesConfig = pricingRatesData as PricingRatesConfig;

export function getPricingRates(): PricingRatesConfig {
  return DEFAULT_PRICING_RATES;
}

/**
 * Parses bathroom input to a standard numeric float (e.g. "3+" -> 3, "2.5" -> 2.5).
 */
export function parseBathrooms(bathrooms: string | number): number {
  if (typeof bathrooms === "number") return bathrooms;
  const cleaned = String(bathrooms).replace("+", "").trim();
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 1 : parsed;
}

/**
 * Resolves the contracted bathroom allowance for a given property/bedroom string.
 */
export function getContractedBathrooms(
  bedroomsOrPropertyType: string,
  rates: PricingRatesConfig = getPricingRates()
): number {
  if (!bedroomsOrPropertyType) return rates.contractedBathrooms.oneBed;
  const normalized = bedroomsOrPropertyType.toLowerCase();

  if (normalized.includes("studio")) {
    return rates.contractedBathrooms.studio;
  }
  if (normalized.startsWith("1") || normalized.includes("1 bed")) {
    return rates.contractedBathrooms.oneBed;
  }
  return rates.contractedBathrooms.twoPlusBeds;
}

/**
 * Calculates excess bathroom fee based on configured full and half bathroom surcharges.
 */
export function calculateExtraBathroomFee(
  bedroomsOrPropertyType: string,
  bathrooms: string | number,
  rates: PricingRatesConfig = getPricingRates()
): number {
  const parsedBaths = parseBathrooms(bathrooms);
  const contracted = getContractedBathrooms(bedroomsOrPropertyType, rates);
  const excess = Math.max(0, parsedBaths - contracted);

  if (excess <= 0) return 0;

  const fullBaths = Math.floor(excess);
  const halfBaths = Math.round((excess - fullBaths) * 2);

  return (
    fullBaths * rates.extraFullBathroomFee +
    halfBaths * rates.extraHalfBathroomFee
  );
}
