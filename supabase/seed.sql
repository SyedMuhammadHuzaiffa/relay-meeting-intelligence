-- Generated from src/data/meetings.ts by npm run seed:generate.
-- Apply after the migration. Re-running adds missing rows without overwriting live changes.
begin;

insert into public.participants (id, name, role, color) values
  ('syed-huzaifa', 'Syed Huzaifa', 'Product Engineer', '#14b8d4'),
  ('maya-chen', 'Maya Chen', 'VP, Product', '#8b7cf6'),
  ('jonah-brooks', 'Jonah Brooks', 'Staff Designer', '#ee7ca6'),
  ('elena-rossi', 'Elena Rossi', 'Engineering Lead', '#f59e62'),
  ('naomi-park', 'Naomi Park', 'Product Manager', '#ca765c'),
  ('aisha-rahman', 'Aisha Rahman', 'Growth Lead', '#e5ad45'),
  ('daniel-ortiz', 'Daniel Ortiz', 'Head of Sales', '#4e9ee8'),
  ('marcus-lee', 'Marcus Lee', 'Customer Success', '#59b984'),
  ('priya-nair', 'Priya Nair', 'Data Scientist', '#c179d8'),
  ('theo-martin', 'Theo Martin', 'Founder, Northstar', '#57ad97')
on conflict do nothing;

insert into public.meetings (id, title, occurred_at, duration_seconds, status) values
  ('test-call', 'Test call — recording walkthrough', '2026-09-14T10:06:00Z', 134, 'private'),
  ('mobile-onboarding-review', 'Mobile onboarding — design review', '2026-09-12T14:30:00Z', 2058, 'shared'),
  ('q4-go-to-market', 'Q4 go-to-market planning', '2026-09-10T11:00:00Z', 3527, 'shared'),
  ('northstar-discovery', 'Northstar Labs — customer discovery', '2026-09-08T16:00:00Z', 2812, 'shared'),
  ('engineering-weekly', 'Engineering weekly — reliability', '2026-09-04T09:30:00Z', 1128, 'private'),
  ('product-hiring-debrief', 'Senior product designer — debrief', '2026-08-29T13:15:00Z', 1594, 'private')
on conflict do nothing;

insert into public.meeting_participants (meeting_id, participant_id, sequence_index) values
  ('test-call', 'syed-huzaifa', 0),
  ('test-call', 'maya-chen', 1),
  ('test-call', 'jonah-brooks', 2),
  ('mobile-onboarding-review', 'maya-chen', 0),
  ('mobile-onboarding-review', 'jonah-brooks', 1),
  ('mobile-onboarding-review', 'syed-huzaifa', 2),
  ('mobile-onboarding-review', 'elena-rossi', 3),
  ('mobile-onboarding-review', 'naomi-park', 4),
  ('q4-go-to-market', 'syed-huzaifa', 0),
  ('q4-go-to-market', 'maya-chen', 1),
  ('q4-go-to-market', 'aisha-rahman', 2),
  ('q4-go-to-market', 'daniel-ortiz', 3),
  ('q4-go-to-market', 'marcus-lee', 4),
  ('q4-go-to-market', 'elena-rossi', 5),
  ('q4-go-to-market', 'priya-nair', 6),
  ('q4-go-to-market', 'jonah-brooks', 7),
  ('northstar-discovery', 'theo-martin', 0),
  ('northstar-discovery', 'marcus-lee', 1),
  ('northstar-discovery', 'maya-chen', 2),
  ('northstar-discovery', 'syed-huzaifa', 3),
  ('engineering-weekly', 'elena-rossi', 0),
  ('engineering-weekly', 'syed-huzaifa', 1),
  ('engineering-weekly', 'priya-nair', 2),
  ('engineering-weekly', 'naomi-park', 3),
  ('product-hiring-debrief', 'maya-chen', 0),
  ('product-hiring-debrief', 'jonah-brooks', 1),
  ('product-hiring-debrief', 'naomi-park', 2),
  ('product-hiring-debrief', 'elena-rossi', 3)
on conflict do nothing;

