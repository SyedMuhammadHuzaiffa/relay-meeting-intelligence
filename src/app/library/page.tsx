import { AppShell } from "@/components/app-shell";
import { MeetingsDashboard } from "@/components/meetings-dashboard";
import { listMeetings } from "@/lib/server/meetings";

export const dynamic = "force-dynamic";
export default async function Page() {
  const meetings = await listMeetings();
  return <AppShell><MeetingsDashboard meetings={meetings} area="library" /></AppShell>;
}
