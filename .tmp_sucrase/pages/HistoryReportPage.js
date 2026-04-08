"use strict";const _jsxFileName = "src\\pages\\HistoryReportPage.jsx";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
 * 历史报告详情页面
 * 从数据库加载报告，支持刷新和直接访问
 */

var _react = require('react');
var _reactrouterdom = require('react-router-dom');
var _framermotion = require('framer-motion');
var _lucidereact = require('lucide-react');
var _Navbar = require('../components/layout/Navbar'); var _Navbar2 = _interopRequireDefault(_Navbar);
var _seasonColors = require('../data/seasonColors');
var _ScoreRadar = require('../components/result/ScoreRadar'); var _ScoreRadar2 = _interopRequireDefault(_ScoreRadar);
var _TestColorChips = require('../components/result/TestColorChips'); var _TestColorChips2 = _interopRequireDefault(_TestColorChips);
var _shareCardGenerator = require('../utils/shareCardGenerator');
var _supabase = require('../lib/supabase');

const DIMENSION_CONFIG = {
  skinLift: {
    name: '肤色提亮',
    icon: _lucidereact.Sun,
    insights: {
      high: '这个颜色能明显提亮肤色，让气色看起来更通透。',
      mid: '这个颜色与肤色融合自然，整体表现比较稳定。',
      low: '这个颜色可能会让肤色显得发灰或暗沉，建议谨慎使用。',
    },
  },
  warmth: {
    name: '冷暖匹配',
    icon: _lucidereact.Palette,
    insights: {
      high: '冷暖调性贴合度很高，看起来会更自然协调。',
      mid: '冷暖匹配中等，适合通过妆容或配饰微调。',
      low: '冷暖方向偏差较大，容易显得不够和谐。',
    },
  },
  clarity: {
    name: '五官清晰',
    icon: _lucidereact.Eye,
    insights: {
      high: '这个颜色能让五官更聚焦，轮廓更清晰。',
      mid: '五官表现比较稳定，适合日常使用。',
      low: '五官边界感会偏弱，整体显得不够精神。',
    },
  },
  harmony: {
    name: '对比和谐',
    icon: _lucidereact.Waves,
    insights: {
      high: '整体对比和谐度很高，气质会更统一。',
      mid: '整体和谐度尚可，搭配时有一定灵活度。',
      low: '这个颜色的对比关系偏弱，容易影响整体协调感。',
    },
  },
  vibe: {
    name: '气质匹配',
    icon: _lucidereact.Heart,
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
  if (!_optionalChain([roundData, 'optionalAccess', _ => _.dimensions])) return '暂无该颜色的详细分析数据。';

  const entries = Object.entries(roundData.dimensions);
  const sorted = [...entries].sort(([, a], [, b]) => b - a);
  const [bestKey, bestValue] = sorted[0];
  const [lowestKey, lowestValue] = sorted[sorted.length - 1];
  const bestName = _optionalChain([DIMENSION_CONFIG, 'access', _2 => _2[bestKey], 'optionalAccess', _3 => _3.name]) || bestKey;
  const lowestName = _optionalChain([DIMENSION_CONFIG, 'access', _4 => _4[lowestKey], 'optionalAccess', _5 => _5.name]) || lowestKey;

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

 function HistoryReportPage({ onOpenLogin }) {
  const navigate = _reactrouterdom.useNavigate.call(void 0, );
  const [searchParams] = _reactrouterdom.useSearchParams.call(void 0, );
  const [report, setReport] = _react.useState.call(void 0, null);
  const [loading, setLoading] = _react.useState.call(void 0, true);
  const [error, setError] = _react.useState.call(void 0, null);
  const [selectedRound, setSelectedRound] = _react.useState.call(void 0, null);
  const [hasSelectedChip, setHasSelectedChip] = _react.useState.call(void 0, false);

  _react.useEffect.call(void 0, () => {
    async function loadReport() {
      // 先尝试从 URL 参数获取 reportId
      const reportId = searchParams.get('id');

      if (reportId) {
        // 从数据库加载
        const { data, error } = await _supabase.supabase
          .from('user_reports')
          .select('*')
          .eq('id', reportId)
          .single();

        if (error) {
          setError('报告不存在或已删除');
        } else {
          setReport(data);
        }
      } else {
        // 从 localStorage 加载（兼容旧流程）
        const reportData = localStorage.getItem('beautyHue_historyReport');
        if (reportData) {
          setReport(JSON.parse(reportData));
          // 不删除，保留以便刷新
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

    const blob = await _shareCardGenerator.generateShareCard.call(void 0, report.results, null, report.history);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `beauty-hue-report-${Date.now()}.png`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      React.createElement('div', { className: "bg-kraft min-h-screen flex items-center justify-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}
        , React.createElement(_framermotion.motion.div, {
          animate: { rotate: 360 },
          transition: { duration: 1, repeat: Infinity, ease: 'linear' },
          className: "w-10 h-10 border-3 border-navy/20 border-t-navy rounded-full"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}
        )
      )
    );
  }

  if (error || !report) {
    return (
      React.createElement('div', { className: "bg-kraft min-h-screen flex items-center justify-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}}
        , React.createElement('div', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
          , React.createElement('p', { className: "text-muted mb-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}, error || '报告不存在')
          , React.createElement('button', { onClick: () => navigate('/history'), className: "btn-cta", __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}}, "返回历史"

          )
        )
      )
    );
  }

  const results = report.results || [];
  const history = report.history || [];
  const primaryResult = results[0];
  const secondaryResult = results[1];
  const primarySeason = primaryResult ? _seasonColors.SEASONS[primaryResult.key] : null;
  const secondarySeason = secondaryResult ? _seasonColors.SEASONS[secondaryResult.key] : null;
  const primaryDimensions = _optionalChain([primaryResult, 'optionalAccess', _6 => _6.dimensions]);

  const displayRounds = history.map((entry, index) => ({
    ...entry,
    roundNumber: index + 1,
    seasonNameCN: _optionalChain([_seasonColors.SEASONS, 'access', _7 => _7[entry.seasonKey], 'optionalAccess', _8 => _8.nameCN]) || '',
  }));

  const selectedColorRound = selectedRound !== null ? displayRounds[selectedRound] : null;
  const rankedRounds = [...displayRounds].sort((a, b) => getRoundFinalScore(b) - getRoundFinalScore(a));
  const bestColorRounds = rankedRounds.slice(0, 6);
  const avoidColorRounds = [...rankedRounds].reverse().slice(0, 6);

  return (
    React.createElement('div', { className: "bg-kraft min-h-screen pb-10"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}
      , React.createElement('div', { className: "max-w-[1240px] mx-auto px-5 py-6 md:px-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 217}}
        , React.createElement(_Navbar2.default, { onOpenLogin: onOpenLogin, __self: this, __source: {fileName: _jsxFileName, lineNumber: 218}} )

        /* 返回按钮 */
        , React.createElement(_framermotion.motion.div, {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          className: "relative z-20 mb-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}

          , React.createElement('button', {
            onClick: () => navigate('/history'),
            className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 text-sm text-navy border border-white/30 hover:bg-white/60 transition-colors"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 226}}

            , React.createElement(_lucidereact.ArrowLeft, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 230}} ), "返回历史报告"

          )
        )

        /* 历史报告提示 */
        , React.createElement(_framermotion.motion.div, {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          className: "mb-4 text-center" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 236}}

          , React.createElement('span', { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 text-sm text-muted border border-white/30"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 241}}, "历史报告 · "
              , report.title
          )
        )

        , React.createElement(_framermotion.motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "rounded-3xl border border-white/50 bg-white/40 shadow-2xl backdrop-blur-xl overflow-hidden relative"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 246}}

          , primarySeason && (
            React.createElement('div', {
              className: "absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[60px] opacity-15 pointer-events-none"        ,
              style: { backgroundColor: primarySeason.extremeColor }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 252}}
            )
          )

          , React.createElement('div', { className: "relative p-6 md:p-10"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 258}}
            /* 标题区 */
            , React.createElement('div', { className: "text-center mb-8 pb-8 border-b border-navy/5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 260}}
              , React.createElement('div', { className: "flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 261}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 262}}
                  , React.createElement('span', { className: "text-xs text-muted tracking-widest"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 263}}, "主季型")
                  , React.createElement('h1', { className: "text-3xl md:text-4xl font-bold text-navy flex items-center justify-center gap-2"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 264}}
                    , _optionalChain([primarySeason, 'optionalAccess', _9 => _9.nameCN]) || '未知'
                    , React.createElement(_lucidereact.Sparkles, { className: "w-5 h-5 text-amber-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 266}} )
                  )
                  , React.createElement('p', { className: "text-sm text-navy/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 268}}
                    , _optionalChain([primarySeason, 'optionalAccess', _10 => _10.name]), " · "  , _optionalChain([primaryResult, 'optionalAccess', _11 => _11.score, 'optionalAccess', _12 => _12.toFixed, 'call', _13 => _13(1)]), " 分"
                  )
                )

                , secondarySeason && (
                  React.createElement('div', { className: "md:border-l md:border-navy/10 md:pl-8"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 274}}
                    , React.createElement('span', { className: "text-xs text-muted tracking-widest"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 275}}, "次季型")
                    , React.createElement('p', { className: "text-navy/70", __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}}, secondarySeason.nameCN, " · "  , _optionalChain([secondaryResult, 'optionalAccess', _14 => _14.score, 'optionalAccess', _15 => _15.toFixed, 'call', _16 => _16(1)]), " 分" )
                  )
                )
              )
            )

            /* 色彩特征 */
            , primarySeason && (
              React.createElement('section', { className: "mb-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}
                , React.createElement('h2', { className: "text-xs font-bold text-navy/40 tracking-widest mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}, "色彩特征解析")
                , React.createElement('div', { className: "bg-white/30 rounded-2xl p-5 md:p-6 border border-white/40"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 286}}
                  , React.createElement('p', { className: "text-base text-text leading-relaxed italic"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 287}}, "\"", primarySeason.description, "\"")
                )
              )
            )

            /* 五维分析 */
            , primaryDimensions && (
              React.createElement('section', { className: "mb-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 294}}
                , React.createElement('h2', { className: "text-xs font-bold text-navy/40 tracking-widest mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 295}}, "主季型综合分析")
                , React.createElement('div', { className: "bg-white/30 rounded-2xl p-5 md:p-6 border border-white/40"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 296}}
                  , React.createElement('div', { className: "flex flex-col md:flex-row gap-6 items-center md:items-start"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 297}}
                    , React.createElement('div', { className: "shrink-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}}
                      , React.createElement(_ScoreRadar2.default, { dimensions: primaryDimensions, size: 200, __self: this, __source: {fileName: _jsxFileName, lineNumber: 299}} )
                    )
                    , React.createElement('div', { className: "flex-1 space-y-5 w-full"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 301}}
                      , Object.entries(primaryDimensions).map(([key, value], index) => {
                        const config = DIMENSION_CONFIG[key];
                        const Icon = _optionalChain([config, 'optionalAccess', _17 => _17.icon]);
                        const name = _optionalChain([config, 'optionalAccess', _18 => _18.name]) || key;
                        const insight = getDimensionInsight(value, key);

                        return (
                          React.createElement(_framermotion.motion.div, {
                            key: key,
                            initial: { opacity: 0, x: 10 },
                            animate: { opacity: 1, x: 0 },
                            transition: { delay: index * 0.05 },
                            className: "flex gap-4 items-start"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}

                            , React.createElement('div', { className: "w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shrink-0"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 316}}
                              , React.createElement(Icon, { className: "w-5 h-5 text-navy"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 317}} )
                            )
                            , React.createElement('div', { className: "flex-1 min-w-0 pt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 319}}
                              , React.createElement('div', { className: "flex justify-between text-sm mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 320}}
                                , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}, name)
                                , React.createElement('span', { className: "font-bold text-navy text-[15px]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 322}}, value.toFixed(1))
                              )
                              , React.createElement('div', { className: "h-1.5 bg-black/5 rounded-full overflow-hidden"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 324}}
                                , React.createElement(_framermotion.motion.div, {
                                  initial: { width: 0 },
                                  animate: { width: `${(value / 10) * 100}%` },
                                  className: "h-full bg-navy rounded-full"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 325}}
                                )
                              )
                              , React.createElement('p', { className: "text-sm text-muted mt-2 leading-relaxed"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 331}}, insight)
                            )
                          )
                        );
                      })
                    )
                  )
                )
              )
            )

            /* 测试色卡详情 */
            , history.length > 0 && (
              React.createElement('section', { className: "mb-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 344}}
                , React.createElement('div', { className: "mb-2 flex items-center gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 345}}
                  , React.createElement('h2', { className: "text-xs font-bold text-navy/40 tracking-widest"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 346}}, "测试色卡详情")
                  , !hasSelectedChip && (
                    React.createElement(_framermotion.motion.span, {
                      animate: { y: [0, -4, 0], scale: [1, 1.02, 1] },
                      transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
                      className: "rounded-full border border-sky/60 bg-white/85 px-3 py-1 text-[11px] font-medium text-navy shadow-[0_0_18px_rgba(208,230,253,0.45)]"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 348}}
, "点击色卡查看详细分析"

                    )
                  )
                )
                , React.createElement('div', { className: "bg-white/20 rounded-2xl p-4 md:p-5 border border-white/40"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}
                  , React.createElement(_TestColorChips2.default, {
                    rounds: displayRounds,
                    selectedRound: selectedRound,
                    showHint: false,
                    onSelect: (index) => {
                      setSelectedRound(index);
                      setHasSelectedChip(true);
                    }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 358}}
                  )

                  , React.createElement(_framermotion.AnimatePresence, { mode: "wait", __self: this, __source: {fileName: _jsxFileName, lineNumber: 368}}
                    , hasSelectedChip && selectedColorRound && (
                      React.createElement(_framermotion.motion.div, {
                        key: selectedRound,
                        initial: { opacity: 0, y: 12 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0 },
                        className: "mt-5 pt-5 border-t border-white/30"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 370}}

                        , React.createElement('h3', { className: "text-xs font-medium text-navy/60 mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 377}}, "第 "
                           , selectedColorRound.roundNumber, " 轮 · "   , selectedColorRound.colorName
                        )

                        , React.createElement('div', { className: "flex flex-col sm:flex-row gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 381}}
                          , React.createElement('div', { className: "flex justify-center sm:justify-start shrink-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 382}}
                            , React.createElement(_ScoreRadar2.default, { dimensions: selectedColorRound.dimensions, size: 180, showLegend: false, __self: this, __source: {fileName: _jsxFileName, lineNumber: 383}} )
                          )

                          , React.createElement('div', { className: "flex-1 min-w-0 space-y-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 386}}
                            , React.createElement('div', { className: "flex items-start gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 387}}
                              , React.createElement('div', {
                                className: "w-10 h-10 rounded-lg border border-white/80 shrink-0"     ,
                                style: { backgroundColor: selectedColorRound.color }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 388}}
                              )
                              , React.createElement('div', { className: "min-w-0 space-y-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 392}}
                                , React.createElement('div', { className: "text-sm font-semibold text-navy"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 393}}, selectedColorRound.colorName)
                                , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 394}}
                                  , React.createElement('span', { className: "text-xs text-muted" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 395}}, `${selectedColorRound.seasonNameCN}季型`)
                                  , React.createElement('span', { className: "text-xs font-mono bg-white/60 px-2 py-0.5 rounded"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 396}}, selectedColorRound.color)
                                  , React.createElement('span', {
                                    className: `text-xs px-2 py-0.5 rounded font-medium ${getAiScoreTagClass(
                                      selectedColorRound.systemScore
                                    )}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 397}}

                                    , `AI评分：${selectedColorRound.systemScore.toFixed(1)}`
                                  )
                                  , React.createElement('span', {
                                    className: `text-xs px-2 py-0.5 rounded font-medium ${getUserScoreTagClass(
                                      selectedColorRound.userScore
                                    )}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 404}}

                                    , `用户评分：${getUserScoreLabel(selectedColorRound.userScore)}`
                                  )
                                )
                              )
                            )

                            , React.createElement('div', { className: "grid grid-cols-2 gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 415}}
                              , Object.entries(selectedColorRound.dimensions || {}).map(([key, value]) => {
                                const config = DIMENSION_CONFIG[key];
                                const Icon = _optionalChain([config, 'optionalAccess', _19 => _19.icon]);
                                const name = _optionalChain([config, 'optionalAccess', _20 => _20.name]) || key;

                                return (
                                  React.createElement('div', { key: key, className: "bg-white/40 rounded-xl p-3 border border-white/30"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 422}}
                                    , React.createElement('div', { className: "flex justify-between items-center text-xs mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 423}}
                                      , React.createElement('div', { className: "flex items-center gap-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}
                                        , React.createElement(Icon, { className: "w-3 h-3 text-navy"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 425}} )
                                        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 426}}, name)
                                      )
                                      , React.createElement('span', { className: "font-bold text-navy" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 428}}, value.toFixed(1))
                                    )
                                    , React.createElement('div', { className: "h-1 bg-black/5 rounded-full overflow-hidden"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 430}}
                                      , React.createElement(_framermotion.motion.div, {
                                        initial: { width: 0 },
                                        animate: { width: `${(value / 10) * 100}%` },
                                        className: "h-full bg-navy rounded-full"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 431}}
                                      )
                                    )
                                  )
                                );
                              })
                            )

                            , React.createElement('div', { className: "bg-white/30 rounded-xl p-4 border border-white/30"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 442}}
                              , React.createElement('p', { className: "text-xs font-semibold text-navy mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 443}}, "总体评价")
                              , React.createElement('p', { className: "text-xs text-text leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 444}}, getColorEvaluation(selectedColorRound))
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )

            /* 本命色卡 + 避雷色卡 */
            , React.createElement('div', { className: "grid grid-cols-1 gap-5 mb-6 md:grid-cols-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 456}}
              , React.createElement('section', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 457}}
                , React.createElement('div', { className: "mb-1 flex items-center gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 458}}
                  , React.createElement('h3', { className: "text-xs font-bold text-navy flex items-center gap-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 459}}
                    , React.createElement('span', { className: "w-1.5 h-1.5 rounded-full bg-green-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 460}} ), "本命色卡"

                  )
                )
                , React.createElement('p', { className: "text-[11px] text-muted mb-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 464}}, "综合得分最高，最适合靠近面部使用")
                , React.createElement('div', { className: "flex flex-wrap gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 465}}
                  , bestColorRounds.map((round, index) => (
                    React.createElement('button', {
                      key: `best-${round.roundNumber}-${index}`,
                      type: "button",
                      onClick: () => {
                        setSelectedRound(displayRounds.findIndex((entry) => entry.roundNumber === round.roundNumber));
                        setHasSelectedChip(true);
                      },
                      className: "relative h-12 w-12 overflow-hidden rounded-xl border border-white/60 shadow-sm transition-transform duration-200 hover:-translate-y-1"          ,
                      style: { backgroundColor: round.color },
                      'aria-label': `${round.colorName} ${round.color}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 467}}

                      , React.createElement('div', { className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-1 text-center opacity-0 hover:opacity-100 bg-black/10 hover:opacity-100"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 478}}
                        , React.createElement('div', { className: "text-[10px] font-medium text-[#e5e7eb] leading-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 479}}, round.colorName)
                      )
                    )
                  ))
                )
              )

              , React.createElement('section', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 486}}
                , React.createElement('div', { className: "mb-1 flex items-center gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 487}}
                  , React.createElement('h3', { className: "text-xs font-bold text-navy flex items-center gap-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 488}}
                    , React.createElement('span', { className: "w-1.5 h-1.5 rounded-full bg-red-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 489}} ), "避雷色卡"

                  )
                )
                , React.createElement('p', { className: "text-[11px] text-muted mb-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 493}}, "综合得分最低，建议减少靠近面部使用")
                , React.createElement('div', { className: "flex flex-wrap gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 494}}
                  , avoidColorRounds.map((round, index) => (
                    React.createElement('button', {
                      key: `avoid-${round.roundNumber}-${index}`,
                      type: "button",
                      onClick: () => {
                        setSelectedRound(displayRounds.findIndex((entry) => entry.roundNumber === round.roundNumber));
                        setHasSelectedChip(true);
                      },
                      className: "relative h-12 w-12 overflow-hidden rounded-xl border border-white/60 shadow-sm transition-transform duration-200 hover:-translate-y-1"          ,
                      style: { backgroundColor: round.color },
                      'aria-label': `${round.colorName} ${round.color}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 496}}

                      , React.createElement('div', { className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-1 text-center opacity-0 hover:opacity-100 bg-black/10 hover:opacity-100"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 507}}
                        , React.createElement('div', { className: "text-[10px] font-medium text-[#e5e7eb] leading-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 508}}, round.colorName)
                      )
                    )
                  ))
                )
              )
            )

            /* 操作按钮 */
            , React.createElement('div', { className: "flex gap-2 flex-wrap pt-4 border-t border-navy/5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 517}}
              , React.createElement('button', {
                onClick: handleSaveImage,
                className: "glass-btn flex-1 flex items-center justify-center gap-2 text-sm py-3"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 518}}

                , React.createElement(_lucidereact.Download, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 522}} ), "保存报告"

              )
              , React.createElement('button', { onClick: () => navigate('/test'), className: "glass-btn py-3 px-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 525}}
                , React.createElement(_lucidereact.RotateCcw, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 526}} )
              )
            )

            /* 提示 */
            , React.createElement('div', { className: "mt-4 flex items-start gap-2 text-[10px] text-muted bg-black/5 rounded-lg p-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 531}}
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 532}}, "AI 分析基于 Canvas 像素采样结果，并结合用户的主观评分进行综合判断。"   )
            )
          )
        )

        , React.createElement('p', { className: "text-center mt-4 text-[10px] text-muted font-mono tracking-widest"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 537}}, "BEAUTY HUE" )
      )
    )
  );
} exports.default = HistoryReportPage;
