'use client';

import { useState } from "react";
import { DEFAULT_EXTRA_SERVICES } from "@/lib/data/commercialPricing";

export default function ExtraServicesSection() {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleRequestQuote = () => {
    const targetSection = document.getElementById("contact") || document.getElementById("services");
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#contact";
    }
  };

  return (
    <section id="extra-services" className="relative w-full bg-white py-20 lg:py-24 overflow-hidden" aria-labelledby="extra-services-heading">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-[#2CBAE8] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
            Optional Add-On Services
          </span>
          <h2
            id="extra-services-heading"
            className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A2E44] leading-tight tracking-tight max-w-[700px] mx-auto mb-3"
          >
            Extra Services — Optional Additional Charge
          </h2>
          <p className="text-gray-600 text-sm max-w-[650px] mx-auto leading-relaxed">
            Select any specialized add-on services you require. These services require a tailored inspection or custom scope — our team will provide a manual quote after reviewing your request.
          </p>
        </div>

        {/* Interactive Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
          {DEFAULT_EXTRA_SERVICES.map((item) => {
            const isSelected = selectedServices.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => toggleService(item.id)}
                className={`relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#1A2E44] text-white border-[#FFE67B] shadow-md scale-[1.02]"
                    : "bg-[#F7FBFF] text-[#1A2E44] border-gray-100 hover:border-[#2CBAE8]/40 hover:bg-[#EBF6FB]"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-sm leading-snug">{item.name}</h3>
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#FFE67B] text-[#1A2E44]"
                          : "border border-gray-300 text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed mb-3 ${isSelected ? "text-white/80" : "text-gray-500"}`}>
                    {item.description}
                  </p>
                </div>

                <div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                      isSelected
                        ? "bg-white/15 text-[#FFE67B]"
                        : "bg-[#2CBAE8]/15 text-[#2CBAE8]"
                    }`}
                  >
                    Manual Quote Required
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Services Counter & Action CTA */}
        <div className="bg-[#EBF6FB] rounded-2xl p-6 border border-[#2CBAE8]/20 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-[800px] mx-auto">
          <div>
            <p className="text-sm font-bold text-[#1A2E44]">
              Selected Add-ons: <span className="text-[#2CBAE8]">{selectedServices.length} {selectedServices.length === 1 ? 'service' : 'services'}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Prices for extra services are provided via custom manual quote upon booking review.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRequestQuote}
            className="w-full sm:w-auto px-7 py-3 rounded-full font-bold text-xs bg-[#2CBAE8] text-white hover:bg-[#17739C] transition-colors shadow-md shadow-[#2CBAE8]/20 whitespace-nowrap"
          >
            Enquire For Custom Quote
          </button>
        </div>

      </div>
    </section>
  );
}
