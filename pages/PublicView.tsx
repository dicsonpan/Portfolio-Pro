
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Github, Linkedin, Mail, PlayCircle, ExternalLink, GraduationCap, MapPin, Camera, X, Globe, Phone, AlertCircle } from 'lucide-react';
import { dataService } from '../services/dataService';
import { Profile, Experience, Project, Skill, Education, SiteConfig, LanguageCode } from '../types';
import { Section, Container } from '../components/ui/Layouts';
import { SUPPORTED_LANGUAGES, MOCK_PROFILE_EN, MOCK_PROFILE_ZH, MOCK_PROFILE_ZH_TW, MOCK_EXPERIENCE, MOCK_PROJECTS, MOCK_SKILLS, MOCK_EDUCATION, MOCK_CONFIG } from '../constants';

const getThemeStyles = (theme: string) => {
  switch (theme) {
    case 'classic':
      return {
        bg: 'bg-white text-zinc-900',
        sectionBg: 'bg-zinc-50',
        cardBg: 'bg-white border-b border-zinc-200', 
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

const VideoEmbed: React.FC<{ url: string }> = ({ url }) => {
  let embedUrl = null;
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('youtu.be/')[1];
    if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes('bilibili.com')) {
    const bvid = url.match(/BV[a-zA-Z0-9]+/)?.[0];
    if (bvid) embedUrl = `https://player.bilibili.com/player.html?bvid=${bvid}&high_quality=1&danmaku=0`;
  }

  if (embedUrl) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-zinc-800 bg-black">
        <iframe 
          src={embedUrl} 
          className="absolute top-0 left-0 w-full h-full" 
          frameBorder="0" 
          allowFullScreen 
          title="Video"
        />
      </div>
    );
  }
  
  return (
    <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline mt-2">
      <PlayCircle size={16} /> Watch Video
    </a>
  );
};

