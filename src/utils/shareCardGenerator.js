/**
 * 分享卡片生成器
 * 使用 Canvas API 绘制完整的个人色彩诊断报告卡片
 */

import { drawRadar, KEYS, NAVY } from './canvasRadar';
import { SEASONS } from '../data/seasonColors';

const CONFIG = {
  width: 440,
  padding: 32,
  bgColor: '#F7F2EA',
  text: '#3A3A3A',
  muted: '#8A8A8A',
  borderRadius: 24,
};

const DIMENSION_NAMES = {
  skinLift: '肤色提亮',
  warmth: '冷暖匹配',
  clarity: '五官清晰',
  harmony: '对比和谐',
  vibe: '气质匹配',
};

function getRoundFinalScore(round) {
  const normalizedUserScore = (round.userScore || 0) / 10;
  const normalizedAiScore = round.systemScore || 0;
  return normalizedUserScore * 0.4 + normalizedAiScore * 0.6;
}

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

function drawProgressBar(ctx, x, y, width, value, max = 10) {
  const height = 6;
  const radius = 3;

  ctx.fillStyle = 'rgba(0,0,0,0.05)';
  roundRect(ctx, x, y, width, height, radius);
  ctx.fill();

  const progressWidth = Math.max(0, Math.min(width, (value / max) * width));
  if (progressWidth > 0) {
    ctx.fillStyle = NAVY;
    roundRect(ctx, x, y, progressWidth, height, radius);
    ctx.fill();
  }
}

function drawColorChip(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  roundRect(ctx, x, y, size, size, 8);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 1;
  ctx.stroke();
}

