# 🏗️ 技术架构与数据库设计

本文档详细说明 Beauty Hue 的技术架构、数据流转和数据库设计。

---

## 目录

- [系统架构](#系统架构)
- [技术栈详解](#技术栈详解)
- [页面路由设计](#页面路由设计)
- [状态管理](#状态管理)
- [数据流转](#数据流转)
- [localStorage 使用](#localstorage-使用)
- [Supabase 数据库设计](#supabase-数据库设计)
- [认证流程](#认证流程)
- [分享卡片生成](#分享卡片生成)
- [动画实现方案](#动画实现方案)
- [部署方案](#部署方案)

---

## 系统架构

### 架构概览

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (React)                    │
├─────────────────────────────────────────────────────────┤
│  Pages          │  Components        │  Utils/Engine    │
│  ─────────      │  ──────────────    │  ─────────────   │
│  LandingPage    │  CardCarousel      │  authService     │
│  TestPage       │  SeasonCard        │  shareGenerator  │
│  ResultPage     │  ScoreRadar        │  canvasRadar     │
│  HistoryPage    │  TestColorChips    │  frameSnapshot   │
│  HistoryReport  │  LoginPanel        │                  │
├─────────────────────────────────────────────────────────┤
│                    State Management                      │
│                  (React Context + localStorage)          │
├─────────────────────────────────────────────────────────┤
│                      Supabase Backend                    │
├──────────────────┬──────────────────────────────────────┤
│   Auth Service   │           Database                    │
│   (邮箱认证)      │       (user_reports 表)              │
└──────────────────┴──────────────────────────────────────┘
```

### 技术选型理由

| 技术 | 选型理由 |
|------|----------|
| **React 18** | 组件化开发，生态成熟，团队熟悉 |
| **Vite** | 极速开发体验，HMR 性能优秀 |
| **Tailwind CSS** | 原子化 CSS，快速开发，易于维护 |
| **Framer Motion** | 声明式动画，API 简洁，性能优秀 |
| **Supabase** | 开源 Firebase 替代，Auth + DB 一体化 |

---

## 技术栈详解

### 前端框架

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI 组件化开发 |
| Vite | 8.x | 构建工具 |
| React Router | 6.x | SPA 路由管理 |

### 样式方案

| 技术 | 用途 |
|------|------|
| Tailwind CSS | 原子化 CSS 框架 |
| 自定义 CSS | 毛玻璃效果、渐变遮罩 |
| CSS Variables | 主题色定义 |

### 动画库

| 技术 | 用途 |
|------|------|
| Framer Motion | 页面切换动画、卡片轮播、交互动画 |

### 后端服务

| 服务 | 用途 |
|------|------|
| Supabase Auth | 用户认证（邮箱+密码） |
| Supabase Database | 数据存储（PostgreSQL） |
| Supabase RLS | 行级安全策略 |

---

## 页面路由设计

### 路由配置

```javascript
// src/App.jsx
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/test" element={<TestPage />} />
  <Route path="/result" element={<ResultPage />} />
  <Route path="/history" element={<HistoryPage />} />
  <Route path="/history-report" element={<HistoryReportPage />} />
  <Route path="/share" element={<SharePage />} />
</Routes>
```

### 页面说明

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | LandingPage | 首页，展示标语和卡片轮播 |
| `/test` | TestPage | 测试页，拍照+16轮颜色测试 |
| `/result` | ResultPage | 结果页，季型分析+色卡推荐 |
| `/history` | HistoryPage | 历史报告列表 |
| `/history-report` | HistoryReportPage | 历史报告详情 |
| `/share` | SharePage | 分享页面（URL参数传递） |

---

## 状态管理

### AuthContext

用户认证状态通过 React Context 管理：

```javascript
// src/context/AuthContext.jsx
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // 登录、注册、登出方法
  // ...
}
```

### Context 提供的值

| 字段 | 类型 | 说明 |
|------|------|------|
| `user` | Object/null | 当前登录用户信息 |
| `loading` | boolean | 认证状态加载中 |
| `initialized` | boolean | 认证初始化完成 |
| `logout` | Function | 登出方法 |

### 使用方式

```javascript
const { user, initialized } = useContext(AuthContext);

if (!initialized) {
  return <Loading />;
}

if (!user) {
  return <Navigate to="/" />;
}
```

---

## 数据流转

### 测试流程数据流转

```
┌─────────────────┐
│  用户上传照片    │
└────────┬────────┘
         ↓
┌─────────────────┐
│ localStorage    │
│ beautyHue_image │ ─── 暂存用户照片
└────────┬────────┘
         ↓
┌─────────────────┐
│   16轮颜色测试   │
└────────┬────────┘
         ↓
┌─────────────────┐
│ localStorage    │
│ beautyHue_scores│ ─── 暂存每轮评分
└────────┬────────┘
         ↓
┌─────────────────┐
│  计算最终结果    │
└────────┬────────┘
         ↓
┌─────────────────┐
│ localStorage    │
│ beautyHue_systemHistory│ ─── 五维数据
└────────┬────────┘
         ↓
┌─────────────────┐
│   展示结果页     │
└────────┬────────┘
         ↓
    ┌────┴────┐
    ↓         ↓
┌───────┐ ┌───────┐
│ 保存  │ │ 分享  │
│ 到云端│ │ 卡片  │
└───┬───┘ └───────┘
    ↓
┌─────────────────┐
│   Supabase      │
│  user_reports   │
└─────────────────┘
```

### 测试流程策略

**两阶段测试**：

| 阶段 | 轮次 | 测试色 | 目的 |
|------|------|--------|------|
| **阶段1** | 12轮 | 极端测试色 | 初筛：拉开季型差异 |
| **阶段2** | 4轮 | 日常适配色 | 精筛：Top4 季型验证 |

**最少轮次**：8轮（阶段1 可提前结束）
**总轮次**：16轮（阶段1 12轮 + 阶段2 4轮）

**阶段2 触发条件**：
- 完成阶段1全部12轮，或
- 完成8轮后用户选择提交

**阶段2 权重**：得分 × 1.2（日常色验证更关键）

**评分融合公式**：
```
单轮最终得分 = 用户评分 × 0.4 + AI评分 × 0.6
阶段2得分 = 单轮最终得分 × 1.2
```

### 历史报告数据流转

```
┌─────────────────┐
│  用户点击历史   │
└────────┬────────┘
         ↓
┌─────────────────┐
│ 检查登录状态    │
└────────┬────────┘
         ↓ (已登录)
┌─────────────────┐
│ Supabase 查询   │
│ getUserReports  │
└────────┬────────┘
         ↓
┌─────────────────┐
│   展示报告列表   │
└────────┬────────┘
         ↓
┌─────────────────┐
│ 点击查看详情    │
└────────┬────────┘
         ↓
┌─────────────────┐
│ Supabase 查询   │
│ getReportDetail │
└────────┬────────┘
         ↓
┌─────────────────┐
│   展示报告详情   │
└─────────────────┘
```

---

## localStorage 使用

### 存储项列表

| Key | 类型 | 说明 | 生命周期 |
|-----|------|------|----------|
| `beautyHue_user` | JSON | 用户信息缓存 | 登录期间 |
| `beautyHue_image` | Base64 | 用户上传的照片 | 测试流程中 |
| `beautyHue_scores` | JSON | 每轮测试评分 | 测试流程中 |
| `beautyHue_systemHistory` | JSON | 五维分析数据 | 测试流程中 |
| `beautyHue_historyReport` | JSON | 历史报告详情 | 临时缓存 |

### 数据结构示例

```javascript
// beautyHue_scores
[
  { round: 1, color: "#FF3A3A", score: 8, ... },
  { round: 2, color: "#00F0F9", score: 6, ... },
  // ...
]

// beautyHue_systemHistory
[
  {
    roundNumber: 1,
    color: "#FF3A3A",
    colorName: "正红",
    seasonKey: "brightSpring",
    userScore: 8,
    systemScore: 7.5,
    dimensions: {
      skinLift: 8.0,
      warmth: 7.2,
      clarity: 8.5,
      harmony: 7.8,
      vibe: 8.0
    }
  },
  // ...
]
```

---

## Supabase 数据库设计

### 用户管理方案

本项目不创建独立的 `users` 表，直接使用 Supabase Auth 内置用户系统：

| 方案 | 说明 |
|------|------|
| **内置表** | Supabase `auth.users` 已包含 id、email、password_hash、created_at 等 |
| **关联方式** | `user_reports.user_id` 直接使用用户邮箱关联 |
| **RLS 验证** | 通过 `auth.jwt() ->> 'email'` 校验用户身份 |

```
Supabase Auth (auth.users) ←→ user_reports (user_id = email)
```

### user_reports 表

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | 报告ID |
| `user_id` | TEXT | NOT NULL | 用户邮箱 |
| `results` | JSONB | NOT NULL | 诊断结果 |
| `history` | JSONB | NOT NULL | 测试历史数据 |
| `title` | TEXT | | 报告标题 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 创建时间 |

### results 字段结构

```json
[
  {
    "key": "brightSpring",
    "name": "Bright Spring",
    "nameCN": "净春",
    "score": 85.5,
    "rank": 1,
    "dimensions": {
      "skinLift": 8.2,
      "warmth": 7.5,
      "clarity": 8.8,
      "harmony": 7.9,
      "vibe": 8.1
    }
  },
  {
    "key": "coolWinter",
    "name": "Cool Winter",
    "nameCN": "冷冬",
    "score": 78.2,
    "rank": 2,
    "dimensions": { ... }
  }
]
```

### history 字段结构

```json
[
  {
    "roundNumber": 1,
    "color": "#FF3A3A",
    "colorName": "正红",
    "seasonKey": "brightSpring",
    "userScore": 8,
    "systemScore": 7.5,
    "dimensions": {
      "skinLift": 8.0,
      "warmth": 7.2,
      "clarity": 8.5,
      "harmony": 7.8,
      "vibe": 8.0
    }
  }
]
```

### RLS 安全策略

```sql
-- 启用 RLS
ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- 用户只能读取自己的报告
CREATE POLICY "Users can read own reports" ON user_reports
  FOR SELECT
  USING (user_id = auth.jwt() ->> 'email');

-- 用户只能插入自己的报告
CREATE POLICY "Users can insert own reports" ON user_reports
  FOR INSERT
  WITH CHECK (user_id = auth.jwt() ->> 'email');

-- 用户只能删除自己的报告
CREATE POLICY "Users can delete own reports" ON user_reports
  FOR DELETE
  USING (user_id = auth.jwt() ->> 'email');
```

### CRUD 操作

| 操作 | 函数 | 文件 |
|------|------|------|
| 创建 | `saveUserReport()` | `src/utils/userReportService.js` |
| 读取列表 | `getUserReports()` | `src/utils/userReportService.js` |
| 读取详情 | `getReportDetail()` | `src/utils/userReportService.js` |
| 删除 | `deleteUserReport()` | `src/utils/userReportService.js` |

### share_reports 表（分享报告）

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| `id` | UUID | PRIMARY KEY | 报告ID |
| `share_code` | VARCHAR(12) | UNIQUE | 分享码（自动生成） |
| `user_id` | TEXT | | 创建者邮箱（可选） |
| `results` | JSONB | NOT NULL | 诊断结果 |
| `history` | JSONB | NOT NULL | 测试历史 |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 创建时间 |
| `expires_at` | TIMESTAMPTZ | DEFAULT NOW() + 7 days | 过期时间 |
| `is_active` | BOOLEAN | DEFAULT TRUE | 是否有效 |

**RLS 策略**：
- 公开读取：`is_active = true AND expires_at > NOW()`
- 匿名插入：允许任何人创建分享报告

**分享码生成**：通过 PostgreSQL 触发器自动生成 12 位随机码。

---

## 认证流程

### 注册流程

```
用户输入邮箱+密码
       ↓
调用 Supabase Auth signUp()
       ↓
Supabase 发送验证邮件
       ↓
用户点击邮件链接验证
       ↓
注册完成，跳转登录
```

### 登录流程

```
用户输入邮箱+密码
       ↓
调用 Supabase Auth signInWithPassword()
       ↓
验证成功，获取 session
       ↓
更新 AuthContext 状态
       ↓
缓存用户信息到 localStorage
       ↓
登录完成
```

### 密码重置流程

```
用户点击"忘记密码"
       ↓
输入注册邮箱
       ↓
调用 Supabase Auth signInWithOtp()
       ↓
Supabase 发送8位验证码到邮箱
       ↓
用户输入验证码+新密码
       ↓
调用 Supabase Auth verifyOtp()
       ↓
调用 Supabase Auth updateUser()
       ↓
密码重置成功
```

### 认证状态持久化

```javascript
// 监听认证状态变化
supabase.auth.onAuthStateChange((event, session) => {
  if (session?.user) {
    setUser({ email: session.user.email, id: session.user.id });
  } else {
    setUser(null);
  }
});
```

---

## 分享卡片生成

### Canvas 绘制流程

```
用户点击"保存报告"
       ↓
创建 Canvas 元素
       ↓
绘制背景色
       ↓
绘制 Logo
       ↓
绘制用户头像
       ↓
绘制季型标题
       ↓
绘制雷达图 (canvasRadar.js)
       ↓
绘制五维进度条
       ↓
绘制本命色卡 Top 6
       ↓
绘制避雷色卡 Bottom 6
       ↓
导出为 Blob
       ↓
触发下载
```

### 关键函数

```javascript
// src/utils/shareCardGenerator.js
export async function generateShareCard(results, image, history) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // 设置尺寸
  canvas.width = 800;
  canvas.height = 1600;

  // 绘制各部分
  drawBackground(ctx);
  drawLogo(ctx);
  drawRadarChart(ctx, dimensions);
  drawColorChips(ctx, bestColors, avoidColors);
  // ...

  // 导出为 Blob
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/png');
  });
}
```

---

## 动画实现方案

### 卡片轮播动画

```javascript
// Framer Motion 实现
<motion.div
  drag="x"
  dragConstraints={{ left: -Infinity, right: Infinity }}
  animate={{ x }}
>
  {cards.map((card) => (
    <motion.div
      key={card.id}
      style={{
        opacity: useTransform(x, ...),
        y: useTransform(x, ...),
        scale: useTransform(x, ...),
      }}
    >
      <SeasonCard />
    </motion.div>
  ))}
</motion.div>
```

### 页面切换动画

```javascript
// AnimatePresence 实现页面切换
<AnimatePresence mode="wait">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

### 登录面板动画

```javascript
// 右侧滑入面板
<motion.div
  initial={{ x: '100%' }}
  animate={{ x: 0 }}
  exit={{ x: '100%' }}
  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
>
  <LoginPanel />
</motion.div>
```

---

## 部署方案

### Vercel 部署（推荐）

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
vercel

# 4. 生产部署
vercel --prod
```

### 环境变量配置

在 Vercel Dashboard 中配置：

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### 构建命令

| 命令 | 说明 |
|------|------|
| `npm run build` | 生产构建 |
| `npm run preview` | 本地预览构建结果 |

### 部署检查清单

- [ ] 环境变量已配置
- [ ] Supabase RLS 策略已启用
- [ ] 构建无错误
- [ ] 路由正常工作
- [ ] 登录/注册功能正常
- [ ] 历史报告功能正常

---

## 附录

### 环境变量说明

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `VITE_SUPABASE_URL` | ✅ | Supabase 项目 URL |
| `VITE_SUPABASE_ANON_KEY` | ✅ | Supabase 匿名密钥 |

### 相关文件索引

| 文件 | 说明 |
|------|------|
| `src/lib/supabase.js` | Supabase 客户端配置 |
| `src/utils/authService.js` | 认证服务函数 |
| `src/utils/userReportService.js` | 报告 CRUD 操作 |
| `src/utils/shareCardGenerator.js` | 分享卡片生成 |
| `supabase/auth-schema.sql` | 数据库表结构 |