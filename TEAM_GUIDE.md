
# NextFolio 开发团队分工与协作指南

欢迎加入 NextFolio 开发团队！为了高效利用我们 12 人的团队力量，我们将分为 **4 个核心开发小组**（每组 3 人）。

此外，为了保证项目上线后的推广和维护，我们将设立一个 **跨职能运营组**（由开发成员兼任）。

---

## 👥 第一部分：核心开发分组 (Squads)

### 1. 🎨 视觉与展示组 (UI/UX Squad)
**核心目标**：让用户的简历页面“好看到爆炸”。负责所有对外展示页面的美化、主题开发和响应式适配。

*   **负责文件**：
    *   `pages/PublicView.tsx` (主要战场)
    *   `components/ui/Layouts.tsx` (Logo, Navbar, Footer)
    *   `constants.ts` (Mock 数据的视觉测试)
*   **关键任务**：
    *   **多主题开发**：完善现有的 Modern/Classic/Creative 主题，设计更多 CSS 样式。
    *   **快照模式优化**：确保 `Snapshot Mode` 在手机尺寸下生成的布局完美，适合发朋友圈。
    *   **动画效果**：引入 `framer-motion` 或使用 TailwindAnimate 增加页面进入时的动画。
    *   **响应式测试**：确保在手机、平板、桌面端都有完美表现。
*   **必学技术**：
    *   **Tailwind CSS** (熟练掌握 Flex/Grid/Spacing/Typography)。
    *   **CSS 动画** (Transitions, Keyframes)。
    *   **React Props** (如何通过 Props 传递样式配置)。

### 2. ⚙️ 交互与后台组 (Admin & Logic Squad)
**核心目标**：让数据的录入“丝般顺滑”。负责后台管理界面的逻辑、表单验证和用户交互。

*   **负责文件**：
    *   `pages/AdminView.tsx` (核心战场，目前代码量大，需要拆分)
    *   `components/ui/Inputs.tsx` (封装更高级的输入组件)
*   **关键任务**：
    *   **组件拆分**：将 `AdminView` 拆分为 `ProfileEditor`, `ExperienceEditor` 等子组件，降低代码耦合。
    *   **表单体验**：增加表单验证（如：必填项红框提示）、日期选择器优化。
    *   **拖拽排序**：实现经历/项目的拖拽排序功能 (Drag and Drop)。
    *   **交互反馈**：保存成功、失败的 Toast 提示框。
*   **必学技术**：
    *   **React Hooks** (`useState`, `useEffect`, `useCallback`)。
    *   **Form Handling** (受控组件 vsUt 非受控组件)。
    *   **State Management** (状态提升，或学习 Context API)。

### 3. 🗄️ 数据与架构组 (Backend & Data Squad)
**核心目标**：构建“坚实的脊梁”。负责与 Supabase 数据库的交互、鉴权和数据安全。

*   **负责文件**：
    *   `services/dataService.ts` (核心战场)
    *   `services/authService.ts`
    *   `supabase_schema.sql`
    *   `types.ts`
*   **关键任务**：
    *   **数据库对接**：确保所有 CRUD（增删改qy查）操作都已通过 Supabase 连接真实数据库，移除 `localStorage` 的 fallback 代码。
    *   **RLS 策略**：编写 SQL 策略，确保用户 A 只能修改用户 A 的简历，不能修改用户 B 的。
    *   **图片上传**：优化 `uploadImage` 函数，处理图片压缩、格式限制。
    *   **鉴权流程**：完善登录、注册、退出登录的状态管理。
*   **必学技术**：
    *   **SQL 基础** (PostgreSQL)。
    *   **Supabase JS SDK**。
    *   **Async/Await & Promise** (异步编程是重中之重)。
    *   **TypeScript Types** (定义严格的接口)。

### 4. 🤖 AI 与特色功能组 (Feature & AI Squad)
**核心目标**：打造“差异化亮点”。负责 AI 接入、多语言逻辑和第三方集成。

*   **负责文件**：
    *   `services/aiService.ts`
    *   `constants.ts` (多语言配置)
    *   任何涉及 API 调用的新文件。
*   **关键任务**：
    *   **Gemini AI 调优**：优化 Prompt，让 AI 生成的简历文案更专业，甚至支持“润色风格选择”（如：更学术、KP更活泼）。
    *   **多语言架构**：重构现有的多语言切换逻辑，使其更易于扩展（比如使用 `react-i18next` 库）。
    *   **视频/第三方集成**：优化 YouTube/Bilibili 视频的解析逻辑，甚至支持 GitHub API 自动拉取项目。
    *   **导出功能**：研究如何将网页导出为 PDF。
*   **必学技术**：
    *   **Google Gemini API** (Prompt Engineering)。
    *   **HTTP 请求** (Fetch API)。
    *   **Internationalization (i18n)** 思维。

