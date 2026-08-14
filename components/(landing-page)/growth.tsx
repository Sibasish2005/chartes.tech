"use client"

import AccordionGallery from "@/components/AccordionGallery"
import { Roboto_Slab, Poppins } from "next/font/google"

const robotoSlab = Roboto_Slab({
    subsets: ["latin"],
    weight: ["400", "700"],
})

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500"],
})

const items = [
    { image: '/growth/growth1.jpg', label: 'Disconnected Communication', link: '#' },
    { image: '/growth/growth2.jpg', label: 'Manual Administration', link: '#' },
    { image: '/growth/growth3.jpg', label: 'Scattered Tools', link: '#' },
]

export default function Growth() {
    return (
        <section className="bg-transparent py-16 md:py-24 flex flex-col gap-10 md:gap-16">
            {/* Header section */}
            <div className="w-[90vw] mx-auto text-left">
                <h2 className={`${robotoSlab.className} text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight text-neutral-900 leading-[1.1] mb-6`}>
                    Growth <br />
                    Outgrows <br />
                    <span className="text-neutral-500">Traditional Systems.</span>
                </h2>
                <p className={`${poppins.className} text-lg sm:text-xl md:text-2xl text-neutral-600 max-w-2xl font-light leading-relaxed`}>
                   As campuses expand, managing admissions, academics, communication, and operations across disconnected tools becomes increasingly difficult.
                </p>
            </div>

            {/* Accordion Gallery component centered and padded */}
            <div className="w-[90vw] mx-auto">
                <AccordionGallery
                    items={items}
                    defaultIndex={2}
                    expandRatio={0.52}
                    trigger="hover"
                    accentColor="#ffffff"
                    overlayColor="#060010"
                    textColor="#ffffff"
                    grayscale
                    showLabels
                    duration={0.6}
                    ease="power3.out"
                    parallax={0.5}
                    tilt={8}
                    stagger={0.06}
                    height={460}
                    gap={10}
                    radius={16}
                    orientation="horizontal"
                />
            </div>
        </section>
    )
}
