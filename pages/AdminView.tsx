import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Save, User, Briefcase, FolderGit2, Cpu, GraduationCap, Palette } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Profile, Experience, Project, Skill, Education, SiteConfig, ThemeType } from '../types';
import { Button, Input, TextArea } from '../components/ui/Inputs';
import { Container } from '../components/ui/Layouts';

type Tab = 'profile' | 'education' | 'experience' | 'projects' | 'skills' | 'design';

const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    const [p, e, pr, s, edu, c] = await Promise.all([
      dataService.getProfile(),
      dataService.getExperiences(),
      dataService.getProjects(),
      dataService.getSkills(),
      dataService.getEducation(),
      dataService.getConfig()
    ]);
    setProfile(p);
    setExperiences(e);
    setProjects(pr);
    setSkills(s);
    setEducation(edu);
    setConfig(c);
    setLoading(false);
  };

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

  // --- Education Handlers ---
  const handleAddEducation = () => {
    const newEdu: Education = {
      id: uuidv4(),
      school: 'University',
      degree: 'Degree',
      field: 'Field of Study',
      start_date: '',
      end_date: null,
      description: ''
    };
    setEducation([newEdu, ...education]);
  };

  const handleSaveEducation = async (edu: Education) => {
    setSaving(true);
    await dataService.saveEducation(edu);
    setSaving(false);
  };

  const handleDeleteEducation = async (id: string) => {
    if(!window.confirm('Delete?')) return;
    await dataService.deleteEducation(id);
    setEducation(prev => prev.filter(e => e.id !== id));
  };

  // --- Experience Handlers ---
  const handleSaveExperience = async (exp: Experience) => {
    setSaving(true);
    await dataService.saveExperience(exp);
    const newExps = await dataService.getExperiences();
    setExperiences(newExps);
    setSaving(false);
  };

  const handleDeleteExperience = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    await dataService.deleteExperience(id);
    setExperiences(prev => prev.filter(e => e.id !== id));
  };
  
  const handleAddExperience = () => {
     const newExp: Experience = {
       id: uuidv4(),
       company: 'New Company',
       role: 'New Role',
       start_date: new Date().toISOString().split('T')[0],
       end_date: null,
       description: '',
       current: true
     };
     setExperiences([newExp, ...experiences]);
  };

  const handleSaveProject = async (proj: Project) => {
    setSaving(true);
    await dataService.saveProject(proj);
    setSaving(false);
  };

  const handleAddProject = () => {
    const newProj: Project = {
      id: uuidv4(),
      title: 'New Project',
      description: '',
      image_url: 'https://picsum.photos/seed/new/800/600',
      tags: []
    };
    setProjects([newProj, ...projects]);
  };

  const handleDeleteProject = async (id: string) => {
     if (!window.confirm('Are you sure?')) return;
     await dataService.deleteProject(id);
     setProjects(prev => prev.filter(p => p.id !== id));
  };

  if (loading || !profile || !config) return <div className="pt-24 text-center text-white">Loading Admin...</div>;

  return (
    <main className="pt-24 pb-20 min-h-screen bg-zinc-950">
      <Container>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sticky top-24">
              <h2 className="text-lg font-bold text-white mb-6 px-4">Dashboard</h2>
              <nav className="space-y-2">
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
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-white">Edit Profile</h3>
                  <Button onClick={handleSaveProfile} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                  <Input label="Job Title" value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} />
                  <div className="md:col-span-2">
                     <Input label="One-line Tagline" value={profile.tagline || ''} onChange={e => setProfile({...profile, tagline: e.target.value})} placeholder="e.g. Creative mind looking for new opportunities" />
                  </div>
                  <Input label="Email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
                  <Input label="Phone (Optional)" value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} />
                  <Input label="Location" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} />
                  <Input label="Website" value={profile.website || ''} onChange={e => setProfile({...profile, website: e.target.value})} />
                  
                  <div className="md:col-span-2">
                    <Input label="Avatar URL" value={profile.avatar_url} onChange={e => setProfile({...profile, avatar_url: e.target.value})} />
                  </div>
                   <div className="md:col-span-2">
                    <TextArea label="Bio / Summary" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} />
                  </div>
                  <Input label="GitHub URL" value={profile.github_url || ''} onChange={e => setProfile({...profile, github_url: e.target.value})} />
                  <Input label="LinkedIn URL" value={profile.linkedin_url || ''} onChange={e => setProfile({...profile, linkedin_url: e.target.value})} />
                </div>
              </div>
            )}

            {/* DESIGN TAB (New) */}
            {activeTab === 'design' && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-white">Theme & Layout</h3>
                  <Button onClick={handleSaveConfig} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div 
                    onClick={() => setConfig({...config, theme: 'modern'})}
                    className={`cursor-pointer p-4 rounded-lg border-2 ${config.theme === 'modern' ? 'border-primary bg-zinc-800' : 'border-zinc-700 hover:border-zinc-600'}`}
                  >
                    <div className="h-20 bg-zinc-950 rounded mb-2 border border-zinc-800 flex items-center justify-center text-zinc-500 text-xs">Modern Dark</div>
                    <p className="text-white font-medium text-center">Tech / Modern</p>
                  </div>

                  <div 
                    onClick={() => setConfig({...config, theme: 'classic'})}
                    className={`cursor-pointer p-4 rounded-lg border-2 ${config.theme === 'classic' ? 'border-primary bg-zinc-800' : 'border-zinc-700 hover:border-zinc-600'}`}
                  >
                    <div className="h-20 bg-white rounded mb-2 flex items-center justify-center text-zinc-900 font-serif text-xs">Classic Paper</div>
                    <p className="text-white font-medium text-center">Business / Academic</p>
                  </div>

                  <div 
                    onClick={() => setConfig({...config, theme: 'creative'})}
                    className={`cursor-pointer p-4 rounded-lg border-2 ${config.theme === 'creative' ? 'border-primary bg-zinc-800' : 'border-zinc-700 hover:border-zinc-600'}`}
                  >
                    <div className="h-20 bg-zinc-100 rounded mb-2 border-2 border-black flex items-center justify-center text-black font-black uppercase text-xs">Creative Pop</div>
                    <p className="text-white font-medium text-center">Design / Portfolio</p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-800/50 rounded-lg text-sm text-zinc-400">
                  <p><strong>Note:</strong> The "Screenshot Mode" on the public page will automatically adjust density for whichever theme you select, making it perfect for sharing on WeChat/Social Media.</p>
                </div>
              </div>
            )}

            {/* EDUCATION TAB (New) */}
            {activeTab === 'education' && (
              <div className="space-y-6 animate-fade-in">
                 <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-bold text-white">Education</h3>
                   <Button onClick={handleAddEducation}><Plus size={16} className="inline mr-1" /> Add School</Button>
                </div>
                {education.map((edu, idx) => (
                   <div key={edu.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input label="School / University" value={edu.school} onChange={e => {
                          const newEdu = [...education];
                          newEdu[idx].school = e.target.value;
                          setEducation(newEdu);
                        }} />
                        <Input label="Degree" value={edu.degree} onChange={e => {
                          const newEdu = [...education];
                          newEdu[idx].degree = e.target.value;
                          setEducation(newEdu);
                        }} />
                        <Input label="Field of Study" value={edu.field} onChange={e => {
                          const newEdu = [...education];
                          newEdu[idx].field = e.target.value;
                          setEducation(newEdu);
                        }} />
                        <div className="grid grid-cols-2 gap-4">
                           <Input type="date" label="Start Date" value={edu.start_date} onChange={e => {
                              const newEdu = [...education];
                              newEdu[idx].start_date = e.target.value;
                              setEducation(newEdu);
                            }} />
                             <Input type="date" label="End Date" value={edu.end_date || ''} onChange={e => {
                              const newEdu = [...education];
                              newEdu[idx].end_date = e.target.value;
                              setEducation(newEdu);
                            }} />
                        </div>
                      </div>
                      <TextArea label="Description / Activities" value={edu.description} onChange={e => {
                        const newEdu = [...education];
                        newEdu[idx].description = e.target.value;
                        setEducation(newEdu);
                     }} />
                     <div className="flex justify-end gap-3 mt-4">
                        <Button variant="danger" onClick={() => handleDeleteEducation(edu.id)}><Trash2 size={16}/></Button>
                        <Button variant="secondary" onClick={() => handleSaveEducation(edu)}><Save size={16} className="mr-2 inline"/> Save</Button>
                     </div>
                   </div>
                ))}
              </div>
            )}

            {/* EXPERIENCE TAB */}
            {activeTab === 'experience' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-bold text-white">Experience</h3>
                   <Button onClick={handleAddExperience}><Plus size={16} className="inline mr-1" /> Add Job</Button>
                </div>

                {experiences.map((exp, idx) => (
                  <div key={exp.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input label="Company" value={exp.company} onChange={e => {
                          const newExps = [...experiences];
                          newExps[idx].company = e.target.value;
                          setExperiences(newExps);
                        }} />
                         <Input label="Role" value={exp.role} onChange={e => {
                          const newExps = [...experiences];
                          newExps[idx].role = e.target.value;
                          setExperiences(newExps);
                        }} />
                        <Input type="date" label="Start Date" value={exp.start_date} onChange={e => {
                          const newExps = [...experiences];
                          newExps[idx].start_date = e.target.value;
                          setExperiences(newExps);
                        }} />
                        <div className="flex items-end gap-4">
                           {!exp.current && (
                             <Input type="date" label="End Date" value={exp.end_date || ''} onChange={e => {
                                const newExps = [...experiences];
                                newExps[idx].end_date = e.target.value;
                                setExperiences(newExps);
                              }} />
                           )}
                           <div className="mb-6 flex items-center">
                              <input type="checkbox" id={`curr-${exp.id}`} checked={exp.current} onChange={e => {
                                 const newExps = [...experiences];
                                 newExps[idx].current = e.target.checked;
                                 if(e.target.checked) newExps[idx].end_date = null;
                                 setExperiences(newExps);
                              }} className="mr-2" />
                              <label htmlFor={`curr-${exp.id}`} className="text-zinc-400 text-sm">Currently Working</label>
                           </div>
                        </div>
                     </div>
                     <TextArea label="Description" value={exp.description} onChange={e => {
                        const newExps = [...experiences];
                        newExps[idx].description = e.target.value;
                        setExperiences(newExps);
                     }} />
                     <div className="flex justify-end gap-3 mt-4">
                        <Button variant="danger" onClick={() => handleDeleteExperience(exp.id)}><Trash2 size={16}/></Button>
                        <Button variant="secondary" onClick={() => handleSaveExperience(exp)}><Save size={16} className="mr-2 inline"/> Save</Button>
                     </div>
                  </div>
                ))}
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === 'projects' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-bold text-white">Projects / Portfolio</h3>
                   <Button onClick={handleAddProject}><Plus size={16} className="inline mr-1" /> Add Project</Button>
                </div>

                {projects.map((proj, idx) => (
                  <div key={proj.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Input label="Title" value={proj.title} onChange={e => {
                        const newProjs = [...projects];
                        newProjs[idx].title = e.target.value;
                        setProjects(newProjs);
                      }} />
                       <Input label="Image URL" value={proj.image_url} onChange={e => {
                        const newProjs = [...projects];
                        newProjs[idx].image_url = e.target.value;
                        setProjects(newProjs);
                      }} />
                      <Input label="Demo URL" value={proj.demo_url || ''} onChange={e => {
                        const newProjs = [...projects];
                        newProjs[idx].demo_url = e.target.value;
                        setProjects(newProjs);
                      }} />
                       <Input label="Repo URL" value={proj.repo_url || ''} onChange={e => {
                        const newProjs = [...projects];
                        newProjs[idx].repo_url = e.target.value;
                        setProjects(newProjs);
                      }} />
                    </div>
                     <Input label="Tags (comma separated)" value={proj.tags.join(', ')} onChange={e => {
                        const newProjs = [...projects];
                        newProjs[idx].tags = e.target.value.split(',').map(t => t.trim());
                        setProjects(newProjs);
                      }} />
                    <TextArea label="Description" value={proj.description} onChange={e => {
                        const newProjs = [...projects];
                        newProjs[idx].description = e.target.value;
                        setProjects(newProjs);
                     }} />
                     <div className="flex justify-end gap-3 mt-4">
                        <Button variant="danger" onClick={() => handleDeleteProject(proj.id)}><Trash2 size={16}/></Button>
                        <Button variant="secondary" onClick={() => handleSaveProject(proj)}><Save size={16} className="mr-2 inline"/> Save</Button>
                     </div>
                  </div>
                ))}
              </div>
            )}

            {/* SKILLS TAB */}
            {activeTab === 'skills' && (
               <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500 animate-fade-in">
                 <p>Skills management is similar to Projects/Experience. <br/>(Simulated for brevity in this demo)</p>
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