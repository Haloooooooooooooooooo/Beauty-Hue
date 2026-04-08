import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Download, Sun, Palette, Eye, Heart, Waves, ArrowLeft } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { SEASONS } from '../data/seasonColors';
import ScoreRadar from '../components/result/ScoreRadar';
import TestColorChips from '../components/result/TestColorChips';
import { generateShareCard } from '../utils/shareCardGenerator';
import { supabase } from '../lib/supabase';

const DIMENSION_CONFIG = {
  skinLift: {
    name: '肤色提亮',
    icon: Sun,
    insights: {
      high: '这个颜色能明显提亮肤色，让整体状态更透亮。',
      mid: '这个颜色与肤色融合自然，整体表现比较稳定。',
      low: '这个颜色可能会让肤色显得发灰或暗沉，建议谨慎使用。',
    },
  },
  warmth: {
    name: '冷暖匹配',
    icon: Palette,
    insights: {
      high: '冷暖调性贴合度很高，看起来会更自然协调。',
      mid: '冷暖匹配中等，适合通过妆容或配饰微调。',
      low: '冷暖方向偏差较大，容易显得不够和谐。',
    },
  },
  clarity: {
    name: '五官清晰',
    icon: Eye,
    insights: {
      high: '这个颜色能让五官更聚焦，轮廓更清晰。',
      mid: '五官表现比较稳定，适合日常使用。',
      low: '五官边界感会偏弱，整体显得不够精神。',
    },
  },
  harmony: {
    name: '对比和谐',
    icon: Waves,
    insights: {
      high: '整体对比和谐度很高，气质会更统一。',
      mid: '整体和谐度尚可，搭配时有一定灵活度。',
      low: '这个颜色的对比关系偏弱，容易影响整体协调感。',
    },
  },
  vibe: {
    name: '气质匹配',
    icon: Heart,
    insights: {
      high: '这个颜色和你的整体气质很贴合，容易出效果。',
      mid: '气质匹配平稳，属于安全但不算惊艳的选择。',
      low: '气质方向不太一致，容易有违和感。',
    },
  },
};

function getDimensionInsight(value, key) {
  const config = DIMENSION_CONFIG[key];
  if (!config) return '';
  return config.insights[value >= 7 ? 'high' : value >= 5 ? 'mid' : 'low'] || '';
}

function getColorEvaluation(roundData) {
  if (!roundData?.dimensions) return '暂时没有该颜色的详细分析数据。';

  const entries = Object.entries(roundData.dimensions);
  const sorted = [...entries].sort(([, a], [, b]) => b - a);
  const [bestKey, bestValue] = sorted[0];
  const [lowestKey, lowestValue] = sorted[sorted.length - 1];
  const bestName = DIMENSION_CONFIG[bestKey]?.name || bestKey;
  const lowestName = DIMENSION_CONFIG[lowestKey]?.name || lowestKey;

  if (bestValue >= 7.5) {
    return `这个颜色对你的适配度很高，${bestName}维度尤其突出，整体表现干净利落。`;
  }

  if (lowestValue <= 4.5) {
    return `这个颜色可以尝试，但在${lowestName}维度上偏弱，建议减少大面积靠近面部使用。`;
  }

  return `这个颜色整体表现均衡，其中${bestName}是主要加分项，日常使用会比较稳妥。`;
}

function getUserScoreLabel(score) {
  if (score >= 10) return '适合';
  if (score >= 5) return '一般';
  return '不适合';
}

function getUserScoreTagClass(score) {
  if (score >= 10) return 'bg-green-100 text-green-700';
  if (score >= 5) return 'bg-gray-100 text-gray-600';
  return 'bg-orange-100 text-orange-600';
}

function getAiScoreTagClass(score) {
  if (score >= 7) return 'bg-green-100 text-green-700';
  if (score >= 5) return 'bg-gray-100 text-gray-600';
  return 'bg-orange-100 text-orange-600';
}

