"use strict";const _jsxFileName = "src\\components\\landing\\CardCarousel.jsx";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _react = require('react');
var _framermotion = require('framer-motion');
var _SeasonCard = require('./SeasonCard'); var _SeasonCard2 = _interopRequireDefault(_SeasonCard);
var _seasonColors = require('../../data/seasonColors');

 function CardCarousel() {
  const carouselRef = _react.useRef.call(void 0, null);
  const [dragConstraints, setDragConstraints] = _react.useState.call(void 0, { right: 0, left: 0 });
  
  const seasonsList = _seasonColors.SEASON_KEYS.map(key => _seasonColors.SEASONS[key]);

  _react.useEffect.call(void 0, () => {
    if (carouselRef.current) {
      // Calculate how far left we can drag avoiding white space on right edge.
      // 12 cards * (340px width + 32px margin) approx.
      const scrollWidth = carouselRef.current.scrollWidth;
      const viewportWidth = carouselRef.current.offsetWidth;
      setDragConstraints({ right: 0, left: - (scrollWidth - viewportWidth + 32) });
    }
  }, []);

  return (
    React.createElement('div', { className: "relative w-full h-[600px] flex items-center overflow-hidden carousel-mask pl-8"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}}
      , React.createElement(_framermotion.motion.div, { 
        ref: carouselRef,
        className: "flex cursor-grab active:cursor-grabbing"  ,
        drag: "x",
        dragConstraints: dragConstraints,
        dragElastic: 0.1,
        dragTransition: { bounceStiffness: 100, bounceDamping: 20 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}

        , seasonsList.map((season, index) => (
          React.createElement(_SeasonCard2.default, { key: index, season: season, __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}} )
        ))
      )
    )
  );
} exports.default = CardCarousel;
