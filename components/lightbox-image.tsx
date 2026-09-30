"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const TRANSITION_MS = 200;

type LightboxImageBaseProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

type LightboxImageFillProps = LightboxImageBaseProps & {
  fill?: true;
  width?: never;
  height?: never;
};

type LightboxImageIntrinsicProps = LightboxImageBaseProps & {
  fill?: false;
  width: number;
  height: number;
};

export type LightboxImageProps =
  | LightboxImageFillProps
  | LightboxImageIntrinsicProps;

export function LightboxImage(props: LightboxImageProps) {
  const {
    src,
    alt,
    sizes,
    className = "",
    imageClassName,
    priority = false,
  } = props;

  const isFill = !("width" in props) || props.width == null;
  const width = !isFill && "width" in props ? props.width : undefined;
  const height = !isFill && "height" in props ? props.height : undefined;
  const resolvedImageClassName =
    imageClassName ?? (isFill ? "object-cover" : "h-auto w-full");

  const [mounted, setMounted] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [active, setActive] = useState(false);
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const requestClose = () => {
    setActive(false);

    if (closeTimeoutRef.current != null) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = window.setTimeout(() => {
      setRendered(false);
      closeTimeoutRef.current = null;
    }, TRANSITION_MS);
  };

  const requestCloseRef = useRef(requestClose);
  requestCloseRef.current = requestClose;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current != null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!rendered) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      setActive(true);
      closeButtonRef.current?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        requestCloseRef.current();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [rendered]);

  const openLightbox = () => {
    if (closeTimeoutRef.current != null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActive(false);
    setRendered(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={openLightbox}
        aria-haspopup="dialog"
        aria-expanded={rendered}
        aria-label={`Enlarge image: ${alt}`}
        className={`block w-full cursor-zoom-in overflow-hidden p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text-primary ${
          isFill ? "relative" : ""
        } ${className}`}
      >
        {isFill ? (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={resolvedImageClassName}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width!}
            height={height!}
            priority={priority}
            sizes={sizes}
            className={resolvedImageClassName}
          />
        )}
      </button>

      {mounted && rendered
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className={`fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-md transition-opacity duration-200 ease-out sm:p-6 md:p-10 ${
                active ? "opacity-100" : "opacity-0"
              }`}
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  requestClose();
                }
              }}
            >
              <p id={titleId} className="sr-only">
                {alt}
              </p>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={requestClose}
                aria-label="Close image"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-lg leading-none text-white transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6 sm:top-6"
              >
                ×
              </button>

              <div
                className={`relative flex max-h-[min(92vh,960px)] max-w-[min(96vw,1280px)] items-center justify-center transition duration-200 ease-out ${
                  active
                    ? "translate-y-0 scale-100 opacity-100"
                    : "translate-y-1 scale-[0.98] opacity-0"
                }`}
                onClick={(event) => event.stopPropagation()}
              >
                <Image
                  src={src}
                  alt={alt}
                  width={width != null ? width * 2 : 2400}
                  height={height != null ? height * 2 : 1600}
                  quality={100}
                  sizes="(max-width: 1280px) 96vw, 1280px"
                  className="h-auto max-h-[min(92vh,960px)] w-auto max-w-full object-contain"
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
