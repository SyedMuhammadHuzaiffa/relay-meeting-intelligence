import assert from "node:assert/strict";
import test from "node:test";
import { parseTranscript } from "./transcript.ts";

test("parses common timestamp and speaker formats", () => {
  const result = parseTranscript("00:00 Sarah: Thanks everyone.\n00:08 - Alex: Let's start.\n[00:21] Sarah: On Friday.");
  assert.equal(result.error, null);
  assert.deepEqual(result.lines.map(({ startSeconds, speaker, text }) => ({ startSeconds, speaker, text })), [
    { startSeconds: 0, speaker: "Sarah", text: "Thanks everyone." },
    { startSeconds: 8, speaker: "Alex", text: "Let's start." },
    { startSeconds: 21, speaker: "Sarah", text: "On Friday." },
  ]);
});

test("supports hour timestamps and rejects malformed or out-of-order turns", () => {
  assert.equal(parseTranscript("1:02:03 Alex: Still here.").lines[0]?.startSeconds, 3723);
  assert.match(parseTranscript("00:61 Sam: Invalid seconds.").error ?? "", /valid timestamp/);
  assert.match(parseTranscript("00:08 Sam: Later.\n00:02 Alex: Earlier.").error ?? "", /chronological order/);
  assert.match(parseTranscript("00:00 Sam:    ").error ?? "", /add some transcript text/);
  assert.match(parseTranscript("words without a timestamp").error ?? "", /Line 1/);
});
