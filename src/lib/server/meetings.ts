import "server-only";
import { getSupabase } from "@/lib/server/supabase";
import { secondsToTimestamp } from "@/lib/time";
import type { ParsedTranscriptLine } from "@/lib/transcript";
import type { AskAnswer, Clip, Meeting, MeetingAnalytics, StoredSummary, SummarySection, SummaryTemplate } from "@/types/meeting";

type DbMeeting = { id: string; title: string; occurred_at: string; duration_seconds: number; description: string | null; status: "shared" | "private" };
type DbParticipant = { id: string; name: string; role: string; color: string; avatar_url: string | null };
type DbJoin = { meeting_id: string; participant_id: string; sequence_index: number };
type DbTranscript = { id: string; meeting_id: string; participant_id: string; start_seconds: number; end_seconds: number; text: string; sequence_index: number };
type DbSummary = { meeting_id: string; template: SummaryTemplate; content: SummarySection[] };
type DbAction = { id: string; meeting_id: string; owner_name: string; title: string; description: string | null; due_date: string | null; due_label: string | null; completed: boolean; source_timestamp_seconds: number | null; sequence_index: number };
type DbHighlight = { id: string; meeting_id: string; title: string; description: string; timestamp_seconds: number; transcript_segment_id: string | null; sequence_index: number };
type DbClip = { id: string; meeting_id: string; start_seconds: number; end_seconds: number; title: string | null; created_at: string };
type DbSummaryRecord = { id: string; meeting_id: string; template: SummaryTemplate; content: SummarySection[]; created_at: string; updated_at: string };

function clipDto(row: DbClip): Clip {
  return { id: row.id, meetingId: row.meeting_id, title: row.title, start: secondsToTimestamp(row.start_seconds), end: secondsToTimestamp(row.end_seconds), startSeconds: row.start_seconds, endSeconds: row.end_seconds, createdAt: row.created_at };
}

function summaryDto(row: DbSummaryRecord): StoredSummary {
  return { id: row.id, meetingId: row.meeting_id, template: row.template, content: row.content, createdAt: row.created_at, updatedAt: row.updated_at };
}

function dataOrThrow<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  if (result.data === null) throw new Error("Database returned no data");
  return result.data;
}

function groupByMeeting<T extends { meeting_id: string }>(rows: T[]) {
  const grouped = new Map<string, T[]>();
  for (const row of rows) grouped.set(row.meeting_id, [...(grouped.get(row.meeting_id) ?? []), row]);
  return grouped;
}

