import Image from "next/image";

const RESUME_URL =
  "https://docs.google.com/document/d/1KqlAr3PM1mf7-VUWkBN8sVVPKHVZIXw4-SetANBBszc/edit?usp=sharing";
const LINKEDIN_URL = "https://www.linkedin.com/in/helenycai/";
const EMAIL_HREF = "mailto:caihelen22@gmail.com";

export function AboutSection() {
  return (
    <section
  id="about"
  aria-labelledby="about-heading"
  className="mx-auto flex w-[90%] max-w-[900px] flex-col scroll-mt-24 gap-6 px-0 pb-16 pt-8 md:scroll-mt-28 md:gap-8 md:pt-10 lg:pb-[100px] lg:pt-12"
>
      <h2 id="about-heading" className="sr-only">
        About
      </h2>

      <p className="w-full [font-family:var(--font-hyc-handwritten-regular)] text-[20px] font-normal leading-[1.3] text-text-primary">
        a shadow is evidence of the presence of something unseen. as a designer,
        I’m interested in that same tension by using design to reveal stories,
        perspectives, and ideas that exist just beyond what we immediately see.
      </p>

      <div className="flex w-full flex-col items-stretch gap-6 md:flex-row md:items-stretch md:gap-[8%] lg:gap-10">
      <div className="relative mx-auto aspect-square w-full max-w-full shrink-0 overflow-hidden md:mx-0 md:max-w-none md:w-[26%]">
          <Image
            src="/images/branding/helenphoto.png"
            alt="Helen Cai"
            fill
            sizes="(max-width: 767px) 90vw, 26vw"
            className="object-cover object-bottom"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-10 text-black">
          <p className="text-base font-medium leading-[1.5] whitespace-pre-wrap md:text-lg">
            {`hi! I’m Helen. a visual storyteller based in NYC pursuing my MFA in Design + Technology @ Parsons with experience at Forbes, goodr, & Optum. `}
            <br aria-hidden />
            <br aria-hidden />
            {`I’m passionate about crafting narratives with an empathy-first mindset. I’ve seen how design has the capability to both share & shape stories, let’s connect and shape yours together!`}
          </p>

          <nav aria-label="About links">
            <ul className="flex flex-wrap items-start gap-x-6 gap-y-2 text-base uppercase leading-snug tracking-[0.04em] md:gap-x-8">
              <li>
                <a
                  href={RESUME_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  resume
                </a>
              </li>
              <li>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  linkedin
                </a>
              </li>
              <li>
                <a href={EMAIL_HREF} className="hover:underline">
                  email
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
