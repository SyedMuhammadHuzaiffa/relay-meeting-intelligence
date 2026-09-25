"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Link2, Share2, X } from "lucide-react";
import type { Meeting } from "@/types/meeting";
import { getMomentId, type ShareableClip, type ShareableMoment } from "@/lib/sharing";
import { formatDuration } from "@/lib/formatters";

type CopyStatus = "idle" | "copied" | "error";

export function ShareDialog({
  meeting,
  moment,
  clip,
  onClose,
}: {
  meeting: Meeting;
  moment?: ShareableMoment;
  clip?: ShareableClip;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [origin, setOrigin] = useState("");
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  const sharePath = useMemo(() => {
    const base = `/share/${meeting.id}`;
    if (clip) {
      const query = clip.id ? new URLSearchParams({ clip: clip.id }) : new URLSearchParams({ clipStart: clip.start, clipEnd: clip.end });
      return `${base}?${query.toString()}`;
    }
    return moment ? `${base}?moment=${encodeURIComponent(getMomentId(moment))}` : base;
  }, [clip, meeting.id, moment]);
  const shareUrl = origin ? `${origin}${sharePath}` : sharePath;
  const isClip = Boolean(clip);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const originFrame = window.requestAnimationFrame(() => setOrigin(window.location.origin));
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(originFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [onClose]);

  const copyLink = async () => {
    setCopyStatus("idle");

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        const copied = document.execCommand("copy");
        textArea.remove();
        if (!copied) throw new Error("Copy command unavailable");
      }
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  return (
    <div
      className="share-dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        aria-describedby="share-dialog-description"
        aria-labelledby="share-dialog-title"
        aria-modal="true"
        className="share-dialog"
        ref={dialogRef}
        role="dialog"
      >
        <div className="share-dialog-header">
          <span className="share-dialog-icon"><Share2 size={19} /></span>
          <button aria-label="Close share dialog" className="share-dialog-close" onClick={onClose} ref={closeButtonRef} type="button">
            <X size={18} />
          </button>
        </div>

        <div className="share-dialog-copy">
          <p className="eyebrow">{isClip ? "Share transcript clip" : moment ? "Share a moment" : "Share meeting"}</p>
          <h2 id="share-dialog-title">{isClip ? "Selected meeting moment" : moment ? moment.title : meeting.title}</h2>
          {moment && <p className="share-dialog-context">From {meeting.title} · {moment.timestamp}</p>}
          {clip && (
            <p className="share-dialog-context">
              From {meeting.title} · {clip.start}–{clip.endTime} · {formatDuration(clip.durationSeconds)}
            </p>
          )}
          <p id="share-dialog-description">
            Anyone with this link can view {isClip ? "this transcript range and its meeting context" : moment ? "this moment and its meeting context" : "this meeting summary"}, even if they weren&apos;t on the call.
          </p>
        </div>

        <div className="share-link-field">
          <span><Link2 size={15} /></span>
          <input aria-label="Public share link" onFocus={(event) => event.currentTarget.select()} readOnly value={shareUrl} />
          <button className={copyStatus === "copied" ? "copied" : ""} onClick={copyLink} type="button">
            {copyStatus === "copied" ? <Check size={15} /> : <Copy size={15} />}
            {copyStatus === "copied" ? "Copied" : "Copy link"}
          </button>
        </div>

        <div aria-live="polite" className={`share-copy-feedback ${copyStatus}`}>
          {copyStatus === "copied" && "Link copied to your clipboard."}
          {copyStatus === "error" && "Couldn’t access your clipboard. Select the link above and copy it manually."}
        </div>

        <div className="share-dialog-footer">
          <span><span aria-hidden="true" /> Public link · View only</span>
          <button onClick={onClose} type="button">Done</button>
        </div>
      </div>
    </div>
  );
}
