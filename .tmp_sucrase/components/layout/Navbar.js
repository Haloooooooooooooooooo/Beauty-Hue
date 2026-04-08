"use strict";const _jsxFileName = "src\\components\\layout\\Navbar.jsx";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _react = require('react');
var _reactrouterdom = require('react-router-dom');
var _AuthContext = require('../../context/AuthContext');

 function Navbar({ onOpenLogin }) {
  const navigate = _reactrouterdom.useNavigate.call(void 0, );
  const { user, logout } = _AuthContext.useAuth.call(void 0, );
  const [showDropdown, setShowDropdown] = _react.useState.call(void 0, false);
  const dropdownRef = _react.useRef.call(void 0, null);

  _react.useEffect.call(void 0, () => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initial = _optionalChain([user, 'optionalAccess', _ => _.email, 'optionalAccess', _2 => _2.charAt, 'call', _3 => _3(0), 'access', _4 => _4.toUpperCase, 'call', _5 => _5()]) || '';

  const handleLogout = async () => {
    await logout();
    setShowDropdown(false);
  };

  return (
    React.createElement('nav', { className: "relative z-10 flex w-full items-center justify-between px-10 py-8"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}}
      , React.createElement('div', {
        onClick: () => navigate('/'),
        className: "absolute left-3 -top-6 cursor-pointer transition-opacity hover:opacity-80"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 31}}

        , React.createElement('img', {
          src: "/branding/logo.png",
          alt: "Beauty Hue" ,
          className: "h-[132px] w-auto object-contain md:h-[176px]"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}}
        )
      )

      , React.createElement('div', { className: "ml-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}}
        , user ? (
          React.createElement('div', { className: "relative", ref: dropdownRef, __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}
            , React.createElement('button', {
              onClick: () => setShowDropdown(!showDropdown),
              className: "flex h-10 w-10 items-center justify-center rounded-full bg-[#DC2626] text-lg font-bold text-white shadow-md transition-transform hover:scale-105"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}

              , initial
            )

            , showDropdown && (
              React.createElement('div', { className: "absolute right-0 top-14 w-48 overflow-hidden rounded-xl border border-white/60 bg-white/95 shadow-xl backdrop-blur-xl"          , __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}
                , React.createElement('div', { className: "border-b border-navy/10 px-4 py-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}
                  , React.createElement('p', { className: "truncate text-xs text-muted"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 55}}, user.email)
                )
                , React.createElement('button', {
                  onClick: () => {
                    setShowDropdown(false);
                  },
                  className: "w-full px-4 py-2.5 text-left text-sm text-navy transition-colors hover:bg-kraft/30"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}
, "个人中心"

                )
                , React.createElement('button', {
                  onClick: () => {
                    setShowDropdown(false);
                    navigate('/history');
                  },
                  className: "w-full px-4 py-2.5 text-left text-sm text-navy transition-colors hover:bg-kraft/30"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}
, "历史报告"

                )
                , React.createElement('div', { className: "border-t border-navy/10" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}} )
                , React.createElement('button', {
                  onClick: handleLogout,
                  className: "w-full px-4 py-2.5 text-left text-sm text-red-500 transition-colors hover:bg-red-50"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}
, "退出登录"

                )
              )
            )
          )
        ) : (
          React.createElement('button', { onClick: onOpenLogin, className: "glass-btn px-8" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}, "登录"

          )
        )
      )
    )
  );
} exports.default = Navbar;