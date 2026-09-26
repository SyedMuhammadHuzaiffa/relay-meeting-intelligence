import type { Meeting } from "@/types/meeting";

export function getMeetingIntelligence(meetings: Meeting[]) {
  const openActions = meetings.flatMap((meeting) => meeting.actionItems
    .filter((action) => !action.completed)
    .map((action) => ({ action, meeting })));
  const totalActions = meetings.reduce((sum, meeting) => sum + meeting.actionItems.length, 0);
  const completedActions = totalActions - openActions.length;
  const attention = meetings.map((meeting) => ({
    meeting,
    openCount: meeting.actionItems.filter((action) => !action.completed).length,
    missingBrief: meeting.summary.length === 0,
  })).filter((item) => item.openCount > 0 || item.missingBrief)
    .sort((a, b) => b.openCount - a.openCount || b.meeting.occurredAt.localeCompare(a.meeting.occurredAt));

  const appearances = new Map<string, { person: Meeting["participants"][number]; meetings: Meeting[] }>();
  for (const meeting of meetings) {
    for (const person of meeting.participants) {
      const entry = appearances.get(person.id);
      if (entry) entry.meetings.push(meeting);
      else appearances.set(person.id, { person, meetings: [meeting] });
    }
  }
  const recurringPeople = [...appearances.values()]
    .filter((entry) => entry.meetings.length > 1)
    .map((entry) => ({ ...entry, recentMeeting: [...entry.meetings].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))[0] }))
    .sort((a, b) => b.meetings.length - a.meetings.length || a.person.name.localeCompare(b.person.name));

  const recentHighlights = meetings.flatMap((meeting) => meeting.highlights.map((highlight) => ({ highlight, meeting })))
    .sort((a, b) => b.meeting.occurredAt.localeCompare(a.meeting.occurredAt))
    .slice(0, 6);

  return {
    meetingCount: meetings.length,
    totalDurationSeconds: meetings.reduce((sum, meeting) => sum + meeting.durationSeconds, 0),
    openActions,
    totalActions,
    completionRate: totalActions ? Math.round(completedActions / totalActions * 100) : null,
    attention,
    recurringPeople,
    recentHighlights,
  };
}
