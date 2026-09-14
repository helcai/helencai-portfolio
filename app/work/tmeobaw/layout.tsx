import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "the miserable experience of being a woman — Helen Cai",
  description:
    "an exploration of the invisibility and exclusion of women from health-related data and systemic policies, realized as a cyanotype stop-motion interactive website.",
};

export default function TmeobawLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
