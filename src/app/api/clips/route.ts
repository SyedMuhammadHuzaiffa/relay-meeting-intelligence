import { jsonBody, jsonError, objectBody, serverError, validId } from "@/lib/server/api";
import { createClip, getMeeting } from "@/lib/server/meetings";

export async function POST(request: Request) {
  const body = await jsonBody(request);
  if (!objectBody(body) || typeof body.meetingId !== "string" || !validId(body.meetingId)
    || !Number.isInteger(body.startSeconds) || !Number.isInteger(body.endSeconds)
    || typeof body.startSeconds !== "number" || typeof body.endSeconds !== "number"
    || body.startSeconds < 0 || body.endSeconds <= body.startSeconds
    || (body.title !== undefined && (typeof body.title !== "string" || body.title.length > 200))) {
    return jsonError("Invalid clip range, meeting ID, or title", 400);
  }
  try {
    const meeting = await getMeeting(body.meetingId);
    if (!meeting) return jsonError("Meeting not found", 404);
    if (body.endSeconds > meeting.durationSeconds) return jsonError("Clip exceeds meeting duration", 400);
    const clip = await createClip(body.meetingId, body.startSeconds, body.endSeconds, typeof body.title === "string" ? body.title.trim() || null : null);
    return Response.json({ clip }, { status: 201 });
  } catch (error) { return serverError(error); }
}
