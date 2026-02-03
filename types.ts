export interface Profile {
  id: string;
  name: string;
  title: string;
  tagline?: string; // One sentence pitch
  bio: string;
  avatar_url: string;
  email: string;
  location: string;
  phone?: string; // Added for non-tech resumes
  website?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null; // null means "Present"
  description: string;
  current: boolean;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string | null;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  video_url?: string;
  demo_url?: string;
  repo_url?: string;
  tags: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'design' | 'tools' | 'languages' | 'soft-skills'; // Added general categories
  proficiency: number; // 0-100
}

export type ThemeType = 'modern' | 'classic' | 'creative';

export interface SiteConfig {
  theme: ThemeType;
  primary_color: string; // Hex code
  display_order: string[]; // Future use for reordering sections
}

// Union type for all data that can be fetched
export type AppData = {
  profile: Profile;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  config: SiteConfig;
}