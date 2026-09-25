"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Check,
  CheckSquare2,
  ChevronDown,
  Clock3,
  FileText,
  Flag,
  Headphones,
  ListChecks,
  MessageCircleQuestion,
  Pause,
  Play,
  RefreshCw,
  Scissors,
  Send,
  Settings2,
  Share2,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import type { AskAnswer, Meeting, SummarySection } from "@/types/meeting";
import { timestampToSeconds } from "@/lib/time";
import { formatDuration, formatMeetingDate } from "@/lib/formatters";
import { getTranscriptClip, type ShareableClip, type ShareableMoment } from "@/lib/sharing";
import { ShareDialog } from "@/components/share-dialog";

type SummaryTemplate = "enhanced" | "demo";

const suggestedQuestions = [
  "What were the main decisions?",
  "What should I follow up on?",
  "What risks were mentioned?",
];

const summaryTemplates: Record<SummaryTemplate, { label: string; description: string }> = {
  enhanced: {
    label: "Enhanced",
    description: "Structured decisions, takeaways, and meeting context.",
  },
  demo: {
    label: "Demo",
    description: "A presentation-ready walkthrough with moments and follow-through.",
  },
};

function formatPlaybackTime(totalSeconds: number) {
  const rounded = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function MeetingDetail({ meeting }: { meeting: Meeting }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [summaryTemplate, setSummaryTemplate] = useState<SummaryTemplate>("enhanced");
  const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
  const [customizationOpen, setCustomizationOpen] = useState(false);
  const [isSwitchingTemplate, setIsSwitchingTemplate] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [completedActions, setCompletedActions] = useState<Set<string>>(() => new Set(meeting.actionItems.filter((action) => action.completed).map((action) => action.id)));
  const [pendingActions, setPendingActions] = useState<Set<string>>(() => new Set());
  const [summaryContent, setSummaryContent] = useState<Partial<Record<SummaryTemplate, SummarySection[]>>>(meeting.summaries);
  const [apiError, setApiError] = useState<string | null>(null);
  const [focusedTimestamp, setFocusedTimestamp] = useState<string | null>(null);
  const [shareTarget, setShareTarget] = useState<ShareableMoment | null | undefined>(undefined);
  const [shareClip, setShareClip] = useState<ShareableClip | undefined>(undefined);
  const [clipMode, setClipMode] = useState(false);
  const [clipSelection, setClipSelection] = useState<{ start: number | null; end: number | null }>({ start: null, end: null });
  const [askQuestion, setAskQuestion] = useState("");
  const [askAnswer, setAskAnswer] = useState<AskAnswer | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const currentTimeRef = useRef(0);
  const transcriptRefs = useRef(new Map<string, HTMLLIElement>());
  const templateTimerRef = useRef<number | null>(null);
  const focusTimerRef = useRef<number | null>(null);

  const transcript = useMemo(
    () => meeting.transcript.map((line) => ({ ...line, seconds: timestampToSeconds(line.timestamp) })),
    [meeting.transcript],
  );

  const participantsByName = useMemo(
    () => new Map(meeting.participants.map((participant) => [participant.name, participant])),
    [meeting.participants],
  );

  const highlightedTimestamps = useMemo(
    () => new Set(meeting.highlights.map((highlight) => highlight.timestamp)),
    [meeting.highlights],
  );

  const actionItemsByTimestamp = useMemo(() => {
    const actions = new Map<string, string[]>();

    meeting.actionItems.forEach((action) => {
      if (!action.timestamp) return;
      actions.set(action.timestamp, [...(actions.get(action.timestamp) ?? []), action.task]);
    });

    return actions;
  }, [meeting.actionItems]);

  const talkTime = useMemo(() => {
    const secondsBySpeaker = new Map(meeting.participants.map((participant) => [participant.name, 0]));

    transcript.forEach((line, index) => {
      const nextTimestamp = transcript[index + 1]?.seconds ?? meeting.durationSeconds;
      const turnDuration = Math.max(0, nextTimestamp - line.seconds);
      secondsBySpeaker.set(line.speaker, (secondsBySpeaker.get(line.speaker) ?? 0) + turnDuration);
    });

    const measuredSeconds = Array.from(secondsBySpeaker.values()).reduce((total, seconds) => total + seconds, 0);
    return meeting.participants.map((participant) => {
      const seconds = secondsBySpeaker.get(participant.name) ?? 0;
      return {
        participant,
        seconds,
        percentage: measuredSeconds > 0 ? (seconds / measuredSeconds) * 100 : 0,
      };
    });
  }, [meeting.durationSeconds, meeting.participants, transcript]);

  const selectedClip = useMemo(() => {
    if (clipSelection.start === null || clipSelection.end === null) return undefined;
    return getTranscriptClip(
      meeting,
      transcript[clipSelection.start]?.timestamp,
      transcript[clipSelection.end]?.timestamp,
    );
  }, [clipSelection, meeting, transcript]);

  const activeIndex = transcript.findLastIndex((line) => line.seconds <= currentTime);
  const playbackProgress = (currentTime / meeting.durationSeconds) * 100;

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setInterval(() => {
      const nextTime = Math.min(currentTimeRef.current + 0.25, meeting.durationSeconds);
      currentTimeRef.current = nextTime;
      setCurrentTime(nextTime);
      if (nextTime >= meeting.durationSeconds) setIsPlaying(false);
    }, 250);

    return () => window.clearInterval(timer);
  }, [isPlaying, meeting.durationSeconds]);

  useEffect(() => () => {
    if (templateTimerRef.current) window.clearTimeout(templateTimerRef.current);
    if (focusTimerRef.current) window.clearTimeout(focusTimerRef.current);
  }, []);

  const seekTo = (seconds: number) => {
    const nextTime = Math.min(Math.max(seconds, 0), meeting.durationSeconds);
    currentTimeRef.current = nextTime;
    setCurrentTime(nextTime);
  };

  const seekToMoment = (timestamp: string) => {
    seekTo(timestampToSeconds(timestamp));
    setFocusedTimestamp(timestamp);

    window.requestAnimationFrame(() => {
      transcriptRefs.current.get(timestamp)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    if (focusTimerRef.current) window.clearTimeout(focusTimerRef.current);
    focusTimerRef.current = window.setTimeout(() => setFocusedTimestamp(null), 1600);
  };

  const togglePlayback = () => {
    if (currentTime >= meeting.durationSeconds) {
      currentTimeRef.current = 0;
      setCurrentTime(0);
    }
    setIsPlaying((playing) => !playing);
  };

  const applySummaryTemplate = (template: SummaryTemplate) => {
    setTemplateMenuOpen(false);
    setCustomizationOpen(false);
    if (template === summaryTemplate) return;

    setIsSwitchingTemplate(true);
    setSummaryTemplate(template);
    if (templateTimerRef.current) window.clearTimeout(templateTimerRef.current);
    templateTimerRef.current = window.setTimeout(() => setIsSwitchingTemplate(false), 220);
  };

  const regenerateSummary = async () => {
    setTemplateMenuOpen(false);
    setCustomizationOpen(false);
    setIsRegenerating(true);
    setApiError(null);
    try {
      const response = await fetch(`/api/meetings/${meeting.id}/summaries/regenerate`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ template: summaryTemplate }),
      });
      if (!response.ok) throw new Error("Could not regenerate the summary.");
      const result = await response.json() as { summary: { content: SummarySection[] } };
      setSummaryContent((current) => ({ ...current, [summaryTemplate]: result.summary.content }));
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Could not regenerate the summary.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const startClipSelection = () => {
    setClipMode(true);
    setClipSelection({ start: null, end: null });
  };

  const stopClipSelection = () => {
    setClipMode(false);
    setClipSelection({ start: null, end: null });
  };

  const selectTranscriptTurn = (index: number) => {
    if (!clipMode) {
      seekTo(transcript[index].seconds);
      return;
    }

    setClipSelection((selection) => {
      if (selection.start === null || selection.end !== null) return { start: index, end: null };
      return { start: Math.min(selection.start, index), end: Math.max(selection.start, index) };
    });
  };

  const askMeeting = async (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    setAskQuestion(trimmedQuestion);
    setAskAnswer(null);
    setIsAnswering(true);
    setApiError(null);
    try {
      const response = await fetch(`/api/meetings/${meeting.id}/ask`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: trimmedQuestion }),
      });
      if (!response.ok) throw new Error("Could not answer this question.");
      const result = await response.json() as { answer: AskAnswer };
      setAskAnswer(result.answer);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Could not answer this question.");
    } finally {
      setIsAnswering(false);
    }
  };

  const toggleAction = async (id: string) => {
    if (pendingActions.has(id)) return;
    setPendingActions((current) => new Set(current).add(id));
    setApiError(null);
    const completed = !completedActions.has(id);
    try {
      const response = await fetch(`/api/action-items/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ completed }),
      });
      if (!response.ok) throw new Error("Could not update the action item.");
      setCompletedActions((current) => {
        const next = new Set(current);
        if (completed) next.add(id); else next.delete(id);
        return next;
      });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Could not update the action item.");
    } finally {
      setPendingActions((current) => { const next = new Set(current); next.delete(id); return next; });
    }
  };

  const shareSelectedClip = async () => {
    if (!selectedClip) return;
    setApiError(null);
    try {
      const response = await fetch("/api/clips", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingId: meeting.id, startSeconds: timestampToSeconds(selectedClip.start), endSeconds: timestampToSeconds(selectedClip.endTime) }),
      });
      if (!response.ok) throw new Error("Could not create the clip.");
      const result = await response.json() as { clip: { id: string } };
      setShareClip({ ...selectedClip, id: result.clip.id });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Could not create the clip.");
    }
  };

  return (
    <main className="meeting-detail-page">
      {apiError && <p role="alert">{apiError}</p>}
      <Link className="back-link detail-back-link" href="/">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to My Calls
      </Link>

      <header className="meeting-detail-header">
        <div className="meeting-detail-title">
          <p className="eyebrow">Meeting recording</p>
          <div className="meeting-title-action-row">
            <h1>{meeting.title}</h1>
            <button className="meeting-share-button" onClick={() => setShareTarget(null)} type="button">
              <Share2 size={15} />
              Share
            </button>
          </div>
          <div className="detail-meta">
            <span><CalendarDays size={14} />{formatMeetingDate(meeting.date)} · {meeting.time}</span>
            <span><Clock3 size={14} />{formatDuration(meeting.durationSeconds)}</span>
          </div>
        </div>

        <div className="detail-participants">
          <div className="detail-avatar-stack" aria-label={`${meeting.participants.length} participants`}>
            {meeting.participants.map((participant) => (
              <span
                key={participant.name}
                style={{ background: participant.color }}
                title={`${participant.name}, ${participant.role}`}
              >
                {participant.initials}
              </span>
            ))}
          </div>
          <div>
            <strong><Users size={14} />{meeting.participants.length} participants</strong>
            <p>{meeting.participants.map((participant) => participant.name).join(", ")}</p>
          </div>
        </div>
      </header>

      <div className="meeting-detail-grid">
        <section className="recording-player-card" aria-label="Simulated recording player">
          <div className="recording-stage">
            <div className="recording-stage-grid" aria-hidden="true" />
            <div className="recording-badge"><span />Simulated recording</div>
            <div className={`stage-avatar ${isPlaying ? "is-playing" : ""}`} style={{ background: meeting.participants[0].color }}>
              <span>{meeting.participants[0].initials}</span>
            </div>
            <div className="stage-person">
              <strong>{meeting.participants[0].name}</strong>
              <span>{meeting.participants[0].role}</span>
            </div>
          </div>

          <div
            className="player-controls"
            style={{ "--playback-progress": `${playbackProgress}%` } as CSSProperties}
          >
            <div className="waveform-timeline">
              <div className="waveform-bars" aria-hidden="true">
                {Array.from({ length: 96 }, (_, index) => (
                  <i
                    key={index}
                    style={{ height: `${18 + ((index * 29 + meeting.id.length * 11) % 69)}%` }}
                  />
                ))}
              </div>
              <div className="waveform-played" aria-hidden="true" />
              <input
                aria-label="Recording timeline"
                max={meeting.durationSeconds}
                min="0"
                onChange={(event) => seekTo(Number(event.target.value))}
                step="0.1"
                type="range"
                value={currentTime}
              />
            </div>

            <div className="player-control-row">
              <button
                className="primary-play-button"
                type="button"
                onClick={togglePlayback}
                aria-label={isPlaying ? "Pause recording" : "Play recording"}
              >
                {isPlaying ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}
              </button>
              <div className="player-time" aria-live="off">
                <strong>{formatPlaybackTime(currentTime)}</strong>
                <span>/</span>
                <span>{formatPlaybackTime(meeting.durationSeconds)}</span>
              </div>
              <span className="player-caption"><Headphones size={14} />Playback simulation</span>
            </div>
          </div>
        </section>

        <section className="transcript-panel" aria-labelledby="transcript-heading">
          <div className="transcript-heading-row">
            <div>
              <p className="eyebrow">Conversation</p>
              <h2 id="transcript-heading">Transcript</h2>
            </div>
            <div className="transcript-heading-actions">
              <span>{meeting.transcript.length} turns</span>
              <button
                aria-pressed={clipMode}
                className={clipMode ? "active" : ""}
                onClick={clipMode ? stopClipSelection : startClipSelection}
                type="button"
              >
                {clipMode ? <X size={13} /> : <Scissors size={13} />}
                {clipMode ? "Cancel" : "Create clip"}
              </button>
            </div>
          </div>

          {clipMode && (
            <div className="clip-selection-bar" role="status">
              <div>
                <strong>
                  {clipSelection.start === null
                    ? "Choose a start turn"
                    : clipSelection.end === null
                      ? "Now choose an end turn"
                      : `${selectedClip?.start}–${selectedClip?.endTime}`}
                </strong>
                <span>
                  {selectedClip
                    ? `${selectedClip.lines.length} ${selectedClip.lines.length === 1 ? "turn" : "turns"} · ${formatDuration(selectedClip.durationSeconds)}`
                    : "Select a short contiguous transcript range."}
                </span>
              </div>
              <div className="clip-selection-actions">
                {clipSelection.start !== null && (
                  <button onClick={() => setClipSelection({ start: null, end: null })} type="button">Clear</button>
                )}
                <button
                  className="clip-share-action"
                  disabled={!selectedClip}
                  onClick={shareSelectedClip}
                  type="button"
                >
                  <Share2 size={12} /> Share clip
                </button>
              </div>
            </div>
          )}

          <div className="transcript-scroll">
            <ol className="transcript-list" aria-label="Meeting transcript">
              {transcript.map((line, index) => {
                const participant = participantsByName.get(line.speaker);
                const active = index === activeIndex;
                const isHighlight = highlightedTimestamps.has(line.timestamp);
                const linkedActions = actionItemsByTimestamp.get(line.timestamp);
                const isFocused = focusedTimestamp === line.timestamp;
                const isClipSelected = clipSelection.start !== null
                  && index >= clipSelection.start
                  && index <= (clipSelection.end ?? clipSelection.start);
                const clipBoundary = index === clipSelection.start
                  ? "start"
                  : index === clipSelection.end
                    ? "end"
                    : undefined;

                return (
                  <li
                    data-transcript-timestamp={line.timestamp}
                    key={`${line.timestamp}-${line.speaker}`}
                    ref={(node) => {
                      if (node) transcriptRefs.current.set(line.timestamp, node);
                      else transcriptRefs.current.delete(line.timestamp);
                    }}
                  >
                    <button
                      aria-label={clipMode
                        ? `${clipSelection.start === null || clipSelection.end !== null ? "Set clip start" : "Set clip end"} at ${line.timestamp}, ${line.speaker}`
                        : `Seek recording to ${line.timestamp}, ${line.speaker}`}
                      aria-current={active ? "true" : undefined}
                      aria-pressed={clipMode ? isClipSelected : undefined}
                      className={`transcript-turn ${active ? "active" : ""} ${isHighlight ? "has-highlight" : ""} ${linkedActions ? "has-action" : ""} ${isFocused ? "is-focused" : ""} ${isClipSelected ? "is-clip-selected" : ""}`}
                      onClick={() => selectTranscriptTurn(index)}
                      type="button"
                    >
                      <span
                        className="transcript-avatar"
                        style={{ background: participant?.color ?? "#3f4248" }}
                        aria-hidden="true"
                      >
                        {participant?.initials ?? line.speaker.slice(0, 2).toUpperCase()}
                      </span>
                      <span className="transcript-copy">
                        <span className="transcript-speaker-line">
                          <strong>{line.speaker}</strong>
                          <time>{line.timestamp}</time>
                        </span>
                        {(isHighlight || linkedActions) && (
                          <span className="transcript-labels">
                            {isHighlight && <span className="transcript-label is-highlight"><Flag size={10} />Highlight</span>}
                            {linkedActions && <span className="transcript-label is-action"><CheckSquare2 size={10} />Action item</span>}
                          </span>
                        )}
                        {clipBoundary && (
                          <span className="transcript-labels">
                            <span className="transcript-label is-clip"><Scissors size={10} />Clip {clipBoundary}</span>
                          </span>
                        )}
                        <span className="transcript-text">{line.text}</span>
                      </span>
                      <span className="active-turn-marker" aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </div>

      <section className="ask-meeting-panel" aria-labelledby="ask-meeting-heading">
        <div className="ask-meeting-heading">
          <span><MessageCircleQuestion size={18} /></span>
          <div>
            <p className="eyebrow">Answers from this meeting</p>
            <h2 id="ask-meeting-heading">Ask this meeting</h2>
            <p>Get an instant answer from this meeting&apos;s notes, actions, and transcript.</p>
          </div>
        </div>

        <div className="ask-meeting-interaction">
          <div className="ask-suggestions" aria-label="Suggested questions">
            {suggestedQuestions.map((question) => (
              <button disabled={isAnswering} key={question} onClick={() => askMeeting(question)} type="button">
                {question}
              </button>
            ))}
          </div>
          <form
            className="ask-meeting-form"
            onSubmit={(event) => {
              event.preventDefault();
              askMeeting(askQuestion);
            }}
          >
            <input
              aria-label="Ask a question about this meeting"
              disabled={isAnswering}
              onChange={(event) => setAskQuestion(event.target.value)}
              placeholder="Ask about decisions, follow-ups, or risks…"
              value={askQuestion}
            />
            <button aria-label="Ask this meeting" disabled={!askQuestion.trim() || isAnswering} type="submit">
              {isAnswering ? <span className="ask-loading-dot" /> : <Send size={15} />}
            </button>
          </form>

          <div aria-live="polite">
            {isAnswering && (
              <div className="ask-answer-loading" role="status">
                <span /><span /><span />
              </div>
            )}
            {askAnswer && !isAnswering && (
              <div className="ask-answer">
                <strong>Answer</strong>
                <p>{askAnswer.text}</p>
                {askAnswer.sources.length > 0 && (
                  <div className="ask-sources">
                    <span>Sources</span>
                    {askAnswer.sources.map((source) => (
                      <button key={`${source.timestamp}-${source.label}`} onClick={() => seekToMoment(source.timestamp)} type="button">
                        {source.timestamp} · {source.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="meeting-insights-grid">
        <section className="summary-panel" aria-labelledby="summary-heading">
          <div className="summary-heading-row">
            <div>
              <p className="eyebrow"><Sparkles size={12} />AI notes</p>
              <h2 id="summary-heading">Summary</h2>
            </div>

            <div className="summary-controls">
              <button
                className="summary-regenerate-button"
                disabled={isRegenerating}
                onClick={regenerateSummary}
                type="button"
              >
                <RefreshCw className={isRegenerating ? "is-spinning" : ""} size={14} />
                {isRegenerating ? "Regenerating" : "Regenerate"}
              </button>
              <div className="summary-template-control">
                <button
                  aria-expanded={templateMenuOpen}
                  aria-haspopup="menu"
                  className="summary-template-trigger"
                  onClick={() => {
                    setTemplateMenuOpen((open) => !open);
                    setCustomizationOpen(false);
                  }}
                  type="button"
                >
                  <FileText size={14} />
                  {summaryTemplates[summaryTemplate].label}
                  <ChevronDown size={13} />
                </button>

                {templateMenuOpen && (
                  <div className="summary-template-menu" role="menu" aria-label="Summary templates">
                    {(Object.keys(summaryTemplates) as SummaryTemplate[]).map((template) => (
                      <button
                        aria-checked={summaryTemplate === template}
                        key={template}
                        onClick={() => applySummaryTemplate(template)}
                        role="menuitemradio"
                        type="button"
                      >
                        <span className="template-menu-icon">
                          {template === "enhanced" ? <Sparkles size={15} /> : <Play size={14} />}
                        </span>
                        <span>
                          <strong>{summaryTemplates[template].label}</strong>
                          <small>{summaryTemplates[template].description}</small>
                        </span>
                        {summaryTemplate === template && <Check className="template-check" size={15} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                aria-expanded={customizationOpen}
                aria-label="Customize summary"
                className="summary-settings-button"
                onClick={() => {
                  setCustomizationOpen((open) => !open);
                  setTemplateMenuOpen(false);
                }}
                title="Customize summary"
                type="button"
              >
                <Settings2 size={15} />
              </button>
            </div>
          </div>

          {customizationOpen && (
            <div className="summary-customization" role="dialog" aria-label="Customize summary template">
              <div>
                <strong>Customize summary</strong>
                <p>Choose how these meeting notes are organized. Your selection stays active on this page.</p>
              </div>
              <button aria-label="Close summary customization" onClick={() => setCustomizationOpen(false)} type="button">
                <X size={15} />
              </button>
              <div className="customization-options">
                {(Object.keys(summaryTemplates) as SummaryTemplate[]).map((template) => (
                  <button
                    aria-pressed={summaryTemplate === template}
                    className={summaryTemplate === template ? "selected" : ""}
                    key={template}
                    onClick={() => applySummaryTemplate(template)}
                    type="button"
                  >
                    <span>{summaryTemplates[template].label}</span>
                    <small>{summaryTemplates[template].description}</small>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div
            aria-busy={isRegenerating}
            className={`summary-content ${isSwitchingTemplate ? "is-switching" : ""}`}
            data-summary-template={summaryTemplate}
          >
            {isRegenerating ? (
              <div className="summary-regenerate-skeleton" role="status">
                <span className="sr-only">Regenerating the {summaryTemplates[summaryTemplate].label} summary</span>
                {Array.from({ length: summaryTemplate === "enhanced" ? (summaryContent.enhanced?.length ?? 0) : 3 }, (_, index) => (
                  <div key={index}>
                    <i /><span /><span />
                  </div>
                ))}
              </div>
            ) : summaryTemplate === "enhanced" ? (
              <div className="enhanced-summary">
                {(summaryContent.enhanced ?? []).map((section, index) => (
                  <article className="summary-section" key={section.heading}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{section.heading}</h3>
                      <p>{section.body}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="demo-summary">
                <div className="demo-summary-title">
                  <p>Meeting demo brief</p>
                  <h3>{meeting.title}</h3>
                </div>
                {summaryContent.demo ? summaryContent.demo.map((section) => (
                  <article key={section.heading}><h4>{section.heading}</h4><p>{section.body}</p></article>
                )) : <>
                <article>
                  <h4>Overview</h4>
                  <ul>
                    {meeting.summary.map((section) => (
                      <li key={section.heading}><strong>{section.heading}:</strong> {section.body}</li>
                    ))}
                  </ul>
                </article>

                <article>
                  <h4>Moments to show</h4>
                  <ul>
                    {meeting.highlights.map((highlight) => (
                      <li key={highlight.timestamp}>
                        <strong>{highlight.timestamp} · {highlight.title}</strong> — {highlight.note}
                      </li>
                    ))}
                  </ul>
                </article>

                <article>
                  <h4>Follow-through</h4>
                  <ul>
                    {meeting.actionItems.map((action) => (
                      <li key={`${action.owner}-${action.task}`}><strong>{action.owner}:</strong> {action.task}</li>
                    ))}
                  </ul>
                </article>
                </>}
              </div>
            )}
          </div>
          <span className="sr-only" aria-live="polite">
            {isRegenerating
              ? `Regenerating the ${summaryTemplates[summaryTemplate].label} summary`
              : `${summaryTemplates[summaryTemplate].label} summary ready`}
          </span>
        </section>

        <aside className="meeting-insights-sidebar" aria-label="Meeting follow-up">
          <section className="action-items-panel" aria-labelledby="action-items-heading">
            <div className="insight-panel-heading">
              <div>
                <p className="eyebrow"><ListChecks size={12} />Follow-up</p>
                <h2 id="action-items-heading">Action items</h2>
              </div>
              <span>{completedActions.size}/{meeting.actionItems.length}</span>
            </div>

            <div className="action-items-list">
              {meeting.actionItems.map((action) => {
                const participant = participantsByName.get(action.owner);
                const complete = completedActions.has(action.id);

                return (
                  <div className={`action-item ${complete ? "complete" : ""}`} key={`${action.owner}-${action.task}`}>
                    <label className="action-checkbox">
                      <input
                        aria-label={`Mark ${action.task} as ${complete ? "open" : "completed"}`}
                        checked={complete}
                        disabled={pendingActions.has(action.id)}
                        onChange={() => toggleAction(action.id)}
                        type="checkbox"
                      />
                      <span><Check size={13} /></span>
                    </label>
                    <div className="action-item-copy">
                      <p>{action.task}</p>
                      <div className="action-item-meta">
                        <span className="mini-avatar" style={{ background: participant?.color ?? "#3f4248" }}>
                          {participant?.initials ?? action.owner.slice(0, 2).toUpperCase()}
                        </span>
                        <strong>{action.owner}</strong>
                        {action.due && <span>Due {action.due}</span>}
                        {action.timestamp && (
                          <button onClick={() => seekToMoment(action.timestamp!)} type="button">
                            {action.timestamp}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="highlights-panel" aria-labelledby="highlights-heading">
            <div className="insight-panel-heading">
              <div>
                <p className="eyebrow"><Flag size={12} />Moments</p>
                <h2 id="highlights-heading">Highlights</h2>
              </div>
              <span>{meeting.highlights.length}</span>
            </div>

            <div className="highlights-list">
              {meeting.highlights.map((highlight) => (
                <div
                  className="highlight-item"
                  data-highlight-timestamp={highlight.timestamp}
                  key={highlight.timestamp}
                >
                  <button
                    aria-label={`Play ${highlight.title} at ${highlight.timestamp}`}
                    className="highlight-play"
                    onClick={() => seekToMoment(highlight.timestamp)}
                    type="button"
                  >
                    <Play fill="currentColor" size={12} />
                  </button>
                  <button className="highlight-copy" onClick={() => seekToMoment(highlight.timestamp)} type="button">
                    <span className="highlight-time">{highlight.timestamp}</span>
                    <strong>{highlight.title}</strong>
                    <small>{highlight.note}</small>
                  </button>
                  <button className="highlight-share-button" onClick={() => setShareTarget(highlight)} type="button">
                    <Share2 size={12} /> Share
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="talk-time-panel" aria-labelledby="talk-time-heading">
            <div className="insight-panel-heading">
              <div>
                <p className="eyebrow"><BarChart3 size={12} />Analytics</p>
                <h2 id="talk-time-heading">Talk time</h2>
              </div>
              <span>{meeting.participants.length}</span>
            </div>
            <p className="talk-time-note">Estimated from the time between transcript turns.</p>
            <div className="talk-time-list">
              {talkTime.map(({ participant, percentage, seconds }) => (
                <div className="talk-time-row" key={participant.name}>
                  <span className="mini-avatar" style={{ background: participant.color }}>{participant.initials}</span>
                  <div>
                    <div className="talk-time-label">
                      <strong>{participant.name}</strong>
                      <span>{percentage.toFixed(1)}% · {formatDuration(seconds)}</span>
                    </div>
                    <div className="talk-time-track" aria-hidden="true">
                      <i style={{ background: participant.color, width: `${percentage}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
      {shareTarget !== undefined && (
        <ShareDialog
          meeting={meeting}
          moment={shareTarget ?? undefined}
          onClose={() => setShareTarget(undefined)}
        />
      )}
      {shareClip && (
        <ShareDialog
          clip={shareClip}
          meeting={meeting}
          onClose={() => setShareClip(undefined)}
        />
      )}
    </main>
  );
}
