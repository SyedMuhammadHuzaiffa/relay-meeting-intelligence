import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock3, Scissors, Sparkles } from "lucide-react";
import { RelayMark } from "@/components/app-shell";
import { getClip, getMeeting } from "@/lib/server/meetings";
import { formatDuration, formatMeetingDate } from "@/lib/formatters";
import { getMomentById, getTranscriptClip } from "@/lib/sharing";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ meetingId: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { meetingId } = await params; const meeting = await getMeeting(meetingId); return { title: meeting ? `${meeting.title} — Relay shared view` : "Shared view unavailable — Relay", description: meeting ? `A shared meeting moment from ${meeting.title}.` : "This meeting link is unavailable." }; }
export default async function SharedMeetingPage({ params, searchParams }: Props) {
  const [{ meetingId }, query] = await Promise.all([params, searchParams]);
  const meeting = await getMeeting(meetingId);
  if (!meeting) notFound();
  const momentId = typeof query.moment === "string" ? query.moment : undefined;
  const clipId = typeof query.clip === "string" ? query.clip : undefined;
  const clipStart = typeof query.clipStart === "string" ? query.clipStart : undefined;
  const clipEnd = typeof query.clipEnd === "string" ? query.clipEnd : undefined;
  const moment = getMomentById(meeting, momentId);
  const persistedClip = clipId ? await getClip(clipId) : null;
  const lines = persistedClip?.meetingId === meetingId ? meeting.transcript.filter((line) => line.startSeconds < persistedClip.endSeconds && line.endSeconds > persistedClip.startSeconds) : [];
  const clip = clipId ? (persistedClip && lines.length ? { start: persistedClip.start, endTime: persistedClip.end, durationSeconds: persistedClip.endSeconds - persistedClip.startSeconds, lines } : undefined) : getTranscriptClip(meeting, clipStart, clipEnd);
  const selectedLine = moment ? meeting.transcript.find((line) => line.timestamp === moment.timestamp) : undefined;
  return <main className="public-page"><header className="public-header"><Link href="/" className="relay-identity"><RelayMark /><span>relay<span className="brand-period">.</span></span></Link><span className="public-label">SHARED MEETING RECORD</span><span className="public-readonly">VIEW ONLY</span></header>
    <article className="public-content"><div className="public-hero"><div><p className="overline">CONVERSATION / {meeting.id.toUpperCase()}</p><h1>{meeting.title}</h1><p>{formatMeetingDate(meeting.date)} · {meeting.time} <span className="dot-separator">·</span> {formatDuration(meeting.durationSeconds)} <span className="dot-separator">·</span> {meeting.participants.length} people</p></div><span className="public-stamp">RELAY / SOURCE RECORD</span></div>
      {(momentId && !moment || (clipId || clipStart || clipEnd) && !clip) && <p className="public-notice">That selected moment is unavailable. The meeting record remains below.</p>}
      {moment && <section className="public-focus"><p className="overline">✦ SHARED MOMENT / {moment.timestamp}</p><h2>{moment.title}</h2><p>{moment.note}</p>{selectedLine && <blockquote>“{selectedLine.text}”<footer>{selectedLine.speaker} · {selectedLine.timestamp}</footer></blockquote>}</section>}
      {clip && <section className="public-focus"><p className="overline"><Scissors size={13} /> SHARED CLIP / {clip.start}–{clip.endTime}</p><h2>A moment from the conversation</h2><p>{clip.lines.length} transcript turns · {formatDuration(clip.durationSeconds)} · Transcript excerpt</p><div className="public-clip-lines">{clip.lines.map((line) => <div key={line.id}><time>{line.timestamp}</time><div><strong>{line.speaker}</strong><p>{line.text}</p></div></div>)}</div></section>}
      <div className="public-grid"><section className="public-summary"><div className="section-head"><div><p className="overline">MEETING SYNTHESIS</p><h2>What happened</h2></div></div>{meeting.summary.map((section, index) => <article key={`${section.heading}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{section.heading}</h3><p>{section.body}</p></div></article>)}</section><aside className="public-side"><section><p className="overline">PARTICIPANTS</p><h2>In the room</h2>{meeting.participants.map((person) => <div className="public-person" key={person.id}><span className="person-avatar" style={{ background: person.color }}>{person.initials}</span><span><strong>{person.name}</strong><small>{person.role}</small></span></div>)}</section><section><p className="overline">FOLLOW-THROUGH</p><h2>Action record</h2>{meeting.actionItems.map((action) => <div className="public-action" key={action.id}><CheckCircle2 size={17} /><span><strong>{action.task}</strong><small>{action.owner} · {action.completed ? "Complete" : "Open"}</small></span></div>)}{!meeting.actionItems.length && <p>No actions captured.</p>}</section></aside></div>
      <section className="public-moments"><div className="section-head"><div><p className="overline">SOURCE LINKS</p><h2>More moments</h2></div></div>{meeting.highlights.map((highlight) => <Link href={`/share/${meeting.id}?moment=highlight-${highlight.timestamp.replaceAll(":", "-")}`} key={highlight.id}><Sparkles size={16} /><span>{highlight.title}</span><time>{highlight.timestamp}</time><ArrowRight size={15} /></Link>)}{!meeting.highlights.length && <p>No highlights captured.</p>}</section>
    </article><footer className="public-footer"><span>RELAY / MEETING INTELLIGENCE</span><span><Clock3 size={14} /> Read-only shared record · Demo workspace</span></footer>
  </main>;
}
