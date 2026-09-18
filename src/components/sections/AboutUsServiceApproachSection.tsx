import Link from "next/link";
import Image from "next/image";

function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-block text-[#00AEEF] text-xs font-semibold uppercase tracking-[0.15em] mb-3">
      {text}
    </span>
  );
}

const SERVICE_APPROACHES = [
  {
    title: "Regular Cleaning",
    description: "Ongoing cleaning services to maintain your home, office, or property in a consistently fresh, clean, and welcoming condition.",
    image: "/images/airbnb-cleaning.webp",
    badge: "Ongoing Care",
  },
  {
    title: "One-Time Deep Clean",
    description: "Comprehensive deep cleaning solutions designed for intensive refresh, detailed focus, and complete peace of mind.",
    image: "/images/Deep Cleaning.webp",
    badge: "Thorough Refresh",
  },
  {
    title: "Special Occasion Preparation",
    description: "Tailored cleaning assistance ensuring your space is meticulously prepared and looking its absolute best for events and guests.",
    image: "/images/Commercial Cleaning.webp",
    badge: "Event Ready",
  },
];

export default function AboutUsServiceApproachSection() {
  return (
    <section
      className="relative w-full bg-[#F7FBFF] overflow-hidden py-16 lg:py-24 border-y border-gray-100"
      aria-labelledby="service-approach-heading"
    >
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-[720px] mx-auto mb-12 sm:mb-16">
          <SectionLabel text="What We Do" />
          
          <h2
            id="service-approach-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A2E44] leading-tight tracking-tight mb-4"
          >
            Tailored Cleaning Solutions for Every Need
          </h2>

          <p className="text-gray-600 text-base leading-relaxed">
            Our team is dedicated to delivering consistent results while treating every home, office, and property with the respect it deserves. Whether you require regular cleaning, a one-time deep clean, or assistance preparing a space for a special occasion, we tailor our services to meet your needs.
          </p>
        </div>

        {/* 3 Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICE_APPROACHES.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Card Image Header */}
              <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#1A2E44]/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full tracking-wide uppercase">
                    {item.badge}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#1A2E44] mb-3 group-hover:text-[#00AEEF] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#00AEEF] hover:text-[#17739C] transition-colors group/link mt-auto"
                >
                  <span>Request This Service</span>
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="w-4 h-4 transition-transform group-hover/link:translate-x-1"
                    aria-hidden="true"
                  >
                    <path d="M1 8a.5.5 0 0 1 .5-.5h11.793L10.146 4.354a.5.5 0 1 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
