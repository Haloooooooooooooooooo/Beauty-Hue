import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Download,
  Eye,
  Heart,
  Palette,
  RotateCcw,
  Share2,
  Sparkles,
  Sun,
  Waves,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import { SEASONS } from '../data/seasonColors';
import { calculateFinalResults } from '../engine/colorAnalyzer';
import ScoreRadar from '../components/result/ScoreRadar';
import TestColorChips from '../components/result/TestColorChips';

const DIMENSION_CONFIG = {
  skinLift: { name: '肤色提升', icon: Sun, insights: { high: '显著提亮肤色，气色红润健康。', mid: '与肤色融合适中，效果自然。', low: '可能让肤色略显暗沉，建议搭配妆面。' } },
  warmth: { name: '冷暖匹配', icon: Palette, insights: { high: '冷暖调性完美契合，自然和谐。', mid: '冷暖匹配尚可，日常灵活运用。', low: '冷暖调性有偏差，尝试相近色系。' } },
  clarity: { name: '五官清晰', icon: Eye, insights: { high: '五官轮廓清晰立体，更聚焦。', mid: '五官清晰度中规中矩，适合日常妆容。', low: '五官边界感略弱，用妆容增强对比。' } },
  harmony: { name: '对比和谐', icon: Waves, insights: { high: '整体和谐度极佳，气质完美融合。', mid: '整体和谐度稳定，适合日常穿搭。', low: '和谐度略低，作为点缀色使用。' } },
  vibe: { name: '气质匹配', icon: Heart, insights: { high: '气质匹配度极高，为你量身定制。', mid: '气质匹配平稳，适合低调风格。', low: '气质匹配有差异，尝试其他风格配饰。' } },
};

function getDimensionInsight(value, key) {
  const config = DIMENSION_CONFIG[key];
  if (!config) return '';
  return config.insights[value >= 7 ? 'high' : value >= 5 ? 'mid' : 'low'] || '';
}

function getColorEvaluation(roundData) {
  if (!roundData?.dimensions) return '暂无该颜色的详细分析数据。';

  const { colorName, seasonNameCN, userScore, dimensions } = roundData;
  const entries = Object.entries(dimensions);
  const sorted = [...entries].sort(([, a], [, b]) => b - a);
  const [bestKey, bestValue] = sorted[0];
  const [lowestKey, lowestValue] = sorted[sorted.length - 1];
  const bestName = DIMENSION_CONFIG[bestKey]?.name || bestKey;
  const lowestName = DIMENSION_CONFIG[lowestKey]?.name || lowestKey;
  const avgScore = entries.reduce((sum, [, v]) => sum + v, 0) / entries.length;
  const highCount = entries.filter(([, v]) => v >= 7).length;
  const lowCount = entries.filter(([, v]) => v < 5).length;

  const parts = [];
  if (avgScore >= 7) parts.push(`${colorName}对你的${seasonNameCN || ''}气质表现出极佳适配度。`);
  else if (avgScore >= 5.5) parts.push(`${colorName}整体表现不错，与你的气质较为契合。`);
  else parts.push(`${colorName}与你的气质匹配度一般，需要谨慎搭配。`);

  if (highCount >= 3) parts.push(`${bestName}等${highCount}个维度超过7分，表现突出。`);
  else if (highCount >= 1) parts.push(`${bestName}维度${bestValue.toFixed(1)}分，是核心优势。`);

  if (lowCount >= 1) parts.push(`${lowestName}维度偏低，注意平衡。`);

  const userLiked = userScore >= 10;
  const userNeutral = userScore >= 5;
  if (userLiked && avgScore >= 6) parts.push('你的主观感受与AI分析一致，可以放心使用。');
  else if (!userNeutral) parts.push('建议避开这个颜色。');

  return parts.join('');
}

function getUserScoreLabel(score) {
  if (score >= 10) return '适合';
  if (score >= 5) return '一般';
  return '不适合';
}

function getPreferredRoundIndex(history, seasonKey) {
  const matchingRounds = history.map((entry, index) => ({ entry, index })).filter(({ entry }) => entry.seasonKey === seasonKey);
  if (!matchingRounds.length) return 0;
  return [...matchingRounds].sort((a, b) => {
    if (b.entry.phase !== a.entry.phase) return b.entry.phase - a.entry.phase;
    return (b.entry.userScore || 0) - (a.entry.userScore || 0);
  })[0].index;
}

