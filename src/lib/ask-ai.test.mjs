import assert from "node:assert/strict";
import test from "node:test";
import { answerWithFallback, groundedAnswer, INSUFFICIENT_ANSWER, transcriptForModel } from "./ask-ai.ts";

const meeting = {
  transcript: [
    { id: "segment-1", timestamp: "00:44", speaker: "Daniel", text: "I will own the production regression test.", startSeconds: 44, endSeconds: 60 },
    { id: "segment-2", timestamp: "01:00", speaker: "Maya", text: "We will review the results tomorrow.", startSeconds: 60, endSeconds: 75 },
  ],
};
const fallback = () => ({ text: "Stored meeting answer", sources: [] });

test("valid model answer maps evidence to stored transcript metadata", () => {
  const answer = groundedAnswer({ answer: "Daniel owns the production regression test.", evidenceSegmentIds: ["segment-1"] }, meeting);
  assert.deepEqual(answer, { text: "Daniel owns the production regression test.", sources: [{ segmentId: "segment-1", timestamp: "00:44", label: "Daniel" }] });
});

test("unknown evidence is discarded and duplicates are deduplicated", () => {
  const answer = groundedAnswer({ answer: "Daniel owns it.", evidenceSegmentIds: ["unknown", "segment-1", "segment-1", "segment-2"] }, meeting);
  assert.deepEqual(answer?.sources.map((source) => source.segmentId), ["segment-1", "segment-2"]);
  assert.equal(groundedAnswer({ answer: "Daniel owns it.", evidenceSegmentIds: ["segment-1"], speaker: "Fake" }, meeting), null);
});

test("malformed or uncited model output falls back", async () => {
  for (const output of [null, { answer: "Claim", evidenceSegmentIds: "segment-1" }, { answer: "Claim", evidenceSegmentIds: ["unknown"] }, { answer: "Claim", evidenceSegmentIds: [42] }]) {
    assert.deepEqual(await answerWithFallback(meeting, "Who owns it?", "test-key", async () => output, fallback), fallback());
  }
  assert.deepEqual(await answerWithFallback(meeting, "Who owns it?", "test-key", async () => { throw new Error("provider failed"); }, fallback), fallback());
});

test("missing key and oversized or empty transcripts use deterministic fallback without a request", async () => {
  const neverGenerate = async () => { assert.fail("provider should not be called"); };
  assert.deepEqual(await answerWithFallback(meeting, "Who owns it?", undefined, neverGenerate, fallback), fallback());
  assert.deepEqual(await answerWithFallback({ transcript: [] }, "Who owns it?", "test-key", neverGenerate, fallback), fallback());
  const oversized = { transcript: [{ ...meeting.transcript[0], text: "x".repeat(80_001) }] };
  assert.equal(transcriptForModel(oversized), null);
  assert.deepEqual(await answerWithFallback(oversized, "Who owns it?", "test-key", neverGenerate, fallback), fallback());
});

test("insufficient transcript answer has no fabricated evidence", async () => {
  const output = { answer: INSUFFICIENT_ANSWER, evidenceSegmentIds: [] };
  assert.deepEqual(await answerWithFallback(meeting, "Who deploys iOS?", "test-key", async () => output, fallback), { text: INSUFFICIENT_ANSWER, sources: [] });
  assert.equal(groundedAnswer({ answer: INSUFFICIENT_ANSWER, evidenceSegmentIds: ["segment-1"] }, meeting), null);
});
