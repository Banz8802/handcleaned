import type { Metadata } from "next";
import LinenHireSection from "@/components/sections/LinenHireSection";
import CommercialServiceDetailsSection from "@/components/sections/CommercialServiceDetailsSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import ServicesSection from "@/components/sections/ServicesSection";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import LocationSection from "@/components/sections/LocationSection";

export const metadata: Metadata = {
  title: "Linen Hire Packages & Supply Sydney | Hand Cleaned",
  description:
    "Premium hotel-quality linen hire packages in Sydney. King Linen Hire ($36), Queen Linen Hire ($36), and Single Linen Hire ($30) exclusive of GST.",
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
