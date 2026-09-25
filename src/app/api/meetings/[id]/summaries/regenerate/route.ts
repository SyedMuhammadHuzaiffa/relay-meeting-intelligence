import { jsonBody, jsonError, objectBody, serverError, validId } from "@/lib/server/api";
import { getMeeting, regenerateSummary } from "@/lib/server/meetings";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!validId(id)) return jsonError("Invalid meeting ID", 400);
  const body = await jsonBody(request);
  if (!objectBody(body) || (body.template !== "enhanced" && body.template !== "demo")) return jsonError("Invalid summary template", 400);
  try {
    const meeting = await getMeeting(id);
    if (!meeting) return jsonError("Meeting not found", 404);
    const summary = await regenerateSummary(meeting, body.template);
    return Response.json({ summary });
  } catch (error) { return serverError(error); }
}
