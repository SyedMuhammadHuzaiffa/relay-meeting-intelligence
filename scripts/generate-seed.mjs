import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const sourcePath = path.resolve("src/data/meetings.ts");
const outputPath = path.resolve("supabase/seed.sql");
const source = fs.readFileSync(sourcePath, "utf8");
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const seedModule = { exports: {} };
vm.runInNewContext(js, { module: seedModule, exports: seedModule.exports });
const { meetings } = seedModule.exports;

const sql = (value) => value == null ? "null" : `'${String(value).replaceAll("'", "''")}'`;
const seconds = (timestamp) => timestamp.split(":").map(Number).reduce((total, part) => total * 60 + part, 0);
const occurredAt = (meeting) => {
  const [, hour, minute, meridiem] = meeting.time.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);
  const utcHour = Number(hour) % 12 + (meridiem === "PM" ? 12 : 0);
  return `${meeting.date}T${String(utcHour).padStart(2, "0")}:${minute}:00Z`;
};
const participantId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const rows = (table, columns, values) => {
  if (!values.length) return "";
  return `insert into public.${table} (${columns.join(", ")}) values\n${values.map((row) => `  (${row.join(", ")})`).join(",\n")}\non conflict do nothing;\n`;
};

const people = [...new Map(meetings.flatMap((meeting) => meeting.participants).map((person) => [person.name, person])).values()];
const lines = ["-- Generated from src/data/meetings.ts by npm run seed:generate.", "-- Apply after the migration. Re-running adds missing rows without overwriting live changes.", "begin;", ""];
lines.push(rows("participants", ["id", "name", "role", "color"], people.map((person) => [sql(participantId(person.name)), sql(person.name), sql(person.role), sql(person.color)])));
lines.push(rows("meetings", ["id", "title", "occurred_at", "duration_seconds", "status"], meetings.map((meeting) => [
  sql(meeting.id), sql(meeting.title), sql(occurredAt(meeting)), meeting.durationSeconds, sql(meeting.status),
])));
lines.push(rows("meeting_participants", ["meeting_id", "participant_id", "sequence_index"], meetings.flatMap((meeting) => meeting.participants.map((person, index) => [sql(meeting.id), sql(participantId(person.name)), index]))));
lines.push(rows("transcript_segments", ["id", "meeting_id", "participant_id", "start_seconds", "end_seconds", "text", "sequence_index"], meetings.flatMap((meeting) => meeting.transcript.map((line, index) => [
  sql(`${meeting.id}-segment-${index + 1}`), sql(meeting.id), sql(participantId(line.speaker)), seconds(line.timestamp),
  Math.max(seconds(line.timestamp) + 1, index + 1 < meeting.transcript.length ? seconds(meeting.transcript[index + 1].timestamp) : meeting.durationSeconds),
  sql(line.text), index,
]))));
lines.push(rows("summaries", ["id", "meeting_id", "template", "content"], meetings.flatMap((meeting) => {
  const demo = [
    { heading: "Overview", body: meeting.summary.map((section) => `${section.heading}: ${section.body}`).join(" ") },
    { heading: "Moments to show", body: meeting.highlights.map((highlight) => `${highlight.timestamp} ${highlight.title}: ${highlight.note}`).join(" ") },
    { heading: "Follow-through", body: meeting.actionItems.map((action) => `${action.owner}: ${action.task}`).join(" ") },
  ];
  return [
    [sql(`${meeting.id}-enhanced`), sql(meeting.id), sql("enhanced"), `${sql(JSON.stringify(meeting.summary))}::jsonb`],
    [sql(`${meeting.id}-demo`), sql(meeting.id), sql("demo"), `${sql(JSON.stringify(demo))}::jsonb`],
  ];
})));
lines.push(rows("action_items", ["id", "meeting_id", "participant_id", "owner_name", "title", "due_label", "source_timestamp_seconds", "sequence_index"], meetings.flatMap((meeting) => meeting.actionItems.map((action, index) => [
  sql(`${meeting.id}-action-${index + 1}`), sql(meeting.id), sql(participantId(action.owner)), sql(action.owner), sql(action.task),
  sql(action.due), action.timestamp ? seconds(action.timestamp) : "null", index,
]))));
lines.push(rows("highlights", ["id", "meeting_id", "title", "description", "timestamp_seconds", "transcript_segment_id", "sequence_index"], meetings.flatMap((meeting) => meeting.highlights.map((highlight, index) => {
  const segmentIndex = meeting.transcript.findIndex((line) => line.timestamp === highlight.timestamp);
  return [sql(`${meeting.id}-highlight-${index + 1}`), sql(meeting.id), sql(highlight.title), sql(highlight.note), seconds(highlight.timestamp),
    segmentIndex >= 0 ? sql(`${meeting.id}-segment-${segmentIndex + 1}`) : "null", index];
}))));
lines.push(rows("clips", ["id", "meeting_id", "start_seconds", "end_seconds", "title"], meetings.flatMap((meeting) => meeting.clips.map((clip) => [
  sql(clip.id), sql(meeting.id), seconds(clip.start), seconds(clip.end), sql(clip.title),
]))));
lines.push("commit;", "");
fs.writeFileSync(outputPath, lines.join("\n"));
console.log(`Wrote ${outputPath}: ${meetings.length} meetings, ${people.length} participants`);
