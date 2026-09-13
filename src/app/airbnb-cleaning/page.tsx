import type { Metadata } from "next";
import AirbnbHeroSection from "@/components/sections/AirbnbHeroSection";
import AirbnbPricingSection from "@/components/sections/AirbnbPricingSection";
import AirbnbServiceDetailsSection from "@/components/sections/AirbnbServiceDetailsSection";
import AirbnbAddonsSection from "@/components/sections/AirbnbAddonsSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import ServicesSection from "@/components/sections/ServicesSection";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import LocationSection from "@/components/sections/LocationSection";

export const metadata: Metadata = {
  title: "Airbnb Cleaning Pricing & Turnover Services Sydney | Hand Cleaned",
  description:
    "Transparent Airbnb departure turnover, midstay refresh, and deep cleaning pricing in Sydney. Instant quotes from Studio to 5-bedroom properties with zero hidden fees.",
};

export default function AirbnbCleaningPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <AirbnbHeroSection />

      {/* Main Pricing Section featuring 4 Pricing Cards */}
      <AirbnbPricingSection />

      {/* Service Details & What's Included */}
      <AirbnbServiceDetailsSection />

      {/* Full Pricing Matrix & Storey Surcharges */}
      <AirbnbAddonsSection />

      {/* Reused Homepage Testimonial Section */}
      <TestimonialSection />

      {/* Reused Homepage Services Section */}
      <div id="services">
        <ServicesSection />
      </div>

      {/* Reused Homepage CTA Banner Section */}
      <CtaBannerSection
        title="Ready for Guest-Ready 5-Star Reviews?"
        accentTitle="Book your Airbnb turnover in under 60 seconds."
      />

      {/* Reused Homepage Location Map Section */}
      <LocationSection />
    </main>
  );
}
