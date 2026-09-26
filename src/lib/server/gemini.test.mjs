import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { answerWithFallback, INSUFFICIENT_ANSWER } from "../ask-ai.ts";

const source = readFileSync(new URL("./gemini.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const meeting = { transcript: [{ id: "test-segment-1", timestamp: "00:00", speaker: "Test User", text: "Daniel owns the regression test." }] };
const fallback = () => ({ text: "Stored fallback", sources: [] });
const success = { ok: true, status: 200, json: async () => ({ candidates: [{ finishReason: "STOP", content: { parts: [{ text: JSON.stringify({ answer: "Daniel owns the regression test.", evidenceSegmentIds: ["test-segment-1"] }) }] } }] }) };
const failure = (status) => ({ ok: false, status });

function provider(replies, { abortImmediately = false } = {}) {
  const calls = [];
  const delays = [];
  const exports = {};
  const timers = new Map();
  let nextTimer = 0;
  const setTimer = (callback, delay) => {
    const id = ++nextTimer;
    timers.set(id, callback);
    if (delay === 15_000) {
      if (abortImmediately) queueMicrotask(callback);
    } else {
      delays.push(delay);
      queueMicrotask(callback);
    }
    return id;
  };
  const fetch = async (url, options) => {
    calls.push({ url, options });
    const reply = replies[calls.length - 1];
    return typeof reply === "function" ? reply(options.signal) : reply;
  };
  vm.runInNewContext(compiled, {
    exports,
    require: (name) => name === "server-only" ? {} : name === "@/lib/ask-ai" ? { INSUFFICIENT_ANSWER } : assert.fail(`Unexpected import: ${name}`),
    fetch,
    AbortController,
    TypeError,
    setTimeout: setTimer,
    clearTimeout: (id) => timers.delete(id),
    Math: { random: () => 0.5 },
  });
  return { generate: exports.generateGeminiAnswer, calls, delays };
}

test("503 is retried and a later structured answer is accepted", async () => {
  const { generate, calls, delays } = provider([failure(503), success]);
  const result = await answerWithFallback(meeting, "Who owns it?", "test-key", generate, fallback);
  assert.equal(result.text, "Daniel owns the regression test.");
  assert.deepEqual(result.sources.map((source) => source.segmentId), ["test-segment-1"]);
  assert.equal(calls.length, 2);
  assert.deepEqual(delays, [1000]);
  assert.match(calls[0].url, /gemini-3\.8-flash:generateContent$/);
  const body = JSON.parse(calls[0].options.body);
  assert.equal(body.generationConfig.responseMimeType, "application/json");
  assert.deepEqual(body.generationConfig.responseSchema.required, ["answer", "evidenceSegmentIds"]);
  assert.equal(calls[0].options.body, calls[1].options.body);
});

test("three 503 responses stop after two retries and use fallback", async () => {
  const { generate, calls, delays } = provider([failure(503), failure(503), failure(503)]);
  assert.deepEqual(await answerWithFallback(meeting, "Who owns it?", "test-key", generate, fallback), fallback());
  assert.equal(calls.length, 3);
  assert.deepEqual(delays, [1000, 2000]);
});

test("400 is not retried", async () => {
  const { generate, calls, delays } = provider([failure(400)]);
  assert.deepEqual(await answerWithFallback(meeting, "Who owns it?", "test-key", generate, fallback), fallback());
  assert.equal(calls.length, 1);
  assert.deepEqual(delays, []);
});

test("network failures retry at most twice before fallback", async () => {
  const networkError = () => { throw new TypeError("fetch failed"); };
  const { generate, calls, delays } = provider([networkError, networkError, networkError]);
  assert.deepEqual(await answerWithFallback(meeting, "Who owns it?", "test-key", generate, fallback), fallback());
  assert.equal(calls.length, 3);
  assert.deepEqual(delays, [1000, 2000]);
});

test("the overall timeout aborts a stalled fetch and uses fallback", async () => {
  const stalled = (signal) => new Promise((resolve, reject) => {
    if (signal.aborted) reject(new TypeError("aborted"));
    else signal.addEventListener("abort", () => reject(new TypeError("aborted")), { once: true });
  });
  const { generate, calls, delays } = provider([stalled], { abortImmediately: true });
  assert.deepEqual(await answerWithFallback(meeting, "Who owns it?", "test-key", generate, fallback), fallback());
  assert.equal(calls.length, 1);
  assert.deepEqual(delays, []);
});
