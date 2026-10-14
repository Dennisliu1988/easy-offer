#!/usr/bin/env node
/**
 * EasyOffer —— Next-Gen Technical Interview & Practice Arena
 * 零依赖轻量本地服务
 *
 * 核心功能：
 *   1) 静态资源托管：托管 public 目录（index.html、CSS、JS、静态资源）
 *   2) 数据持久化：自动原子读写 data/data.json，换电脑或清缓存不丢失
 *   3) AI 代理中继：POST /api/ai，避免前端直接调用导致跨域（CORS），API Key 安全保存在本地
 *
 * 使用： node server.js [端口]   端口默认 8080，也可使用环境变量 PORT
 * 依赖：纯 Node.js 内置模块（http, fs, path）—— 零 npm install
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || process.env.PORT || 8080;
const DIR = __dirname;
const PUBLIC_DIR = path.join(DIR, 'public');
const HTML_FILE = path.join(PUBLIC_DIR, 'index.html');
const DATA_DIR = path.join(DIR, 'data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

// 启动时确保 data 目录存在
try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}

// MIME 类型映射表
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// AI 服务商预设列表
const PROVIDER_PRESETS = {
  local:       { chatUrl: '', model: '', needKey: false, local: true, models: [] },
  zhipu:       { chatUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', model: 'glm-4-flash', needKey: true,
                 models: ['glm-4-flash', 'glm-4-flash-250414', 'glm-4-air', 'glm-4-plus'] },
  pollinations:{ chatUrl: 'https://text.pollinations.ai/openai', model: 'openai', needKey: false,
                 models: ['openai', 'openai-fast'] },
  siliconflow: { chatUrl: 'https://api.siliconflow.cn/v1/chat/completions', model: 'deepseek-ai/DeepSeek-V3', needKey: true,
                 models: ['deepseek-ai/DeepSeek-V3', 'Qwen/Qwen2.5-7B-Instruct', 'THUDM/glm-4-9b-chat'] },
  deepseek:    { chatUrl: 'https://api.deepseek.com/chat/completions', model: 'deepseek-chat', needKey: true,
                 models: ['deepseek-chat', 'deepseek-reasoner'] },
  custom:      { chatUrl: '', model: '', needKey: true, models: [] }
};

function normalizeProvider(p) {
  return (p && PROVIDER_PRESETS[p]) ? p : 'local';
}

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const d = JSON.parse(raw);
    return d && typeof d === 'object' ? d : null;
  } catch (e) {
    return null;
  }
}

function safeData(d) {
  d = d && typeof d === 'object' ? d : {};
  return {
    bank: Array.isArray(d.bank) ? d.bank : [],
    rounds: Array.isArray(d.rounds) ? d.rounds : [],
    wrong: (d.wrong && typeof d.wrong === 'object') ? d.wrong : {},
    settings: (d.settings && typeof d.settings === 'object') ? d.settings : {},
    user: (d.user && typeof d.user === 'object') ? d.user : { id: 'guest', nickname: '访客极客', role: 'guest' },
    proxyKey: typeof d.proxyKey === 'string' ? d.proxyKey : ''
  };
}

function writeDataAtomic(d) {
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(d, null, 2), 'utf8');
  fs.renameSync(tmp, DATA_FILE);
}

function pickContent(j) {
  if (!j) return '';
  const msg = j.choices && j.choices[0] && j.choices[0].message;
  if (msg) {
    const c = msg.content;
    if (typeof c === 'string' && c.trim()) return c;
    if (Array.isArray(c)) {
      const joined = c.map(p => (typeof p === 'string' ? p : (p && p.text) || '')).join('');
      if (joined.trim()) return joined;
    }
    if (c && typeof c === 'object' && c.text) return c.text;
    if (typeof msg.reasoning === 'string' && msg.reasoning.trim()) return msg.reasoning;
  }
  return typeof j.content === 'string' ? j.content : '';
}

async function callAIOnServer(messages, settings) {
  const s = Object.assign({ provider: 'local', model: '', apiKey: '', baseUrl: '', apiKeys: {} }, settings || {});
  const provider = normalizeProvider(s.provider);
  const preset = PROVIDER_PRESETS[provider];
  if (preset.local) {
    throw new Error('当前为「本地题库出题」模式，无需调用外部 AI。如需 AI 实时生成新题，请在「设置/AI」中配置智谱 GLM 或其他模型。');
  }

  const key = String((s.apiKeys && s.apiKeys[provider]) || s.apiKey || '').trim();
  const models = preset.models || [];
  let model = String(s.model || '').trim();
  if (provider !== 'custom' && models.length && models.indexOf(model) < 0) {
    model = preset.model;
  }
  model = model || preset.model;
  const chatUrl = provider === 'custom' ? String(s.baseUrl || '').trim() : preset.chatUrl;

  if (!chatUrl) throw new Error('请填写自定义接口的完整地址（如 https://api.openai.com/v1/chat/completions）');
  if (!model) throw new Error('请选择或填写模型名');
  if (preset.needKey && !key) throw new Error('请先在「设置/AI」中填写当前服务商的 API Key');

  let resp;
  try {
    resp = await fetch(chatUrl, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, key ? { 'Authorization': 'Bearer ' + key } : {}),
      body: JSON.stringify({ model, messages, temperature: 0.7, stream: false }),
      signal: AbortSignal.timeout(120000)
    });
  } catch (e) {
    throw new Error('请求 AI 接口失败（网络不通或响应超时）：' + String(e && e.message || e));
  }

  const text = await resp.text();
  if (!resp.ok) {
    const detail = text.slice(0, 300).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    throw new Error('AI 接口返回 HTTP ' + resp.status + '：' + (detail || '（无响应体）'));
  }

  let j;
  try {
    j = JSON.parse(text);
  } catch (e) {
    throw new Error('AI 接口返回的不是合法 JSON：' + text.slice(0, 150));
  }

  const out = pickContent(j);
  if (!out) {
    throw new Error('AI 接口未返回有效内容' + (j.error ? '：' + (j.error.message || j.error) : ''));
  }
  return out;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => {
      body += c;
      if (body.length > 10 * 1024 * 1024) req.destroy();
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = (req.url || '/').split('?')[0];

  try {
    // 1. 获取持久化数据
    if (url === '/api/data' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(safeData(readData())));
      return;
    }

    // 2. 保存持久化数据
    if (url === '/api/data' && req.method === 'POST') {
      const body = await readBody(req);
      try {
        const d = safeData(JSON.parse(body));
        writeDataAtomic(d);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: true, timestamp: Date.now() }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: String(e && e.message || e) }));
      }
      return;
    }

    // 3. AI 调用代理
    if (url === '/api/ai' && req.method === 'POST') {
      const body = await readBody(req);
      try {
        const d = JSON.parse(body);
        const data = safeData(readData());
        const settings = Object.assign({}, data.settings || {}, d.settings || {});
        const content = await callAIOnServer(d.messages || [], settings);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ content }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: String(e && e.message || e) }));
      }
      return;
    }

    // 4. 静态文件服务
    let safeSubPath = path.normalize(url === '/' ? '/index.html' : url).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(PUBLIC_DIR, safeSubPath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // 单页应用兜底：若未匹配且为 GET 请求，返回 index.html
    if (req.method === 'GET' && fs.existsSync(HTML_FILE)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(HTML_FILE).pipe(res);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  } catch (e) {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    }
    res.end(JSON.stringify({ error: String(e && e.message || e) }));
  }
});

server.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  ⚡ EasyOffer  (Next-Gen Technical Interview & Practice Arena)');
  console.log('  🌐 本地服务已启动: http://localhost:' + PORT + '/');
  console.log('  💾 数据持久化路径: ' + DATA_FILE);
  console.log('  🛑 停止服务: 请在当前终端按 Ctrl + C');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});
