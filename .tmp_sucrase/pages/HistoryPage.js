"use strict";const _jsxFileName = "src\\pages\\HistoryPage.jsx";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
 * 历史报告页面
 * 展示用户保存的全部色彩诊断报告
 */

var _react = require('react');
var _reactrouterdom = require('react-router-dom');
var _framermotion = require('framer-motion');
var _lucidereact = require('lucide-react');
var _AuthContext = require('../context/AuthContext');
var _Navbar = require('../components/layout/Navbar'); var _Navbar2 = _interopRequireDefault(_Navbar);
var _userReportService = require('../utils/userReportService');
var _seasonColors = require('../data/seasonColors');

 function HistoryPage({ onOpenLogin }) {
  const navigate = _reactrouterdom.useNavigate.call(void 0, );
  const { user, initialized } = _react.useContext.call(void 0, _AuthContext.AuthContext);
  const [reports, setReports] = _react.useState.call(void 0, []);
  const [loading, setLoading] = _react.useState.call(void 0, true);
  const [error, setError] = _react.useState.call(void 0, null);
  const [deleteConfirm, setDeleteConfirm] = _react.useState.call(void 0, null);

  _react.useEffect.call(void 0, () => {
    async function fetchReports() {
      if (!initialized) return;

      if (!user) {
        navigate('/');
        return;
      }

      const result = await _userReportService.getUserReports.call(void 0, user.email);
      if (result.success) {
        setReports(result.reports);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }

    fetchReports();
  }, [user, initialized, navigate]);

  const handleViewReport = (report) => {
    localStorage.setItem('beautyHue_historyReport', JSON.stringify(report));
    navigate(`/history-report?id=${report.id}`);
  };

  const handleDeleteReport = async (reportId) => {
    const result = await _userReportService.deleteUserReport.call(void 0, reportId);
    if (result.success) {
      setReports((currentReports) => currentReports.filter((report) => report.id !== reportId));
      setDeleteConfirm(null);
    } else {
      setError(result.error);
    }
  };

  if (!initialized) {
    return (
      React.createElement('div', { className: "bg-kraft min-h-screen flex items-center justify-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
        , React.createElement(_framermotion.motion.div, {
          animate: { rotate: 360 },
          transition: { duration: 1, repeat: Infinity, ease: 'linear' },
          className: "w-10 h-10 border-3 border-navy/20 border-t-navy rounded-full"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}
        )
      )
    );
  }

  if (!user) {
    return null;
  }

  return (
    React.createElement('div', { className: "bg-kraft min-h-screen pb-10"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}
      , React.createElement('div', { className: "max-w-[1240px] mx-auto px-5 py-6 md:px-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}}
        , React.createElement(_Navbar2.default, { onOpenLogin: onOpenLogin, __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}} )

        , React.createElement(_framermotion.motion.div, {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "mt-6 rounded-3xl border border-white/50 bg-white/40 shadow-2xl backdrop-blur-xl overflow-hidden"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}

          , React.createElement('div', { className: "p-6 md:p-8" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
            , React.createElement('div', { className: "flex items-center gap-3 mb-6 pb-4 border-b border-navy/10"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}
              , React.createElement('button', {
                onClick: () => navigate(-1),
                className: "relative z-20 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-navy/10 transition-colors"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}

                , React.createElement(_lucidereact.ArrowLeft, { className: "w-5 h-5 text-navy"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 91}} )
              )
              , React.createElement(_lucidereact.History, { className: "w-5 h-5 text-navy"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}} )
              , React.createElement('h1', { className: "text-xl font-bold text-navy"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}, "历史报告")
              , React.createElement('span', { className: "text-sm text-muted" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 95}}, "共 " , reports.length, " 份" )
            )

            , loading && (
              React.createElement('div', { className: "text-center py-12" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}
                , React.createElement(_framermotion.motion.div, {
                  animate: { rotate: 360 },
                  transition: { duration: 1, repeat: Infinity, ease: 'linear' },
                  className: "w-10 h-10 border-3 border-navy/20 border-t-navy rounded-full mx-auto"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}
                )
                , React.createElement('p', { className: "text-muted mt-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}, "加载中...")
              )
            )

            , error && (
              React.createElement('div', { className: "flex items-center gap-2 text-red-500 bg-red-50 rounded-xl p-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}
                , React.createElement(_lucidereact.AlertCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}} )
                , error
              )
            )

            , !loading && reports.length === 0 && (
              React.createElement('div', { className: "text-center py-12" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}
                , React.createElement('div', { className: "w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}
                  , React.createElement(_lucidereact.History, { className: "w-8 h-8 text-navy/30"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}} )
                )
                , React.createElement('p', { className: "text-muted mb-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}, "还没有保存的报告")
                , React.createElement('button', { onClick: () => navigate('/test'), className: "btn-cta", __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}, "开始测试"

                )
              )
            )

            , !loading && reports.length > 0 && (
              React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}
                , reports.map((report, index) => {
                  const primaryResult = _optionalChain([report, 'access', _ => _.results, 'optionalAccess', _2 => _2[0]]);
                  const season = primaryResult ? _seasonColors.SEASONS[primaryResult.key] : null;
                  const createdDate = new Date(report.created_at);

                  return (
                    React.createElement(_framermotion.motion.div, {
                      key: report.id,
                      initial: { opacity: 0, y: 10 },
                      animate: { opacity: 1, y: 0 },
                      transition: { delay: index * 0.05 },
                      className: "group relative flex items-center gap-4 p-4 rounded-2xl bg-white/30 border border-white/40 hover:bg-white/50 transition-colors"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}

                      , React.createElement('div', {
                        className: "w-12 h-12 rounded-xl flex items-center justify-center text-white text-xs font-bold"        ,
                        style: { backgroundColor: _optionalChain([season, 'optionalAccess', _3 => _3.extremeColor]) || '#888' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}

                        , _optionalChain([season, 'optionalAccess', _4 => _4.nameCN, 'optionalAccess', _5 => _5.slice, 'call', _6 => _6(0, 1)]) || '?'
                      )

                      , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}}
                        , React.createElement('h3', { className: "font-semibold text-navy truncate"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 151}}, report.title || '未命名报告')
                        , React.createElement('p', { className: "text-sm text-muted" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 152}}
                          , createdDate.toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                          , ' '
                          , createdDate.toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })
                          , primaryResult && ` · 评分 ${_optionalChain([primaryResult, 'access', _7 => _7.score, 'optionalAccess', _8 => _8.toFixed, 'call', _9 => _9(1)])}`
                        )
                      )

                      , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 168}}
                        , React.createElement('button', {
                          onClick: () => handleViewReport(report),
                          className: "flex items-center gap-1 px-4 py-2 rounded-xl bg-navy/10 text-navy text-sm font-medium hover:bg-navy/20 transition-colors"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 169}}
, "查看"

                          , React.createElement(_lucidereact.ChevronRight, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}} )
                        )
                        , React.createElement('button', {
                          onClick: () => setDeleteConfirm(report.id),
                          className: "w-10 h-10 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 176}}

                          , React.createElement(_lucidereact.Trash2, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 180}} )
                        )
                      )

                      , deleteConfirm === report.id && (
                        React.createElement('div', { className: "absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-3 z-10"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}}
                          , React.createElement('span', { className: "text-sm text-muted" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}, "确定删除？")
                          , React.createElement('button', {
                            onClick: () => handleDeleteReport(report.id),
                            className: "px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}
, "删除"

                          )
                          , React.createElement('button', {
                            onClick: () => setDeleteConfirm(null),
                            className: "px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 193}}
, "取消"

                          )
                        )
                      )
                    )
                  );
                })
              )
            )
          )
        )

        , React.createElement('p', { className: "text-center mt-4 text-[10px] text-muted font-mono tracking-widest"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 209}}, "BEAUTY HUE" )
      )
    )
  );
} exports.default = HistoryPage;
