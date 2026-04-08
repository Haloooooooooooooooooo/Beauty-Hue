"use strict";const _jsxFileName = "src\\components\\test\\PhotoFrame.jsx";Object.defineProperty(exports, "__esModule", {value: true});var _framermotion = require('framer-motion');

 function PhotoFrame({ image, currentColorHex, frameRef }) {
  return (
    React.createElement('div', { 
      ref: frameRef,
      className: "photo-frame w-full max-w-[900px] h-[76vh] mx-auto flex flex-col overflow-hidden"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 5}}

      , React.createElement('div', { className: "px-10 py-8 flex justify-between items-center bg-[#FAF6F0]"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9}}
        , React.createElement('h2', { className: "text-3xl font-black text-navy tracking-widest uppercase opacity-90"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 10}}, "Color For You"  )
        , React.createElement('span', { className: "text-navy/40 tracking-[0.4em] text-xs font-bold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11}}, "ORIGINAL")
      )

      , React.createElement('div', { className: "flex-1 w-full bg-[#FAF6F0] px-6 pb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}
        , React.createElement('div', {
          className: "relative h-full w-full overflow-hidden rounded-[28px] color-transition flex items-center justify-center"        ,
          style: { backgroundColor: currentColorHex || '#fafafa' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 15}}

          , image ? (
            React.createElement(_framermotion.motion.div, {
              initial: { scale: 0.9, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              transition: { duration: 0.8, ease: "easeOut" },
              className: "w-48 h-48 md:w-[280px] md:h-[280px] rounded-full overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.35)] relative border-[10px] border-white/60 z-20"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}

              , React.createElement('img', { src: image, alt: "Target subject" , className: "w-full h-full object-cover scale-[1.1]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}} )
            )
          ) : (
            React.createElement('div', { className: "text-black/5 text-2xl font-light tracking-[1em] uppercase"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}}, "Loading...")
          )

          , React.createElement('div', { className: "absolute right-5 bottom-7 z-30"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 32}}
            , React.createElement('span', { className: "text-[10px] text-white/30 uppercase tracking-[0.5em] font-bold transform -rotate-180"      , style: { writingMode: 'vertical-rl' }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}}, "PHOTOGRAPHY BY BEAUTY HUE"

            )
          )
        )
      )
    )
  );
} exports.default = PhotoFrame;
