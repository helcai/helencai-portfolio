"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
  type SyntheticEvent,
} from "react";
import { createPortal } from "react-dom";

const TRANSITION_MS = 200;
const DESKTOP_NAV_MIN = 768;
const CLOSE_OFFSET_SM = 640;

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

type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  pathname: string;
};

type LightboxActions = {
  register: (image: GalleryImage) => void;
  unregister: (id: string) => void;
  open: (id: string) => void;
};

type LightboxState = {
  activeId: string | null;
  rendered: boolean;
};

type ViewerChrome = {
  maxWidth: number;
  maxHeight: number;
  top: number;
  bottom: number;
  side: number;
  desktop: boolean;
  bottomInset: number;
  closeTop: number;
};

const LightboxActionsContext = createContext<LightboxActions | null>(null);
const LightboxStateContext = createContext<LightboxState>({
  activeId: null,
  rendered: false,
});

function fitContain(maxWidth: number, maxHeight: number, ratio: number | null) {
  if (maxWidth <= 0 || maxHeight <= 0) {
    return { width: 0, height: 0 };
  }

  if (!ratio || ratio <= 0) {
    return { width: Math.floor(maxWidth), height: Math.floor(maxHeight) };
  }

  let width = maxWidth;
  let height = width / ratio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * ratio;
  }

  return { width: Math.floor(width), height: Math.floor(height) };
}

function measureChrome(
  viewportWidth: number,
  viewportHeight: number,
  safeTop: number,
  safeBottom: number,
): ViewerChrome {
  const desktop = viewportWidth >= DESKTOP_NAV_MIN;
  const closeTop = Math.max(viewportWidth >= CLOSE_OFFSET_SM ? 24 : 16, safeTop);
  const top = Math.max(viewportHeight * 0.05, closeTop + 48);
  const bottomInset = Math.max(12, safeBottom);
  const bottom = desktop
    ? Math.max(viewportHeight * 0.05, 48)
    : Math.max(viewportHeight * 0.05, bottomInset + 60);
  const side = desktop
    ? Math.max(viewportWidth * 0.05, 72)
    : viewportWidth * 0.05;

  return {
    maxWidth: Math.max(0, Math.min(viewportWidth * 0.9, viewportWidth - side * 2)),
    maxHeight: Math.max(0, Math.min(viewportHeight * 0.9, viewportHeight - top - bottom)),
    top,
    bottom,
    side,
    desktop,
    bottomInset,
    closeTop,
  };
}

