import { motion } from 'framer-motion';

export default function PhotoFrame({ image, currentColorHex, frameRef }) {
  return (
    <div 
      ref={frameRef}
      className="photo-frame w-full max-w-[900px] h-[82vh] mx-auto flex flex-col overflow-hidden shadow-2xl relative"
    >
      {/* 顶部标题区 */}
      <div className="px-10 py-8 flex justify-between items-center bg-[#FAF6F0] z-20">
        <h2 className="text-3xl font-black text-navy tracking-widest uppercase opacity-90">Color For You</h2>
        <span className="text-navy/40 tracking-[0.4em] text-xs font-bold uppercase transition-all">ORIGINAL</span>
      </div>

      {/* 核心测试颜色区: 现在再次回归全覆盖布局 */}
      <div 
        className="flex-1 w-full relative color-transition flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: currentColorHex || '#fafafa' }}
      >
        {image ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-72 h-72 md:w-[460px] md:h-[460px] rounded-full overflow-hidden shadow-[0_45px_120px_rgba(0,0,0,0.4)] relative z-20"
          >
            <img src={image} alt="Target subject" className="w-full h-full object-cover scale-[1.1]" />
          </motion.div>
        ) : (
          <div className="text-black/5 text-2xl font-light tracking-[1em] uppercase">Loading...</div>
        )}

        {/* 底部信息区 */}
        <div className="absolute right-6 bottom-8 z-30 transition-all duration-500">
          <span className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-bold transform -rotate-180" style={{ writingMode: 'vertical-rl' }}>
            PHOTOGRAPHY BY BEAUTY HUE
          </span>
        </div>
      </div>
    </div>
  );
}
