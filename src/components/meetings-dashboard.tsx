"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, Search, Sparkles } from "lucide-react";
import type { Meeting } from "@/types/meeting";
import { formatDuration, formatMeetingDate } from "@/lib/formatters";

type Area = "home" | "meetings" | "intelligence" | "library";

export function MeetingsDashboard({ meetings, area = "home" }: { meetings: Meeting[]; area?: Area }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "attention" | "shared">("all");
  const openActions = meetings.flatMap((meeting) => meeting.actionItems.filter((action) => !action.completed).map((action) => ({ ...action, meeting })));
  const decisions = meetings.reduce((sum, meeting) => sum + meeting.summary.filter((section) => /decision|agreed|consensus/i.test(section.heading)).length, 0);
  const totalDuration = meetings.reduce((sum, meeting) => sum + meeting.durationSeconds, 0);
  const speakerBalance = meetings.map((meeting) => {
    const bySpeaker = new Map<string, number>();
    meeting.transcript.forEach((line) => bySpeaker.set(line.speaker, (bySpeaker.get(line.speaker) ?? 0) + Math.max(0, line.endSeconds - line.startSeconds)));
    const values = [...bySpeaker.values()];
    const total = values.reduce((a, b) => a + b, 0);
    return total ? 100 * (1 - Math.max(...values) / total) : 0;
  });
  const balance = speakerBalance.length ? Math.round(speakerBalance.reduce((a, b) => a + b, 0) / speakerBalance.length) : 0;
  const visible = useMemo(() => meetings.filter((meeting) => {
    const text = [meeting.title, meeting.description, ...meeting.participants.map((person) => person.name), ...meeting.summary.map((section) => section.body)].join(" ").toLowerCase();
    return text.includes(query.toLowerCase()) && (filter === "all" || (filter === "shared" ? meeting.status === "shared" : meeting.actionItems.some((action) => !action.completed)));
  }), [meetings, query, filter]);
  const clips = meetings.flatMap((meeting) => meeting.clips.map((clip) => ({ clip, meeting })));
  const highlights = meetings.flatMap((meeting) => meeting.highlights.map((highlight) => ({ highlight, meeting })));
  return <main className="relay-page">
    <div className="page-intro"><div><p className="overline">RELAY / {area.toUpperCase()}</p><h1>{area === "home" ? "Your meetings, in focus." : area === "meetings" ? "Meetings" : area === "intelligence" ? "Intelligence" : "Library"}</h1><p>{area === "home" ? "A clear view of the conversations, decisions, and follow-through in your workspace." : area === "meetings" ? "Every conversation, with its context close at hand." : area === "intelligence" ? "Patterns and signals measured from your recorded conversations." : "Saved clips and moments from your meeting archive."}</p></div><span className="data-caption">LIVE DATA <i /> POSTGRESQL</span></div>
    {(area === "home" || area === "intelligence") && <section className="metric-grid" aria-label="Meeting metrics">
      <Metric label="Meetings" value={String(meetings.length)} caption={`${formatDuration(totalDuration)} of recorded time`} number="01" />
      <Metric label="Open actions" value={String(openActions.length)} caption={`${meetings.reduce((sum, meeting) => sum + meeting.actionItems.length, 0)} captured in total`} number="02" />
      <Metric label="Decision sections" value={String(decisions)} caption="Identified in stored summaries" number="03" />
      <Metric label="Speaker balance" value={`${balance}%`} caption="Average share outside the lead speaker" number="04" />
    </section>}
    {(area === "home" || area === "meetings") && <div className="dashboard-grid">
      <section className="meeting-index"><div className="section-head"><div><p className="overline">THE RECORD</p><h2>{area === "home" ? "Recent meetings" : "Meeting archive"}</h2></div><span className="counter">{visible.length} / {meetings.length}</span></div>
        <div className="index-controls"><label className="search-control"><Search size={17} /><span className="sr-only">Search meetings</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search meetings, people, topics" type="search" /></label><div className="segmented" aria-label="Filter meetings">{(["all", "attention", "shared"] as const).map((item) => <button type="button" key={item} className={filter === item ? "active" : ""} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item === "all" ? "All" : item === "attention" ? "Needs action" : "Shared"}</button>)}</div></div>
        <div className="meeting-table-head"><span>CONVERSATION</span><span>DATE / LENGTH</span><span>INTELLIGENCE</span><span>STATUS</span></div>
        <div className="meeting-index-list">{visible.map((meeting, index) => <Link className="meeting-index-row" href={`/meetings/${meeting.id}`} key={meeting.id}><div className="index-title"><span className="row-number">{String(index + 1).padStart(2, "0")}</span><div><strong>{meeting.title}</strong><small>{meeting.participants.map((p) => p.name).join(", ")}</small></div></div><div className="index-date"><span>{formatMeetingDate(meeting.date)}</span><small>{formatDuration(meeting.durationSeconds)}</small></div><p>{meeting.summary[0]?.body ?? meeting.description ?? "No brief available yet."}</p><span className="status-cell">{meeting.actionItems.filter((action) => !action.completed).length ? <><span className="status-dot amber" /> {meeting.actionItems.filter((action) => !action.completed).length} open</> : <><span className="status-dot green" /> Clear</>}<ArrowRight size={15} /></span></Link>)}</div>
        {!visible.length && <p className="empty-note">No meetings match this search.</p>}
      </section>
      <aside className="dashboard-aside"><section className="attention-panel"><div className="section-head"><div><p className="overline">FOLLOW-THROUGH</p><h2>Needs attention</h2></div><span className="counter amber-text">{openActions.length}</span></div>{openActions.slice(0, 5).map((action) => <Link href={`/meetings/${action.meeting.id}?tab=actions`} className="attention-item" key={action.id}><span className="attention-icon">↗</span><span><strong>{action.task}</strong><small>{action.owner} · {action.meeting.title}</small></span><ArrowRight size={15} /></Link>)}{!openActions.length && <p className="empty-note">All captured actions are complete.</p>}</section><section className="signal-panel"><Sparkles size={18} /><div><p className="overline">MEETING SIGNAL</p><h3>{highlights.length} highlighted moments</h3><p>Key excerpts stay linked to their source transcript and public sharing view.</p><Link href="/library">Explore library <ArrowRight size={15} /></Link></div></section></aside>
    </div>}
    {area === "home" && <section className="home-pulse white-panel"><div className="section-head"><div><p className="overline">MEETING PULSE</p><h2>Conversation load</h2></div><Link className="text-link" href="/intelligence">Explore intelligence <ArrowRight size={15} /></Link></div><div className="pulse-list">{meetings.slice(0, 5).map((meeting) => <Link href={`/meetings/${meeting.id}?tab=analytics`} key={meeting.id}><span>{meeting.title}</span><span className="pulse-track"><i style={{ width: `${totalDuration ? meeting.durationSeconds / totalDuration * 100 : 0}%` }} /></span><strong>{formatDuration(meeting.durationSeconds)}</strong></Link>)}</div></section>}
    {area === "intelligence" && <div className="intelligence-grid"><section className="white-panel"><div className="section-head"><div><p className="overline">CONVERSATION VOLUME</p><h2>Meeting pulse</h2></div></div><div className="pulse-list">{meetings.map((meeting) => <Link href={`/meetings/${meeting.id}?tab=analytics`} key={meeting.id}><span>{meeting.title}</span><span className="pulse-track"><i style={{ width: `${totalDuration ? meeting.durationSeconds / totalDuration * 100 : 0}%` }} /></span><strong>{formatDuration(meeting.durationSeconds)}</strong></Link>)}</div></section><section className="white-panel"><p className="overline">FOLLOW-THROUGH</p><h2>Action progress</h2>{meetings.map((meeting) => { const total = meeting.actionItems.length; const done = meeting.actionItems.filter((action) => action.completed).length; return <Link className="progress-row" href={`/meetings/${meeting.id}?tab=actions`} key={meeting.id}><span>{meeting.title}</span><strong>{done}/{total}</strong><span className="pulse-track"><i style={{ width: `${total ? done / total * 100 : 0}%` }} /></span></Link>; })}</section></div>}
    {area === "library" && <div className="library-grid"><section className="white-panel"><div className="section-head"><div><p className="overline">SAVED RANGES</p><h2>Clips</h2></div><span className="counter">{clips.length}</span></div>{clips.map(({ clip, meeting }) => <Link className="library-item" href={`/share/${meeting.id}?clip=${clip.id}`} key={clip.id}><Clock3 size={17} /><span><strong>{clip.title || `${clip.start}–${clip.end}`}</strong><small>{meeting.title}</small></span><ArrowRight size={16} /></Link>)}{!clips.length && <p className="empty-note">Create a clip from a meeting transcript to see it here.</p>}</section><section className="white-panel"><div className="section-head"><div><p className="overline">SOURCE MOMENTS</p><h2>Highlights</h2></div><span className="counter">{highlights.length}</span></div>{highlights.map(({ highlight, meeting }) => <Link className="library-item" href={`/share/${meeting.id}?moment=highlight-${highlight.timestamp.replaceAll(":", "-")}`} key={highlight.id}><Sparkles size={17} /><span><strong>{highlight.title}</strong><small>{meeting.title} · {highlight.timestamp}</small></span><ArrowRight size={16} /></Link>)}</section></div>}
    <footer className="relay-footer"><span>RELAY / MEETING INTELLIGENCE</span><span>Seeded records · Stored in PostgreSQL</span></footer>
  </main>;
}
function Metric({ label, value, caption, number }: { label: string; value: string; caption: string; number: string }) { return <div className="metric"><span className="metric-top"><span>{label}</span><small>{number}</small></span><strong>{value}</strong><span className="metric-caption"><CheckCircle2 size={14} />{caption}</span></div>; }
