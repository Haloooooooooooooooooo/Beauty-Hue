"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
 * 分享卡片生成器
 * 使用 Canvas API 绘制完整的个人色彩诊断报告卡片
 */

var _canvasRadar = require('./canvasRadar');
var _seasonColors = require('../data/seasonColors');


// 卡片配置
const CONFIG = {
  width: 440,
  padding: 32,
  bgColor: '#F7F2EA',
  cardBg: '#FFFFFF',
  navy: '#162660',
  text: '#3A3A3A',
  muted: '#8A8A8A',
  borderRadius: 24,
};

// 五维维度配置
const DIMENSION_NAMES = {
  skinLift: '肤色提亮',
  warmth: '冷暖匹配',
  clarity: '五官清晰',
  harmony: '对比和谐',
  vibe: '气质匹配',
};

/**
 * 计算轮次的最终得分（用于排序）
 */
function getRoundFinalScore(round) {
  const normalizedUserScore = (round.userScore || 0) / 10;
  const normalizedAiScore = round.systemScore || 0;
  return normalizedUserScore * 0.4 + normalizedAiScore * 0.6;
}

/**
 * 绘制圆角矩形
 */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * 绘制进度条
 */
function drawProgressBar(ctx, x, y, width, value, max = 10) {
  const height = 6;
  const radius = 3;

  // 背景
  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  roundRect(ctx, x, y, width, height, radius);
  ctx.fill();

  // 进度
  const progressWidth = Math.max(0, Math.min(width, (value / max) * width));
  if (progressWidth > 0) {
    ctx.fillStyle = _canvasRadar.NAVY;
    roundRect(ctx, x, y, progressWidth, height, radius);
    ctx.fill();
  }
}

/**
 * 绘制色卡块
 */
function drawColorChip(ctx, x, y, size, color, name) {
  // 色块
  ctx.fillStyle = color;
  roundRect(ctx, x, y, size, size, 8);
  ctx.fill();

  // 边框
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 1;
  ctx.stroke();
}

/**
 * 绘制测试颜色详情卡片
 */
function drawColorDetailCard(ctx, x, y, width, round, isGood) {
  const height = 80;
  const padding = 12;

  // 卡片背景
  ctx.fillStyle = isGood ? 'rgba(34,197,94,0.08)' : 'rgba(249,115,22,0.08)';
  roundRect(ctx, x, y, width, height, 12);
  ctx.fill();

  ctx.strokeStyle = isGood ? 'rgba(34,197,94,0.2)' : 'rgba(249,115,22,0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // 色块
  const chipSize = 28;
  drawColorChip(ctx, x + padding, y + padding, chipSize, round.color, round.colorName);

  // 名称和轮次
  ctx.font = 'bold 12px Inter, system-ui, sans-serif';
  ctx.fillStyle = CONFIG.text;
  ctx.textAlign = 'left';
  ctx.fillText(`${round.colorName} · 第${round.roundNumber}轮`, x + padding + chipSize + 8, y + padding + 10);

  // 季型标签
  ctx.font = '11px Inter, system-ui, sans-serif';
  ctx.fillStyle = CONFIG.muted;
  const seasonName = _optionalChain([_seasonColors.SEASONS, 'access', _ => _[round.seasonKey], 'optionalAccess', _2 => _2.nameCN]) || '';
  ctx.fillText(seasonName + '季型', x + padding + chipSize + 8, y + padding + 26);

  // 五维数据
  const dims = round.dimensions || {};
  const dimLabels = ['提亮', '冷暖', '清晰', '和谐', '气质'];
  const dimKeys = ['skinLift', 'warmth', 'clarity', 'harmony', 'vibe'];

  ctx.font = '10px Inter, system-ui, sans-serif';
  const dimY = y + padding + 44;
  const dimSpacing = (width - padding * 2) / 5;

  dimKeys.forEach((key, i) => {
    const val = dims[key] || 0;
    const dx = x + padding + i * dimSpacing;
    ctx.fillStyle = CONFIG.muted;
    ctx.textAlign = 'left';
    ctx.fillText(dimLabels[i], dx, dimY);
    ctx.fillStyle = val >= 7 ? _canvasRadar.NAVY : CONFIG.text;
    ctx.fillText(val.toFixed(1), dx, dimY + 14);
  });
}

