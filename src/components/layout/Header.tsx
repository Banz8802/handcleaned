'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

function LogoPlaceholder() {
  return (
    <div className="flex items-center select-none" aria-label="Hand Cleaned home">
      <Image
        src="/images/hand-cleaning-logo.png"
        alt="Hand Cleaned"
        width={257}
        height={86}
        priority
      />
    </div>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
      aria-hidden="true"
    >
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
}

const SERVICES_NAV = [
  { label: "Airbnb Cleaning", href: "/airbnb-cleaning", desc: "Turnover, midstay & setup cleans" },
  { label: "Residential Cleaning", href: "/residential-cleaning", desc: "Regular & deep home care" },
  { label: "Commercial Cleaning", href: "/commercial-cleaning", desc: "Office & workspace sanitization" },
  { label: "Linen Hire", href: "/linen-hire", desc: "Hotel quality linen supply" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(true);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="w-full bg-white shadow-xs sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <LogoPlaceholder />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7">
            <Link
              href="/"
              className="text-[#1A2E44] font-semibold text-sm hover:text-[#2CBAE8] transition-colors"
            >
              Home
            </Link>

            <Link
              href="/about-us"
              className="text-[#1A2E44] font-semibold text-sm hover:text-[#2CBAE8] transition-colors"
            >
              About Us
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative py-4"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-[#1A2E44] font-semibold text-sm hover:text-[#2CBAE8] transition-colors cursor-pointer"
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
              >
                <span>Services</span>
                <svg
                  className={`w-4 h-4 text-[#2CBAE8] transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu Box */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-2xl p-2 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  {SERVICES_NAV.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className="block px-4 py-2.5 rounded-xl hover:bg-[#EBF6FB] transition-colors group"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <span className="block text-xs font-bold text-[#1A2E44] group-hover:text-[#2CBAE8] transition-colors">
                        {service.label}
                      </span>
                      <span className="block text-[11px] text-gray-400 mt-0.5">
                        {service.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Phone Button */}
            <a
              href="tel:+61411289877"
              className="inline-flex items-center gap-3 bg-[#FFE67B] hover:bg-[#FFDE59] text-[#1A2E44] font-bold text-sm pl-2 pr-5 py-1.5 rounded-full transition-all duration-200 shadow-md shadow-black/5"
            >
              <span className="w-8 h-8 rounded-full bg-[#E5A000] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.429 5.43l.774-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </span>
              <span className="tracking-wide">+61 411 289 877</span>
            </a>

            {/* Book Now Button */}
            <Link
              href="/booking"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#2CBAE8] text-white font-bold text-sm hover:bg-[#17739C] transition-all duration-200 whitespace-nowrap shadow-md shadow-[#2CBAE8]/20 hover:shadow-lg hover:shadow-[#2CBAE8]/30"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-md text-[#1A2E44] hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <HamburgerIcon open={mobileMenuOpen} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-5 flex flex-col gap-3">
          <Link
            href="/"
            className="text-[#1A2E44] font-semibold text-base py-1.5"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/about-us"
            className="text-[#1A2E44] font-semibold text-base py-1.5"
            onClick={() => setMobileMenuOpen(false)}
          >
            About Us
          </Link>

          {/* Mobile Services Accordion */}
          <div className="border-y border-gray-100 py-2">
            <button
              type="button"
              onClick={() => setMobileServicesOpen((prev) => !prev)}
              className="w-full flex items-center justify-between text-[#1A2E44] font-bold text-base py-1"
            >
              <span>Services</span>
              <svg
                className={`w-4 h-4 text-[#2CBAE8] transition-transform ${
                  mobileServicesOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {mobileServicesOpen && (
              <div className="flex flex-col gap-2 pl-3 pt-2">
                {SERVICES_NAV.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    className="text-gray-600 hover:text-[#2CBAE8] text-sm font-semibold py-1 flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2CBAE8]" />
                    <span>{service.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <a
            href="tel:+61411289877"
            className="inline-flex items-center justify-center gap-3 bg-[#FFE67B] hover:bg-[#FFDE59] text-[#1A2E44] font-bold text-sm py-2.5 rounded-full transition-all duration-200 shadow-md shadow-black/5 mt-1"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="w-8 h-8 rounded-full bg-[#E5A000] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.429 5.43l.774-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </span>
            <span>+61 411 289 877</span>
          </a>

          <Link
            href="/booking"
            className="inline-flex items-center justify-center py-3 rounded-full bg-[#2CBAE8] text-white font-bold text-sm hover:bg-[#17739C] transition-all duration-200 shadow-md shadow-[#2CBAE8]/20 hover:shadow-lg hover:shadow-[#2CBAE8]/30"
            onClick={() => setMobileMenuOpen(false)}
          >
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
}