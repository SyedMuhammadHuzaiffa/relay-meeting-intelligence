import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Relay — Meeting intelligence",
  description: "Relay brings meeting decisions, transcripts, and follow-through into focus.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var theme=localStorage.getItem('relay-theme');if(theme==='light'||theme==='dark')document.documentElement.dataset.theme=theme}catch(e){}})()` }} /></head>
    <body>{children}</body>
  </html>;
}
