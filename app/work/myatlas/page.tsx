import { LightboxImage } from "@/components/lightbox-image";
import { SiteHeader } from "@/components/site-header";

const DESIGN_SYSTEM_IMAGES = [
  {
    src: "/images/projects/myatlas/logotype.jpg",
    alt: "MyAtlas logotype construction notes for the Fenwick Bold wordmark",
  },
  {
    src: "/images/projects/myatlas/logomark.jpg",
    alt: "MyAtlas logomark construction with the hand-drawn brain character",
  },
  {
    src: "/images/projects/myatlas/color.jpg",
    alt: "MyAtlas color palette distribution with named swatches and hex codes",
  },
  {
    src: "/images/projects/myatlas/color-usage.jpg",
    alt: "MyAtlas color palette usage shown across three app screens",
  },
  {
    src: "/images/projects/myatlas/type.jpg",
    alt: "MyAtlas brand typefaces: Fenwick, Quasimoda, and Inter",
  },
  {
    src: "/images/projects/myatlas/type-hierarchy.jpg",
    alt: "MyAtlas typography hierarchy from Heading 1 through large numbers",
  },
  {
    src: "/images/projects/myatlas/components-1.jpg",
    alt: "MyAtlas UI components: buttons, tags, and navigation controls",
  },
  {
    src: "/images/projects/myatlas/components-2.jpg",
    alt: "MyAtlas UI components: activity cards, inputs, and goal checklist items",
  },
  {
    src: "/images/projects/myatlas/components-3.jpg",
    alt: "MyAtlas UI components: connected device card, goal reminders, insight card, and add-goal modal",
  },
  {
    src: "/images/projects/myatlas/components-4.jpg",
    alt: "MyAtlas UI components: mood sliders and Likert-scale rating controls",
  },
] as const;

export default function MyAtlasPage() {
  return (
    <div className="relative flex min-h-full flex-col overflow-x-clip font-sans text-text-primary">
      <SiteHeader workHref="/#work" aboutHref="/#about" workActive />

      <main className="flex flex-1 justify-center pb-16 pt-10 md:pb-20 md:pt-12 lg:pb-[100px] lg:pt-16">
        <article className="flex w-[90%] max-w-[900px] flex-col gap-8 md:gap-10">
          <LightboxImage
            src="/images/projects/myatlas/myatlas-cover.png"
            alt="MyAtlas app screens showing profile, dashboard, and wellness check interfaces"
            priority
            sizes="(max-width: 900px) 90vw, 900px"
            className="aspect-[1200/858]"
          />

          <header className="flex w-full flex-col items-start text-black">
            <p className="text-[20px] font-normal uppercase leading-[1.27] md:text-[24px] md:leading-[30.577px]">
              generate product development
            </p>
            <h1 className="text-[32px] font-semibold leading-tight md:text-[40px] md:leading-normal">
              MyAtlas
            </h1>
          </header>

          <dl className="grid w-full grid-cols-1 gap-x-10 gap-y-5 text-base uppercase text-black sm:grid-cols-2">
            <div className="flex min-w-0 flex-col items-start">
              <dt className="font-semibold">role</dt>
              <dd className="font-normal">
                Designer for{" "}
                <a
                  href="https://generatenu.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  generate product development studio
                </a>
              </dd>
            </div>
            <div className="flex min-w-0 flex-col items-start">
              <dt className="font-semibold">skills</dt>
              <dd className="font-normal">
                branding &amp; identity
                <br />
                UI/ux
              </dd>
            </div>
            <div className="flex min-w-0 flex-col items-start">
              <dt className="font-semibold">tools</dt>
              <dd className="font-normal">figma</dd>
            </div>
            <div className="flex min-w-0 flex-col items-start">
              <dt className="font-semibold">timeline</dt>
              <dd className="font-normal">3 months</dd>
            </div>
          </dl>

          <p className="text-base font-medium leading-normal text-black">
            MyAtlas is an innovative digital health application that provides
            evidence-based personalized mental wellness support to college
            students and their wellness care team. My Atlas has developed a
            novel 3P (PPP) model to inform their application, with the 3 Ps
            standing for personalized, passive, and proactive. By passively
            monitoring mental health digital biomarkers collected from wearable
            health devices, My Atlas will proactively provide personalized
            mental health tips and treatment options to users.
          </p>

          <section
            aria-label="Problem and solution"
            className="grid w-full grid-cols-1 gap-8 text-black md:grid-cols-2 md:gap-10"
          >
            <div className="flex flex-col gap-5">
              <h2 className="text-[20px] font-semibold leading-[1.3] md:text-[24px] md:leading-[30.577px]">
                How Might We…reimagine the mental health care space by providing
                personalized, passive, and proactive care?
              </h2>
              <p className="text-base font-medium leading-normal">
                Mental health is often tracked through manual check-ins and
                occasional appointments, making it difficult to understand how
                someone is doing between sessions. Manual monitoring can add
                another burden for already overwhelmed users.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <h2 className="text-[20px] font-semibold leading-[1.3] md:text-[24px] md:leading-[30.577px]">
                We Can By...making mental wellness tracking more seamless
                through personalized check-ins and passive health data.
              </h2>
              <p className="text-base font-medium leading-normal">
                MyAtlas aims to fill this gap by creating a personalized
                wellness platform combining daily check-ins, goals, insights,
                and passive biometric data to make mental health care more
                continuous.
              </p>
            </div>
          </section>

          <section
            className="flex w-full flex-col gap-5 text-black"
            aria-labelledby="learnings-heading"
          >
            <h2
              id="learnings-heading"
              className="text-[20px] font-semibold uppercase leading-[30.577px] md:text-[24px]"
            >
              learnings &amp; takeaways
            </h2>
            <p className="text-base font-medium leading-normal">
              MyAtlas taught me how to make complex mental wellness data feel
              approachable and human while balancing the credibility of a
              healthcare product with the warmth of a self-care experience.
              Developing the brand alongside the product also showed me how
              typography, color, and visual hierarchy can create a cohesive
              experience that builds trust and makes information easier to
              understand.
            </p>
          </section>

          <section
            aria-label="Brand and design system"
            className="grid w-full grid-cols-1 gap-[21px] sm:grid-cols-2"
          >
            {DESIGN_SYSTEM_IMAGES.map((image) => (
              <LightboxImage
                key={image.src}
                src={image.src}
                alt={image.alt}
                sizes="(max-width: 639px) 90vw, (max-width: 900px) 45vw, 440px"
                className="aspect-[842/595]"
              />
            ))}
          </section>
        </article>
      </main>
    </div>
  );
}
