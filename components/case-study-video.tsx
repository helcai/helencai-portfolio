"use client";

import { useEffect, useState } from "react";

type CaseStudyVideoProps = {
  src: string;
  width: number;
  height: number;
  label: string;
  className?: string;
};

export function CaseStudyVideo({
  src,
  width,
  height,
  label,
  className = "",
}: CaseStudyVideoProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return (
    <figure className={`relative w-full overflow-hidden ${className}`}>
      <video
        width={width}
        height={height}
        autoPlay={!prefersReducedMotion}
        loop={!prefersReducedMotion}
        muted
        playsInline
        preload="metadata"
        controls={prefersReducedMotion}
        aria-hidden={!prefersReducedMotion}
        aria-label={prefersReducedMotion ? label : undefined}
        className="h-full w-full object-cover"
      >
        <source src={src} type="video/mp4" />
        {label}
      </video>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
