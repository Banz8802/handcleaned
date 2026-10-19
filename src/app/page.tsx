import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import BookingSection from "@/components/sections/BookingSection";
import SpecializedServicesSection from "@/components/sections/SpecializedServicesSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import LocationSection from "@/components/sections/LocationSection";
import { getAdminSiteContent } from "@/services/adminContentService";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const content = await getAdminSiteContent();

  return (
    <main className="flex flex-col">
      <HeroSection content={content.hero} />
      <AboutSection content={content.homeAbout} />
      <ServicesSection />
      <BookingSection />
      <SpecializedServicesSection />
      <TestimonialSection content={content.testimonials} />
      <CtaBannerSection />
      <LocationSection />
    </main>
  );
}