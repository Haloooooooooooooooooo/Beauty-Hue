"use strict";const _jsxFileName = "src\\App.jsx";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _react = require('react');
var _reactrouterdom = require('react-router-dom');
var _AuthContext = require('./context/AuthContext');
var _LoginPanel = require('./components/auth/LoginPanel'); var _LoginPanel2 = _interopRequireDefault(_LoginPanel);
var _LandingPage = require('./pages/LandingPage'); var _LandingPage2 = _interopRequireDefault(_LandingPage);
var _TestPage = require('./pages/TestPage'); var _TestPage2 = _interopRequireDefault(_TestPage);
var _ResultPage = require('./pages/ResultPage'); var _ResultPage2 = _interopRequireDefault(_ResultPage);
var _SharePage = require('./pages/SharePage'); var _SharePage2 = _interopRequireDefault(_SharePage);
var _HistoryPage = require('./pages/HistoryPage'); var _HistoryPage2 = _interopRequireDefault(_HistoryPage);
var _HistoryReportPage = require('./pages/HistoryReportPage'); var _HistoryReportPage2 = _interopRequireDefault(_HistoryReportPage);

 function App() {
  const [isLoginOpen, setIsLoginOpen] = _react.useState.call(void 0, false);

  return (
    React.createElement(_AuthContext.AuthProvider, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}
      , React.createElement(_reactrouterdom.BrowserRouter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}
        , React.createElement(_LoginPanel2.default, { isOpen: isLoginOpen, onClose: () => setIsLoginOpen(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}} )
        , React.createElement(_reactrouterdom.Routes, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 19}}
          , React.createElement(_reactrouterdom.Route, { path: "/", element: React.createElement(_LandingPage2.default, { onOpenLogin: () => setIsLoginOpen(true), __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}} )
          , React.createElement(_reactrouterdom.Route, { path: "/test", element: React.createElement(_TestPage2.default, { onOpenLogin: () => setIsLoginOpen(true), __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}} )
          , React.createElement(_reactrouterdom.Route, { path: "/result", element: React.createElement(_ResultPage2.default, { onOpenLogin: () => setIsLoginOpen(true), __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}} )
          , React.createElement(_reactrouterdom.Route, { path: "/share", element: React.createElement(_SharePage2.default, { onOpenLogin: () => setIsLoginOpen(true), __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}} )
          , React.createElement(_reactrouterdom.Route, { path: "/r/:shareId", element: React.createElement(_SharePage2.default, { onOpenLogin: () => setIsLoginOpen(true), __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}} )
          , React.createElement(_reactrouterdom.Route, { path: "/history", element: React.createElement(_HistoryPage2.default, { onOpenLogin: () => setIsLoginOpen(true), __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}} )
          , React.createElement(_reactrouterdom.Route, { path: "/history-report", element: React.createElement(_HistoryReportPage2.default, { onOpenLogin: () => setIsLoginOpen(true), __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}} ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}} )
        )
      )
    )
  );
} exports.default = App;