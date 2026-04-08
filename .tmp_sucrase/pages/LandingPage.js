"use strict";const _jsxFileName = "src\\pages\\LandingPage.jsx";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Navbar = require('../components/layout/Navbar'); var _Navbar2 = _interopRequireDefault(_Navbar);
var _HeroSection = require('../components/landing/HeroSection'); var _HeroSection2 = _interopRequireDefault(_HeroSection);
var _CardCarousel = require('../components/landing/CardCarousel'); var _CardCarousel2 = _interopRequireDefault(_CardCarousel);

 function LandingPage({ onOpenLogin }) {
  return (
    React.createElement('div', { className: "bg-kraft min-h-screen flex flex-col items-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 7}}
      , React.createElement('div', { className: "w-full max-w-[1600px] h-screen flex flex-col relative overflow-hidden"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 8}}
        , React.createElement(_Navbar2.default, { onOpenLogin: onOpenLogin, __self: this, __source: {fileName: _jsxFileName, lineNumber: 9}} )

        , React.createElement('div', { className: "flex-1 flex flex-row items-center w-full"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11}}
          /* Left part: text area */
          , React.createElement('div', { className: "w-5/12 h-full flex items-center pr-8 pl-[4vw]"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}}
            , React.createElement(_HeroSection2.default, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 14}} )
          )

          /* Right part: sliding carousel */
          , React.createElement('div', { className: "w-7/12 h-full flex items-center"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}}
            , React.createElement(_CardCarousel2.default, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 19}} )
          )
        )
      )
    )
  );
} exports.default = LandingPage;
