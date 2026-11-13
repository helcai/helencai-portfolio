"use client";

import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";

type CaseStudyVideoProps = {
  src: string;
  /** Optional smaller WebM rendition, offered before the MP4 fallback. */
  webmSrc?: string;
  /** Still frame shown while the video loads (should match the first frame). */
  poster?: string;
  /** Above-the-fold / hero video: load immediately instead of lazily. */
  priority?: boolean;
  width: number;
  height: number;
  label: string;
  className?: string;
};

// Start fetching below-the-fold videos shortly before they scroll into view.
const LAZY_LOAD_ROOT_MARGIN = "300px 0px";

export function CaseStudyVideo({
  src,
  webmSrc,
  poster,
  priority = false,
  width,
  height,
  label,
  className = "",
}: CaseStudyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority);

  if (priority && poster) {
    preload(poster, { as: "image", fetchPriority: "high" });
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: LAZY_LOAD_ROOT_MARGIN },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || prefersReducedMotion) return;

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
  }, [prefersReducedMotion, shouldLoad, src, webmSrc]);

  return (
    <figure className={`relative w-full overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        width={width}
        height={height}
        poster={poster}
        autoPlay={false}
        loop={!prefersReducedMotion}
        muted
        playsInline
        preload={
          !shouldLoad ? "none" : prefersReducedMotion ? "metadata" : "auto"
        }
        controls={prefersReducedMotion}
        aria-hidden={!prefersReducedMotion}
        aria-label={prefersReducedMotion ? label : undefined}
        className="h-full w-full object-cover"
      >
        {/* Sources are only attached once the video is near the viewport, so
            off-screen videos don't download anything but their poster. */}
        {shouldLoad && webmSrc ? (
          <source src={webmSrc} type="video/webm" />
        ) : null}
        {shouldLoad ? <source src={src} type="video/mp4" /> : null}
        {label}
      </video>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
