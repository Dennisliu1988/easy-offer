# frontend-interview-quiz ｜ 前端面试刷题工具

零依赖的前端面试刷题工具：**面试模拟 + 本地题库 + 错题本 + 可选 AI 出题**。
单文件页面 + 一个极简 Node 服务，克隆下来 `node server.js` 就能用。

## 目录结构

```
frontend-interview-quiz/
├── public/            # 前端静态资源（工具页面，单文件零依赖）
│   └── index.html
├── docs/              # 文档
│   └── AI_PROMPT.txt  # AI 出题提示词（想调题目风格改这里）
├── data/              # 运行时数据（首次运行自动生成，已被 git 忽略）
│   └── data.json
├── server.js          # 零依赖 Node 服务入口
├── package.json       # npm start 启动脚本
├── data.sample.json   # data.json 数据结构示例
├── .gitignore
└── README.md
```

## 功能

- **面试模拟**：每轮 40 单选 + 10 多选 + 10 判断 = 60 题；点「生成新一轮」立即进列表（不用等），AI 出题时显示「生成中」，后台好了自动补题
- **交卷评分**：顶部、底部各一个交卷按钮；交卷出分数 + 逐题讲解；每组带交卷状态标识（未作答 / 已交卷·xx% / 生成中）
- **断点续答**：作答实时保存，中途离开可从列表继续；答过的组保留作答状态，可「重新答题」清空重来
- **错题本**：答错自动进错题本，连续答对 2 次自动移出
- **本地题库**：AI 生成的题去重后自动入库，越用越厚；题库页按分类（JS/Vue2/Vue3/HTML/CSS/封装/优化）折叠展示，每题带正确答案与解析
- **AI 出题（可选）**：支持智谱 GLM（免费）/ DeepSeek 等 OpenAI 兼容接口；失败自动回退本地题库，不影响使用
- **数据持久化**：Node 服务模式下自动保存到 `data/data.json`（清缓存、换电脑都不丢）；直接双击 `public/index.html` 也能用，数据存浏览器 localStorage

## 快速开始

```bash
node server.js
# 打开浏览器访问 http://localhost:8080/
```

零依赖，不需要 `npm install`。也可以 `npm start`。端口默认 8080，可用 `node server.js 9000` 或环境变量 `PORT` 修改。

## AI 出题（可选）

页面 → 「设置/AI」→ 选择服务商并填 Key：

| 服务商 | 说明 | Key 申请 |
| --- | --- | --- |
| 本地题库出题（默认） | 无需联网、秒出、永远可用 | — |
| 智谱 GLM | glm-4-flash 免费，最稳，推荐 | https://open.bigmodel.cn/usercenter/apikeys |
| DeepSeek | 便宜好用 | https://platform.deepseek.com/api_keys |
| 免 Key 通道（Pollinations） | 零配置，但可能限流 | — |
| 自定义 | 任意 OpenAI 兼容接口 | — |

Key 只保存在本机 `data/data.json`，通过本机服务端代理转发，不经过浏览器、不上传任何地方。

## 发布到 Gitee

```bash
git init
git add .
git commit -m "init: 前端面试刷题工具"
git branch -M master
git remote add origin https://gitee.com/<你的用户名>/<仓库名>.git
git push -u origin master
```

> 可选：在 Gitee 仓库页面开启 **Gitee Pages**，即可得到在线演示地址。
> 注意 Pages 只有静态页面，AI 出题与数据落盘依赖服务端，Pages 模式下不可用（本地题库出题可用）。

## 安全提醒

`data/data.json` 里可能存有你的 AI 服务 Key，已被 `.gitignore` 排除。
**请不要手动上传该文件**（比如不要整个文件夹拖到 Gitee 网页上传），用 git 推送会自动跳过它。
