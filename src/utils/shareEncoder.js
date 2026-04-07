/**
 * 分享数据编码/解码工具
 * 将诊断数据压缩并编码为 URL 安全字符串，用于游客分享链接
 */

import { SEASONS } from '../data/seasonColors';

// 维度键名映射（缩短）
const DIM_KEYS_MAP = {
  skinLift: 'sl',
  warmth: 'wm',
  clarity: 'cl',
  harmony: 'hm',
  vibe: 'vb',
};

const DIM_KEYS_REVERSE = {
  sl: 'skinLift',
  wm: 'warmth',
  cl: 'clarity',
  hm: 'harmony',
  vb: 'vibe',
};

function normalizeBaseUrl(url) {
  return url ? url.replace(/\/+$/, '') : '';
}

export function getShareBaseUrl() {
  const configuredUrl = normalizeBaseUrl(import.meta.env.VITE_PUBLIC_APP_URL);
  if (configuredUrl) {
    return configuredUrl;
  }

  return normalizeBaseUrl(window.location.origin);
}

export function isUsingLocalShareOrigin() {
  const configuredUrl = normalizeBaseUrl(import.meta.env.VITE_PUBLIC_APP_URL);
  if (configuredUrl) {
    return false;
  }

  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

/**
 * 压缩诊断数据用于 URL 编码
 * @param {Object} data - 原始数据
 * @param {Array} data.results - 季型结果 [{ key, score, dimensions }]
 * @param {Array} data.history - 测试历史
 * @returns {Object} 压缩后的数据对象
 */
function compressData(data) {
  const { results, history } = data;

  // 压缩结果数据
  const compressedResults = results.map((r) => ({
    k: r.key, // 季型 key
    s: Math.round(r.score * 10) / 10, // 分数保留1位
    d: r.dimensions
      ? {
          sl: Math.round(r.dimensions.skinLift * 10) / 10,
          wm: Math.round(r.dimensions.warmth * 10) / 10,
          cl: Math.round(r.dimensions.clarity * 10) / 10,
          hm: Math.round(r.dimensions.harmony * 10) / 10,
          vb: Math.round(r.dimensions.vibe * 10) / 10,
        }
      : null,
  }));

  // 压缩历史数据（只保留必要字段）
  const compressedHistory = history.map((h) => ({
    c: h.color, // 颜色
    n: h.colorName, // 颜色名
    k: h.seasonKey, // 季型 key
    us: h.userScore, // 用户分数
    ss: Math.round(h.systemScore * 10) / 10, // 系统分数
    d: h.dimensions
      ? {
          sl: Math.round(h.dimensions.skinLift * 10) / 10,
          wm: Math.round(h.dimensions.warmth * 10) / 10,
          cl: Math.round(h.dimensions.clarity * 10) / 10,
          hm: Math.round(h.dimensions.harmony * 10) / 10,
          vb: Math.round(h.dimensions.vibe * 10) / 10,
        }
      : null,
    p: h.phase, // 阶段
  }));

  return {
    r: compressedResults,
    h: compressedHistory,
  };
}

/**
 * 解压数据
 * @param {Object} data - 压缩的数据对象
 * @returns {Object} 原始格式的数据
 */
function decompressData(data) {
  const { r: results, h: history } = data;

  // 解压结果数据
  const decompressedResults = results.map((r) => ({
    key: r.k,
    score: r.s,
    dimensions: r.d
      ? {
          skinLift: r.d.sl,
          warmth: r.d.wm,
          clarity: r.d.cl,
          harmony: r.d.hm,
          vibe: r.d.vb,
        }
      : null,
    seasonName: SEASONS[r.k]?.nameCN || '',
  }));

  // 解压历史数据
  const decompressedHistory = history.map((h, index) => ({
    color: h.c,
    colorName: h.n,
    seasonKey: h.k,
    userScore: h.us,
    systemScore: h.ss,
    dimensions: h.d
      ? {
          skinLift: h.d.sl,
          warmth: h.d.wm,
          clarity: h.d.cl,
          harmony: h.d.hm,
          vibe: h.d.vb,
        }
      : null,
    phase: h.p,
    roundNumber: index + 1,
  }));

  return {
    results: decompressedResults,
    history: decompressedHistory,
  };
}

/**
 * 将数据编码为 URL 参数字符串
 * @param {Object} data - 要编码的数据
 * @returns {string} URL 安全的字符串
 */
export function encodeShareData(data) {
  try {
    const compressed = compressData(data);
    const jsonStr = JSON.stringify(compressed);
    // 使用 base64 编码，并替换 URL 不安全字符
    const base64 = btoa(encodeURIComponent(jsonStr));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    console.error('编码分享数据失败:', e);
    return '';
  }
}

/**
 * 从 URL 参数字符串解码数据
 * @param {string} encoded - 编码的字符串
 * @returns {Object|null} 解码后的数据，失败返回 null
 */
export function decodeShareData(encoded) {
  try {
    // 恢复 base64 字符
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    // 补齐 padding
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonStr = decodeURIComponent(atob(base64));
    const data = JSON.parse(jsonStr);
    return decompressData(data);
  } catch (e) {
    console.error('解码分享数据失败:', e);
    return null;
  }
}

/**
 * 生成游客分享链接
 * @param {Object} results - 诊断结果
 * @param {Array} history - 测试历史
 * @returns {string} 分享链接
 */
export function generateGuestShareUrl(results, history) {
  const data = { results, history };
  const encoded = encodeShareData(data);
  const baseUrl = getShareBaseUrl();
  return `${baseUrl}/share?d=${encoded}`;
}

/**
 * 生成登录用户分享链接（短链接）
 * @param {string} shareId - 数据库中的分享 ID
 * @returns {string} 分享链接
 */
export function generateUserShareUrl(shareId) {
  const baseUrl = getShareBaseUrl();
  return `${baseUrl}/r/${shareId}`;
}
