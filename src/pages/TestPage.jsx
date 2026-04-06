import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import PhotoUploader from '../components/test/PhotoUploader';
import PhotoFrame from '../components/test/PhotoFrame';
import ControlPanel from '../components/test/ControlPanel';
import { PHASE1_SEQUENCE, generatePhase2, MIN_ROUNDS, TOTAL_ROUNDS } from '../data/testSequence';
import { analyzeImageMetrics } from '../engine/colorAnalyzer';

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

export default function TestPage() {
  const navigate = useNavigate();
  const frameRef = useRef(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [image, setImage] = useState(null);
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState(1);
  const [sequence, setSequence] = useState(PHASE1_SEQUENCE);
  const [scores, setScores] = useState({});
  const [systemHistory, setSystemHistory] = useState([]);
  const [roundScores, setRoundScores] = useState({});
  const [flash, setFlash] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const currentColor = sequence[round];
  const currentRoundKey = phase === 1 ? round : round + 12;
  const canSubmit = (phase === 1 && round >= MIN_ROUNDS - 1) || phase === 2;

  const handleStart = (base64Img) => {
    setImage(base64Img);
    setHasStarted(true);
  };

  const handleReselectPhoto = () => {
    setHasStarted(false);
    setImage(null);
    setRound(0);
    setPhase(1);
    setSequence(PHASE1_SEQUENCE);
    setScores({});
    setSystemHistory([]);
    setRoundScores({});
  };

  const handleScore = async (val) => {
    const analysis = await analyzeImageMetrics(image, currentColor.color);
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
        const nextSequence = generatePhase2(phase1CompositeScores);
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

  const handleScreenshot = () => {
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 200);
  };

  const handleSubmit = (scoresToSave = scores, historyToSave = systemHistory) => {
    if (!canSubmit) return;

    localStorage.setItem('beautyHue_scores', JSON.stringify(scoresToSave));
    localStorage.setItem('beautyHue_systemHistory', JSON.stringify(historyToSave));
    localStorage.setItem('beautyHue_image', image);
    navigate('/result');
  };

  return (
    <div className="bg-kraft min-h-screen flex flex-col items-center relative overflow-hidden">
      <div className="w-full max-w-[1700px] h-screen flex flex-col relative">
        <Navbar />

        <AnimatePresence>
          {flash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="fixed inset-0 z-[100] bg-white pointer-events-none"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 glass-btn border-white/40 shadow-2xl flex items-center gap-3"
            >
              <div className="bg-green-500/20 p-1.5 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-navy font-semibold tracking-wide">截图已保存到本地</span>
            </motion.div>
          )}
        </AnimatePresence>

        {hasStarted && (
          <div className="w-full mb-4 mt-2 z-10">
            <div className="flex w-full">
              <div className="w-1/12" />
              <div className="w-8/12 px-4">
                <div className="w-full max-w-[900px] mx-auto flex flex-col items-start">
                  <div className="text-navy/60 text-xs mb-2 font-mono tracking-[0.3em] font-bold">
                    {`\u9636\u6bb5 ${phase} \u00b7 \u7b2c ${currentRoundKey + 1} / ${TOTAL_ROUNDS} \u8f6e`}
                  </div>
                  <div className="w-full h-2.5 bg-black/5 rounded-full overflow-hidden shadow-inner border border-white/20">
                    <motion.div
                      className="h-full bg-navy shadow-[0_0_18px_rgba(22,38,96,0.42),0_0_28px_rgba(208,230,253,0.4)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentRoundKey + 1) / TOTAL_ROUNDS) * 100}%` }}
                      transition={{ duration: 0.5, ease: "circOut" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grow flex w-full relative h-0">
          <div className="w-1/12 flex items-center justify-center">
            {hasStarted && round > 0 && (
              <button
                onClick={handlePrevious}
                aria-label={"\u8fd4\u56de\u4e0a\u4e00\u9875"}
                className="w-12 h-12 flex items-center justify-center rounded-full glass-btn text-navy border border-white/70 shadow-[0_8px_24px_rgba(22,38,96,0.08)] transition-offset hover:-translate-x-1"
              >
                <span className="text-[26px] leading-none font-semibold text-navy -translate-x-px">{'\u2190'}</span>
              </button>
            )}
          </div>

          <div className="w-8/12 h-full flex items-center justify-center relative px-4">
            {!hasStarted ? (
              <PhotoUploader onStart={handleStart} />
            ) : (
              <div className="w-full h-full flex items-center justify-center pt-4 pb-8">
                <PhotoFrame image={image} currentColorHex={currentColor?.color} frameRef={frameRef} />
              </div>
            )}
          </div>

          <div className="w-3/12 h-full flex items-center justify-start pl-8 pr-12">
            {hasStarted && (
              <ControlPanel
                currentColor={currentColor}
                userScore={roundScores[currentRoundKey]}
                onScore={handleScore}
                onScreenshot={handleScreenshot}
                canSubmit={canSubmit}
                onSubmit={handleSubmit}
                onReselectPhoto={handleReselectPhoto}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
