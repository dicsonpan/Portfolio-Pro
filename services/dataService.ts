import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppData, Experience, Profile, Project, Skill, Education, SiteConfig } from '../types';
import { MOCK_EXPERIENCE, MOCK_PROFILE, MOCK_PROJECTS, MOCK_SKILLS, MOCK_EDUCATION, MOCK_CONFIG, SUPABASE_ANON_KEY, SUPABASE_URL } from '../constants';

const STORAGE_KEY = 'portfolio_data_v2'; // Bumped version

let supabase: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Initialize Local Storage if empty
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const initialData: AppData = {
      profile: MOCK_PROFILE,
      experiences: MOCK_EXPERIENCE,
      education: MOCK_EDUCATION,
      projects: MOCK_PROJECTS,
      skills: MOCK_SKILLS,
      config: MOCK_CONFIG
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }
};

// Helper to get local data
const getLocalData = (): AppData => {
  initStorage();
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { 
    profile: MOCK_PROFILE, 
    experiences: [], 
    education: [], 
    projects: [], 
    skills: [], 
    config: MOCK_CONFIG 
  };
};

// Helper to set local data
const setLocalData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const dataService = {
  // --- Config ---
  async getConfig(): Promise<SiteConfig> {
    if (supabase) {
       const { data } = await supabase.from('config').select('*').single();
       if (data) return data;
    }
    return getLocalData().config;
  },

  async updateConfig(config: SiteConfig): Promise<void> {
    if (supabase) {
      await supabase.from('config').upsert(config); // Assuming single row or ID 1
      return;
    }
    const data = getLocalData();
    data.config = config;
    setLocalData(data);
  },

  // --- Profile ---
  async getProfile(): Promise<Profile> {
    if (supabase) {
      const { data, error } = await supabase.from('profile').select('*').single();
      if (!error && data) return data;
    }
    return getLocalData().profile;
  },

  async updateProfile(profile: Profile): Promise<void> {
    if (supabase) {
      await supabase.from('profile').upsert(profile);
      return;
    }
    const data = getLocalData();
    data.profile = profile;
    setLocalData(data);
  },

  // --- Experience ---
  async getExperiences(): Promise<Experience[]> {
    if (supabase) {
      const { data } = await supabase.from('experiences').select('*').order('start_date', { ascending: false });
      return data || [];
    }
    return getLocalData().experiences.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
  },

  async saveExperience(exp: Experience): Promise<void> {
    if (supabase) {
      await supabase.from('experiences').upsert(exp);
      return;
    }
    const data = getLocalData();
    const index = data.experiences.findIndex(e => e.id === exp.id);
    if (index >= 0) {
      data.experiences[index] = exp;
    } else {
      data.experiences.push(exp);
    }
    setLocalData(data);
  },

  async deleteExperience(id: string): Promise<void> {
    if (supabase) {
      await supabase.from('experiences').delete().eq('id', id);
      return;
    }
    const data = getLocalData();
    data.experiences = data.experiences.filter(e => e.id !== id);
    setLocalData(data);
  },

  // --- Education (New) ---
  async getEducation(): Promise<Education[]> {
    if (supabase) {
      const { data } = await supabase.from('education').select('*').order('start_date', { ascending: false });
      return data || [];
    }
    return getLocalData().education.sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
  },

  async saveEducation(edu: Education): Promise<void> {
    if (supabase) {
      await supabase.from('education').upsert(edu);
      return;
    }
    const data = getLocalData();
    const index = data.education.findIndex(e => e.id === edu.id);
    if (index >= 0) {
      data.education[index] = edu;
    } else {
      data.education.push(edu);
    }
    setLocalData(data);
  },

  async deleteEducation(id: string): Promise<void> {
    if (supabase) {
      await supabase.from('education').delete().eq('id', id);
      return;
    }
    const data = getLocalData();
    data.education = data.education.filter(e => e.id !== id);
    setLocalData(data);
  },

  // --- Projects ---
  async getProjects(): Promise<Project[]> {
    if (supabase) {
      const { data } = await supabase.from('projects').select('*');
      return data || [];
    }
    return getLocalData().projects;
  },

  async saveProject(proj: Project): Promise<void> {
    if (supabase) {
      await supabase.from('projects').upsert(proj);
      return;
    }
    const data = getLocalData();
    const index = data.projects.findIndex(p => p.id === proj.id);
    if (index >= 0) {
      data.projects[index] = proj;
    } else {
      data.projects.push(proj);
    }
    setLocalData(data);
  },

  async deleteProject(id: string): Promise<void> {
    if (supabase) {
      await supabase.from('projects').delete().eq('id', id);
      return;
    }
    const data = getLocalData();
    data.projects = data.projects.filter(p => p.id !== id);
    setLocalData(data);
  },
  
  // --- Skills ---
  async getSkills(): Promise<Skill[]> {
     if (supabase) {
      const { data } = await supabase.from('skills').select('*');
      return data || [];
    }
    return getLocalData().skills;
  },
  
  async saveSkill(skill: Skill): Promise<void> {
    if (supabase) {
      await supabase.from('skills').upsert(skill);
      return;
    }
    const data = getLocalData();
    const index = data.skills.findIndex(s => s.id === skill.id);
    if (index >= 0) {
      data.skills[index] = skill;
    } else {
      data.skills.push(skill);
    }
    setLocalData(data);
  },
  
  async deleteSkill(id: string): Promise<void> {
    if (supabase) {
      await supabase.from('skills').delete().eq('id', id);
      return;
    }
    const data = getLocalData();
    data.skills = data.skills.filter(s => s.id !== id);
    setLocalData(data);
  }
};