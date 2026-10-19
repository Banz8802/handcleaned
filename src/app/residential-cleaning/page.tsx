import type { Metadata } from "next";
import ResidentialHeroSection from "@/components/sections/ResidentialHeroSection";
import ResidentialPricingSection from "@/components/sections/ResidentialPricingSection";
import ResidentialServiceDetailsSection from "@/components/sections/ResidentialServiceDetailsSection";
import ResidentialAddonsSection from "@/components/sections/ResidentialAddonsSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import ServicesSection from "@/components/sections/ServicesSection";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import LocationSection from "@/components/sections/LocationSection";

export const metadata: Metadata = {
  title: "Residential Cleaning Services & Hourly Pricing Sydney | Hand Cleaned",
  description:
    "Flexible regular home cleaning ($60/hr per cleaner) and deep home cleaning ($68/hr per cleaner) in Sydney. Calculate custom cleaner team sizes with transparent hourly rates.",
};

import { getAdminSiteContent } from "@/services/adminContentService";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ResidentialCleaningPage() {
  const content = await getAdminSiteContent();

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <ResidentialHeroSection content={content.residentialPage.hero} />

      {/* Main Pricing Section featuring Regular & Deep Cleaning Calculator */}
      <ResidentialPricingSection />

      {/* Service Details & Benefits */}
      <ResidentialServiceDetailsSection />

      {/* Full Hourly Rate Schedule Table */}
      <ResidentialAddonsSection />

      {/* Reused Homepage Testimonial Section */}
      <TestimonialSection content={content.testimonials} />


      {/* Reused Homepage Services Section */}
      <div id="services">
        <ServicesSection />
      </div>

      {/* Reused Homepage CTA Banner Section */}
      <CtaBannerSection
        title="Ready for a Spotless, Refreshing Home?"
        accentTitle="Book your residential clean in under 60 seconds."
      />

      {/* Reused Homepage Location Map Section */}
      <LocationSection />
    </main>
  );
}
