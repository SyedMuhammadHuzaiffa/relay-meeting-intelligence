import { jsonBody, jsonError, objectBody, serverError, validId } from "@/lib/server/api";
import { answerMeeting, getMeeting } from "@/lib/server/meetings";
import { answerWithFallback } from "@/lib/ask-ai";
import { generateGeminiAnswer } from "@/lib/server/gemini";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!validId(id)) return jsonError("Invalid meeting ID", 400);
  const body = await jsonBody(request);
  if (!objectBody(body) || typeof body.question !== "string" || !body.question.trim() || body.question.length > 1000) return jsonError("Question must be 1–1000 characters", 400);
  try {
    const meeting = await getMeeting(id);
    return meeting ? Response.json({ answer: await answerWithFallback(meeting, body.question.trim(), process.env.GEMINI_API_KEY, generateGeminiAnswer, answerMeeting) }) : jsonError("Meeting not found", 404);
  } catch (error) { return serverError(error); }
}
