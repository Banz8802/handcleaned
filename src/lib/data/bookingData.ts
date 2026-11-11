import {
  DEFAULT_AIRBNB_PRICING_CARDS,
  type PropertyType,
  type StoreyType,
} from "./airbnbPricing";
import { DEFAULT_RESIDENTIAL_PACKAGES } from "./residentialPricing";
import { DEFAULT_COMMERCIAL_PACKAGE, DEFAULT_LINEN_HIRE_PACKAGES } from "./commercialPricing";
import type { BookingService, BookingPackage } from "@/lib/types/booking";

export const AVAILABLE_SERVICES: BookingService[] = [
  {
    id: "airbnb-cleaning",
    name: "Airbnb Cleaning",
    shortDescription: "Professional departure turnover, midstay linen change, and deep setup cleaning.",
    badge: "Most Popular",
    iconName: "home",
    isAvailable: true,
  },
  {
    id: "residential-cleaning",
    name: "Residential Cleaning",
    shortDescription: "Regular recurring home cleaning and end-of-lease deep sanitization.",
    badge: "Available",
    iconName: "sparkles",
    isAvailable: true,
  },
  {
    id: "commercial-cleaning",
    name: "Commercial Cleaning",
    shortDescription: "Tailored office and commercial property cleaning schedules across Sydney.",
    badge: "Available",
    iconName: "building",
    isAvailable: true,
  },
  {
    id: "linen-hire",
    name: "Linen Hire",
    shortDescription: "5-star hotel quality linen supply and laundry management for hosts.",
    badge: "Add-on",
    iconName: "towel",
    isAvailable: true,
  },
];

export const TIME_SLOTS = [
  "08:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
];

export const BEDROOM_OPTIONS = [
  { label: "Studio", value: "Studio", propertyType: "Studio" as PropertyType },
  { label: "1 Bed", value: "1", propertyType: "1 Bed + 1 to 1.5 Bath" as PropertyType },
  { label: "2 Bed", value: "2", propertyType: "2 Bed + 1 to 2 Bath" as PropertyType },
  { label: "3 Bed", value: "3", propertyType: "3 Bed + 1 to 2 Bath" as PropertyType },
  { label: "4 Bed", value: "4", propertyType: "4 Bed + 1 to 2 Bath" as PropertyType },
  { label: "5 Bed", value: "5", propertyType: "5 Bed + 1 to 2 Bath" as PropertyType },
];

export const BATHROOM_OPTIONS = ["1", "1.5", "2", "2.5", "3", "3.5", "4+"];

import {
  type PricingRatesConfig,
  getPricingRates,
  parseBathrooms,
  getContractedBathrooms,
  calculateExtraBathroomFee,
} from "./pricingConfig";

export {
  type PricingRatesConfig,
  getPricingRates,
  parseBathrooms,
  getContractedBathrooms,
  calculateExtraBathroomFee,
};

export const STOREY_OPTIONS: { label: string; value: StoreyType }[] = [
  { label: "Single Storey", value: "Single" },
  { label: "Two Storey", value: "Two-Storey" },
  { label: "Three Storey", value: "Three-Storey" },
];

/**
 * Maps bedroom selection to official `PropertyType` key from `airbnbPricing.ts`
 */
export function getMappedPropertyType(bedrooms: string): PropertyType {
  const matched = BEDROOM_OPTIONS.find((opt) => opt.value === bedrooms || opt.label === bedrooms);
  return matched ? matched.propertyType : "1 Bed + 1 to 1.5 Bath";
}

/**
 * Returns package options tailored to the selected service.
 */
