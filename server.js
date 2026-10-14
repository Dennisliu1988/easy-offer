#!/usr/bin/env node
/**
 * 前端面试刷题器 —— 零依赖本地服务
 * 作用：
 *   1) 托管 public/index.html（访问 http://localhost:PORT/ 即用）
 *   2) 把所有数据自动读写到 data/data.json（原子写入，不会清缓存就丢）
 *   3) 代理 AI 出题请求（POST /api/ai），避免浏览器跨域(CORS)，API Key 只存在本机
 *
 * 使用： node server.js [端口]   端口默认 8080，也可用环境变量 PORT
 * 依赖：仅 Node 内置模块（无需 npm install）
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || process.env.PORT || 8080;
const DIR = __dirname;
const HTML_FILE = path.join(DIR, 'public', 'index.html');
const DATA_DIR = path.join(DIR, 'data');
const DATA_FILE = path.join(DATA_DIR, 'data.json');
// 数据目录（data.json 自动生成于此，启动时确保存在）
try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch (e) {}

// 与前端保持一致的服务商预设（原 aitools.cfd 公益代理已失效；默认改为本地题库出题）
const PROVIDER_PRESETS = {
  local:      { chatUrl: '', model: '', needKey: false, local: true, models: [] },
  zhipu:      { chatUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', model: 'glm-4-flash', needKey: true,
                models: ['glm-4-flash','glm-4-flash-250414','glm-4-air','glm-4-plus'] },
  pollinations:{ chatUrl: 'https://text.pollinations.ai/openai', model: 'openai', needKey: false,
                models: ['openai','openai-fast'] },
  siliconflow:{ chatUrl: 'https://api.siliconflow.cn/v1/chat/completions', model: 'deepseek-ai/DeepSeek-V3', needKey: true,
                models: ['deepseek-ai/DeepSeek-V3','Qwen/Qwen2.5-7B-Instruct','THUDM/glm-4-9b-chat'] },
  deepseek:   { chatUrl: 'https://api.deepseek.com/chat/completions', model: 'deepseek-chat', needKey: true,
                models: ['deepseek-chat','deepseek-reasoner'] },
  custom:     { chatUrl: '', model: '', needKey: true, models: [] }
};
function normalizeProvider(p) { return (p && PROVIDER_PRESETS[p]) ? p : 'local'; }

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const d = JSON.parse(raw);
    return d && typeof d === 'object' ? d : null;
  } catch (e) { return null; }
}
function emptyData() { return { bank: [], rounds: [], wrong: {}, settings: {}, proxyKey: '' }; }
function safeData(d) {
  d = d && typeof d === 'object' ? d : {};
  return {
    bank: Array.isArray(d.bank) ? d.bank : [],
    rounds: Array.isArray(d.rounds) ? d.rounds : [],
    wrong: (d.wrong && typeof d.wrong === 'object') ? d.wrong : {},
    settings: (d.settings && typeof d.settings === 'object') ? d.settings : {},
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
    // 有些模型（如 gpt-oss 系列）把内容写进 reasoning 字段
    if (typeof msg.reasoning === 'string' && msg.reasoning.trim()) return msg.reasoning;
  }
  return typeof j.content === 'string' ? j.content : '';
}

async function callAIOnServer(messages, settings) {
  const s = Object.assign({ provider: 'local', model: '', apiKey: '', baseUrl: '', apiKeys: {} }, settings || {});
  const provider = normalizeProvider(s.provider);
  const preset = PROVIDER_PRESETS[provider];
  if (preset.local) throw new Error('当前为「本地题库出题」模式，不需要调用 AI。想用 AI 出题请在「设置/AI」里选择智谱 GLM 等接口。');
  const key = String((s.apiKeys && s.apiKeys[provider]) || s.apiKey || '').trim();
  const models = preset.models || [];
  let model = String(s.model || '').trim();
  // 若设置里残留了别的服务商的模型名，自动回落到当前服务商的默认模型
  if (provider !== 'custom' && models.length && models.indexOf(model) < 0) model = preset.model;
  model = model || preset.model;
  const chatUrl = provider === 'custom' ? String(s.baseUrl || '').trim() : preset.chatUrl;

  if (!chatUrl) throw new Error('请填写自定义接口的完整地址（形如 https://xxx/v1/chat/completions）');
  if (!model) throw new Error('请选择或填写模型名');
  if (preset.needKey && !key) throw new Error('请先在「设置/AI」中填写该接口的 API Key');

  let resp;
  try {
    resp = await fetch(chatUrl, {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, key ? { 'Authorization': 'Bearer ' + key } : {}),
      body: JSON.stringify({ model, messages, temperature: 0.7, stream: false }),
      signal: AbortSignal.timeout(120000)
    });
  } catch (e) {
    throw new Error('请求 AI 接口失败（网络不通或超时）：' + String(e && e.message || e));
  }
  const text = await resp.text();
  if (!resp.ok) {
    const detail = text.slice(0, 300).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    throw new Error('AI 接口返回 ' + resp.status + '：' + (detail || '（无内容）'));
  }
  let j;
  try { j = JSON.parse(text); }
  catch (e) { throw new Error('AI 接口返回的不是 JSON（可能被网关拦截）：' + text.slice(0, 150)); }
  const out = pickContent(j);
  if (!out) throw new Error('AI 接口未返回有效内容' + (j.error ? '：' + (j.error.message || j.error) : ''));
  return out;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 5 * 1024 * 1024) req.destroy(); });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  const url = (req.url || '/').split('?')[0];

  try {
    if (url === '/' || url === '/index.html') {
      try {
        const html = fs.readFileSync(HTML_FILE, 'utf8');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
      } catch (e) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('未找到 public/index.html（请确认文件是否被移动）'); }
      return;
    }

    if (url === '/api/data' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(safeData(readData())));
      return;
    }

    if (url === '/api/data' && req.method === 'POST') {
      const body = await readBody(req);
      try {
        const d = safeData(JSON.parse(body));
        writeDataAtomic(d);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: false, error: String(e && e.message || e) }));
      }
      return;
    }

    if (url === '/api/ai' && req.method === 'POST') {
      const body = await readBody(req);
      try {
        const d = JSON.parse(body);
        const data = safeData(readData());
        // 优先使用前端传来的最新设置（避免刚改完设置还没同步就测试/出题）
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

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  } catch (e) {
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: String(e && e.message || e) }));
  }
});

server.listen(PORT, () => {
  console.log('前端面试刷题器 已启动 ✅');
  console.log('  打开浏览器访问： http://localhost:' + PORT + '/');
  console.log('  数据自动保存到： ' + DATA_FILE);
  console.log('  停止服务： 在终端按 Ctrl + C');
});
