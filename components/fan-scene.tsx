"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

const CANVAS_W = 3508;

/**
 * Center of the globe in fan-light.png. The blades turn around this point
 * so their inner spikes stay behind the light.
 */
const LIGHT = { x: 1828.5 / CANVAS_W, y: 1313 / 2480 };

/**
 * fan.png relative to the shared canvas. Long enough that, on a 14-inch
 * MacBook, a blade reaches past the start of the script line.
 */
const FAN_WIDTH = 1.32;

/** Extra room so a masked frame still holds the fan when it is turned 45°. */
const FAN_FRAME = 1.55;

const FAN_FRAME_STYLE = {
  width: `${FAN_WIDTH * FAN_FRAME * 100}%`,
  aspectRatio: "1",
  left: `${LIGHT.x * 100}%`,
  top: `${LIGHT.y * 100}%`,
  transform: "translate(-50%, -50%)",
} as const;

const FAN_BLADE_STYLE = {
  width: `${(1 / FAN_FRAME) * 100}%`,
  aspectRatio: "3367 / 3358",
  left: "50%",
  top: "50%",
  transformOrigin: "50% 50%",
} as const;

/** Blade centerlines, degrees clockwise from the right, before any spin. */
const BLADE_ANGLES = [23, 87.5, 166.5, 232.5, 312];

/** Tip distance from the image center, divided by the image width. */
const BLADE_REACH = 1119 / 3367;

/** Wood gets narrower toward the tip. Half-width in degrees at a distance along a blade. */
function bladeHalf(distance: number, reach: number) {
  const t = distance / reach;
  return Math.max(7, 23 - t * 17);
}

/** One full turn on low. Five blades, so a new phrase about every 4.4 seconds. */
const SPIN_MS = 22000;

/** High. Still one phrase per blade; the blades just arrive sooner. */
const FAST_SPIN_MS = 8000;

const SPEEDS = ["slow", "fast", "off"] as const;
type FanSpeed = (typeof SPEEDS)[number];

const NEXT_SPEED: Record<FanSpeed, FanSpeed> = {
  slow: "fast",
  fast: "off",
  off: "slow",
};

const CHAIN_LABEL: Record<FanSpeed, string> = {
  slow: "Pull chain to speed up the fan",
  fast: "Pull chain to turn the fan off",
  off: "Pull chain to turn the fan on",
};

/** Degrees per millisecond. Counterclockwise, matching the blade spin. */
function spinVelocity(speed: FanSpeed) {
  if (speed === "fast") return -360 / FAST_SPIN_MS;
  if (speed === "slow") return -360 / SPIN_MS;
  return 0;
}

/**
 * fan-chain.png shares the 3508×2480 canvas. Opaque pixels are the pull on
 * the globe's upper-left rim.
 */
const CHAIN_ORIGIN = "48.29% 47.5%";

/** Keeps the blade center on the light while the fan turns. */
const HUB_SHIFT = "translate(-50%, -50%)";

const CANVAS_PLACEMENT = {
  width: "var(--fan-canvas)",
  left: "calc(var(--fan-anchor-x) - var(--fan-canvas) * 0.52124)",
  top: "var(--fan-anchor-y)",
  transform: "translateY(-52.944%)",
} as const;

type FanSceneProps = {
  phraseRef?: RefObject<HTMLElement | null>;
  onBladePass?: () => void;
};

function screenAngle(fromX: number, fromY: number, toX: number, toY: number) {
  return (Math.atan2(toY - fromY, toX - fromX) * 180) / Math.PI;
}

function angleDistance(a: number, b: number) {
  const delta = (((a - b) % 360) + 540) % 360 - 180;
  return Math.abs(delta);
}

function turnsPast(previous: number, next: number, target: number) {
  const start = ((previous % 360) + 360) % 360;
  const end = ((next % 360) + 360) % 360;
  const mark = ((target % 360) + 360) % 360;
  if (end >= start) return mark > start && mark <= end;
  return mark > start || mark <= end;
}

const BLADE_SHADOW =
  "drop-shadow(14px 22px 12px rgba(48, 34, 20, 0.32)) drop-shadow(0px 8px 4px rgba(48, 34, 20, 0.18))";
const BASE_SHADOW = "drop-shadow(0px 16px 18px rgba(48, 34, 20, 0.34))";
const LIGHT_SHADOW =
  "drop-shadow(0px 14px 12px rgba(40, 28, 16, 0.38)) drop-shadow(0px 0px 28px rgba(255, 236, 206, 0.55))";

