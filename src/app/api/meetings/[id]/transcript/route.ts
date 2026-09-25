import { getMeeting } from "@/lib/server/meetings";
import { jsonError, serverError, validId } from "@/lib/server/api";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!validId(id)) return jsonError("Invalid meeting ID", 400);
  try {
    const meeting = await getMeeting(id);
    return meeting ? Response.json({ meetingId: id, segments: meeting.transcript }) : jsonError("Meeting not found", 404);
  } catch (error) { return serverError(error); }
}
