"use client";

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from "react";
import { AboutSection } from "@/components/about-section";
import { PageBackground } from "@/components/page-background";
import { ProjectRow } from "@/components/project-row";
import { SiteHeader } from "@/components/site-header";

const SHADOW_BACKGROUNDS = [
  {
    desktop: "/images/background/fireescape-shadow-bkg.webm",
    mobile: "/images/background/fireescape-shadow.png",
  },
  {
    desktop: "/images/background/flower-shadow-bkg.webm",
    mobile: "/images/background/flower-shadow.png",
  },
  {
    desktop: "/images/background/leaf-shadow-bkg.webm",
    mobile: "/images/background/leaf-shadow.png",
  },
] as const;

const DEFAULT_SHADOW = SHADOW_BACKGROUNDS[2];

function pickRandomShadow() {
  return SHADOW_BACKGROUNDS[
    Math.floor(Math.random() * SHADOW_BACKGROUNDS.length)
  ]!;
}

function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function scrollToSection(sectionId: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (!section) return;

    const header = document.querySelector("header");
    const headerOffset = (header?.getBoundingClientRect().height ?? 0) + 16;

    const top =
      section.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({ top, behavior: "smooth" });
  };
}

export default function Home() {
  const hasMounted = useHasMounted();
  const shadowBackground = useMemo(
    () => (hasMounted ? pickRandomShadow() : DEFAULT_SHADOW),
    [hasMounted],
  );
  const [activeSection, setActiveSection] = useState<"work" | "about" | null>(
    null,
  );

  useEffect(() => {
    const sectionIds = ["work", "about"] as const;
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        const nextSection = sectionIds.reduce<"work" | "about" | null>(
          (current, id) => {
            const ratio = ratios.get(id) ?? 0;
            if (ratio <= 0) return current;
            if (!current) return id;
            return ratio > (ratios.get(current) ?? 0) ? id : current;
          },
          null,
        );

        setActiveSection(nextSection);
      },
      {
        threshold: [0.05, 0.15, 0.3, 0.5],
        rootMargin: "-96px 0px -40% 0px",
      },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="homepage-root relative isolate min-h-full font-sans text-text-primary">
      <PageBackground
        desktopSrc={shadowBackground.desktop}
        mobileSrc={shadowBackground.mobile}
      />

      <div className="relative z-0 flex min-h-full flex-col">
        <SiteHeader
          workHref="#work"
          aboutHref="#about"
          workActive={activeSection === "work"}
          aboutActive={activeSection === "about"}
          onWorkClick={scrollToSection("work")}
          onAboutClick={scrollToSection("about")}
        />

        <main className="flex flex-1 flex-col">
          <div className="flex w-full justify-start md:justify-center">
            <section
              aria-labelledby="hero-heading"
              className="mx-auto box-border flex w-[90%] max-w-[654px] flex-col items-start gap-4 px-2 pb-28 pt-16 text-left sm:px-4 md:items-center md:gap-5 md:px-6 md:pt-24 md:text-center lg:px-8 lg:pb-32 lg:pt-[158px]"
            >
              <p className="[font-family:var(--font-hyc-handwritten-regular)] text-[28px] leading-8 text-black sm:text-[30px] md:text-[32px] md:leading-9 lg:text-[36px] lg:leading-10">
                hi! i’m helen
              </p>

              <h1
                id="hero-heading"
                className="text-[28px] font-semibold leading-[1.1] text-text-primary sm:text-[30px] md:text-[32px] lg:text-[36px] lg:leading-[1.15]"
              >
                a visual storyteller specializing in engaging user experiences &
                enhancing brand voices
              </h1>

              <div className="flex w-full flex-col text-base leading-normal text-text-primary lg:text-lg">
                <p>currently @ Parsons, Figma, & goodr</p>
                <p>prev @ Forbes & Optum</p>
              </div>
            </section>
          </div>

          <section
            id="work"
            aria-label="Work"
            className="mx-auto w-[90%] max-w-none scroll-mt-24 px-0 pb-12 md:scroll-mt-28 md:pb-16"
          >
            <div className="flex flex-col gap-10 md:gap-[60px]">
              <ProjectRow
                title="Social Templates for Forbes Media"
                learned="learned how design systems improve efficiency"
                description="created a 100+ card modular social template system with typography, spacing, and component guidelines for scalable Forbes branded content"
                tags="design system | branding"
                imageSrc="/images/projects/social-templates/default.png"
                hoverImageSrc="/images/projects/social-templates/hover.png"
                reverse={false}
                href="/work/social-templates"
              />
              <ProjectRow
                title="the miserable experience of being a woman"
                learned="learned how to transform complex topics into digestible experiences"
                description="an exploration of women’s invisibility in health data and policy, and how everyday life is rarely designed with the female body in mind."
                tags="interaction design | mixed media"
                imageSrc="/images/projects/tmeobaw/tmeobaw-default.png"
                hoverImageSrc="/images/projects/tmeobaw/tmeobaw-hover.png"
                reverse={true}
                href="/work/tmeobaw"
              />
              <ProjectRow
                title="man i love finance (milf)"
                learned="learned the importance of really listening to users"
                description="a learning platform that helps explain financial terms in a way that helps young girls understand."
                tags="UI/UX | BRANDING"
                imageSrc="/images/projects/milf/default.png"
                hoverImageSrc="/images/projects/milf/hover.png"
                reverse={false}
                href="/work/milf"
              />
              <ProjectRow
                title="Fusion Rebrand"
                learned="learned how even small design choices affect overall narrative"
                description="revitalizing Fusion's (part of Optum) visual identity to capture and reflect the team's evolution, growth, and new direction."
                tags="BRANDING & IDENTITY"
                imageSrc="/images/projects/fusion/default.png"
                hoverImageSrc="/images/projects/fusion/hover.png"
                reverse={true}
                href="/work/fusion"
              />
              <ProjectRow
                title="Analytics on Demand for Optum"
                learned="learned how to translate insights from design thinking frameworks into actionable insights"
                description="reimagining the Analytics on Demand experience to enable analytic operators to work at the top of their license and increase throughput and impact of the business functions they support"
                tags="UI/UX | Design frameworks"
                imageSrc="/images/projects/aod/default.png"
                hoverImageSrc="/images/projects/aod/hover.png"
                reverse={false}
                href="/work/aod"
              />
            </div>
          </section>

          <AboutSection />
        </main>
      </div>
    </div>
  );
}