export default function ResultPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [image, setImage] = useState(null);
  const [systemHistory, setSystemHistory] = useState([]);
  const [seasonType, setSeasonType] = useState('primary');
  const [selectedRound, setSelectedRound] = useState(null);
  const [hasSelectedChip, setHasSelectedChip] = useState(false);

  useEffect(() => {
    const userScores = JSON.parse(localStorage.getItem('beautyHue_scores') || '{}');
    const history = JSON.parse(localStorage.getItem('beautyHue_systemHistory') || '[]');
    const userImage = localStorage.getItem('beautyHue_image');
    if (!userImage || Object.keys(userScores).length === 0 || history.length === 0) { navigate('/test'); return; }
    setImage(userImage);
    setSystemHistory(history);
    setResults(calculateFinalResults(history, userScores));
  }, [navigate]);

  const primaryResult = results?.[0];
  const secondaryResult = results?.[1];
  const primarySeason = primaryResult ? SEASONS[primaryResult.key] : null;
  const secondarySeason = secondaryResult ? SEASONS[secondaryResult.key] : null;
  const activeResult = seasonType === 'secondary' && secondaryResult ? secondaryResult : primaryResult;
  const activeSeason = activeResult ? SEASONS[activeResult.key] : primarySeason;
  const activeSeasonKey = activeResult?.key;
  const activeDimensions = activeResult?.dimensions;

  useEffect(() => {
    if (!results?.length || !systemHistory.length || !activeSeasonKey) return;
    setSelectedRound(getPreferredRoundIndex(systemHistory, activeSeasonKey));
  }, [results, systemHistory, activeSeasonKey]);

  if (!results || !primarySeason || !activeResult) return null;

  const displayRounds = systemHistory.map((entry, index) => ({
    ...entry,
    roundNumber: index + 1,
    seasonNameCN: SEASONS[entry.seasonKey]?.nameCN || '',
  }));

  const selectedColorRound = selectedRound !== null ? displayRounds[selectedRound] : null;

  return (
    <div className="bg-kraft min-h-screen pb-10">
      <div className="max-w-[1000px] mx-auto px-4 py-6">
        <Navbar />

        {/* 主卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-3xl border border-white/50 bg-white/40 shadow-2xl backdrop-blur-xl overflow-hidden"
        >
          {/* 背景装饰 */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[60px] opacity-15 pointer-events-none" style={{ backgroundColor: activeSeason.extremeColor }} />

          {/* 内容区 */}
          <div className="relative p-5 md:p-8">

            {/* 头部 */}
            <div className="text-center mb-6 pb-6 border-b border-navy/5">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white/80 shadow-lg mx-auto mb-4">
                <img src={image} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <div>
                  <span className="text-xs text-muted tracking-widest">主季型</span>
                  <h1 className="text-2xl md:text-3xl font-bold text-navy flex items-center justify-center gap-2">
                    {primarySeason.nameCN}
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </h1>
                  <p className="text-sm text-navy/60">{primarySeason.name} · {primaryResult.score.toFixed(1)}分</p>
                </div>

                {secondarySeason && (
                  <div className="md:border-l md:border-navy/10 md:pl-8">
                    <span className="text-xs text-muted tracking-widest">次季型</span>
                    <p className="text-navy/70">{secondarySeason.nameCN} · {secondaryResult.score.toFixed(1)}分</p>
                    <button onClick={() => { setSeasonType(seasonType === 'primary' ? 'secondary' : 'primary'); setHasSelectedChip(false); }} className="glass-btn px-3 py-1 text-xs mt-2">
                      {seasonType === 'primary' ? '切换次季型' : '切换主季型'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 色彩特征 */}
            <section className="mb-6">
              <h2 className="text-xs font-bold text-navy/40 tracking-widest mb-2">色彩特征解析</h2>
              <div className="bg-white/30 rounded-xl p-4 border border-white/40">
                <p className="text-sm text-text leading-relaxed italic">"{activeSeason.description}"</p>
              </div>
            </section>

            {/* 综合五维分析 */}
            <AnimatePresence mode="wait">
              {!hasSelectedChip && activeDimensions && (
                <motion.section key={seasonType} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-6">
                  <h2 className="text-xs font-bold text-navy/40 tracking-widest mb-2">
                    {seasonType === 'primary' ? '主季型综合分析' : '次季型综合分析'}
                  </h2>
                  <div className="bg-white/30 rounded-xl p-4 border border-white/40">
                    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
                      <div className="shrink-0">
                        <ScoreRadar dimensions={activeDimensions} size={160} />
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        {Object.entries(activeDimensions).map(([key, value], i) => {
                          const config = DIMENSION_CONFIG[key];
                          const Icon = config?.icon;
                          const name = config?.name || key;
                          const insight = getDimensionInsight(value, key);
                          return (
                            <motion.div key={key} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-2 items-start">
                              <div className="w-7 h-7 rounded bg-white/60 flex items-center justify-center shrink-0">
                                <Icon className="w-3.5 h-3.5 text-navy" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between text-xs mb-0.5">
                                  <span className="font-medium">{name}</span>
                                  <span className="font-bold text-navy">{value.toFixed(1)}</span>
                                </div>
                                <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${(value / 10) * 100}%` }} className="h-full bg-navy rounded-full" />
                                </div>
                                <p className="text-[10px] text-muted mt-0.5">{insight}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* 测试色卡详情 */}
            <section className="mb-6">
              <h2 className="text-xs font-bold text-navy/40 tracking-widest mb-2">测试色卡详情</h2>
              <div className="bg-white/20 rounded-xl p-3 border border-white/40">
                <TestColorChips rounds={displayRounds} selectedRound={selectedRound} activeSeasonKey={activeSeasonKey} showHint={!hasSelectedChip} onSelect={(i) => { setSelectedRound(i); setHasSelectedChip(true); }} />

                <AnimatePresence mode="wait">
                  {hasSelectedChip && selectedColorRound && (
                    <motion.div key={selectedRound} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 pt-4 border-t border-white/30">
                      <h3 className="text-xs font-medium text-navy/60 mb-3">第 {selectedColorRound.roundNumber} 轮 · {selectedColorRound.colorName}</h3>

                      {/* 固定布局的分析区 */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* 雷达图 - 固定宽度居中 */}
                        <div className="flex justify-center sm:justify-start shrink-0">
                          <ScoreRadar dimensions={selectedColorRound.dimensions} size={140} showLegend={false} />
                        </div>

                        {/* 信息区 */}
                        <div className="flex-1 min-w-0 space-y-3">
                          {/* 颜色信息行 */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="w-10 h-10 rounded-lg border border-white/80 shrink-0" style={{ backgroundColor: selectedColorRound.color }} />
                            <span className="text-sm font-semibold text-navy">{selectedColorRound.seasonNameCN}季型</span>
                            <span className="text-xs font-mono bg-white/60 px-2 py-0.5 rounded">{selectedColorRound.color}</span>
                            <span className={`text-xs px-2 py-0.5 rounded font-medium ${selectedColorRound.userScore >= 10 ? 'bg-green-100 text-green-700' : selectedColorRound.userScore >= 5 ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-600'}`}>
                              {getUserScoreLabel(selectedColorRound.userScore)}
                            </span>
                          </div>

                          {/* 五维进度条 - 两列固定 */}
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(selectedColorRound.dimensions || {}).map(([key, value]) => {
                              const config = DIMENSION_CONFIG[key];
                              const Icon = config?.icon;
                              const name = config?.name || key;
                              return (
                                <div key={key} className="bg-white/40 rounded-lg p-2 border border-white/30">
                                  <div className="flex justify-between items-center text-xs mb-1">
                                    <div className="flex items-center gap-1">
                                      <Icon className="w-3 h-3 text-navy" />
                                      <span>{name}</span>
                                    </div>
                                    <span className="font-bold text-navy">{value.toFixed(1)}</span>
                                  </div>
                                  <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(value / 10) * 100}%` }} className="h-full bg-navy rounded-full" />
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* 总体评价 */}
                          <div className="bg-white/30 rounded-lg p-3 border border-white/30">
                            <p className="text-xs font-semibold text-navy mb-1">总体评价</p>
                            <p className="text-xs text-text leading-relaxed">{getColorEvaluation(selectedColorRound)}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* 本命色 + 避雷色 */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-xs font-bold text-navy mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />本命色系
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {[activeSeason.extremeColor, activeSeason.dailyColor, ...(activeSeason.palette || [])].slice(0, 6).map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg border border-white/50" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-navy mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />建议避雷
                </h3>
                <div className="flex flex-wrap gap-1.5 opacity-60">
                  {(activeSeason.avoid || ['#333', '#1A1A1A', '#4A4A4A', '#2D2D2D']).map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg border border-white/50 grayscale-[0.3]" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2 flex-wrap pt-4 border-t border-navy/5">
              <button className="btn-cta flex-1 flex items-center justify-center gap-2 text-sm py-3">
                <Download className="w-4 h-4" />保存报告
              </button>
              <button className="glass-btn flex-1 flex items-center justify-center gap-2 text-sm py-3">
                <Share2 className="w-4 h-4" />分享
              </button>
              <button onClick={() => navigate('/test')} className="glass-btn py-3 px-4">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* 底部 */}
            <div className="mt-4 flex items-start gap-2 text-[10px] text-muted bg-black/5 rounded-lg p-2">
              <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
              <span>AI 视觉通过 Canvas 像素采样计算，融合用户主观偏好。</span>
            </div>
          </div>
        </motion.div>

        <p className="text-center mt-4 text-[10px] text-muted font-mono tracking-widest">BEAUTY HUE</p>
      </div>
    </div>
  );
}