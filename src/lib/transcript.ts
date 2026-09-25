export type ParsedTranscriptLine = { timestamp: string; startSeconds: number; speaker: string; text: string };
export type TranscriptParseResult = { lines: ParsedTranscriptLine[]; error: string | null };

const timestampPattern = String.raw`\d{1,2}:\d{2}(?::\d{2})?`;
const transcriptLinePattern = new RegExp(`^\\s*\\[?(${timestampPattern})\\]?\\s*(?:-\\s*)?([^:]*):\\s*(.*?)\\s*$`);

function parseTimestamp(value: string): number | null {
  const parts = value.split(":").map(Number);
  if (parts.some((part) => !Number.isInteger(part) || part < 0)) return null;
  if (parts.length === 2) {
    if (parts[1] >= 60) return null;
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3) {
    if (parts[1] >= 60 || parts[2] >= 60) return null;
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return null;
}

export function parseTranscript(input: string): TranscriptParseResult {
  const lines: ParsedTranscriptLine[] = [];
  const sourceLines = input.split(/\r?\n/);
  for (let index = 0; index < sourceLines.length; index += 1) {
    const source = sourceLines[index].trim();
    if (!source) continue;
    const match = source.match(transcriptLinePattern);
    if (!match) return { lines: [], error: `Line ${index + 1}: use a timestamp followed by “Speaker: words”.` };
    const [, timestamp, rawSpeaker, text] = match;
    const startSeconds = parseTimestamp(timestamp);
    const speaker = rawSpeaker.trim();
    if (!text.trim()) return { lines: [], error: `Line ${index + 1}: add some transcript text after the speaker name.` };
    if (startSeconds === null) return { lines: [], error: `Line ${index + 1}: enter a valid timestamp (MM:SS or HH:MM:SS).` };
    if (!speaker || speaker.length > 100) return { lines: [], error: `Line ${index + 1}: speaker names must be 1–100 characters.` };
    if (lines.length && startSeconds < lines[lines.length - 1].startSeconds) return { lines: [], error: `Line ${index + 1}: timestamps must stay in chronological order.` };
    lines.push({ timestamp, startSeconds, speaker, text: text.trim() });
  }
  if (!lines.length) return { lines: [], error: "Add at least one timestamped transcript line." };
  return { lines, error: null };
}