insert into public.transcript_segments (id, meeting_id, participant_id, start_seconds, end_seconds, text, sequence_index) values
  ('test-call-segment-1', 'test-call', 'maya-chen', 8, 23, 'This is a quick walkthrough of how the recorder joins and captures a call.', 0),
  ('test-call-segment-2', 'test-call', 'syed-huzaifa', 23, 42, 'The recording indicator is live, so we should have a clean sample to review in a minute.', 1),
  ('test-call-segment-3', 'test-call', 'syed-huzaifa', 42, 64, 'I can see the timeline moving and the highlight control is available.', 2),
  ('test-call-segment-4', 'test-call', 'maya-chen', 64, 91, 'Great. The participant names and timestamps should make the processed transcript easy to scan.', 3),
  ('test-call-segment-5', 'test-call', 'jonah-brooks', 91, 118, 'Let us mark this moment so we have a short clip to share with the team.', 4),
  ('test-call-segment-6', 'test-call', 'syed-huzaifa', 118, 134, 'That covers the test. I will stop the recorder and confirm the call appears in My Calls.', 5),
  ('mobile-onboarding-review-segment-1', 'mobile-onboarding-review', 'maya-chen', 34, 138, 'Today I want us to leave with one onboarding direction that we can confidently put in front of customers this week.', 0),
  ('mobile-onboarding-review-segment-2', 'mobile-onboarding-review', 'jonah-brooks', 138, 291, 'The first-run experience needs one clear success moment before we ask for notification access.', 1),
  ('mobile-onboarding-review-segment-3', 'mobile-onboarding-review', 'naomi-park', 291, 446, 'In the latest sessions, people understood the workspace quickly but hesitated when the permissions prompt interrupted them.', 2),
  ('mobile-onboarding-review-segment-4', 'mobile-onboarding-review', 'syed-huzaifa', 446, 603, 'We can let people explore a complete sample and keep the real data connection as an explicit next step.', 3),
  ('mobile-onboarding-review-segment-5', 'mobile-onboarding-review', 'elena-rossi', 603, 737, 'That also lowers the technical risk because the sample experience does not depend on import finishing in the background.', 4),
  ('mobile-onboarding-review-segment-6', 'mobile-onboarding-review', 'jonah-brooks', 737, 886, 'I will simplify the first screen so the sample workspace is the primary action and import becomes secondary.', 5),
  ('mobile-onboarding-review-segment-7', 'mobile-onboarding-review', 'naomi-park', 886, 1028, 'Activation improves when the sample workspace is visible before account setup is complete.', 6),
  ('mobile-onboarding-review-segment-8', 'mobile-onboarding-review', 'maya-chen', 1028, 1182, 'Let us use that as the principle: show value first, then ask the customer to invest in setup.', 7),
  ('mobile-onboarding-review-segment-9', 'mobile-onboarding-review', 'syed-huzaifa', 1182, 1325, 'For returning users, the current flow can stay intact so we do not introduce an unnecessary migration state.', 8),
  ('mobile-onboarding-review-segment-10', 'mobile-onboarding-review', 'jonah-brooks', 1325, 1473, 'The revised flow is welcome, sample workspace, then a contextual setup card after the first completed task.', 9),
  ('mobile-onboarding-review-segment-11', 'mobile-onboarding-review', 'naomi-park', 1473, 1600, 'We should measure sample-task completion separately from account completion so we know where confidence changes.', 10),
  ('mobile-onboarding-review-segment-12', 'mobile-onboarding-review', 'maya-chen', 1600, 1689, 'We are aligned on the progressive permission approach and the three-screen structure.', 11),
  ('mobile-onboarding-review-segment-13', 'mobile-onboarding-review', 'elena-rossi', 1689, 1827, 'We can ship the progressive permission flow behind the existing onboarding flag.', 12),
  ('mobile-onboarding-review-segment-14', 'mobile-onboarding-review', 'syed-huzaifa', 1827, 1978, 'I will wire the sample state into the existing flag and add events for the new activation checkpoints.', 13),
  ('mobile-onboarding-review-segment-15', 'mobile-onboarding-review', 'maya-chen', 1978, 2058, 'Perfect. Jonah owns the prototype, Elena and Huzaifa own the flagged implementation, and Naomi will define the readout.', 14),
  ('q4-go-to-market-segment-1', 'q4-go-to-market', 'maya-chen', 21, 107, 'We have fifty-eight minutes to lock the launch story, the October product boundary, and the work that must happen before customer previews.', 0),
  ('q4-go-to-market-segment-2', 'q4-go-to-market', 'marcus-lee', 107, 252, 'The strongest design-partner feedback is still about getting focus time back after calls, not about having another place to store notes.', 1),
  ('q4-go-to-market-segment-3', 'q4-go-to-market', 'aisha-rahman', 252, 396, 'The launch story should lead with time recovered, then prove accuracy with customer examples.', 2),
  ('q4-go-to-market-segment-4', 'q4-go-to-market', 'jonah-brooks', 396, 534, 'Visually, we can make recovered time tangible by connecting one decision to the exact conversation moment that produced it.', 3),
  ('q4-go-to-market-segment-5', 'q4-go-to-market', 'syed-huzaifa', 534, 676, 'The product can support that story now. Every transcript turn already has the timing and speaker context we need for provenance.', 4),
  ('q4-go-to-market-segment-6', 'q4-go-to-market', 'priya-nair', 676, 823, 'For accuracy claims, I want to separate measured transcription quality from the qualitative feedback customers give us about usefulness.', 5),
  ('q4-go-to-market-segment-7', 'q4-go-to-market', 'elena-rossi', 823, 968, 'Agreed. We should not let launch copy imply that an evaluation covers workflows we have not actually benchmarked.', 6),
  ('q4-go-to-market-segment-8', 'q4-go-to-market', 'aisha-rahman', 968, 1111, 'I will structure the narrative as problem, recovered focus, trustworthy source context, and then customer proof.', 7),
  ('q4-go-to-market-segment-9', 'q4-go-to-market', 'marcus-lee', 1111, 1209, 'I can likely secure two written quotes this week, but the larger customer needs legal approval before we name them.', 8),
  ('q4-go-to-market-segment-10', 'q4-go-to-market', 'daniel-ortiz', 1209, 1358, 'That is enough for the first sales enablement draft as long as we keep the third story anonymous.', 9),
  ('q4-go-to-market-segment-11', 'q4-go-to-market', 'daniel-ortiz', 1358, 1497, 'Enterprise buyers keep asking about security before they ask about integrations.', 10),
  ('q4-go-to-market-segment-12', 'q4-go-to-market', 'elena-rossi', 1497, 1632, 'We have the architecture answers. The gap is packaging them into a security overview that sales can share without an engineer on every call.', 11),
  ('q4-go-to-market-segment-13', 'q4-go-to-market', 'syed-huzaifa', 1632, 1776, 'I can pair with Daniel on the technical review and make sure the data-flow diagram matches the current system.', 12),
  ('q4-go-to-market-segment-14', 'q4-go-to-market', 'jonah-brooks', 1776, 1908, 'I will give the security material the same visual language as the product so it feels like part of the launch, not a separate appendix.', 13),
  ('q4-go-to-market-segment-15', 'q4-go-to-market', 'maya-chen', 1908, 2054, 'Good. Security is a launch prerequisite; the deeper integration catalog can stay outside the October critical path.', 14),
  ('q4-go-to-market-segment-16', 'q4-go-to-market', 'aisha-rahman', 2054, 2199, 'For channels, we will start with design partners and founder-led demos before expanding into the broader campaign.', 15),
  ('q4-go-to-market-segment-17', 'q4-go-to-market', 'marcus-lee', 2199, 2332, 'That gives customer success time to capture objections and feed them back into the public launch material.', 16),
  ('q4-go-to-market-segment-18', 'q4-go-to-market', 'priya-nair', 2332, 2465, 'The evaluation set is eighty percent labeled. The remaining calls include the noisiest multi-speaker examples, so they matter disproportionately.', 17),
  ('q4-go-to-market-segment-19', 'q4-go-to-market', 'priya-nair', 2465, 2607, 'We will have a reliable benchmark once the remaining evaluation set is labeled.', 18),
  ('q4-go-to-market-segment-20', 'q4-go-to-market', 'elena-rossi', 2607, 2746, 'Let us protect two engineering days for any regressions the final benchmark exposes, but keep that separate from adding new surface area.', 19),
  ('q4-go-to-market-segment-21', 'q4-go-to-market', 'syed-huzaifa', 2746, 2878, 'I will prepare the release candidate early enough that Priya can run the frozen evaluation before we open the preview group.', 20),
  ('q4-go-to-market-segment-22', 'q4-go-to-market', 'daniel-ortiz', 2878, 2981, 'Sales will recruit the preview group from accounts that already cleared security review, which removes a predictable delay.', 21),
  ('q4-go-to-market-segment-23', 'q4-go-to-market', 'jonah-brooks', 2981, 3097, 'The demo should stay centered on a real meeting: find the decision, hear the source, and share the context with the team.', 22),
  ('q4-go-to-market-segment-24', 'q4-go-to-market', 'aisha-rahman', 3097, 3202, 'That sequence is the campaign spine. It is specific, demonstrable, and connects directly to recovered focus time.', 23),
  ('q4-go-to-market-segment-25', 'q4-go-to-market', 'maya-chen', 3202, 3306, 'The October milestone stays focused: team workspaces, trust, and a repeatable launch motion.', 24),
  ('q4-go-to-market-segment-26', 'q4-go-to-market', 'marcus-lee', 3306, 3378, 'I will send the customer approval tracker after this call and flag any story that puts the schedule at risk.', 25),
  ('q4-go-to-market-segment-27', 'q4-go-to-market', 'daniel-ortiz', 3378, 3462, 'I own the consolidated security objections and will have a sales-ready first pass by Wednesday.', 26),
  ('q4-go-to-market-segment-28', 'q4-go-to-market', 'maya-chen', 3462, 3527, 'We have the owners and the boundary. Please raise a risk immediately if it threatens trust, the benchmark, or the three preview stories.', 27),
  ('northstar-discovery-segment-1', 'northstar-discovery', 'theo-martin', 411, 1154, 'Our team loses the thread when decisions live across calls, chat, and someone’s private notes.', 0),
  ('northstar-discovery-segment-2', 'northstar-discovery', 'marcus-lee', 1154, 2127, 'Would a weekly roll-up help, or do you need decisions available immediately after each call?', 1),
  ('northstar-discovery-segment-3', 'northstar-discovery', 'theo-martin', 2127, 2812, 'Immediate is better, but the real value is being able to find the why two months later.', 2),
  ('engineering-weekly-segment-1', 'engineering-weekly', 'elena-rossi', 185, 572, 'Processing latency is back inside our target after last night’s queue change.', 0),
  ('engineering-weekly-segment-2', 'engineering-weekly', 'priya-nair', 572, 901, 'Speaker separation still degrades when more than six people join from one room.', 1),
  ('engineering-weekly-segment-3', 'engineering-weekly', 'syed-huzaifa', 901, 1128, 'I will add the shared-room case to our regression fixture this week.', 2),
  ('product-hiring-debrief-segment-1', 'product-hiring-debrief', 'jonah-brooks', 344, 800, 'The systems thinking was strong, especially in how they narrowed the ambiguous brief.', 0),
  ('product-hiring-debrief-segment-2', 'product-hiring-debrief', 'elena-rossi', 800, 1331, 'Their collaboration examples were specific and they invited engineering into the tradeoffs early.', 1),
  ('product-hiring-debrief-segment-3', 'product-hiring-debrief', 'maya-chen', 1331, 1594, 'We have enough signal to move forward to references.', 2)
