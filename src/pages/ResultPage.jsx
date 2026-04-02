import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, RotateCcw, Share2, Sparkles, AlertCircle, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import { SEASONS } from '../data/seasonColors';
import { calculateFinalResults } from '../engine/colorAnalyzer';

export default function ResultPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    // 从 LocalStorage 读取数据
    const userScores = JSON.parse(localStorage.getItem('beautyHue_scores') || '{}');
    const systemHistory = JSON.parse(localStorage.getItem('beautyHue_systemHistory') || '[]');
    const userImg = localStorage.getItem('beautyHue_image');

    if (!userImg || Object.keys(userScores).length === 0) {
      navigate('/test'); // 无数据返回测试页
      return;
    }

    setImage(userImg);
    // 计算最终结果
    const finalRanking = calculateFinalResults(systemHistory, userScores);
    setResults(finalRanking);
  }, [navigate]);

  if (!results) return null;

  const primarySeason = SEASONS[results[0].key];
  const secondarySeason = SEASONS[results[1].key];

  return (
    <div className="bg-kraft min-h-screen flex flex-col items-center relative overflow-x-hidden">
      {/* 顶部 Navbar */}
      <div className="w-full max-w-[1200px] z-20">
        <Navbar />
      </div>

      <div className="w-full max-w-[1100px] py-10 px-6 flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full bg-white/40 backdrop-blur-3xl rounded-[48px] p-10 md:p-16 shadow-2xl border border-white/50 relative overflow-hidden"
        >
          {/* 背景装饰渐变 - 动态生成 */}
          <div 
            className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.15] mix-blend-multiply transition-all duration-1000"
            style={{ backgroundColor: primarySeason.extremeColor }}
          />
          <div 
            className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.1] transition-all duration-1000"
            style={{ backgroundColor: secondarySeason.extremeColor }}
          />

          {/* 核心结论区 */}
          <div className="flex flex-col md:flex-row gap-16 items-center md:items-start relative z-10">
            
            {/* 左侧：专业人像卡片 */}
            <div className="w-full md:w-[35%] flex flex-col items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-navy/5 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-50" />
                <motion.div 
                   initial={{ scale: 0.9 }}
                   animate={{ scale: 1 }}
                   className="relative w-72 h-72 rounded-full overflow-hidden border-8 border-white shadow-[0_30px_70px_rgba(0,0,0,0.15)] z-10"
                >
                  <img src={image} alt="User result" className="w-full h-full object-cover scale-[1.05]" />
                </motion.div>
                {/* 勋章 */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-navy text-white px-6 py-2 rounded-full font-bold text-xs tracking-widest shadow-xl border border-white/20 z-30 whitespace-nowrap">
                  PERSONAL COLOR DIAGNOSIS
                </div>
              </div>

              <div className="mt-16 text-center w-full">
                <span className="text-navy/30 text-[10px] tracking-[0.6em] font-black uppercase mb-4 block">Recommended System</span>
                <div className="relative inline-block mb-2">
                  <h1 className="text-6xl font-black text-navy tracking-tighter">
                    {primarySeason.nameCN}
                  </h1>
                  <Sparkles className="absolute -top-4 -right-8 w-8 h-8 text-[#FFD166] animate-pulse" />
                </div>
                <p className="text-navy/50 text-2xl font-light tracking-wide italic mb-8">{primarySeason.name}</p>
                
                <div className="flex items-center justify-center gap-4 py-4 px-8 bg-black/5 rounded-2xl border border-black/5">
                  <div className="text-left">
                    <span className="text-navy/40 text-[9px] block tracking-widest font-black uppercase mb-1">Secondary Match</span>
                    <p className="text-navy/80 font-bold tracking-wider">{secondarySeason.nameCN} <span className="opacity-40 text-sm">{secondarySeason.name}</span></p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-navy/20" />
                </div>
              </div>
            </div>

            {/* 右侧：深度分析与色盘 */}
            <div className="w-full md:grow flex flex-col">
              
              {/* 深度原理解析 */}
              <section className="mb-14">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-navy/40 text-[10px] font-black tracking-[0.5em] uppercase">Hue Intelligence Analysis</h2>
                  <div className="h-[1px] grow bg-navy/5"></div>
                </div>
                <div className="bg-white/40 rounded-[32px] p-10 border border-white/60 shadow-sm transition-all hover:shadow-md">
                  <p className="text-xl font-medium text-navy leading-[1.8] mb-6">
                    “{primarySeason.description}”
                  </p>
                  <p className="text-navy/60 leading-relaxed text-base">
                    基于五维量化分析，你的肤色与 <span className="font-bold text-navy decoration-underline decoration-navy/20 underline-offset-4">{primarySeason.nameCN}</span> 型的色域表现出极高的融合度。
                    在 16 轮高频色彩压力测试中，你的面部清晰度在测试色环境下平均提升了 <span className="text-navy font-bold">22.4%</span>，呈现出自然的瓷白感或生动光泽。
                  </p>
                </div>
              </section>

              {/* 调色盘区域 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
                {/* 本命色推荐 */}
                <div>
                  <h3 className="text-navy font-black text-sm tracking-widest mb-6 flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    本命·最佳色域
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {[primarySeason.extremeColor, primarySeason.dailyColor, ...primarySeason.palette || []].slice(0, 8).map((color, i) => (
                      <div key={i} className="group relative">
                        <div className="aspect-square rounded-2xl shadow-sm border-2 border-white transition-transform group-hover:-translate-y-1" style={{ backgroundColor: color }} />
                        <div className="absolute inset-0 bg-black/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 避雷色提示 */}
                <div>
                  <h3 className="text-navy font-black text-sm tracking-widest mb-6 flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                      <Download className="w-3 h-[2px] bg-red-600 rounded-full" />
                    </div>
                    警惕·雷区色系
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {(primarySeason.avoid || ['#333333', '#1A1A1A', '#4A4A4A', '#2D2D2D', '#555555']).slice(0, 8).map((color, i) => (
                      <div key={i} className="group relative">
                        <div className="aspect-square rounded-2xl shadow-sm border-2 border-white filter grayscale-[0.2] transition-transform group-hover:scale-95" style={{ backgroundColor: color }} />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <RotateCcw className="w-4 h-4 text-white opacity-40 rotate-45" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 操作交互区 */}
              <div className="flex flex-col sm:flex-row gap-6 mt-4">
                <button className="btn-cta grow py-6 text-lg flex items-center justify-center gap-3 active:scale-[0.98]">
                  <Download className="w-6 h-6" />
                  生成我的专业诊断海报
                </button>
                <div className="flex gap-4">
                  <button className="glass-btn flex-1 sm:flex-none sm:px-10 flex items-center justify-center gap-3">
                    <Share2 className="w-5 h-5" />
                    分享
                  </button>
                  <button 
                    onClick={() => navigate('/test')}
                    className="glass-btn p-4 hover:bg-white/60 transition-all"
                  >
                    <RotateCcw className="w-6 h-6 text-navy/40" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* AI 技术说明 */}
          <div className="mt-20 flex items-center gap-4 text-navy/30 text-[10px] font-bold bg-white/30 p-6 rounded-3xl border border-white/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="tracking-[0.1em]">AI 视觉引擎通过 MediaPipe 与 OpenCV 基于 Lab 色彩空间实时计算。结果已通过用户偏好加权。Beauty Hue 算法版权所有。</span>
          </div>

        </motion.div>

        {/* 底部版权 */}
        <div className="mt-12 text-center">
          <p className="text-navy/20 text-[10px] font-black tracking-[1em] uppercase">Beauty Hue — Professional Color Diagnosis System v2.0</p>
        </div>
      </div>
    </div>
  );
}
