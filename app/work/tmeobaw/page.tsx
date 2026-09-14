import Image from "next/image";
import { CaseStudyVideo } from "@/components/case-study-video";
import { SiteHeader } from "@/components/site-header";

export default function TmeobawPage() {
  return (
    <div className="relative flex min-h-full flex-col overflow-x-clip font-sans text-text-primary">
      <SiteHeader workHref="/#work" aboutHref="/#about" workActive />

      <main className="flex flex-1 justify-center pb-16 pt-10 md:pb-20 md:pt-12 lg:pb-[100px] lg:pt-16">
        <article className="flex w-[90%] max-w-[900px] flex-col gap-8 md:gap-10">
          <CaseStudyVideo
            src="/images/projects/tmeobaw/meobaw-item%20search.mp4"
            width={1060}
            height={720}
            label="Interactive TMEOBaW website: a cursor flashlight revealing objects on a blue field"
            className="aspect-[1060/720]"
          />

          <header className="flex w-full flex-col items-start text-black">
            <p className="text-[20px] font-normal uppercase leading-[1.27] md:text-[24px] md:leading-[30.577px]">
              MFADT @ Parsons School of Design
            </p>
            <h1 className="text-[28px] font-semibold leading-tight sm:text-[32px] md:text-[40px] md:leading-normal">
              the miserable experience of being a woman
            </h1>
          </header>

          <dl className="grid w-full grid-cols-1 gap-x-10 gap-y-4 text-base uppercase text-black sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex min-w-0 flex-col items-start">
              <dt className="font-semibold">role</dt>
              <dd className="font-normal">
                ongoing thesis
                <br />
                project (mfa design & technology)
              </dd>
            </div>
            <div className="flex min-w-0 flex-col items-start">
              <dt className="font-semibold">skills</dt>
              <dd className="font-normal">
                interaction design
                <br />
                storytelling
              </dd>
            </div>
            <div className="flex min-w-0 flex-col items-start">
              <dt className="font-semibold">tools</dt>
              <dd className="font-normal">
                cyanotype
                <br />
                figma
                <br />
                cursor
              </dd>
            </div>
            <div className="flex min-w-0 flex-col items-start">
              <dt className="font-semibold">timeline</dt>
              <dd className="font-normal">ongoing (3 months)</dd>
            </div>
          </dl>

          <div className="flex w-full flex-col gap-4 text-base font-medium leading-normal text-black">
            <p>
              <span className="font-semibold">
                the miserable experience of being a woman
              </span>{" "}
              is an exploration of the invisibility and exclusion of women from
              health-related data and systemic policies, and the realization
              that “day-to-day” life is rarely calibrated for the female body or
              designed in a way that has the female population in mind.
            </p>
            <p>
              The project takes form in a multi-media approach with cyanotype
              stop motion embedded into a digital interactive website. Cyanotypes
              were chosen for their unique method of production; the print
              reveals itself only through what is blocked out. By capturing the
              silhouette of an object through the denial of light, the medium
              acts as a formal parallel to the project's focus on the
              marginalized and exclusion of women. It highlights the shape of
              what is missing.
            </p>
            <p>
              This project serves as a stark reminder that women are often
              forced to exist within a framework that fails to see them, a world
              not designed for us, despite being the foundation of it
            </p>
          </div>

          <p className="[font-family:var(--font-hyc-handwritten-regular)] text-base font-normal leading-normal text-black">
            project in progress...
          </p>

          <section
            aria-label="Project photographs"
            className="grid w-full grid-cols-1 gap-[7px] md:grid-cols-[427fr_461fr] md:gap-x-3"
          >
            <div className="flex flex-col gap-[7px]">
              <Image
                src="/images/projects/tmeobaw/computer.png"
                alt="Laptop installation of the interactive website beside cyanotype prints and a lamp"
                width={854}
                height={570}
                sizes="(max-width: 767px) 90vw, 427px"
                className="h-auto w-full"
              />
              <Image
                src="/images/projects/tmeobaw/file.png"
                alt="Printed project booklet titled the miserable experience of being a woman"
                width={854}
                height={568}
                sizes="(max-width: 767px) 90vw, 427px"
                className="h-auto w-full"
              />
            </div>
            <Image
              src="/images/projects/tmeobaw/wall.png"
              alt="Gallery installation of cyanotype prints viewed through a glass wall"
              width={922}
              height={1152}
              sizes="(max-width: 767px) 90vw, 461px"
              className="h-auto w-full"
            />
          </section>
        </article>
      </main>
    </div>
  );
}
