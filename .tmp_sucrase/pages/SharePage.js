"use strict";const _jsxFileName = "src\\pages\\SharePage.jsx";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
 * 分享结果页面
 * 展示其他人分享的个人色彩诊断报告
 */

var _react = require('react');
var _reactrouterdom = require('react-router-dom');
var _framermotion = require('framer-motion');
var _lucidereact = require('lucide-react');
var _Navbar = require('../components/layout/Navbar'); var _Navbar2 = _interopRequireDefault(_Navbar);
var _seasonColors = require('../data/seasonColors');
var _ScoreRadar = require('../components/result/ScoreRadar'); var _ScoreRadar2 = _interopRequireDefault(_ScoreRadar);
var _shareEncoder = require('../utils/shareEncoder');
var _shareReportService = require('../utils/shareReportService');

const DIMENSION_NAMES = {
  skinLift: '肤色提亮',
  warmth: '冷暖匹配',
  clarity: '五官清晰',
  harmony: '对比和谐',
  vibe: '气质匹配',
};

 function SharePage({ onOpenLogin }) {
  const navigate = _reactrouterdom.useNavigate.call(void 0, );
  const { shareId } = _reactrouterdom.useParams.call(void 0, );
  const [searchParams] = _reactrouterdom.useSearchParams.call(void 0, );
  const [isLoading, setIsLoading] = _react.useState.call(void 0, true);
  const [error, setError] = _react.useState.call(void 0, null);
  const [shareData, setShareData] = _react.useState.call(void 0, null);

  _react.useEffect.call(void 0, () => {
    async function loadShareData() {
      try {
        if (shareId) {
          // 短链接模式：从数据库获取
          const result = await _shareReportService.getShareReport.call(void 0, shareId);
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
            const decoded = _shareEncoder.decodeShareData.call(void 0, encodedData);
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

  const results = _optionalChain([shareData, 'optionalAccess', _ => _.results]) || [];
  const history = _optionalChain([shareData, 'optionalAccess', _2 => _2.history]) || [];
  const primaryResult = results[0];
  const secondaryResult = results[1];
  const primarySeason = primaryResult ? _seasonColors.SEASONS[primaryResult.key] : null;
  const secondarySeason = secondaryResult ? _seasonColors.SEASONS[secondaryResult.key] : null;

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
      React.createElement('div', { className: "bg-kraft min-h-screen flex items-center justify-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}
        , React.createElement('div', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}
          , React.createElement(_framermotion.motion.div, {
            animate: { rotate: 360 },
            transition: { duration: 1, repeat: Infinity, ease: 'linear' },
            className: "w-12 h-12 border-4 border-navy/20 border-t-navy rounded-full mx-auto"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}
          )
          , React.createElement('p', { className: "text-muted mt-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}, "正在加载分享报告...")
        )
      )
    );
  }

  if (error || !shareData) {
    return (
      React.createElement('div', { className: "bg-kraft min-h-screen flex items-center justify-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}
        , React.createElement('div', { className: "text-center px-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 108}}
          , React.createElement('div', { className: "w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}}
            , React.createElement('span', { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}, "😔")
          )
          , React.createElement('h2', { className: "text-lg font-semibold text-navy mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}, "分享链接无效")
          , React.createElement('p', { className: "text-muted mb-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}, error || '数据不存在或已过期')
          , React.createElement('button', { onClick: () => navigate('/'), className: "btn-cta", __self: this, __source: {fileName: _jsxFileName, lineNumber: 114}}, "返回首页"

          )
        )
      )
    );
  }

  return (
    React.createElement('div', { className: "bg-kraft min-h-screen pb-10"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}
      , React.createElement('div', { className: "max-w-[1240px] mx-auto px-5 py-6 md:px-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}
        , React.createElement(_Navbar2.default, { onOpenLogin: onOpenLogin, __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}} )

        /* 分享提示 */
        , React.createElement(_framermotion.motion.div, {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          className: "mb-4 text-center" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 128}}

          , React.createElement('span', { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 text-sm text-muted border border-white/30"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}, "这是他人分享的色彩诊断报告"

            , shareData.createdAt && (
              React.createElement('span', { className: "text-xs", __self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}, "· "
                 , new Date(shareData.createdAt).toLocaleDateString()
              )
            )
          )
        )

        , React.createElement(_framermotion.motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "rounded-3xl border border-white/50 bg-white/40 shadow-2xl backdrop-blur-xl overflow-hidden relative"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}

          , primarySeason && (
            React.createElement('div', {
              className: "absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[60px] opacity-15 pointer-events-none"        ,
              style: { backgroundColor: primarySeason.extremeColor }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 149}}
            )
          )

          , React.createElement('div', { className: "relative p-6 md:p-10"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 155}}
            /* 标题区 */
            , React.createElement('div', { className: "text-center mb-8 pb-8 border-b border-navy/5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 157}}
              , React.createElement('div', { className: "flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 158}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 159}}
                  , React.createElement('span', { className: "text-xs text-muted tracking-widest"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 160}}, "主季型")
                  , React.createElement('h1', { className: "text-3xl md:text-4xl font-bold text-navy flex items-center justify-center gap-2"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}
                    , _optionalChain([primarySeason, 'optionalAccess', _3 => _3.nameCN]) || '未知'
                    , React.createElement(_lucidereact.Sparkles, { className: "w-5 h-5 text-amber-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 163}} )
                  )
                  , React.createElement('p', { className: "text-sm text-navy/60" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 165}}
                    , _optionalChain([primarySeason, 'optionalAccess', _4 => _4.name]), " · "  , _optionalChain([primaryResult, 'optionalAccess', _5 => _5.score, 'optionalAccess', _6 => _6.toFixed, 'call', _7 => _7(1)]), " 分"
                  )
                )

                , secondarySeason && (
                  React.createElement('div', { className: "md:border-l md:border-navy/10 md:pl-8"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 171}}
                    , React.createElement('span', { className: "text-xs text-muted tracking-widest"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 172}}, "次季型")
                    , React.createElement('p', { className: "text-navy/70", __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}, secondarySeason.nameCN, " · "  , _optionalChain([secondaryResult, 'optionalAccess', _8 => _8.score, 'optionalAccess', _9 => _9.toFixed, 'call', _10 => _10(1)]), " 分" )
                  )
                )
              )
            )

            /* 色彩特征 */
            , primarySeason && (
              React.createElement('section', { className: "mb-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}
                , React.createElement('h2', { className: "text-xs font-bold text-navy/40 tracking-widest mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 182}}, "色彩特征解析")
                , React.createElement('div', { className: "bg-white/30 rounded-2xl p-5 border border-white/40"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 183}}
                  , React.createElement('p', { className: "text-base text-text leading-relaxed italic"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 184}}, "\"", primarySeason.description, "\"")
                )
              )
            )

            /* 五维分析 */
            , _optionalChain([primaryResult, 'optionalAccess', _11 => _11.dimensions]) && (
              React.createElement('section', { className: "mb-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 191}}
                , React.createElement('h2', { className: "text-xs font-bold text-navy/40 tracking-widest mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 192}}, "综合分析")
                , React.createElement('div', { className: "bg-white/30 rounded-2xl p-5 md:p-6 border border-white/40"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 193}}
                  , React.createElement('div', { className: "flex flex-col md:flex-row gap-6 items-center md:items-start"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 194}}
                    , React.createElement('div', { className: "shrink-0", __self: this, __source: {fileName: _jsxFileName, lineNumber: 195}}
                      , React.createElement(_ScoreRadar2.default, { dimensions: primaryResult.dimensions, size: 200, __self: this, __source: {fileName: _jsxFileName, lineNumber: 196}} )
                    )
                    , React.createElement('div', { className: "flex-1 space-y-4 w-full"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 198}}
                      , Object.entries(primaryResult.dimensions).map(([key, value]) => {
                        const name = DIMENSION_NAMES[key] || key;
                        return (
                          React.createElement('div', { key: key, className: "flex gap-3 items-center"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 202}}
                            , React.createElement('span', { className: "text-sm font-medium w-20"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 203}}, name)
                            , React.createElement('div', { className: "flex-1 h-2 bg-black/5 rounded-full overflow-hidden"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 204}}
                              , React.createElement('div', {
                                className: "h-full bg-navy rounded-full"  ,
                                style: { width: `${(value / 10) * 100}%` }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}
                              )
                            )
                            , React.createElement('span', { className: "text-sm font-bold text-navy"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 210}}, value.toFixed(1))
                          )
                        );
                      })
                    )
                  )
                )
              )
            )

            /* 本命色卡 + 避雷色卡 */
            , React.createElement('div', { className: "grid grid-cols-1 gap-5 mb-6 md:grid-cols-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}
              , React.createElement('section', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 222}}
                , React.createElement('h3', { className: "text-xs font-bold text-navy mb-2 flex items-center gap-1"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 223}}
                  , React.createElement('span', { className: "w-1.5 h-1.5 rounded-full bg-green-500"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 224}} ), "本命色卡 · Top 6"

                )
                , React.createElement('p', { className: "text-[11px] text-muted mb-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 227}}, "最适合靠近面部使用")
                , React.createElement('div', { className: "flex flex-wrap gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}
                  , bestColorRounds.map((round, index) => (
                    React.createElement('div', {
                      key: `best-${index}`,
                      className: "h-12 w-12 rounded-xl border border-white/60 shadow-sm transition-transform hover:-translate-y-1 cursor-pointer"        ,
                      style: { backgroundColor: round.color },
                      title: `${round.colorName} ${round.color}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 230}}
                    )
                  ))
                )
              )

              , React.createElement('section', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 240}}
                , React.createElement('h3', { className: "text-xs font-bold text-navy mb-2 flex items-center gap-1"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 241}}
                  , React.createElement('span', { className: "w-1.5 h-1.5 rounded-full bg-red-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}} ), "避雷色卡 · Bottom 6"

                )
                , React.createElement('p', { className: "text-[11px] text-muted mb-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 245}}, "建议减少靠近面部使用")
                , React.createElement('div', { className: "flex flex-wrap gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 246}}
                  , avoidColorRounds.map((round, index) => (
                    React.createElement('div', {
                      key: `avoid-${index}`,
                      className: "h-12 w-12 rounded-xl border border-white/60 shadow-sm transition-transform hover:-translate-y-1 cursor-pointer"        ,
                      style: { backgroundColor: round.color },
                      title: `${round.colorName} ${round.color}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}}
                    )
                  ))
                )
              )
            )

            /* 测试颜色详情 */
            , history.length > 0 && (
              React.createElement('section', { className: "mb-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 261}}
                , React.createElement('h2', { className: "text-xs font-bold text-navy/40 tracking-widest mb-2"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 262}}, "测试颜色详情")
                , React.createElement('div', { className: "grid grid-cols-2 gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 263}}
                  , rankedRounds.slice(0, 12).map((round, index) => {
                    const isGood = index < 6;
                    const dims = round.dimensions || {};
                    return (
                      React.createElement('div', {
                        key: `detail-${index}`,
                        className: `rounded-xl p-3 border ${
                          isGood
                            ? 'bg-green-50/50 border-green-200/50'
                            : 'bg-orange-50/50 border-orange-200/50'
                        }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 268}}

                        , React.createElement('div', { className: "flex items-center gap-2 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}}
                          , React.createElement('div', {
                            className: "w-6 h-6 rounded-lg border border-white/60"    ,
                            style: { backgroundColor: round.color }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 277}}
                          )
                          , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 281}}
                            , React.createElement('p', { className: "text-xs font-semibold text-navy truncate"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}, round.colorName)
                            , React.createElement('p', { className: "text-[10px] text-muted" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 283}}, "第", round.roundNumber, "轮")
                          )
                        )
                        , React.createElement('div', { className: "grid grid-cols-5 gap-1 text-[10px]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 286}}
                          , ['skinLift', 'warmth', 'clarity', 'harmony', 'vibe'].map((k) => (
                            React.createElement('div', { key: k, className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 288}}
                              , React.createElement('p', { className: "text-muted", __self: this, __source: {fileName: _jsxFileName, lineNumber: 289}}, _optionalChain([DIMENSION_NAMES, 'access', _12 => _12[k], 'optionalAccess', _13 => _13.slice, 'call', _14 => _14(0, 2)]))
                              , React.createElement('p', { className: `font-medium ${dims[k] >= 7 ? 'text-navy' : 'text-text'}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 290}}
                                , (dims[k] || 0).toFixed(1)
                              )
                            )
                          ))
                        )
                      )
                    );
                  })
                )
              )
            )

            /* 重新测试按钮 */
            , React.createElement('div', { className: "flex justify-center pt-4 border-t border-navy/5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}
              , React.createElement('button', { onClick: () => navigate('/test'), className: "btn-cta flex items-center gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}}
                , React.createElement(_lucidereact.RotateCcw, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 306}} ), "开始我的测试"

              )
            )
          )
        )

        , React.createElement('p', { className: "text-center mt-4 text-[10px] text-muted font-mono tracking-widest"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}, "BEAUTY HUE" )
      )
    )
  );
} exports.default = SharePage;