import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { MeetingDetail } from "@/components/meeting-detail";
import { getMeeting } from "@/lib/server/meetings";

export const dynamic = "force-dynamic";

export default async function MeetingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meeting = await getMeeting(id);

  if (!meeting) notFound();

  return (
    <AppShell>
      <MeetingDetail meeting={meeting} />
    </AppShell>
  );
}
