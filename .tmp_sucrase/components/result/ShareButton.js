"use strict";const _jsxFileName = "src\\components\\result\\ShareButton.jsx";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
 * 分享按钮组件
 * 点击后复制分享链接到剪贴板
 * 统一将报告上传到数据库，生成短链接
 */

var _react = require('react');
var _lucidereact = require('lucide-react');
var _framermotion = require('framer-motion');
var _shareEncoder = require('../../utils/shareEncoder');
var _shareReportService = require('../../utils/shareReportService');
var _AuthContext = require('../../context/AuthContext');

 function ShareButton({ results, systemHistory }) {
  const { user } = _react.useContext.call(void 0, _AuthContext.AuthContext);
  const [isLoading, setIsLoading] = _react.useState.call(void 0, false);
  const [copied, setCopied] = _react.useState.call(void 0, false);
  const [error, setError] = _react.useState.call(void 0, null);

  const handleShare = async () => {
    if (!results || !_optionalChain([systemHistory, 'optionalAccess', _ => _.length])) {
      setError('数据不完整，无法分享');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const uploadResult = await _shareReportService.uploadShareReport.call(void 0, {
        results,
        history: systemHistory,
        userId: _optionalChain([user, 'optionalAccess', _2 => _2.email]) || null,
      });

      if (!uploadResult.success) {
        setError(uploadResult.error);
        return;
      }

      const shareUrl = _shareEncoder.generateUserShareUrl.call(void 0, uploadResult.shareCode);

      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      if (_shareEncoder.isUsingLocalShareOrigin.call(void 0, )) {
        setError('当前复制的是 localhost 链接，仅你本机可打开。部署后请配置 VITE_PUBLIC_APP_URL。');
      }

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('分享失败:', err);
      setError('复制失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}
      , React.createElement('button', {
        onClick: handleShare,
        disabled: isLoading,
        className: "glass-btn flex-1 flex items-center justify-center gap-2 text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}

        , isLoading ? (
          React.createElement(_lucidereact.Loader2, { className: "w-4 h-4 animate-spin"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}} )
        ) : copied ? (
          React.createElement(_lucidereact.Check, { className: "w-4 h-4 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}} )
        ) : (
          React.createElement(_lucidereact.Link, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}} )
        )
        , isLoading ? '生成链接...' : copied ? '已复制' : '分享链接'
      )

      , React.createElement(_framermotion.AnimatePresence, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 78}}
        , error && (
          React.createElement(_framermotion.motion.div, {
            initial: { opacity: 0, y: -8 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            className: "absolute -top-10 left-1/2 -translate-x-1/2 bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-full border border-red-200 whitespace-nowrap"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}

            , error
          )
        )
      )

      , React.createElement(_framermotion.AnimatePresence, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}
        , copied && !error && (
          React.createElement(_framermotion.motion.div, {
            initial: { opacity: 0, y: -8 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            className: "absolute -top-10 left-1/2 -translate-x-1/2 bg-green-50 text-green-600 text-xs px-3 py-1.5 rounded-full border border-green-200 whitespace-nowrap"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}
, "链接已复制到剪贴板"

          )
        )
      )
    )
  );
} exports.default = ShareButton;
