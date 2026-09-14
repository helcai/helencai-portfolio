import Image from "next/image";
import Link from "next/link";

export function PlaceholderCaseStudy() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip font-sans text-text-primary">
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="flex w-full max-w-[654px] flex-col items-center gap-5 text-center">
          <Image
            src="/images/branding/ihearthyc.svg"
            alt="i heart hyc"
            width={250}
            height={89}
            priority
            className="h-[89px] w-[250px]"
          />

          <p className="w-full text-[24px] font-semibold leading-normal text-text-primary">
            project case study in progress,{" "}
            <br />
            check back soon!
          </p>

          <Link
            href="/#work"
            className="text-base font-normal leading-normal text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text-primary"
          >
            ← let’s go back
          </Link>
        </div>
      </main>
    </div>
  );
}
