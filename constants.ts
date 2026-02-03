
import { Profile, Experience, Project, Skill, Education, SiteConfig } from './types';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'zh', label: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', label: '繁體中文', flag: '🇹🇼' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

// --- DEFAULT SITE RESUME (Shown on Root /) ---

export const MOCK_PROFILE_EN: Profile = {
  id: 'site-default',
  username: 'next-folio',
  language: 'en',
  name: 'NextFolio',
  title: 'Next-Gen Portfolio Builder',
  tagline: 'Showcase your future, today.',
  bio: 'I am an intelligent, open-source platform designed to help developers, designers, and creatives showcase their work. Built with React and Supabase, I seamlessly bridge the gap between structured data and stunning visual presentation. I feature a powerful Admin Dashboard and integrated Gemini AI to polish your content.',
  avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
  email: 'hello@nextfolio.dev',
  location: 'Cloud / Worldwide',
  phone: '',
  website: 'https://github.com/dicsonpan/NextFolio',
  github_url: 'https://github.com/dicsonpan/NextFolio',
  linkedin_url: '',
};

export const MOCK_PROFILE_ZH: Profile = {
  id: 'site-default',
  username: 'next-folio',
  language: 'zh',
  name: 'NextFolio',
  title: '下一代作品集构建器',
  tagline: '展现你的未来。',
  bio: '我是一个智能的开源平台，旨在帮助开发者、设计师和创意人士展示他们的作品。我基于 React 和 Supabase 构建，无缝连接了结构化数据与精美的视觉呈现。我内置了强大的后台管理面板，并集成了 Gemini AI 来润色你的简历内容。',
  avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
  email: 'hello@nextfolio.dev',
  location: '云端 / 全球',
  phone: '',
  website: 'https://github.com/dicsonpan/NextFolio',
  github_url: 'https://github.com/dicsonpan/NextFolio',
  linkedin_url: '',
};

export const MOCK_PROFILE_ZH_TW: Profile = {
  id: 'site-default',
  username: 'next-folio',
  language: 'zh-TW',
  name: 'NextFolio',
  title: '次世代作品集建立工具',
  tagline: '展現你的未來，就是現在。',
  bio: '我是一個智能的開源平台，旨在幫助開發者、設計師和創意人士展示他們的作品。我基於 React 和 Supabase 構建，無縫連接了結構化數據與精美的視覺呈現。我內置了強大的後台管理面板，並集成了 Gemini AI 來潤色你的簡歷內容。',
  avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
  email: 'hello@nextfolio.dev',
  location: '雲端 / 全球',
  phone: '',
  website: 'https://github.com/dicsonpan/NextFolio',
  github_url: 'https://github.com/dicsonpan/NextFolio',
  linkedin_url: '',
};

export const MOCK_CONFIG: SiteConfig = {
  theme: 'modern',
  primary_color: '#10b981',
  display_order: ['about', 'projects', 'experience', 'skills', 'education']
};

export const MOCK_EXPERIENCE: Experience[] = [
  {
    id: '1',
    language: 'en',
    company: 'NextFolio',
    role: 'Platform Evolution',
    start_date: '2023-10-01',
    end_date: null,
    description: 'Continuously evolving with new features like AI-powered text polishing, real-time database integration (Supabase), and multi-theme support. Providing a robust solution for personal branding.',
    current: true,
  },
  {
    id: '1-zh',
    language: 'zh',
    company: 'NextFolio',
    role: '平台演进',
    start_date: '2023-10-01',
    end_date: null,
    description: '持续迭代新功能，如 AI 文本润色、实时数据库集成 (Supabase) 和多主题支持。为个人品牌建设提供强大的解决方案。',
    current: true,
  },
  {
    id: '1-zh-tw',
    language: 'zh-TW',
    company: 'NextFolio',
    role: '平台演進',
    start_date: '2023-10-01',
    end_date: null,
    description: '持續迭代新功能，如 AI 文本潤色、實時數據庫集成 (Supabase) 和多主題支持。為個人品牌建設提供強大的解決方案。',
    current: true,
  },
  {
    id: '2',
    language: 'en',
    company: 'Open Source Community',
    role: 'Frontend Architecture',
    start_date: '2023-01-01',
    end_date: '2023-09-30',
    description: 'Designed the core architecture using Vite, React 18, and Tailwind CSS. Implemented a responsive, mobile-first design system with support for dark mode and high performance.',
    current: false,
  },
  {
    id: '2-zh',
    language: 'zh',
    company: '开源社区',
    role: '前端架构设计',
    start_date: '2023-01-01',
    end_date: '2023-09-30',
    description: '使用 Vite, React 18 和 Tailwind CSS 设计核心架构。实现了响应式、移动优先的设计系统，支持深色模式并保持高性能。',
    current: false,
  },
  {
    id: '2-zh-tw',
    language: 'zh-TW',
    company: '開源社區',
    role: '前端架構設計',
    start_date: '2023-01-01',
    end_date: '2023-09-30',
    description: '使用 Vite, React 18 和 Tailwind CSS 設計核心架構。實現了響應式、移動優先的設計系統，支持深色模式並保持高性能。',
    current: false,
  }
];

