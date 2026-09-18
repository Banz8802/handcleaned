'use client';

const SECTIONS_LIST = [
  { id: "our-services", title: "Our Services" },
  { id: "bookings", title: "Bookings" },
  { id: "pricing-payment", title: "Pricing and Payment" },
  { id: "cancellations", title: "Cancellations & Rescheduling" },
  { id: "property-access", title: "Access to the Property" },
  { id: "customer-responsibilities", title: "Customer Responsibilities" },
  { id: "valuables-fragile", title: "Valuables & Fragile Items" },
  { id: "cleaning-results", title: "Cleaning Results" },
  { id: "damage-complaints", title: "Damage or Complaints" },
  { id: "prohibited-activities", title: "Prohibited Activities" },
  { id: "website-content", title: "Website Content" },
  { id: "third-party-links", title: "Third-Party Links" },
  { id: "privacy", title: "Privacy" },
  { id: "changes-to-terms", title: "Changes to These Terms" },
  { id: "limitation-liability", title: "Limitation of Liability" },
  { id: "governing-law", title: "Governing Law" },
  { id: "contact-us", title: "Contact Us" },
];

export default function TermsContentSection() {
  return (
    <section
      className="relative w-full bg-white overflow-hidden py-16 lg:py-24"
      aria-label="Terms of Service Details"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Left Sticky Table of Contents Sidebar */}
          <aside className="lg:col-span-4 sticky top-24 hidden lg:block bg-[#F7FBFF] border border-gray-100 p-6 rounded-3xl shadow-sm max-h-[calc(100vh-120px)] overflow-y-auto">
            <h3 className="text-[#1A2E44] font-bold text-sm tracking-wide uppercase mb-4 pb-3 border-b border-gray-200">
              Table of Contents
            </h3>
            <nav className="flex flex-col gap-1.5">
              {SECTIONS_LIST.map((item, index) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-xs font-medium text-gray-600 hover:text-[#00AEEF] hover:bg-white px-3 py-2 rounded-xl transition-all flex items-center gap-2"
                >
                  <span className="text-[10px] font-bold text-[#00AEEF] bg-[#EBF6FB] px-1.5 py-0.5 rounded-md">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{item.title}</span>
                </a>
              ))}
            </nav>
          </aside>

          {/* Right Content Column */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            
            {/* 1. Our Services */}
            <div id="our-services" className="scroll-mt-28 bg-[#F7FBFF] border border-gray-100 p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#EBF6FB] text-[#00AEEF] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  01
                </span>
                <h2 className="text-xl font-bold text-[#1A2E44]">Our Services</h2>
              </div>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  Hand Cleaned provides cleaning services according to the services, packages, prices, and availability displayed on our website or communicated to you when making a booking.
                </p>
                <p>
                  The exact scope of a cleaning service may vary depending on the service selected, the condition of the property, and any specific requests agreed upon before the appointment.
                </p>
              </div>
            </div>

            {/* 2. Bookings */}
            <div id="bookings" className="scroll-mt-28 bg-[#F7FBFF] border border-gray-100 p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#EBF6FB] text-[#00AEEF] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  02
                </span>
                <h2 className="text-xl font-bold text-[#1A2E44]">Bookings</h2>
              </div>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  Customers are responsible for providing accurate information when making a booking, including:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-2">
                  {[
                    "Name and contact information",
                    "Service address",
                    "Preferred date and time",
                    "Type of cleaning service requested",
                    "Relevant information about property or cleaning requirements",
                  ].map((req, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white p-2.5 rounded-xl border border-gray-100">
                      <span className="text-[#00AEEF] font-bold">✓</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
                <p className="pt-2">
                  A booking is considered confirmed only after Hand Cleaned has accepted or confirmed the appointment.
                </p>
              </div>
            </div>

            {/* 3. Pricing and Payment */}
            <div id="pricing-payment" className="scroll-mt-28 bg-[#F7FBFF] border border-gray-100 p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#EBF6FB] text-[#00AEEF] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  03
                </span>
                <h2 className="text-xl font-bold text-[#1A2E44]">Pricing and Payment</h2>
              </div>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  Prices will be communicated or displayed before the service is provided whenever reasonably possible.
                </p>
                <p>
                  Additional charges may apply when a property or service requires work beyond the agreed scope, including unusually heavy cleaning, excessive buildup, additional rooms or areas, or special cleaning requests. Any significant additional charges should be communicated to the customer before the additional work is performed where reasonably practicable.
                </p>
              </div>
            </div>

            {/* 4. Cancellations and Rescheduling */}
            <div id="cancellations" className="scroll-mt-28 bg-[#F7FBFF] border border-gray-100 p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#EBF6FB] text-[#00AEEF] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  04
                </span>
                <h2 className="text-xl font-bold text-[#1A2E44]">Cancellations and Rescheduling</h2>
              </div>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  Customers should contact Hand Cleaned as soon as possible if they need to cancel or reschedule an appointment.
                </p>
                <p>
                  Our cancellation, rescheduling, and no-show policies may result in fees depending on how close to the scheduled appointment the change is made.
                </p>

                {/* Cancellation Policy Highlight Alert */}
                <div className="bg-[#FFE67B]/20 border border-[#E5A000]/40 p-4 sm:p-5 rounded-2xl flex items-start gap-3 mt-4">
                  <span className="w-8 h-8 rounded-full bg-[#E5A000] text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    !
                  </span>
                  <div>
                    <h3 className="text-[#1A2E44] font-bold text-sm">Cancellation Policy:</h3>
                    <p className="text-[#1A2E44] text-xs font-medium mt-1 leading-normal">
                      Bookings must be cancelled at least one business day (24 hours) in advance. Cancellations made with less than 24 hours&apos; notice will incur a <strong>$60 + GST</strong> cancellation fee.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Access to the Property */}
            <div id="property-access" className="scroll-mt-28 bg-[#F7FBFF] border border-gray-100 p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#EBF6FB] text-[#00AEEF] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  05
                </span>
                <h2 className="text-xl font-bold text-[#1A2E44]">Access to the Property</h2>
              </div>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  Customers are responsible for providing reasonable access to the property at the scheduled time.
                </p>
                <p>
                  If our cleaners cannot access the property because of missing keys, incorrect access information, or other circumstances outside our control, the appointment may be treated as a cancellation or missed appointment.
                </p>
              </div>
            </div>

            {/* 6. Customer Responsibilities */}
            <div id="customer-responsibilities" className="scroll-mt-28 bg-[#F7FBFF] border border-gray-100 p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#EBF6FB] text-[#00AEEF] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  06
                </span>
                <h2 className="text-xl font-bold text-[#1A2E44]">Customer Responsibilities</h2>
              </div>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  Customers must provide a reasonably safe working environment. Customers should inform Hand Cleaned in advance about:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    "Hazardous materials or substances",
                    "Fragile or valuable items",
                    "Pets or animals",
                    "Areas requiring special instructions",
                    "Known safety hazards",
                    "Surfaces/materials requiring special cleaning",
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs font-medium text-gray-700 bg-white p-2.5 rounded-xl border border-gray-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00AEEF]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="pt-2">
                  We reserve the right to decline or stop a service if conditions present a reasonable safety risk to our staff or others.
                </p>
              </div>
            </div>

            {/* 7. Valuables and Fragile Items */}
            <div id="valuables-fragile" className="scroll-mt-28 bg-[#F7FBFF] border border-gray-100 p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#EBF6FB] text-[#00AEEF] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  07
                </span>
                <h2 className="text-xl font-bold text-[#1A2E44]">Valuables and Fragile Items</h2>
              </div>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  Customers should secure cash, jewelry, important documents, valuables, and fragile items before the cleaning service begins.
                </p>
                <p>
                  Hand Cleaned should not be held responsible for damage to items that were not reasonably identifiable as fragile or that were improperly secured, except where liability cannot legally be excluded.
                </p>
              </div>
            </div>

            {/* 8. Cleaning Results */}
            <div id="cleaning-results" className="scroll-mt-28 bg-[#F7FBFF] border border-gray-100 p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#EBF6FB] text-[#00AEEF] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  08
                </span>
                <h2 className="text-xl font-bold text-[#1A2E44]">Cleaning Results</h2>
              </div>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  While we aim to provide thorough and professional cleaning services, results may vary depending on the condition, age, material, and existing damage of surfaces and items.
                </p>
                <p>
                  Some stains, odors, buildup, discoloration, or damage may not be completely removable through ordinary cleaning methods.
                </p>
              </div>
            </div>

            {/* 9. Damage or Complaints */}
            <div id="damage-complaints" className="scroll-mt-28 bg-[#F7FBFF] border border-gray-100 p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#EBF6FB] text-[#00AEEF] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  09
                </span>
                <h2 className="text-xl font-bold text-[#1A2E44]">Damage or Complaints</h2>
              </div>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  If you believe an item or property has been damaged during a cleaning service, please contact Hand Cleaned as soon as possible and provide details and, where appropriate, photographs.
                </p>
                <p>
                  We will review the concern and work with the customer toward a reasonable resolution.
                </p>
              </div>
            </div>

            {/* 10. Prohibited Activities */}
            <div id="prohibited-activities" className="scroll-mt-28 bg-[#F7FBFF] border border-gray-100 p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#EBF6FB] text-[#00AEEF] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  10
                </span>
                <h2 className="text-xl font-bold text-[#1A2E44]">Prohibited Activities</h2>
              </div>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  Customers may not request that our staff perform services that are illegal, unsafe, or outside the agreed scope of our cleaning services.
                </p>
                <p>
                  We may refuse a request or terminate a service where necessary for safety, legal, or operational reasons.
                </p>
              </div>
            </div>

            {/* 11. Website Content */}
            <div id="website-content" className="scroll-mt-28 bg-[#F7FBFF] border border-gray-100 p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#EBF6FB] text-[#00AEEF] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  11
                </span>
                <h2 className="text-xl font-bold text-[#1A2E44]">Website Content</h2>
              </div>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  The content on the Hand Cleaned website, including text, logos, graphics, images, and other materials, belongs to Hand Cleaned or is used with appropriate permission.
                </p>
                <p>
                  You may not reproduce, modify, distribute, or commercially use our website content without permission, except where permitted by law.
                </p>
              </div>
            </div>

            {/* 12. Third-Party Links */}
            <div id="third-party-links" className="scroll-mt-28 bg-[#F7FBFF] border border-gray-100 p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#EBF6FB] text-[#00AEEF] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  12
                </span>
                <h2 className="text-xl font-bold text-[#1A2E44]">Third-Party Links</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our website may contain links to third-party websites or services. Hand Cleaned is not responsible for the content, availability, or practices of third-party websites.
              </p>
            </div>

            {/* 13. Privacy */}
            <div id="privacy" className="scroll-mt-28 bg-[#F7FBFF] border border-gray-100 p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#EBF6FB] text-[#00AEEF] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  13
                </span>
                <h2 className="text-xl font-bold text-[#1A2E44]">Privacy</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Information provided to Hand Cleaned through our website or booking process may be collected and used to provide services, communicate with customers, process bookings or payments, and operate our business.
              </p>
            </div>

            {/* 14. Changes to These Terms */}
            <div id="changes-to-terms" className="scroll-mt-28 bg-[#F7FBFF] border border-gray-100 p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#EBF6FB] text-[#00AEEF] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  14
                </span>
                <h2 className="text-xl font-bold text-[#1A2E44]">Changes to These Terms</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Hand Cleaned may update these Terms of Service from time to time. Updated terms will be posted on this website with a revised effective date.
              </p>
            </div>

            {/* 15. Limitation of Liability */}
            <div id="limitation-liability" className="scroll-mt-28 bg-[#F7FBFF] border border-gray-100 p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#EBF6FB] text-[#00AEEF] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  15
                </span>
                <h2 className="text-xl font-bold text-[#1A2E44]">Limitation of Liability</h2>
              </div>
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  To the extent permitted by applicable law, Hand Cleaned will not be responsible for losses or damages that are not directly caused by our services or that could not reasonably have been anticipated.
                </p>
                <p>
                  Nothing in these Terms is intended to exclude or limit any rights or responsibilities that cannot legally be excluded or limited.
                </p>
              </div>
            </div>

            {/* 16. Governing Law */}
            <div id="governing-law" className="scroll-mt-28 bg-[#F7FBFF] border border-gray-100 p-6 sm:p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#EBF6FB] text-[#00AEEF] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  16
                </span>
                <h2 className="text-xl font-bold text-[#1A2E44]">Governing Law</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                These Terms of Service will be governed by the applicable laws of <strong>NSW, Sydney, Australia</strong>, without prejudice to any mandatory consumer protections that may apply.
              </p>
            </div>

            {/* 17. Contact Us Card */}
            <div id="contact-us" className="scroll-mt-28 bg-gradient-to-br from-[#1A2E44] to-[#0F1E2E] text-white p-7 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute -bottom-12 -right-12 w-48 h-48 bg-[#00AEEF]/20 rounded-full blur-2xl pointer-events-none"
              />

              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-xl bg-[#00AEEF]/20 text-[#2CBAE8] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  17
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Contact Us</h2>
              </div>

              <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-[600px]">
                If you have questions about these Terms of Service or our cleaning services, please contact us:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
                {/* Email */}
                <a
                  href="mailto:hcleaned@gmail.com"
                  className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all border border-white/10 flex flex-col gap-1 group"
                >
                  <span className="text-gray-300 text-xs font-semibold">Email</span>
                  <span className="text-[#FFE67B] text-xs font-bold truncate group-hover:underline">
                    hcleaned@gmail.com
                  </span>
                </a>

                {/* Phone */}
                <a
                  href="tel:+61406898997"
                  className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl transition-all border border-white/10 flex flex-col gap-1 group"
                >
                  <span className="text-gray-300 text-xs font-semibold">Phone</span>
                  <span className="text-[#FFE67B] text-xs font-bold group-hover:underline">
                    +61 406 898 997
                  </span>
                </a>

                {/* Address */}
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10 flex flex-col gap-1">
                  <span className="text-gray-300 text-xs font-semibold">Address</span>
                  <span className="text-white text-xs font-medium leading-tight">
                    3 Sunbeam Street Campsie, NSW 2194
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
