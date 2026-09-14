export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="case-study-page relative min-h-full bg-[#FFFFFF]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[#FFFFFF]"
      />
      {children}
    </div>
  );
}