/**
 * 生成分享卡片
 * @param {Array} results - 计算后的季型结果 [{ key, score, dimensions }]
 * @param {string} userImage - 用户头像 Base64
 * @param {Array} systemHistory - 测试历史数据
 * @returns {Promise<Blob>} PNG 图片 Blob
 */
 async function generateShareCard(results, userImage, systemHistory) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // 计算卡片高度（动态）
  const radarSize = 160;
  const radarWithLabel = radarSize + 60;

  // 固定部分高度
  let totalHeight = CONFIG.padding * 2;
  totalHeight += 60; // Logo + 标题
  totalHeight += 120; // 用户头像区
  totalHeight += 20; // 间距

  // 主季型区域
  totalHeight += 40; // 标题
  totalHeight += radarWithLabel + 20; // 雷达图
  totalHeight += 120; // 五维进度条
  totalHeight += 50; // 描述
  totalHeight += 20; // 间距

  // 次季型区域（如果有）
  const secondaryResult = _optionalChain([results, 'optionalAccess', _3 => _3[1]]);
  if (secondaryResult) {
    totalHeight += 40; // 标题
    totalHeight += radarWithLabel + 20;
    totalHeight += 100; // 五维进度条（简化版）
    totalHeight += 20;
  }

  // 本命色卡
  totalHeight += 50; // 标题 + 色卡
  totalHeight += 16;

  // 避雷色卡
  totalHeight += 50;
  totalHeight += 16;

  // 测试颜色详情（两列，Top6 + Bottom6）
  totalHeight += 40; // 标题
  const colorDetailRows = 6; // 12个色卡分两列，6行
  totalHeight += colorDetailRows * (80 + 8);

  // 底部品牌
  totalHeight += 60;

  canvas.width = CONFIG.width;
  canvas.height = totalHeight;

  // 绘制背景
  ctx.fillStyle = CONFIG.bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let currentY = CONFIG.padding;

  // ========== Logo + 标题 ==========
  ctx.font = 'bold 18px Inter, system-ui, sans-serif';
  ctx.fillStyle = _canvasRadar.NAVY;
  ctx.textAlign = 'left';
  ctx.fillText('BEAUTY HUE', CONFIG.padding, currentY + 14);

  ctx.font = '12px Inter, system-ui, sans-serif';
  ctx.fillStyle = CONFIG.muted;
  ctx.fillText('发现你的色彩', CONFIG.padding, currentY + 34);
  currentY += 60;

  // ========== 用户头像区 ==========
  // 绘制头像（圆形）
  if (userImage) {
    try {
      const avatarImg = new Image();
      avatarImg.src = userImage;
      await new Promise((resolve) => {
        avatarImg.onload = resolve;
        avatarImg.onerror = resolve;
      });

      const avatarSize = 80;
      const avatarX = CONFIG.width / 2 - avatarSize / 2;

      // 圆形裁剪
      ctx.save();
      ctx.beginPath();
      ctx.arc(CONFIG.width / 2, currentY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatarImg, avatarX, currentY, avatarSize, avatarSize);
      ctx.restore();

      // 边框
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(CONFIG.width / 2, currentY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
      ctx.stroke();
    } catch (e) {
      // 头像加载失败，绘制占位
      ctx.fillStyle = '#E0E0E0';
      ctx.beginPath();
      ctx.arc(CONFIG.width / 2, currentY + 40, 40, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  currentY += 120 + 20;

  // ========== 主季型 ==========
  const primaryResult = _optionalChain([results, 'optionalAccess', _4 => _4[0]]);
  const primarySeason = primaryResult ? _seasonColors.SEASONS[primaryResult.key] : null;

  if (primarySeason && primaryResult) {
    // 标题
    ctx.fillStyle = _canvasRadar.NAVY;
    ctx.font = 'bold 14px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('主季型', CONFIG.padding, currentY);
    currentY += 40;

    // 季型卡片背景
    const cardWidth = CONFIG.width - CONFIG.padding * 2;
    const cardHeight = radarWithLabel + 120 + 50;
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    roundRect(ctx, CONFIG.padding, currentY, cardWidth, cardHeight, CONFIG.borderRadius);
    ctx.fill();

    const cardContentY = currentY + 20;
    const radarCenterX = CONFIG.padding + 100;
    const radarCenterY = cardContentY + radarSize / 2 + 10;
    const radarRadius = radarSize * 0.38;

    // 雷达图
    _canvasRadar.drawRadar.call(void 0, ctx, primaryResult.dimensions, radarCenterX, radarCenterY, radarRadius, true);

    // 季型信息（右侧）
    const infoX = CONFIG.padding + 200;
    ctx.font = 'bold 20px Inter, system-ui, sans-serif';
    ctx.fillStyle = _canvasRadar.NAVY;
    ctx.textAlign = 'left';
    ctx.fillText(primarySeason.nameCN, infoX, cardContentY + 10);

    ctx.font = '14px Inter, system-ui, sans-serif';
    ctx.fillStyle = CONFIG.muted;
    ctx.fillText(primarySeason.name, infoX, cardContentY + 32);

    ctx.font = 'bold 16px Inter, system-ui, sans-serif';
    ctx.fillStyle = _canvasRadar.NAVY;
    ctx.fillText(`综合评分：${primaryResult.score.toFixed(1)}`, infoX, cardContentY + 58);

    // 五维进度条（雷达图下方）
    const progressBarY = radarCenterY + radarRadius + 40;
    const barWidth = cardWidth - 40;
    const barSpacing = 22;

    _canvasRadar.KEYS.forEach((key, index) => {
      const value = _optionalChain([primaryResult, 'access', _5 => _5.dimensions, 'optionalAccess', _6 => _6[key]]) || 0;
      const barY = progressBarY + index * barSpacing;

      ctx.font = '12px Inter, system-ui, sans-serif';
      ctx.fillStyle = CONFIG.text;
      ctx.textAlign = 'left';
      ctx.fillText(DIMENSION_NAMES[key], CONFIG.padding + 20, barY);

      drawProgressBar(ctx, CONFIG.padding + 110, barY - 6, barWidth - 100, value);

      ctx.textAlign = 'right';
      ctx.fillStyle = value >= 7 ? _canvasRadar.NAVY : CONFIG.text;
      ctx.fillText(value.toFixed(1), CONFIG.padding + cardWidth - 20, barY);
    });

    // 描述
    const descY = progressBarY + _canvasRadar.KEYS.length * barSpacing + 16;
    ctx.font = 'italic 13px Inter, system-ui, sans-serif';
    ctx.fillStyle = CONFIG.text;
    ctx.textAlign = 'center';
    ctx.fillText(`"${primarySeason.description}"`, CONFIG.width / 2, descY);

    currentY += cardHeight + 20;
  }

  // ========== 次季型 ==========
  if (secondaryResult) {
    const secondarySeason = _seasonColors.SEASONS[secondaryResult.key];

    ctx.fillStyle = _canvasRadar.NAVY;
    ctx.font = 'bold 14px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('次季型', CONFIG.padding, currentY);
    currentY += 40;

    const cardWidth = CONFIG.width - CONFIG.padding * 2;
    const cardHeight = radarWithLabel + 80;
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    roundRect(ctx, CONFIG.padding, currentY, cardWidth, cardHeight, CONFIG.borderRadius);
    ctx.fill();

    const cardContentY = currentY + 20;
    const radarCenterX = CONFIG.padding + 90;
    const radarCenterY = cardContentY + radarSize / 2 + 5;
    const radarRadius = radarSize * 0.32;

    _canvasRadar.drawRadar.call(void 0, ctx, secondaryResult.dimensions, radarCenterX, radarCenterY, radarRadius, true);

    const infoX = CONFIG.padding + 180;
    ctx.font = 'bold 18px Inter, system-ui, sans-serif';
    ctx.fillStyle = _canvasRadar.NAVY;
    ctx.textAlign = 'left';
    ctx.fillText(_optionalChain([secondarySeason, 'optionalAccess', _7 => _7.nameCN]) || '', infoX, cardContentY + 10);

    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.fillStyle = CONFIG.muted;
    ctx.fillText(_optionalChain([secondarySeason, 'optionalAccess', _8 => _8.name]) || '', infoX, cardContentY + 28);

    ctx.font = 'bold 14px Inter, system-ui, sans-serif';
    ctx.fillStyle = _canvasRadar.NAVY;
    ctx.fillText(`综合评分：${secondaryResult.score.toFixed(1)}`, infoX, cardContentY + 48);

    currentY += cardHeight + 20;
  }

  // ========== 本命色卡 Top 6 ==========
  // 排序获取 Top 6
  const displayRounds = systemHistory.map((entry, index) => ({
    ...entry,
    roundNumber: index + 1,
  }));
  const rankedRounds = [...displayRounds].sort((a, b) => getRoundFinalScore(b) - getRoundFinalScore(a));
  const bestRounds = rankedRounds.slice(0, 6);

  ctx.fillStyle = _canvasRadar.NAVY;
  ctx.font = 'bold 12px Inter, system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('本命色卡 · Top 6', CONFIG.padding, currentY + 8);
  ctx.font = '10px Inter, system-ui, sans-serif';
  ctx.fillStyle = CONFIG.muted;
  ctx.fillText('最适合靠近面部使用', CONFIG.padding + 120, currentY + 8);

  currentY += 24;
  const chipSize = 36;
  const chipGap = 8;
  const chipsStartX = CONFIG.padding;

  bestRounds.forEach((round, i) => {
    const x = chipsStartX + i * (chipSize + chipGap);
    drawColorChip(ctx, x, currentY, chipSize, round.color, round.colorName);
  });
  currentY += chipSize + 16;

  // ========== 避雷色卡 Bottom 6 ==========
  const worstRounds = [...rankedRounds].reverse().slice(0, 6);

  ctx.fillStyle = '#DC2626';
  ctx.font = 'bold 12px Inter, system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('避雷色卡 · Bottom 6', CONFIG.padding, currentY + 8);
  ctx.font = '10px Inter, system-ui, sans-serif';
  ctx.fillStyle = CONFIG.muted;
  ctx.fillText('建议减少靠近面部使用', CONFIG.padding + 130, currentY + 8);

  currentY += 24;
  worstRounds.forEach((round, i) => {
    const x = chipsStartX + i * (chipSize + chipGap);
    drawColorChip(ctx, x, currentY, chipSize, round.color, round.colorName);
  });
  currentY += chipSize + 16;

  // ========== 测试颜色详情 ==========
  ctx.fillStyle = _canvasRadar.NAVY;
  ctx.font = 'bold 12px Inter, system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('测试颜色详情', CONFIG.padding, currentY + 8);
  currentY += 32;

  const detailCardWidth = (CONFIG.width - CONFIG.padding * 2 - 12) / 2;
  const detailCardGap = 12;

  // Top 6 详情（左列）+ Bottom 6 详情（右列）
  for (let row = 0; row < 6; row++) {
    const best = bestRounds[row];
    const worst = worstRounds[row];

    if (best) {
      drawColorDetailCard(ctx, CONFIG.padding, currentY, detailCardWidth, best, true);
    }
    if (worst) {
      drawColorDetailCard(ctx, CONFIG.padding + detailCardWidth + detailCardGap, currentY, detailCardWidth, worst, false);
    }

    currentY += 80 + 8;
  }

  // ========== 底部品牌标识 ==========
  ctx.fillStyle = 'rgba(0,0,0,0.03)';
  ctx.fillRect(0, currentY, canvas.width, 60);

  ctx.font = 'bold 12px Inter, system-ui, sans-serif';
  ctx.fillStyle = _canvasRadar.NAVY;
  ctx.textAlign = 'center';
  ctx.fillText('BEAUTY HUE · 发现你的色彩', CONFIG.width / 2, currentY + 24);

  ctx.font = '10px Inter, system-ui, sans-serif';
  ctx.fillStyle = CONFIG.muted;
  ctx.fillText('beautyhue.com', CONFIG.width / 2, currentY + 42);

  // 转换为 Blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png', 0.9);
  });
} exports.generateShareCard = generateShareCard;