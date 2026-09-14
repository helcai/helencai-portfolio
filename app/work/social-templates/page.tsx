import Image from "next/image";
import { CaseStudyVideo } from "@/components/case-study-video";
import { SiteHeader } from "@/components/site-header";

const BENEFITS = [
  {
    title: "Consistent Branding",
    body: "Standardized layouts and typography create a cohesive, recognizable look across every social post.",
  },
  {
    title: "Faster Turnaround",
    body: "Ready-to-use templates help teams publish high-quality content quickly to meet editorial and client demands.",
  },
  {
    title: "Streamlined Collaboration",
    body: "Templates let designers define the system while editors update copy within set word and character limits, reducing revisions.",
  },
] as const;

const GUIDELINE_IMAGES = [
  {
    src: "/images/projects/social-templates/type-scale.png",
    alt: "Forbes social type scale showing headline through caption sizes",
  },
  {
    src: "/images/projects/social-templates/type-style.png",
    alt: "Typography styles used across Forbes BrandVoice social cards",
  },
  {
    src: "/images/projects/social-templates/spacing-padding.png",
    alt: "Spacing and padding guidelines of 60, 80, and 120 pixels",
  },
] as const;

export default function SocialTemplatesPage() {
  return (
    <div className="relative flex min-h-full flex-col overflow-x-clip font-sans text-text-primary">
        <SiteHeader workHref="/#work" aboutHref="/#about" workActive />

        <main className="flex flex-1 justify-center pb-16 pt-10 md:pb-20 md:pt-12 lg:pb-[100px] lg:pt-16">
          <article className="flex w-[90%] max-w-[900px] flex-col gap-8 md:gap-10">
            <CaseStudyVideo
              src="/images/projects/social-templates/social-template-header-video.mp4"
              width={900}
              height={432}
              label="Animated showcase of overlapping Forbes social template cards"
              className="aspect-[900/432]"
            />

            <header className="flex w-full flex-col items-start text-black">
              <p className="text-[20px] font-normal uppercase leading-[1.27] md:text-[24px] md:leading-[30.577px]">
                Forbes media
              </p>
              <h1 className="text-[32px] font-semibold leading-tight md:text-[40px] md:leading-normal">
                Social Templates
              </h1>
            </header>

            <dl className="grid w-full grid-cols-2 gap-x-6 gap-y-5 text-base uppercase text-black md:grid-cols-4 md:gap-10">
              <div className="flex min-w-0 flex-col items-start">
                <dt className="font-semibold">role</dt>
                <dd className="font-normal">
                  design intern on the content & design studio, 2026
                </dd>
              </div>
              <div className="flex min-w-0 flex-col items-start">
                <dt className="font-semibold">skills</dt>
                <dd className="font-normal">
                  design system
                  <br />
                  branding
                </dd>
              </div>
              <div className="flex min-w-0 flex-col items-start">
                <dt className="font-semibold">tools</dt>
                <dd className="font-normal">figma</dd>
              </div>
              <div className="flex min-w-0 flex-col items-start">
                <dt className="font-semibold">timeline</dt>
                <dd className="font-normal">10 weeks</dd>
              </div>
            </dl>

            <section className="flex w-full flex-col gap-5 text-black" aria-labelledby="overview-heading">
              <h2
                id="overview-heading"
                className="text-[20px] font-semibold uppercase leading-[30.577px]"
              >
                overview
              </h2>
              <p className="text-base font-medium leading-normal">
                Created a 100+ card modular social template system with
                typography, spacing, and component guidelines for scalable
                Forbes branded content.
              </p>
            </section>

            <CaseStudyVideo
              src="/images/projects/social-templates/live-example.mp4"
              width={900}
              height={250}
              label="Live examples of Forbes social cards flipping into finished branded layouts"
              className="aspect-[900/250]"
            />

            <div className="flex w-full flex-col gap-4 text-base font-medium leading-normal text-black">
              <p>
                At the start of my time at Forbes, I had a coffee chat with
                Forbes CEO, Sherry Phillips, where we talked about the changing
                media landscape and how Forbes has been navigating the shift.
                Forbes began as a traditional print media company, but as
                audiences increasingly turned to the internet, and social media,
                for news, the brand recognized the need to evolve how it told
                and distributed stories.
              </p>
              <p>
                As these habits changed, the way stories were presented became
                just as important as where they were shared. With social content
                continuing to grow, there was an opportunity to create a more
                cohesive visual language while making the production process
                more efficient and scalable.
              </p>
            </div>

            <section
              className="flex w-full flex-col gap-5"
              aria-labelledby="benefits-heading"
            >
              <h2
                id="benefits-heading"
                className="text-[20px] font-semibold uppercase leading-[30.577px] text-black"
              >
                How Social Templates Improve Speed, Consistency, and Scale
              </h2>
              <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {BENEFITS.map((benefit) => (
                  <li
                    key={benefit.title}
                    className="flex flex-col gap-5 rounded-[7.5px] bg-black p-8 text-white md:min-h-[258px] md:p-10"
                  >
                    <h3 className="min-h-[52px] text-[22px] font-medium leading-[1.05] md:min-h-[50px] md:text-[24px]">
  {benefit.title}
</h3>
                    <p className="text-base font-normal leading-[1.23] tracking-[-0.02em] md:tracking-[-0.05em]">
                      {benefit.body}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section
              className="flex w-full flex-col gap-5"
              aria-labelledby="result-heading"
            >
              <h2
                id="result-heading"
                className="text-[20px] font-semibold uppercase leading-[30.577px] text-black"
              >
                the result:{" "}
                <span className="font-semibold">
                  100+ ready-to-use card templates
                </span>
              </h2>
              <div className="flex flex-col gap-4 text-base font-medium leading-normal text-black">
                <p>
                  After conducting external and internal competitive analysis
                  and aligning with Forbes’ existing brand guidelines, I created
                  over 100 card templates spanning 13 different content
                  categories.
                </p>
                <p>
                  To support a consistent visual system, I also developed
                  typography and spacing guidelines tailored specifically for
                  social. Each card included recommendations for line and
                  character length to help maintain readability and consistency
                  across formats. The full system was then presented and shared
                  with the Content and Design Studio for use across social
                  content.
                </p>
              </div>
            </section>

            <div className="flex w-full flex-col items-stretch gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
              <div className="flex w-full flex-col gap-[45px] lg:w-[360px] lg:shrink-0">
                {GUIDELINE_IMAGES.map((image) => (
                  <div
                    key={image.src}
                    className="relative aspect-[720/405] w-full overflow-hidden bg-white"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 1023px) 90vw, 360px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="relative aspect-[444/698] w-full overflow-hidden lg:w-[444px] lg:shrink-0">
                <Image
                  src="/images/projects/social-templates/overview-image.png"
                  alt="Figma overview of more than 100 Forbes social card templates organized by type"
                  fill
                  sizes="(max-width: 1023px) 90vw, 444px"
                  className="object-cover"
                />
              </div>
            </div>

            <section
              className="flex w-full flex-col gap-5"
              aria-labelledby="card-types-heading"
            >
              <h2
                id="card-types-heading"
                className="text-[20px] font-semibold uppercase leading-[30.577px] text-black"
              >
                card types
              </h2>
              <div className="relative aspect-[1800/794] w-full">
                <Image
                  src="/images/projects/social-templates/card-types.png"
                  alt="Ten Forbes social card types: image cover, pull quote, listicle, icon list, card, data, Q and A, timeline, quiz, and text focus"
                  fill
                  sizes="(max-width: 900px) 90vw, 900px"
                  className="object-contain"
                />
              </div>
            </section>

            <section
              className="flex w-full flex-col gap-5 text-black"
              aria-labelledby="learnings-heading"
            >
              <h2
                id="learnings-heading"
                className="text-[20px] font-semibold uppercase leading-[30.577px]"
              >
                Next steps & learnings
              </h2>
              <div className="flex flex-col gap-4 text-base font-medium leading-normal">
                <p>
                  In my presentation to the Content & Design team, I shared the
                  work with the editorial side for the first time, along with
                  recommendations to explore motion and sound, capabilities the
                  team already had but had not yet brought into social.
                </p>
                <p>
                  The next step would have been to work closely with editors to
                  test and refine the templates using real content. One
                  real-life test helped shape the system, with further iteration
                  needed to make it more flexible and effective.
                </p>
                <p>
                  This project showed me how design systems can improve
                  efficiency and scalability while reinforcing brand through a
                  cohesive foundation for storytelling & I am excited to hear
                  back about how it has been implemented by the team.
                </p>
              </div>
            </section>
          </article>
        </main>
      </div>
  );
}
