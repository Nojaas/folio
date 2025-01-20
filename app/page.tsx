/* import { Spotlight } from "@/components/ui/spotlight";
import ShimmerButton from "@/components/ui/shimmer-button"; */

import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Skills } from "./components/Skills";
import { Spacing } from "./components/Spacing";
import { Status } from "./components/Status";

export default function Home() {
  return (
    <main>
      <Header />
      <Spacing size="md" />
      <Hero />
      <Spacing size="md" />
      <Status />
      <Spacing size="md" />
      <Skills />
      <Spacing size="md" />
      <Contact />
      <Spacing size="md" />
      <Footer />
    </main>
  );
}

/*     <div className="relative h-screen w-full bg-black/[0.96] antialiased bg-grid-white/[0.02] flex items-center justify-center">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0 flex flex-col items-center">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Jason Leroy
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 text-center">
          Work in progress. Stay tuned for updates.
        </p>
        <a
          href="https://www.linkedin.com/in/jason-leroy"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ShimmerButton className="mt-8 shadow-2xl">
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
              Contact Me
            </span>
          </ShimmerButton>
        </a>
      </div>
    </div> */
