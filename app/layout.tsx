import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { IntroScreen } from "@/components/intro-screen";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hkGrotesk = localFont({
  src: [
    {
      path: "./fonts/HKGrotesk-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/HKGrotesk-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/HKGrotesk-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-hk-grotesk",
});

const hycHandwrittenRegular = localFont({
  src: [
    {
      path: "./fonts/hyc-handwritten-regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-hyc-handwritten-regular",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://helencai.com"),
  title: "Helen Cai — Designer",
  description:
    "Helen Cai is a visual storyteller and designer exploring UI/UX, branding, and technology.",
  openGraph: {
    title: "Helen Cai — Designer",
    description:
      "Helen Cai is a visual storyteller and designer exploring UI/UX, branding, and technology.",
    url: "https://helencai.com",
    siteName: "Helen Cai",
    type: "website",
    images: [
      {
        url: "/open-graph.png",
        width: 1200,
        height: 630,
        alt: "Helen Cai portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Helen Cai — Designer",
    description:
      "Helen Cai is a visual storyteller and designer exploring UI/UX, branding, and technology.",
    images: [
      {
        url: "/open-graph.png",
        alt: "Helen Cai portfolio",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${hkGrotesk.variable} ${hycHandwrittenRegular.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <IntroScreen />
        {children}
      </body>
    </html>
  );
}
