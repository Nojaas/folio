"use client";

/* eslint-disable @next/next/no-img-element */
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export const ContactCard = (props: {
  image: string;
  mediumImage?: string | React.ReactNode;
  name: string;
  description: string;
  url: string;
  className?: string;
  download?: boolean;
}) => {
  const handleClick = () => {
    if (props.download) {
      toast.success("CV téléchargé avec succès !");
    }
  };

  return (
    <Link
      href={props.url}
      download={props.download}
      className={cn("w-full", props.className)}
      onClick={handleClick}
    >
      <Card className="p-3 bg-accent/10 hover:bg-accent/30 transition-colors group flex items-center gap-4 h-16">
        <div className="relative w-10 h-10">
          <img
            src={props.image}
            alt={props.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {typeof props.mediumImage === "string" ? (
            <img
              src={props.mediumImage}
              alt={props.name}
              className="w-4 h-4 absolute -bottom-1 -right-1 rounded-full object-contain"
            />
          ) : props.mediumImage ? (
            <span className="w-4 h-4 absolute -bottom-1 -right-1 rounded-full flex items-center justify-center">
              {props.mediumImage}
            </span>
          ) : null}
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold">{props.name}</p>
          <p className="text-xs text-muted-foreground">{props.description}</p>
        </div>
        <ArrowUpRight
          className="group-hover:translate-x-2 mr-4 group-hover:-translate-y-2 transition-transform"
          size={16}
        />
      </Card>
    </Link>
  );
};
