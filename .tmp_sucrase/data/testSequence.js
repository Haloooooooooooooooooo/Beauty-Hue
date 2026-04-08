"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _seasonColors = require('./seasonColors');

// 颜色名称映射（12季型的极端色和日常色）
const COLOR_NAMES = {
  // 阶段1：极端色
  brightSpring_extreme: '亮红',
  warmSpring_extreme: '艳橙',
  lightSpring_extreme: '亮粉',
  lightSummer_extreme: '浅蓝',
  coolSummer_extreme: '亮蓝',
  softSummer_extreme: '灰紫',
  softAutumn_extreme: '橙红',
  warmAutumn_extreme: '亮橙',
  deepAutumn_extreme: '深红',
  deepWinter_extreme: '正红',
  coolWinter_extreme: '正蓝',
  brightWinter_extreme: '亮青',

  // 阶段2：日常色
  brightSpring_daily: '亮青',
  warmSpring_daily: '浅橙',
  lightSpring_daily: '浅黄',
  lightSummer_daily: '浅粉',
  coolSummer_daily: '中粉',
  softSummer_daily: '粉灰',
  softAutumn_daily: '中棕',
  warmAutumn_daily: '中橙棕',
  deepAutumn_daily: '深棕',
  deepWinter_daily: '深蓝',
  coolWinter_daily: '亮粉',
  brightWinter_daily: '亮粉',
};

/**
 * 阶段1：12轮固定初筛（极端测试色）
 */
 const PHASE1_SEQUENCE = _seasonColors.SEASON_KEYS.map((key) => ({
  seasonKey: key,
  color: _seasonColors.SEASONS[key].extremeColor,
  colorName: COLOR_NAMES[`${key}_extreme`] || '测试色',
  name: _seasonColors.SEASONS[key].name,
  nameCN: _seasonColors.SEASONS[key].nameCN,
  phase: 1,
})); exports.PHASE1_SEQUENCE = PHASE1_SEQUENCE;

/**
 * 阶段2：根据评分取 Top4 季型，各选 1 个日常色精筛
 * @param {Object} currentScores - 当前得分对象，示例：{ brightSpring: 25, coolWinter: 30 }
 */
 const generatePhase2 = (currentScores) => {
  const sorted = Object.entries(currentScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return sorted.map(([key]) => {
    const season = _seasonColors.SEASONS[key];
    return {
      seasonKey: key,
      color: season.dailyColor,
      colorName: COLOR_NAMES[`${key}_daily`] || '日常色',
      name: season.name,
      nameCN: season.nameCN,
      phase: 2,
    };
  });
}; exports.generatePhase2 = generatePhase2;

 const MIN_ROUNDS = 8; exports.MIN_ROUNDS = MIN_ROUNDS;
 const TOTAL_ROUNDS = 16; exports.TOTAL_ROUNDS = TOTAL_ROUNDS;
