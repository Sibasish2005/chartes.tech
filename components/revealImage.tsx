"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface RevealImageProps {
  src: string;
  alt: string;
  width:number;
  height:number;
  className?: string;
}

export default function RevealImage({
  src,
  alt,
  width,
  height,
  className = "",
}: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(0% 50% 0% 50%)", "inset(0% 0% 0% 0%)"]
  );

  return (
    <motion.div
      ref={ref}
      style={{ clipPath }}
      className={className}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
}