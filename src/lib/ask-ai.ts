import type { AskAnswer, Meeting } from "../types/meeting";

export const INSUFFICIENT_ANSWER = "The meeting does not contain enough information to answer reliably.";
const MAX_TRANSCRIPT_CHARS = 80_000;
const MAX_ANSWER_CHARS = 1_200;
const MAX_EVIDENCE = 4;

export function transcriptForModel(meeting: Meeting): string | null {
  if (!meeting.transcript.length) return null;
  const transcript = JSON.stringify(meeting.transcript.map((line) => ({
    segmentId: line.id, time: line.timestamp, speaker: line.speaker, text: line.text,
  })));
  return transcript.length <= MAX_TRANSCRIPT_CHARS ? transcript : null;
}

export function groundedAnswer(value: unknown, meeting: Meeting): AskAnswer | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const result = value as Record<string, unknown>;
  if (Object.keys(result).some((key) => key !== "answer" && key !== "evidenceSegmentIds")) return null;
  if (typeof result.answer !== "string" || !result.answer.trim() || result.answer.length > MAX_ANSWER_CHARS ||
    !Array.isArray(result.evidenceSegmentIds) || !result.evidenceSegmentIds.every((id) => typeof id === "string")) return null;

  const text = result.answer.trim();
  const segments = new Map(meeting.transcript.map((line) => [line.id, line]));
  // Only stored segment IDs can become evidence links; provider-supplied metadata is ignored.
  const ids = [...new Set(result.evidenceSegmentIds)].filter((id) => segments.has(id)).slice(0, MAX_EVIDENCE);
  // A factual answer needs a stored citation; an insufficient answer must have none.
  if (text !== INSUFFICIENT_ANSWER && !ids.length) return null;
  if (text === INSUFFICIENT_ANSWER && result.evidenceSegmentIds.length) return null;
  return {
    text,
    sources: ids.map((id) => {
      const line = segments.get(id)!;
      return { segmentId: line.id, timestamp: line.timestamp, label: line.speaker };
    }),
  };
}

export async function answerWithFallback(
  meeting: Meeting,
  question: string,
  apiKey: string | undefined,
  generate: (question: string, transcript: string, apiKey: string) => Promise<unknown>,
  fallback: (meeting: Meeting, question: string) => AskAnswer,
): Promise<AskAnswer> {
  const transcript = apiKey?.trim() ? transcriptForModel(meeting) : null;
  if (!transcript) return fallback(meeting, question);
  try {
    const answer = groundedAnswer(await generate(question, transcript, apiKey!.trim()), meeting);
    return answer ?? fallback(meeting, question);
  } catch {
    return fallback(meeting, question);
  }
}
