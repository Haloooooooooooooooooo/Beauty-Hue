"use strict";const _jsxFileName = "src\\components\\landing\\HeroSection.jsx";Object.defineProperty(exports, "__esModule", {value: true});var _reactrouterdom = require('react-router-dom');
var _framermotion = require('framer-motion');

 function HeroSection() {
  const navigate = _reactrouterdom.useNavigate.call(void 0, );

  return (
    React.createElement('div', { className: "flex flex-col justify-center h-full max-w-lg pl-10 pr-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8}}
      , React.createElement(_framermotion.motion.div, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8, ease: "easeOut" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9}}

        , React.createElement('h1', { className: "text-navy text-[64px] font-bold leading-[1.1] tracking-tight mb-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}, "Discover Your"
           , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 15}} ), "Perfect Colors"
        )
        , React.createElement('h2', { className: "text-text text-2xl mb-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}, "找到真正适合你的色彩"

        )
        , React.createElement('p', { className: "text-muted text-lg mb-12 max-w-md leading-relaxed"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}, "A professional color analysis experience based on seasonal color theory."

        )

        , React.createElement('button', { 
          onClick: () => navigate('/test'),
          className: "btn-cta", __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}
, "Start Your Test"

        )
      )
    )
  );
} exports.default = HeroSection;
