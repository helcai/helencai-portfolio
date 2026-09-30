import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MyAtlas — Helen Cai",
  description:
    "A digital wellness platform that helps college students better understand and manage their mental health through personalized insights and passive health data.",
};

export default function MyAtlasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
