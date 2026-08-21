'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';


// ---------------------------------------------------------------------------
// Logo placeholder - swap src prop for the real logo image when available.
// Reserved dimensions match the mockup logo aspect ratio (~140x40px area).
// ---------------------------------------------------------------------------
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

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          <Link href="/" className="flex-shrink-0">
            <LogoPlaceholder />
          </Link>

          <div className="hidden md:flex items-center gap-5">
            <a
              href="tel:+61341089922"
              className="flex items-center gap-2 text-[#1A2E44] font-medium text-sm hover:text-[#00AEEF] transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-[#FFF3CD] flex items-center justify-center text-[#F5C518] flex-shrink-0">
                <PhoneIcon />
              </span>
              <span className="tracking-wide">+61 3 4108 9922</span>
            </a>

            <Link
              href="#contact"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-[#00AEEF] text-white font-semibold text-sm hover:bg-[#0099CC] transition-colors whitespace-nowrap"
            >
              Contact Us
            </Link>
          </div>

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

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-5 flex flex-col gap-4">
          <a
            href="tel:+61341089922"
            className="flex items-center gap-3 text-[#1A2E44] font-medium text-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="w-7 h-7 rounded-full bg-[#FFF3CD] flex items-center justify-center text-[#F5C518] flex-shrink-0">
              <PhoneIcon />
            </span>
            <span>+61 3 4108 9922</span>
          </a>

          <Link
            href="#contact"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-[#00AEEF] text-white font-semibold text-sm hover:bg-[#0099CC] transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}