import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Templates for Forbes Media — Helen Cai",
  description:
    "created a 100+ card modular social template system with typography, spacing, and component guidelines for scalable Forbes branded content",
};

export default function SocialTemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
