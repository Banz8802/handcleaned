'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";


// ---------------------------------------------------------------------------
// Logo placeholder — matching the navbar logo for styling consistency.
// REPLACE: swap the placeholder with <Image src="/images/logo.svg" ... />
// when the actual asset is ready.
// ---------------------------------------------------------------------------
function LogoPlaceholder() {
  return (
    <div className="flex items-center justify-center md:justify-start select-none" aria-label="Hand Cleaned home">
      <Image
        src="/images/hand-cleaning-logo.png"
        alt="Hand Cleaned"
        width={257}
        height={86}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Phone / Contact Icon
// ---------------------------------------------------------------------------
function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 5.54 5.54l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Blue Top Wave Divider for Footer
// ---------------------------------------------------------------------------
function FooterWaveDivider() {
  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden leading-none pointer-events-none bg-[#F7FBFF]"
      style={{ height: "60px" }}
    >
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="min-w-[1440px] w-full h-full relative left-1/2 -translate-x-1/2"
      >
        <path
          d="M0,60 C120,40 240,20 360,30 C480,40 600,60 720,50 C840,40 960,20 1080,30 C1200,40 1320,50 1440,40 L1440,60 L0,60 Z"
          fill="#00AEEF"
          opacity="0.15"
        />
        <path
          d="M0,60 C180,45 360,30 540,45 C720,60 900,45 1080,30 C1260,15 1380,45 1440,35 L1440,60 L0,60 Z"
          fill="#00AEEF"
          opacity="0.3"
        />
        <path
          d="M0,60 C150,50 300,40 450,50 C600,60 750,55 900,45 C1050,35 1200,45 1350,40 C1380,39 1410,48 1440,45 L1440,60 L0,60 Z"
          fill="#ffffff"
        />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Footer Columns Data definition
// ---------------------------------------------------------------------------
const INFO_LINKS = [
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/#contact" },
  { label: "Book Now", href: "/booking" },
  { label: "Terms of Service", href: "/terms-of-service" },
];

const SERVICES_LINKS = [
  { label: "Airbnb Cleaning", href: "/airbnb-cleaning" },
  { label: "Residential Cleaning", href: "/residential-cleaning" },
  { label: "Commercial Cleaning", href: "/commercial-cleaning" },
  { label: "Linen Hire", href: "/linen-hire" },
];

const OPENING_HOURS = [
  { days: "Mon to Fri:", time: "8:00 AM - 6:00 PM" },
  { days: "Sat:", time: "9:00 AM - 5:00 PM" },
  { days: "Sun:", time: "Closed" },
];

// ---------------------------------------------------------------------------
// Footer — Main component export
// ---------------------------------------------------------------------------
export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="w-full bg-white flex flex-col">
      {/* Blue wave decoration transition at the top */}
      <FooterWaveDivider />

      <div className="max-w-[1200px] mx-auto w-full px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-gray-100">
          
          {/* Column 1: Company Info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <div className="flex justify-center md:justify-start w-full">
              <Link href="/" className="inline-block">
                <LogoPlaceholder />
              </Link>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-[260px] mx-auto md:mx-0">
              Our service is designed to maintain your home in a consistently clean, hygienic, and welcoming condition.
            </p>
            <div className="flex flex-col items-center md:items-start gap-3 mt-2">
              <a
                href="tel:+61411289877"
                className="flex items-center gap-2.5 text-[#1A2E44] font-medium text-xs hover:text-[#00AEEF] transition-colors group"
              >
                <span className="w-7 h-7 rounded-full bg-[#EBF6FB] text-[#00AEEF] group-hover:bg-[#00AEEF] group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors">
                  <PhoneIcon />
                </span>
                <span>+61 411 289 877</span>
              </a>
            </div>
          </div>

          {/* Column 2: Information */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <h3 className="text-[#1A2E44] font-bold text-sm tracking-wide">
              Information
            </h3>
            <ul className="flex flex-col items-center md:items-start gap-2.5">
              {INFO_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#00AEEF] text-xs font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <h3 className="text-[#1A2E44] font-bold text-sm tracking-wide">
              Services
            </h3>
            <ul className="flex flex-col items-center md:items-start gap-2.5">
              {SERVICES_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#00AEEF] text-xs font-medium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Opening Hours */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 w-full">
            <h3 className="text-[#1A2E44] font-bold text-sm tracking-wide">
              Opening Time
            </h3>
            <div className="flex flex-col gap-2.5 w-full max-w-[240px]">
              {OPENING_HOURS.map((item) => (
                <div key={item.days} className="flex justify-between text-xs font-medium w-full">
                  <span className="text-gray-400">{item.days}</span>
                  <span className="text-[#1A2E44]">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom copyright block */}
        <div className="pt-6 flex justify-center">
          <p className="text-gray-400 text-xs text-center">
            © 2026 Hand Cleaned. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
