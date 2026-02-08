import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Save, User, Briefcase, FolderGit2, Cpu, GraduationCap, Palette, Sparkles, Wand2, Lock, ShieldCheck, Languages, RefreshCw, Globe, Contact } from 'lucide-react';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';
import { aiService } from '../services/aiService';
import { Profile, Experience, Project, Skill, Education, SiteConfig, ThemeType, LanguageCode } from '../types';
import { Button, Input, TextArea, FileUpload } from '../components/ui/Inputs';
import { Container } from '../components/ui/Layouts';
import { SUPPORTED_LANGUAGES, MOCK_PROFILE_EN } from '../constants';

type Tab = 'profile' | 'education' | 'experience' | 'projects' | 'skills' | 'design' | 'settings';

// --- UI Translation Dictionary ---
const TRANSLATIONS: Record<string, any> = {
  en: {
    dashboard: "Admin Dashboard",
    settings: "Settings",
    translate_all: "AI Translate All",
    translating: "Translating...",
    // Tabs
    tab_profile: "Profile",
    tab_design: "Design & Layout",
    tab_edu: "Education",
    tab_exp: "Experience",
    tab_proj: "Projects",
    tab_skill: "Skills",
    // Actions
    save: "Save",
    saving: "Saving...",
    add: "Add",
    delete: "Delete",
    polish: "AI Polish",
    polishing: "Polishing...",
    update_pwd: "Update Password",
    // Profile
    edit_profile: "Edit Profile",
    global_info: "Global Information",
    global_hint: "Shared across all languages",
    local_info: "Localized Content",
    local_hint: "Version",
    label_avatar: "Avatar Image (Universal)",
    label_username: "Username (URL Slug)",
    label_email: "Email",
    label_phone: "Phone",
    label_website: "Website",
    label_fullname: "Full Name",
    label_title: "Job Title",
    label_tagline: "One-line Tagline",
    label_location: "Location",
    label_bio: "Bio / Summary",
    // Education
    edu_school: "School",
    edu_degree: "Degree",
    edu_field: "Field of Study",
    edu_start: "Start Date",
    edu_end: "End Date",
    edu_desc: "Description",
    // Experience
    exp_company: "Company / Organization",
    exp_role: "Role / Title",
    exp_present: "Present",
    // Projects
    proj_title: "Title",
    proj_demo: "Demo URL",
    proj_video: "Video URL (YouTube/Bilibili)",
    proj_repo: "Repo URL",
    proj_tags: "Tags (comma separated)",
    proj_img: "Project Image",
    // Skills
    skill_list: "Skills List",
    skill_hint: "Skills are global concepts, but their names are localized.",
    // Settings
    app_settings: "Application Settings",
    acc_security: "Account Security",
    acc_hint: "Set or update your password for easier login.",
    pwd_new: "New Password",
    pwd_confirm: "Confirm Password",
    // Design
    theme_title: "Theme & Layout",
    theme_modern: "Modern",
    theme_classic: "Classic",
    theme_creative: "Creative",
  },
  zh: {
    dashboard: "管理后台",
    settings: "设置",
    translate_all: "AI 一键翻译",
    translating: "翻译中...",
    tab_profile: "个人资料",
    tab_design: "主题设计",
    tab_edu: "教育经历",
    tab_exp: "实践/工作",
    tab_proj: "项目展示",
    tab_skill: "技能特长",
    save: "保存",
    saving: "保存中...",
    add: "添加",
    delete: "删除",
    polish: "AI 润色",
    polishing: "润色中...",
    update_pwd: "更新密码",
    edit_profile: "编辑资料",
    global_info: "通用信息",
    global_hint: "所有语言版本通用",
    local_info: "本地化内容",
    local_hint: "版本内容",
    label_avatar: "头像 (通用)",
    label_username: "用户名 (个性化域名)",
    label_email: "邮箱",
    label_phone: "电话",
    label_website: "个人网站",
    label_fullname: "姓名",
    label_title: "头衔 / 职位",
    label_tagline: "一句话介绍",
    label_location: "所在地",
    label_bio: "个人简介",
    edu_school: "学校名称",
    edu_degree: "学位 / 学历",
    edu_field: "专业 / 领域",
    edu_start: "开始日期",
    edu_end: "结束日期",
    edu_desc: "描述",
    exp_company: "公司 / 组织",
    exp_role: "职位 / 角色",
    exp_present: "至今",
    proj_title: "项目标题",
    proj_demo: "演示链接 (Demo)",
    proj_video: "视频链接 (B站/YouTube)",
    proj_repo: "代码仓库 (Repo)",
    proj_tags: "标签 (逗号分隔)",
    proj_img: "项目封面图",
    skill_list: "技能列表",
    skill_hint: "技能熟练度全局通用，名称随语言变化。",
    app_settings: "应用设置",
    acc_security: "账户安全",
    acc_hint: "设置或更新您的登录密码。",
    pwd_new: "新密码",
    pwd_confirm: "确认密码",
    theme_title: "主题与布局",
    theme_modern: "现代极简",
    theme_classic: "经典简历",
    theme_creative: "创意波普",
  },
  'zh-TW': {
    dashboard: "管理後台",
    settings: "設定",
    translate_all: "AI 一鍵翻譯",
    translating: "翻譯中...",
    tab_profile: "個人資料",
    tab_design: "主題設計",
    tab_edu: "學歷背景",
    tab_exp: "經歷 / 工作",
    tab_proj: "專案展示",
    tab_skill: "技能專長",
    save: "儲存",
    saving: "儲存中...",
    add: "新增",
    delete: "刪除",
    polish: "AI 潤飾",
    polishing: "潤飾中...",
    update_pwd: "更新密碼",
    edit_profile: "編輯資料",
    global_info: "通用資訊",
    global_hint: "所有語言版本通用",
    local_info: "在地化內容",
    local_hint: "版本內容",
    label_avatar: "大頭貼 (通用)",
    label_username: "使用者名稱 (網址)",
    label_email: "Email",
    label_phone: "電話",
    label_website: "個人網站",
    label_fullname: "姓名",
    label_title: "頭銜 / 職稱",
    label_tagline: "一句話介紹",
    label_location: "所在地",
    label_bio: "個人簡介",
    edu_school: "學校名稱",
    edu_degree: "學位 / 學歷",
    edu_field: "科系 / 領域",
    edu_start: "開始日期",
    edu_end: "結束日期",
    edu_desc: "描述",
    exp_company: "公司 / 組織",
    exp_role: "職位 / 角色",
    exp_present: "至今",
    proj_title: "專案標題",
    proj_demo: "展示連結 (Demo)",
    proj_video: "影片連結 (YouTube/B站)",
    proj_repo: "程式庫 (Repo)",
    proj_tags: "標籤 (逗號分隔)",
    proj_img: "專案封面圖",
    skill_list: "技能列表",
    skill_hint: "技能熟練度全域通用，名稱隨語言變化。",
    app_settings: "應用程式設定",
    acc_security: "帳戶安全",
    acc_hint: "設定或更新您的登入密碼。",
    pwd_new: "新密碼",
    pwd_confirm: "確認密碼",
    theme_title: "主題與佈局",
    theme_modern: "現代極簡",
    theme_classic: "經典履歷",
    theme_creative: "創意風格",
  },
  ja: {
    dashboard: "管理ダッシュボード",
    settings: "設定",
    translate_all: "AI一括翻訳",
    translating: "翻訳中...",
    tab_profile: "プロフィール",
    tab_design: "デザイン",
    tab_edu: "学歴",
    tab_exp: "職務経歴",
    tab_proj: "プロジェクト",
    tab_skill: "スキル",
    save: "保存",
    saving: "保存中...",
    add: "追加",
    delete: "削除",
    polish: "AI修正",
    polishing: "修正中...",
    update_pwd: "パスワード更新",
    edit_profile: "プロフィール編集",
    global_info: "基本情報",
    global_hint: "全言語共通",
    local_info: "ローカライズ内容",
    local_hint: "バージョン",
    label_avatar: "アバター (共通)",
    label_username: "ユーザー名 (URL)",
    label_email: "メール",
    label_phone: "電話番号",
    label_website: "ウェブサイト",
    label_fullname: "氏名",
    label_title: "肩書き",
    label_tagline: "キャッチコピー",
    label_location: "所在地",
    label_bio: "自己紹介",
    edu_school: "学校名",
    edu_degree: "学位",
    edu_field: "専攻",
    edu_start: "開始日",
    edu_end: "終了日",
    edu_desc: "詳細",
    exp_company: "会社 / 組織",
    exp_role: "役職",
    exp_present: "現在",
    proj_title: "タイトル",
    proj_demo: "デモURL",
    proj_video: "動画URL",
    proj_repo: "リポジトリURL",
    proj_tags: "タグ (カンマ区切り)",
    proj_img: "画像",
    skill_list: "スキル一覧",
    skill_hint: "熟練度は共通ですが、名称は言語ごとに異なります。",
    app_settings: "アプリ設定",
    acc_security: "アカウントセキュリティ",
    acc_hint: "パスワードを設定または更新します。",
    pwd_new: "新しいパスワード",
    pwd_confirm: "パスワード確認",
    theme_title: "テーマ設定",
    theme_modern: "モダン",
    theme_classic: "クラシック",
    theme_creative: "クリエイティブ",
  }
};