function getRoundFinalScore(round) {
  const normalizedUserScore = (round.userScore || 0) / 10;
  const normalizedAiScore = round.systemScore || 0;
  return normalizedUserScore * 0.4 + normalizedAiScore * 0.6;
}

export default function HistoryReportPage({ onOpenLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [hasSelectedChip, setHasSelectedChip] = useState(false);

  useEffect(() => {
    async function loadReport() {
      const reportId = searchParams.get('id');

      if (reportId) {
        const { data, error: fetchError } = await supabase
          .from('user_reports')
          .select('*')
          .eq('id', reportId)
          .single();

        if (fetchError) {
          setError('报告不存在或已删除');
        } else {
          setReport(data);
        }
      } else {
        const reportData = localStorage.getItem('beautyHue_historyReport');
        if (reportData) {
          setReport(JSON.parse(reportData));
        } else {
          setError('报告不存在');
        }
      }

      setLoading(false);
    }

    loadReport();
  }, [searchParams]);

  const handleSaveImage = async () => {
    if (!report) return;

    const blob = await generateShareCard(report.results, null, report.history);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `beauty-hue-report-${Date.now()}.png`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBack = () => {
    navigate('/history', {
      replace: true,
      state: {
        from: location.state?.from,
      },
    });
  };

  if (loading) {
    return (
      <div className="bg-kraft min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-3 border-navy/20 border-t-navy rounded-full"
        />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="bg-kraft min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted mb-4">{error || '报告不存在'}</p>
          <button onClick={handleBack} className="btn-cta">
            返回历史
          </button>
        </div>
      </div>
    );
  }

  const results = report.results || [];
  const history = report.history || [];
  const primaryResult = results[0];
  const secondaryResult = results[1];
  const primarySeason = primaryResult ? SEASONS[primaryResult.key] : null;
  const secondarySeason = secondaryResult ? SEASONS[secondaryResult.key] : null;
  const primaryDimensions = primaryResult?.dimensions;

  const displayRounds = history.map((entry, index) => ({
    ...entry,
    roundNumber: index + 1,
    seasonNameCN: SEASONS[entry.seasonKey]?.nameCN || '',
  }));

  const selectedColorRound = selectedRound !== null ? displayRounds[selectedRound] : null;
  const rankedRounds = [...displayRounds].sort((a, b) => getRoundFinalScore(b) - getRoundFinalScore(a));
  const bestColorRounds = rankedRounds.slice(0, 6);
  const avoidColorRounds = [...rankedRounds].reverse().slice(0, 6);

  return (
    <div className="bg-kraft min-h-screen pb-10">
      <div className="max-w-[1240px] mx-auto px-5 py-6 md:px-6">
        <Navbar onOpenLogin={onOpenLogin} />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 mb-4"
        >
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 text-sm text-navy border border-white/30 hover:bg-white/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回历史报告
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 text-sm text-muted border border-white/30">
            历史报告 · {report.title}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/50 bg-white/40 shadow-2xl backdrop-blur-xl overflow-hidden relative"
        >
          {primarySeason && (
            <div
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[60px] opacity-15 pointer-events-none"
              style={{ backgroundColor: primarySeason.extremeColor }}
            />
          )}

          <div className="relative p-6 md:p-10">
            <div className="text-center mb-8 pb-8 border-b border-navy/5">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <div>
                  <span className="text-xs text-muted tracking-widest">主季型</span>
                  <h1 className="text-3xl md:text-4xl font-bold text-navy flex items-center justify-center gap-2">
                    {primarySeason?.nameCN || '未知'}
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </h1>
                  <p className="text-sm text-navy/60">
                    {primarySeason?.name} · {primaryResult?.score?.toFixed(1)} 分
                  </p>
                </div>

                {secondarySeason && (
                  <div className="md:border-l md:border-navy/10 md:pl-8">
                    <span className="text-xs text-muted tracking-widest">次季型</span>
                    <p className="text-navy/70">{secondarySeason.nameCN} · {secondaryResult?.score?.toFixed(1)} 分</p>
                  </div>
                )}
              </div>
            </div>

            {primarySeason && (
              <section className="mb-6">
                <h2 className="text-xs font-bold text-navy/40 tracking-widest mb-2">色彩特征解析</h2>
                <div className="bg-white/30 rounded-2xl p-5 md:p-6 border border-white/40">
                  <p className="text-base text-text leading-relaxed italic">"{primarySeason.description}"</p>
                </div>
              </section>
            )}

            {primaryDimensions && (
              <section className="mb-6">
                <h2 className="text-xs font-bold text-navy/40 tracking-widest mb-2">主季型综合分析</h2>
                <div className="bg-white/30 rounded-2xl p-5 md:p-6 border border-white/40">
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="shrink-0">
                      <ScoreRadar dimensions={primaryDimensions} size={200} />
                    </div>
                    <div className="flex-1 space-y-5 w-full">
                      {Object.entries(primaryDimensions).map(([key, value], index) => {
                        const config = DIMENSION_CONFIG[key];
                        const Icon = config?.icon;
                        const name = config?.name || key;
                        const insight = getDimensionInsight(value, key);

                        return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex gap-4 items-start"
                          >
                            <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shrink-0">
                              <Icon className="w-5 h-5 text-navy" />
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                              <div className="flex justify-between text-sm mb-1.5">
                                <span className="font-medium">{name}</span>
                                <span className="font-bold text-navy text-[15px]">{value.toFixed(1)}</span>
                              </div>
                              <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(value / 10) * 100}%` }}
                                  className="h-full bg-navy rounded-full"
                                />
                              </div>
                              <p className="text-sm text-muted mt-2 leading-relaxed">{insight}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {history.length > 0 && (
              <section className="mb-6">
                <div className="mb-2 flex items-center gap-3">
                  <h2 className="text-xs font-bold text-navy/40 tracking-widest">测试色卡详情</h2>
                  {!hasSelectedChip && (
                    <motion.span
                      animate={{ y: [0, -4, 0], scale: [1, 1.02, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      className="rounded-full border border-sky/60 bg-white/85 px-3 py-1 text-[11px] font-medium text-navy shadow-[0_0_18px_rgba(208,230,253,0.45)]"
                    >
                      点击色卡查看详细分析
                    </motion.span>
                  )}
                </div>
                <div className="bg-white/20 rounded-2xl p-4 md:p-5 border border-white/40">
                  <TestColorChips
                    rounds={displayRounds}
                    selectedRound={selectedRound}
                    showHint={false}
                    onSelect={(index) => {
                      setSelectedRound(index);
                      setHasSelectedChip(true);
                    }}
                  />

                  <AnimatePresence mode="wait">
                    {hasSelectedChip && selectedColorRound && (
                      <motion.div
                        key={selectedRound}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-5 pt-5 border-t border-white/30"
                      >
                        <h3 className="text-xs font-medium text-navy/60 mb-3">
                          第 {selectedColorRound.roundNumber} 轮 · {selectedColorRound.colorName}
                        </h3>

                        <div className="flex flex-col sm:flex-row gap-6">
                          <div className="flex justify-center sm:justify-start shrink-0">
                            <ScoreRadar dimensions={selectedColorRound.dimensions} size={180} showLegend={false} />
                          </div>

                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex items-start gap-3">
                              <div
                                className="w-10 h-10 rounded-lg border border-white/80 shrink-0"
                                style={{ backgroundColor: selectedColorRound.color }}
                              />
                              <div className="min-w-0 space-y-1">
                                <div className="text-sm font-semibold text-navy">{selectedColorRound.colorName}</div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs text-muted">{`${selectedColorRound.seasonNameCN}季型`}</span>
                                  <span className="text-xs font-mono bg-white/60 px-2 py-0.5 rounded">{selectedColorRound.color}</span>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded font-medium ${getAiScoreTagClass(
                                      selectedColorRound.systemScore
                                    )}`}
                                  >
                                    {`AI评分：${selectedColorRound.systemScore.toFixed(1)}`}
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded font-medium ${getUserScoreTagClass(
                                      selectedColorRound.userScore
                                    )}`}
                                  >
                                    {`用户评分：${getUserScoreLabel(selectedColorRound.userScore)}`}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              {Object.entries(selectedColorRound.dimensions || {}).map(([key, value]) => {
                                const config = DIMENSION_CONFIG[key];
                                const Icon = config?.icon;
                                const name = config?.name || key;

                                return (
                                  <div key={key} className="bg-white/40 rounded-xl p-3 border border-white/30">
                                    <div className="flex justify-between items-center text-xs mb-1">
                                      <div className="flex items-center gap-1">
                                        <Icon className="w-3 h-3 text-navy" />
                                        <span>{name}</span>
                                      </div>
                                      <span className="font-bold text-navy">{value.toFixed(1)}</span>
                                    </div>
                                    <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(value / 10) * 100}%` }}
                                        className="h-full bg-navy rounded-full"
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="bg-white/30 rounded-xl p-4 border border-white/30">
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
            )}

            <div className="grid grid-cols-1 gap-5 mb-6 md:grid-cols-2">
              <section>
                <div className="mb-1 flex items-center gap-3">
                  <h3 className="text-xs font-bold text-navy flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    本命色卡
                  </h3>
                </div>
                <p className="text-[11px] text-muted mb-3">综合得分最高，最适合靠近面部使用</p>
                <div className="flex flex-wrap gap-3">
                  {bestColorRounds.map((round, index) => (
                    <button
                      key={`best-${round.roundNumber}-${index}`}
                      type="button"
                      onClick={() => {
                        setSelectedRound(displayRounds.findIndex((entry) => entry.roundNumber === round.roundNumber));
                        setHasSelectedChip(true);
                      }}
                      className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/60 shadow-sm transition-transform duration-200 hover:-translate-y-1"
                      style={{ backgroundColor: round.color }}
                      aria-label={`${round.colorName} ${round.color}`}
                    >
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-1 text-center opacity-0 hover:opacity-100 bg-black/10">
                        <div className="text-[10px] font-medium text-[#e5e7eb] leading-tight">{round.colorName}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <div className="mb-1 flex items-center gap-3">
                  <h3 className="text-xs font-bold text-navy flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    避雷色卡
                  </h3>
                </div>
                <p className="text-[11px] text-muted mb-3">综合得分最低，建议减少靠近面部使用</p>
                <div className="flex flex-wrap gap-3">
                  {avoidColorRounds.map((round, index) => (
                    <button
                      key={`avoid-${round.roundNumber}-${index}`}
                      type="button"
                      onClick={() => {
                        setSelectedRound(displayRounds.findIndex((entry) => entry.roundNumber === round.roundNumber));
                        setHasSelectedChip(true);
                      }}
                      className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/60 shadow-sm transition-transform duration-200 hover:-translate-y-1"
                      style={{ backgroundColor: round.color }}
                      aria-label={`${round.colorName} ${round.color}`}
                    >
                      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-1 text-center opacity-0 hover:opacity-100 bg-black/10">
                        <div className="text-[10px] font-medium text-[#e5e7eb] leading-tight">{round.colorName}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>

            <div className="flex gap-2 flex-wrap pt-4 border-t border-navy/5">
              <button
                onClick={handleSaveImage}
                className="glass-btn flex-1 flex items-center justify-center gap-2 text-sm py-3"
              >
                <Download className="w-4 h-4" />
                保存报告
              </button>
              <button onClick={() => navigate('/test')} className="glass-btn py-3 px-4">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 flex items-start gap-2 text-[10px] text-muted bg-black/5 rounded-lg p-2">
              <span>AI 分析基于 Canvas 像素采样结果，并结合用户的主观评分进行综合判断。</span>
            </div>
          </div>
        </motion.div>

        <p className="text-center mt-4 text-[10px] text-muted font-mono tracking-widest">BEAUTY HUE</p>
      </div>
    </div>
  );
}