const PublicView: React.FC<{ setScreenshotMode: (mode: boolean) => void, isScreenshotMode: boolean }> = ({ setScreenshotMode, isScreenshotMode }) => {
  const { username } = useParams<{ username: string }>();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<LanguageCode>('en');

  useEffect(() => {
    loadData(lang);
  }, [lang, username]);

  const loadData = async (language: LanguageCode) => {
    setLoading(true);
    try {
      let targetProfile: Profile | null = null;
      let isMockFallback = false;

      // 1. Determine which profile to fetch
      if (username) {
        // Explicit user path: /p/dicsonpan
        targetProfile = await dataService.getProfile(language, { username });
      } else {
        // Root path: /
        // STRATEGY: Try to fetch the "official" user (username='next-folio') from DB first.
        // If not found (e.g., fresh install), fall back to static MOCK constants.
        targetProfile = await dataService.getProfile(language, { username: 'next-folio' });
        
        if (!targetProfile) {
          isMockFallback = true;
          // Load Mock Data directly
          let defaultProfile;
          if (language === 'zh') defaultProfile = MOCK_PROFILE_ZH;
          else if (language === 'zh-TW') defaultProfile = MOCK_PROFILE_ZH_TW;
          else defaultProfile = MOCK_PROFILE_EN;

          setProfile(defaultProfile);
          setExperiences(MOCK_EXPERIENCE.filter(e => e.language === language));
          setProjects(MOCK_PROJECTS.filter(p => p.language === language));
          setSkills(MOCK_SKILLS.filter(s => s.language === language));
          setEducation(MOCK_EDUCATION.filter(e => e.language === language));
          setConfig(MOCK_CONFIG);
        }
      }

      // 2. If we found a real profile (either via /p/username or the official root user)
      if (targetProfile && !isMockFallback) {
        setProfile(targetProfile);
        
        if (targetProfile.user_id) {
          const [e, proj, s, edu, c] = await Promise.all([
            dataService.getExperiences(language, targetProfile.user_id),
            dataService.getProjects(language, targetProfile.user_id),
            dataService.getSkills(language, targetProfile.user_id),
            dataService.getEducation(language, targetProfile.user_id),
            dataService.getConfig(targetProfile.user_id)
          ]);
          setExperiences(e);
          setProjects(proj);
          setSkills(s);
          setEducation(edu);
          setConfig(c);
        }
      }

    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-500">Loading...</div>;

  // Not Found State
  if (!profile) {
    return (
       <div className="min-h-screen flex flex-col items-center justify-center text-zinc-400 gap-4">
         <AlertCircle size={48} className="text-red-500"/>
         <p className="text-lg">User <strong>{username || 'next-folio'}</strong> not found.</p>
         <Link to="/" className="text-primary hover:underline">Go Home</Link>
       </div>
    );
  }

  // If we have data, we render the portfolio
  if (!config) return null; 

  const styles = getThemeStyles(config.theme);
  const containerClass = isScreenshotMode ? 'max-w-2xl px-8 py-8' : '';
  const sectionSpacing = isScreenshotMode ? 'py-8' : 'py-20';

  return (
    <main className={`${styles.bg} ${styles.fontBody} min-h-screen transition-colors duration-300 ${isScreenshotMode ? 'pt-0' : 'pt-16'}`}>
      
      {/* Language Switcher & Controls */}
      {!isScreenshotMode && (
        <div className="fixed top-20 right-8 z-40 flex flex-col gap-3">
           <div className="bg-zinc-900/90 backdrop-blur border border-zinc-800 rounded-lg p-1 shadow-lg flex flex-col">
              {SUPPORTED_LANGUAGES.map(l => (
                <button 
                  key={l.code} 
                  onClick={() => setLang(l.code as LanguageCode)}
                  className={`px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${lang === l.code ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  <span>{l.flag}</span> 
                  <span className="hidden md:inline">{l.label}</span>
                </button>
              ))}
           </div>

           <button 
            onClick={() => setScreenshotMode(true)}
            className="bg-white text-black p-3 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center justify-center"
            title="Snapshot Mode"
          >
            <Camera size={20} />
          </button>
        </div>
      )}

      {isScreenshotMode && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50 cursor-pointer print:hidden" onClick={() => setScreenshotMode(false)}>
           Screenshot/Long-Image Mode Active. <span className="font-bold underline ml-2"><X size={14} className="inline"/> Exit</span>
        </div>
      )}

      {/* Hero */}
      <section id="about" className={`relative ${isScreenshotMode ? 'py-10' : 'min-h-[60vh] flex items-center'}`}>
        <Container className={containerClass}>
           <div className={`flex flex-col ${config.theme === 'classic' || isScreenshotMode ? 'md:flex-row md:items-center md:text-left text-left gap-8' : 'text-center items-center'}`}>
             <div className="relative flex-shrink-0">
               <div className={`w-32 h-32 md:w-40 md:h-40 overflow-hidden shadow-xl ${styles.radius} ${config.theme === 'creative' ? 'border-4 border-black' : ''}`}>
                 <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
               </div>
             </div>
             
             <div className="flex-1">
               <h1 className={`text-4xl md:text-6xl ${styles.fontHead} ${styles.textPrimary} mb-2`}>
                 {profile.name}
               </h1>
               <h2 className={`text-xl md:text-2xl ${styles.textSecondary} mb-4 font-medium`}>{profile.title}</h2>
               {profile.tagline && <p className={`text-lg ${styles.accent} mb-4 font-medium`}>{profile.tagline}</p>}
               <p className={`${styles.textSecondary} text-base md:text-lg leading-relaxed max-w-2xl mb-6`}>{profile.bio}</p>

               <div className={`flex flex-wrap gap-4 ${config.theme !== 'classic' && !isScreenshotMode ? 'justify-center' : 'justify-start'} text-sm ${styles.textSecondary}`}>
                 <div className="flex items-center gap-1"><MapPin size={16}/> {profile.location}</div>
                 <a href={`mailto:${profile.email}`} className="flex items-center gap-1 hover:underline"><Mail size={16}/> {profile.email}</a>
                 {profile.phone && <div className="flex items-center gap-1"><Phone size={16}/> {profile.phone}</div>}
                 {profile.website && <a href={profile.website} className="flex items-center gap-1 hover:underline"><Globe size={16}/> Website</a>}
                 
                 <div className="w-full h-0 md:w-auto md:h-4 md:border-r border-zinc-500/30 hidden md:block"></div>
                 
                 {profile.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer"><Github size={18} /></a>}
                 {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer"><Linkedin size={18} /></a>}
               </div>
             </div>
           </div>
        </Container>
      </section>

      {/* Experience */}
      <section id="experience" className={`${styles.sectionBg} ${sectionSpacing}`}>
        <Container className={containerClass}>
          <div className={`mb-12 ${config.theme === 'modern' ? 'text-center' : 'text-left'}`}>
            <h2 className={`text-3xl ${styles.fontHead} ${styles.textPrimary} mb-4`}>Experience</h2>
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
                <p className={`${styles.textSecondary} leading-relaxed text-sm md:text-base`}>{exp.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

       {/* Education */}
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
                      {edu.description && <p className={`text-sm ${styles.textSecondary} mt-3`}>{edu.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section id="projects" className={`${styles.sectionBg} ${sectionSpacing}`}>
           <Container className={containerClass}>
            <div className={`mb-12 ${config.theme === 'modern' ? 'text-center' : 'text-left'}`}>
              <h2 className={`text-3xl ${styles.fontHead} ${styles.textPrimary} mb-4`}>Projects</h2>
               {config.theme === 'modern' && <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full" />}
            </div>

            <div className={`grid grid-cols-1 ${isScreenshotMode ? 'gap-8' : 'md:grid-cols-2 gap-8'}`}>
              {projects.map((project) => (
                <div key={project.id} className={`group relative ${styles.cardBg} ${styles.radius} overflow-hidden ${config.theme === 'creative' ? 'hover:-translate-y-2 transition-transform' : ''}`}>
                  {!isScreenshotMode && (
                    <div className="overflow-hidden border-b border-zinc-800/20">
                      {project.video_url ? (
                        <VideoEmbed url={project.video_url} />
                      ) : (
                        <div className="aspect-video">
                           <img 
                            src={project.image_url} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          />
                        </div>
                      )}
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
                    
                    <p className={`${styles.textSecondary} mb-4 text-sm line-clamp-3`}>{project.description}</p>

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

      {/* Skills */}
      <section id="skills" className={`${styles.bg} ${sectionSpacing}`}>
        <Container className={containerClass}>
          <div className={`mb-12 ${config.theme === 'modern' ? 'text-center' : 'text-left'}`}>
            <h2 className={`text-3xl ${styles.fontHead} ${styles.textPrimary} mb-4`}>Skills</h2>
             {config.theme === 'modern' && <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full" />}
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
             {skills.map(skill => (
               <div key={skill.id} className={`${styles.cardBg} px-4 py-2 ${styles.radius} flex items-center gap-2`}>
                 <span className={`font-semibold ${styles.textPrimary}`}>{skill.name}</span>
                 {config.theme === 'modern' && <span className="text-xs text-zinc-500">| {skill.proficiency}%</span>}
               </div>
             ))}
          </div>
        </Container>
      </section>
      
      {!isScreenshotMode && (
        <section className={`${styles.sectionBg} py-20 text-center`}>
          <Container>
            <h2 className={`text-3xl ${styles.fontHead} ${styles.textPrimary} mb-6`}>Contact Me</h2>
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
