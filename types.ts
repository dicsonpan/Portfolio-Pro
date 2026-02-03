
export type LanguageCode = 'en' | 'zh' | 'ja' | 'es';

export interface UserSecrets {
  user_id: string;
  gemini_api_key?: string;
  openai_api_key?: string;
  openai_base_url?: string;
}

export interface Profile {
  id: string;
  user_id?: string;
  username?: string; // Added for public URL access
  language: LanguageCode;
  name: string;
  title: string;
  tagline?: string;
  bio: string;
  avatar_url: string;
  email: string;
  location: string;
  phone?: string;
  website?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
}

export interface Experience {
  id: string;
  user_id?: string;
  language: LanguageCode;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string;
  current: boolean;
}

export interface Education {
  id: string;
  user_id?: string;
  language: LanguageCode;
  school: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string | null;
  description?: string;
}

export interface Project {
  id: string;
  user_id?: string;
  language: LanguageCode;
  title: string;
  description: string;
  image_url: string;
  video_url?: string; // Supports YouTube/Bilibili
  demo_url?: string;
  repo_url?: string;
  tags: string[];
}

export interface Skill {
  id: string;
  user_id?: string;
  language: LanguageCode; 
  name: string;
  category: 'frontend' | 'backend' | 'design' | 'tools' | 'languages' | 'soft-skills';
  proficiency: number;
}

export type ThemeType = 'modern' | 'classic' | 'creative';

export interface SiteConfig {
  user_id?: string;
  theme: ThemeType;
  primary_color: string;
  display_order: string[];
}

export type AppData = {
  profiles: Profile[]; 
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  config: SiteConfig;
}