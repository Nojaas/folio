"use client";
import { Badge } from "@/components/ui/badge";
import { MagicCard } from "@/components/ui/magic-card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
const MarkdownComponent = ReactMarkdown as unknown as (props: {
  children?: React.ReactNode;
}) => React.ReactElement;

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  link,
  image,
  video,
  links,
  className,
}: Props) {
  function getSafeHref(input?: string): string {
    if (!input) return "#";
    if (input.startsWith("/")) return input;
    if (input.startsWith("#")) return input;
    if (input.startsWith("mailto:") || input.startsWith("tel:")) return input;
    try {
      const url = new URL(input);
      if (!url.hostname) return "#";
      return input;
    } catch {
      return "#";
    }
  }

  const safeHref = getSafeHref(href);
  return (
    <div className={cn("relative block p-2 h-full w-full", className)}>
      <Link href={safeHref} className="block h-full">
        <div className="relative z-10 rounded-2xl cursor-pointer h-full">
          <MagicCard
            gradientColor={"var(--magic-card-gradient-color)"}
            gradientOpacity={0.6}
            className="p-0 h-full"
          >
            <div
              className={cn(
                "flex flex-col h-full rounded-2xl p-4 overflow-hidden"
              )}
            >
              {(video || image) && (
                <div className="-m-4 mb-0">
                  {video ? (
                    <video
                      src={video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      className="pointer-events-none mx-auto h-40 w-full object-cover object-[40%_60%]"
                    />
                  ) : (
                    image && (
                      <Image
                        src={image}
                        alt={title}
                        width={500}
                        height={300}
                        className="h-40 w-full overflow-hidden object-cover object-top"
                      />
                    )
                  )}
                </div>
              )}

              <div className="space-y-1 flex-1 flex flex-col">
                <h4 className="mt-1 text-base font-bold tracking-wide text-zinc-900 dark:text-zinc-100">
                  {title}
                </h4>
                <time className="font-sans text-xs text-zinc-600 dark:text-zinc-400">
                  {dates}
                </time>
                <div className="hidden font-sans text-xs underline print:visible">
                  {link
                    ?.replace("https://", "")
                    .replace("www.", "")
                    .replace("/", "")}
                </div>
                <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 flex-1">
                  <div className="prose max-w-full text-pretty font-sans dark:prose-invert h-full">
                    <MarkdownComponent>{description}</MarkdownComponent>
                  </div>
                </div>
              </div>

              {tags && tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags?.map((tag) => (
                    <Badge
                      className="px-3 py-1.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-0 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                      variant="secondary"
                      key={tag}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {links && links.length > 0 && (
                <div className="mt-3 flex flex-row flex-wrap items-start gap-2">
                  {links?.map((link, idx) => (
                    <Link href={link?.href} key={idx} target="_blank">
                      <Badge
                        key={idx}
                        className="flex gap-2 px-3 py-1.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-0 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                      >
                        {link.icon}
                        {link.type}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </MagicCard>
        </div>
      </Link>
    </div>
  );
}
