import { listMeetings } from "@/lib/server/meetings";
import { createImportedMeeting } from "@/lib/server/meetings";
import { jsonBody, jsonError, objectBody, serverError } from "@/lib/server/api";
import { parseTranscript } from "@/lib/transcript";

export async function GET() {
  try { return Response.json({ meetings: await listMeetings() }); }
  catch (error) { return serverError(error); }
}

export async function POST(request: Request) {
  const body = await jsonBody(request);
  if (!objectBody(body)) return jsonError("Send the meeting details as JSON.", 400);
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title || title.length > 160) return jsonError("Enter a meeting title between 1 and 160 characters.", 400);
  if (typeof body.transcript !== "string" || body.transcript.length > 500_000) return jsonError("Add a transcript under 500,000 characters.", 400);
  const parsed = parseTranscript(body.transcript);
  if (parsed.error) return jsonError(parsed.error, 400);

  const occurredAt = body.occurredAt === undefined || body.occurredAt === "" ? new Date().toISOString() : body.occurredAt;
  if (typeof occurredAt !== "string" || !Number.isFinite(Date.parse(occurredAt))) return jsonError("Choose a valid meeting date and time.", 400);
  const derivedDuration = Math.max(1, (parsed.lines.at(-1)?.startSeconds ?? 0) + 3);
  const requestedDuration = body.durationMinutes === undefined || body.durationMinutes === "" ? null : Number(body.durationMinutes);
  if (requestedDuration !== null && (!Number.isFinite(requestedDuration) || requestedDuration < 1 || requestedDuration > 600)) return jsonError("Duration must be between 1 and 600 minutes.", 400);
  const durationSeconds = Math.max(derivedDuration, requestedDuration ? Math.round(requestedDuration * 60) : derivedDuration);
  try {
    const meeting = await createImportedMeeting({ title, occurredAt, durationSeconds, lines: parsed.lines });
    return Response.json({ meeting }, { status: 201 });
  } catch (error) { return serverError(error); }
}
