
-- ==============================================================================
-- NextFolio - Supabase Schema Script (v4.0 - With Username & Multi-language)
-- ==============================================================================
-- ⚠️ WARNING: running this script will DELETE ALL DATA in the custom tables.
-- It does NOT delete the registered users in Authentication (auth.users).

-- 1. Clean up existing structures
drop table if exists public.skills cascade;
drop table if exists public.projects cascade;
drop table if exists public.education cascade;
drop table if exists public.experiences cascade;
drop table if exists public.config cascade;
drop table if exists public.profile cascade;
drop table if exists public.user_secrets cascade;

-- Clean up storage policies
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Auth Upload" on storage.objects;
drop policy if exists "Public Upload" on storage.objects;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Create Tables

-- User Secrets Table (For API Keys) - Private to user
create table public.user_secrets (
  user_id uuid references auth.users not null primary key,
  gemini_api_key text,
  openai_api_key text,
  openai_base_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Profile Table
create table public.profile (
  id uuid not null default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  username text unique, -- Added username for pretty URLs
  language text default 'en',
  name text not null,
  title text,
  tagline text,
  bio text,
  avatar_url text,
  email text,
  location text,
  phone text,
  website text,
  github_url text,
  linkedin_url text,
  twitter_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Config Table
create table public.config (
  id uuid not null default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  theme text default 'modern',
  primary_color text default '#10b981',
  display_order text[] default '{}',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Experiences Table
create table public.experiences (
  id uuid not null default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  language text default 'en',
  company text not null,
  role text not null,
  start_date date not null,
  end_date date,
  description text,
  current boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Education Table
create table public.education (
  id uuid not null default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  language text default 'en',
  school text not null,
  degree text not null,
  field text not null,
  start_date date not null,
  end_date date,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Projects Table
create table public.projects (
  id uuid not null default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  language text default 'en',
  title text not null,
  description text,
  image_url text,
  video_url text,
  demo_url text,
  repo_url text,
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Skills Table
create table public.skills (
  id uuid not null default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  language text default 'en',
  name text not null,
  category text not null check (category in ('frontend', 'backend', 'design', 'tools', 'languages', 'soft-skills')),
  proficiency integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Storage Buckets Setup
insert into storage.buckets (id, name, public) values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

-- 4. Enable Row Level Security (RLS)
alter table public.user_secrets enable row level security;
alter table public.profile enable row level security;
alter table public.config enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;

-- 5. Create RLS Policies

-- Secrets
create policy "Users can manage their own secrets" on public.user_secrets
  for all using (auth.uid() = user_id);

-- Profile
create policy "Public read profiles" on public.profile for select using (true);
create policy "Owner manage profiles" on public.profile for all using (auth.uid() = user_id);

-- Config
create policy "Public read config" on public.config for select using (true);
create policy "Owner manage config" on public.config for all using (auth.uid() = user_id);

-- Experiences
create policy "Public read experiences" on public.experiences for select using (true);
create policy "Owner manage experiences" on public.experiences for all using (auth.uid() = user_id);

-- Education
create policy "Public read education" on public.education for select using (true);
create policy "Owner manage education" on public.education for all using (auth.uid() = user_id);

-- Projects
create policy "Public read projects" on public.projects for select using (true);
create policy "Owner manage projects" on public.projects for all using (auth.uid() = user_id);

-- Skills
create policy "Public read skills" on public.skills for select using (true);
create policy "Owner manage skills" on public.skills for all using (auth.uid() = user_id);

-- Storage Policies
create policy "Public Access" on storage.objects 
for select using ( bucket_id = 'portfolio-assets' );

create policy "Auth Upload" on storage.objects 
for insert with check ( bucket_id = 'portfolio-assets' and auth.role() = 'authenticated' );
