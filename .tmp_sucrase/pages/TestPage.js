"use strict";const _jsxFileName = "src\\pages\\TestPage.jsx";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _react = require('react');
var _reactrouterdom = require('react-router-dom');
var _lucidereact = require('lucide-react');
var _framermotion = require('framer-motion');
var _Navbar = require('../components/layout/Navbar'); var _Navbar2 = _interopRequireDefault(_Navbar);
var _PhotoUploader = require('../components/test/PhotoUploader'); var _PhotoUploader2 = _interopRequireDefault(_PhotoUploader);
var _PhotoFrame = require('../components/test/PhotoFrame'); var _PhotoFrame2 = _interopRequireDefault(_PhotoFrame);
var _ControlPanel = require('../components/test/ControlPanel'); var _ControlPanel2 = _interopRequireDefault(_ControlPanel);
var _testSequence = require('../data/testSequence');
var _colorAnalyzer = require('../engine/colorAnalyzer');
var _frameSnapshot = require('../engine/frameSnapshot');

const PHASE1_USER_WEIGHT = 0.55;
const PHASE1_AI_WEIGHT = 0.45;

function buildPhase1CompositeScores(history) {
  return history.reduce((acc, entry) => {
    if (entry.phase !== 1) return acc;

    const normalizedUserScore = entry.userScore || 0;
    const normalizedAiScore = entry.systemScore || 0;
    acc[entry.seasonKey] = normalizedUserScore * PHASE1_USER_WEIGHT + normalizedAiScore * PHASE1_AI_WEIGHT;
    return acc;
  }, {});
}

 function TestPage({ onOpenLogin }) {
  const navigate = _reactrouterdom.useNavigate.call(void 0, );
  const frameRef = _react.useRef.call(void 0, null);

  const [hasStarted, setHasStarted] = _react.useState.call(void 0, false);
  const [image, setImage] = _react.useState.call(void 0, null);
  const [round, setRound] = _react.useState.call(void 0, 0);
  const [phase, setPhase] = _react.useState.call(void 0, 1);
  const [sequence, setSequence] = _react.useState.call(void 0, _testSequence.PHASE1_SEQUENCE);
  const [scores, setScores] = _react.useState.call(void 0, {});
  const [systemHistory, setSystemHistory] = _react.useState.call(void 0, []);
  const [roundScores, setRoundScores] = _react.useState.call(void 0, {});
  const [screenshots, setScreenshots] = _react.useState.call(void 0, []);
  const [flash, setFlash] = _react.useState.call(void 0, false);
  const [showToast, setShowToast] = _react.useState.call(void 0, false);

  const currentColor = sequence[round];
  const currentRoundKey = phase === 1 ? round : round + 12;
  const canSubmit = (phase === 1 && round >= _testSequence.MIN_ROUNDS - 1) || phase === 2;

  const handleStart = (base64Img) => {
    // 清除之前的测试数据和保存标志
    localStorage.removeItem('beautyHue_currentReportSaved');
    localStorage.removeItem('beautyHue_scores');
    localStorage.removeItem('beautyHue_systemHistory');
    localStorage.removeItem('beautyHue_screenshots');

    setImage(base64Img);
    setHasStarted(true);
  };

  const handleReselectPhoto = () => {
    setHasStarted(false);
    setImage(null);
    setRound(0);
    setPhase(1);
    setSequence(_testSequence.PHASE1_SEQUENCE);
    setScores({});
    setSystemHistory([]);
    setRoundScores({});
    setScreenshots([]);
  };

  const handleScore = async (val) => {
    const analysis = await _colorAnalyzer.analyzeImageMetrics.call(void 0, image, currentColor.color);
    const userScore = (val + 1) * 5;

    // 截断当前轮次之后的历史记录，防止回退重评时重复
    const truncatedHistory = systemHistory.slice(0, currentRoundKey);
    const newEntry = {
      seasonKey: currentColor.seasonKey,
      systemScore: analysis.total,
      dimensions: {
        skinLift: analysis.skinLift,
        warmth: analysis.warmth,
        clarity: analysis.clarity,
        harmony: analysis.harmony,
        vibe: analysis.vibe,
      },
      phase,
      color: currentColor.color,
      colorName: currentColor.colorName,
      userScore,
    };

    const nextSystemHistory = [...truncatedHistory, newEntry];
    setSystemHistory(nextSystemHistory);

    // 从截断后的历史重新计算 scores
    const newScores = {};
    truncatedHistory.forEach((entry) => {
      newScores[entry.seasonKey] = (newScores[entry.seasonKey] || 0) + entry.userScore;
    });
    newScores[currentColor.seasonKey] = (newScores[currentColor.seasonKey] || 0) + userScore;
    setScores(newScores);

    // 截断并替换 roundScores
    const truncatedRoundScores = {};
    Object.entries(roundScores).forEach(([key, score]) => {
      if (parseInt(key) < currentRoundKey) {
        truncatedRoundScores[key] = score;
      }
    });
    setRoundScores({ ...truncatedRoundScores, [currentRoundKey]: val });

    setTimeout(() => {
      if (round < sequence.length - 1) {
        setRound((value) => value + 1);
      } else if (phase === 1) {
        const phase1CompositeScores = buildPhase1CompositeScores(nextSystemHistory);
        const nextSequence = _testSequence.generatePhase2.call(void 0, phase1CompositeScores);
        setSequence(nextSequence);
        setPhase(2);
        setRound(0);
      } else {
        handleSubmit(newScores, nextSystemHistory);
      }
    }, 400);
  };

  const handlePrevious = () => {
    if (round > 0) {
      setRound((value) => value - 1);
    }
  };

  const handleScreenshot = async () => {
    if (!image || !currentColor) return;

    try {
      const snapshot = await _frameSnapshot.createFrameSnapshot.call(void 0, {
        imageSrc: image,
        colorHex: currentColor.color,
      });

      setScreenshots((prev) => [
        ...prev,
        {
          id: `${Date.now()}-${currentRoundKey}`,
          image: snapshot,
          color: currentColor.color,
          colorName: currentColor.colorName,
          phase,
          roundNumber: currentRoundKey + 1,
        },
      ]);

      setFlash(true);
      setTimeout(() => {
        setFlash(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }, 200);
    } catch (error) {
      console.error('Failed to create frame snapshot', error);
    }
  };

  const handleSubmit = (scoresToSave = scores, historyToSave = systemHistory) => {
    if (!canSubmit) return;

    const safeScores =
      scoresToSave && typeof scoresToSave === 'object' && 'nativeEvent' in scoresToSave
        ? scores
        : scoresToSave;
    const safeHistory =
      historyToSave && typeof historyToSave === 'object' && 'nativeEvent' in historyToSave
        ? systemHistory
        : historyToSave;

    localStorage.setItem('beautyHue_scores', JSON.stringify(safeScores));
    localStorage.setItem('beautyHue_systemHistory', JSON.stringify(safeHistory));
    localStorage.setItem('beautyHue_image', image);

    try {
      localStorage.setItem('beautyHue_screenshots', JSON.stringify(screenshots));
    } catch (error) {
      console.error('Failed to persist screenshots', error);
      localStorage.removeItem('beautyHue_screenshots');
    }

    navigate('/result');
  };

  return (
    React.createElement('div', { className: "bg-kraft min-h-screen flex flex-col items-center relative overflow-hidden"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 192}}
      , React.createElement('div', { className: "w-full max-w-[1700px] h-screen flex flex-col relative"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 193}}
        , React.createElement(_Navbar2.default, { onOpenLogin: onOpenLogin, __self: this, __source: {fileName: _jsxFileName, lineNumber: 194}} )

        , React.createElement(_framermotion.AnimatePresence, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}
          , flash && (
            React.createElement(_framermotion.motion.div, {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              transition: { duration: 0.1 },
              className: "fixed inset-0 z-[100] bg-white pointer-events-none"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 198}}
            )
          )
        )

        , React.createElement(_framermotion.AnimatePresence, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 208}}
          , showToast && (
            React.createElement(_framermotion.motion.div, {
              initial: { opacity: 0, y: 50, scale: 0.9 },
              animate: { opacity: 1, y: 0, scale: 1 },
              exit: { opacity: 0, y: 20, scale: 0.9 },
              className: "fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 glass-btn border-white/40 shadow-2xl flex items-center gap-3"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 210}}

              , React.createElement('div', { className: "bg-green-500/20 p-1.5 rounded-full"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}
                , React.createElement(_lucidereact.CheckCircle2, { className: "w-5 h-5 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 217}} )
              )
              , React.createElement('span', { className: "text-navy font-semibold tracking-wide"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 219}}, '\u622a\u56fe\u5b8c\u6210')
            )
          )
        )

        , hasStarted && (
          React.createElement('div', { className: "w-full mb-4 mt-2 z-10"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 225}}
            , React.createElement('div', { className: "flex w-full" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 226}}
              , React.createElement('div', { className: "w-1/12", __self: this, __source: {fileName: _jsxFileName, lineNumber: 227}} )
              , React.createElement('div', { className: "w-8/12 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}
                , React.createElement('div', { className: "w-full max-w-[900px] mx-auto flex flex-col items-start"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 229}}
                  , React.createElement('div', { className: "text-navy/60 text-xs mb-2 font-mono tracking-[0.3em] font-bold"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 230}}
                    , `\u9636\u6bb5 ${phase} \u00b7 \u7b2c ${currentRoundKey + 1} / ${_testSequence.TOTAL_ROUNDS} \u8f6e`
                  )
                  , React.createElement('div', { className: "w-full h-2.5 bg-black/5 rounded-full overflow-hidden shadow-inner border border-white/20"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 233}}
                    , React.createElement(_framermotion.motion.div, {
                      className: "h-full bg-navy shadow-[0_0_18px_rgba(22,38,96,0.42),0_0_28px_rgba(208,230,253,0.4)]"  ,
                      initial: { width: 0 },
                      animate: { width: `${((currentRoundKey + 1) / _testSequence.TOTAL_ROUNDS) * 100}%` },
                      transition: { duration: 0.5, ease: "circOut" }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 234}}
                    )
                  )
                )
              )
            )
          )
        )

        , React.createElement('div', { className: "grow flex w-full relative h-0"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 247}}
          , React.createElement('div', { className: "w-1/12 flex items-center justify-center"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}}
            , hasStarted && round > 0 && (
              React.createElement('button', {
                onClick: handlePrevious,
                'aria-label': "\u8fd4\u56de\u4e0a\u4e00\u9875",
                className: "w-12 h-12 flex items-center justify-center rounded-full glass-btn text-navy border border-white/70 shadow-[0_8px_24px_rgba(22,38,96,0.08)] transition-offset hover:-translate-x-1"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}

                , React.createElement('span', { className: "text-[26px] leading-none font-semibold text-navy -translate-x-px"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 255}}, '\u2190')
              )
            )
          )

          , React.createElement('div', { className: "w-8/12 h-full flex items-center justify-center relative px-4"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 260}}
            , !hasStarted ? (
              React.createElement(_PhotoUploader2.default, { onStart: handleStart, __self: this, __source: {fileName: _jsxFileName, lineNumber: 262}} )
            ) : (
              React.createElement('div', { className: "w-full h-full flex items-center justify-center pt-4 pb-8"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 264}}
                , React.createElement(_PhotoFrame2.default, { image: image, currentColorHex: _optionalChain([currentColor, 'optionalAccess', _ => _.color]), frameRef: frameRef, __self: this, __source: {fileName: _jsxFileName, lineNumber: 265}} )
              )
            )
          )

          , React.createElement('div', { className: "w-3/12 h-full flex items-center justify-start pl-8 pr-12"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}}
            , hasStarted && (
              React.createElement(_ControlPanel2.default, {
                currentColor: currentColor,
                userScore: roundScores[currentRoundKey],
                onScore: handleScore,
                onScreenshot: handleScreenshot,
                canSubmit: canSubmit,
                onSubmit: handleSubmit,
                onReselectPhoto: handleReselectPhoto, __self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}
              )
            )
          )
        )
      )
    )
  );
} exports.default = TestPage;
