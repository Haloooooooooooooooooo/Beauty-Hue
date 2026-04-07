/**
 * 分享结果页面
 * 展示其他人分享的个人色彩诊断报告
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, RotateCcw } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { SEASONS } from '../data/seasonColors';
import ScoreRadar from '../components/result/ScoreRadar';
import { decodeShareData } from '../utils/shareEncoder';
import { getShareReport } from '../utils/shareReportService';

const DIMENSION_NAMES = {
  skinLift: '肤色提亮',
  warmth: '冷暖匹配',
  clarity: '五官清晰',
  harmony: '对比和谐',
  vibe: '气质匹配',
};

export default function SharePage({ onOpenLogin }) {
  const navigate = useNavigate();
  const { shareId } = useParams();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareData, setShareData] = useState(null);

  useEffect(() => {
    async function loadShareData() {
      try {
        if (shareId) {
          // 短链接模式：从数据库获取
          const result = await getShareReport(shareId);
          if (result.success) {
            setShareData({
              results: result.data.results,
              history: result.data.history,
              createdAt: result.data.created_at,
            });
          } else {
            setError(result.error);
          }
        } else {
          // URL 参数模式：解码 URL 数据
          const encodedData = searchParams.get('d');
          if (encodedData) {
            const decoded = decodeShareData(encodedData);
            if (decoded) {
              setShareData(decoded);
            } else {
              setError('链接数据无效');
            }
          } else {
            setError('缺少分享数据');
          }
        }
      } catch (err) {
        console.error('加载分享数据失败:', err);
        setError('加载失败，请重试');
      } finally {
        setIsLoading(false);
      }
    }

    loadShareData();
  }, [shareId, searchParams]);

  const results = shareData?.results || [];
  const history = shareData?.history || [];
  const primaryResult = results[0];
  const secondaryResult = results[1];
  const primarySeason = primaryResult ? SEASONS[primaryResult.key] : null;
  const secondarySeason = secondaryResult ? SEASONS[secondaryResult.key] : null;

  // 排序获取本命色卡和避雷色卡
  function getRoundFinalScore(round) {
    const normalizedUserScore = (round.userScore || 0) / 10;
    const normalizedAiScore = round.systemScore || 0;
    return normalizedUserScore * 0.4 + normalizedAiScore * 0.6;
  }

  const rankedRounds = [...history].sort((a, b) => getRoundFinalScore(b) - getRoundFinalScore(a));
  const bestColorRounds = rankedRounds.slice(0, 6);
  const avoidColorRounds = [...rankedRounds].reverse().slice(0, 6);

  if (isLoading) {
    return (
      <div className="bg-kraft min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-navy/20 border-t-navy rounded-full mx-auto"
          />
          <p className="text-muted mt-4">正在加载分享报告...</p>
        </div>
      </div>
    );
  }

  if (error || !shareData) {
    return (
      <div className="bg-kraft min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">😔</span>
          </div>
          <h2 className="text-lg font-semibold text-navy mb-2">分享链接无效</h2>
          <p className="text-muted mb-6">{error || '数据不存在或已过期'}</p>
          <button onClick={() => navigate('/')} className="btn-cta">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-kraft min-h-screen pb-10">
      <div className="max-w-[1240px] mx-auto px-5 py-6 md:px-6">
        <Navbar onOpenLogin={onOpenLogin} />

        {/* 分享提示 */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 text-center"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 text-sm text-muted border border-white/30">
            这是他人分享的色彩诊断报告
            {shareData.createdAt && (
              <span className="text-xs">
                · {new Date(shareData.createdAt).toLocaleDateString()}
              </span>
            )}
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
            {/* 标题区 */}
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

            {/* 色彩特征 */}
            {primarySeason && (
              <section className="mb-6">
                <h2 className="text-xs font-bold text-navy/40 tracking-widest mb-2">色彩特征解析</h2>
                <div className="bg-white/30 rounded-2xl p-5 border border-white/40">
                  <p className="text-base text-text leading-relaxed italic">"{primarySeason.description}"</p>
                </div>
              </section>
            )}

            {/* 五维分析 */}
            {primaryResult?.dimensions && (
              <section className="mb-6">
                <h2 className="text-xs font-bold text-navy/40 tracking-widest mb-2">综合分析</h2>
                <div className="bg-white/30 rounded-2xl p-5 md:p-6 border border-white/40">
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="shrink-0">
                      <ScoreRadar dimensions={primaryResult.dimensions} size={200} />
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                      {Object.entries(primaryResult.dimensions).map(([key, value]) => {
                        const name = DIMENSION_NAMES[key] || key;
                        return (
                          <div key={key} className="flex gap-3 items-center">
                            <span className="text-sm font-medium w-20">{name}</span>
                            <div className="flex-1 h-2 bg-black/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-navy rounded-full"
                                style={{ width: `${(value / 10) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-navy">{value.toFixed(1)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 本命色卡 + 避雷色卡 */}
            <div className="grid grid-cols-1 gap-5 mb-6 md:grid-cols-2">
              <section>
                <h3 className="text-xs font-bold text-navy mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  本命色卡 · Top 6
                </h3>
                <p className="text-[11px] text-muted mb-3">最适合靠近面部使用</p>
                <div className="flex flex-wrap gap-3">
                  {bestColorRounds.map((round, index) => (
                    <div
                      key={`best-${index}`}
                      className="h-12 w-12 rounded-xl border border-white/60 shadow-sm transition-transform hover:-translate-y-1 cursor-pointer"
                      style={{ backgroundColor: round.color }}
                      title={`${round.colorName} ${round.color}`}
                    />
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-bold text-navy mb-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  避雷色卡 · Bottom 6
                </h3>
                <p className="text-[11px] text-muted mb-3">建议减少靠近面部使用</p>
                <div className="flex flex-wrap gap-3">
                  {avoidColorRounds.map((round, index) => (
                    <div
                      key={`avoid-${index}`}
                      className="h-12 w-12 rounded-xl border border-white/60 shadow-sm transition-transform hover:-translate-y-1 cursor-pointer"
                      style={{ backgroundColor: round.color }}
                      title={`${round.colorName} ${round.color}`}
                    />
                  ))}
                </div>
              </section>
            </div>

            {/* 测试颜色详情 */}
            {history.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xs font-bold text-navy/40 tracking-widest mb-2">测试颜色详情</h2>
                <div className="grid grid-cols-2 gap-3">
                  {rankedRounds.slice(0, 12).map((round, index) => {
                    const isGood = index < 6;
                    const dims = round.dimensions || {};
                    return (
                      <div
                        key={`detail-${index}`}
                        className={`rounded-xl p-3 border ${
                          isGood
                            ? 'bg-green-50/50 border-green-200/50'
                            : 'bg-orange-50/50 border-orange-200/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-6 h-6 rounded-lg border border-white/60"
                            style={{ backgroundColor: round.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-navy truncate">{round.colorName}</p>
                            <p className="text-[10px] text-muted">第{round.roundNumber}轮</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-5 gap-1 text-[10px]">
                          {['skinLift', 'warmth', 'clarity', 'harmony', 'vibe'].map((k) => (
                            <div key={k} className="text-center">
                              <p className="text-muted">{DIMENSION_NAMES[k]?.slice(0, 2)}</p>
                              <p className={`font-medium ${dims[k] >= 7 ? 'text-navy' : 'text-text'}`}>
                                {(dims[k] || 0).toFixed(1)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 重新测试按钮 */}
            <div className="flex justify-center pt-4 border-t border-navy/5">
              <button onClick={() => navigate('/test')} className="btn-cta flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                开始我的测试
              </button>
            </div>
          </div>
        </motion.div>

        <p className="text-center mt-4 text-[10px] text-muted font-mono tracking-widest">BEAUTY HUE</p>
      </div>
    </div>
  );
}