"use client";

import { Roboto_Slab, Poppins } from "next/font/google";
import Link from "next/link";

const robotoSlab = Roboto_Slab({ subsets: ["latin"], weight: ["400", "700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

const services = [
  {
    number: "01",
    label: "CONTENT STRATEGY & PLANNING",
    title: "Turn feeds into conversion engines.",
    description: "In-depth channel audits, monthly content calendars, competitor benchmarking, and custom hook frameworks tailored to your specific audience niche.",
    image: "/lms.jpg",
    accent: "text-[#A67C3D]",
    badgeBg: "bg-[#A67C3D]/10 text-[#A67C3D] border-[#A67C3D]/20",
    buttonAccent: "hover:bg-[#A67C3D] hover:text-white",
  },
  {
    number: "02",
    label: "SHORT-FORM VIDEO & REELS",
    title: "Stop the scroll with high-retention video.",
    description: "End-to-end ideation, scripting, dynamic editing, sound design, and trend curation for TikTok, Instagram Reels, and YouTube Shorts.",
    image: "/lms.jpg",
    accent: "text-[#2D6A4F]",
    badgeBg: "bg-[#2D6A4F]/10 text-[#2D6A4F] border-[#2D6A4F]/20",
    buttonAccent: "hover:bg-[#2D6A4F] hover:text-white",
  },
  {
    number: "03",
    label: "COMMUNITY & ENGAGEMENT",
    title: "Build real loyalty with your audience.",
    description: "Proactive comment interactions, inbound DM triage, audience nurturing, and strategic engagement that turns casual viewers into brand superfans.",
    image: "/lms.jpg",
    accent: "text-[#1D3557]",
    badgeBg: "bg-[#1D3557]/10 text-[#1D3557] border-[#1D3557]/20",
    buttonAccent: "hover:bg-[#1D3557] hover:text-white",
  },
  {
    number: "04",
    label: "CROSS-PLATFORM DISTRIBUTION",
    title: "Your brand story, unified everywhere.",
    description: "Seamless syndication across LinkedIn, Instagram, X, TikTok, and YouTube with platform-native adaptations for maximum viral reach.",
    image: "/lms.jpg",
    accent: "text-[#A67C3D]",
    badgeBg: "bg-[#A67C3D]/10 text-[#A67C3D] border-[#A67C3D]/20",
    buttonAccent: "hover:bg-[#A67C3D] hover:text-white",
  },
  {
    number: "05",
    label: "ANALYTICS & GROWTH OPTIMIZATION",
    title: "Turn data into exponential reach.",
    description: "Audience retention mapping, thumbnail and hook split-testing, funnel attribution tracking, and comprehensive monthly ROI growth reports.",
    image: "/lms.jpg",
    accent: "text-[#2D6A4F]",
    badgeBg: "bg-[#2D6A4F]/10 text-[#2D6A4F] border-[#2D6A4F]/20",
    buttonAccent: "hover:bg-[#2D6A4F] hover:text-white",
  },
];

export default function Services() {
  return (
    <section id="services" className="w-full bg-[#F3EBDD] text-[#141E30] pt-20 md:pt-28 pb-0">
      {/* Opening Section with balanced spacing */}
      <div className="w-full px-[5vw] max-w-5xl mx-auto flex flex-col gap-5 md:gap-7 mb-12 md:mb-16 text-center items-center">
        <span className={`${poppins.className} text-xs md:text-sm font-semibold tracking-[0.2em] text-[#A67C3D] uppercase`}>
          WHAT WE DELIVER
        </span>
        <h2 className={`${robotoSlab.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight max-w-4xl`}>
          Social Strategy, Built Around Your Growth.
        </h2>
        <p className={`${poppins.className} text-base sm:text-lg md:text-xl text-[#141E30]/75 font-light leading-relaxed max-w-2xl`}>
          From viral video production to cohesive multi-channel management, we elevate your brand into an undeniable online presence.
        </p>
      </div>

      {/* Smooth Stacking Cards Container */}
      <div className="w-full px-[5vw] max-w-6xl mx-auto pb-24 md:pb-36 relative">
        <div className="flex flex-col relative">
          {services.map((service, index) => (
            <div
              key={service.number}
              className="sticky w-full mb-16 md:mb-24 last:mb-0 will-change-transform"
              style={{
                top: `calc(90px + ${index * 22}px)`,
                zIndex: index + 1,
              }}
            >
              <div className="w-full bg-[#FAF8F5] border border-[#141E30]/10 rounded-[28px] md:rounded-[36px] shadow-[0_-8px_30px_rgba(0,0,0,0.06),0_12px_40px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-300">
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[460px] lg:min-h-[500px]">
                  
                  {/* Left Column: Text & Content */}
                  <div className="lg:col-span-6 flex flex-col justify-between p-8 sm:p-10 md:p-12 lg:p-14">
                    <div className="flex flex-col gap-6 md:gap-8">
                      {/* Card Header: Number & Badge */}
                      <div className="flex items-center justify-between">
                        <span className={`${poppins.className} text-2xl md:text-3xl font-light text-neutral-400 tracking-tight`}>
                          {service.number}
                        </span>
                        <span className={`${poppins.className} text-[11px] md:text-xs font-semibold tracking-[0.18em] uppercase px-3.5 py-1.5 rounded-full border ${service.badgeBg}`}>
                          {service.label}
                        </span>
                      </div>

                      {/* Main Title & Description */}
                      <div className="flex flex-col gap-3.5 md:gap-4">
                        <h3 className={`${robotoSlab.className} text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold leading-[1.15] tracking-tight text-[#141E30]`}>
                          {service.title}
                        </h3>
                        <p className={`${poppins.className} text-sm sm:text-base md:text-lg text-[#141E30]/75 font-light leading-relaxed max-w-lg`}>
                          {service.description}
                        </p>
                      </div>
                    </div>

                    {/* Action Link */}
                    <div className="pt-6 md:pt-8">
                      <Link
                        href="#contact"
                        className={`${poppins.className} inline-flex items-center gap-2.5 text-sm md:text-base font-semibold group ${service.accent} transition-all duration-200`}
                      >
                        <span>Explore {service.label.split(' ')[0]}</span>
                        <span className="transform group-hover:translate-x-1.5 transition-transform duration-200">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Visual Showcase */}
                  <div className="lg:col-span-6 p-4 sm:p-6 lg:p-8 flex items-center justify-center bg-[#F2EDE4]/50">
                    <div className="w-full h-[260px] sm:h-[320px] lg:h-full rounded-2xl md:rounded-3xl overflow-hidden shadow-inner border border-black/5 relative group">
                      <img
                        src={service.image}
                        alt={service.label}
                        className="w-full h-full object-cover transform group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
