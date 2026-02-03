import React, { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, Twitter, ExternalLink, GraduationCap, MapPin, Camera, X, Globe, Phone } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Profile, Experience, Project, Skill, Education, SiteConfig } from '../types';
import { Section, Container } from '../components/ui/Layouts';

// --- Theme Style Defintions ---
const getThemeStyles = (theme: string) => {
  switch (theme) {
    case 'classic':
      return {
        bg: 'bg-white text-zinc-900',
        sectionBg: 'bg-zinc-50',
        cardBg: 'bg-white border-b border-zinc-200', // Minimal borders
        textPrimary: 'text-zinc-900',
        textSecondary: 'text-zinc-600',
        accent: 'text-blue-700',
        fontHead: 'font-serif tracking-tight',
        fontBody: 'font-sans',
        radius: 'rounded-none',
        button: 'bg-blue-700 text-white hover:bg-blue-800',
        density: 'compact'
      };
    case 'creative':
      return {
        bg: 'bg-zinc-100 text-zinc-900',
        sectionBg: 'bg-white',
        cardBg: 'bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
        textPrimary: 'text-black',
        textSecondary: 'text-zinc-700',
        accent: 'text-purple-600',
        fontHead: 'font-sans font-black tracking-tighter uppercase',
        fontBody: 'font-mono',
        radius: 'rounded-lg',
        button: 'bg-black text-white hover:-translate-y-1 transition-transform border-2 border-transparent',
        density: 'normal'
      };
    case 'modern':
    default:
      return {
        bg: 'bg-[#09090b] text-zinc-50',
        sectionBg: 'bg-zinc-900/30',
        cardBg: 'bg-zinc-900 border border-zinc-800',
        textPrimary: 'text-white',
        textSecondary: 'text-zinc-400',
        accent: 'text-emerald-400',
        fontHead: 'font-sans font-bold tracking-tight',
        fontBody: 'font-sans',
        radius: 'rounded-2xl',
        button: 'bg-emerald-500 text-white hover:bg-emerald-600',
        density: 'relaxed'
      };
  }
};

