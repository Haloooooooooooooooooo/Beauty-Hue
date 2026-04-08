"use strict";const _jsxFileName = "src\\pages\\ResultPage.jsx";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _react = require('react');
var _reactrouterdom = require('react-router-dom');










var _lucidereact = require('lucide-react');
var _framermotion = require('framer-motion');
var _Navbar = require('../components/layout/Navbar'); var _Navbar2 = _interopRequireDefault(_Navbar);
var _seasonColors = require('../data/seasonColors');
var _colorAnalyzer = require('../engine/colorAnalyzer');
var _ScoreRadar = require('../components/result/ScoreRadar'); var _ScoreRadar2 = _interopRequireDefault(_ScoreRadar);
var _TestColorChips = require('../components/result/TestColorChips'); var _TestColorChips2 = _interopRequireDefault(_TestColorChips);
var _ShareButton = require('../components/result/ShareButton'); var _ShareButton2 = _interopRequireDefault(_ShareButton);
var _SaveReportButton = require('../components/result/SaveReportButton'); var _SaveReportButton2 = _interopRequireDefault(_SaveReportButton);
var _AuthContext = require('../context/AuthContext');
var _userReportService = require('../utils/userReportService');

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

function getPreferredRoundIndex(history, seasonKey) {
  const matchingRounds = history
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => entry.seasonKey === seasonKey);

  if (!matchingRounds.length) return 0;

  return [...matchingRounds].sort((a, b) => {
    if (b.entry.phase !== a.entry.phase) return b.entry.phase - a.entry.phase;
    return (b.entry.userScore || 0) - (a.entry.userScore || 0);
  })[0].index;
}

 function ResultPage({ onOpenLogin }) {
  const navigate = _reactrouterdom.useNavigate.call(void 0, );
  const { user } = _react.useContext.call(void 0, _AuthContext.AuthContext);
  const [results, setResults] = _react.useState.call(void 0, null);
  const [image, setImage] = _react.useState.call(void 0, null);
  const [systemHistory, setSystemHistory] = _react.useState.call(void 0, []);
  const [screenshots, setScreenshots] = _react.useState.call(void 0, []);
  const [seasonType, setSeasonType] = _react.useState.call(void 0, 'primary');
  const [selectedRound, setSelectedRound] = _react.useState.call(void 0, null);
  const [hasSelectedChip, setHasSelectedChip] = _react.useState.call(void 0, false);
  const [reportSaved, setReportSaved] = _react.useState.call(void 0, false);

  _react.useEffect.call(void 0, () => {
    const userScores = JSON.parse(localStorage.getItem('beautyHue_scores') || '{}');
    const history = JSON.parse(localStorage.getItem('beautyHue_systemHistory') || '[]');
    const userImage = localStorage.getItem('beautyHue_image');
    const storedScreenshots = JSON.parse(localStorage.getItem('beautyHue_screenshots') || '[]');

    if (!userImage || Object.keys(userScores).length === 0 || history.length === 0) {
      navigate('/test');
      return;
    }

    setImage(userImage);
    setSystemHistory(history);
    setScreenshots(Array.isArray(storedScreenshots) ? storedScreenshots : []);
    const calculatedResults = _colorAnalyzer.calculateFinalResults.call(void 0, history, userScores);
    setResults(calculatedResults);

    // 自动保存登录用户的报告
    if (user && calculatedResults && history.length > 0) {
      const savedKey = `beautyHue_reportSaved_${Date.now().toString().slice(0, -5)}`;
      const alreadySaved = localStorage.getItem('beautyHue_currentReportSaved');

      if (!alreadySaved) {
        _userReportService.saveUserReport.call(void 0, {
          userId: user.email,
          results: calculatedResults,
          history: history,
        }).then((result) => {
          if (result.success) {
            setReportSaved(true);
            localStorage.setItem('beautyHue_currentReportSaved', 'true');
          }
        });
      }
    }
  }, [navigate, user]);

  const primaryResult = _optionalChain([results, 'optionalAccess', _6 => _6[0]]);
  const secondaryResult = _optionalChain([results, 'optionalAccess', _7 => _7[1]]);
  const primarySeason = primaryResult ? _seasonColors.SEASONS[primaryResult.key] : null;
  const secondarySeason = secondaryResult ? _seasonColors.SEASONS[secondaryResult.key] : null;
  const activeResult = seasonType === 'secondary' && secondaryResult ? secondaryResult : primaryResult;
  const activeSeason = activeResult ? _seasonColors.SEASONS[activeResult.key] : primarySeason;
  const activeSeasonKey = _optionalChain([activeResult, 'optionalAccess', _8 => _8.key]);
  const activeDimensions = _optionalChain([activeResult, 'optionalAccess', _9 => _9.dimensions]);

  const displayRounds = systemHistory.map((entry, index) => ({
    ...entry,
    roundNumber: index + 1,
    seasonNameCN: _optionalChain([_seasonColors.SEASONS, 'access', _10 => _10[entry.seasonKey], 'optionalAccess', _11 => _11.nameCN]) || '',
  }));

  const selectedColorRound = selectedRound !== null ? displayRounds[selectedRound] : null;
  const rankedRounds = [...displayRounds].sort((a, b) => getRoundFinalScore(b) - getRoundFinalScore(a));
  const bestColorRounds = rankedRounds.slice(0, 6);
  const avoidColorRounds = [...rankedRounds].reverse().slice(0, 6);

  _react.useEffect.call(void 0, () => {
    if (!_optionalChain([results, 'optionalAccess', _12 => _12.length]) || !systemHistory.length || !activeSeasonKey) return;
    setSelectedRound(getPreferredRoundIndex(systemHistory, activeSeasonKey));
  }, [results, systemHistory, activeSeasonKey]);

  if (!results || !primarySeason || !activeResult) return null;

  const handleDownloadScreenshot = (screenshot, index) => {
    if (!_optionalChain([screenshot, 'optionalAccess', _13 => _13.image])) return;

    const link = document.createElement('a');
    link.href = screenshot.image;
    link.download = `beauty-hue-frame-${index + 1}.png`;
    link.click();
  };

  return (
    React.createElement('div', { className: "bg-kraft min-h-screen pb-10"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 223}}
      , React.createElement('div', { className: "max-w-[1240px] mx-auto px-5 py-6 md:px-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 224}}
        , React.createElement(_Navbar2.default, { onOpenLogin: onOpenLogin, __self: this, __source: {fileName: _jsxFileName, lineNumber: 225}} )

        , React.createElement(_framermotion.motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "mt-6 rounded-3xl border border-white/50 bg-white/40 shadow-2xl backdrop-blur-xl overflow-hidden relative"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 227}}

          , React.createElement('div', {
            className: "absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[60px] opacity-15 pointer-events-none"        ,
            style: { backgroundColor: activeSeason.extremeColor }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 232}}
          )

          , React.createElement('div', { className: "relative p-6 md:p-10"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 237}}
            , React.createElement('div', { className: "text-center mb-8 pb-8 border-b border-navy/5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 238}}
              , React.createElement('div', { className: "w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/80 shadow-lg mx-auto mb-5"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 239}}
                , React.createElement('img', { src: image, alt: "测试结果头像", className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 240}} )
              )

              , React.createElement('div', { className: "flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 243}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}
                  , React.createElement('span', { className: "text-xs text-muted tracking-widest"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 245}}, "主季型")
                  , React.createElement('h1', { className: "text-3xl md:text-4xl font-bold text-navy flex items-center justify-center gap-2"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 246}}
                    , primarySeason.nameCN
                    , React.createElement(_lucidereact.Sparkles, { className: "w-5 h-5 text-amber-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}} )
                  )
                  , React.createElement('p', { className: "text-sm text-navy/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}, primarySeason.name, " · "  , primaryResult.score.toFixed(1), " 分" )
                )

                , secondarySeason && (
                  React.createElement('div', { className: "md:border-l md:border-navy/10 md:pl-8"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 254}}
                    , React.createElement('span', { className: "text-xs text-muted tracking-widest"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 255}}, "次季型")
                    , React.createElement('p', { className: "text-navy/70", __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}}, secondarySeason.nameCN, " · "  , secondaryResult.score.toFixed(1), " 分" )
                    , React.createElement('button', {
                      onClick: () => {
                        setSeasonType(seasonType === 'primary' ? 'secondary' : 'primary');
                        setHasSelectedChip(false);
                      },
                      className: "glass-btn px-3 py-1 text-xs mt-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 257}}

                      , seasonType === 'primary' ? '切换次季型' : '切换主季型'
                    )
                  )
                )
              )
            )

            , React.createElement('section', { className: "mb-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}}
              , React.createElement('h2', { className: "text-xs font-bold text-navy/40 tracking-widest mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}, "色彩特征解析")
              , React.createElement('div', { className: "bg-white/30 rounded-2xl p-5 md:p-6 border border-white/40"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 273}}
                , React.createElement('p', { className: "text-base text-text leading-relaxed italic"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 274}}, "\"", activeSeason.description, "\"")
              )
            )

            , React.createElement(_framermotion.AnimatePresence, { mode: "wait", __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}}
              , activeDimensions && (
                React.createElement(_framermotion.motion.section, {
                  key: seasonType,
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  className: "mb-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}

                  , React.createElement('h2', { className: "text-xs font-bold text-navy/40 tracking-widest mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 287}}
                    , seasonType === 'primary' ? '主季型综合分析' : '次季型综合分析'
                  )
                  , React.createElement('div', { className: "bg-white/30 rounded-2xl p-5 md:p-6 border border-white/40"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 290}}
                    , React.createElement('div', { className: "flex flex-col md:flex-row gap-6 items-center md:items-start"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}
                      , React.createElement('div', { className: "shrink-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 292}}
                        , React.createElement(_ScoreRadar2.default, { dimensions: activeDimensions, size: 200, __self: this, __source: {fileName: _jsxFileName, lineNumber: 293}} )
                      )
                      , React.createElement('div', { className: "flex-1 space-y-5 w-full"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 295}}
                        , Object.entries(activeDimensions).map(([key, value], index) => {
                          const config = DIMENSION_CONFIG[key];
                          const Icon = _optionalChain([config, 'optionalAccess', _14 => _14.icon]);
                          const name = _optionalChain([config, 'optionalAccess', _15 => _15.name]) || key;
                          const insight = getDimensionInsight(value, key);

                          return (
                            React.createElement(_framermotion.motion.div, {
                              key: key,
                              initial: { opacity: 0, x: 10 },
                              animate: { opacity: 1, x: 0 },
                              transition: { delay: index * 0.05 },
                              className: "flex gap-4 items-start"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 303}}

                              , React.createElement('div', { className: "w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shrink-0"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}
                                , React.createElement(Icon, { className: "w-5 h-5 text-navy"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 311}} )
                              )
                              , React.createElement('div', { className: "flex-1 min-w-0 pt-0.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}
                                , React.createElement('div', { className: "flex justify-between text-sm mb-1.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 314}}
                                  , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 315}}, name)
                                  , React.createElement('span', { className: "font-bold text-navy text-[15px]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 316}}, value.toFixed(1))
                                )
                                , React.createElement('div', { className: "h-1.5 bg-black/5 rounded-full overflow-hidden"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 318}}
                                  , React.createElement(_framermotion.motion.div, {
                                    initial: { width: 0 },
                                    animate: { width: `${(value / 10) * 100}%` },
                                    className: "h-full bg-navy rounded-full"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 319}}
                                  )
                                )
                                , React.createElement('p', { className: "text-sm text-muted mt-2 leading-relaxed"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 325}}, insight)
                              )
                            )
                          );
                        })
                      )
                    )
                  )
                )
              )
            )

            , React.createElement('section', { className: "mb-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 337}}
              , React.createElement('div', { className: "mb-2 flex items-center gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 338}}
                , React.createElement('h2', { className: "text-xs font-bold text-navy/40 tracking-widest"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 339}}, "测试色卡详情")
                , !hasSelectedChip && (
                  React.createElement(_framermotion.motion.span, {
                    animate: { y: [0, -4, 0], scale: [1, 1.02, 1] },
                    transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
                    className: "rounded-full border border-sky/60 bg-white/85 px-3 py-1 text-[11px] font-medium text-navy shadow-[0_0_18px_rgba(208,230,253,0.45)]"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 341}}
, "点击色卡查看详细分析"

                  )
                )
              )
              , React.createElement('div', { className: "bg-white/20 rounded-2xl p-4 md:p-5 border border-white/40"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 350}}
                , React.createElement(_TestColorChips2.default, {
                  rounds: displayRounds,
                  selectedRound: selectedRound,
                  showHint: false,
                  onSelect: (index) => {
                    setSelectedRound(index);
                    setHasSelectedChip(true);
                  }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 351}}
                )

                , React.createElement(_framermotion.AnimatePresence, { mode: "wait", __self: this, __source: {fileName: _jsxFileName, lineNumber: 361}}
                  , hasSelectedChip && selectedColorRound && (
                    React.createElement(_framermotion.motion.div, {
                      key: selectedRound,
                      initial: { opacity: 0, y: 12 },
                      animate: { opacity: 1, y: 0 },
                      exit: { opacity: 0 },
                      className: "mt-5 pt-5 border-t border-white/30"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 363}}

                      , React.createElement('h3', { className: "text-xs font-medium text-navy/60 mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 370}}, "第 "
                         , selectedColorRound.roundNumber, " 轮 · "   , selectedColorRound.colorName
                      )

                      , React.createElement('div', { className: "flex flex-col sm:flex-row gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 374}}
                        , React.createElement('div', { className: "flex justify-center sm:justify-start shrink-0"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 375}}
                          , React.createElement(_ScoreRadar2.default, { dimensions: selectedColorRound.dimensions, size: 180, showLegend: false, __self: this, __source: {fileName: _jsxFileName, lineNumber: 376}} )
                        )

                        , React.createElement('div', { className: "flex-1 min-w-0 space-y-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 379}}
                          , React.createElement('div', { className: "flex items-start gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 380}}
                            , React.createElement('div', {
                              className: "w-10 h-10 rounded-lg border border-white/80 shrink-0"     ,
                              style: { backgroundColor: selectedColorRound.color }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 381}}
                            )
                            , React.createElement('div', { className: "min-w-0 space-y-1" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 385}}
                              , React.createElement('div', { className: "text-sm font-semibold text-navy"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 386}}, selectedColorRound.colorName)
                              , React.createElement('div', { className: "flex items-center gap-2 flex-wrap"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 387}}
                                , React.createElement('span', { className: "text-xs text-muted" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 388}}, `${selectedColorRound.seasonNameCN}季型`)
                                , React.createElement('span', { className: "text-xs font-mono bg-white/60 px-2 py-0.5 rounded"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 389}}, selectedColorRound.color)
                                , React.createElement('span', {
                                  className: `text-xs px-2 py-0.5 rounded font-medium ${getAiScoreTagClass(
                                    selectedColorRound.systemScore
                                  )}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 390}}

                                  , `AI评分：${selectedColorRound.systemScore.toFixed(1)}`
                                )
                                , React.createElement('span', {
                                  className: `text-xs px-2 py-0.5 rounded font-medium ${getUserScoreTagClass(
                                    selectedColorRound.userScore
                                  )}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 397}}

                                  , `用户评分：${getUserScoreLabel(selectedColorRound.userScore)}`
                                )
                              )
                            )
                          )

                          , React.createElement('div', { className: "grid grid-cols-2 gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 408}}
                            , Object.entries(selectedColorRound.dimensions || {}).map(([key, value]) => {
                              const config = DIMENSION_CONFIG[key];
                              const Icon = _optionalChain([config, 'optionalAccess', _16 => _16.icon]);
                              const name = _optionalChain([config, 'optionalAccess', _17 => _17.name]) || key;

                              return (
                                React.createElement('div', { key: key, className: "bg-white/40 rounded-xl p-3 border border-white/30"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 415}}
                                  , React.createElement('div', { className: "flex justify-between items-center text-xs mb-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 416}}
                                    , React.createElement('div', { className: "flex items-center gap-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 417}}
                                      , React.createElement(Icon, { className: "w-3 h-3 text-navy"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 418}} )
                                      , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 419}}, name)
                                    )
                                    , React.createElement('span', { className: "font-bold text-navy" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 421}}, value.toFixed(1))
                                  )
                                  , React.createElement('div', { className: "h-1 bg-black/5 rounded-full overflow-hidden"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 423}}
                                    , React.createElement(_framermotion.motion.div, {
                                      initial: { width: 0 },
                                      animate: { width: `${(value / 10) * 100}%` },
                                      className: "h-full bg-navy rounded-full"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}
                                    )
                                  )
                                )
                              );
                            })
                          )

                          , React.createElement('div', { className: "bg-white/30 rounded-xl p-4 border border-white/30"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 435}}
                            , React.createElement('p', { className: "text-xs font-semibold text-navy mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 436}}, "总体评价")
                            , React.createElement('p', { className: "text-xs text-text leading-relaxed"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 437}}, getColorEvaluation(selectedColorRound))
                          )
                        )
                      )
                    )
                  )
                )
              )
            )

            , React.createElement('div', { className: "grid grid-cols-1 gap-5 mb-6 md:grid-cols-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 447}}
              , React.createElement('section', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 448}}
                , React.createElement('div', { className: "mb-1 flex items-center gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 449}}
                  , React.createElement('h3', { className: "text-xs font-bold text-navy flex items-center gap-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 450}}
                    , React.createElement('span', { className: "w-1.5 h-1.5 rounded-full bg-green-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 451}} ), "本命色卡"

                  )
                  , !hasSelectedChip && (
                    React.createElement('span', { className: "rounded-full border border-sky/60 bg-white/85 px-3 py-1 text-[11px] font-medium text-navy shadow-[0_0_18px_rgba(208,230,253,0.45)]"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 455}}, "点击色卡查看具体分析"

                    )
                  )
                )
                , React.createElement('p', { className: "text-[11px] text-muted mb-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 460}}, "综合得分最高，最适合靠近面部使用")
                , React.createElement('div', { className: "flex flex-wrap gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 461}}
                  , bestColorRounds.map((round, index) => (
                    React.createElement('div', { key: `best-${round.roundNumber}-${index}`, className: "relative group" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 463}}
                      , React.createElement('button', {
                        type: "button",
                        onClick: () => {
                          setSelectedRound(displayRounds.findIndex((entry) => entry.roundNumber === round.roundNumber));
                          setHasSelectedChip(true);
                        },
                        className: "relative h-12 w-12 overflow-hidden rounded-xl border border-white/60 shadow-sm transition-transform duration-200 hover:-translate-y-1"          ,
                        style: { backgroundColor: round.color },
                        'aria-label': `${round.colorName} ${round.color}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 464}}

                        , React.createElement('div', { className: "pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 474}} )
                        , React.createElement('div', { className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-1 text-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 475}}
                          , React.createElement('div', { className: "text-[10px] font-medium text-[#e5e7eb] leading-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 476}}, round.colorName)
                          , React.createElement('div', { className: "text-[9px] font-mono text-[#d1d5db] leading-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 477}}, round.color)
                        )
                      )
                    )
                  ))
                )
              )

              , React.createElement('section', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 485}}
                , React.createElement('div', { className: "mb-1 flex items-center gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 486}}
                  , React.createElement('h3', { className: "text-xs font-bold text-navy flex items-center gap-1"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 487}}
                    , React.createElement('span', { className: "w-1.5 h-1.5 rounded-full bg-red-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 488}} ), "避雷色卡"

                  )
                  , !hasSelectedChip && (
                    React.createElement('span', { className: "rounded-full border border-sky/60 bg-white/85 px-3 py-1 text-[11px] font-medium text-navy shadow-[0_0_18px_rgba(208,230,253,0.45)]"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 492}}, "点击色卡查看具体分析"

                    )
                  )
                )
                , React.createElement('p', { className: "text-[11px] text-muted mb-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 497}}, "综合得分最低，建议减少靠近面部使用")
                , React.createElement('div', { className: "flex flex-wrap gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 498}}
                  , avoidColorRounds.map((round, index) => (
                    React.createElement('div', { key: `avoid-${round.roundNumber}-${index}`, className: "relative group" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 500}}
                      , React.createElement('button', {
                        type: "button",
                        onClick: () => {
                          setSelectedRound(displayRounds.findIndex((entry) => entry.roundNumber === round.roundNumber));
                          setHasSelectedChip(true);
                        },
                        className: "relative h-12 w-12 overflow-hidden rounded-xl border border-white/60 shadow-sm transition-transform duration-200 hover:-translate-y-1"          ,
                        style: { backgroundColor: round.color },
                        'aria-label': `${round.colorName} ${round.color}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 501}}

                        , React.createElement('div', { className: "pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 511}} )
                        , React.createElement('div', { className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-1 text-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 512}}
                          , React.createElement('div', { className: "text-[10px] font-medium text-[#e5e7eb] leading-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 513}}, round.colorName)
                          , React.createElement('div', { className: "text-[9px] font-mono text-[#d1d5db] leading-tight"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 514}}, round.color)
                        )
                      )
                    )
                  ))
                )
              )
            )

            , React.createElement('section', { className: "mb-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 523}}
              , React.createElement('div', { className: "rounded-2xl border border-white/40 bg-white/20 p-4 md:p-5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 524}}
                , screenshots.length ? (
                  React.createElement('div', { className: "flex flex-wrap gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 526}}
                    , screenshots.slice(0, 6).map((screenshot, index) => (
                      React.createElement('div', {
                        key: screenshot.id || `${screenshot.roundNumber}-${index}`,
                        className: "group relative w-[112px] shrink-0 overflow-hidden rounded-[18px] border border-white/50 bg-white/55 shadow-md sm:w-[124px]"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 528}}

                        , React.createElement('img', {
                          src: screenshot.image,
                          alt: `测试相框截图 ${index + 1}`,
                          className: "aspect-[30/23] w-full object-contain bg-[#f7f2ea]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 532}}
                        )
                        , React.createElement('div', { className: "pointer-events-none absolute inset-0 bg-black/8 opacity-0 transition-opacity duration-200 group-hover:opacity-100"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 537}} )
                        , React.createElement('button', {
                          type: "button",
                          onClick: () => handleDownloadScreenshot(screenshot, index),
                          className: "absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/92 text-navy shadow-md opacity-0 transition-opacity duration-200 hover:bg-white group-hover:opacity-100"                ,
                          'aria-label': `下载截图 ${index + 1}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 538}}

                          , React.createElement(_lucidereact.Download, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 544}} )
                        )
                      )
                    ))
                  )
                ) : (
                  React.createElement('div', { className: "flex min-h-[180px] items-center justify-center rounded-[24px] border border-dashed border-navy/15 bg-white/35 text-sm text-muted"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 550}}, "本次测试还没有截图"

                  )
                )
              )
            )

            , React.createElement('div', { className: "hidden grid-cols-2 gap-4 mb-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 557}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 558}}
                , React.createElement('h3', { className: "text-xs font-bold text-navy mb-2 flex items-center gap-1"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 559}}
                  , React.createElement('span', { className: "w-1.5 h-1.5 rounded-full bg-green-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 560}} ), "本命色系"

                )
                , React.createElement('div', { className: "flex flex-wrap gap-1.5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 563}}
                  , [activeSeason.extremeColor, activeSeason.dailyColor, ...(activeSeason.palette || [])].slice(0, 6).map((color, index) => (
                    React.createElement('div', { key: index, className: "w-8 h-8 rounded-lg border border-white/50"    , style: { backgroundColor: color }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 565}} )
                  ))
                )
              )
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 569}}
                , React.createElement('h3', { className: "text-xs font-bold text-navy mb-2 flex items-center gap-1"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 570}}
                  , React.createElement('span', { className: "w-1.5 h-1.5 rounded-full bg-red-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 571}} ), "建议避雷"

                )
                , React.createElement('div', { className: "flex flex-wrap gap-1.5 opacity-60"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 574}}
                  , (activeSeason.avoid || ['#333333', '#1A1A1A', '#4A4A4A', '#2D2D2D']).map((color, index) => (
                    React.createElement('div', {
                      key: index,
                      className: "w-8 h-8 rounded-lg border border-white/50 grayscale-[0.3]"     ,
                      style: { backgroundColor: color }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 576}}
                    )
                  ))
                )
              )
            )

            , React.createElement('div', { className: "flex gap-2 flex-wrap pt-4 border-t border-navy/5"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 586}}
              , React.createElement(_ShareButton2.default, { results: results, systemHistory: systemHistory, __self: this, __source: {fileName: _jsxFileName, lineNumber: 587}} )
              , React.createElement(_SaveReportButton2.default, { results: results, image: image, systemHistory: systemHistory, __self: this, __source: {fileName: _jsxFileName, lineNumber: 588}} )
              , React.createElement('button', { onClick: () => navigate('/test'), className: "glass-btn py-3 px-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 589}}
                , React.createElement(_lucidereact.RotateCcw, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 590}} )
              )
            )

            , React.createElement('div', { className: "mt-4 flex items-start gap-2 text-[10px] text-muted bg-black/5 rounded-lg p-2"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 594}}
              , React.createElement(_lucidereact.AlertCircle, { className: "w-3 h-3 shrink-0 mt-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 595}} )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 596}}, "AI 分析基于 Canvas 像素采样结果，并结合你的主观评分进行综合判断。"   )
            )
          )
        )

        , React.createElement('p', { className: "text-center mt-4 text-[10px] text-muted font-mono tracking-widest"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 601}}, "BEAUTY HUE" )
      )
    )
  );
} exports.default = ResultPage;
