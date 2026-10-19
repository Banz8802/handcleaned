import type { Metadata } from "next";
import LinenHireSection from "@/components/sections/LinenHireSection";
import CommercialServiceDetailsSection from "@/components/sections/CommercialServiceDetailsSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import ServicesSection from "@/components/sections/ServicesSection";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import LocationSection from "@/components/sections/LocationSection";

export const metadata: Metadata = {
  title: "Airbnb Linen Hire Packages & Supply Sydney | Hand Cleaned",
  description:
    "Premium hotel-quality Airbnb linen kit packs in Sydney. King Linen Kit Pack ($36.00), Single Linen Kit Pack ($30.00), and Pool Towel ($4.20) inclusive of GST with 7-day rental period.",
};

export default function LinenHirePage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Linen Hire Main Section */}
      <LinenHireSection />

      {/* Commercial Service Details */}
      <CommercialServiceDetailsSection />

      {/* Reused Homepage Testimonial Section */}
      <TestimonialSection />

      {/* Reused Homepage Services Section */}
      <div id="services">
        <ServicesSection />
      </div>

      {/* Reused Homepage CTA Banner Section */}
      <CtaBannerSection
        title="Ready for Hotel-Quality Linen Supply?"
        accentTitle="Order your linen hire packages in under 60 seconds."
      />

      {/* Reused Homepage Location Map Section */}
      <LocationSection />
    </main>
  );
}
