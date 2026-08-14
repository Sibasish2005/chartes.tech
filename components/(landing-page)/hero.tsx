"use client";

import { useRef } from "react";
import { Roboto_Slab } from "next/font/google";
import { motion, useScroll, useTransform } from "framer-motion";

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Hero() {
  const containerRef = useRef(null);
  
  // Track scroll progress specifically for this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 0.4], [0, -250]);

  const videoFilter = useTransform(
    scrollYProgress,
    [0, 1],
    ["blur(0px)", "blur(3px)"]
  );

  const videoScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, 1.08]
  );

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Video */}
      <motion.video
        autoPlay
        loop
        muted
        playsInline
        style={{ filter: videoFilter, scale: videoScale }}
        className="absolute inset-0 h-full w-full object-cover origin-center"
      >
        <source src="/HeroBackground.mp4" type="video/mp4" />
      </motion.video>

      {/* Hero Content */}
      <div className="relative z-10 flex h-full w-full flex-col justify-center px-6 md:px-20 lg:px-10 max-w-[1600px] mx-auto">
        <div className="relative w-full">
          <motion.h1
            style={{ y, WebkitTextStroke: "2px rgba(0,0,0,0.55)" }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`
              ${robotoSlab.className}
              text-[20vw]
              md:text-[10vw]
              lg:text-[140px]
              font-bold
              leading-[0.9]
              tracking-tight
              text-[#F8F5F0]
              drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)]
            `}
          >
            Every <br />
            Institute <br />
            Begins <br />
            with a Big <br />
            Idea
          </motion.h1>
        </div>
      </div>
    </section>
  );
}