const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [lang, setLang] = useState<LanguageCode>('zh-TW');
  
  // Translation Helper
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

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
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);

  // Settings State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    loadAll(lang);
  }, [lang]);

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
             const baseProfile = await dataService.getProfile('en') || MOCK_PROFILE_EN;
             const newProfile = { ...baseProfile, id: uuidv4(), language };
             setProfile(newProfile);
        } else {
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
  const handleAIPolish = async (text: string, fieldId: string, onUpdate: (newText: string) => void) => {
    setAiLoading(fieldId);
    try {
      const polished = await aiService.polishText(text);
      onUpdate(polished);
    } catch (e) {
      alert("AI Polish failed. Check console or make sure API_KEY is set in environment.");
    } finally {
      setAiLoading(null);
    }
  };

  const handleAutoTranslate = async () => {
    const confirmMsg = `AI Translation will overwrite content in other languages based on your current ${lang} content.\n\nAre you sure you want to translate and sync to ALL supported languages?`;
    if (!window.confirm(confirmMsg)) return;

    setTranslating(true);
    try {
      const targets = SUPPORTED_LANGUAGES.filter(l => l.code !== lang);
      
      // 1. Translate Profile
      if (profile) {
        for (const target of targets) {
          const translatedProfile = await aiService.translateJSON(profile, target.label);
          // Fix critical fields that must NOT change or must match the target
          translatedProfile.language = target.code; 
          translatedProfile.id = uuidv4(); 
          // Re-sync IDs if existing
          const existing = await dataService.getProfile(target.code as LanguageCode);
          if (existing) translatedProfile.id = existing.id;
          
          await dataService.updateProfile(translatedProfile);
        }
      }

      // 2. Translate Education
      // Strategy: Delete existing for target lang and recreate based on current
      for (const target of targets) {
        const existingEdu = await dataService.getEducation(target.code as LanguageCode);
        for (const item of existingEdu) await dataService.deleteEducation(item.id);

        for (const item of education) {
           const translated = await aiService.translateJSON(item, target.label);
           translated.language = target.code;
           translated.id = uuidv4(); 
           await dataService.saveEducation(translated);
        }
      }

      // 3. Translate Experience
      for (const target of targets) {
        const existingExp = await dataService.getExperiences(target.code as LanguageCode);
        for (const item of existingExp) await dataService.deleteExperience(item.id);

        for (const item of experiences) {
           const translated = await aiService.translateJSON(item, target.label);
           translated.language = target.code;
           translated.id = uuidv4();
           await dataService.saveExperience(translated);
        }
      }

      // 4. Translate Projects
      for (const target of targets) {
        const existingProj = await dataService.getProjects(target.code as LanguageCode);
        for (const item of existingProj) await dataService.deleteProject(item.id);

        for (const item of projects) {
           const translated = await aiService.translateJSON(item, target.label);
           translated.language = target.code;
           translated.id = uuidv4();
           await dataService.saveProject(translated);
        }
      }

      // 5. Translate Skills
      for (const target of targets) {
        const existingSkills = await dataService.getSkills(target.code as LanguageCode);
        for (const item of existingSkills) await dataService.deleteSkill(item.id);

        for (const item of skills) {
           const translated = await aiService.translateJSON(item, target.label);
           translated.language = target.code;
           translated.id = uuidv4();
           await dataService.saveSkill(translated);
        }
      }

      alert("🎉 All languages have been synced and translated from " + lang);

    } catch (error: any) {
      alert("Translation failed: " + error.message);
      console.error(error);
    } finally {
      setTranslating(false);
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
      {aiLoading === fieldId ? t.polishing : t.polish}
    </button>
  );

  // --- Actions ---
  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    await dataService.updateProfile(profile);
    setSaving(false);
    alert('Profile saved!');
  };

  const handleSaveConfig = async () => {
    if (!config) return;
    setSaving(true);
    await dataService.updateConfig(config);
    setSaving(false);
    alert('Settings saved!');
  };

  const handleUpdatePassword = async () => {
    setPasswordMsg(null);
    if (newPassword.length < 6) {
        setPasswordMsg({type: 'error', text: 'Password must be at least 6 characters.'});
        return;
    }
    if (newPassword !== confirmPassword) {
        setPasswordMsg({type: 'error', text: 'Passwords do not match.'});
        return;
    }
    setSaving(true);
    try {
        await authService.updatePassword(newPassword);
        setPasswordMsg({type: 'success', text: 'Password updated successfully!'});
        setNewPassword('');
        setConfirmPassword('');
    } catch (err: any) {
        setPasswordMsg({type: 'error', text: err.message || 'Failed to update password.'});
    } finally {
        setSaving(false);
    }
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
               <h1 className="text-xl font-bold text-white">{t.dashboard}</h1>
           </div>
           
           <div className="flex items-center gap-4">
              <Button 
                onClick={handleAutoTranslate} 
                disabled={translating}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 border border-indigo-500/50"
                title={`Translate current ${lang} content to all other supported languages.`}
              >
                {translating ? <RefreshCw className="animate-spin" size={16} /> : <Languages size={16} />}
                {translating ? t.translating : t.translate_all}
              </Button>

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
              <Button variant="ghost" onClick={() => setActiveTab('settings')} className={`flex items-center gap-2 ${activeTab === 'settings' ? 'bg-zinc-800 text-white' : ''}`}>
                 <Lock size={16} /> {t.settings}
              </Button>
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sticky top-24 space-y-2">
                <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                  <User size={18} /> {t.tab_profile}
                </button>
                <button onClick={() => setActiveTab('design')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'design' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                  <Palette size={18} /> {t.tab_design}
                </button>
                <button onClick={() => setActiveTab('education')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'education' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                  <GraduationCap size={18} /> {t.tab_edu}
                </button>
                <button onClick={() => setActiveTab('experience')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'experience' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                  <Briefcase size={18} /> {t.tab_exp}
                </button>
                <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'projects' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                  <FolderGit2 size={18} /> {t.tab_proj}
                </button>
                <button onClick={() => setActiveTab('skills')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'skills' ? 'bg-primary/10 text-primary' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                  <Cpu size={18} /> {t.tab_skill}
                </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            
            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
               <div className="space-y-6 animate-fade-in">
                 <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-white mb-6">{t.app_settings}</h3>
                    <div className="text-zinc-400 text-sm">
                       <p>App Version: 1.0.1</p>
                       <p>Environment: {process.env.NODE_ENV || 'production'}</p>
                    </div>
                 </div>

                 {/* Password Section */}
                 <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                           <ShieldCheck size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{t.acc_security}</h3>
                          <p className="text-sm text-zinc-400">{t.acc_hint}</p>
                        </div>
                    </div>

                    <div className="max-w-md">
                        <Input 
                            label={t.pwd_new} 
                            type="password" 
                            value={newPassword} 
                            onChange={e => setNewPassword(e.target.value)} 
                            placeholder="Min 6 characters"
                        />
                        <Input 
                            label={t.pwd_confirm} 
                            type="password" 
                            value={confirmPassword} 
                            onChange={e => setConfirmPassword(e.target.value)} 
                        />
                        
                        {passwordMsg && (
                            <div className={`text-sm mb-4 p-2 rounded ${passwordMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                {passwordMsg.text}
                            </div>
                        )}

                        <Button onClick={handleUpdatePassword} disabled={saving}>
                            {saving ? t.saving : t.update_pwd}
                        </Button>
                    </div>
                 </div>
               </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && profile && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 animate-fade-in space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-white">{t.edit_profile}</h3>
                  <Button onClick={handleSaveProfile} disabled={saving}>{saving ? t.saving : t.save}</Button>
                </div>
                
                {/* GLOBAL INFO */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
                   <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-2">
                      <Contact size={20} className="text-primary" />
                      <h4 className="text-lg font-semibold text-white">{t.global_info}</h4>
                      <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded ml-auto">{t.global_hint}</span>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <FileUpload 
                          label={t.label_avatar}
                          value={profile.avatar_url} 
                          onUpload={(url) => setProfile({...profile, avatar_url: url})} 
                          onFileSelect={handleUploadImage}
                        />
                      </div>
                      <Input 
                        label={t.label_username} 
                        value={profile.username || ''} 
                        onChange={e => setProfile({...profile, username: e.target.value})} 
                        placeholder="e.g. dicsonpan" 
                      />
                      <Input label={t.label_email} value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
                      <Input label={t.label_phone} value={profile.phone || ''} onChange={e => setProfile({...profile, phone: e.target.value})} />
                      <Input label={t.label_website} value={profile.website || ''} onChange={e => setProfile({...profile, website: e.target.value})} />
                      <Input label="GitHub URL" value={profile.github_url || ''} onChange={e => setProfile({...profile, github_url: e.target.value})} />
                      <Input label="LinkedIn URL" value={profile.linkedin_url || ''} onChange={e => setProfile({...profile, linkedin_url: e.target.value})} />
                   </div>
                </div>

                {/* LOCALIZED INFO */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
                   <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-2">
                      <Globe size={20} className="text-primary" />
                      <h4 className="text-lg font-semibold text-white">{t.local_info}</h4>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded ml-auto">{lang.toUpperCase()} {t.local_hint}</span>
                   </div>

                   <div className="grid grid-cols-1 gap-6">
                      <Input label={t.label_fullname} value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                      <Input label={t.label_title} value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} />
                      <Input label={t.label_tagline} value={profile.tagline || ''} onChange={e => setProfile({...profile, tagline: e.target.value})} />
                      <Input label={t.label_location} value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} />
                      
                      <div>
                        <TextArea 
                            label={t.label_bio}
                            value={profile.bio} 
                            onChange={e => setProfile({...profile, bio: e.target.value})}
                            extraAction={<AIPolishButton text={profile.bio} fieldId="bio" onUpdate={s => setProfile({...profile, bio: s})} />}
                        />
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* DESIGN TAB */}
            {activeTab === 'design' && config && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 md:p-8 animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold text-white">{t.theme_title}</h3>
                  <Button onClick={handleSaveConfig} disabled={saving}>{saving ? t.saving : t.save}</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                   {['modern', 'classic', 'creative'].map(th => (
                       <div 
                        key={th}
                        onClick={() => setConfig({...config, theme: th as ThemeType})}
                        className={`cursor-pointer p-4 rounded-lg border-2 ${config.theme === th ? 'border-primary bg-zinc-800' : 'border-zinc-700 hover:border-zinc-600'}`}
                      >
                         <div className={`h-20 rounded mb-2 flex items-center justify-center text-xs font-bold 
                            ${th === 'modern' ? 'bg-zinc-950 border border-zinc-800 text-zinc-500' : ''}
                            ${th === 'classic' ? 'bg-white text-zinc-900 font-serif' : ''}
                            ${th === 'creative' ? 'bg-zinc-100 border-2 border-black text-black' : ''}
                         `}>
                           {th.toUpperCase()}
                         </div>
                         <p className="text-white font-medium text-center capitalize">
                           {th === 'modern' && t.theme_modern}
                           {th === 'classic' && t.theme_classic}
                           {th === 'creative' && t.theme_creative}
                         </p>
                      </div>
                   ))}
                </div>
              </div>
            )}

            {/* EDUCATION */}
            {activeTab === 'education' && (
              <div className="space-y-6 animate-fade-in">
                 <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-bold text-white">{t.tab_edu} ({lang.toUpperCase()})</h3>
                   <Button onClick={() => handleAddEntity('edu')}><Plus size={16} className="inline mr-1" /> {t.add}</Button>
                </div>
                {education.map((edu, idx) => (
                   <div key={edu.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input label={t.edu_school} value={edu.school} onChange={e => {
                          const n = [...education]; n[idx].school = e.target.value; setEducation(n);
                        }} />
                        <Input label={t.edu_degree} value={edu.degree} onChange={e => {
                          const n = [...education]; n[idx].degree = e.target.value; setEducation(n);
                        }} />
                        <Input label={t.edu_field} value={edu.field} onChange={e => {
                          const n = [...education]; n[idx].field = e.target.value; setEducation(n);
                        }} />
                        <div className="grid grid-cols-2 gap-4">
                           <Input type="date" label={t.edu_start} value={edu.start_date} onChange={e => {
                              const n = [...education]; n[idx].start_date = e.target.value; setEducation(n);
                            }} />
                             <Input type="date" label={t.edu_end} value={edu.end_date || ''} onChange={e => {
                              const n = [...education]; n[idx].end_date = e.target.value; setEducation(n);
                            }} />
                        </div>
                      </div>
                      <TextArea 
                          label={t.edu_desc} 
                          value={edu.description || ''} 
                          onChange={e => { const n = [...education]; n[idx].description = e.target.value; setEducation(n); }} 
                          extraAction={<AIPolishButton text={edu.description || ''} fieldId={`edu-${edu.id}`} onUpdate={s => { const n = [...education]; n[idx].description = s; setEducation(n); }} />}
                      />
                     <div className="flex justify-end gap-3 mt-4">
                        <Button variant="danger" onClick={() => handleDeleteEntity('edu', edu.id)}><Trash2 size={16}/></Button>
                        <Button variant="secondary" onClick={() => handleSaveEntity('edu', edu)}><Save size={16} className="mr-2 inline"/> {t.save}</Button>
                     </div>
                   </div>
                ))}
              </div>
            )}

            {/* EXPERIENCE */}
            {activeTab === 'experience' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-bold text-white">{t.tab_exp} ({lang.toUpperCase()})</h3>
                   <Button onClick={() => handleAddEntity('exp')}><Plus size={16} className="inline mr-1" /> {t.add}</Button>
                </div>

                {experiences.map((exp, idx) => (
                  <div key={exp.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Input label={t.exp_company} value={exp.company} onChange={e => { const n = [...experiences]; n[idx].company = e.target.value; setExperiences(n); }} />
                        <Input label={t.exp_role} value={exp.role} onChange={e => { const n = [...experiences]; n[idx].role = e.target.value; setExperiences(n); }} />
                        <Input type="date" label={t.edu_start} value={exp.start_date} onChange={e => { const n = [...experiences]; n[idx].start_date = e.target.value; setExperiences(n); }} />
                        <div className="flex items-end gap-4">
                           {!exp.current && (
                             <Input type="date" label={t.edu_end} value={exp.end_date || ''} onChange={e => { const n = [...experiences]; n[idx].end_date = e.target.value; setExperiences(n); }} />
                           )}
                           <div className="mb-6 flex items-center">
                              <input type="checkbox" checked={exp.current} onChange={e => {
                                 const n = [...experiences]; n[idx].current = e.target.checked;
                                 if(e.target.checked) n[idx].end_date = null; setExperiences(n);
                              }} className="mr-2" />
                              <label className="text-zinc-400 text-sm">{t.exp_present}</label>
                           </div>
                        </div>
                     </div>
                     <TextArea 
                        label={t.edu_desc} 
                        value={exp.description} 
                        onChange={e => { const n = [...experiences]; n[idx].description = e.target.value; setExperiences(n); }} 
                        extraAction={<AIPolishButton text={exp.description} fieldId={`exp-${exp.id}`} onUpdate={s => { const n = [...experiences]; n[idx].description = s; setExperiences(n); }} />}
                     />
                     <div className="flex justify-end gap-3 mt-4">
                        <Button variant="danger" onClick={() => handleDeleteEntity('exp', exp.id)}><Trash2 size={16}/></Button>
                        <Button variant="secondary" onClick={() => handleSaveEntity('exp', exp)}><Save size={16} className="mr-2 inline"/> {t.save}</Button>
                     </div>
                  </div>
                ))}
              </div>
            )}

            {/* PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                   <h3 className="text-2xl font-bold text-white">{t.tab_proj} ({lang.toUpperCase()})</h3>
                   <Button onClick={() => handleAddEntity('proj')}><Plus size={16} className="inline mr-1" /> {t.add}</Button>
                </div>

                {projects.map((proj, idx) => (
                  <div key={proj.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Input label={t.proj_title} value={proj.title} onChange={e => { const n = [...projects]; n[idx].title = e.target.value; setProjects(n); }} />
                      
                      <Input label={t.proj_demo} value={proj.demo_url || ''} onChange={e => { const n = [...projects]; n[idx].demo_url = e.target.value; setProjects(n); }} />
                      <Input label={t.proj_video} value={proj.video_url || ''} onChange={e => { const n = [...projects]; n[idx].video_url = e.target.value; setProjects(n); }} placeholder="https://youtube.com/..." />
                      <Input label={t.proj_repo} value={proj.repo_url || ''} onChange={e => { const n = [...projects]; n[idx].repo_url = e.target.value; setProjects(n); }} />
                    </div>
                     <FileUpload 
                         label={t.proj_img} 
                         value={proj.image_url} 
                         onUpload={(url) => { const n = [...projects]; n[idx].image_url = url; setProjects(n); }}
                         onFileSelect={handleUploadImage}
                      />
                     <Input label={t.proj_tags} value={proj.tags.join(', ')} onChange={e => { const n = [...projects]; n[idx].tags = e.target.value.split(',').map(tag => tag.trim()); setProjects(n); }} />
                    <TextArea 
                        label={t.edu_desc} 
                        value={proj.description} 
                        onChange={e => { const n = [...projects]; n[idx].description = e.target.value; setProjects(n); }} 
                        extraAction={<AIPolishButton text={proj.description} fieldId={`proj-${proj.id}`} onUpdate={s => { const n = [...projects]; n[idx].description = s; setProjects(n); }} />}
                    />
                     <div className="flex justify-end gap-3 mt-4">
                        <Button variant="danger" onClick={() => handleDeleteEntity('proj', proj.id)}><Trash2 size={16}/></Button>
                        <Button variant="secondary" onClick={() => handleSaveEntity('proj', proj)}><Save size={16} className="mr-2 inline"/> {t.save}</Button>
                     </div>
                  </div>
                ))}
              </div>
            )}

            {/* SKILLS */}
            {activeTab === 'skills' && (
               <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500 animate-fade-in">
                 <p>{t.skill_hint}</p>
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