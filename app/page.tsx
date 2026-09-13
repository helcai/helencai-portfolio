"use client";

import Image from "next/image";
import Link from "next/link";
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

const SHADOW_BACKGROUND_VIDEOS = [
  "/images/background/fireescape-shadow-bkg.webm",
  "/images/background/flower-shadow-bkg.webm",
  "/images/background/leaf-shadow-bkg.webm",
] as const;

const DEFAULT_SHADOW_VIDEO = SHADOW_BACKGROUND_VIDEOS[2];

function pickRandomShadowVideo() {
  return SHADOW_BACKGROUND_VIDEOS[
    Math.floor(Math.random() * SHADOW_BACKGROUND_VIDEOS.length)
  ]!;
}

function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

type NavItemProps = {
  href: string;
  label: string;
  active?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

function NavItem({ href, label, active = false, onClick }: NavItemProps) {
  const visibleWeight = active ? "font-semibold" : "font-medium";

  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={active ? "location" : undefined}
      className="grid text-text-primary [&>*]:col-start-1 [&>*]:row-start-1"
    >
      <span aria-hidden className="invisible font-semibold uppercase">
        {label}
      </span>
      <span
        className={`uppercase transition-[font-weight] duration-200 ease-in-out hover:font-semibold ${visibleWeight}`}
      >
        {label}
      </span>
    </a>
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
  const shadowVideoSrc = useMemo(
    () => (hasMounted ? pickRandomShadowVideo() : DEFAULT_SHADOW_VIDEO),
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
    <>
      <PageBackground videoSrc={shadowVideoSrc} />

      <div className="relative flex min-h-full flex-col overflow-x-clip font-sans text-text-primary">
        <header className="mx-auto flex w-[90%] max-w-[1512px] items-center justify-between px-0 pt-12 md:gap-6 md:pt-12 lg:px-0 lg:pt-[50px]">
          <Link href="/" className="shrink-0" aria-label="Helen Cai — home">
            <Image
              src="/images/branding/ihearthyc.svg"
              alt="i heart hyc"
              width={129}
              height={46}
              priority
              className="h-10 w-auto md:h-11 lg:h-[46px]"
            />
          </Link>

          <nav aria-label="Primary">
            <ul className="flex items-center gap-6 text-base uppercase tracking-normal md:gap-10 md:text-lg lg:gap-20">
              <li>
                <NavItem
                  href="#work"
                  label="work"
                  active={activeSection === "work"}
                  onClick={scrollToSection("work")}
                />
              </li>
              <li>
                <NavItem
                  href="#about"
                  label="about"
                  active={activeSection === "about"}
                  onClick={scrollToSection("about")}
                />
              </li>
            </ul>
          </nav>
        </header>

        <main className="flex flex-1 flex-col">
          <div className="flex w-full justify-center">
            <section
              aria-labelledby="hero-heading"
              className="mx-auto box-border flex w-[90%] max-w-[654px] flex-col items-center gap-4 px-2 pb-28 pt-16 text-center sm:px-4 md:gap-5 md:px-6 md:pt-24 lg:px-8 lg:pb-32 lg:pt-[158px]"
            >
              <p className="font-cedarville text-[28px] leading-8 text-black sm:text-[30px] md:text-[32px] md:leading-9 lg:text-[36px] lg:leading-10">
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
              />
              <ProjectRow
                title="the miserable experience of being a woman"
                learned="learned how to transform complex topics into digestible experiences"
                description="an exploration of women’s invisibility in health data and policy, and how everyday life is rarely designed with the female body in mind."
                tags="interaction design | mixed media"
                imageSrc="/images/projects/tmeobaw/tmeobaw-default.png"
                hoverImageSrc="/images/projects/tmeobaw/tmeobaw-hover.png"
                reverse={true}
              />
              <ProjectRow
                title="man i love finance (milf)"
                learned="learned the importance of really listening to users"
                description="a learning platform that helps explain financial terms in a way that helps young girls understand."
                tags="UI/UX | BRANDING"
                imageSrc="/images/projects/milf/default.png"
                hoverImageSrc="/images/projects/milf/hover.png"
                reverse={false}
              />
              <ProjectRow
                title="Fusion Rebrand"
                learned="learned how even small design choices affect overall narrative"
                description="revitalizing Fusion's (part of Optum) visual identity to capture and reflect the team's evolution, growth, and new direction."
                tags="BRANDING & IDENTITY"
                imageSrc="/images/projects/fusion/default.png"
                hoverImageSrc="/images/projects/fusion/hover.png"
                reverse={true}
              />
              <ProjectRow
                title="Analytics on Demand for Optum"
                learned="learned how to translate insights from design thinking frameworks into actionable insights"
                description="reimagining the Analytics on Demand experience to enable analytic operators to work at the top of their license and increase throughput and impact of the business functions they support"
                tags="UI/UX | Design frameworks"
                imageSrc="/images/projects/aod/default.png"
                hoverImageSrc="/images/projects/aod/hover.png"
                reverse={false}
              />
            </div>
          </section>

          <AboutSection />
        </main>
      </div>
    </>
  );
}