export const MOCK_EDUCATION: Education[] = [
  {
    id: '1',
    language: 'en',
    school: 'React Ecosystem University',
    degree: 'Master of UI/UX',
    field: 'Modern Web Development',
    start_date: '2022-01-01',
    end_date: '2022-12-31',
    description: 'Specialized in Component-Based Architecture, State Management, and User Centric Design.'
  },
  {
    id: '1-zh',
    language: 'zh',
    school: 'React 生态大学',
    degree: 'UI/UX 硕士',
    field: '现代 Web 开发',
    start_date: '2022-01-01',
    end_date: '2022-12-31',
    description: '专攻组件化架构、状态管理和以用户为中心的设计。'
  },
  {
    id: '1-zh-tw',
    language: 'zh-TW',
    school: 'React 生態大學',
    degree: 'UI/UX 碩士',
    field: '現代 Web 開發',
    start_date: '2022-01-01',
    end_date: '2022-12-31',
    description: '專攻組件化架構、狀態管理和以用戶為中心的設計。'
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    language: 'en',
    title: 'Self-Reflection (This Website)',
    description: 'A recursive project demonstrating my own capabilities. Features include a dynamic Admin Dashboard, instant theme switching, screenshot mode, and Google Gemini AI integration for resume polishing.',
    image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2555&auto=format&fit=crop',
    demo_url: '#',
    video_url: '',
    tags: ['React', 'TypeScript', 'Tailwind', 'Gemini AI'],
  },
  {
    id: '1-zh',
    language: 'zh',
    title: '自我映射 (本网站)',
    description: '一个展示自身能力的递归项目。功能包括动态管理后台、即时主题切换、截图模式以及用于简历润色的 Google Gemini AI 集成。',
    image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2555&auto=format&fit=crop',
    demo_url: '#',
    video_url: '',
    tags: ['React', 'TypeScript', 'Tailwind', 'Gemini AI'],
  },
  {
    id: '1-zh-tw',
    language: 'zh-TW',
    title: '自我映射 (本網站)',
    description: '一個展示自身能力的遞歸項目。功能包括動態管理後台、即時主題切換、截圖模式以及用於簡歷潤色的 Google Gemini AI 集成。',
    image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=2555&auto=format&fit=crop',
    demo_url: '#',
    video_url: '',
    tags: ['React', 'TypeScript', 'Tailwind', 'Gemini AI'],
  },
  {
    id: '2',
    language: 'en',
    title: 'Supabase Integration',
    description: 'A full-stack implementation connecting the frontend to a PostgreSQL database. Handles authentication, row-level security, and real-time data synchronization.',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop',
    demo_url: '#',
    tags: ['PostgreSQL', 'SQL', 'Auth'],
  },
  {
    id: '2-zh',
    language: 'zh',
    title: 'Supabase 集成',
    description: '连接前端与 PostgreSQL 数据库的全栈实现。处理身份验证、行级安全 (RLS) 和实时数据同步。',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop',
    demo_url: '#',
    tags: ['PostgreSQL', 'SQL', 'Auth'],
  },
  {
    id: '2-zh-tw',
    language: 'zh-TW',
    title: 'Supabase 集成',
    description: '連接前端與 PostgreSQL 數據庫的全棧實現。處理身份驗證、行級安全 (RLS) 和實時數據同步。',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop',
    demo_url: '#',
    tags: ['PostgreSQL', 'SQL', 'Auth'],
  }
];

export const MOCK_SKILLS: Skill[] = [
  { id: '1', language: 'en', name: 'React 18', category: 'frontend', proficiency: 100 },
  { id: '2', language: 'en', name: 'TypeScript', category: 'languages', proficiency: 95 },
  { id: '3', language: 'en', name: 'Tailwind CSS', category: 'design', proficiency: 95 },
  { id: '4', language: 'en', name: 'Supabase', category: 'backend', proficiency: 90 },
  { id: '5', language: 'en', name: 'Gemini AI', category: 'tools', proficiency: 85 },
  
  { id: '1-zh', language: 'zh', name: 'React 18', category: 'frontend', proficiency: 100 },
  { id: '2-zh', language: 'zh', name: 'TypeScript', category: 'languages', proficiency: 95 },
  { id: '3-zh', language: 'zh', name: 'Tailwind CSS', category: 'design', proficiency: 95 },
  
  { id: '1-zh-tw', language: 'zh-TW', name: 'React 18', category: 'frontend', proficiency: 100 },
  { id: '2-zh-tw', language: 'zh-TW', name: 'TypeScript', category: 'languages', proficiency: 95 },
  { id: '3-zh-tw', language: 'zh-TW', name: 'Tailwind CSS', category: 'design', proficiency: 95 },
];

const env = (import.meta as any).env || {};

export const SUPABASE_URL = env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || '';