on conflict do nothing;

insert into public.summaries (id, meeting_id, template, content) values
  ('test-call-enhanced', 'test-call', 'enhanced', '[{"heading":"Meeting purpose","body":"Validate the meeting recorder and review the basic post-call workflow."},{"heading":"Key takeaways","body":"Recording, transcription, and moment capture worked as expected during the short test."}]'::jsonb),
  ('test-call-demo', 'test-call', 'demo', '[{"heading":"Overview","body":"Meeting purpose: Validate the meeting recorder and review the basic post-call workflow. Key takeaways: Recording, transcription, and moment capture worked as expected during the short test."},{"heading":"Moments to show","body":"01:31 Creating a shareable moment: Jonah demonstrates when to mark a key moment."},{"heading":"Follow-through","body":"Syed Huzaifa: Confirm the processed transcript is available in the workspace."}]'::jsonb),
  ('mobile-onboarding-review-enhanced', 'mobile-onboarding-review', 'enhanced', '[{"heading":"Decision","body":"Lead with a sample workspace and defer notification permission until after the first completed task."},{"heading":"Design notes","body":"Reduce the welcome flow to three focused screens and keep data import optional."}]'::jsonb),
  ('mobile-onboarding-review-demo', 'mobile-onboarding-review', 'demo', '[{"heading":"Overview","body":"Decision: Lead with a sample workspace and defer notification permission until after the first completed task. Design notes: Reduce the welcome flow to three focused screens and keep data import optional."},{"heading":"Moments to show","body":"14:46 The activation insight: Naomi connects sample data to faster activation. 26:40 Final flow decision: The team aligns on the progressive permission approach."},{"heading":"Follow-through","body":"Jonah Brooks: Publish the revised three-screen onboarding prototype. Elena Rossi: Add the progressive-permission experiment flag."}]'::jsonb),
  ('q4-go-to-market-enhanced', 'q4-go-to-market', 'enhanced', '[{"heading":"Launch strategy","body":"Position the release around recovered focus time, supported by trust and accuracy evidence."},{"heading":"October scope","body":"Prioritize team workspaces, security materials, and three design-partner stories."},{"heading":"Risks","body":"Evaluation labeling and customer approvals are the two schedule-sensitive dependencies."}]'::jsonb),
  ('q4-go-to-market-demo', 'q4-go-to-market', 'demo', '[{"heading":"Overview","body":"Launch strategy: Position the release around recovered focus time, supported by trust and accuracy evidence. October scope: Prioritize team workspaces, security materials, and three design-partner stories. Risks: Evaluation labeling and customer approvals are the two schedule-sensitive dependencies."},{"heading":"Moments to show","body":"22:38 Security is a buying prerequisite: Daniel summarizes the most common enterprise blocker. 53:22 October launch scope: Maya closes with the authoritative priority set."},{"heading":"Follow-through","body":"Aisha Rahman: Draft the launch narrative and channel plan. Daniel Ortiz: Consolidate enterprise security objections. Marcus Lee: Request approval for three customer stories."}]'::jsonb),
  ('northstar-discovery-enhanced', 'northstar-discovery', 'enhanced', '[{"heading":"Customer need","body":"Northstar needs durable decision context that remains searchable long after a meeting ends."},{"heading":"Opportunity","body":"Connect decisions to their source moments and make cross-meeting retrieval feel immediate."}]'::jsonb),
  ('northstar-discovery-demo', 'northstar-discovery', 'demo', '[{"heading":"Overview","body":"Customer need: Northstar needs durable decision context that remains searchable long after a meeting ends. Opportunity: Connect decisions to their source moments and make cross-meeting retrieval feel immediate."},{"heading":"Moments to show","body":"35:27 Finding the why later: Theo explains the long-term value of meeting context."},{"heading":"Follow-through","body":"Marcus Lee: Send Theo a workspace search prototype. Maya Chen: Add decision provenance to the discovery brief."}]'::jsonb),
  ('engineering-weekly-enhanced', 'engineering-weekly', 'enhanced', '[{"heading":"System health","body":"Queue latency recovered; shared-room speaker separation remains the main quality issue."},{"heading":"This week","body":"Expand regression coverage before tuning the speaker attribution model."}]'::jsonb),
  ('engineering-weekly-demo', 'engineering-weekly', 'demo', '[{"heading":"Overview","body":"System health: Queue latency recovered; shared-room speaker separation remains the main quality issue. This week: Expand regression coverage before tuning the speaker attribution model."},{"heading":"Moments to show","body":"03:05 Latency is back on target: Elena confirms the queue change resolved the incident."},{"heading":"Follow-through","body":"Syed Huzaifa: Add a shared-room regression fixture. Priya Nair: Segment attribution errors by participant count."}]'::jsonb),
  ('product-hiring-debrief-enhanced', 'product-hiring-debrief', 'enhanced', '[{"heading":"Recommendation","body":"Move the candidate to references based on strong systems thinking and cross-functional collaboration."},{"heading":"Follow-up","body":"Validate operating pace and people-management expectations during references."}]'::jsonb),
  ('product-hiring-debrief-demo', 'product-hiring-debrief', 'demo', '[{"heading":"Overview","body":"Recommendation: Move the candidate to references based on strong systems thinking and cross-functional collaboration. Follow-up: Validate operating pace and people-management expectations during references."},{"heading":"Moments to show","body":"22:11 Proceed to references: Maya records the panel decision."},{"heading":"Follow-through","body":"Naomi Park: Coordinate two candidate references."}]'::jsonb)
