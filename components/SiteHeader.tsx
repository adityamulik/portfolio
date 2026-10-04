"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, profile } from "@/content/profile";
import { Container } from "@/components/ui";

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href.replace(/\/$/, ""));
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-stone/80 backdrop-blur-md">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent font-display text-sm font-semibold text-white">
            AM
          </span>
          <span className="hidden text-sm font-medium tracking-wide text-ink sm:block">
            {profile.name}
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-ink-muted md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive(pathname, item.href)
                  ? "text-ink"
                  : "transition hover:text-ink"
              }
            >
              {item.label}
            </Link>
          ))}
          <a
            href={profile.resumePath}
            className="rounded-md border border-ink/15 px-4 py-1.5 text-ink transition hover:border-accent hover:text-accent"
          >
            Resume
          </a>
        </nav>
        <button
          type="button"
          className="rounded-md border border-ink/15 px-3 py-1.5 text-sm text-ink md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </Container>
      {open ? (
        <div className="border-t border-ink/10 bg-stone md:hidden">
          <Container className="flex flex-col gap-4 py-4 text-sm">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <a href={profile.resumePath} onClick={() => setOpen(false)}>
              Resume
            </a>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
