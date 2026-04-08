"use strict";const _jsxFileName = "src\\components\\result\\SaveReportButton.jsx";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }/**
 * 保存报告按钮组件
 * 点击生成卡片图片并下载到本地
 */

var _react = require('react');
var _lucidereact = require('lucide-react');
var _framermotion = require('framer-motion');
var _shareCardGenerator = require('../../utils/shareCardGenerator');

 function SaveReportButton({ results, image, systemHistory }) {
  const [isLoading, setIsLoading] = _react.useState.call(void 0, false);
  const [saved, setSaved] = _react.useState.call(void 0, false);
  const [error, setError] = _react.useState.call(void 0, null);

  const handleSave = async () => {
    if (!results || !_optionalChain([systemHistory, 'optionalAccess', _ => _.length])) {
      setError('数据不完整，无法生成报告');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 生成卡片图片
      const blob = await _shareCardGenerator.generateShareCard.call(void 0, results, image, systemHistory);

      // 下载到本地
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `beauty-hue-report-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (err) {
      console.error('保存失败:', err);
      setError('生成报告失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}
      , React.createElement('button', {
        onClick: handleSave,
        disabled: isLoading,
        className: "glass-btn flex-1 flex items-center justify-center gap-2 text-sm py-3 disabled:opacity-50 disabled:cursor-not-allowed"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}

        , isLoading ? (
          React.createElement(_lucidereact.Loader2, { className: "w-4 h-4 animate-spin"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}} )
        ) : saved ? (
          React.createElement(_lucidereact.Check, { className: "w-4 h-4 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}} )
        ) : (
          React.createElement(_lucidereact.Download, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}} )
        )
        , isLoading ? '生成中...' : saved ? '已保存' : '保存报告'
      )

      , React.createElement(_framermotion.AnimatePresence, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}
        , error && (
          React.createElement(_framermotion.motion.div, {
            initial: { opacity: 0, y: -8 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0 },
            className: "absolute -top-10 left-1/2 -translate-x-1/2 bg-red-50 text-red-600 text-xs px-3 py-1.5 rounded-full border border-red-200 whitespace-nowrap"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}

            , error
          )
        )
      )
    )
  );
} exports.default = SaveReportButton;