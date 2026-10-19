"use client";

import { AvailabilityDot } from "@/app/components/AvailabilityDot";
import { DownFastLabel } from "@/app/components/DownFastLink";
import { DATA } from "@/data/resume";
import { motion } from "motion/react";

export function AvailableContent({
  label,
  reduceMotion,
  transition,
}: {
  label: string;
  reduceMotion: boolean | null;
  transition: object;
}) {
  return (
    <motion.div
      key="available"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={
        reduceMotion
          ? undefined
          : { opacity: 0, position: "absolute", left: 0, top: 0 }
      }
      transition={transition}
      className="inline-flex"
    >
      <motion.a
        href={`mailto:${DATA.contact.email}`}
        aria-label={label}
        initial="rest"
        whileHover="hover"
        className="inline-flex shrink-0 items-center gap-2 px-3.5 py-3 sm:px-4 sm:py-2.5"
      >
        <AvailabilityDot delayMs={900} />
        <DownFastLabel
          label={label}
          className="text-[13px] font-medium tracking-tight text-inherit sm:text-[13px]"
        />
      </motion.a>
    </motion.div>
  );
}