function chromeEqual(a: ViewerChrome, b: ViewerChrome) {
  return (
    a.maxWidth === b.maxWidth &&
    a.maxHeight === b.maxHeight &&
    a.top === b.top &&
    a.bottom === b.bottom &&
    a.side === b.side &&
    a.desktop === b.desktop &&
    a.bottomInset === b.bottomInset &&
    a.closeTop === b.closeTop
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={direction === "left" ? "rotate-180" : undefined}
    >
      <path
        d="M7.5 4.5 13 10l-5.5 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const navButtonClass =
  "pointer-events-auto flex h-12 w-12 touch-manipulation items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:h-11 md:w-11";

function LightboxDialog({
  image,
  index,
  count,
  active,
  onClose,
  onPrev,
  onNext,
  onMeasure,
  closeButtonRef,
}: {
  image: GalleryImage;
  index: number;
  count: number;
  active: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onMeasure: (width: number, height: number) => void;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const safeTopRef = useRef<HTMLDivElement>(null);
  const safeBottomRef = useRef<HTMLDivElement>(null);
  const [chrome, setChrome] = useState<ViewerChrome | null>(null);
  const [natural, setNatural] = useState<{
    src: string;
    width: number;
    height: number;
  } | null>(null);

  useLayoutEffect(() => {
    const node = dialogRef.current;
    if (!node) return;

    const measure = () => {
      const next = measureChrome(
        node.clientWidth,
        node.clientHeight,
        safeTopRef.current?.offsetHeight ?? 0,
        safeBottomRef.current?.offsetHeight ?? 0,
      );
      setChrome((current) => (current && chromeEqual(current, next) ? current : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const knownWidth =
    natural && natural.src === image.src ? natural.width : image.width;
  const knownHeight =
    natural && natural.src === image.src ? natural.height : image.height;
  const ratio =
    knownWidth && knownHeight && knownWidth > 0 && knownHeight > 0
      ? knownWidth / knownHeight
      : null;
  const fitted = chrome
    ? fitContain(chrome.maxWidth, chrome.maxHeight, ratio)
    : { width: 0, height: 0 };
  const canNavigate = count > 1;

  const onImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (img.naturalWidth <= 0 || img.naturalHeight <= 0) return;

    setNatural({
      src: image.src,
      width: img.naturalWidth,
      height: img.naturalHeight,
    });
    onMeasure(img.naturalWidth, img.naturalHeight);
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={`fixed inset-0 z-50 flex flex-col overflow-hidden overscroll-contain bg-black/45 backdrop-blur-md transition-opacity duration-200 ease-out motion-reduce:transition-none ${
        active ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <style>{`
        @keyframes lightbox-image-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .lightbox-image-in {
          animation: lightbox-image-in 180ms ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .lightbox-image-in { animation: none; }
        }
      `}</style>

      <div
        ref={safeTopRef}
        aria-hidden="true"
        className="pointer-events-none absolute h-[env(safe-area-inset-top,0px)] w-px"
      />
      <div
        ref={safeBottomRef}
        aria-hidden="true"
        className="pointer-events-none absolute h-[env(safe-area-inset-bottom,0px)] w-px"
      />

      <p id={titleId} className="sr-only" aria-live="polite">
        {image.alt}
        {canNavigate ? ` Image ${index + 1} of ${count}.` : ""}
      </p>

      <div aria-hidden="true" className="shrink-0" style={{ height: chrome?.top ?? 0 }} />

      <div
        className="flex min-h-0 w-full flex-1 items-center justify-center"
        style={{
          paddingLeft: chrome?.side ?? 0,
          paddingRight: chrome?.side ?? 0,
        }}
      >
        {fitted.width > 0 && fitted.height > 0 ? (
          <div
            className={`relative transition-[width,height,opacity,transform] duration-200 ease-out motion-reduce:transition-none ${
              active
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-1 scale-[0.98] opacity-0"
            }`}
            style={{ width: fitted.width, height: fitted.height }}
            onClick={(event) => event.stopPropagation()}
          >
            <div key={image.id} className="lightbox-image-in absolute inset-0">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                quality={100}
                sizes="90vw"
                priority
                className="object-contain"
                onLoad={onImageLoad}
              />
            </div>
          </div>
        ) : null}
      </div>

      <div
        aria-hidden="true"
        className="shrink-0"
        style={{ height: chrome?.bottom ?? 0 }}
      />

      <button
        ref={closeButtonRef}
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        aria-label="Close image"
        className="absolute right-[max(1rem,env(safe-area-inset-right,0px))] z-30 flex h-10 w-10 touch-manipulation items-center justify-center rounded-full bg-black/55 text-lg leading-none text-white transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-[max(1.5rem,env(safe-area-inset-right,0px))]"
        style={{ top: chrome?.closeTop ?? 16 }}
      >
        ×
      </button>

      {canNavigate && chrome ? (
        <div
          className={`pointer-events-none absolute z-20 flex items-center ${
            chrome.desktop
              ? "inset-x-3 top-1/2 -translate-y-1/2 justify-between"
              : "inset-x-0 justify-center gap-4"
          }`}
          style={chrome.desktop ? undefined : { bottom: chrome.bottomInset }}
        >
          <button
            type="button"
            className={navButtonClass}
            aria-label="Previous image"
            onClick={(event) => {
              event.stopPropagation();
              onPrev();
            }}
          >
            <Chevron direction="left" />
          </button>
          <button
            type="button"
            className={navButtonClass}
            aria-label="Next image"
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
          >
            <Chevron direction="right" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function LightboxGallery({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [rendered, setRendered] = useState(false);
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const pathnameRef = useRef(pathname);

  const pageItems = useMemo(
    () => items.filter((item) => item.pathname === pathname),
    [items, pathname],
  );
  const pageItemsRef = useRef(pageItems);
  pageItemsRef.current = pageItems;
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;
  const activeRef = useRef(active);
  activeRef.current = active;

  const register = useCallback((image: GalleryImage) => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === image.id);
      if (index === -1) return [...prev, image];

      const current = prev[index];
      if (
        current.src === image.src &&
        current.alt === image.alt &&
        current.width === image.width &&
        current.height === image.height &&
        current.pathname === image.pathname
      ) {
        return prev;
      }

      const next = prev.slice();
      next[index] = image;
      return next;
    });
  }, []);

  const unregister = useCallback((id: string) => {
    setItems((prev) => (prev.some((item) => item.id === id) ? prev.filter((item) => item.id !== id) : prev));
  }, []);

  const updateSize = useCallback((id: string, width: number, height: number) => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;
      const current = prev[index];
      if (current.width === width && current.height === height) return prev;
      const next = prev.slice();
      next[index] = { ...current, width, height };
      return next;
    });
  }, []);

  const open = useCallback((id: string) => {
    if (closeTimeoutRef.current != null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setActiveId(id);
    setActive(false);
    setRendered(true);
  }, []);

  const requestClose = useCallback(() => {
    setActive(false);

    if (closeTimeoutRef.current != null) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = window.setTimeout(() => {
      setRendered(false);
      setActiveId(null);
      closeTimeoutRef.current = null;

      const node = previouslyFocusedRef.current;
      if (node && document.contains(node)) {
        node.focus({ preventScroll: true });
      }
    }, TRANSITION_MS);
  }, []);

  const requestCloseRef = useRef(requestClose);
  requestCloseRef.current = requestClose;

  const go = useCallback((delta: number) => {
    const list = pageItemsRef.current;
    if (list.length < 2) return;

    const index = list.findIndex((item) => item.id === activeIdRef.current);
    if (index < 0) return;

    const nextIndex = (index + delta + list.length) % list.length;
    setActiveId(list[nextIndex].id);
  }, []);

  const goRef = useRef(go);
  goRef.current = go;

  const actions = useMemo(
    () => ({ register, unregister, open }),
    [register, unregister, open],
  );
  const state = useMemo(
    () => ({ activeId, rendered }),
    [activeId, rendered],
  );

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
    if (pathnameRef.current === pathname) return;
    pathnameRef.current = pathname;

    if (closeTimeoutRef.current != null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    setActive(false);
    setRendered(false);
    setActiveId(null);
  }, [pathname]);

  useEffect(() => {
    if (!rendered) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = window.requestAnimationFrame(() => {
      setActive(true);
      closeButtonRef.current?.focus({ preventScroll: true });
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const isScrollKey =
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown" ||
        event.key === "PageUp" ||
        event.key === "PageDown" ||
        event.key === "Home" ||
        event.key === "End";

      if (event.key === "Escape" || isScrollKey) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (event.key === "Escape") {
        requestCloseRef.current();
        return;
      }

      if (!activeRef.current || event.repeat) return;

      if (event.key === "ArrowLeft") {
        goRef.current(-1);
      } else if (event.key === "ArrowRight") {
        goRef.current(1);
      }
    };

    window.addEventListener("keydown", onKeyDown, { capture: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, [rendered]);

  const shown =
    pageItems.find((item) => item.id === activeId) ?? null;
  const shownIndex = shown
    ? pageItems.findIndex((item) => item.id === shown.id)
    : -1;

  return (
    <LightboxActionsContext.Provider value={actions}>
      <LightboxStateContext.Provider value={state}>
        {children}
        {mounted && rendered && shown
          ? createPortal(
              <LightboxDialog
                image={shown}
                index={shownIndex}
                count={pageItems.length}
                active={active}
                onClose={requestClose}
                onPrev={() => go(-1)}
                onNext={() => go(1)}
                onMeasure={(width, height) => updateSize(shown.id, width, height)}
                closeButtonRef={closeButtonRef}
              />,
              document.body,
            )
          : null}
      </LightboxStateContext.Provider>
    </LightboxActionsContext.Provider>
  );
}

function LightboxImageButton({
  src,
  alt,
  sizes,
  className = "",
  imageClassName,
  priority = false,
  width,
  height,
  isFill,
}: LightboxImageBaseProps & {
  width?: number;
  height?: number;
  isFill: boolean;
}) {
  const actions = useContext(LightboxActionsContext);
  const { activeId, rendered } = useContext(LightboxStateContext);
  const pathname = usePathname();
  const id = useId();
  const measuredRef = useRef<{ width: number; height: number } | null>(null);
  const resolvedImageClassName =
    imageClassName ?? (isFill ? "object-cover" : "h-auto w-full");

  useEffect(() => {
    if (!actions) return;
    return () => actions.unregister(id);
  }, [actions, id]);

  useEffect(() => {
    if (!actions) return;
    const measured = measuredRef.current;
    actions.register({
      id,
      src,
      alt,
      width: measured?.width ?? width,
      height: measured?.height ?? height,
      pathname,
    });
  }, [actions, id, src, alt, width, height, pathname]);

  const onThumbnailLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (!actions || img.naturalWidth <= 0 || img.naturalHeight <= 0) return;
    measuredRef.current = {
      width: img.naturalWidth,
      height: img.naturalHeight,
    };
    actions.register({
      id,
      src,
      alt,
      width: img.naturalWidth,
      height: img.naturalHeight,
      pathname,
    });
  };

  return (
    <button
      type="button"
      onClick={() => actions?.open(id)}
      aria-haspopup="dialog"
      aria-expanded={rendered && activeId === id}
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
          onLoad={onThumbnailLoad}
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
          onLoad={onThumbnailLoad}
        />
      )}
    </button>
  );
}

export function LightboxImage(props: LightboxImageProps) {
  const {
    src,
    alt,
    sizes,
    className,
    imageClassName,
    priority,
  } = props;
  const isFill = !("width" in props) || props.width == null;
  const width = !isFill && "width" in props ? props.width : undefined;
  const height = !isFill && "height" in props ? props.height : undefined;
  const actions = useContext(LightboxActionsContext);

  const button = (
    <LightboxImageButton
      src={src}
      alt={alt}
      sizes={sizes}
      className={className}
      imageClassName={imageClassName}
      priority={priority}
      width={width}
      height={height}
      isFill={isFill}
    />
  );

  if (actions) return button;

  return <LightboxGallery>{button}</LightboxGallery>;
}
