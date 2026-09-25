import type { Meeting, TranscriptLine } from "@/types/meeting";
import { secondsToTimestamp, timestampToSeconds } from "@/lib/time";

export type ShareableMoment = Meeting["highlights"][number];

export type ShareableClip = {
  id?: string;
  start: string;
  end: string;
  endTime: string;
  durationSeconds: number;
  lines: TranscriptLine[];
};

export function getMomentId(moment: ShareableMoment) {
  return `highlight-${moment.timestamp.replaceAll(":", "-")}`;
}

export function getMomentById(meeting: Meeting, momentId?: string) {
  if (!momentId) return undefined;
  return meeting.highlights.find((moment) => getMomentId(moment) === momentId);
}

export function getTranscriptClip(meeting: Meeting, start?: string, end?: string): ShareableClip | undefined {
  if (!start || !end) return undefined;

  const startIndex = meeting.transcript.findIndex((line) => line.timestamp === start);
  const endIndex = meeting.transcript.findIndex((line) => line.timestamp === end);
  if (startIndex < 0 || endIndex < startIndex) return undefined;

  const endBoundarySeconds = endIndex < meeting.transcript.length - 1
    ? timestampToSeconds(meeting.transcript[endIndex + 1].timestamp)
    : meeting.durationSeconds;
  const startSeconds = timestampToSeconds(meeting.transcript[startIndex].timestamp);

  return {
    start,
    end,
    endTime: secondsToTimestamp(endBoundarySeconds),
    durationSeconds: Math.max(1, endBoundarySeconds - startSeconds),
    lines: meeting.transcript.slice(startIndex, endIndex + 1),
  };
}
