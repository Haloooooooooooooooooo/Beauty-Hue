/**
 * Beauty Hue — 核心色彩分析引擎 (Canvas 版)
 * 基于 12 季型理论，处理图像指标并与用户评分加权融合。
 */

/**
 * 转换 HEX 到 RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * 计算两个 RGB 颜色的欧氏距离 (近似感知差异)
 */
function colorDist(c1, c2) {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

/**
 * 图像量化分析关键逻辑
 * @param {string} imageBase64 - 用户上传的 Base64 图像
 * @param {string} bgHex - 当前测试背景的 HEX 值
 * @returns {Promise<Object>} 五维评分分值 (0-10)
 */
export async function analyzeImageMetrics(imageBase64, bgHex) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageBase64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // 采样中心区域 (假设人脸在中间)
      const size = 100; // 100x100 采样窗
      canvas.width = size;
      canvas.height = size;
      
      // 绘制中心 20% 区域到小 canvas
      ctx.drawImage(img, img.width * 0.4, img.height * 0.4, img.width * 0.2, img.height * 0.2, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;

      let rVal = 0, gVal = 0, bVal = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        // 简单的肤色过滤 (R > G, R > B)
        if (data[i] > data[i+1] && data[i] > data[i+2]) {
          rVal += data[i];
          gVal += data[i+1];
          bVal += data[i+2];
          count++;
        }
      }

      const avgSkin = count > 0 
        ? { r: rVal/count, g: gVal/count, b: bVal/count } 
        : { r: 200, g: 180, b: 160 }; // Default base skin

      const bgRgb = hexToRgb(bgHex);
      const dist = colorDist(avgSkin, bgRgb);
      
      // -- 五维评分系统模拟 -- 
      // 1. 肤色提升度 (30%) - 差异适中通常显得气色好
      let brightnessScore = Math.max(0, 10 - Math.abs(dist - 50) / 15);
      
      // 2. 冷暖匹配 (20%) - 计算背景与皮肤的 R/B 比例关系
      const skinWarmth = (avgSkin.r - avgSkin.b) / (avgSkin.r + avgSkin.b + 1);
      const bgWarmth = (bgRgb.r - bgRgb.b) / (bgRgb.r + bgRgb.b + 1);
      let warmthScore = Math.max(0, 10 - Math.pow(skinWarmth - bgWarmth, 2) * 50);

      // 3. 五官清晰度 (20%) - 模拟边缘对比度 (Sobel 极度简略版)
      let contrastScore = (dist > 100 && dist < 250) ? 9 : 5;

      // 4. 对比度和谐 (15%)
      let harmonyScore = (dist > 60 && dist < 180) ? 9 : 3;

      // 5. 气质匹配 (15%) - 常量权重
      let vibeScore = 8;

      resolve({
        skinLift: brightnessScore,
        warmth: warmthScore,
        clarity: contrastScore,
        harmony: harmonyScore,
        vibe: vibeScore,
        total: (brightnessScore*0.3 + warmthScore*0.2 + contrastScore*0.2 + harmonyScore*0.15 + vibeScore*0.15)
      });
    };
  });
}

/**
 * 最终计算全季型排名
 * @param {Array} historicalData - [{ seasonKey, systemScore, dimensions, phase }]
 * @param {Object} userScores - { seasonKey: sum_of_user_scores }
 * @returns {Array} 排序后的结果 [{ key, score, dimensions }]
 */
export function calculateFinalResults(historicalData, userScores) {
  // historicalData: [{ seasonKey, systemScore, dimensions: {...}, phase }]
  // userScores: { seasonKey: sum_of_user_scores }

  const results = {};
  const dimensionAccumulators = {}; // 累积五维分数

  historicalData.forEach(d => {
    const key = d.seasonKey;
    if (!dimensionAccumulators[key]) {
      dimensionAccumulators[key] = {
        skinLift: 0, warmth: 0, clarity: 0, harmony: 0, vibe: 0, count: 0
      };
    }
    if (d.dimensions) {
      dimensionAccumulators[key].skinLift += d.dimensions.skinLift || 0;
      dimensionAccumulators[key].warmth += d.dimensions.warmth || 0;
      dimensionAccumulators[key].clarity += d.dimensions.clarity || 0;
      dimensionAccumulators[key].harmony += d.dimensions.harmony || 0;
      dimensionAccumulators[key].vibe += d.dimensions.vibe || 0;
      dimensionAccumulators[key].count += 1;
    }
  });

  Object.keys(userScores).forEach(key => {
    const roundsOfThisSeason = historicalData.filter(d => d.seasonKey === key);
    if (roundsOfThisSeason.length === 0) return;

    // 取系统平均分
    const avgSystem = roundsOfThisSeason.reduce((acc, curr) => acc + curr.systemScore, 0) / roundsOfThisSeason.length;
    // 取用户平均分 (userScores 是累加值，映射到 0-10)
    const count = roundsOfThisSeason.length;
    const avgUser = (userScores[key] / count) / 10; // 归一化到 0-10

    // 加权：(system × 0.65) + (user × 0.35)
    let final = (avgSystem * 0.65) + (avgUser * 0.35);

    // 如果是第二阶段，权重提升 1.2x
    if (roundsOfThisSeason.some(r => r.phase === 2)) {
      final *= 1.2;
    }

    // 计算五维平均分
    const acc = dimensionAccumulators[key];
    const avgDimensions = acc && acc.count > 0 ? {
      skinLift: acc.skinLift / acc.count,
      warmth: acc.warmth / acc.count,
      clarity: acc.clarity / acc.count,
      harmony: acc.harmony / acc.count,
      vibe: acc.vibe / acc.count,
    } : null;

    results[key] = {
      score: final,
      dimensions: avgDimensions,
    };
  });

  return Object.entries(results)
    .sort(([, a], [, b]) => b.score - a.score)
    .map(([key, data]) => ({ key, score: data.score, dimensions: data.dimensions }));
}
