import { Profile, Experience, Project, Skill, Education, SiteConfig } from './types';

export const MOCK_PROFILE: Profile = {
  id: '1',
  name: 'Alex Chen',
  title: 'Product Designer & Developer',
  tagline: 'Bridging the gap between code and design.',
  bio: 'I craft high-performance web applications with a focus on user experience and scalable architecture. Passionate about React, TypeScript, and clean UI design.',
  avatar_url: 'https://picsum.photos/400/400',
  email: 'alex@example.com',
  location: 'San Francisco, CA',
  phone: '+1 (555) 123-4567',
  github_url: 'https://github.com',
  linkedin_url: 'https://linkedin.com',
};

export const MOCK_CONFIG: SiteConfig = {
  theme: 'modern',
  primary_color: '#10b981',
  display_order: ['about', 'experience', 'projects', 'education', 'skills']
};

export const MOCK_EXPERIENCE: Experience[] = [
  {
    id: '1',
    company: 'TechFlow Inc.',
    role: 'Senior Product Designer',
    start_date: '2021-03-01',
    end_date: null,
    description: 'Leading the design system team. Improved workflow efficiency by 40% through new Figma plugins and React component libraries.',
    current: true,
  },
  {
    id: '2',
    company: 'Creative Digital',
    role: 'Frontend Developer',
    start_date: '2019-06-01',
    end_date: '2021-02-28',
    description: 'Collaborated with designers to implement pixel-perfect UIs for e-commerce clients. Migrated legacy jQuery codebases to React.',
    current: false,
  },
];

export const MOCK_EDUCATION: Education[] = [
  {
    id: '1',
    school: 'University of California, Berkeley',
    degree: 'Bachelor of Science',
    field: 'Computer Science & Design',
    start_date: '2015-09-01',
    end_date: '2019-05-30',
    description: 'Graduated with Honors. President of the Design Club.'
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Dashboard',
    description: 'A comprehensive analytics dashboard for online retailers featuring real-time data visualization.',
    image_url: 'https://picsum.photos/seed/project1/800/600',
    demo_url: '#',
    tags: ['React', 'D3.js', 'Supabase'],
  },
  {
    id: '2',
    title: 'TaskFlow',
    description: 'Collaborative project management tool with real-time updates and drag-and-drop kanban boards.',
    image_url: 'https://picsum.photos/seed/project2/800/600',
    repo_url: '#',
    tags: ['TypeScript', 'Node.js', 'Socket.io'],
  },
];

export const MOCK_SKILLS: Skill[] = [
  { id: '1', name: 'React', category: 'frontend', proficiency: 95 },
  { id: '2', name: 'Figma', category: 'design', proficiency: 90 },
  { id: '3', name: 'Node.js', category: 'backend', proficiency: 80 },
  { id: '4', name: 'Public Speaking', category: 'soft-skills', proficiency: 85 },
];

export const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';