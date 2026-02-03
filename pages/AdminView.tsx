
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Save, User, Briefcase, FolderGit2, Cpu, GraduationCap, Palette, Sparkles, Wand2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { aiService } from '../services/aiService';
import { Profile, Experience, Project, Skill, Education, SiteConfig, ThemeType, LanguageCode } from '../types';
import { Button, Input, TextArea, FileUpload } from '../components/ui/Inputs';
import { Container } from '../components/ui/Layouts';
import { SUPPORTED_LANGUAGES, MOCK_PROFILE_EN } from '../constants';

type Tab = 'profile' | 'education' | 'experience' | 'projects' | 'skills' | 'design' | 'settings';

const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [lang, setLang] = useState<LanguageCode>('en');
  
  // Data State
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [geminiKey, setGeminiKey] = useState('');
  const [aiLoading, setAiLoading] = useState<string | null>(null); // holds the field ID being polished

  useEffect(() => {
    loadAll(lang);
    loadSecrets();
  }, [lang]);

  const loadSecrets = async () => {
     const secrets = await dataService.getUserSecrets();
     if (secrets && secrets.gemini_api_key) {
        setGeminiKey(secrets.gemini_api_key);
     }
  };

  const loadAll = async (language: LanguageCode) => {
    setLoading(true);
    const [p, e, pr, s, edu, c] = await Promise.all([
      dataService.getProfile(language),
      dataService.getExperiences(language),
      dataService.getProjects(language),
      dataService.getSkills(language),
      dataService.getEducation(language),
      dataService.getConfig()
    ]);
    
    // Handle case where profile doesn't exist for this language
    if (!p && language !== 'en') {
        const confirmCopy = window.confirm(`No profile found for ${language}. Create one based on English?`);
        if (confirmCopy) {
             // Fetch base English profile to copy
             const baseProfile = await dataService.getProfile('en') || MOCK_PROFILE_EN;
             const newProfile = { ...baseProfile, id: uuidv4(), language };
             setProfile(newProfile);
        } else {
             // Fallback empty
             setProfile({ ...MOCK_PROFILE_EN, id: uuidv4(), language, name: '', bio: '' });
        }
    } else {
        setProfile(p);
    }
    
    setExperiences(e);
    setProjects(pr);
    setSkills(s);
    setEducation(edu);
    setConfig(c);
    setLoading(false);
  };

  // --- AI Helpers ---
  const saveGeminiKey = async (key: string) => {
    setGeminiKey(key);
    // Debounce or save on blur ideal, but simple here
    await dataService.saveUserSecrets({ gemini_api_key: key });
  };

  const handleAIPolish = async (text: string, fieldId: string, onUpdate: (newText: string) => void) => {
    if (!geminiKey) {
      alert("Please enter your Gemini API Key in the 'Settings' tab first.");
      setActiveTab('settings');
      return;
    }
    setAiLoading(fieldId);
    try {
      const polished = await aiService.polishText(geminiKey, text);
      onUpdate(polished);
    } catch (e) {
      alert("AI Polish failed. Check console or API Key.");
    } finally {
      setAiLoading(null);
    }
  };

  const AIPolishButton = ({ text, fieldId, onUpdate }: { text: string, fieldId: string, onUpdate: (s: string) => void }) => (
    <button
      onClick={() => handleAIPolish(text, fieldId, onUpdate)}
      disabled={!!aiLoading}
      className="text-xs flex items-center gap-1 text-primary hover:text-emerald-400 disabled:opacity-50"
      title="Polish with Gemini AI"
    >
      {aiLoading === fieldId ? <Wand2 className="animate-spin" size={12}/> : <Sparkles size={12}/>}
      {aiLoading === fieldId ? 'Polishing...' : 'AI Polish'}
    </button>
  );

  // --- Actions ---
  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    await dataService.updateProfile(profile);
    setSaving(false);
    alert('Profile updated!');
  };

  const handleSaveConfig = async () => {
    if (!config) return;
    setSaving(true);
    await dataService.updateConfig(config);
    setSaving(false);
    alert('Design settings updated!');
  };

  const handleUploadImage = async (file: File) => {
    return await dataService.uploadImage(file);
  };

  // --- Sub-Entity Handlers ---
  const handleAddEntity = (type: 'edu' | 'exp' | 'proj') => {
      if (type === 'edu') {
          setEducation([{ id: uuidv4(), language: lang, school: 'New School', degree: '', field: '', start_date: '', end_date: null, description: '' }, ...education]);
      } else if (type === 'exp') {
          setExperiences([{ id: uuidv4(), language: lang, company: 'New Company', role: 'Role', start_date: '', end_date: null, description: '', current: true }, ...experiences]);
      } else if (type === 'proj') {
          setProjects([{ id: uuidv4(), language: lang, title: 'New Project', description: '', image_url: '', tags: [] }, ...projects]);
      }
  };

  const handleSaveEntity = async (type: 'edu' | 'exp' | 'proj', item: any) => {
     setSaving(true);
     if (type === 'edu') await dataService.saveEducation(item);
     if (type === 'exp') await dataService.saveExperience(item);
     if (type === 'proj') await dataService.saveProject(item);
     setSaving(false);
  };

  const handleDeleteEntity = async (type: 'edu' | 'exp' | 'proj', id: string) => {
     if(!window.confirm('Delete this item?')) return;
     if (type === 'edu') {
         await dataService.deleteEducation(id);
         setEducation(prev => prev.filter(e => e.id !== id));
     }
     if (type === 'exp') {
         await dataService.deleteExperience(id);
         setExperiences(prev => prev.filter(e => e.id !== id));
     }
     if (type === 'proj') {
         await dataService.deleteProject(id);
         setProjects(prev => prev.filter(e => e.id !== id));
     }
  };

  if (loading) return <div className="pt-24 text-center text-white">Loading Admin...</div>;

  return (
    <main className="pt-24 pb-20 min-h-screen bg-zinc-950">
      <Container>
        {/* Global Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
           <div className="flex items-center gap-4">
               <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                {SUPPORTED_LANGUAGES.map(l => (
                    <button
                        key={l.code}
                        onClick={() => setLang(l.code as LanguageCode)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${lang === l.code ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        {l.flag} {l.label}
                    </button>
                ))}
              </div>
              <Button variant="ghost" onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? 'bg-zinc-800 text-white' : ''}>
                 Settings
              </Button>
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sticky top-24 space-y-2">
                <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                  <User size={18} /> Profile
                </button>
                <button onClick={() => setActiveTab('design')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'design' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                  <Palette size={18} /> Design & Layout
                </button>
                <button onClick={() => setActiveTab('education')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'education' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                  <GraduationCap size={18} /> Education
                </button>
                <button onClick={() => setActiveTab('experience')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'experience' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                  <Briefcase size={18} /> Experience
                </button>
                <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'projects' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                  <FolderGit2 size={18} /> Projects
                </button>
                <button onClick={() => setActiveTab('skills')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'skills' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                  <Cpu size={18} /> Skills
                </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            
            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
               <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 animate-fade-in">
                  <h3 className="text-2xl font-bold text-white mb-6">Global Settings</h3>
                  
                  <div className="mb-8">
                     <h4 className="text-lg font-medium text-white mb-2 flex items-center gap-2"><Sparkles size={18} className="text-purple-400"/> AI Configuration</h4>
                     <p className="text-sm text-zinc-400 mb-4">Enter your Google Gemini API Key to enable AI resume polishing features.</p>
                     <Input 
                        label="Gemini API Key" 
                        type="password" 
                        value={geminiKey} 
                        onChange={(e) => saveGeminiKey(e.target.value)} 
                        placeholder="AIzaSy..."
                     />
                     <div className="text-xs text-zinc-500">Key is encrypted and stored securely in your private database.</div>
                  </div>
               </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && profile && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-white">Edit Profile ({lang.toUpperCase()})</h3>
                  <Button onClick={handleSaveProfile} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUpload 
                     label="Avatar Image" 
                     value={profile.avatar_url} 
                     onUpload={(url) => setProfile({...profile, avatar_url: url})} 
                     onFileSelect={handleUploadImage}
                  />
                  
                  <div className="space-y-4">
                     <Input label="Username (URL Slug)" value={profile.username || ''} onChange={e => setProfile({...profile, username: e.target.value})} placeholder="e.g. dicsonpan" />
                     <Input label="Full Name" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                     <Input label="Job Title" value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} />
                     <Input label="One-line Tagline" value={profile.tagline || ''} onChange={e => setProfile({...profile, tagline: e.target.value})} />
                  </div>

                  <div className="md:col-span-2">
                    <TextArea 
                        label="Bio / Summary" 
                        value={profile.bio} 
                        onChange={e => setProfile({...profile, bio: e.target.value})}
                        extraAction={<AIPolishButton text={profile.bio} fieldId="bio" onUpdate={s => setProfile({...profile, bio: s})} />}
                    />
                  </div>

                  <Input label="Email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
                  <Input label="Phone" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} />
                  <Input label="Location" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} />
                  <Input label="Website" value={profile.website || ''} onChange={e => setProfile({...profile, website: e.target.value})} />
                  <Input label="GitHub URL" value={profile.github_url || ''} onChange={e => setProfile({...profile, github_url: e.target.value})} />
                  <Input label="LinkedIn URL" value={profile.linkedin_url || ''} onChange={e => setProfile({...profile, linkedin_url: e.target.value})} />
                </div>
              </div>
            )}

            {/* DESIGN TAB */}
            {activeTab === 'design' && config && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-white">Theme & Layout</h3>
                  <Button onClick={handleSaveConfig} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                   {['modern', 'classic', 'creative'].map(t => (
                       <div 
                        key={t}
                        onClick={() => setConfig({...config, theme: t as ThemeType})}
                        className={`cursor-pointer p-4 rounded-lg border-2 ${config.theme === t ? 'border-primary bg-zinc-800' : 'border-zinc-700 hover:border-zinc-600'}`}
                      >
                         <div className={`h-20 rounded mb-2 flex items-center justify-center text-xs font-bold 
                            ${t === 'modern' ? 'bg-zinc-950 border border-zinc-800 text-zinc-500' : ''}
                            ${t === 'classic' ? 'bg-white text-zinc-900 font-serif' : ''}
                            ${t === 'creative' ? 'bg-zinc-100 border-2 border-black text-black' : ''}
                         `}>
                           {t.toUpperCase()}
                         </div>
                         <p className="text-white font-medium text-center capitalize">{t}</p>
                      </div>
                   ))}
                </div>
              </div>
            )}

            {/* EDUCATION */}
            {activeTab === 'education' && (
              <div className="space-y-6 animate-fade-in">
                 <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-bold text-white">Education ({lang.toUpperCase()})</h3>
                   <Button onClick={() => handleAddEntity('edu')}><Plus size={16} className="inline mr-1" /> Add</Button>
                </div>
                {education.map((edu, idx) => (
                   <div key={edu.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input label="School" value={edu.school} onChange={e => {
                          const n = [...education]; n[idx].school = e.target.value; setEducation(n);
                        }} />
                        <Input label="Degree" value={edu.degree} onChange={e => {
                          const n = [...education]; n[idx].degree = e.target.value; setEducation(n);
                        }} />
                        <Input label="Field" value={edu.field} onChange={e => {
                          const n = [...education]; n[idx].field = e.target.value; setEducation(n);
                        }} />
                        <div className="grid grid-cols-2 gap-4">
                           <Input type="date" label="Start" value={edu.start_date} onChange={e => {
                              const n = [...education]; n[idx].start_date = e.target.value; setEducation(n);
                            }} />
                             <Input type="date" label="End" value={edu.end_date || ''} onChange={e => {
                              const n = [...education]; n[idx].end_date = e.target.value; setEducation(n);
                            }} />
                        </div>
                      </div>
                      <TextArea 
                          label="Description" 
                          value={edu.description || ''} 
                          onChange={e => { const n = [...education]; n[idx].description = e.target.value; setEducation(n); }} 
                          extraAction={<AIPolishButton text={edu.description || ''} fieldId={`edu-${edu.id}`} onUpdate={s => { const n = [...education]; n[idx].description = s; setEducation(n); }} />}
                      />
                     <div className="flex justify-end gap-3 mt-4">
                        <Button variant="danger" onClick={() => handleDeleteEntity('edu', edu.id)}><Trash2 size={16}/></Button>
                        <Button variant="secondary" onClick={() => handleSaveEntity('edu', edu)}><Save size={16} className="mr-2 inline"/> Save</Button>
                     </div>
                   </div>
                ))}
              </div>
            )}

            {/* EXPERIENCE */}
            {activeTab === 'experience' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-bold text-white">Experience ({lang.toUpperCase()})</h3>
                   <Button onClick={() => handleAddEntity('exp')}><Plus size={16} className="inline mr-1" /> Add</Button>
                </div>

                {experiences.map((exp, idx) => (
                  <div key={exp.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input label="Company" value={exp.company} onChange={e => { const n = [...experiences]; n[idx].company = e.target.value; setExperiences(n); }} />
                        <Input label="Role" value={exp.role} onChange={e => { const n = [...experiences]; n[idx].role = e.target.value; setExperiences(n); }} />
                        <Input type="date" label="Start Date" value={exp.start_date} onChange={e => { const n = [...experiences]; n[idx].start_date = e.target.value; setExperiences(n); }} />
                        <div className="flex items-end gap-4">
                           {!exp.current && (
                             <Input type="date" label="End Date" value={exp.end_date || ''} onChange={e => { const n = [...experiences]; n[idx].end_date = e.target.value; setExperiences(n); }} />
                           )}
                           <div className="mb-6 flex items-center">
                              <input type="checkbox" checked={exp.current} onChange={e => {
                                 const n = [...experiences]; n[idx].current = e.target.checked;
                                 if(e.target.checked) n[idx].end_date = null; setExperiences(n);
                              }} className="mr-2" />
                              <label className="text-zinc-400 text-sm">Present</label>
                           </div>
                        </div>
                     </div>
                     <TextArea 
                        label="Description" 
                        value={exp.description} 
                        onChange={e => { const n = [...experiences]; n[idx].description = e.target.value; setExperiences(n); }} 
                        extraAction={<AIPolishButton text={exp.description} fieldId={`exp-${exp.id}`} onUpdate={s => { const n = [...experiences]; n[idx].description = s; setExperiences(n); }} />}
                     />
                     <div className="flex justify-end gap-3 mt-4">
                        <Button variant="danger" onClick={() => handleDeleteEntity('exp', exp.id)}><Trash2 size={16}/></Button>
                        <Button variant="secondary" onClick={() => handleSaveEntity('exp', exp)}><Save size={16} className="mr-2 inline"/> Save</Button>
                     </div>
                  </div>
                ))}
              </div>
            )}

            {/* PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-bold text-white">Projects ({lang.toUpperCase()})</h3>
                   <Button onClick={() => handleAddEntity('proj')}><Plus size={16} className="inline mr-1" /> Add</Button>
                </div>

                {projects.map((proj, idx) => (
                  <div key={proj.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Input label="Title" value={proj.title} onChange={e => { const n = [...projects]; n[idx].title = e.target.value; setProjects(n); }} />
                      
                      <Input label="Demo URL" value={proj.demo_url || ''} onChange={e => { const n = [...projects]; n[idx].demo_url = e.target.value; setProjects(n); }} />
                      <Input label="Video URL (YouTube/Bilibili)" value={proj.video_url || ''} onChange={e => { const n = [...projects]; n[idx].video_url = e.target.value; setProjects(n); }} placeholder="https://youtube.com/..." />
                      <Input label="Repo URL" value={proj.repo_url || ''} onChange={e => { const n = [...projects]; n[idx].repo_url = e.target.value; setProjects(n); }} />
                    </div>
                     <FileUpload 
                         label="Project Image" 
                         value={proj.image_url} 
                         onUpload={(url) => { const n = [...projects]; n[idx].image_url = url; setProjects(n); }}
                         onFileSelect={handleUploadImage}
                      />
                     <Input label="Tags (comma separated)" value={proj.tags.join(', ')} onChange={e => { const n = [...projects]; n[idx].tags = e.target.value.split(',').map(t => t.trim()); setProjects(n); }} />
                    <TextArea 
                        label="Description" 
                        value={proj.description} 
                        onChange={e => { const n = [...projects]; n[idx].description = e.target.value; setProjects(n); }} 
                        extraAction={<AIPolishButton text={proj.description} fieldId={`proj-${proj.id}`} onUpdate={s => { const n = [...projects]; n[idx].description = s; setProjects(n); }} />}
                    />
                     <div className="flex justify-end gap-3 mt-4">
                        <Button variant="danger" onClick={() => handleDeleteEntity('proj', proj.id)}><Trash2 size={16}/></Button>
                        <Button variant="secondary" onClick={() => handleSaveEntity('proj', proj)}><Save size={16} className="mr-2 inline"/> Save</Button>
                     </div>
                  </div>
                ))}
              </div>
            )}

            {/* SKILLS */}
            {activeTab === 'skills' && (
               <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500 animate-fade-in">
                 <p>Skills are global for {lang.toUpperCase()}. <br/>(Simulated for brevity in this demo)</p>
                 <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    {skills.map(s => (
                      <span key={s.id} className="bg-zinc-800 px-3 py-1 rounded-full text-zinc-300">{s.name} ({s.proficiency}%)</span>
                    ))}
                 </div>
               </div>
            )}

          </div>
        </div>
      </Container>
    </main>
  );
};

export default AdminView;