export function getPackagesForService(
  serviceId: string,
  rates: PricingRatesConfig = getPricingRates()
): BookingPackage[] {
  switch (serviceId) {
    case "residential-cleaning":
      return DEFAULT_RESIDENTIAL_PACKAGES.map((pkg) => ({
        id: pkg.id,
        serviceId: "residential-cleaning",
        name: pkg.name,
        badge: pkg.badge,
        isPopular: pkg.isPopular,
        shortDescription: pkg.shortDescription,
        inclusions: pkg.inclusions,
        ratePerCleanerPerHour:
          pkg.id === "regular"
            ? (rates.hourlyRates?.regularCleaningPerHour ?? pkg.ratePerCleanerPerHour)
            : (rates.hourlyRates?.deepCleaningPerHour ?? pkg.ratePerCleanerPerHour),
      }));

    case "commercial-cleaning":
      return [
        {
          id: DEFAULT_COMMERCIAL_PACKAGE.id,
          serviceId: "commercial-cleaning",
          name: DEFAULT_COMMERCIAL_PACKAGE.name,
          badge: "Office Sanitization",
          isPopular: true,
          shortDescription: DEFAULT_COMMERCIAL_PACKAGE.shortDescription,
          inclusions: DEFAULT_COMMERCIAL_PACKAGE.inclusions,
          ratePerCleanerPerHour:
            rates.hourlyRates?.commercialCleaningPerHour ?? DEFAULT_COMMERCIAL_PACKAGE.ratePerCleanerPerHour,
        },
      ];

    case "linen-hire":
      return DEFAULT_LINEN_HIRE_PACKAGES.map((pkg) => {
        const rateKey = pkg.id === "king-linen" ? "kingLinen" : pkg.id === "single-linen" ? "singleLinen" : "poolTowel";
        const linenRate = rates.linenHireRates?.[rateKey];
        const price = linenRate?.price ?? pkg.price;
        const dailyLateFee = linenRate?.dailyLateFee ?? pkg.dailyLateFee ?? 0;
        return {
          id: pkg.id,
          serviceId: "linen-hire",
          name: pkg.name,
          badge: pkg.rentalPeriod || pkg.gstNote,
          isPopular: pkg.id === "king-linen",
          shortDescription: `Hotel quality 7-day rental linen set. Daily late fee: $${dailyLateFee.toFixed(2)}. All prices ${pkg.gstNote.toLowerCase()}.`,
          inclusions: pkg.inclusions.map((inc) => `${inc.item} (${inc.count})`),
          price,
        };
      });

    case "airbnb-cleaning":
    default:
      return DEFAULT_AIRBNB_PRICING_CARDS.map((pkg) => ({
        id: pkg.id,
        serviceId: "airbnb-cleaning",
        name: pkg.name,
        badge: pkg.badge,
        isPopular: pkg.isPopular,
        shortDescription: pkg.shortDescription,
        inclusions: pkg.inclusions,
        prices: pkg.prices,
      }));
  }
}

/**
 * Resolves exact calculated price for a pricing package card based on property type, storey, and cleaners count.
 */
export function calculatePackagePrice(
  pkg: BookingPackage,
  propertyType: PropertyType,
  storey: StoreyType,
  cleanersCount: number = 1,
  bathrooms?: string | number,
  rates: PricingRatesConfig = getPricingRates()
): number {
  let basePrice = 150.0;

  // Fixed price packages (e.g. Linen Hire)
  if (pkg.price !== undefined) {
    return pkg.price;
  }

  // Hourly rate packages (e.g. Residential, Commercial)
  if (pkg.ratePerCleanerPerHour !== undefined) {
    const hours = 2; // default 2 hours per session
    basePrice = pkg.ratePerCleanerPerHour * Math.max(1, cleanersCount) * hours;
  } else if (pkg.prices) {
    // Tiered Airbnb pricing matrix
    const propertyPrices = pkg.prices[propertyType];
    if (propertyPrices) {
      if (propertyPrices[storey] !== undefined) {
        basePrice = propertyPrices[storey]!;
      } else if (propertyPrices["Single"] !== undefined) {
        basePrice = propertyPrices["Single"]!;
      } else if (propertyPrices["Two-Storey"] !== undefined) {
        basePrice = propertyPrices["Two-Storey"]!;
      } else if (propertyPrices["Three-Storey"] !== undefined) {
        basePrice = propertyPrices["Three-Storey"]!;
      }
    }
  }

  // Add extra bathroom surcharge if bathrooms count is provided and exceeds contracted allowance
  if (bathrooms !== undefined && pkg.serviceId !== "linen-hire") {
    const extraBathroomFee = calculateExtraBathroomFee(propertyType, bathrooms, rates);
    return basePrice + extraBathroomFee;
  }

  return basePrice;
}

export function getAirbnbPackages(): BookingPackage[] {
  return getPackagesForService("airbnb-cleaning");
}
