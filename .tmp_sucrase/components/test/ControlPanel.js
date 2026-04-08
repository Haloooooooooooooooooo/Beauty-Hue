"use strict";const _jsxFileName = "src\\components\\test\\ControlPanel.jsx";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _lucidereact = require('lucide-react');

 function ControlPanel({
  currentColor,
  onScore,
  onScreenshot,
  canSubmit,
  onSubmit,
  userScore,
  onReselectPhoto,
}) {
  return (
    React.createElement('div', { className: "flex flex-col gap-4 items-center h-full justify-center w-full max-w-[200px]"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}}
      , React.createElement('div', { className: "mb-6 w-full group relative"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}
        , React.createElement('button', {
          onClick: canSubmit ? () => onSubmit() : undefined,
          type: "button",
          className: `w-full py-4 rounded-button font-medium transition-all duration-300
            ${
              canSubmit
                ? 'bg-navy text-white shadow-lg hover:-translate-y-1'
                : 'bg-white/30 text-text/40 cursor-not-allowed border border-black/5'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 15}}
, "提交分析"

        )
        , !canSubmit && (
          React.createElement('div', { className: "absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max px-3 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}}, "再测试几轮，结果会更准确"

          )
        )
      )

      , React.createElement('div', { className: "w-[40px] h-[1px] bg-black/10 my-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}} )

      , React.createElement('div', { className: "flex flex-col items-center mb-10"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 36}}
        , React.createElement('div', {
          className: "w-14 h-14 rounded-full mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.1)] border-2 border-white"      ,
          style: { backgroundColor: _optionalChain([currentColor, 'optionalAccess', _ => _.color]) || '#000' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 37}}
        )
        , React.createElement('span', { className: "text-2xl font-bold text-navy tracking-wide"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 41}}, _optionalChain([currentColor, 'optionalAccess', _2 => _2.colorName]) || '...')
        , React.createElement('span', { className: "text-sm text-navy/60 font-mono mt-1 font-medium tracking-widest"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}}
          , _optionalChain([currentColor, 'optionalAccess', _3 => _3.color]) || '#...'
        )
      )

      , React.createElement('div', { className: "flex flex-col gap-3 w-full"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}}
        , React.createElement('button', {
          onClick: () => onScore(1),
          className: `glass-btn flex items-center justify-center gap-2 group transition-all
            ${
              userScore === 1
                ? 'bg-[#FDF3E7] border-[#F8C291] shadow-inner scale-95'
                : 'hover:bg-[#FDF3E7] hover:border-[#F8C291]/50'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}}

          , React.createElement(_lucidereact.CheckCircle, {
            className: `w-5 h-5 ${
              userScore === 1 ? 'text-[#CB6D38]' : 'text-text group-hover:text-[#CB6D38]'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}
          )
          , React.createElement('span', { className: userScore === 1 ? 'text-[#CB6D38] font-semibold' : '', __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}, "适合")
        )

        , React.createElement('button', {
          onClick: () => onScore(0),
          className: `glass-btn flex items-center justify-center gap-2 transition-all
            ${userScore === 0 ? 'bg-white/60 border-navy/20 shadow-inner scale-95' : ''}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}

          , React.createElement(_lucidereact.Circle, { className: `w-5 h-5 ${userScore === 0 ? 'text-navy' : 'text-text'}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}} )
          , React.createElement('span', { className: userScore === 0 ? 'text-navy font-semibold' : '', __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}, "一般")
        )

        , React.createElement('button', {
          onClick: () => onScore(-1),
          className: `glass-btn flex items-center justify-center gap-2 group transition-all
            ${
              userScore === -1
                ? 'bg-[#F0F4F8] border-[#A3B1C6] shadow-inner scale-95'
                : 'hover:bg-[#F0F4F8] hover:border-[#A3B1C6]/50'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}

          , React.createElement(_lucidereact.XCircle, {
            className: `w-5 h-5 ${
              userScore === -1 ? 'text-[#6B83A6]' : 'text-text group-hover:text-[#6B83A6]'
            }`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}
          )
          , React.createElement('span', { className: userScore === -1 ? 'text-[#6B83A6] font-semibold' : '', __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}, "不适合")
        )
      )

      , React.createElement('div', { className: "w-[40px] h-[1px] bg-black/10 my-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}} )

      , React.createElement('button', { onClick: onScreenshot, className: "glass-btn flex items-center justify-center gap-2 w-full"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}
        , React.createElement(_lucidereact.Camera, { className: "w-5 h-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 95}} )
        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}, "截图")
      )

      , React.createElement('button', { onClick: onReselectPhoto, className: "glass-btn flex items-center justify-center gap-2 w-full"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}
        , React.createElement(_lucidereact.RefreshCcw, { className: "w-5 h-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}} )
        , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}, "重新选择照片")
      )
    )
  );
} exports.default = ControlPanel;
