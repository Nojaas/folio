import Fade from "@/components/magicui/fade";

interface FadeTextProps {
  text: string;
  delay?: number;
  yOffset?: number;
  className?: string;
}

export default function FadeText({
  text,
  delay = 0,
  yOffset = 8,
  className,
}: FadeTextProps) {
  return (
    <Fade delay={delay} yOffset={yOffset}>
      <p className={className}>{text}</p>
    </Fade>
  );
}
