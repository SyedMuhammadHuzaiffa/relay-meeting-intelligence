import { AppShell } from "@/components/app-shell";
import { IntelligenceView } from "@/components/intelligence-view";
import { listMeetings } from "@/lib/server/meetings";

export const dynamic = "force-dynamic";
export default async function Page() {
  const meetings = await listMeetings();
  return <AppShell><IntelligenceView meetings={meetings} /></AppShell>;
}
