import { motion } from 'framer-motion';

const LABELS = ['肤色提升', '冷暖匹配', '五官清晰', '对比和谐', '气质匹配'];
const KEYS = ['skinLift', 'warmth', 'clarity', 'harmony', 'vibe'];

export default function ScoreRadar({
  dimensions,
  comparison,
  size = 280,
  showLegend = true,
}) {
  const padding = showLegend ? 48 : 34;
  const svgSize = size + padding * 2;
  const center = svgSize / 2;
  const radius = size * 0.38;
  const levels = 5;

  const getPoint = (index, value) => {
    const angle = (Math.PI * 2 * index) / KEYS.length - Math.PI / 2;
    const scaledRadius = (value / 10) * radius;

    return {
      x: center + scaledRadius * Math.cos(angle),
      y: center + scaledRadius * Math.sin(angle),
    };
  };

  const getLabelPosition = (index) => {
    const angle = (Math.PI * 2 * index) / KEYS.length - Math.PI / 2;
    const labelRadius = radius + (showLegend ? 32 : 22);

    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
    };
  };

  const gridPaths = Array.from({ length: levels }, (_, level) => {
    const currentRadius = ((level + 1) / levels) * radius;
    const points = KEYS.map((_, index) => {
      const angle = (Math.PI * 2 * index) / KEYS.length - Math.PI / 2;
      return `${center + currentRadius * Math.cos(angle)},${center + currentRadius * Math.sin(angle)}`;
    });

    return `M ${points.join(' L ')} Z`;
  });

  const mainPoints = KEYS.map((key, index) => getPoint(index, dimensions?.[key] ?? 5));
  const mainPath = `M ${mainPoints.map((point) => `${point.x},${point.y}`).join(' L ')} Z`;

  const comparePath = comparison
    ? `M ${KEYS.map((key, index) => {
        const point = getPoint(index, comparison?.[key] ?? 5);
        return `${point.x},${point.y}`;
      }).join(' L ')} Z`
    : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className="overflow-visible">
        {gridPaths.map((path) => (
          <path key={path} d={path} fill="none" stroke="rgba(22,38,96,0.1)" strokeWidth="1" />
        ))}

        {KEYS.map((_, index) => {
          const angle = (Math.PI * 2 * index) / KEYS.length - Math.PI / 2;
          const lineX = center + radius * Math.cos(angle);
          const lineY = center + radius * Math.sin(angle);

          return (
            <line
              key={`axis-${LABELS[index]}`}
              x1={center}
              y1={center}
              x2={lineX}
              y2={lineY}
              stroke="rgba(22,38,96,0.12)"
              strokeWidth="1"
            />
          );
        })}

        {comparePath && (
          <motion.path
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            d={comparePath}
            fill="rgba(208,230,253,0.3)"
            stroke="rgba(22,38,96,0.42)"
            strokeWidth="1.8"
            strokeDasharray="4 4"
            style={{ transformOrigin: `${center}px ${center}px` }}
          />
        )}

        <motion.path
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          d={mainPath}
          fill="rgba(22,38,96,0.18)"
          stroke="#162660"
          strokeWidth="2.5"
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {KEYS.map((key, index) => {
          const point = getPoint(index, dimensions?.[key] ?? 5);

          return (
            <motion.circle
              key={key}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.06 * index }}
              cx={point.x}
              cy={point.y}
              r="4.5"
              fill="#162660"
              stroke="#F8F3EC"
              strokeWidth="2"
            />
          );
        })}

        {LABELS.map((label, index) => {
          const labelPosition = getLabelPosition(index);

          return (
            <text
              key={label}
              x={labelPosition.x}
              y={labelPosition.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={showLegend ? 11 : 9}
              fill="rgba(22,38,96,0.66)"
              fontWeight="500"
            >
              {label}
            </text>
          );
        })}
      </svg>

      {showLegend && (
        <div className="grid w-full max-w-[320px] grid-cols-2 gap-x-4 gap-y-2">
          {KEYS.map((key, index) => {
            const value = dimensions?.[key] ?? 0;
            const toneClass = value >= 7 ? 'text-navy' : value >= 5 ? 'text-text' : 'text-muted';

            return (
              <div key={`legend-${key}`} className="flex items-center justify-between rounded-full bg-white/55 px-3 py-2 text-xs">
                <span className="text-muted">{LABELS[index]}</span>
                <span className={`font-semibold ${toneClass}`}>{value.toFixed(1)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
