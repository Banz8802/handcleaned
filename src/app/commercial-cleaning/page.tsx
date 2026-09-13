import type { Metadata } from "next";
import CommercialHeroSection from "@/components/sections/CommercialHeroSection";
import CommercialPricingSection from "@/components/sections/CommercialPricingSection";
import LinenHireSection from "@/components/sections/LinenHireSection";
import ExtraServicesSection from "@/components/sections/ExtraServicesSection";
import CommercialServiceDetailsSection from "@/components/sections/CommercialServiceDetailsSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import ServicesSection from "@/components/sections/ServicesSection";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import LocationSection from "@/components/sections/LocationSection";

export const metadata: Metadata = {
  title: "Commercial Cleaning, Linen Hire & Office Services Sydney | Hand Cleaned",
  description:
    "Professional commercial cleaning ($68/hr per cleaner excl. GST), premium linen hire packages (King/Queen $36, Single $30), and custom extra services in Sydney.",
};

export default function CommercialCleaningPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <CommercialHeroSection />

      {/* Main Commercial Pricing Calculator ($68/hr excl. GST) */}
      <CommercialPricingSection />

      {/* Linen Hire Section (King, Queen, Single Sets) */}
      <LinenHireSection />

      {/* Extra Services Optional Add-ons (Price on Request / Manual Quote Required) */}
      <ExtraServicesSection />

      {/* Commercial Service Details & Business Benefits */}
      <CommercialServiceDetailsSection />

      {/* Reused Homepage Testimonial Section */}
      <TestimonialSection />

      {/* Reused Homepage Services Section */}
      <div id="services">
        <ServicesSection />
      </div>

      {/* Reused Homepage CTA Banner Section */}
      <CtaBannerSection
        title="Ready for a Spotless Office or Commercial Property?"
        accentTitle="Book your commercial cleaning team in under 60 seconds."
      />

      {/* Reused Homepage Location Map Section */}
      <LocationSection />
    </main>
  );
}
