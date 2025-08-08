-- Create forms and submissions tables with RLS for a SaaS-like form builder

-- Enable required extensions
create extension if not exists pgcrypto;

-- Forms table
create table if not exists public.forms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  schema jsonb not null,
  is_public boolean not null default false,
  share_slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helpful index for querying by user and slug
create index if not exists idx_forms_user on public.forms(user_id);
create index if not exists idx_forms_slug on public.forms(share_slug);

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_forms_set_updated_at
before update on public.forms
for each row execute function public.set_updated_at();

-- RLS
alter table public.forms enable row level security;

-- Policy: Owners can do everything
create policy "forms_owner_full_access" on public.forms
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Policy: Public can read published forms
create policy "forms_public_can_view_published" on public.forms
for select
using (is_public = true);

-- Submissions table (optional but useful for shareable forms)
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms(id) on delete cascade,
  created_at timestamptz not null default now(),
  data jsonb not null
);

alter table public.submissions enable row level security;

-- Policy: Anyone can insert if the form is public
create policy "submissions_insert_if_form_public" on public.submissions
for insert
with check (exists (
  select 1 from public.forms f where f.id = form_id and f.is_public = true
));

-- Policy: Owners can read their submissions
create policy "submissions_owner_can_read" on public.submissions
for select
using (exists (
  select 1 from public.forms f where f.id = form_id and f.user_id = auth.uid()
));