"use client";

import { useEffect, useState } from "react";

type PageBackgroundProps = {
  desktopSrc: string;
  mobileSrc: string;
};

const DESKTOP_QUERY =
  "(min-width: 768px) and (hover: hover) and (pointer: fine)";

export function PageBackground({ desktopSrc, mobileSrc }: PageBackgroundProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const update = () => {
      if (reducedMotion.matches) {
        setSrc(null);
        return;
      }

      setSrc(desktop.matches ? desktopSrc : mobileSrc);
    };

    update();
    desktop.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);

    return () => {
      desktop.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, [desktopSrc, mobileSrc]);

  if (!src) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <video
        key={src}
        className="absolute inset-0 h-full w-full object-cover object-top"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={src} type="video/webm" />
      </video>
    </div>
  );
}
