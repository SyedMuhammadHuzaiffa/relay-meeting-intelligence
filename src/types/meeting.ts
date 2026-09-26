export type Participant = {
  id: string;
  name: string;
  initials: string;
  role: string;
  color: string;
  avatarUrl: string | null;
};

export type TranscriptLine = {
  id: string;
  timestamp: string;
  speaker: string;
  text: string;
  startSeconds: number;
  endSeconds: number;
};

export type SummarySection = { heading: string; body: string };
export type SummaryTemplate = "enhanced" | "demo";

export type ActionItem = {
  id: string;
  owner: string;
  task: string;
  description: string | null;
  due?: string;
  dueDate: string | null;
  timestamp?: string;
  completed: boolean;
};

export type Highlight = {
  id: string;
  timestamp: string;
  title: string;
  note: string;
  transcriptSegmentId: string | null;
};

export type Clip = {
  id: string;
  meetingId: string;
  title: string | null;
  start: string;
  end: string;
  startSeconds: number;
  endSeconds: number;
  createdAt: string;
};

export type StoredSummary = {
  id: string;
  meetingId: string;
  template: SummaryTemplate;
  content: SummarySection[];
  createdAt: string;
  updatedAt: string;
};

export type Meeting = {
  id: string;
  title: string;
  occurredAt: string;
  date: string;
  time: string;
  durationSeconds: number;
  description: string | null;
  participants: Participant[];
  transcript: TranscriptLine[];
  summary: SummarySection[];
  summaries: Partial<Record<SummaryTemplate, SummarySection[]>>;
  actionItems: ActionItem[];
  highlights: Highlight[];
  clips: Clip[];
  status: "shared" | "private";
};

export type AskAnswer = { text: string; sources: { timestamp: string; label: string; segmentId: string }[] };
export type MeetingAnalytics = {
  participantId: string;
  name: string;
  seconds: number;
  percentage: number;
}[];
