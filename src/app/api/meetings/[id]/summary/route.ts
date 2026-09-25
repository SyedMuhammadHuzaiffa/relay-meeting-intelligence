import { getMeeting } from "@/lib/server/meetings";
import { jsonError, serverError, validId } from "@/lib/server/api";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!validId(id)) return jsonError("Invalid meeting ID", 400);
  const template = new URL(request.url).searchParams.get("template") ?? "enhanced";
  if (template !== "enhanced" && template !== "demo") return jsonError("Invalid summary template", 400);
  try {
    const meeting = await getMeeting(id);
    if (!meeting) return jsonError("Meeting not found", 404);
    return Response.json({ meetingId: id, template, content: meeting.summaries[template] ?? [] });
  } catch (error) { return serverError(error); }
}
