import { cn } from "@/lib/utils";
import * as React from "react";

export type AvatarProps = React.HTMLAttributes<HTMLDivElement>;

export function Avatar({ className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export type AvatarImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export function AvatarImage({ className, alt, ...props }: AvatarImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      {...props}
    />
  );
}

export type AvatarFallbackProps = React.HTMLAttributes<HTMLSpanElement>;

export function AvatarFallback({
  className,
  children,
  ...props
}: AvatarFallbackProps) {
  return (
    <span
      className={cn("select-none text-sm font-medium", className)}
      {...props}
    >
      {children}
    </span>
  );
}