async function hydrateMeetings(meetingRows: DbMeeting[]): Promise<Meeting[]> {
  if (!meetingRows.length) return [];
  const db = getSupabase();
  const ids = meetingRows.map((meeting) => meeting.id);
  const [joinsResult, transcriptResult, summaryResult, actionsResult, highlightsResult, clipsResult] = await Promise.all([
    db.from("meeting_participants").select("meeting_id,participant_id,sequence_index").in("meeting_id", ids),
    db.from("transcript_segments").select("id,meeting_id,participant_id,start_seconds,end_seconds,text,sequence_index").in("meeting_id", ids),
    db.from("summaries").select("meeting_id,template,content").in("meeting_id", ids),
    db.from("action_items").select("id,meeting_id,owner_name,title,description,due_date,due_label,completed,source_timestamp_seconds,sequence_index").in("meeting_id", ids),
    db.from("highlights").select("id,meeting_id,title,description,timestamp_seconds,transcript_segment_id,sequence_index").in("meeting_id", ids),
    db.from("clips").select("id,meeting_id,start_seconds,end_seconds,title,created_at").in("meeting_id", ids),
  ]);
  const joins = dataOrThrow(joinsResult) as DbJoin[];
  const participantIds = [...new Set(joins.map((join) => join.participant_id))];
  const participants = participantIds.length
    ? dataOrThrow(await db.from("participants").select("id,name,role,color,avatar_url").in("id", participantIds)) as DbParticipant[]
    : [];
  const people = new Map(participants.map((person) => [person.id, person]));
  const joinsByMeeting = groupByMeeting(joins);
  const transcriptByMeeting = groupByMeeting(dataOrThrow(transcriptResult) as DbTranscript[]);
  const summariesByMeeting = groupByMeeting(dataOrThrow(summaryResult) as DbSummary[]);
  const actionsByMeeting = groupByMeeting(dataOrThrow(actionsResult) as DbAction[]);
  const highlightsByMeeting = groupByMeeting(dataOrThrow(highlightsResult) as DbHighlight[]);
  const clipsByMeeting = groupByMeeting(dataOrThrow(clipsResult) as DbClip[]);

  return meetingRows.map((row) => {
    const summaries: Meeting["summaries"] = {};
    for (const item of summariesByMeeting.get(row.id) ?? []) summaries[item.template] = item.content;
    const date = new Date(row.occurred_at);
    return {
      id: row.id, title: row.title, occurredAt: row.occurred_at,
      date: date.toISOString().slice(0, 10),
      time: date.toLocaleTimeString("en-US", { timeZone: "UTC", hour: "numeric", minute: "2-digit" }),
      durationSeconds: row.duration_seconds, description: row.description, status: row.status,
      participants: (joinsByMeeting.get(row.id) ?? []).sort((a, b) => a.sequence_index - b.sequence_index).flatMap((join) => {
        const person = people.get(join.participant_id);
        return person ? [{ id: person.id, name: person.name, initials: person.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(), role: person.role, color: person.color, avatarUrl: person.avatar_url }] : [];
      }),
      transcript: (transcriptByMeeting.get(row.id) ?? []).sort((a, b) => a.sequence_index - b.sequence_index).map((line) => ({
        id: line.id, timestamp: secondsToTimestamp(line.start_seconds), speaker: people.get(line.participant_id)?.name ?? "Unknown speaker",
        text: line.text, startSeconds: line.start_seconds, endSeconds: line.end_seconds,
      })),
      summary: summaries.enhanced ?? [], summaries,
      actionItems: (actionsByMeeting.get(row.id) ?? []).sort((a, b) => a.sequence_index - b.sequence_index).map((action) => ({
        id: action.id, owner: action.owner_name, task: action.title, description: action.description,
        due: action.due_label ?? action.due_date ?? undefined, dueDate: action.due_date,
        timestamp: action.source_timestamp_seconds === null ? undefined : secondsToTimestamp(action.source_timestamp_seconds),
        completed: action.completed,
      })),
      highlights: (highlightsByMeeting.get(row.id) ?? []).sort((a, b) => a.sequence_index - b.sequence_index).map((highlight) => ({
        id: highlight.id, title: highlight.title, note: highlight.description,
        timestamp: secondsToTimestamp(highlight.timestamp_seconds), transcriptSegmentId: highlight.transcript_segment_id,
      })),
      clips: (clipsByMeeting.get(row.id) ?? []).map(clipDto),
    };
  });
}

export async function listMeetings(): Promise<Meeting[]> {
  const rows = dataOrThrow(await getSupabase().from("meetings").select("id,title,occurred_at,duration_seconds,description,status").order("occurred_at", { ascending: false })) as DbMeeting[];
  return hydrateMeetings(rows);
}

export async function getMeeting(id: string): Promise<Meeting | null> {
  const result = await getSupabase().from("meetings").select("id,title,occurred_at,duration_seconds,description,status").eq("id", id).maybeSingle();
  if (result.error) throw new Error(result.error.message);
  if (!result.data) return null;
  return (await hydrateMeetings([result.data as DbMeeting]))[0];
}

export async function createImportedMeeting(input: { title: string; occurredAt: string; durationSeconds: number; lines: ParsedTranscriptLine[] }): Promise<Meeting> {
  const db = getSupabase();
  const id = `${input.title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "meeting"}-${crypto.randomUUID().slice(0, 8)}`;
  const palette = ["#4169a1", "#7c6548", "#56796a", "#80648f", "#9a654f", "#537b89"];
  const speakers = [...new Map(input.lines.map((line) => [line.speaker.toLocaleLowerCase(), line.speaker])).values()];
  const participants = speakers.map((name, index) => ({ id: crypto.randomUUID(), name, role: "Participant", color: palette[index % palette.length] }));
  const segments = input.lines.map((line, index) => ({
    id: crypto.randomUUID(), speaker: participants.find((person) => person.name.toLocaleLowerCase() === line.speaker.toLocaleLowerCase())!.name,
    startSeconds: line.startSeconds,
    endSeconds: input.lines[index + 1]?.startSeconds > line.startSeconds ? input.lines[index + 1].startSeconds : line.startSeconds + 3,
    text: line.text,
  }));
  const result = await db.rpc("create_imported_meeting", {
    p_meeting: { id, title: input.title, occurred_at: input.occurredAt, duration_seconds: input.durationSeconds },
    p_participants: participants,
    p_segments: segments,
  } as never);
  if (result.error) throw new Error(result.error.message);
  const meeting = await getMeeting(id);
  if (!meeting) throw new Error("Created meeting could not be loaded");
  return meeting;
}

