"use strict";const _jsxFileName = "src\\components\\landing\\SeasonCard.jsx";Object.defineProperty(exports, "__esModule", {value: true});var _framermotion = require('framer-motion');

 function SeasonCard({ season }) {
  const baseColor = season.extremeColor || '#ffffff';
  const accentColor = season.dailyColor || season.extremeColor || '#ffffff';
  
  const gradientBackground = {
    background: `linear-gradient(135deg, ${baseColor}cc, ${accentColor}99, ${baseColor}66)`
  };


  return (
    React.createElement('div', { className: "glass-card w-[340px] h-[420px] flex-shrink-0 flex flex-col p-6 mx-4 relative group"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}}
      , React.createElement('div', { className: "z-10 mt-auto" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}
        , React.createElement('h3', { className: "text-2xl font-bold text-navy mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 15}}, season.name)
        , React.createElement('p', { className: "text-muted text-lg" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}, season.nameCN)
      )

      /* Abstract visual area - mimicking an elegant fluid shape or gradient blur */
      , React.createElement('div', { className: "absolute inset-0 top-0 left-0 w-full h-[60%] opacity-80 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-t-[24px]"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}
        , React.createElement('div', { 
          className: "absolute inset-0 blur-[40px] scale-150 transform translate-y-[-20%] group-hover:translate-y-[-10%] transition-transform duration-700 ease-out"         , 
          style: gradientBackground, __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}} 
        )
      )
    )
  );
} exports.default = SeasonCard;
