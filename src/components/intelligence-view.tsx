import Link from "next/link";
import { ArrowRight, Clock3, Sparkles } from "lucide-react";
import type { Meeting } from "@/types/meeting";
import { formatDuration, formatMeetingDate } from "@/lib/formatters";
import { getMeetingIntelligence } from "@/lib/intelligence";

export function IntelligenceView({ meetings }: { meetings: Meeting[] }) {
  const intelligence = getMeetingIntelligence(meetings);
  const { meetingCount, totalDurationSeconds, openActions, totalActions, completionRate, attention, recurringPeople, recentHighlights } = intelligence;
  return <main className="relay-page intelligence-page">
    <div className="page-intro"><div><p className="overline">RELAY / INTELLIGENCE</p><h1>Intelligence</h1><p>What happened across your meetings, and what needs attention.</p></div><div className="page-intro-actions"><span className="data-caption">LIVE DATA <i /> POSTGRESQL</span></div></div>
    <section className="metric-grid" aria-label="Cross-meeting metrics">
      <IntelligenceMetric label="Meetings" value={String(meetingCount)} caption="Stored conversations" number="01" />
      <IntelligenceMetric label="Meeting time" value={formatDuration(totalDurationSeconds)} caption="Recorded duration" number="02" />
      <IntelligenceMetric label="Open actions" value={String(openActions.length)} caption={`${totalActions} captured in total`} number="03" />
      <IntelligenceMetric label="Completion" value={completionRate === null ? "—" : `${completionRate}%`} caption={completionRate === null ? "No actions captured yet" : `${totalActions - openActions.length} of ${totalActions} complete`} number="04" />
    </section>
    <div className="intelligence-overview">
      <section className="white-panel intelligence-actions"><div className="section-head"><div><p className="overline">FOLLOW-THROUGH / ALL MEETINGS</p><h2>Open actions</h2></div><span className="counter">{openActions.length}</span></div>
        {openActions.length ? <div className="intelligence-list">{openActions.map(({ action, meeting }) => <Link className="intelligence-row" href={`/meetings/${meeting.id}?tab=actions`} key={action.id}><span className="intelligence-row-main"><strong>{action.task}</strong><small>{meeting.title} · {formatMeetingDate(meeting.date)}{action.owner ? ` · ${action.owner}` : ""}{action.dueDate ? ` · Due ${formatMeetingDate(action.dueDate)}` : ""}</small></span><ArrowRight size={16} aria-hidden="true" /></Link>)}</div> : <p className="empty-note">No open actions across your meetings.</p>}
      </section>
      <section className="white-panel intelligence-attention"><div className="section-head"><div><p className="overline">REVIEW QUEUE</p><h2>Meetings needing attention</h2></div><span className="counter">{attention.length}</span></div>
        {attention.length ? <div className="intelligence-list">{attention.map(({ meeting, openCount, missingBrief }) => <Link className="intelligence-row" href={`/meetings/${meeting.id}?tab=${openCount ? "actions" : "overview"}`} key={meeting.id}><span className="intelligence-row-main"><strong>{meeting.title}</strong><small>{formatMeetingDate(meeting.date)}</small><span className="attention-reasons">{openCount > 0 && <span>{openCount} open {openCount === 1 ? "action" : "actions"}</span>}{missingBrief && <span>No brief available</span>}</span></span><ArrowRight size={16} aria-hidden="true" /></Link>)}</div> : <p className="empty-note">No open actions or missing briefs need review.</p>}
      </section>
    </div>
    <div className="intelligence-secondary">
      <section className="white-panel"><div className="section-head"><div><p className="overline">CONVERSATION NETWORK</p><h2>Recurring participants</h2></div><span className="counter">{recurringPeople.length}</span></div>
        {recurringPeople.length ? <div className="intelligence-list">{recurringPeople.map(({ person, meetings: appearances, recentMeeting }) => <Link className="intelligence-row participant-row" href={`/meetings/${recentMeeting.id}`} key={person.id}><span className="person-avatar" style={{ background: person.color }}>{person.initials}</span><span className="intelligence-row-main"><strong>{person.name}</strong><small>{appearances.length} meetings · Most recent: {recentMeeting.title}</small></span><ArrowRight size={16} aria-hidden="true" /></Link>)}</div> : <p className="empty-note">Participants appearing in more than one meeting will show here.</p>}
      </section>
      <section className="white-panel"><div className="section-head"><div><p className="overline">STORED MOMENTS</p><h2>Highlights from recent meetings</h2></div><span className="counter">{recentHighlights.length}</span></div>
        {recentHighlights.length ? <div className="intelligence-list">{recentHighlights.map(({ highlight, meeting }) => <Link className="intelligence-row" href={`/meetings/${meeting.id}?tab=highlights`} key={highlight.id}><Sparkles size={16} aria-hidden="true" /><span className="intelligence-row-main"><strong>{highlight.title}</strong><small>{meeting.title} · {formatMeetingDate(meeting.date)} · {highlight.timestamp}</small></span><ArrowRight size={16} aria-hidden="true" /></Link>)}</div> : <p className="empty-note">No highlights have been captured across these meetings.</p>}
      </section>
    </div>
    <footer className="relay-footer"><span>RELAY / MEETING INTELLIGENCE</span><span><Clock3 size={12} aria-hidden="true" /> Derived from stored meetings</span></footer>
  </main>;
}

function IntelligenceMetric({ label, value, caption, number }: { label: string; value: string; caption: string; number: string }) {
  return <div className="metric"><span className="metric-top"><span>{label}</span><small>{number}</small></span><strong>{value}</strong><span className="metric-caption">{caption}</span></div>;
}
