import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { MeetingDetail } from "@/components/meeting-detail";
import { getMeeting } from "@/lib/server/meetings";

export const dynamic = "force-dynamic";
const tabs = ["overview", "transcript", "actions", "highlights", "analytics"] as const;
export default async function MeetingDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> }) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const meeting = await getMeeting(id);
  if (!meeting) notFound();
  const initialTab = tabs.find((tab) => tab === query.tab) ?? "overview";
  return <AppShell><MeetingDetail meeting={meeting} initialTab={initialTab} /></AppShell>;
}
