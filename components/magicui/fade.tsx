"use client";

import { motion } from "framer-motion";
import * as React from "react";

interface FadeProps extends React.PropsWithChildren {
  delay?: number;
  yOffset?: number;
  className?: string;
}

export default function Fade({
  children,
  delay = 0,
  yOffset = 12,
  className,
}: FadeProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
