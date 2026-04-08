"use strict";const _jsxFileName = "src\\main.jsx"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _react = require('react'); var _react2 = _interopRequireDefault(_react);
var _client = require('react-dom/client'); var _client2 = _interopRequireDefault(_client);
var _App = require('./App'); var _App2 = _interopRequireDefault(_App);
require('./styles/index.css');

console.log('Mounting React application...');
try {
  _client2.default.createRoot(document.getElementById('root')).render(
    _react2.default.createElement(_react2.default.StrictMode, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 9}}
      , _react2.default.createElement(_App2.default, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 10}} )
    )
  );
  console.log('React mount initiated.');
} catch (error) {
  console.error('Mounting error:', error);
}

