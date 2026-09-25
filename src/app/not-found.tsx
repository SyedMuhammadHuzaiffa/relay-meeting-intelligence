import Link from "next/link";
export default function NotFound() { return <main className="not-found"><p className="overline">RELAY / 404</p><h1>That meeting isn&apos;t here.</h1><p>It may have been moved or removed from this workspace.</p><Link className="button primary" href="/meetings">Return to meetings</Link></main>; }