function wrapText(ctx, text, maxWidth) {
  if (!text) return [''];

  const normalized = String(text).replace(/\s+/g, ' ').trim();
  if (!normalized) return [''];

  const lines = [];
  let current = '';

  for (const char of normalized) {
    const next = current + char;
    if (current && ctx.measureText(next).width > maxWidth) {
      lines.push(current);
      current = char;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const lines = wrapText(ctx, text, maxWidth);
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
  return lines.length;
}

function getSeasonCardMetrics(ctx, description) {
  const radarSize = 160;
  const radarWithLabel = radarSize + 60;
  const progressHeight = 120;
  const descriptionLineHeight = 18;

  ctx.font = 'italic 13px Inter, system-ui, sans-serif';
  const descriptionLines = wrapText(ctx, `"${description || ''}"`, CONFIG.width - CONFIG.padding * 2 - 40);
  const descriptionHeight = Math.max(descriptionLineHeight, descriptionLines.length * descriptionLineHeight);

  return {
    titleHeight: 40,
    radarSize,
    cardHeight: radarWithLabel + progressHeight + descriptionHeight + 36,
    descriptionLineHeight,
  };
}

function drawSeasonCard(ctx, title, result, season, currentY, options = {}) {
  const {
    bgColor = 'rgba(255,255,255,0.6)',
    radarCenterX = CONFIG.padding + 100,
    radarCenterYOffset = 10,
    radarScale = 0.38,
    infoX = CONFIG.padding + 200,
    nameFont = 'bold 20px Inter, system-ui, sans-serif',
    subFont = '14px Inter, system-ui, sans-serif',
    scoreFont = 'bold 16px Inter, system-ui, sans-serif',
    nameY = 10,
    subY = 32,
    scoreY = 58,
  } = options;

  const metrics = getSeasonCardMetrics(ctx, season.description);
  const cardWidth = CONFIG.width - CONFIG.padding * 2;

  ctx.fillStyle = NAVY;
  ctx.font = 'bold 14px Inter, system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, CONFIG.padding, currentY);
  currentY += metrics.titleHeight;

  ctx.fillStyle = bgColor;
  roundRect(ctx, CONFIG.padding, currentY, cardWidth, metrics.cardHeight, CONFIG.borderRadius);
  ctx.fill();

  const cardContentY = currentY + 20;
  const radarCenterY = cardContentY + metrics.radarSize / 2 + radarCenterYOffset;
  const radarRadius = metrics.radarSize * radarScale;

  drawRadar(ctx, result.dimensions, radarCenterX, radarCenterY, radarRadius, true);

  ctx.font = nameFont;
  ctx.fillStyle = NAVY;
  ctx.textAlign = 'left';
  ctx.fillText(season.nameCN, infoX, cardContentY + nameY);

  ctx.font = subFont;
  ctx.fillStyle = CONFIG.muted;
  ctx.fillText(season.name, infoX, cardContentY + subY);

  ctx.font = scoreFont;
  ctx.fillStyle = NAVY;
  ctx.fillText(`综合评分：${result.score.toFixed(1)}`, infoX, cardContentY + scoreY);

  const progressBarY = radarCenterY + radarRadius + 40;
  const barWidth = cardWidth - 40;
  const barSpacing = 22;

  KEYS.forEach((key, index) => {
    const value = result.dimensions?.[key] || 0;
    const barY = progressBarY + index * barSpacing;

    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.fillStyle = CONFIG.text;
    ctx.textAlign = 'left';
    ctx.fillText(DIMENSION_NAMES[key], CONFIG.padding + 20, barY);

    drawProgressBar(ctx, CONFIG.padding + 110, barY - 6, barWidth - 100, value);

    ctx.textAlign = 'right';
    ctx.fillStyle = value >= 7 ? NAVY : CONFIG.text;
    ctx.fillText(value.toFixed(1), CONFIG.padding + cardWidth - 20, barY);
  });

  const descY = progressBarY + KEYS.length * barSpacing + 16;
  ctx.font = 'italic 13px Inter, system-ui, sans-serif';
  ctx.fillStyle = CONFIG.text;
  ctx.textAlign = 'center';
  drawWrappedText(ctx, `"${season.description}"`, CONFIG.width / 2, descY, cardWidth - 40, metrics.descriptionLineHeight);

  return currentY + metrics.cardHeight + 20;
}

function drawColorDetailCard(ctx, x, y, width, round, isGood) {
  const height = 80;
  const padding = 12;

  ctx.fillStyle = isGood ? 'rgba(34,197,94,0.08)' : 'rgba(249,115,22,0.08)';
  roundRect(ctx, x, y, width, height, 12);
  ctx.fill();

  ctx.strokeStyle = isGood ? 'rgba(34,197,94,0.2)' : 'rgba(249,115,22,0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  const chipSize = 28;
  drawColorChip(ctx, x + padding, y + padding, chipSize, round.color);

  ctx.font = 'bold 12px Inter, system-ui, sans-serif';
  ctx.fillStyle = CONFIG.text;
  ctx.textAlign = 'left';
  ctx.fillText(`${round.colorName} · 第${round.roundNumber}轮`, x + padding + chipSize + 8, y + padding + 10);

  ctx.font = '11px Inter, system-ui, sans-serif';
  ctx.fillStyle = CONFIG.muted;
  const seasonName = SEASONS[round.seasonKey]?.nameCN || '';
  ctx.fillText(`${seasonName}季型`, x + padding + chipSize + 8, y + padding + 26);

  const dims = round.dimensions || {};
  const dimLabels = ['提亮', '冷暖', '清晰', '和谐', '气质'];
  const dimKeys = ['skinLift', 'warmth', 'clarity', 'harmony', 'vibe'];

  ctx.font = '10px Inter, system-ui, sans-serif';
  const dimY = y + padding + 44;
  const dimSpacing = (width - padding * 2) / 5;

  dimKeys.forEach((key, index) => {
    const val = dims[key] || 0;
    const dx = x + padding + index * dimSpacing;
    ctx.fillStyle = CONFIG.muted;
    ctx.textAlign = 'left';
    ctx.fillText(dimLabels[index], dx, dimY);
    ctx.fillStyle = val >= 7 ? NAVY : CONFIG.text;
    ctx.fillText(val.toFixed(1), dx, dimY + 14);
  });
}

export async function generateShareCard(results, userImage, systemHistory) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const primaryResult = results?.[0];
  const primarySeason = primaryResult ? SEASONS[primaryResult.key] : null;
  const secondaryResult = results?.[1];
  const secondarySeason = secondaryResult ? SEASONS[secondaryResult.key] : null;

  let totalHeight = CONFIG.padding * 2;
  totalHeight += 60;
  totalHeight += 140;

  if (primarySeason && primaryResult) {
    const metrics = getSeasonCardMetrics(ctx, primarySeason.description);
    totalHeight += metrics.titleHeight + metrics.cardHeight + 20;
  }

  if (secondarySeason && secondaryResult) {
    const metrics = getSeasonCardMetrics(ctx, secondarySeason.description);
    totalHeight += metrics.titleHeight + metrics.cardHeight + 20;
  }

  totalHeight += 66;
  totalHeight += 66;
  totalHeight += 32 + 6 * (80 + 8);
  totalHeight += 60;

  canvas.width = CONFIG.width;
  canvas.height = totalHeight;

  ctx.fillStyle = CONFIG.bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let currentY = CONFIG.padding;

  ctx.font = 'bold 18px Inter, system-ui, sans-serif';
  ctx.fillStyle = NAVY;
  ctx.textAlign = 'left';
  ctx.fillText('BEAUTY HUE', CONFIG.padding, currentY + 14);

  ctx.font = '12px Inter, system-ui, sans-serif';
  ctx.fillStyle = CONFIG.muted;
  ctx.fillText('发现你的色彩', CONFIG.padding, currentY + 34);
  currentY += 60;

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

      ctx.save();
      ctx.beginPath();
      ctx.arc(CONFIG.width / 2, currentY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatarImg, avatarX, currentY, avatarSize, avatarSize);
      ctx.restore();

      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(CONFIG.width / 2, currentY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
      ctx.stroke();
    } catch {
      ctx.fillStyle = '#E0E0E0';
      ctx.beginPath();
      ctx.arc(CONFIG.width / 2, currentY + 40, 40, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  currentY += 140;

  if (primarySeason && primaryResult) {
    currentY = drawSeasonCard(ctx, '主季型', primaryResult, primarySeason, currentY);
  }

  if (secondarySeason && secondaryResult) {
    currentY = drawSeasonCard(ctx, '次季型', secondaryResult, secondarySeason, currentY, {
      bgColor: 'rgba(255,255,255,0.4)',
      radarCenterX: CONFIG.padding + 90,
      radarCenterYOffset: 5,
      radarScale: 0.32,
      infoX: CONFIG.padding + 180,
      nameFont: 'bold 18px Inter, system-ui, sans-serif',
      subFont: '12px Inter, system-ui, sans-serif',
      scoreFont: 'bold 14px Inter, system-ui, sans-serif',
      nameY: 10,
      subY: 28,
      scoreY: 48,
    });
  }

  const displayRounds = systemHistory.map((entry, index) => ({
    ...entry,
    roundNumber: index + 1,
  }));
  const rankedRounds = [...displayRounds].sort((a, b) => getRoundFinalScore(b) - getRoundFinalScore(a));
  const bestRounds = rankedRounds.slice(0, 6);
  const worstRounds = [...rankedRounds].reverse().slice(0, 6);

  ctx.fillStyle = NAVY;
  ctx.font = 'bold 12px Inter, system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('本命色卡 · Top 6', CONFIG.padding, currentY + 8);
  ctx.font = '10px Inter, system-ui, sans-serif';
  ctx.fillStyle = CONFIG.muted;
  ctx.fillText('最适合靠近面部使用', CONFIG.padding + 120, currentY + 8);

  currentY += 24;
  const chipSize = 36;
  const chipGap = 8;

  bestRounds.forEach((round, index) => {
    const x = CONFIG.padding + index * (chipSize + chipGap);
    drawColorChip(ctx, x, currentY, chipSize, round.color);
  });
  currentY += chipSize + 16;

  ctx.fillStyle = '#DC2626';
  ctx.font = 'bold 12px Inter, system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('避雷色卡 · Bottom 6', CONFIG.padding, currentY + 8);
  ctx.font = '10px Inter, system-ui, sans-serif';
  ctx.fillStyle = CONFIG.muted;
  ctx.fillText('建议减少靠近面部使用', CONFIG.padding + 130, currentY + 8);

  currentY += 24;
  worstRounds.forEach((round, index) => {
    const x = CONFIG.padding + index * (chipSize + chipGap);
    drawColorChip(ctx, x, currentY, chipSize, round.color);
  });
  currentY += chipSize + 16;

  ctx.fillStyle = NAVY;
  ctx.font = 'bold 12px Inter, system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('测试颜色详情', CONFIG.padding, currentY + 8);
  currentY += 32;

  const detailCardWidth = (CONFIG.width - CONFIG.padding * 2 - 12) / 2;
  const detailCardGap = 12;

  for (let row = 0; row < 6; row++) {
    const best = bestRounds[row];
    const worst = worstRounds[row];

    if (best) {
      drawColorDetailCard(ctx, CONFIG.padding, currentY, detailCardWidth, best, true);
    }

    if (worst) {
      drawColorDetailCard(ctx, CONFIG.padding + detailCardWidth + detailCardGap, currentY, detailCardWidth, worst, false);
    }

    currentY += 88;
  }

  ctx.fillStyle = 'rgba(0,0,0,0.03)';
  ctx.fillRect(0, currentY, canvas.width, 60);

  ctx.font = 'bold 12px Inter, system-ui, sans-serif';
  ctx.fillStyle = NAVY;
  ctx.textAlign = 'center';
  ctx.fillText('BEAUTY HUE · 发现你的色彩', CONFIG.width / 2, currentY + 24);

  ctx.font = '10px Inter, system-ui, sans-serif';
  ctx.fillStyle = CONFIG.muted;
  ctx.fillText('beautyhue.com', CONFIG.width / 2, currentY + 42);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png', 0.9);
  });
}
