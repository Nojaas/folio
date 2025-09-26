import { PhoneIcon } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";
import { EemiIcon } from "./EemiIcon";
import { GithubIcon } from "./GithubIcon";
import { HeticIcon } from "./HeticIcon";
import { LinkedInIcon } from "./LinkedInIcon";
import { MailIcon } from "./MailIcon";
import { PerfmakerIcon } from "./PerfmakerIcon";

type SvgProps = ComponentPropsWithoutRef<"svg"> & { size?: number };

export const Icons = {
  eemi: (props: SvgProps) => <EemiIcon {...props} />,
  github: (props: SvgProps) => <GithubIcon {...props} />,
  hetic: (props: SvgProps) => <HeticIcon {...props} />,
  linkedin: (props: SvgProps) => <LinkedInIcon {...props} />,
  email: (props: SvgProps) => <MailIcon {...props} />,
  phone: (props: SvgProps) => <PhoneIcon {...props} />,
  perfmaker: (props: SvgProps) => <PerfmakerIcon {...props} />,
};

export type IconsMap = typeof Icons;
