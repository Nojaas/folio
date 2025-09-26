"use client";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavBody,
  NavItems,
} from "@/components/ui/resizable-navbar";
import { DATA } from "@/data/resume";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

export default function ResizableNav() {
  const items = DATA.navbar.map((item) => ({
    name: item.label,
    link: item.href,
  }));
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Navbar>
      <NavBody>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative overflow-hidden rounded-full">
              <Image
                src="/avatar.jpg"
                alt="Avatar"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
                priority
              />
            </div>
          </div>

          <NavItems items={items} onItemClick={() => setIsOpen(false)} />

          <div className="ml-auto flex items-center gap-2">
            <AnimatedThemeToggler />
          </div>
        </div>
      </NavBody>

      <MobileNav className="h-full">
        <MobileNavHeader className="w-full justify-end pr-2">
          <MobileNavToggle
            isOpen={isOpen}
            onClick={() => setIsOpen((v) => !v)}
          />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="flex flex-1 flex-col items-center justify-center gap-8 h-full">
            {items.map((item, idx) => (
              <motion.a
                key={item.link}
                href={item.link}
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 * idx,
                  type: "spring",
                }}
                className="w-fit relative text-2xl font-medium text-neutral-800 transition-colors hover:text-neutral-500 dark:text-neutral-200 dark:hover:text-neutral-400"
              >
                {item.name}
              </motion.a>
            ))}
            <div className="pt-2">
              <AnimatedThemeToggler />
            </div>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
