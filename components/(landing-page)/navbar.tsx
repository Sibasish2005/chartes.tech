"use client";

import { useState } from "react"
import { Poppins } from "next/font/google"
import Link from "next/link"
import { motion, AnimatePresence, Variants } from "framer-motion"

const poppins = Poppins({ 
  weight: ['400', '500', '600'],
  subsets: ['latin'] 
})

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "afterChildren",
        staggerChildren: 0.04,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.06
      }
    }
  }

  const itemVariants: Variants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 }
  }

  return (
    <nav className={`${poppins.className} w-full bg-white border-b border-gray-100 relative z-50`}>
      <div className="max-w-[1600px] w-full mx-auto px-6 md:px-20 lg:px-10 h-[60px] lg:h-[90px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <img 
              src="/logo.png" 
              alt="Omnii Logo" 
              className="h-14 md:h-20 lg:h-[180px] w-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-12">
          <Link href="/" className="text-gray-800 hover:text-black transition-colors font-medium text-sm lg:text-base">
            Home
          </Link>
          <Link href="/#about" className="text-gray-600 hover:text-black transition-colors font-medium text-sm lg:text-base">
            About
          </Link>
          <Link href="/#services" className="text-gray-600 hover:text-black transition-colors font-medium text-sm lg:text-base">
            Services
          </Link>
          <Link href="/#solutions" className="text-gray-600 hover:text-black transition-colors font-medium text-sm lg:text-base">
            Solutions
          </Link>
          <Link href="/#contact" className="text-gray-600 hover:text-black transition-colors font-medium text-sm lg:text-base">
            Contact
          </Link>
        </div>

        {/* Desktop Call to Actions */}
        <div className="hidden md:flex items-center space-x-3 md:space-x-4">
          <Link 
            href="/login" 
            className="px-5 py-2 lg:px-7 lg:py-3 bg-black text-white text-xs lg:text-sm font-semibold rounded-full hover:bg-neutral-800 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
          >
            Get Started
          </Link>
          <Link 
            href="/booking" 
            className="px-5 py-2 lg:px-7 lg:py-3 border border-neutral-300 text-neutral-800 text-xs lg:text-sm font-semibold rounded-full hover:bg-neutral-50 transition-all"
          >
            Book a Call
          </Link>
        </div>

        {/* Mobile Hamburger Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMenu}
            className="p-2 text-neutral-700 hover:text-black focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isOpen ? (
                // Close Icon (X)
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                // Hamburger Menu Icon
                <path d="M4 12h16M4 6h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden w-full bg-white border-b border-gray-100 overflow-hidden absolute top-full left-0 z-40"
          >
            <div className="px-6 py-6 flex flex-col space-y-4">
              <motion.div variants={itemVariants}>
                <Link 
                  href="/" 
                  onClick={toggleMenu}
                  className="block text-gray-800 hover:text-black transition-colors font-medium text-lg"
                >
                  Home
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link 
                  href="/#about" 
                  onClick={toggleMenu}
                  className="block text-gray-600 hover:text-black transition-colors font-medium text-lg"
                >
                  About
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link 
                  href="/#services" 
                  onClick={toggleMenu}
                  className="block text-gray-600 hover:text-black transition-colors font-medium text-lg"
                >
                  Services
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link 
                  href="/#solutions" 
                  onClick={toggleMenu}
                  className="block text-gray-600 hover:text-black transition-colors font-medium text-lg"
                >
                  Solutions
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link 
                  href="/#contact" 
                  onClick={toggleMenu}
                  className="block text-gray-600 hover:text-black transition-colors font-medium text-lg"
                >
                  Contact
                </Link>
              </motion.div>
              
              <motion.hr variants={itemVariants} className="border-gray-100 my-2" />

              <motion.div variants={itemVariants} className="flex flex-col space-y-3 pt-2">
                <Link 
                  href="/login" 
                  onClick={toggleMenu}
                  className="w-full text-center py-3 bg-black text-white font-semibold rounded-full hover:bg-neutral-800 transition-all"
                >
                  Get Started
                </Link>
                <Link 
                  href="/booking" 
                  onClick={toggleMenu}
                  className="w-full text-center py-3 border border-neutral-300 text-neutral-800 font-semibold rounded-full hover:bg-neutral-50 transition-all"
                >
                  Book a Call
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
