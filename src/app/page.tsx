import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import BookingSection from "@/components/sections/BookingSection";
import SpecializedServicesSection from "@/components/sections/SpecializedServicesSection";
import LocationSection from "@/components/sections/LocationSection";

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <BookingSection />
      <SpecializedServicesSection />
      <LocationSection />
    </main>
  );
}