"use strict";const _jsxFileName = "src\\components\\result\\TestColorChips.jsx";Object.defineProperty(exports, "__esModule", {value: true});var _react = require('react');
var _framermotion = require('framer-motion');

function getUserScoreLabel(score) {
  if (score >= 10) return '适合';
  if (score >= 5) return '一般';
  return '不适合';
}

function getScoreColor(score) {
  if (score >= 10) return 'text-green-600';
  if (score >= 5) return 'text-gray-500';
  return 'text-orange-500';
}

function getScoreBorder(score) {
  if (score >= 10) return 'border-green-400';
  if (score >= 5) return 'border-gray-300';
  return 'border-orange-400';
}

 function TestColorChips({
  rounds,
  selectedRound,
  onSelect,
  showHint,
}) {
  const containerRef = _react.useRef.call(void 0, null);
  const chipRefs = _react.useRef.call(void 0, {});

  _react.useEffect.call(void 0, () => {
    if (selectedRound === null || !chipRefs.current[selectedRound] || !containerRef.current) return;

    const container = containerRef.current;
    const chip = chipRefs.current[selectedRound];
    const containerRect = container.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    const scrollLeft = container.scrollLeft;
    const chipLeft = chipRect.left - containerRect.left + scrollLeft;
    const chipWidth = chipRect.width;
    const containerWidth = containerRect.width;
    const targetScroll = chipLeft - containerWidth / 2 + chipWidth / 2;

    container.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: 'smooth',
    });
  }, [selectedRound]);

  return (
    React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}
      , React.createElement(_framermotion.AnimatePresence, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}
        , showHint && (
          React.createElement(_framermotion.motion.div, {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: [8, -4, 8] },
            exit: { opacity: 0, y: -8 },
            transition: {
              opacity: { duration: 0.3 },
              y: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
            },
            className: "pointer-events-none absolute -top-10 left-2 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-navy shadow-lg backdrop-blur-xl border border-white/50 z-10"               , __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}
, "点击色卡查看详细分析"

          )
        )
      )

      , React.createElement('div', {
        ref: containerRef,
        className: "overflow-x-auto overflow-y-hidden pb-2 pt-2 -mx-2 px-2"     ,
        style: { scrollBehavior: 'smooth' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}

        , React.createElement('div', { className: "flex gap-3" , style: { width: 'max-content' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}
          , rounds.map((round, index) => {
            const selected = selectedRound === index;
            const scoreLabel = getUserScoreLabel(round.userScore);
            const scoreColorClass = getScoreColor(round.userScore);
            const borderClass = getScoreBorder(round.userScore);

            return (
              React.createElement(_framermotion.motion.button, {
                key: `chip-${index}`,
                ref: (node) => {
                  chipRefs.current[index] = node;
                },
                type: "button",
                whileTap: { scale: 0.96 },
                transition: { duration: 0.25, ease: 'easeOut' },
                onClick: () => onSelect(index),
                className: `relative shrink-0 overflow-hidden rounded-2xl border-2 ${
                  selected ? `${borderClass} shadow-lg` : 'border-transparent'
                }`,
                style: {
                  width: selected ? 90 : 48,
                  height: selected ? 120 : 62,
                  background: 'rgba(255,255,255,0.85)',
                  backdropFilter: 'blur(12px)',
                }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}

                , React.createElement('div', {
                  className: "w-full rounded-t-2xl shrink-0"  ,
                  style: {
                    backgroundColor: round.color,
                    height: selected ? 50 : 32,
                  }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
                )

                , React.createElement('div', { className: "p-1.5 text-center" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}}
                  , React.createElement('span', { className: "text-[10px] text-muted font-mono"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}, "#", index + 1)

                  , selected && (
                    React.createElement(_framermotion.motion.div, {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      transition: { duration: 0.2 },
                      className: "mt-0.5", __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}

                      , React.createElement('p', { className: "text-xs font-semibold text-navy truncate px-0.5"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}, round.colorName)
                      , React.createElement('p', { className: "text-[10px] text-muted truncate px-0.5"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 120}}, round.seasonNameCN, "季型")
                      , React.createElement('p', { className: `text-[10px] font-medium mt-0.5 ${scoreColorClass}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}, scoreLabel)
                    )
                  )
                )
              )
            );
          })
        )
      )
    )
  );
} exports.default = TestColorChips;