const PublicView: React.FC<{ setScreenshotMode: (mode: boolean) => void, isScreenshotMode: boolean }> = ({ setScreenshotMode, isScreenshotMode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [p, e, proj, s, edu, c] = await Promise.all([
          dataService.getProfile(),
          dataService.getExperiences(),
          dataService.getProjects(),
          dataService.getSkills(),
          dataService.getEducation(),
          dataService.getConfig()
        ]);
        setProfile(p);
        setExperiences(e);
        setProjects(proj);
        setSkills(s);
        setEducation(edu);
        setConfig(c);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-500">Loading portfolio...</div>;
  if (!profile || !config) return <div className="min-h-screen flex items-center justify-center text-red-500">Failed to load profile.</div>;

  const styles = getThemeStyles(config.theme);
  
  // Adjust density for screenshot mode
  const containerClass = isScreenshotMode ? 'max-w-2xl px-8 py-8' : '';
  const sectionSpacing = isScreenshotMode ? 'py-8' : 'py-20';

  return (
    <main className={`${styles.bg} ${styles.fontBody} min-h-screen transition-colors duration-300 ${isScreenshotMode ? 'pt-0' : 'pt-16'}`}>
      
      {/* Screenshot Control Fab - Hidden in screenshot mode */}
      {!isScreenshotMode && (
        <button 
          onClick={() => setScreenshotMode(true)}
          className="fixed bottom-8 right-8 z-50 bg-white text-black p-4 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center gap-2 font-bold"
          title="Screenshot Mode"
        >
          <Camera size={20} /> <span className="hidden md:inline">Snapshot Mode</span>
        </button>
      )}

      {/* Exit Screenshot Mode Banner */}
      {isScreenshotMode && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50 cursor-pointer print:hidden" onClick={() => setScreenshotMode(false)}>
           Screenshot/Long-Image Mode Active. <span className="font-bold underline ml-2"><X size={14} className="inline"/> Click here or ESC to Exit</span>
        </div>
      )}

      {/* Header / Hero */}
      <section id="about" className={`relative ${isScreenshotMode ? 'py-10' : 'min-h-[60vh] flex items-center'}`}>
        <Container className={containerClass}>
           <div className={`flex flex-col ${config.theme === 'classic' || isScreenshotMode ? 'md:flex-row md:items-center md:text-left text-left gap-8' : 'text-center items-center'}`}>
             <div className="relative">
               <div className={`w-32 h-32 md:w-40 md:h-40 overflow-hidden shadow-xl ${styles.radius} ${config.theme === 'creative' ? 'border-4 border-black' : ''}`}>
                 <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
               </div>
             </div>
             
             <div className="flex-1">
               <h1 className={`text-4xl md:text-6xl ${styles.fontHead} ${styles.textPrimary} mb-2`}>
                 {profile.name}
               </h1>
               
               <h2 className={`text-xl md:text-2xl ${styles.textSecondary} mb-4 font-medium`}>
                 {profile.title}
               </h2>

               {profile.tagline && (
                  <p className={`text-lg ${styles.accent} mb-4 font-medium`}>{profile.tagline}</p>
               )}
               
               <p className={`${styles.textSecondary} text-base md:text-lg leading-relaxed max-w-2xl mb-6`}>
                 {profile.bio}
               </p>

               {/* Contact Grid */}
               <div className={`flex flex-wrap gap-4 ${config.theme !== 'classic' && !isScreenshotMode ? 'justify-center' : 'justify-start'} text-sm ${styles.textSecondary}`}>
                 <div className="flex items-center gap-1"><MapPin size={16}/> {profile.location}</div>
                 <a href={`mailto:${profile.email}`} className="flex items-center gap-1 hover:underline"><Mail size={16}/> {profile.email}</a>
                 {profile.phone && <div className="flex items-center gap-1"><Phone size={16}/> {profile.phone}</div>}
                 {profile.website && <a href={profile.website} className="flex items-center gap-1 hover:underline"><Globe size={16}/> Website</a>}
                 
                 <div className="w-full h-0 md:w-auto md:h-4 md:border-r border-zinc-500/30 hidden md:block"></div>
                 
                 {profile.github_url && (
                   <a href={profile.github_url} target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                     <Github size={18} />
                   </a>
                 )}
                 {profile.linkedin_url && (
                   <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="hover:opacity-80 transition-opacity">
                     <Linkedin size={18} />
                   </a>
                 )}
               </div>
             </div>
           </div>
        </Container>
      </section>

      {/* Experience Section */}
      <section id="experience" className={`${styles.sectionBg} ${sectionSpacing}`}>
        <Container className={containerClass}>
          <div className={`mb-12 ${config.theme === 'modern' ? 'text-center' : 'text-left'}`}>
            <h2 className={`text-3xl ${styles.fontHead} ${styles.textPrimary} mb-4`}>Work Experience</h2>
            {config.theme === 'modern' && <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full" />}
          </div>

          <div className="space-y-8">
            {experiences.map((exp) => (
              <div key={exp.id} className={`${config.theme === 'modern' ? 'border-l-2 border-zinc-800 pl-6 relative' : 'mb-6'}`}>
                {config.theme === 'modern' && (
                  <span className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full border-2 border-zinc-900 ${exp.current ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                  <h3 className={`text-xl font-bold ${styles.textPrimary}`}>{exp.role}</h3>
                  <span className={`text-sm ${styles.textSecondary} font-mono whitespace-nowrap`}>
                    {exp.start_date} — {exp.end_date || 'Present'}
                  </span>
                </div>
                
                <div className={`${styles.accent} font-semibold mb-2`}>{exp.company}</div>
                
                <p className={`${styles.textSecondary} leading-relaxed text-sm md:text-base`}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

       {/* Education Section (New) */}
       {education.length > 0 && (
        <section id="education" className={`${styles.bg} ${sectionSpacing}`}>
          <Container className={containerClass}>
            <div className={`mb-12 ${config.theme === 'modern' ? 'text-center' : 'text-left'}`}>
              <h2 className={`text-3xl ${styles.fontHead} ${styles.textPrimary} mb-4`}>Education</h2>
              {config.theme === 'modern' && <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full" />}
            </div>

            <div className={`grid grid-cols-1 ${isScreenshotMode ? 'gap-6' : 'md:grid-cols-2 gap-6'}`}>
              {education.map((edu) => (
                <div key={edu.id} className={`${styles.cardBg} p-6 ${styles.radius}`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${config.theme === 'creative' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-900'} shrink-0`}>
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <h3 className={`text-lg font-bold ${styles.textPrimary}`}>{edu.school}</h3>
                      <div className={`${styles.accent} font-medium`}>{edu.degree}, {edu.field}</div>
                      <div className={`text-sm ${styles.textSecondary} mt-1`}>
                        {edu.start_date} — {edu.end_date || 'Present'}
                      </div>
                      {edu.description && (
                        <p className={`text-sm ${styles.textSecondary} mt-3`}>{edu.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Projects Section - Conditional Render based on count */}
      {projects.length > 0 && (
        <section id="projects" className={`${styles.sectionBg} ${sectionSpacing}`}>
           <Container className={containerClass}>
            <div className={`mb-12 ${config.theme === 'modern' ? 'text-center' : 'text-left'}`}>
              <h2 className={`text-3xl ${styles.fontHead} ${styles.textPrimary} mb-4`}>Selected Projects</h2>
               {config.theme === 'modern' && <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full" />}
            </div>

            <div className={`grid grid-cols-1 ${isScreenshotMode ? 'gap-8' : 'md:grid-cols-2 gap-8'}`}>
              {projects.map((project) => (
                <div key={project.id} className={`group relative ${styles.cardBg} ${styles.radius} overflow-hidden ${config.theme === 'creative' ? 'hover:-translate-y-2 transition-transform' : ''}`}>
                  {!isScreenshotMode && (
                    <div className="aspect-video overflow-hidden border-b border-zinc-800/20">
                      <img 
                        src={project.image_url} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                       <h3 className={`text-xl font-bold ${styles.textPrimary}`}>{project.title}</h3>
                       {!isScreenshotMode && (
                         <div className="flex gap-3 opacity-60 hover:opacity-100">
                           {project.repo_url && <a href={project.repo_url} className={styles.textPrimary}><Github size={18} /></a>}
                           {project.demo_url && <a href={project.demo_url} className={styles.textPrimary}><ExternalLink size={18} /></a>}
                         </div>
                       )}
                    </div>
                    
                    <p className={`${styles.textSecondary} mb-4 text-sm line-clamp-3`}>
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className={`text-xs font-medium px-2 py-1 rounded ${config.theme === 'creative' ? 'bg-black text-white border border-black' : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Skills Section */}
      <section id="skills" className={`${styles.bg} ${sectionSpacing}`}>
        <Container className={containerClass}>
          <div className={`mb-12 ${config.theme === 'modern' ? 'text-center' : 'text-left'}`}>
            <h2 className={`text-3xl ${styles.fontHead} ${styles.textPrimary} mb-4`}>Skills & Tools</h2>
             {config.theme === 'modern' && <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full" />}
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
             {skills.map(skill => (
               <div key={skill.id} className={`${styles.cardBg} px-4 py-2 ${styles.radius} flex items-center gap-2`}>
                 <span className={`font-semibold ${styles.textPrimary}`}>{skill.name}</span>
                 {config.theme === 'modern' && (
                    <span className="text-xs text-zinc-500">| {skill.proficiency}%</span>
                 )}
               </div>
             ))}
          </div>
        </Container>
      </section>
      
      {/* Contact Simple */}
      {!isScreenshotMode && (
        <section className={`${styles.sectionBg} py-20 text-center`}>
          <Container>
            <h2 className={`text-3xl ${styles.fontHead} ${styles.textPrimary} mb-6`}>Interested in working together?</h2>
            <a href={`mailto:${profile.email}`} className={`inline-block px-8 py-3 font-bold transition-colors ${styles.button} ${styles.radius}`}>
              Get in Touch
            </a>
          </Container>
        </section>
      )}
    </main>
  );
};

export default PublicView;