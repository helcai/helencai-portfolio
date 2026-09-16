"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const TAXI_SRC = "/images/branding/hyc-taxi.webm";
const TARGET_PLAYS = 2;
const FALLBACK_TIMEOUT_MS = 8000;
const FADE_MS = 400;

export function IntroScreen() {
  const pathname = usePathname();
  const [active, setActive] = useState(() => pathname === "/");
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playCountRef = useRef(0);
  const finishedRef = useRef(false);
  const fallbackTimerRef = useRef<number | null>(null);

  const clearFallback = useCallback(() => {
    if (fallbackTimerRef.current === null) return;
    window.clearTimeout(fallbackTimerRef.current);
    fallbackTimerRef.current = null;
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearFallback();
    setFading(true);
  }, [clearFallback]);

  useEffect(() => {
    if (!active) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [active]);

  useEffect(() => {
    if (!fading) return;

    const timeoutId = window.setTimeout(() => {
      setActive(false);
    }, FADE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [fading]);

  useEffect(() => {
    if (!active) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }

    const video = videoRef.current;
    const startFallback = (ms: number) => {
      clearFallback();
      fallbackTimerRef.current = window.setTimeout(finish, ms);
    };

    startFallback(FALLBACK_TIMEOUT_MS);

    if (!video) {
      return () => clearFallback();
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const armDurationFallback = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        startFallback(video.duration * 1000 * TARGET_PLAYS + 1500);
      }
    };

    const playFromStart = () => {
      const onSeeked = () => {
        video.removeEventListener("seeked", onSeeked);
        if (finishedRef.current) return;
        void video.play().catch(() => finish());
      };

      video.addEventListener("seeked", onSeeked);
      video.currentTime = 0;
    };

    const onEnded = () => {
      playCountRef.current += 1;
      if (playCountRef.current < TARGET_PLAYS) {
        playFromStart();
        return;
      }
      finish();
    };

    video.addEventListener("ended", onEnded);
    video.addEventListener("error", finish);
    video.addEventListener("loadedmetadata", armDurationFallback);

    if (video.readyState >= 1) {
      armDurationFallback();
    }

    void video.play().catch(() => finish());

    return () => {
      clearFallback();
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", finish);
      video.removeEventListener("loadedmetadata", armDurationFallback);
    };
  }, [active, clearFallback, finish]);

  if (!active) {
    return null;
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      aria-live="polite"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#FFF7EC] transition-opacity ease-out ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <video
        ref={videoRef}
        width={800}
        height={500}
        className="h-auto max-h-[70vh] w-auto max-w-[min(86vw,800px)] bg-[#FFF7EC] object-contain"
        autoPlay
        muted
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        aria-hidden="true"
      >
        <source src={TAXI_SRC} type="video/webm" />
      </video>
    </div>
  );
}
