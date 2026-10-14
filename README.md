# ⚡ EasyOffer

<div align="center">

**Next-Gen Technical Interview & Practice Arena**  
*轻量化 · 纯本地私有存储 · 用户自有 AI 驱动的技术面试备战考场*

[![Node Version](https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=node.js&logoColor=white)](#)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0%20(Zero)-6366f1)](#)
[![Theme Support](https://img.shields.io/badge/Theme-Light%20%7C%20Dark-f59e0b)](#)
[![i18n Ready](https://img.shields.io/badge/i18n-CN%20%7C%20EN-06b6d4)](#)
[![Aesthetic](https://img.shields.io/badge/Aesthetic-Linear%20%26%20Raycast-8b5cf6)](#)
[![License](https://img.shields.io/badge/License-MIT-f43f5e)](#)

---

### 🌐 Language / 语言切换
**[English](#-english)** | **[简体中文](#-简体中文)**

---

</div>

<br/>

<a id="english"></a>
# 🇬🇧 English

## 📖 Overview

**EasyOffer** is an ultra-lightweight, privacy-first, and aesthetic technical interview practice platform for developers. Designed with a local-first philosophy, EasyOffer eliminates rigid, bloated online question banks—giving you full control over your interview preparation with your own AI models.

### 🌟 Key Highlights

1. **Local-First & Privacy Guaranteed**:
   - We **never pre-bundle fixed static question banks**.
   - All questions, mistake records, and exam history are stored **100% locally** in your `data/data.json`.
   - You generate questions on-demand with AI and build your own private knowledge vault.
2. **Instant Zero-Config Experience**:
   - Pre-configured with a **default free AI channel (no API key required)** for instant out-of-the-box exploration.
   - Seamlessly connect your own API keys (Zhipu GLM-4-Flash, DeepSeek-V3, SiliconFlow, or any custom OpenAI-compatible proxy) for lightning-fast, high-quality generation.
   - Built-in one-click reset to defaults with confirmation safety guard.
3. **Dedicated Single Brand**:
   - The project is named exclusively **EasyOffer**—simple, global, and focused on landing your dream tech offer.
4. **Dual Theme Design System (Light & Dark)**:
   - Default clean **Light Mode** and refined obsidian **Dark Mode** inspired by Linear and Raycast.
   - Smooth transitions, zero horizontal/vertical scrollbar leaks, and responsive sidebar navigation.
5. **Multi-Track Career Scalability**:
   - Active track: **Web Frontend Development**.
   - Architecture ready for **Python Full-Stack**, **AI Agent Engineering**, and **Java Backend Systems**.

---

## ✨ Feature Walkthrough

### 1. 🎯 60-Question Mock Exam Arena
- Modeled strictly after top-tier tech interview assessments: **40 Single Choice + 10 Multiple Choice + 10 Boolean = 60 Questions** (100 points total).
- Real-time auto-saving ensures you can pause, resume, or review anytime.
- Comprehensive score report with instant percentage metrics and granular review breakdown.

### 2. 💡 Smart Mistake Book (20 Qs/Page + Full Explanations)
- Mistaken questions automatically transfer to your personal Mistake Book.
- Clean **20 questions per page** pagination.
- Every card showcases **all options, highlighted correct answers, and in-depth key explanations (`💡 考点精讲`)**.
- Master questions with streak-based graduation: answer correctly twice during mistake drills to graduate.

### 3. 📚 Question Repository with Multi-Dimensional Search
- **Standardized Categories**: Perfectly synced with home exclusion chips (`JavaScript`, `Vue3`, `Vue2`, `React`, `TypeScript`, `HTML/CSS`, `Webpack`, `ECharts`, `Node.js`, `算法与优化`), plus an **`其他` (Others)** category.
- **Multi-Dimensional Search**: Fast real-time fuzzy matching across question stems, categories, question types (single/multiple/boolean), creation timestamps, options, and explanation texts.

### 4. 🚫 Negative Scope Filter (Exclusion Method)
- Default covers the entire engineering stack. Click or type keywords to exclude topics (e.g., exclude `Vue3`, `ECharts`):
  - **AI Generation Engine**: Automatically injects strict negative constraints into prompts to forbid any excluded topics.
  - **Local Bank Sampling**: Filters out any matching questions from local storage.

### 5. ⌨️ Full Keyboard Shortcuts
- Numbers `1 - 4` or Letters `A - D`: Quickly toggle options.
- `Ctrl + Enter` / `⌘ + Enter`: Instantly submit answers.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18.0 or higher** (Node.js 20+ or 22+ recommended)

### Launch Options

#### Option A: Windows Double-Click (Recommended)
Simply double-click `start.bat` in the project root:
```bat
start.bat
```

#### Option B: Terminal Command
```bash
# Start server on default port 8080
node server.js

# Or specify a custom port
node server.js 9000
```

Open your browser and navigate to: **`http://localhost:8080/`**

---

## 🤖 AI Model Configuration

| Provider | Pricing & Characteristic | Setup Guide |
| :--- | :--- | :--- |
| **Default Free (Pollinations)** | **Zero key required, 100% free** | Pre-configured by default. Great for quick first runs. |
| **Zhipu GLM (Recommended)** | **Generous free quota, ultra-fast** | Register at `open.bigmodel.cn` → Generate Key → Model: `glm-4-flash` |
| **DeepSeek Official API** | Top-tier question depth, minimal cost | Register at `platform.deepseek.com` → Generate Key → Model: `deepseek-chat` |
| **SiliconFlow** | Fast mainland CDN, initial credits | Register at `cloud.siliconflow.cn` → Enter Key → Model: `DeepSeek-V3` |
| **Custom (OpenAI Proxy)** | Compatible with any OpenAI endpoint | Fill in `Base URL`, `Model Name`, and `API Key` |

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Description |
| :--- | :--- |
| `1` or `A` | Toggle Option A |
| `2` or `B` | Toggle Option B |
| `3` or `C` | Toggle Option C |
| `4` or `D` | Toggle Option D |
| `Ctrl + Enter` / `⌘ + Enter` | Submit Exam / Hand in paper |

---

<br/>
<hr/>
<br/>

<a id="简体中文"></a>
# 🇨🇳 简体中文

## 📖 项目简介

**EasyOffer** 是一款面向程序员的超轻量、纯本地、高颜值的技术面试刷题备战工具。秉持「本地优先（Local-First）」设计理念，我们不提供僵化捆绑的线上题库，而是将刷题的主动权与数据所有权彻底归还给开发者自己。

### 🌟 核心设计亮点

1. **不预捆绑臃肿题库，纯本地私有存储**：
   - 我们**不预设僵化陈旧的静态题库**；
   - 数据库与错题全部以纯 JSON 形式私有保存在用户本地磁盘（`data/data.json`）；
   - 用户借助大模型按需动态生成题目，边刷边沉淀属于自己的私有面试知识库。
2. **下载即用，配置极简**：
   - 默认预置一条**免费免 Key 的 AI 出题通道**，开箱即可无门槛体验；
   - 强烈建议在「设置 / AI」填入自己的专属大模型 API Key（支持智谱 GLM-4-Flash、DeepSeek、硅基流动、自定义代理等），享受毫秒级出题与顶尖题目深度；
   - 提供**一键恢复默认设置**功能（带防误触二次确认）。
3. **单一专业英文品牌**：
   - 项目唯一命名为 **EasyOffer**（意为轻松拿 Offer，简单、纯粹、专业）。
4. **深浅双色主题设计（默认浅色）**：
   - 默认清新素雅的**浅色模式 (Light)**，同时提供极具高级感的黑曜石**深色模式 (Dark)**；
   - 完美适配主流分辨率，零外溢纵向/横向滚动条，界面平整通透。
5. **多岗位赛道可扩展架构**：
   - 当前已上线：**Web 前端开发**；
   - 架构预留并已支持扩展：**Python 全栈开发**、**AI 应用开发 / Agent**、**Java 后端架构**等。

---

## ✨ 功能全景

### 1. 🎯 60 题全真模拟考场
- 严格对照一线大厂笔试规格构建：**40 道单选 + 10 道多选 + 10 道判断 = 60 题**（满分 100 分）。
- 实时自动保存作答进度，随时可暂停、退出或重新继续。
- 答题结束后生成全景式分析报告，提供逐题正确答案高亮与考点精讲。

### 2. 💡 智能错题本（分页展示 + 题题带答案解析）
- 练习中做错的题自动沉淀进错题本，**每页清晰展示 20 道题目**。
- **每道题均完整展示选项、正确答案高亮与考点精讲（`💡 考点精讲`）**，便于针对性深度复习。
- 支持在错题本中直接发起错题专项突破，连续答对 2 次的题目自动毕业移出。

### 3. 📚 本地题库分类与多维度搜索
- **分类对齐**：本地题库分类与首页排除按钮保持完全一致（`JavaScript`、`Vue3`、`Vue2`、`React`、`TypeScript`、`HTML/CSS`、`Webpack`、`ECharts`、`Node.js`、`算法与优化`），并增加 **`其他`** 作为通用兜底。
- **多维度手动搜索**：支持在本地题库中同时对题干、分类名、题型（单选/多选/判断）、创建日期、选项文本及解析关键词进行极速模糊检索。

### 4. 🚫 智能负向排除法出题
- 默认覆盖全栈前端知识。可点击或输入排除特定技术栈（例如排除 `Vue3`、`ECharts` 等）：
  - **AI 动态出题**：自动向大模型注入强约束负向 Prompt，严禁生成任何与被排除项相关的题干或考点；
  - **题库抽题**：本地引擎严格根据排除词进行全文过滤。

### 5. ⌨️ 全键盘快捷键支持
- 数字键 `1 - 4` 或字母键 `A - D`：快速选中对应选项；
- `Ctrl + Enter` / `⌘ + Enter`：随时快速提交交卷。

---

## 🚀 快速开始

### 环境要求
- **Node.js 18.0 或更高版本**（推荐 Node.js 20+ 或 22+）

### 启动方式

#### 方式一：Windows 双击启动（推荐）
在项目根目录下，直接双击运行：
```bat
start.bat
```

#### 方式二：命令行启动
```bash
# 默认在 8080 端口启动
node server.js

# 或指定自定义端口
node server.js 9000
```

打开浏览器访问 **`http://localhost:8080/`** 即可开启刷题！

---

## 🤖 大模型与出题配置

| 服务商 | 费用与特点 | 配置指南 |
| :--- | :--- | :--- |
| **免费默认通道 (Pollinations)** | **完全免 Key，开箱即用** | EasyOffer 默认启用，适合无 Key 时零门槛试用体验 |
| **智谱 GLM (推荐)** | **免费额度高、速度极快** | 注册 `open.bigmodel.cn` → 创建 API Key → 模型选 `glm-4-flash` |
| **DeepSeek 官方 API** | 极高性价比、题目深度极佳 | 注册 `platform.deepseek.com` → 创建 Key → 模型选 `deepseek-chat` |
| **硅基流动 (SiliconFlow)** | 注册送额度、国内 CDN 极速 | 注册 `cloud.siliconflow.cn` → 填写密钥 → 模型选 `DeepSeek-V3` |
| **自定义 (Custom)** | 兼容任意第三方 OpenAI 代理 | 填入 `baseUrl`、`model` 和 `apiKey` |

---

## 📂 文件目录结构

```
EasyOffer/
├── data/
│   └── data.json              # 本地持久化存储（用户 AI 生成的题目与错题落盘在此）
├── docs/
│   ├── ARCHITECTURE_EVALUATION.md # 架构演进评估报告
│   └── AI_PROMPT.txt          # 出题 Prompt 规范模板与排除法规则
├── public/
│   └── index.html             # EasyOffer 单页应用 (深浅主题、侧边栏、分类搜索、错题分页)
├── package.json               # easyoffer 包描述
├── server.js                  # 零依赖本地 Node.js 静态服务与 AI 中继
├── start.bat                  # Windows 极速双击启动脚本
└── README.md                  # 中英双语说明文档
```

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源。祝你刷题顺畅，轻松拿到心仪 Offer！
