import { SEASONS, SEASON_KEYS } from './seasonColors';

/**
 * 阶段1：12轮固定初筛（极端测试色）
 */
export const PHASE1_SEQUENCE = SEASON_KEYS.map((key) => ({
  seasonKey: key,
  color: SEASONS[key].extremeColor,
  name: SEASONS[key].name,
  nameCN: SEASONS[key].nameCN,
  phase: 1,
}));

/**
 * 阶段2：根据评分取 Top4 季型，各选 1 个日常色精筛
 * @param {Array} currentObjectScores - 当前得分对象，示例：{ brightSpring: 25, coolWinter: 30 }
 */
export const generatePhase2 = (currentScores) => {
  const sorted = Object.entries(currentScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return sorted.map(([key]) => {
    const season = SEASONS[key];
    return {
      seasonKey: key,
      color: season.dailyColor,
      name: season.name,
      nameCN: season.nameCN,
      phase: 2,
    };
  });
};

export const MIN_ROUNDS = 8;
export const TOTAL_ROUNDS = 16;
