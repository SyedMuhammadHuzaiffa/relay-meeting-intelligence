import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3, ExternalLink, Flag, Quote, Scissors, ShieldCheck, Users } from "lucide-react";
import { getClip, getMeeting } from "@/lib/server/meetings";
import { formatDuration, formatMeetingDate } from "@/lib/formatters";
import { getMomentById, getMomentId, getTranscriptClip } from "@/lib/sharing";

export const dynamic = "force-dynamic";

type SharePageProps = { params: Promise<{ meetingId: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { meetingId } = await params;
  const meeting = await getMeeting(meetingId);
  return {
    title: meeting ? `${meeting.title} — Shared meeting` : "Shared meeting unavailable",
    description: meeting ? `A shared, read-only view of ${meeting.title}.` : "This shared meeting link is unavailable.",
  };
}

export default async function SharedMeetingPage({ params, searchParams }: SharePageProps) {
  const [{ meetingId }, query] = await Promise.all([params, searchParams]);
  const meeting = await getMeeting(meetingId);
  if (!meeting) notFound();

  const momentId = typeof query.moment === "string" ? query.moment : undefined;
  const clipStart = typeof query.clipStart === "string" ? query.clipStart : undefined;
  const clipEnd = typeof query.clipEnd === "string" ? query.clipEnd : undefined;
  const clipId = typeof query.clip === "string" ? query.clip : undefined;
  const persistedClip = clipId ? await getClip(clipId) : null;
  const clipRequested = Boolean(clipId || clipStart || clipEnd);
  const sharedMoment = getMomentById(meeting, momentId);
  const persistedLines = persistedClip?.meetingId === meetingId
    ? meeting.transcript.filter((line) => line.startSeconds < persistedClip.endSeconds && line.endSeconds > persistedClip.startSeconds)
    : [];
  const sharedClip = clipId
    ? persistedClip && persistedLines.length ? {
      id: persistedClip.id, start: persistedClip.start, end: persistedLines.at(-1)!.timestamp,
      endTime: persistedClip.end, durationSeconds: persistedClip.endSeconds - persistedClip.startSeconds, lines: persistedLines,
    } : undefined
    : getTranscriptClip(meeting, clipStart, clipEnd);
  const transcriptLine = sharedMoment
    ? meeting.transcript.find((line) => line.timestamp === sharedMoment.timestamp)
    : undefined;

  return (
    <main className="shared-meeting-page">
      <header className="shared-site-header">
        <Link className="wordmark" href="/" aria-label="Fathom home">
          FATHOM
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
        </Link>
        <span className="shared-view-badge"><ShieldCheck size={14} /> Shared view · Read only</span>
      </header>

      <article className="shared-meeting-shell">
        <section className="shared-meeting-hero">
          <p className="eyebrow">Shared meeting</p>
          <h1>{meeting.title}</h1>
          <p className="shared-meeting-intro">A read-only meeting recap shared with you through Fathom.</p>
          <div className="shared-meeting-meta">
            <span><CalendarDays size={15} />{formatMeetingDate(meeting.date)} · {meeting.time}</span>
            <span><Clock3 size={15} />{formatDuration(meeting.durationSeconds)}</span>
            <span><Users size={15} />{meeting.participants.length} participants</span>
          </div>
          <div className="shared-participants" aria-label="Meeting participants">
            {meeting.participants.map((participant) => (
              <span key={participant.name}>
                <i style={{ background: participant.color }}>{participant.initials}</i>
                <span><strong>{participant.name}</strong><small>{participant.role}</small></span>
              </span>
            ))}
          </div>
        </section>

        {momentId && !sharedMoment && (
          <div className="shared-moment-unavailable" role="status">
            That shared moment isn&apos;t available, but the meeting recap is still here.
          </div>
        )}

        {clipRequested && !sharedClip && (
          <div className="shared-moment-unavailable" role="status">
            That shared transcript clip isn&apos;t available, but the meeting recap is still here.
          </div>
        )}

        {sharedMoment && (
          <section className="shared-focus-moment" aria-labelledby="shared-moment-heading">
            <div className="shared-focus-label"><Flag size={13} /> Shared moment</div>
            <div className="shared-focus-heading">
              <div>
                <time>{sharedMoment.timestamp}</time>
                <h2 id="shared-moment-heading">{sharedMoment.title}</h2>
                <p>{sharedMoment.note}</p>
              </div>
              <span className="shared-signal" aria-hidden="true"><i /><i /><i /><i /><i /></span>
            </div>
            {transcriptLine && (
              <blockquote>
                <Quote size={20} aria-hidden="true" />
                <p>{transcriptLine.text}</p>
                <footer>
                  <span style={{ background: meeting.participants.find((person) => person.name === transcriptLine.speaker)?.color }}>
                    {meeting.participants.find((person) => person.name === transcriptLine.speaker)?.initials}
                  </span>
                  <div><strong>{transcriptLine.speaker}</strong><small>At {transcriptLine.timestamp} in the meeting</small></div>
                </footer>
              </blockquote>
            )}
          </section>
        )}

        {sharedClip && (
          <section className="shared-focus-moment shared-clip-moment" aria-labelledby="shared-clip-heading">
            <div className="shared-focus-label"><Scissors size={13} /> Shared transcript clip</div>
            <div className="shared-focus-heading">
              <div>
                <time>{sharedClip.start}–{sharedClip.endTime}</time>
                <h2 id="shared-clip-heading">Selected meeting moment</h2>
                <p>{sharedClip.lines.length} {sharedClip.lines.length === 1 ? "turn" : "turns"} · {formatDuration(sharedClip.durationSeconds)} · Transcript and timestamp range only</p>
              </div>
              <span className="shared-signal" aria-hidden="true"><i /><i /><i /><i /><i /></span>
            </div>
            <ol className="shared-clip-transcript" aria-label="Shared transcript excerpt">
              {sharedClip.lines.map((line) => {
                const participant = meeting.participants.find((person) => person.name === line.speaker);
                return (
                  <li key={`${line.timestamp}-${line.speaker}`}>
                    <span className="mini-avatar" style={{ background: participant?.color ?? "#3f4248" }}>
                      {participant?.initials ?? line.speaker.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <span><strong>{line.speaker}</strong><time>{line.timestamp}</time></span>
                      <p>{line.text}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        <div className="shared-content-grid">
          <section className="shared-summary-card" aria-labelledby="shared-summary-heading">
            <div className="shared-section-heading">
              <p className="eyebrow">Meeting notes</p>
              <h2 id="shared-summary-heading">Summary</h2>
            </div>
            <div className="shared-summary-list">
              {meeting.summary.map((section, index) => (
                <article key={section.heading}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><h3>{section.heading}</h3><p>{section.body}</p></div>
                </article>
              ))}
            </div>
          </section>

          <aside className="shared-highlights-card" aria-labelledby="shared-highlights-heading">
            <div className="shared-section-heading">
              <p className="eyebrow">Key moments</p>
              <h2 id="shared-highlights-heading">Highlights</h2>
            </div>
            <div className="shared-highlights-list">
              {meeting.highlights.map((highlight) => {
                const isShared = sharedMoment && getMomentId(highlight) === getMomentId(sharedMoment);
                return (
                  <Link className={isShared ? "active" : ""} href={`/share/${meeting.id}?moment=${getMomentId(highlight)}`} key={highlight.timestamp}>
                    <span><time>{highlight.timestamp}</time><strong>{highlight.title}</strong><small>{highlight.note}</small></span>
                    <ExternalLink size={14} aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </article>

      <footer className="shared-site-footer"><span>Shared securely with a view-only link</span><span>Powered by Fathom</span></footer>
    </main>
  );
}
