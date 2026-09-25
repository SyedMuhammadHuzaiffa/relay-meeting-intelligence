"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BarChart3, BookOpen, CalendarDays, Home, Menu, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { href: "/", label: "Home", icon: Home },
  { href: "/meetings", label: "Meetings", icon: CalendarDays },
  { href: "/intelligence", label: "Intelligence", icon: BarChart3 },
  { href: "/library", label: "Library", icon: BookOpen },
];

export function RelayMark() {
  return <span className="relay-mark" aria-hidden="true">R<span /></span>;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <div className="relay-app">
    <header className="relay-header">
      <Link href="/" className="relay-identity" aria-label="Relay home" onClick={() => setOpen(false)}><RelayMark /><span>relay<span className="brand-period">.</span></span></Link>
      <span className="header-divider" />
      <span className="workspace-name">Meeting intelligence <span>/</span> Workspace</span>
      <button className="nav-toggle" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={21} /> : <Menu size={21} />}</button>
      <nav className={`relay-nav ${open ? "is-open" : ""}`} aria-label="Primary navigation">
        {navigation.map(({ href, label, icon: Icon }) => {
          const active = href === "/meetings" ? pathname === href || pathname.startsWith("/meetings/") : pathname === href;
          return <Link key={href} href={href} className={active ? "active" : ""} aria-label={label} title={label} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}><Icon size={16} strokeWidth={1.9} /><span>{label}</span></Link>;
        })}
      </nav>
      <span className="header-live"><span /> PostgreSQL workspace</span>
    </header>
    <div className="relay-body">{children}</div>
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">{navigation.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={(href === "/meetings" ? pathname.startsWith("/meetings") : pathname === href) ? "active" : ""}><Icon size={19} /><span>{label}</span></Link>)}</nav>
  </div>;
}