function playChainPull(chain: HTMLImageElement) {
  chain.getAnimations().forEach((animation) => animation.cancel());
  chain.animate(
    [
      { transform: "translate3d(0, 0, 0)" },
      { transform: "translate3d(0.48%, 1.2%, 0)", offset: 0.3 },
      { transform: "translate3d(0, 0, 0)" },
    ],
    { duration: 520, easing: "cubic-bezier(0.2, 0.75, 0.28, 1)" },
  );
}

export function FanScene({ phraseRef, onBladePass }: FanSceneProps) {
  const fanRef = useRef<HTMLImageElement>(null);
  const softFanRef = useRef<HTMLImageElement>(null);
  const sharpFrameRef = useRef<HTMLDivElement>(null);
  const softFrameRef = useRef<HTMLDivElement>(null);
  const chainRef = useRef<HTMLImageElement>(null);
  const speedRef = useRef<FanSpeed>("slow");
  const [speed, setSpeed] = useState<FanSpeed>("slow");
  const onBladePassRef = useRef(onBladePass);
  onBladePassRef.current = onBladePass;

  useEffect(() => {
    const fan = fanRef.current;
    if (!fan) return;

    let maskKey = "";

    const placeMasks = () => {
      const cards = document.getElementById("work-cards");
      const sharpFrame = sharpFrameRef.current;
      const softFrame = softFrameRef.current;
      if (!cards || !sharpFrame || !softFrame) return;
      const frame = sharpFrame.getBoundingClientRect();
      const card = cards.getBoundingClientRect();
      const start = Math.round(card.top - frame.top - 48);
      const end = start + 180;
      const key = `${start}:${end}`;
      if (key === maskKey) return;
      maskKey = key;
      const hide = `linear-gradient(to bottom, #000 ${start}px, transparent ${end}px)`;
      const show = `linear-gradient(to bottom, transparent ${start}px, #000 ${end}px)`;
      sharpFrame.style.webkitMaskImage = hide;
      sharpFrame.style.maskImage = hide;
      softFrame.style.webkitMaskImage = show;
      softFrame.style.maskImage = show;
    };

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) {
      const still = `${HUB_SHIFT} rotate(0deg)`;
      fan.style.transform = still;
      if (softFanRef.current) softFanRef.current.style.transform = still;
      placeMasks();
      return;
    }

    let frame = 0;
    let coveredBlade = -1;
    let primed = false;
    let lastFireRotation = Number.NaN;
    let previousRotation = 0;
    let rotation = 0;
    let velocity = spinVelocity("slow");
    let lastNow = performance.now();

    const watch = (sample: number) => {
      const turn = `${HUB_SHIFT} rotate(${sample}deg)`;
      fan.style.transform = turn;
      if (softFanRef.current) softFanRef.current.style.transform = turn;

      const phrase = phraseRef?.current;
      if (phrase) {
        const hubRect = fan.getBoundingClientRect();
        const hubX = hubRect.left + hubRect.width / 2;
        const hubY = hubRect.top + hubRect.height / 2;
        const phraseRect = phrase.getBoundingClientRect();
        const midY = phraseRect.top + phraseRect.height * 0.55;
        const reach = BLADE_REACH * fan.offsetWidth;
        const textX = Math.min(phraseRect.right, Math.max(phraseRect.left, hubX));
        const distance = Math.hypot(textX - hubX, midY - hubY);
        const textAngle = screenAngle(hubX, hubY, textX, midY);
        const sinceLastFire = Number.isNaN(lastFireRotation)
          ? 360
          : Math.abs(sample - lastFireRotation);

        const noteBlade = (blade: number) => {
          if (blade === -1 || blade === coveredBlade) return;
          coveredBlade = blade;
          if (!primed) {
            lastFireRotation = sample;
            return;
          }
          // A new phrase changes the measured angle, which can look like a
          // second blade. Real blades are much farther apart than that.
          if (sinceLastFire < 40) return;
          lastFireRotation = sample;
          onBladePassRef.current?.();
        };

        if (distance <= reach) {
          const samples = [
            [phraseRect.left, phraseRect.top],
            [phraseRect.right, phraseRect.top],
            [phraseRect.left, phraseRect.bottom],
            [phraseRect.right, phraseRect.bottom],
          ];
          const hits = samples.map(([x, y]) => {
            const sampleDistance = Math.hypot(x - hubX, y - hubY);
            if (sampleDistance > reach) return -1;
            const sampleAngle = screenAngle(hubX, hubY, x, y);
            return BLADE_ANGLES.findIndex(
              (angle) =>
                angleDistance(sampleAngle, angle + sample) <=
                bladeHalf(sampleDistance, reach),
            );
          });
          const blade = hits.every((hit) => hit === hits[0]) ? hits[0] : -1;
          if (blade === -1) coveredBlade = -1;
          else noteBlade(blade);
          primed = true;
        } else {
          const swept = previousRotation - sample;
          const blade = BLADE_ANGLES.findIndex((angle) =>
            turnsPast(angle + sample, angle + previousRotation, textAngle),
          );
          if (swept > 0 && swept < 40 && blade !== -1) noteBlade(blade);
          else coveredBlade = -1;
          primed = true;
        }
      }

      previousRotation = sample;
    };

    const tick = (now: number) => {
      const dt = Math.min(Math.max(0, now - lastNow), 48);
      lastNow = now;
      const target = spinVelocity(speedRef.current);
      velocity += (target - velocity) * (1 - Math.exp(-dt / 170));
      const end = rotation + velocity * dt;
      // Short steps so a fast frame cannot skip the phrase window.
      const steps = Math.max(1, Math.ceil(Math.abs(end - rotation) / 1.5));
      for (let step = 1; step <= steps; step += 1) {
        watch(rotation + ((end - rotation) * step) / steps);
      }
      rotation = end;
      placeMasks();

      frame = window.requestAnimationFrame(tick);
    };

    const still = `${HUB_SHIFT} rotate(0deg)`;
    fan.style.transform = still;
    if (softFanRef.current) softFanRef.current.style.transform = still;
    placeMasks();
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [phraseRef]);

  const pullChain = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const next = NEXT_SPEED[speedRef.current];
    speedRef.current = next;
    setSpeed(next);
    const chain = chainRef.current;
    if (chain) playChainPull(chain);
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="fan-scene pointer-events-none absolute inset-0 overflow-x-clip overflow-y-visible"
      >
        <div className="absolute z-20 aspect-[3508/2480]" style={CANVAS_PLACEMENT}>
          <img
            src="/images/branding/fan-base.png"
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full max-w-none select-none"
            style={{ filter: BASE_SHADOW }}
          />

          <div
            ref={sharpFrameRef}
            className="pointer-events-none absolute"
            style={FAN_FRAME_STYLE}
          >
            <img
              ref={fanRef}
              src="/images/branding/fan.png"
              alt=""
              draggable={false}
              className="absolute max-w-none select-none"
              style={{ ...FAN_BLADE_STYLE, filter: BLADE_SHADOW }}
            />
          </div>

          <div
            ref={softFrameRef}
            className="pointer-events-none absolute"
            style={{
              ...FAN_FRAME_STYLE,
              maskImage: "linear-gradient(transparent, transparent)",
            }}
          >
            <img
              ref={softFanRef}
              src="/images/branding/fan.png"
              alt=""
              draggable={false}
              className="absolute max-w-none select-none"
              style={{ ...FAN_BLADE_STYLE, filter: "blur(28px)" }}
            />
          </div>

          <img
            src="/images/branding/fan-light.png"
            alt=""
            draggable={false}
            className="absolute inset-0 h-full w-full max-w-none select-none"
            style={{ filter: LIGHT_SHADOW }}
          />
        </div>
      </div>

      {/* In front of the globe. The light artwork is opaque where the pull sits. */}
      <div
        data-fan-speed={speed}
        className="pointer-events-none absolute z-20 aspect-[3508/2480]"
        style={CANVAS_PLACEMENT}
      >
        <img
          ref={chainRef}
          src="/images/branding/fan-chain.png"
          alt=""
          draggable={false}
          className="pointer-events-none absolute inset-0 h-full w-full max-w-none select-none"
          style={{ transformOrigin: CHAIN_ORIGIN }}
        />
        <button
          type="button"
          aria-label={CHAIN_LABEL[speed]}
          onClick={pullChain}
          className="pointer-events-auto absolute cursor-pointer border-0 bg-transparent p-0 touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#252022]"
          style={{
            left: "48.83%",
            top: "48.37%",
            width: "max(52px, 2.6%)",
            height: "max(68px, 3.8%)",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
    </>
  );
}
