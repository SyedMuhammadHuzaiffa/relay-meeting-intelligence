"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Lock,
  MoreHorizontal,
  Play,
  Search,
  SlidersHorizontal,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import type { Meeting } from "@/types/meeting";
import { formatDuration, formatMeetingDate } from "@/lib/formatters";

type Filter = "all" | "shared" | "private";

export function MeetingsDashboard({ meetings }: { meetings: Meeting[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const visibleMeetings = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return meetings.filter((meeting) => {
      const matchesFilter = filter === "all" || meeting.status === filter;
      const searchable = [
        meeting.title,
        ...meeting.participants.flatMap((participant) => [participant.name, participant.role]),
        ...meeting.summary.flatMap((section) => [section.heading, section.body]),
      ].join(" ").toLowerCase();
      return matchesFilter && (!normalized || searchable.includes(normalized));
    });
  }, [filter, meetings, query]);

  const hasActiveFilter = Boolean(query.trim()) || filter !== "all";

  return (
    <main className="meetings-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Meeting library</p>
          <h1>My Calls</h1>
          <p className="heading-copy">Recordings, notes, and the moments worth returning to.</p>
        </div>
        <button className="record-button" type="button">
          <span><span className="record-dot" />Record a call</span>
          <ChevronDown size={15} />
        </button>
      </div>

      <section className="ask-banner" aria-label="Ask Fathom promotion">
        <div className="ask-icon"><Sparkles size={20} /></div>
        <div>
          <strong>Ask across every conversation</strong>
          <p>Find decisions, follow-ups, and customer signals without opening every recording.</p>
        </div>
        <button type="button">Ask Fathom <span>→</span></button>
      </section>

      <div className="meeting-toolbar">
        <label className="search-field">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Search meetings</span>
          <input
            ref={searchRef}
            type="search"
            placeholder="Search calls, people, or topics"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query ? (
            <button type="button" aria-label="Clear search" onClick={() => setQuery("")}><X size={16} /></button>
          ) : (
            <kbd>⌘ K</kbd>
          )}
        </label>

        <div className="filter-pills" aria-label="Filter meetings">
          <SlidersHorizontal size={16} aria-hidden="true" />
          {(["all", "shared", "private"] as const).map((option) => (
            <button
              className={filter === option ? "selected" : ""}
              type="button"
              key={option}
              onClick={() => setFilter(option)}
            >
              {filter === option && <Check size={13} />}
              {option === "all" ? "All calls" : option[0].toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="list-heading">
        <div>
          <h2>Recent meetings</h2>
          <span>{visibleMeetings.length} {visibleMeetings.length === 1 ? "recording" : "recordings"}</span>
        </div>
        <button type="button">Newest first <ChevronDown size={14} /></button>
      </div>

      {visibleMeetings.length > 0 ? (
        <div className="meetings-list">
          {visibleMeetings.map((meeting, index) => (
            <MeetingRow meeting={meeting} key={meeting.id} featured={index === 0 && !hasActiveFilter} />
          ))}
        </div>
      ) : (
        <EmptyState query={query} onReset={() => { setQuery(""); setFilter("all"); }} />
      )}
    </main>
  );
}

function MeetingRow({ meeting, featured }: { meeting: Meeting; featured: boolean }) {
  const lead = meeting.participants[0];
  const extraParticipants = meeting.participants.length - 3;

  return (
    <article className={`meeting-row ${featured ? "featured" : ""}`}>
      <Link className="meeting-link" href={`/meetings/${meeting.id}`} aria-label={`Open ${meeting.title}`}>
        <div className="recording-thumbnail">
          <div className="thumbnail-grid" aria-hidden="true" />
          <div className="thumbnail-avatar" style={{ background: lead.color }}>{lead.initials}</div>
          <div className="play-button"><Play size={17} fill="currentColor" /></div>
          <span>{formatDuration(meeting.durationSeconds)}</span>
          {featured && <em>New</em>}
        </div>

        <div className="meeting-copy">
          <div className="meeting-title-line">
            <h3>{meeting.title}</h3>
            {meeting.status === "private" && <Lock size={13} aria-label="Private" />}
          </div>
          <div className="meeting-meta">
            <span><CalendarDays size={14} />{formatMeetingDate(meeting.date)} · {meeting.time}</span>
            <span><Clock3 size={14} />{formatDuration(meeting.durationSeconds)}</span>
          </div>
          <p>{meeting.summary[0]?.body ?? "No summary available yet."}</p>
        </div>

        <div className="participant-column">
          <div className="avatar-stack" aria-label={`${meeting.participants.length} participants`}>
            {meeting.participants.slice(0, 3).map((participant) => (
              <span style={{ background: participant.color }} key={participant.name} title={participant.name}>
                {participant.initials}
              </span>
            ))}
            {extraParticipants > 0 && <span className="avatar-more">+{extraParticipants}</span>}
          </div>
          <span><Users size={14} />{meeting.participants.length} participants</span>
        </div>
      </Link>
      <button className="row-menu" type="button" aria-label={`More options for ${meeting.title}`}>
        <MoreHorizontal size={18} />
      </button>
    </article>
  );
}

function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <section className="empty-state">
      <div className="empty-rings" aria-hidden="true">
        <span><Search size={24} /></span>
      </div>
      <p className="eyebrow">No matches</p>
      <h2>{query ? `No calls mention “${query}”` : "No calls in this view"}</h2>
      <p>Try a person, customer, topic, or clear the current filters to see your full library.</p>
      <button type="button" onClick={onReset}>Clear search and filters</button>
    </section>
  );
}
