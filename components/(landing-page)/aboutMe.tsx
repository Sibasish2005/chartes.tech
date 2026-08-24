
"use client";

import { motion } from "framer-motion";
import { Roboto_Slab, Poppins } from "next/font/google";
import RevealImage from "@/components/revealImage";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const beliefs = [
  {
    title: "Hook with purpose.",
    description: "In an endless feed, every first second and headline must captivate with undeniable value."
  },
  {
    title: "Authenticity wins algorithms.",
    description: "Platforms reward organic retention and meaningful interactions over generic corporate noise."
  },
  {
    title: "Relentless distribution.",
    description: "Great ideas need consistent posting cadences and cross-platform adaptation to build true authority."
  },
  {
    title: "Metrics that drive revenue.",
    description: "We optimize for audience retention, qualified pipeline leads, and brand equity — not vanity metrics."
  }
];

export default function AboutMe() {
  return (
    <section className="w-full bg-black/90 text-[#F3EBDD] py-16 md:py-24 lg:py-32 px-[5vw] flex flex-col gap-16 md:gap-24">
      {/* TOP SECTION: ABOUT ME */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        
        {/* Left Column: Text Content */}
        <div className="lg:col-span-6 flex flex-col gap-6 md:gap-8">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-5 bg-[#00A3C4] rounded-r-full block" />
            <span className={`${poppins.className} text-xs md:text-sm font-semibold tracking-[0.2em] text-[#F3EBDD] uppercase`}>
              Who We Are
            </span>
          </div>
          
          <h2 className={`${robotoSlab.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.5] tracking-normal`}>
            We turn quiet brands into high-engagement authority figures across modern social feeds.
          </h2>
        </div>

        {/* Right Column: Stacked Images */}
        <div className="lg:col-span-5 lg:col-start-8 w-full flex flex-col gap-8 md:gap-10">
          {/* Stacked Image Container */}
          <div className="relative w-full max-w-[400px] aspect-[3/4] mx-auto lg:mx-0">
            {/* Background Card (Map placeholder) */}
            <div className="absolute top-0 left-0 w-[88%] h-[88%] rounded-2xl overflow-hidden border border-[#F3EBDD]/10 shadow-lg">
              <img
                src="/workflow/workflow1.jpg"
                alt="Map background grid"
                className="w-full h-full object-cover filter grayscale opacity-30 contrast-125"
              />
            </div>
            
            {/* Foreground Card (Profile) */}
            <div className="absolute bottom-0 right-0 w-[88%] h-[88%] rounded-2xl overflow-hidden shadow-2xl border border-[#F3EBDD]/15">
              <RevealImage
                src="/lms.jpg"
                alt="Profile photo"
                width={400}
                height={533}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Secondary Bio Text */}
          <p className={`${poppins.className} text-base sm:text-lg text-[#F3EBDD]/80 font-light leading-relaxed max-w-[400px] mx-auto lg:mx-0`}>
            We've spearheaded viral campaigns, scaled organic followings into the millions, and crafted magnetic visual storytelling for ambitious founders, creators, and modern brands.
          </p>
        </div>
      </div>

      {/* DIVIDER */}
      <hr className="border-[#F3EBDD]/10" />

      {/* BOTTOM SECTION: WHAT WE BELIEVE */}
      <div className="flex flex-col gap-10 md:gap-12">
        <span className={`${poppins.className} text-xs md:text-sm font-semibold tracking-[0.2em] text-[#A67C3D] uppercase`}>
          WHAT WE BELIEVE
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {beliefs.map((belief, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: idx * 0.1
              }}
              className="flex flex-col gap-3 group"
            >
              <h3 className={`${robotoSlab.className} text-xl md:text-2xl font-semibold text-[#F3EBDD] group-hover:text-[#A67C3D] transition-colors duration-300`}>
                {belief.title}
              </h3>
              <p className={`${poppins.className} text-sm md:text-base text-[#F3EBDD]/70 font-light leading-relaxed`}>
                {belief.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

