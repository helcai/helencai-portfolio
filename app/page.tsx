"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { AboutSection } from "@/components/about-section";
import { FanScene } from "@/components/fan-scene";
import { ProjectRow } from "@/components/project-row";
import { SiteHeader } from "@/components/site-header";

const FAN_PHRASES = [
  "a visual storyteller",
  "a brand designer",
  "an interaction designer",
  "an UI/UX designer",
  "a palindrome enthusiast",
] as const;

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
  const [activeSection, setActiveSection] = useState<"work" | "about" | null>(
    null,
  );
  const [phraseIndex, setPhraseIndex] = useState(0);
  const phraseRef = useRef<HTMLParagraphElement>(null);

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
      <div className="relative z-0 flex min-h-full flex-col">
        <section className="hero-stage relative min-h-svh">
          <FanScene
            phraseRef={phraseRef}
            onBladePass={() =>
              setPhraseIndex((index) => (index + 1) % FAN_PHRASES.length)
            }
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 z-30">
            <div className="pointer-events-auto">
              <SiteHeader
                workHref="#work"
                aboutHref="#about"
                workActive={activeSection === "work"}
                aboutActive={activeSection === "about"}
                onWorkClick={scrollToSection("work")}
                onAboutClick={scrollToSection("about")}
              />
            </div>
          </div>

          <div className="relative z-10 flex min-h-svh flex-col">
            <div className="mx-auto flex w-[90%] max-w-[1000px] flex-1 flex-col items-start pb-12 pt-[46svh] [@media(max-height:520px)]:pb-8 [@media(max-height:520px)]:pt-24 [@media(min-width:768px)_and_(min-height:700px)]:pt-[44svh] [@media(min-width:768px)_and_(min-height:700px)]:pb-16 xl:justify-end xl:pb-[130px] xl:pt-0">
              <section
                aria-labelledby="hero-heading"
                className="@container relative box-border flex w-full max-w-[743px] flex-col items-start text-left [@media(max-height:520px)]:max-w-[62%]"
              >
                <p className="text-[20px] font-medium leading-none text-black md:text-[24px] xl:absolute xl:top-[-28px] xl:left-0 xl:text-[28px]">
                  hi! i’m helen
                </p>
                <p
                  ref={phraseRef}
                  aria-live="polite"
                  className="mt-0 max-w-full whitespace-nowrap [font-family:var(--font-allison)] text-[clamp(2.5rem,11.2vw,2.85rem)] leading-[0.85] text-black md:mt-0 md:text-[clamp(3.75rem,7.2vw,4.75rem)] xl:mt-0 xl:text-[clamp(2.75rem,17cqi,131px)] xl:leading-[0.85]"
                >
                  {FAN_PHRASES[phraseIndex]}
                </p>
                <h1
                  id="hero-heading"
                  className="mt-1 max-w-[16.5rem] text-[20px] font-semibold leading-[1.3] text-text-primary sm:text-[22px] md:mt-1 md:max-w-[22rem] md:text-[26px] md:leading-[1.25] xl:mt-0 xl:max-w-[743px] xl:text-[40px] xl:leading-[normal]"
                >
                  specializing in engaging user experiences & enhancing brand
                  voices
                </h1>
                <div className="mt-4 flex w-full max-w-[654px] flex-col text-base leading-normal text-text-primary md:mt-5 md:text-[18px] xl:mt-[17px]">
                  <p>currently @ Parsons, Figma, & goodr</p>
                  <p>prev @ Forbes & Optum</p>
                </div>
              </section>
            </div>
          </div>
        </section>

        <main className="flex flex-1 flex-col">
          <section
            id="work"
            aria-labelledby="work-heading"
            className="mx-auto w-[90%] max-w-[1000px] scroll-mt-24 px-0 pb-12 pt-24 md:scroll-mt-28 md:pb-16 md:pt-32 xl:pt-40"
          >
            <h2
              id="work-heading"
              className="relative z-20 text-center [font-family:var(--font-allison)] text-[56px] leading-[0.85] text-black md:text-[76px] xl:text-[96px]"
            >
              my work
            </h2>
            <div id="work-cards" className="relative z-20 mt-10 md:mt-14">
              <div
                aria-hidden="true"
                className="work-fan-wash pointer-events-none absolute -top-16 bottom-0 left-1/2 w-screen -translate-x-1/2"
              />
              <div className="relative flex flex-col gap-10 md:gap-[60px]">
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
                title="MyAtlas"
                learned="Learned how thoughtful visual systems can make complex information feel clear, approachable, and engaging."
                description="a digital wellness platform that helps college students better understand and manage their mental health through personalized insights and passive health data."
                tags="UI/UX | BRANDING"
                imageSrc="/images/projects/myatlas/myatlas-default.png"
                hoverImageSrc="/images/projects/myatlas/myatlas-hover.png"
                reverse={false}
                href="/work/myatlas"
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
            </div>
          </section>

          <AboutSection />
        </main>
      </div>
    </div>
  );
}
