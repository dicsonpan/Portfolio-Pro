
import { Profile, Experience, Project, Skill, Education, SiteConfig } from './types';

export const SUPPORTED_LANGUAGES = [
  { code: 'zh-TW', label: '繁體中文', flag: '🇭🇰' },
  { code: 'zh', label: '简体中文', flag: '🇨🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

// --- DEFAULT SITE RESUME (Shown on Root /) ---

export const MOCK_PROFILE_EN: Profile = {
  id: 'site-default',
  username: 'next-folio',
  language: 'en',
  name: 'NextFolio',
  title: 'Your Digital Growth Companion',
  tagline: 'Turning student efforts into visible achievements.',
  bio: 'Hi, I am NextFolio! I am not just a website builder; I am a stage designed specifically for students. In an era where diverse talents matter, I help you transform scattered photos, certificates, and competition memories into a beautiful, professional digital portfolio. No coding required—just tell your story, and I\'ll help you shine in school applications, club interviews, and beyond!',
  avatar_url: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1760&auto=format&fit=crop',
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
  title: '你的数字成长档案管家',
  tagline: '记录成长的每一个闪光点，让努力被看见。',
  bio: '嗨！我是 NextFolio。我不是一个普通的网站，我是专为中小学生打造的“数字星光大道”。在升学竞争激烈、但也充满多元可能的时代，我帮助你将散落在手机里的活动照片、压在箱底的奖状证书，变成一份份精美的数字履历。无需任何编程基础，只要填写内容，我就能帮你把“努力的过程”变成“看得到的成就”。无论是升学面试、社团申请，还是向亲友展示，我都能让你脱颖而出！',
  avatar_url: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1760&auto=format&fit=crop',
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
  title: '你的數位成長檔案管家',
  tagline: '記錄成長的每一個閃光點，讓努力被看見。',
  bio: '嗨！我是 NextFolio。我不是一個普通的網站，我是專為中小學生打造的「數位星光大道」。在升學競爭激烈、但也充滿多元可能的時代，我幫助你將散落在手機裡的活動照片、壓在箱底的獎狀證書，變成一份份精美的數位履歷。無需任何程式基礎，只要填寫內容，我就能幫你把「努力的過程」變成「看得到的成就」。無論是升學面試、社團申請，還是向親友展示，我都能讓你脫穎而出！',
  avatar_url: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1760&auto=format&fit=crop',
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
  display_order: ['about', 'experience', 'projects', 'skills', 'education']
};

// Highlighting Features as "Experiences"
export const MOCK_EXPERIENCE: Experience[] = [
  {
    id: 'feat-1',
    language: 'en',
    company: 'Snapshot Mode',
    role: 'Social Media Ready',
    start_date: '2023-01-01',
    end_date: null,
    description: 'Turn your profile into a stunning long-form image with one tap. Perfect for sharing your achievements on Instagram Stories, WeChat Moments, or printing as a flyer.',
    current: true,
  },
  {
    id: 'feat-1-zh',
    language: 'zh',
    company: '快照模式 (Snapshot)',
    role: '社交分享神器',
    start_date: '2023-01-01',
    end_date: null,
    description: '点击相机图标，一键生成精美长图。自动排版，完美适配朋友圈、小红书或 Instagram 限时动态。让你的成就瞬间被看见，不再只是冷冰冰的文字。',
    current: true,
  },
  {
    id: 'feat-1-zh-tw',
    language: 'zh-TW',
    company: '快照模式 (Snapshot)',
    role: '社群分享神器',
    start_date: '2023-01-01',
    end_date: null,
    description: '點擊相機圖標，一鍵生成精美長圖。自動排版，完美適配朋友圈、小紅書或 Instagram 限時動態。讓你的成就瞬間被看見，不再只是冷冰冰的文字。',
    current: true,
  },
  {
    id: 'feat-2',
    language: 'en',
    company: 'Gemini AI',
    role: 'Writing Assistant',
    start_date: '2023-10-01',
    end_date: null,
    description: 'Struggling to write your bio? Our built-in Google Gemini AI polishes your text instantly. Just enter keywords, and get a professional, engaging introduction.',
    current: true,
  },
  {
    id: 'feat-2-zh',
    language: 'zh',
    company: 'Gemini AI 助手',
    role: '专属文案导师',
    start_date: '2023-10-01',
    end_date: null,
    description: '不知道自我介绍怎么写？没关系。内建 Google Gemini AI，输入几个关键词，我能帮你润色出专业又生动的内容，让你的履历更具说服力。',
    current: true,
  },
  {
    id: 'feat-2-zh-tw',
    language: 'zh-TW',
    company: 'Gemini AI 助手',
    role: '專屬文案導師',
    start_date: '2023-10-01',
    end_date: null,
    description: '不知道自我介紹怎麼寫？沒關係。內建 Google Gemini AI，輸入幾個關鍵字，我能幫你潤色出專業又生動的內容，讓你的履歷更具說服力。',
    current: true,
  },
  {
    id: 'feat-3',
    language: 'en',
    company: 'Zero Coding',
    role: 'Easy to Start',
    start_date: '2023-01-01',
    end_date: null,
    description: 'Designed for students and parents. No technical skills needed. Just fill in the blanks like a form, and get a hosted, shareable website URL in minutes.',
    current: true,
  },
  {
    id: 'feat-3-zh',
    language: 'zh',
    company: '零门槛上手',
    role: '三分钟建站',
    start_date: '2023-01-01',
    end_date: null,
    description: '专为学生与家长设计。不需要懂代码，像填表一样简单。填写完内容，立刻拥有一个可以随时分享的个人主页链接。',
    current: true,
  },
  {
    id: 'feat-3-zh-tw',
    language: 'zh-TW',
    company: '零門檻上手',
    role: '三分鐘建站',
    start_date: '2023-01-01',
    end_date: null,
    description: '專為學生與家長設計。不需要懂代碼，像填表一樣簡單。填寫完內容，立刻擁有一個可以隨時分享的個人主頁鏈接。',
    current: true,
  }
];

// Showcasing Who is it for via "Education"
export const MOCK_EDUCATION: Education[] = [
  {
    id: 'target-1',
    language: 'en',
    school: 'Primary & Middle Schools',
    degree: 'Digital Literacy',
    field: 'Personal Branding',
    start_date: '2024-01-01',
    end_date: null,
    description: 'Ideal for K-12 students starting to build their academic and extracurricular track record.'
  },
  {
    id: 'target-1-zh',
    language: 'zh',
    school: '中小学生首选',
    degree: '记录成长轨迹',
    field: '个人品牌启蒙',
    start_date: '2024-01-01',
    end_date: null,
    description: '适合所有 K-12 阶段的学生。无论是小升初、初升高，还是一份简单的暑期实践报告，都能完美承载。'
  },
  {
    id: 'target-1-zh-tw',
    language: 'zh-TW',
    school: '中小學生首選',
    degree: '記錄成長軌跡',
    field: '個人品牌啟蒙',
    start_date: '2024-01-01',
    end_date: null,
    description: '適合所有 K-12 階段的學生。無論是國小升國中、高中升大學的歷程檔案，還是一份簡單的暑期實踐報告，都能完美承載。'
  }
];

// Showcasing Sample Student Projects
export const MOCK_PROJECTS: Project[] = [
  {
    id: 'demo-1',
    language: 'en',
    title: 'STEM: Water Rocket Research',
    description: 'Example Entry: "I designed a double-stage water rocket. By adjusting the water volume and air pressure, I achieved a flight distance of 80 meters." -- Record your scientific explorations like this!',
    image_url: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2670&auto=format&fit=crop',
    demo_url: '#',
    tags: ['STEM', 'Physics', 'Gold Medal'],
  },
  {
    id: 'demo-1-zh',
    language: 'zh',
    title: '示范：水火箭研究计划',
    description: '“我设计了双级水火箭，通过调整水量和气压，成功让飞行距离突破了80米。” —— 你也可以这样记录你的科学探索，上传照片或比赛视频，让招生官眼前一zk亮。',
    image_url: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2670&auto=format&fit=crop',
    demo_url: '#',
    tags: ['STEM', '物理', '校级金奖'],
  },
  {
    id: 'demo-1-zh-tw',
    language: 'zh-TW',
    title: '示範：水火箭研究計畫',
    description: '「我設計了雙級水火箭，通過調整水量和氣壓，Cw成功讓飛行距離突破了80米。」 —— 你也可以這樣記錄你的科學探索，上傳照片或比賽影片，讓招生官眼前一亮。',
    image_url: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=2670&auto=format&fit=crop',
    demo_url: '#',
    tags: ['STEM', '物理', '校級金獎'],
  },
  {
    id: 'demo-2',
    language: 'en',
    title: 'Volunteer: Beach Cleanup',
    description: 'Example Entry: "Spent weekends cleaning up the local coastline. We collected over 50kg of waste." -- Show your character and community spirit.',
    image_url: 'https://images.unsplash.com/photo-1618477462106-98942f9928cc?q=80&w=2000&auto=format&fit=crop',
    demo_url: '#',
    tags: ['Volunteer', 'Community', 'Environment'],
  },
  {
    id: 'demo-2-zh',
    language: 'zh',
    title: '示范：海岸净滩行动',
    description: '“周末参加了净滩活动，我们小组协力清理了50公斤的海洋垃圾。” —— 记录你的社会实践与公益活动，展现你的责任感与爱心。',
    image_url: 'https://images.unsplash.com/photo-1618477462106-98942f9928cc?q=80&w=2000&auto=format&fit=crop',
    demo_url: '#',
    tags: ['志工', '环保', '社会服务'],
  },
  {
    id: 'demo-2-zh-tw',
    language: 'zh-TW',
    title: '示範：海岸淨灘行動',
    description: '「週末參加了淨灘活動，我們小組協力清理了50公斤的海洋垃圾。」 —— 記錄你的社會實踐與公益活動，展現你的責任感與愛心。',
    image_url: 'https://images.unsplash.com/photo-1618477462106-98942f9928cc?q=80&w=2000&auto=format&fit=crop',
    demo_url: '#',
    tags: ['志工', '環保', '社會服務'],
  },
  {
    id: 'demo-3',
    language: 'en',
    title: 'Art: Digital Painting',
    description: 'Example Entry: "My first attempt at Procreate. This piece represents the feeling of summer." -- A perfect place for your visual portfolio.',
    image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2671&auto=format&fit=crop',
    demo_url: '#',
    tags: ['Art', 'Design', 'Creativity'],
  },
  {
    id: 'demo-3-zh',
    language: 'zh',
    title: '示范：数位板绘作品',
    description: '“这是我第一次尝试使用 Procreate 创作，主题是夏日的午后。” —— NextFolio 支持大图展示，是存放你美术、书法、摄影作品集的最佳画廊。',
    image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2671&auto=format&fit=crop',
    demo_url: '#',
    tags: ['艺术', '设计', '创造力'],
  },
  {
    id: 'demo-3-zh-tw',
    language: 'zh-TW',
    title: '示範：電繪創作作品',
    description: '「這是我第一次嘗試使用 Procreate 創作，主題是夏日的午後。」 —— NextFolio 支持大圖展示，是存放你美術、書法、攝影作品集的最佳畫廊。',
    image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2671&auto=format&fit=crop',
    demo_url: '#',
    tags: ['藝術', '設計', '創造力'],
  }
];

// Highlight Benefits/Skills
export const MOCK_SKILLS: Skill[] = [
  { id: '1', language: 'en', name: 'Creativity', category: 'soft-skills', proficiency: 100 },
  { id: '2', language: 'en', name: 'Leadership', category: 'soft-skills', proficiency: 90 },
  { id: '3', language: 'en', name: 'Coding', category: 'tools', proficiency: 85 },
  
  { id: '1-zh', language: 'zh', name: '创造力', category: 'soft-skills', proficiency: 100 },
  { id: '2-zh', language: 'zh', name: '领导力', category: 'soft-skills', proficiency: 90 },
  { id: '3-zh', language: 'zh', name: '编程思维', category: 'tools', proficiency: 85 },
  
  { id: '1-zh-tw', language: 'zh-TW', name: '創造力', category: 'soft-skills', proficiency: 100 },
  { id: '2-zh-tw', language: 'zh-TW', name: '領導力', category: 'soft-skills', proficiency: 90 },
  { id: '3-zh-tw', language: 'zh-TW', name: '程式邏輯', category: 'tools', proficiency: 85 },
];

const env = (import.meta as any).env || {};

export const SUPABASE_URL = env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY || '';
