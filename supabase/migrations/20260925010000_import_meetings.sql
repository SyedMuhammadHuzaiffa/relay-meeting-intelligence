create or replace function public.create_imported_meeting(
  p_meeting jsonb,
  p_participants jsonb,
  p_segments jsonb
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  created_id text := p_meeting->>'id';
  person jsonb;
  segment jsonb;
  person_id text;
  participant_index integer := 0;
  segment_index integer := 0;
begin
  insert into public.meetings (id, title, occurred_at, duration_seconds, status)
  values (
    created_id,
    p_meeting->>'title',
    (p_meeting->>'occurred_at')::timestamptz,
    (p_meeting->>'duration_seconds')::integer,
    'private'
  );

  for person in select value from jsonb_array_elements(p_participants)
  loop
    insert into public.participants (id, name, role, color)
    values (person->>'id', person->>'name', person->>'role', person->>'color')
    on conflict (name) do update set name = excluded.name
    returning id into person_id;

    insert into public.meeting_participants (meeting_id, participant_id, sequence_index)
    values (created_id, person_id, participant_index);
    participant_index := participant_index + 1;
  end loop;

  for segment in select value from jsonb_array_elements(p_segments)
  loop
    select id into person_id from public.participants where name = segment->>'speaker';
    insert into public.transcript_segments (
      id, meeting_id, participant_id, start_seconds, end_seconds, text, sequence_index
    ) values (
      segment->>'id', created_id, person_id,
      (segment->>'startSeconds')::integer,
      (segment->>'endSeconds')::integer,
      segment->>'text', segment_index
    );
    segment_index := segment_index + 1;
  end loop;

  return created_id;
end;
$$;

revoke all on function public.create_imported_meeting(jsonb, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.create_imported_meeting(jsonb, jsonb, jsonb) to service_role;
