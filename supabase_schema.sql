-- ==============================================================================
-- Portfolio Pro - Supabase Schema Script
-- 
-- 使用方法:
-- 1. 进入 Supabase Dashboard -> SQL Editor
-- 2. 粘贴此脚本内容
-- 3. 点击 "Run"
-- ==============================================================================

-- 1. Enable UUID extension (用于生成唯一 ID)
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 2. Create Tables (对应 types.ts 中的接口)
-- ==============================================================================

-- Table: profile
create table public.profile (
  id uuid not null default uuid_generate_v4() primary key,
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

-- Table: config (Site Configuration)
create table public.config (
  id uuid not null default uuid_generate_v4() primary key,
  theme text default 'modern',
  primary_color text default '#10b981',
  display_order text[] default '{}',
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: experiences
create table public.experiences (
  id uuid not null default uuid_generate_v4() primary key,
  company text not null,
  role text not null,
  start_date date not null,
  end_date date,
  description text,
  current boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: education
create table public.education (
  id uuid not null default uuid_generate_v4() primary key,
  school text not null,
  degree text not null,
  field text not null,
  start_date date not null,
  end_date date,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: projects
create table public.projects (
  id uuid not null default uuid_generate_v4() primary key,
  title text not null,
  description text,
  image_url text,
  video_url text,
  demo_url text,
  repo_url text,
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Table: skills
create table public.skills (
  id uuid not null default uuid_generate_v4() primary key,
  name text not null,
  category text not null check (category in ('frontend', 'backend', 'design', 'tools', 'languages', 'soft-skills')),
  proficiency integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- ==============================================================================
-- 3. Row Level Security (RLS) Policies
-- 注意: 由于当前 App 没有集成 Auth 登录界面，为了让 Admin 面板能工作，
-- 我们暂时允许 Anon Key 进行增删改查。
-- 生产环境建议集成 Supabase Auth 并限制 Write 权限给 Authenticated 用户。
-- ==============================================================================

-- Enable RLS
alter table public.profile enable row level security;
alter table public.config enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;

-- Policy: Allow full access (Read/Write) for everyone (including Anon)
-- SECURITY WARNING: This makes your DB writable by anyone with your Anon Key.
-- For a real production app, implement Auth and change 'true' to 'auth.role() = ''authenticated''' for insert/update/delete.

create policy "Enable all access for profile" on public.profile for all using (true);
create policy "Enable all access for config" on public.config for all using (true);
create policy "Enable all access for experiences" on public.experiences for all using (true);
create policy "Enable all access for education" on public.education for all using (true);
create policy "Enable all access for projects" on public.projects for all using (true);
create policy "Enable all access for skills" on public.skills for all using (true);

-- ==============================================================================
-- 4. Seed Data (写入初始演示数据)
-- ==============================================================================

-- Profile
insert into public.profile (id, name, title, tagline, bio, avatar_url, email, location, phone, github_url, linkedin_url)
values (
  '123e4567-e89b-12d3-a456-426614174000',
  'Alex Chen', 
  'Product Designer & Developer', 
  'Bridging the gap between code and design.',
  'I craft high-performance web applications with a focus on user experience and scalable architecture. Passionate about React, TypeScript, and clean UI design.',
  'https://picsum.photos/400/400',
  'alex@example.com',
  'San Francisco, CA',
  '+1 (555) 123-4567',
  'https://github.com',
  'https://linkedin.com'
);

-- Config
insert into public.config (theme, primary_color)
values ('modern', '#10b981');

-- Experiences
insert into public.experiences (company, role, start_date, description, current)
values 
('TechFlow Inc.', 'Senior Product Designer', '2021-03-01', 'Leading the design system team. Improved workflow efficiency by 40% through new Figma plugins and React component libraries.', true),
('Creative Digital', 'Frontend Developer', '2019-06-01', 'Collaborated with designers to implement pixel-perfect UIs for e-commerce clients. Migrated legacy jQuery codebases to React.', false);

-- Education
insert into public.education (school, degree, field, start_date, end_date, description)
values
('University of California, Berkeley', 'Bachelor of Science', 'Computer Science & Design', '2015-09-01', '2019-05-30', 'Graduated with Honors. President of the Design Club.');

-- Projects
insert into public.projects (title, description, image_url, demo_url, tags)
values
('E-Commerce Dashboard', 'A comprehensive analytics dashboard for online retailers featuring real-time data visualization.', 'https://picsum.photos/seed/project1/800/600', '#', ARRAY['React', 'D3.js', 'Supabase']),
('TaskFlow', 'Collaborative project management tool with real-time updates and drag-and-drop kanban boards.', 'https://picsum.photos/seed/project2/800/600', '#', ARRAY['TypeScript', 'Node.js', 'Socket.io']);

-- Skills
insert into public.skills (name, category, proficiency)
values
('React', 'frontend', 95),
('Figma', 'design', 90),
('Node.js', 'backend', 80),
('Public Speaking', 'soft-skills', 85);
