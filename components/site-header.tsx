import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";

type NavItemProps = {
  href: string;
  label: string;
  active?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

function NavItem({ href, label, active = false, onClick }: NavItemProps) {
  const visibleWeight = active ? "font-semibold" : "font-medium";

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "location" : undefined}
      className="grid text-text-primary [&>*]:col-start-1 [&>*]:row-start-1"
    >
      <span aria-hidden className="invisible font-semibold uppercase">
        {label}
      </span>
      <span
        className={`uppercase transition-[font-weight] duration-200 ease-in-out hover:font-semibold ${visibleWeight}`}
      >
        {label}
      </span>
    </Link>
  );
}

type SiteHeaderProps = {
  workHref?: string;
  aboutHref?: string;
  workActive?: boolean;
  aboutActive?: boolean;
  onWorkClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  onAboutClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export function SiteHeader({
  workHref = "/#work",
  aboutHref = "/#about",
  workActive = false,
  aboutActive = false,
  onWorkClick,
  onAboutClick,
}: SiteHeaderProps) {
  return (
    <header className="mx-auto flex w-[90%] max-w-[1512px] items-center justify-between px-0 pt-12 md:gap-6 md:pt-12 lg:px-0 lg:pt-[50px]">
      <Link href="/" className="shrink-0" aria-label="Helen Cai — home">
        <Image
          src="/images/branding/ihearthyc.svg"
          alt="i heart hyc"
          width={129}
          height={46}
          priority
          className="h-10 w-auto md:h-11 lg:h-[46px]"
        />
      </Link>

      <nav aria-label="Primary">
        <ul className="flex items-center gap-6 [font-family:var(--font-hyc-handwritten-regular)] text-base uppercase tracking-normal md:gap-10 md:text-lg lg:gap-20">
          <li>
            <NavItem
              href={workHref}
              label="work"
              active={workActive}
              onClick={onWorkClick}
            />
          </li>
          <li>
            <NavItem
              href={aboutHref}
              label="about"
              active={aboutActive}
              onClick={onAboutClick}
            />
          </li>
        </ul>
      </nav>
    </header>
  );
}
