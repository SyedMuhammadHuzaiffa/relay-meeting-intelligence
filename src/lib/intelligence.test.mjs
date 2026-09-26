import assert from "node:assert/strict";
import test from "node:test";
import { getMeetingIntelligence } from "./intelligence.ts";

const person = { id: "person-1", name: "Maya", initials: "MA", role: "Participant", color: "#4169a1", avatarUrl: null };
const meeting = (id, occurredAt, fields = {}) => ({
  id, occurredAt, durationSeconds: 1800, summary: [{ heading: "Overview", body: "Notes" }],
  participants: [person], actionItems: [], highlights: [], ...fields,
});

test("aggregates persisted actions, attention reasons and participants across meetings", () => {
  const result = getMeetingIntelligence([
    meeting("older", "2026-09-20T10:00:00Z", { actionItems: [
      { id: "open", completed: false }, { id: "done", completed: true },
    ], highlights: [{ id: "highlight-1", title: "Key moment" }] }),
    meeting("newer", "2026-09-25T10:00:00Z", { summary: [], actionItems: [{ id: "open-2", completed: false }] }),
  ]);
  assert.equal(result.meetingCount, 2);
  assert.equal(result.totalDurationSeconds, 3600);
  assert.equal(result.openActions.length, 2);
  assert.equal(result.totalActions, 3);
  assert.equal(result.completionRate, 33);
  assert.deepEqual(result.attention.map(({ meeting, openCount, missingBrief }) => [meeting.id, openCount, missingBrief]), [
    ["newer", 1, true], ["older", 1, false],
  ]);
  assert.equal(result.recurringPeople[0].meetings.length, 2);
  assert.equal(result.recurringPeople[0].recentMeeting.id, "newer");
  assert.equal(result.recentHighlights[0].highlight.id, "highlight-1");
});

test("empty and action-free accounts have honest aggregate states", () => {
  assert.equal(getMeetingIntelligence([]).completionRate, null);
  const result = getMeetingIntelligence([meeting("one", "2026-09-25T10:00:00Z")]);
  assert.equal(result.completionRate, null);
  assert.equal(result.attention.length, 0);
  assert.equal(result.recurringPeople.length, 0);
  assert.equal(result.recentHighlights.length, 0);
});
