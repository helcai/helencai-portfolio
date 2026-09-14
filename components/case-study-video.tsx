"use client";

import { useEffect, useRef, useState } from "react";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [prefersReducedMotion, src]);

  return (
    <figure className={`relative w-full overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        width={width}
        height={height}
        autoPlay={false}
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
