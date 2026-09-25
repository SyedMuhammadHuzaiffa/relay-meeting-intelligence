"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ClipboardPaste, FilePlus2 } from "lucide-react";
import { parseTranscript } from "@/lib/transcript";

export function MeetingImportForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [occurredAt, setOccurredAt] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [transcript, setTranscript] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const parsed = useMemo(() => parseTranscript(transcript), [transcript]);
  const speakerCount = new Set(parsed.lines.map((line) => line.speaker.toLocaleLowerCase())).size;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    if (parsed.error) { setError(parsed.error); return; }
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, occurredAt: occurredAt ? new Date(occurredAt).toISOString() : undefined, durationMinutes: durationMinutes || undefined, transcript }),
      });
      const result = await response.json() as { meeting?: { id: string }; error?: string };
      if (!response.ok || !result.meeting) throw new Error(result.error || "Relay could not import this meeting. Try again.");
      router.push(`/meetings/${result.meeting.id}`);
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Relay could not import this meeting. Try again.");
      setPending(false);
    }
  }

  return <main className="relay-page import-page">
    <Link className="back-link" href="/meetings"><ArrowLeft size={16} /> All meetings</Link>
    <header className="import-intro"><span className="import-mark"><FilePlus2 size={19} /></span><p className="overline">ADD TO THE RECORD</p><h1>Bring a conversation into Relay.</h1><p>Paste a transcript and Relay will make it part of your meeting archive, ready to explore.</p></header>
    {error && <div role="alert" className="error-banner import-error">{error}</div>}
    <form className="import-layout" onSubmit={submit}>
      <section className="import-fields" aria-label="Meeting details">
        <div className="import-section-heading"><span>01</span><div><p className="overline">MEETING DETAILS</p><h2>Give this conversation a home.</h2></div></div>
        <label className="import-label" htmlFor="meeting-title">Meeting title <span>Required</span></label>
        <input className="import-input" id="meeting-title" name="title" required maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Product review · Onboarding" />
        <div className="import-meta-fields"><div><label className="import-label" htmlFor="meeting-date">Date and time <span>Optional</span></label><input className="import-input" id="meeting-date" name="occurredAt" type="datetime-local" value={occurredAt} onChange={(event) => setOccurredAt(event.target.value)} /><small>Defaults to the time you import.</small></div><div><label className="import-label" htmlFor="meeting-duration">Duration <span>Optional</span></label><div className="duration-input"><input className="import-input" id="meeting-duration" name="durationMinutes" type="number" min="1" max="600" value={durationMinutes} onChange={(event) => setDurationMinutes(event.target.value)} placeholder="Auto" /><span>min</span></div><small>Auto uses the final transcript timestamp.</small></div></div>
      </section>
      <section className="import-transcript" aria-label="Transcript">
        <div className="import-section-heading"><span>02</span><div><p className="overline">SOURCE TRANSCRIPT</p><h2>Keep the words intact.</h2></div></div>
        <label className="import-label" htmlFor="meeting-transcript">Transcript <span>Required · paste one turn per line</span></label>
        <textarea className="import-textarea" id="meeting-transcript" name="transcript" required maxLength={500000} value={transcript} onChange={(event) => setTranscript(event.target.value)} placeholder="00:00 Sarah: Thanks everyone for joining.&#10;00:08 Alex: I want to start with the onboarding issue.&#10;00:21 Sarah: Let's ship the revised flow on Friday." aria-describedby="transcript-example transcript-help" />
        <div className="transcript-hint" id="transcript-example"><ClipboardPaste size={15} /><div><strong>One line per turn</strong><code>00:00 Sarah: Thanks for joining.</code><code>[00:08] Alex: Let&apos;s get started.</code><span>MM:SS or HH:MM:SS · speaker and words separated by a colon</span></div></div>
        <div className="transcript-feedback" id="transcript-help" aria-live="polite">{parsed.error ? <span className={transcript.trim() ? "invalid" : ""}>{transcript.trim() ? parsed.error : "Your transcript stays private in this workspace."}</span> : <span>{parsed.lines.length} {parsed.lines.length === 1 ? "turn" : "turns"} · {speakerCount} {speakerCount === 1 ? "speaker" : "speakers"} found</span>}</div>
      </section>
      <div className="import-submit"><p>Relay stores the transcript and speaker list with your meeting. You can explore the source right away.</p><button className="button primary" type="submit" disabled={pending || !title.trim() || Boolean(parsed.error)}>{pending ? "Saving to Relay…" : "Import meeting"}<ArrowRight size={16} /></button></div>
    </form>
  </main>;
}
