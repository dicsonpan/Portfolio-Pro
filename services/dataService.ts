
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppData, Experience, Profile, Project, Skill, Education, SiteConfig, LanguageCode, UserSecrets } from '../types';
import { MOCK_EXPERIENCE, MOCK_PROFILE_EN, MOCK_PROFILE_ZH, MOCK_PROJECTS, MOCK_SKILLS, MOCK_EDUCATION, MOCK_CONFIG, SUPABASE_ANON_KEY, SUPABASE_URL } from '../constants';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'portfolio_data_v5'; // Bumped version

let supabase: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// --- Local Storage Helpers (Fallback) ---
const initStorage = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const initialData: AppData = {
      profiles: [MOCK_PROFILE_EN, MOCK_PROFILE_ZH],
      experiences: MOCK_EXPERIENCE,
      education: MOCK_EDUCATION,
      projects: MOCK_PROJECTS,
      skills: MOCK_SKILLS,
      config: MOCK_CONFIG
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }
};

const getLocalData = (): AppData => {
  initStorage();
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return { profiles: [MOCK_PROFILE_EN], experiences: [], education: [], projects: [], skills: [], config: MOCK_CONFIG };
  return JSON.parse(data) as AppData;
};

const setLocalData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const dataService = {
  // --- Secrets (API Keys) ---
  async getUserSecrets(): Promise<UserSecrets | null> {
    if (supabase) {
       const { data: { user } } = await supabase.auth.getUser();
       if (!user) return null;
       
       const { data, error } = await supabase.from('user_secrets').select('*').eq('user_id', user.id).single();
       if (error && error.code !== 'PGRST116') { // Ignore not found error
         console.error(error);
       }
       return data;
    }
    // Local fallback: read specific keys from localstorage
    return {
      user_id: 'local',
      gemini_api_key: localStorage.getItem('gemini_key') || '',
    };
  },

  async saveUserSecrets(secrets: Partial<UserSecrets>): Promise<void> {
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      // Check if row exists
      const { data: existing } = await supabase.from('user_secrets').select('user_id').eq('user_id', user.id).single();
      
      if (existing) {
        await supabase.from('user_secrets').update(secrets).eq('user_id', user.id);
      } else {
        await supabase.from('user_secrets').insert([{ ...secrets, user_id: user.id }]);
      }
    } else {
      if (secrets.gemini_api_key) localStorage.setItem('gemini_key', secrets.gemini_api_key);
    }
  },

  // --- Config ---
  async getConfig(userId?: string): Promise<SiteConfig> {
    if (supabase) {
       let uid = userId;
       
       // If no ID provided, try getting logged in user (for Admin)
       if (!uid) {
         const { data: { user } } = await supabase.auth.getUser();
         uid = user?.id;
       }

       // If we have a UID (either from arg or auth), fetch specific config
       if (uid) {
         const { data } = await supabase.from('config').select('*').eq('user_id', uid).single();
         if (data) return data;
         return MOCK_CONFIG;
       }
    }
    return getLocalData().config;
  },

  async updateConfig(config: SiteConfig): Promise<void> {
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const { data: existing } = await supabase.from('config').select('id').eq('user_id', user.id).single();
      
      if (existing) {
         await supabase.from('config').update({ ...config, user_id: user.id }).eq('id', existing.id);
      } else {
         await supabase.from('config').insert({ ...config, user_id: user.id });
      }
      return;
    }
    const data = getLocalData();
    data.config = config;
    setLocalData(data);
  },

  // --- Profile ---
  
  // New method: Fetch by Username (or User ID)
  async getProfile(lang: LanguageCode, identifier?: { userId?: string; username?: string }): Promise<Profile | null> {
    if (supabase) {
      let query = supabase.from('profile').select('*').eq('language', lang);

      if (identifier?.userId) {
        query = query.eq('user_id', identifier.userId);
      } else if (identifier?.username) {
        query = query.eq('username', identifier.username);
      } else {
        // Fallback for Admin view: use logged-in user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('user_id', user.id);
        } else {
          // No identifier and no login? return null
          return null;
        }
      }

      const { data } = await query.single();
      return data;
    }
    
    // Local Storage Fallback
    const data = getLocalData();
    // In local mode, we basically ignore username/id for simplicity, 
    // effectively treating the local user as the "only" user.
    return data.profiles.find(p => p.language === lang) || null;
  },

  async updateProfile(profile: Profile): Promise<void> {
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      await supabase.from('profile').upsert({ ...profile, user_id: user.id });
      return;
    }
    const data = getLocalData();
    const index = data.profiles.findIndex(p => p.language === profile.language);
    if (index >= 0) {
      data.profiles[index] = profile;
    } else {
      data.profiles.push(profile);
    }
    setLocalData(data);
  },

  // --- Experience ---
  async getExperiences(lang: LanguageCode, userId?: string): Promise<Experience[]> {
    if (supabase && userId) {
        const { data } = await supabase.from('experiences').select('*').eq('user_id', userId).eq('language', lang).order('start_date', { ascending: false });
        return data || [];
    }
    // If no userId provided in supabase mode, likely Admin asking for own data
    if (supabase && !userId) {
       const { data: { user } } = await supabase.auth.getUser();
       if (user) {
          const { data } = await supabase.from('experiences').select('*').eq('user_id', user.id).eq('language', lang).order('start_date', { ascending: false });
          return data || [];
       }
    }

    return getLocalData().experiences.filter(e => e.language === lang);
  },

  async saveExperience(exp: Experience): Promise<void> {
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      await supabase.from('experiences').upsert({ ...exp, user_id: user.id });
      return;
    }
    const data = getLocalData();
    const index = data.experiences.findIndex(e => e.id === exp.id);
    if (index >= 0) data.experiences[index] = exp;
    else data.experiences.push(exp);
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

  // --- Education ---
  async getEducation(lang: LanguageCode, userId?: string): Promise<Education[]> {
    if (supabase && userId) {
      const { data } = await supabase.from('education').select('*').eq('user_id', userId).eq('language', lang).order('start_date', { ascending: false });
      return data || [];
    }
    if (supabase && !userId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
           const { data } = await supabase.from('education').select('*').eq('user_id', user.id).eq('language', lang).order('start_date', { ascending: false });
           return data || [];
        }
     }
    return getLocalData().education.filter(e => e.language === lang);
  },

  async saveEducation(edu: Education): Promise<void> {
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      await supabase.from('education').upsert({ ...edu, user_id: user.id });
      return;
    }
    const data = getLocalData();
    const index = data.education.findIndex(e => e.id === edu.id);
    if (index >= 0) data.education[index] = edu;
    else data.education.push(edu);
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
  async getProjects(lang: LanguageCode, userId?: string): Promise<Project[]> {
    if (supabase && userId) {
      const { data } = await supabase.from('projects').select('*').eq('user_id', userId).eq('language', lang);
      return data || [];
    }
    if (supabase && !userId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
           const { data } = await supabase.from('projects').select('*').eq('user_id', user.id).eq('language', lang);
           return data || [];
        }
     }
    return getLocalData().projects.filter(p => p.language === lang);
  },

  async saveProject(proj: Project): Promise<void> {
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      await supabase.from('projects').upsert({ ...proj, user_id: user.id });
      return;
    }
    const data = getLocalData();
    const index = data.projects.findIndex(p => p.id === proj.id);
    if (index >= 0) data.projects[index] = proj;
    else data.projects.push(proj);
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
  async getSkills(lang: LanguageCode, userId?: string): Promise<Skill[]> {
     if (supabase && userId) {
        const { data } = await supabase.from('skills').select('*').eq('user_id', userId).eq('language', lang);
        return data || [];
     }
     if (supabase && !userId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
           const { data } = await supabase.from('skills').select('*').eq('user_id', user.id).eq('language', lang);
           return data || [];
        }
     }
    return getLocalData().skills.filter(s => s.language === lang);
  },
  
  async saveSkill(skill: Skill): Promise<void> {
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      await supabase.from('skills').upsert({ ...skill, user_id: user.id });
      return;
    }
    const data = getLocalData();
    const index = data.skills.findIndex(s => s.id === skill.id);
    if (index >= 0) data.skills[index] = skill;
    else data.skills.push(skill);
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
  },

  // --- Assets ---
  async uploadImage(file: File): Promise<string> {
    if (supabase) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
      return data.publicUrl;
    } else {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    }
  }
};