on conflict do nothing;

insert into public.action_items (id, meeting_id, participant_id, owner_name, title, due_label, source_timestamp_seconds, sequence_index) values
  ('test-call-action-1', 'test-call', 'syed-huzaifa', 'Syed Huzaifa', 'Confirm the processed transcript is available in the workspace.', 'Today', 118, 0),
  ('mobile-onboarding-review-action-1', 'mobile-onboarding-review', 'jonah-brooks', 'Jonah Brooks', 'Publish the revised three-screen onboarding prototype.', 'Sep 15', 737, 0),
  ('mobile-onboarding-review-action-2', 'mobile-onboarding-review', 'elena-rossi', 'Elena Rossi', 'Add the progressive-permission experiment flag.', 'Sep 17', 1689, 1),
  ('q4-go-to-market-action-1', 'q4-go-to-market', 'aisha-rahman', 'Aisha Rahman', 'Draft the launch narrative and channel plan.', 'Sep 18', 968, 0),
  ('q4-go-to-market-action-2', 'q4-go-to-market', 'daniel-ortiz', 'Daniel Ortiz', 'Consolidate enterprise security objections.', 'Sep 16', 3378, 1),
  ('q4-go-to-market-action-3', 'q4-go-to-market', 'marcus-lee', 'Marcus Lee', 'Request approval for three customer stories.', 'Sep 19', 3306, 2),
  ('northstar-discovery-action-1', 'northstar-discovery', 'marcus-lee', 'Marcus Lee', 'Send Theo a workspace search prototype.', 'Sep 15', 1154, 0),
  ('northstar-discovery-action-2', 'northstar-discovery', 'maya-chen', 'Maya Chen', 'Add decision provenance to the discovery brief.', null, null, 1),
  ('engineering-weekly-action-1', 'engineering-weekly', 'syed-huzaifa', 'Syed Huzaifa', 'Add a shared-room regression fixture.', 'Sep 11', 901, 0),
  ('engineering-weekly-action-2', 'engineering-weekly', 'priya-nair', 'Priya Nair', 'Segment attribution errors by participant count.', null, 572, 1),
  ('product-hiring-debrief-action-1', 'product-hiring-debrief', 'naomi-park', 'Naomi Park', 'Coordinate two candidate references.', 'Sep 2', null, 0)
