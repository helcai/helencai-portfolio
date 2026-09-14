import Image from "next/image";
import Link from "next/link";

export type ProjectRowProps = {
  title: string;
  description: string;
  tags: string;
  imageSrc: string;
  hoverImageSrc: string;
  reverse?: boolean;
  learned?: string;
  href?: string;
};

export function ProjectRow({
  title,
  description,
  tags,
  imageSrc,
  hoverImageSrc,
  reverse = false,
  learned,
  href,
}: ProjectRowProps) {
  const headingId = `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-heading`;

  const inner = (
    <div
      className={`flex w-full flex-col items-stretch gap-4 md:flex-row md:items-center md:gap-[3.5%] ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Project image */}
      <div
        className={`${href ? "" : "group"} relative aspect-[600/429] w-full min-w-0 overflow-hidden rounded-[4px] bg-black md:w-[50%] md:shrink-0`}
      >
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 767px) 90vw, 34vw"
          className="object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-0"
        />

        <Image
          src={hoverImageSrc}
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 767px) 90vw, 34vw"
          className="object-cover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
        />
      </div>

      {/* Project description */}
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 text-black md:gap-3">
        {/* Kept for accessibility, but not visually displayed */}
        <h2 id={headingId} className="sr-only">
          {title}
        </h2>

        {learned ? (
          <p className="[font-family:var(--font-gaegu)] text-[20px] font-normal leading-[1.3] text-text-primary">
            {learned}
          </p>
        ) : null}

        <p className="text-[18px] font-medium leading-[1.5] text-text-primary">
          {description}
        </p>

        <p className="text-[14px] uppercase leading-snug tracking-[0.04em] text-text-muted">
          {tags}
        </p>
      </div>
    </div>
  );

  return (
    <article aria-labelledby={headingId} className="mx-auto w-full max-w-[900px]">
      {href ? (
        <Link
          href={href}
          className="group block rounded-[4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text-primary"
        >
          {inner}
        </Link>
      ) : (
        inner
      )}
    </article>
  );
}