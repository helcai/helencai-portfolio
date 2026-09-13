"use client";

type PageBackgroundProps = {
  videoSrc: string;
};

export function PageBackground({ videoSrc }: PageBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat bg-white"
        style={{
          backgroundImage:
            "url(/images/background/yellow-blue-gradient-bkg.png)",
        }}
      />

      <video
        key={videoSrc}
        className="absolute top-0 left-0 w-full object-cover object-top"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={videoSrc} type="video/webm" />
      </video>
    </div>
  );
}
