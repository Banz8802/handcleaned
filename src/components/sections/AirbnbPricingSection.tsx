'use client';

import { useState } from "react";
import {
  type PropertyType,
  type StoreyType,
  type PricingCardConfig,
  DEFAULT_PROPERTY_TYPES as PROPERTY_TYPES,
  DEFAULT_STOREY_TYPES as STOREY_TYPES,
  DEFAULT_AIRBNB_PRICING_CARDS as PRICING_CARDS,
} from "@/lib/data/airbnbPricing";

export type { PropertyType, StoreyType, PricingCardConfig };

interface AirbnbPricingSectionProps {
  onSelectOption?: (optionName: string, price: number, propertyType: string) => void;
}

export default function AirbnbPricingSection({ onSelectOption }: AirbnbPricingSectionProps) {
  const [selectedProperty, setSelectedProperty] = useState<PropertyType>("1 Bed + 1 to 1.5 Bath");
  const [selectedStorey, setSelectedStorey] = useState<StoreyType>("Single");

  // Determine available storeys for the selected property type
  const isTwoStoreyAvailable = selectedProperty !== "Studio";
  const isThreeStoreyAvailable =
    selectedProperty === "3 Bed + 1 to 2 Bath" ||
    selectedProperty === "4 Bed + 1 to 2 Bath" ||
    selectedProperty === "5 Bed + 1 to 2 Bath";

  const handlePropertyChange = (prop: PropertyType) => {
    setSelectedProperty(prop);
    if (prop === "Studio") {
      setSelectedStorey("Single");
    } else if (
      selectedStorey === "Three-Storey" &&
      prop !== "3 Bed + 1 to 2 Bath" &&
      prop !== "4 Bed + 1 to 2 Bath" &&
      prop !== "5 Bed + 1 to 2 Bath"
    ) {
      setSelectedStorey("Two-Storey");
    }
  };

  const handleReserve = (cardName: string, calculatedPrice: number) => {
    if (onSelectOption) {
      onSelectOption(cardName, calculatedPrice, selectedProperty);
    }
    const targetSection = document.getElementById("contact") || document.getElementById("services");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#contact";
    }
  };

  return (
    <section
      id="pricing"
      className="relative w-full bg-white py-20 lg:py-28 overflow-hidden"
      aria-labelledby="airbnb-pricing-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-[#2CBAE8] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
            Transparent Airbnb Pricing
          </span>
          <h2
            id="airbnb-pricing-heading"
            className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A2E44] leading-tight tracking-tight max-w-[700px] mx-auto mb-4"
          >
            Airbnb Cleaning Pricing Options
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-[620px] mx-auto leading-relaxed">
            Select your property size and storey configuration below to calculate exact turnover costs across our 4 tailored cleaning packages.
          </p>
        </div>

        {/* ── Interactive Property & Storey Controls ────────────────────────── */}
        <div className="bg-[#EBF6FB] rounded-2xl p-6 sm:p-8 mb-14 border border-[#2CBAE8]/20 shadow-sm max-w-[960px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Property Size Selector */}
            <div className="w-full md:w-3/5">
              <label htmlFor="property-size-select" className="block text-xs font-bold uppercase tracking-wider text-[#1A2E44] mb-2">
                1. Select Property Size:
              </label>
              <div className="relative">
                <select
                  id="property-size-select"
                  value={selectedProperty}
                  onChange={(e) => handlePropertyChange(e.target.value as PropertyType)}
                  className="w-full appearance-none bg-white text-[#1A2E44] font-semibold text-sm px-4 py-3 pr-10 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2CBAE8] cursor-pointer shadow-xs"
                >
                  {PROPERTY_TYPES.map((prop) => (
                    <option key={prop} value={prop}>
                      {prop}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center">
                  <svg className="w-4 h-4 text-[#2CBAE8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Storey Selector */}
            <div className="w-full md:w-2/5">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#1A2E44] mb-2">
                2. Select Storey:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStorey("Single")}
                  className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all ${
                    selectedStorey === "Single"
                      ? "bg-[#2CBAE8] text-white shadow-md shadow-[#2CBAE8]/20"
                      : "bg-white text-[#1A2E44] hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  Single
                </button>
                <button
                  type="button"
                  disabled={!isTwoStoreyAvailable}
                  onClick={() => setSelectedStorey("Two-Storey")}
                  className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all ${
                    !isTwoStoreyAvailable
                      ? "opacity-40 cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-200"
                      : selectedStorey === "Two-Storey"
                      ? "bg-[#2CBAE8] text-white shadow-md shadow-[#2CBAE8]/20"
                      : "bg-white text-[#1A2E44] hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  2-Storey
                </button>
                <button
                  type="button"
                  disabled={!isThreeStoreyAvailable}
                  onClick={() => setSelectedStorey("Three-Storey")}
                  className={`py-2.5 px-3 text-xs font-bold rounded-xl transition-all ${
                    !isThreeStoreyAvailable
                      ? "opacity-40 cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-200"
                      : selectedStorey === "Three-Storey"
                      ? "bg-[#2CBAE8] text-white shadow-md shadow-[#2CBAE8]/20"
                      : "bg-white text-[#1A2E44] hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  3-Storey
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4 Pricing Cards Grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-6 items-stretch">
          {PRICING_CARDS.map((card) => {
            const sizePrices = card.prices[selectedProperty] || {};
            let currentPrice = sizePrices[selectedStorey];

            // Fallback price logic if storey isn't applicable
            if (currentPrice === undefined) {
              currentPrice = sizePrices["Single"] || 0;
            }

            const formattedPrice = currentPrice.toFixed(2);

            return (
              <div
                key={card.id}
                className={`relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 transition-all duration-300 ${
                  card.isPopular
                    ? "bg-[#1A2E44] text-white shadow-2xl ring-2 ring-[#FFE67B] scale-[1.02]"
                    : "bg-white text-[#1A2E44] shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1"
                }`}
              >
                {/* Badge if present */}
                {card.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span
                      className={`text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm ${
                        card.isPopular
                          ? "bg-[#FFE67B] text-[#1A2E44]"
                          : "bg-[#2CBAE8] text-white"
                      }`}
                    >
                      {card.badge}
                    </span>
                  </div>
                )}

                <div>
                  {/* Card Header & Title */}
                  <div className="pt-2 mb-4 text-center">
                    <h3 className={`text-xl font-bold tracking-tight mb-2 ${card.isPopular ? "text-white" : "text-[#1A2E44]"}`}>
                      {card.name}
                    </h3>
                    <p className={`text-xs leading-relaxed min-h-[36px] ${card.isPopular ? "text-white/80" : "text-gray-500"}`}>
                      {card.shortDescription}
                    </p>
                  </div>

                  {/* Price Section */}
                  <div className={`py-4 px-3 rounded-2xl text-center mb-6 ${card.isPopular ? "bg-white/10" : "bg-[#EBF6FB]"}`}>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-sm font-semibold opacity-70">$</span>
                      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        {formattedPrice}
                      </span>
                    </div>
                    <p className={`text-[11px] font-medium mt-1 ${card.isPopular ? "text-[#FFE67B]" : "text-[#2CBAE8]"}`}>
                      {selectedProperty} ({selectedStorey})
                    </p>
                  </div>

                  {/* Inclusions List */}
                  <div className="space-y-3 mb-8">
                    <span className={`block text-[11px] font-bold uppercase tracking-wider ${card.isPopular ? "text-white/60" : "text-gray-400"}`}>
                      Included Services:
                    </span>
                    {card.inclusions.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold ${
                            card.isPopular
                              ? "bg-[#FFE67B] text-[#1A2E44]"
                              : "bg-[#2CBAE8]/15 text-[#2CBAE8]"
                          }`}
                        >
                          ✓
                        </span>
                        <span className={`text-xs leading-snug ${card.isPopular ? "text-white/90" : "text-gray-600"}`}>
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Reserve Now Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => handleReserve(card.name, currentPrice)}
                    className={`w-full py-3.5 px-4 rounded-full font-bold text-sm transition-all duration-200 shadow-md flex items-center justify-center gap-2 ${
                      card.isPopular
                        ? "bg-[#FFE67B] text-[#1A2E44] hover:bg-[#FFDE59] shadow-[#FFE67B]/20"
                        : "bg-[#2CBAE8] text-white hover:bg-[#17739C] shadow-[#2CBAE8]/20"
                    }`}
                  >
                    <span>Reserve Now</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