export function getAnalytics(meeting: Meeting): MeetingAnalytics {
  const seconds = new Map(meeting.participants.map((person) => [person.name, 0]));
  for (const line of meeting.transcript) seconds.set(line.speaker, (seconds.get(line.speaker) ?? 0) + line.endSeconds - line.startSeconds);
  const total = [...seconds.values()].reduce((sum, value) => sum + value, 0);
  return meeting.participants.map((person) => ({ participantId: person.id, name: person.name, seconds: seconds.get(person.name) ?? 0, percentage: total ? ((seconds.get(person.name) ?? 0) / total) * 100 : 0 }));
}

export async function setActionCompleted(id: string, completed: boolean) {
  const result = await getSupabase().from("action_items").update({ completed } as never).eq("id", id).select("id,meeting_id,completed").maybeSingle();
  if (result.error) throw new Error(result.error.message);
  const row = result.data as { id: string; meeting_id: string; completed: boolean } | null;
  return row ? { id: row.id, meetingId: row.meeting_id, completed: row.completed } : null;
}

export async function createClip(meetingId: string, startSeconds: number, endSeconds: number, title: string | null) {
  const id = crypto.randomUUID();
  const result = await getSupabase().from("clips").insert({ id, meeting_id: meetingId, start_seconds: startSeconds, end_seconds: endSeconds, title } as never).select("id,meeting_id,start_seconds,end_seconds,title,created_at").single();
  return clipDto(dataOrThrow(result) as DbClip);
}

export async function getClip(id: string) {
  const result = await getSupabase().from("clips").select("id,meeting_id,start_seconds,end_seconds,title,created_at").eq("id", id).maybeSingle();
  if (result.error) throw new Error(result.error.message);
  return result.data ? clipDto(result.data as DbClip) : null;
}

export async function regenerateSummary(meeting: Meeting, template: SummaryTemplate) {
  const content = template === "enhanced" ? meeting.summary : [
    { heading: "Overview", body: meeting.summary.map((section) => `${section.heading}: ${section.body}`).join(" ") },
    { heading: "Moments to show", body: meeting.highlights.map((highlight) => `${highlight.timestamp} ${highlight.title}: ${highlight.note}`).join(" ") },
    { heading: "Follow-through", body: meeting.actionItems.map((action) => `${action.owner}: ${action.task}`).join(" ") },
  ];
  const result = await getSupabase().from("summaries").upsert({ id: `${meeting.id}-${template}`, meeting_id: meeting.id, template, content, updated_at: new Date().toISOString() } as never, { onConflict: "meeting_id,template" }).select("id,meeting_id,template,content,created_at,updated_at").single();
  return summaryDto(dataOrThrow(result) as DbSummaryRecord);
}

export function answerMeeting(meeting: Meeting, question: string): AskAnswer {
  const normalized = question.toLowerCase();
  if (/follow|action|next step|todo|to-do|owner/.test(normalized)) return {
    text: meeting.actionItems.length ? meeting.actionItems.map((action) => `${action.owner}: ${action.task}${action.completed ? " (completed)" : ""}`).join(" ") : "No explicit follow-up items were captured for this meeting.",
    sources: meeting.actionItems.filter((action) => action.timestamp).slice(0, 3).map((action) => ({ timestamp: action.timestamp!, label: action.owner })),
  };
  if (/risk|concern|block|depend|issue|problem/.test(normalized)) {
    const sections = meeting.summary.filter((section) => /risk|depend|issue|block|quality/i.test(`${section.heading} ${section.body}`));
    const lines = meeting.transcript.filter((line) => /risk|approval|security|degrad|latency|depend|regression|gap/i.test(line.text));
    return {
      text: sections.length ? sections.map((section) => `${section.heading}: ${section.body}`).join(" ") : lines.length ? `The discussion flagged: ${lines.slice(0, 2).map((line) => line.text).join(" ")}` : "No explicit risks were captured in the meeting notes or transcript.",
      sources: lines.slice(0, 3).map((line) => ({ timestamp: line.timestamp, label: line.speaker })),
    };
  }
  return {
    text: meeting.summary.map((section) => `${section.heading}: ${section.body}`).join(" ") || "No summary is available for this meeting.",
    sources: meeting.highlights.slice(0, 3).map((highlight) => ({ timestamp: highlight.timestamp, label: highlight.title })),
  };
}
