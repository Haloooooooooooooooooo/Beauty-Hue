"use strict";const _jsxFileName = "src\\components\\test\\PhotoUploader.jsx";Object.defineProperty(exports, "__esModule", {value: true}); function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _react = require('react');
var _lucidereact = require('lucide-react');

const PREVIEW_SIZE = 288;
const DEFAULT_SCALE = 1.1;

 function PhotoUploader({ onStart }) {
  const [image, setImage] = _react.useState.call(void 0, null);
  const [scale, setScale] = _react.useState.call(void 0, DEFAULT_SCALE);
  const [position, setPosition] = _react.useState.call(void 0, { x: 0, y: 0 });
  const [dragging, setDragging] = _react.useState.call(void 0, false);
  const [dragStart, setDragStart] = _react.useState.call(void 0, { x: 0, y: 0 });
  const [startPosition, setStartPosition] = _react.useState.call(void 0, { x: 0, y: 0 });
  const fileInputRef = _react.useRef.call(void 0, null);
  const imageRef = _react.useRef.call(void 0, null);

  _react.useEffect.call(void 0, () => {
    if (!image) return;
    setScale(DEFAULT_SCALE);
    setPosition({ x: 0, y: 0 });
  }, [image]);

  const handleFileChange = (event) => {
    const file = _optionalChain([event, 'access', _ => _.target, 'access', _2 => _2.files, 'optionalAccess', _3 => _3[0]]);
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setImage(_optionalChain([loadEvent, 'access', _4 => _4.target, 'optionalAccess', _5 => _5.result]) || null);
    };
    reader.readAsDataURL(file);
  };

  const handlePointerDown = (event) => {
    if (!image) return;
    event.preventDefault();
    setDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
    setStartPosition(position);
  };

  const handlePointerMove = (event) => {
    if (!dragging) return;

    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;
    setPosition({
      x: startPosition.x + deltaX,
      y: startPosition.y + deltaY,
    });
  };

  const stopDragging = () => {
    setDragging(false);
  };

  const handleChooseAgain = () => {
    setImage(null);
    setScale(DEFAULT_SCALE);
    setPosition({ x: 0, y: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirm = () => {
    if (!imageRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = PREVIEW_SIZE;
    canvas.height = PREVIEW_SIZE;

    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    const baseWidth = PREVIEW_SIZE;
    const baseHeight = (img.naturalHeight / img.naturalWidth) * PREVIEW_SIZE;
    const drawWidth = baseWidth * scale;
    const drawHeight = baseHeight * scale;
    const drawX = (PREVIEW_SIZE - drawWidth) / 2 + position.x;
    const drawY = (PREVIEW_SIZE - drawHeight) / 2 + position.y;

    ctx.clearRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
    ctx.beginPath();
    ctx.arc(PREVIEW_SIZE / 2, PREVIEW_SIZE / 2, PREVIEW_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

    onStart(canvas.toDataURL('image/png'));
  };

  return (
    React.createElement('div', { className: "flex flex-col items-center justify-center h-full w-full"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}
      , !image ? (
        React.createElement('div', {
          onClick: () => _optionalChain([fileInputRef, 'access', _6 => _6.current, 'optionalAccess', _7 => _7.click, 'call', _8 => _8()]),
          className: "flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-navy/20 rounded-full cursor-pointer hover:border-navy/40 transition-colors bg-white/10 backdrop-blur-md"              , __self: this, __source: {fileName: _jsxFileName, lineNumber: 95}}

          , React.createElement(_lucidereact.Upload, { className: "w-10 h-10 text-navy mb-4 opacity-50"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}} )
          , React.createElement('span', { className: "text-text font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}, "点击上传照片")
          , React.createElement('span', { className: "text-muted text-sm mt-2 text-center px-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}, "建议使用自然光"

            , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 103}} ), "素颜正脸照片"

          )
          , React.createElement('input', {
            type: "file",
            ref: fileInputRef,
            onChange: handleFileChange,
            accept: "image/*",
            className: "hidden", __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}}
          )
        )
      ) : (
        React.createElement('div', { className: "flex flex-col items-center w-full max-w-[440px]"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}
          , React.createElement('div', {
            className: "relative w-72 h-72 rounded-full overflow-hidden mb-6 shadow-photo border-4 border-white/50 bg-white/20 touch-none select-none"           ,
            onPointerDown: handlePointerDown,
            onPointerMove: handlePointerMove,
            onPointerUp: stopDragging,
            onPointerLeave: stopDragging, __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}

            , React.createElement('img', {
              ref: imageRef,
              src: image,
              alt: "用户上传照片",
              draggable: "false",
              className: "absolute top-1/2 left-1/2 max-w-none pointer-events-none"    ,
              style: {
                width: `${PREVIEW_SIZE * scale}px`,
                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
              }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}
            )
            , React.createElement('div', { className: "absolute inset-0 rounded-full ring-1 ring-white/60 pointer-events-none"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 134}} )
          )

          , React.createElement('div', { className: "w-full rounded-[24px] border border-white/40 bg-white/35 backdrop-blur-md px-5 py-4 mb-6"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}
            , React.createElement('div', { className: "flex items-center gap-2 text-sm text-navy/80 font-medium mb-3"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}
              , React.createElement(_lucidereact.Move, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}} )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 140}}, "拖动调整照片位置")
            )
            , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}
              , React.createElement(_lucidereact.Search, { className: "w-4 h-4 text-navy/60"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}} )
              , React.createElement('input', {
                type: "range",
                min: "1",
                max: "2.4",
                step: "0.01",
                value: scale,
                onChange: (event) => setScale(Number(event.target.value)),
                className: "w-full accent-[#162660]" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}
              )
            )
            , React.createElement('p', { className: "mt-3 text-xs text-muted"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}, "调整好大小和位置后，再确认开始测试。")
          )

          , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 157}}
            , React.createElement('button', {
              type: "button",
              onClick: handleChooseAgain,
              className: "glass-btn px-5 py-3 rounded-[18px] font-medium"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 158}}
, "重新选择照片"

            )
            , React.createElement('button', {
              type: "button",
              onClick: handleConfirm,
              className: "btn-cta bg-navy hover:bg-navy/90 text-white px-10 py-4 rounded-[20px] shadow-lg shadow-navy/20 transition-all font-medium text-lg"           , __self: this, __source: {fileName: _jsxFileName, lineNumber: 165}}
, "确认并开始测试"

            )
          )
        )
      )
    )
  );
} exports.default = PhotoUploader;
