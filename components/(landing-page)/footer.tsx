"use client";

import { Roboto_Slab, Poppins } from "next/font/google";
import Link from "next/link";

import Image from "next/image";

const robotoSlab = Roboto_Slab({ subsets: ["latin"], weight: ["400", "700"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export default function Footer() {
  return (
    <footer className="w-full bg-[#0D0D0D] text-[#F3EBDD] flex flex-col">
      {/* Call to Action Section (Moved from Services) */}
      <div className="relative w-full px-[5vw] py-28 md:py-36 lg:py-44 flex flex-col items-center justify-center text-center gap-8 border-b border-neutral-800/80 overflow-hidden">
        {/* Translucent Background Image & Overlays */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/workflow/workflow1.jpg"
            alt="CTA Background"
            fill
            className="object-cover object-center opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] via-[#0D0D0D]/60 to-[#0D0D0D]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(166,124,61,0.12)_0%,transparent_70%)]" />
        </div>

        <div className="relative z-10 flex flex-col gap-4 max-w-3xl">
          <h2 className={`${robotoSlab.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight`}>
            Ready to scale <br /> your social presence?
          </h2>
          <p className={`${poppins.className} text-lg sm:text-xl md:text-2xl font-light text-[#F3EBDD]/70 mt-2`}>
            Let's build your audience.
          </p>
        </div>
        <Link
          href="/booking"
          className={`${poppins.className} relative z-10 mt-4 px-8 py-4 bg-[#A67C3D] hover:bg-[#8f6b34] text-white text-base md:text-lg rounded-full font-semibold transition-all shadow-[0_4px_20px_rgba(166,124,61,0.3)] hover:shadow-[0_6px_25px_rgba(166,124,61,0.45)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2.5`}
        >
          <span>Let's Get Started</span>
          <span>→</span>
        </Link>
      </div>

      {/* Footer Bottom / Navigation Links */}
      <div className="w-full max-w-7xl mx-auto px-[5vw] py-12 md:py-16 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/">
            <img
              src="/logo.png"
              alt="Omninode Logo"
              className="h-8 md:h-10 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <p className={`${poppins.className} text-xs md:text-sm text-[#F3EBDD]/50 font-light`}>
            Transforming brand narratives into magnetic, high-converting social media experiences.
          </p>
        </div>

        {/* Footer Navigation */}
        <div className={`${poppins.className} flex flex-wrap items-center justify-center gap-6 md:gap-10 text-xs md:text-sm text-[#F3EBDD]/70`}>
          <Link href="/" className="hover:text-[#A67C3D] transition-colors">
            Home
          </Link>
          <Link href="/#about" className="hover:text-[#A67C3D] transition-colors">
            About
          </Link>
          <Link href="/#services" className="hover:text-[#A67C3D] transition-colors">
            Services
          </Link>
          <Link href="/#contact" className="hover:text-[#A67C3D] transition-colors">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-[#A67C3D] transition-colors">
            Privacy Policy
          </Link>
        </div>

        {/* Copyright & Legal */}
        <div className={`${poppins.className} text-xs text-[#F3EBDD]/40 text-center md:text-right flex flex-col sm:flex-row items-center gap-2 sm:gap-4`}>
          <span>© {new Date().getFullYear()} Omninode. All rights reserved.</span>
          <span className="hidden sm:inline text-[#F3EBDD]/20">•</span>
          <Link href="/privacy" className="hover:text-[#A67C3D] transition-colors underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