on conflict do nothing;

insert into public.highlights (id, meeting_id, title, description, timestamp_seconds, transcript_segment_id, sequence_index) values
  ('test-call-highlight-1', 'test-call', 'Creating a shareable moment', 'Jonah demonstrates when to mark a key moment.', 91, 'test-call-segment-5', 0),
  ('mobile-onboarding-review-highlight-1', 'mobile-onboarding-review', 'The activation insight', 'Naomi connects sample data to faster activation.', 886, 'mobile-onboarding-review-segment-7', 0),
  ('mobile-onboarding-review-highlight-2', 'mobile-onboarding-review', 'Final flow decision', 'The team aligns on the progressive permission approach.', 1600, 'mobile-onboarding-review-segment-12', 1),
  ('q4-go-to-market-highlight-1', 'q4-go-to-market', 'Security is a buying prerequisite', 'Daniel summarizes the most common enterprise blocker.', 1358, 'q4-go-to-market-segment-11', 0),
  ('q4-go-to-market-highlight-2', 'q4-go-to-market', 'October launch scope', 'Maya closes with the authoritative priority set.', 3202, 'q4-go-to-market-segment-25', 1),
  ('northstar-discovery-highlight-1', 'northstar-discovery', 'Finding the why later', 'Theo explains the long-term value of meeting context.', 2127, 'northstar-discovery-segment-3', 0),
  ('engineering-weekly-highlight-1', 'engineering-weekly', 'Latency is back on target', 'Elena confirms the queue change resolved the incident.', 185, 'engineering-weekly-segment-1', 0),
  ('product-hiring-debrief-highlight-1', 'product-hiring-debrief', 'Proceed to references', 'Maya records the panel decision.', 1331, 'product-hiring-debrief-segment-3', 0)
on conflict do nothing;

insert into public.clips (id, meeting_id, start_seconds, end_seconds, title) values
  ('recording-walkthrough', 'test-call', 84, 115, 'How to mark a key moment'),
  ('q4-launch-scope', 'q4-go-to-market', 3168, 3246, 'The Q4 launch thesis')
on conflict do nothing;

commit;
