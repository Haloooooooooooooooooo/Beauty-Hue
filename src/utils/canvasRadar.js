/**
 * Canvas 雷达图绘制工具
 * 参考 ScoreRadar.jsx 的 SVG 绘制逻辑，纯 Canvas 实现
 */

const LABELS = ['肤色提亮', '冷暖匹配', '五官清晰', '对比和谐', '气质匹配'];
const KEYS = ['skinLift', 'warmth', 'clarity', 'harmony', 'vibe'];
const NAVY = '#162660';

/**
 * 在 Canvas 上绘制五维雷达图
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 * @param {Object} dimensions - 五维数据 { skinLift, warmth, clarity, harmony, vibe }
 * @param {number} centerX - 雷达图中心 X 坐标
 * @param {number} centerY - 雷达图中心 Y 坐标
 * @param {number} radius - 雷达图半径
 * @param {boolean} showLabels - 是否显示标签
 */
export function drawRadar(ctx, dimensions, centerX, centerY, radius, showLabels = true) {
  const levels = 5;

  // 获取极坐标点
  const getPoint = (index, value) => {
    const angle = (Math.PI * 2 * index) / KEYS.length - Math.PI / 2;
    const scaledRadius = (value / 10) * radius;
    return {
      x: centerX + scaledRadius * Math.cos(angle),
      y: centerY + scaledRadius * Math.sin(angle),
    };
  };

  // 绘制网格层
  for (let level = 0; level < levels; level++) {
    const currentRadius = ((level + 1) / levels) * radius;
    ctx.beginPath();
    for (let i = 0; i < KEYS.length; i++) {
      const angle = (Math.PI * 2 * i) / KEYS.length - Math.PI / 2;
      const x = centerX + currentRadius * Math.cos(angle);
      const y = centerY + currentRadius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(22,38,96,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 绘制轴线
  for (let i = 0; i < KEYS.length; i++) {
    const angle = (Math.PI * 2 * i) / KEYS.length - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'rgba(22,38,96,0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // 绘制数据区域
  const points = KEYS.map((key, index) => getPoint(index, dimensions?.[key] ?? 5));
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(22,38,96,0.18)';
  ctx.fill();
  ctx.strokeStyle = NAVY;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 绘制数据点
  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = NAVY;
    ctx.fill();
    ctx.strokeStyle = '#F8F3EC';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // 绘制标签
  if (showLabels) {
    const labelRadius = radius + 28;
    ctx.font = '11px Inter, system-ui, sans-serif';
    ctx.fillStyle = 'rgba(22,38,96,0.66)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    LABELS.forEach((label, index) => {
      const angle = (Math.PI * 2 * index) / KEYS.length - Math.PI / 2;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      ctx.fillText(label, x, y);
    });
  }
}

/**
 * 绘制雷达图及其下方的数值标签
 * @param {CanvasRenderingContext2D} ctx
 * @param {Object} dimensions
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} radius
 */
export function drawRadarWithLegend(ctx, dimensions, centerX, centerY, radius) {
  drawRadar(ctx, dimensions, centerX, centerY, radius, true);

  // 在雷达图下方绘制数值标签（两列布局）
  const startX = centerX - 100;
  const startY = centerY + radius + 50;
  const colWidth = 100;
  const rowHeight = 24;

  ctx.font = '12px Inter, system-ui, sans-serif';

  KEYS.forEach((key, index) => {
    const value = dimensions?.[key] ?? 0;
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = startX + col * colWidth + 10;
    const y = startY + row * rowHeight;

    // 绘制背景
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath();
    ctx.roundRect(x - 8, y - 10, colWidth - 20, 20, 10);
    ctx.fill();

    // 绘制标签和数值
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#8A8A8A';
    ctx.fillText(LABELS[index], x, y);

    ctx.textAlign = 'right';
    ctx.fillStyle = value >= 7 ? NAVY : value >= 5 ? '#3A3A3A' : '#8A8A8A';
    ctx.fillText(value.toFixed(1), x + colWidth - 28, y);
  });
}

export { LABELS, KEYS, NAVY };