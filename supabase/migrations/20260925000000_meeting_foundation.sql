create table public.meetings (
  id text primary key,
  title text not null,
  occurred_at timestamptz not null,
  duration_seconds integer not null check (duration_seconds > 0),
  description text,
  status text not null default 'private' check (status in ('private', 'shared')),
  created_at timestamptz not null default now()
);

create table public.participants (
  id text primary key,
  name text not null unique,
  role text not null,
  avatar_url text,
  color text not null default '#3f4248'
);

create table public.meeting_participants (
  meeting_id text not null references public.meetings(id) on delete cascade,
  participant_id text not null references public.participants(id),
  sequence_index integer not null check (sequence_index >= 0),
  primary key (meeting_id, participant_id),
  unique (meeting_id, sequence_index)
);

create table public.transcript_segments (
  id text primary key,
  meeting_id text not null references public.meetings(id) on delete cascade,
  participant_id text not null references public.participants(id),
  start_seconds integer not null check (start_seconds >= 0),
  end_seconds integer not null check (end_seconds > start_seconds),
  text text not null,
  sequence_index integer not null check (sequence_index >= 0),
  unique (meeting_id, sequence_index)
);

create table public.summaries (
  id text primary key,
  meeting_id text not null references public.meetings(id) on delete cascade,
  template text not null check (template in ('enhanced', 'demo')),
  content jsonb not null check (jsonb_typeof(content) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (meeting_id, template)
);

create table public.action_items (
  id text primary key,
  meeting_id text not null references public.meetings(id) on delete cascade,
  participant_id text references public.participants(id),
  owner_name text not null,
  title text not null,
  description text,
  due_date date,
  due_label text,
  completed boolean not null default false,
  source_timestamp_seconds integer check (source_timestamp_seconds >= 0),
  sequence_index integer not null default 0
);

create table public.highlights (
  id text primary key,
  meeting_id text not null references public.meetings(id) on delete cascade,
  title text not null,
  description text not null,
  timestamp_seconds integer not null check (timestamp_seconds >= 0),
  transcript_segment_id text references public.transcript_segments(id) on delete set null,
  sequence_index integer not null default 0
);

create table public.clips (
  id text primary key,
  meeting_id text not null references public.meetings(id) on delete cascade,
  start_seconds integer not null check (start_seconds >= 0),
  end_seconds integer not null check (end_seconds > start_seconds),
  title text,
  created_at timestamptz not null default now()
);

create index on public.meetings (occurred_at desc);
create index on public.transcript_segments (meeting_id, sequence_index);
create index on public.action_items (meeting_id, sequence_index);
create index on public.highlights (meeting_id, sequence_index);
create index on public.clips (meeting_id);

-- Only server-side service-role access is used in this slice. Add authenticated
-- user ownership and policies before exposing direct Supabase browser access.
alter table public.meetings enable row level security;
alter table public.participants enable row level security;
alter table public.meeting_participants enable row level security;
alter table public.transcript_segments enable row level security;
alter table public.summaries enable row level security;
alter table public.action_items enable row level security;
alter table public.highlights enable row level security;
alter table public.clips enable row level security;
