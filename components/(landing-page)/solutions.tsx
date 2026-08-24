"use client";

import { motion, useTransform, useScroll } from "framer-motion";
import { Poppins } from "next/font/google";
import RevealImage from "@/components/revealImage";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400"],
});

const workflowSteps = [
  {
    number: "01",
    title: "Uncover the brand voice",
    description:
      "We start by dissecting your brand identity, audience psychology, competitive landscape, and content gaps to define the unique angles and narrative hooks that will captivate your niche.",
    image: "/workflow/workflow1.jpg",
  },
  {
    number: "02",
    title: "Engineer high-impact content",
    description:
      "Instead of cookie-cutter posts, we build tailored content pillars, high-retention short-form video scripts, viral hooks, visual assets, and carousels designed to stop the scroll.",
    image: "/workflow/workflow2.jpg",
  },
  {
    number: "03",
    title: "Ignite organic community",
    description:
      "Your audience shouldn't just be passive followers. We drive active comment conversations, proactive engagement, influencer collaborations, and DM interactions that cultivate brand loyalty.",
    image: "/workflow/workflow3.jpg",
  },
  {
    number: "04",
    title: "Scale conversions and revenue",
    description:
      "Social growth is meaningless without business impact. We continuously analyze watch-time, engagement velocity, click-through rates, and lead funnels to turn viral views into loyal customers.",
    image: "/workflow/workflow4.jpg",
  },
];

export default function Solutions() {
  return (
    <div className="min-h-screen w-full bg-[#F3EBDD]">

      {/* ================================
          SOLUTION SECTION
      ================================= */}

      <section className="min-h-screen w-full px-[5vw] py-[5vw]">
        <div className="grid w-full grid-cols-1 items-start gap-12 py-10 lg:grid-cols-2 lg:gap-20 lg:py-20 ">

          {/* LEFT — STICKY HEADING */}
          <div className="flex items-start justify-start lg:sticky lg:top-24 lg:h-fit">

            <h1
              className="
                text-[14vw]
                font-bold
                leading-[0.85]
                sm:text-[11vw]
                md:text-[8vw]
                lg:text-[7vw]
              "
            >
              <span className="text-[#141E30]">
                Built Around
                <br />

                Your{" "}
                <span className="text-[#A67C3D]">
                  Brand.
                </span>
              </span>

              <br />

              <span className="text-[#141E30]">
                Not The Other
                <br />
                Way Around.
              </span>
            </h1>

          </div>


          {/* RIGHT — WORKFLOW STEPS */}

          <div className={`${poppins.className} flex w-full flex-col justify-center gap-10 md:gap-14`}>

            {workflowSteps.map((step, idx) => (

              <motion.div
                key={step.number}

                initial={{
                  opacity: 0,
                  y: 50,
                  scale: 0.95,
                }}

                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}

                viewport={{
                  once: true,
                  margin: "-100px",
                }}

                transition={{
                  type: "spring",
                  stiffness: 60,
                  damping: 15,
                  delay: idx * 0.05,
                }}

                className="
                  group
                  flex
                  flex-col
                  gap-3
                  border-b
                  border-[#141E30]/10
                  pb-8
                  transition-colors
                  duration-300
                  last:border-b-0
                  hover:border-[#A67C3D]/30
                "
              >

                {/* NUMBER + TITLE */}

                <div className="flex items-baseline gap-4">

                  <span className="text-xl font-semibold text-[#A67C3D] md:text-2xl">
                    {step.number}
                  </span>

                  <h3 className="text-2xl font-bold tracking-tight text-[#141E30] md:text-3xl">
                    {step.title}
                  </h3>

                </div>


                {/* DESCRIPTION */}

                <p className="pl-8 text-base leading-relaxed text-[#141E30]/80 md:pl-10 md:text-lg">
                  {step.description}
                </p>

                {/* IMAGE WITH REVEAL EFFECT */}

                <div className="pl-8 md:pl-10 mt-4 overflow-hidden rounded-xl">
                  <RevealImage
                    src={step.image}
                    alt={step.title}
                    width={800}
                    height={500}
                    className="w-full h-[250px] sm:h-[350px] md:h-[400px]"
                  />
                </div>

              </motion.div>

            ))}

          </div>

        </div>
      </section>
     
    </div>
  );
}
