# 🎨 Beauty Hue

**个人色彩诊断应用** — 基于12季型色彩理论，帮助你找到真正适合自己的色彩搭配方案。

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3FCF8E?logo=supabase)

---

## 📖 项目背景

每个人都有属于自己的"本命色"——那些能让肤色更亮、气色更好、气质更出众的颜色。Beauty Hue 通过科学的色彩分析方法，帮助你找到专属的季型定位，告别穿搭踩雷，轻松打造适合自己的色彩风格。

---

## ✨ 功能特性

### 🎯 智能色彩诊断

基于 **12季型色彩理论**（春、夏、秋、冬各3种），通过16轮颜色匹配测试，精准定位你的主季型和次季型。

### 📊 五维深度分析

每一轮测试都会从5个维度进行评分：

| 维度 | 说明 |
|------|------|
| ✨ 肤色提亮 | 颜色是否让肤色看起来更明亮通透 |
| 🌡️ 冷暖匹配 | 颜色冷暖调与肤色冷暖调的匹配程度 |
| 👁️ 五官清晰 | 颜色是否让五官轮廓更加清晰立体 |
| ⚖️ 对比和谐 | 颜色与整体形象的对比度是否协调 |
| 💫 气质匹配 | 颜色是否符合你的气质特征 |

### 🃏 首页卡片轮播

- 12张精美的季型卡片，展示每种季型的核心色彩
- 无限循环自动轮播，支持拖拽交互
- 左侧卡片淡出折叠效果，右侧卡片淡入展示
- 悬浮卡片放大交互

### 📋 诊断结果展示

- **主季型 & 次季型**：双季型定位，更全面了解自己的色彩属性
- **五维雷达图**：直观展示各维度得分
- **本命色卡 Top 6**：最适合你的6种颜色
- **避雷色卡 Bottom 6**：建议远离的6种颜色
- **测试色卡详情**：点击任意色卡查看该颜色的五维分析

### 💾 云端保存报告

- 登录用户可将诊断报告保存到云端
- 支持保存多份报告，随时查看历史记录
- 报告包含完整的诊断结果和测试数据

### 📤 分享功能

- 一键生成精美的分享卡片图片
- 包含季型、雷达图、本命色卡等完整信息
- 支持下载保存到本地

### 🔐 用户系统

- 邮箱 + 密码注册 / 登录
- 忘记密码支持邮箱验证码重置
- 基于 Supabase Auth 的安全认证
- 跨设备数据同步

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm 或 pnpm

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/Haloooooooooooooooooo/Beauty-Hue.git

# 2. 进入项目目录
cd Beauty-Hue

# 3. 安装依赖
npm install
```

### 环境变量配置

在项目根目录创建 `.env.local` 文件：

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 运行命令

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

---

## 🛠 技术栈

| 类别 | 技术 | 用途 |
|------|------|------|
| ⚛️ 前端框架 | React 19 | 组件化开发 |
| ⚡ 构建工具 | Vite 8 | 快速开发与构建 |
| 🎨 样式方案 | Tailwind CSS 3.x | 原子化 CSS |
| 🎬 动画库 | Framer Motion 12 | 流畅动画效果 |
| 🔥 后端服务 | Supabase | Auth + Database |
| 🗺️ 路由管理 | React Router 7 | SPA 路由 |
| 🖼️ 图片生成 | Canvas API | 分享卡片绘制 |

---

## 📁 项目结构

```
src/
├── 📂 components/          # 可复用组件
│   ├── 📂 auth/           # 登录/注册面板
│   ├── 📂 landing/        # 首页组件（卡片轮播、Hero区域）
│   ├── 📂 layout/         # 布局组件（导航栏）
│   ├── 📂 result/         # 结果页组件（雷达图、色卡、分享按钮）
│   └── 📂 test/           # 测试页组件（摄像头、评分控件）
├── 📂 context/            # React Context
│   └── AuthContext.jsx    # 认证状态管理
├── 📂 data/               # 静态数据
│   ├── seasonColors.js    # 12季型颜色配置（极端色+日常色+本命色系）
│   └── testSequence.js    # 测试序列逻辑（阶段1/阶段2）
├── 📂 engine/             # 核心算法
│   ├── colorAnalyzer.js   # 肤色采样 + 五维评分计算
│   └── frameSnapshot.js   # 相纸框截图生成
├── 📂 lib/                # 第三方库配置
│   └── supabase.js        # Supabase 客户端
├── 📂 pages/              # 页面组件
│   ├── LandingPage.jsx    # 首页
│   ├── TestPage.jsx       # 测试页
│   ├── ResultPage.jsx     # 结果页
│   ├── SharePage.jsx      # 分享页面
│   ├── HistoryPage.jsx    # 历史报告列表
│   └── HistoryReportPage.jsx  # 历史报告详情
├── 📂 styles/             # 全局样式
│   └── index.css          # Tailwind + 自定义样式（牛皮纸纹理）
└── 📂 utils/              # 工具函数
    ├── authService.js     # 认证服务（注册/登录/密码重置）
    ├── userReportService.js  # 用户报告 CRUD
    ├── shareReportService.js # 分享报告服务
    ├── shareCardGenerator.js # Canvas 分享卡片生成
    ├── canvasRadar.js     # Canvas 雷达图绘制
    └── shareEncoder.js    # 分享链接编码
```

---

## 📚 扩展文档

| 文档 | 说明 |
|------|------|
| 📖 [色彩理论与诊断逻辑](./docs/COLOR_THEORY.md) | 12季型理论、标准测试色、两阶段测试策略、五维评分计算 |
| 🏗️ [技术架构与数据库设计](./docs/ARCHITECTURE.md) | 系统架构、数据流转、Supabase 表结构（user_reports + share_reports） |
| 🧪 [色彩测试原理](./docs/colourtest_principle.md) | 测试流程 Prompt、评分维度定义、季型判断算法 |
| 🎨 [12季型色彩完整版](./docs/12型季节色彩完整版（含颜色名称+HEX色值）.md) | 各季型完整色彩库（本命色系 + 避雷色系） |

---

## 📄 License

MIT License © Beauty Hue