---

## 🚀 第二部分：运营与增长组 (Operations Guild - 兼职)

项目上线后，开发工作量会减少，**所有人**将根据特长分配到运营组的角色中。

### A. 📢 品牌与宣发 (Brand & Marketing)
*   **成员来源**：建议由 UI 组和 AI 组的成员兼任。
*   **职责**：
    1.  **制作 Demo 视频**：录制高大上的产品介绍视频（用于 B站/YouTube/抖音）。
    2.  **社交媒体**：利用 `PublicView` 的快照模式，生成精美案例图，在小红书/朋友圈进行“冷启动”推广。
    3.  **文案撰写**：编写 Release Notes (更新日志)，告诉用户我们更新了什么酷炫功能。

### B. 🩺 技术支持与运维 (DevOps & Support)
*   **成员来源**：建议OB Backend 组和 Admin 组的成员兼任。
*   **职责**：
    1.  **Bug 守门员**：每天检查 GitHub Issues，对 Bug 进行分级（P0-立刻修, P1-这周修, P2-以后修）。
    2.  **数据监控**：查看 Supabase 后台，关注用户增长数据，清理垃圾数据。
    3.  **稳定性维护**：确保网站不宕机，API Key 余额充足。

### C. 🎓 用户成功 (User Success & Docs)
*   **成员来源**：全员轮值。
*   **职责**：
    1.  **编写文档**：完善 `README.md`，编写《新手 3 分钟上手指南》。
    2.  **收集反馈**：直接联系前 10 个种子用户（可以是同班同学），询问他们的使用感受，记录痛点。

---

## 📅 项目推进时间表 (2周 Sprint + 运营期)

### 第一阶段：热身与学习 (Day 1-3)
*   **全员**：配置环境，跑通 Hello World。
*   **任务**：UI 组改颜色，Backend 组建表，AI 组调 API。

### 第二阶段：功能开发 (Day 4-10)
*   **全员**：火力全开，完成核心功能。
*   **任务**：完成所有页面开发和数据库联调。

### 第三阶段：集成与测试 (Day 11-14)
*   **全员**：停止开发新功能 (Code Freeze)。
*   **任务**：
    *   互相测试（Admin 组测 UI 组，AI 组测 Backend 组）。
    *   修复 Bug。
    *   部署上线。

### 第四阶段：运营与迭代 (Day 15+)
*   **转换身份**：大家从“程序员”转变为“运营者”。
*   **Week 3 任务**：
    *   **宣发组**：发布第一个宣传视频。
    *   **支持组**：收集前 50 个用户的反馈。
    *   **迭代**：根据反馈，每周发布一个小版本 (v1.1, v1.2)，比如增加一个新的主题色，或者优化手机端体验。

---

## 🚦 Git 协作实战手册 (必读)

12个人的团队，如果大家都往 `main` 分支推代码，项目一定会挂。请严格遵守以下流程：

### 1. 分支命名规范 (Branch Naming)
不要用 `dev` 或 `test` 这种模糊的名字。请使用以下格式：
`小组名/功能描述`

例如：
*   UI组做导航栏： `ui/navbar-redesign`
*   后台组做表单： `admin/fix-date-picker`
*   后端组接数据库： `backend/supabase-init`

### 2. 标准开发流程 (The Workflow)

#### 第一步：拉取最新代码
每天开始工作前，先同步远程仓库的最新代码，避免基于过时的版本开发。
```bash
git checkout main
git pull origin main
```

#### 第二步：创建你的分支
```bash
# 例如：我属于 UI 组，今天要修 Logo 的颜色
git checkout -b ui/fix-logo-color
```
*现在你在这个分支上可以随意修改，不会影响到别人。*

#### 第三步：提交代码 (Commit)
做完一个功能点（比如改完了 Logo），就提交一次。
```bash
git add .
git commit -m "fix: update logo color to green and white"
```

#### 第四步：推送到 GitHub (Push)
把你的分支推送到云端。
```bash
git push origin ui/fix-logo-color
```

#### 第五步：发起合并请求 (Pull Request / PR)
这是最关键的一步！**不要自己合并代码！**
1.  打开 GitHub 仓库页面。
2.  你会看到一个提示 "Compare & pull request"。
3.  点击它，填写你做了什么修改。
4.  **指定 Reviewer（审查人）**：请指定你小组的组长，或者其他组的同学来看你的代码。

#### 第六步：代码审查与合并 (Review & Merge)
1.  Reviewer 在 GitHub 上看代码，如果有问题，直接在网页上评论。
2.  开发者根据评论在本地修改，再次 `git push`（会自动更新 PR）。
3.  Reviewer 点击 **"Merge pull request"**。
4.  恭喜！你的代码正式进入了 `main` 分支。
