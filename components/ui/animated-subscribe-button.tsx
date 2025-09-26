"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import { useEffect, useState } from "react";

export interface AnimatedSubscribeButtonProps {
  subscribeStatus?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const AnimatedSubscribeButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedSubscribeButtonProps
>(
  (
    {
      subscribeStatus,
      onClick,
      className,
      children,
      type,
      onMouseEnter,
      onMouseLeave,
    },
    ref
  ) => {
    const isControlled = subscribeStatus !== undefined; // controlled vs uncontrolled check
    const [isSubscribed, setIsSubscribed] = useState<boolean>(
      subscribeStatus ?? false
    );

    useEffect(() => {
      if (isControlled) {
        setIsSubscribed(subscribeStatus!);
      }
    }, [subscribeStatus, isControlled]);

    if (
      React.Children.count(children) !== 2 ||
      !React.Children.toArray(children).every(
        (child) => React.isValidElement(child) && child.type === "span"
      )
    ) {
      throw new Error(
        "AnimatedSubscribeButton expects two children, both of which must be <span> elements."
      );
    }

    const childrenArray = React.Children.toArray(children);
    const initialChild = childrenArray[0];
    const changeChild = childrenArray[1];

    return (
      <AnimatePresence mode="wait">
        {isSubscribed ? (
          <motion.button
            ref={ref}
            className={cn(
              "bg-primary text-primary-foreground relative flex h-10 w-fit items-center justify-center overflow-hidden rounded-lg px-6",
              className
            )}
            type={type}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (!isControlled) {
                setIsSubscribed(false); // Only toggle manually if uncontrolled
              }
              onClick?.(e);
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              key="action"
              className="relative flex h-full w-full items-center justify-center font-semibold"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
            >
              {changeChild} {/* Use children for subscribed state */}
            </motion.span>
          </motion.button>
        ) : (
          <motion.button
            ref={ref}
            className={cn(
              "bg-primary text-primary-foreground relative flex h-10 w-fit cursor-pointer items-center justify-center rounded-lg border-none px-6",
              className
            )}
            onClick={(e) => {
              if (!isControlled) {
                setIsSubscribed(true); // Only toggle manually if uncontrolled
              }
              onClick?.(e);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              key="reaction"
              className="relative flex items-center justify-center font-semibold"
              initial={{ x: 0 }}
              exit={{ x: 50, transition: { duration: 0.1 } }}
            >
              {initialChild} {/* Use children for unsubscribed state */}
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    );
  }
);

AnimatedSubscribeButton.displayName = "AnimatedSubscribeButton";
