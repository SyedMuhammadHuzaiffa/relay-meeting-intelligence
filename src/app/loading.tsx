import { AppShell } from "@/components/app-shell";

export default function Loading() {
  return <AppShell><main className="meetings-page" role="status"><p>Loading meetings…</p></main></AppShell>;
}
