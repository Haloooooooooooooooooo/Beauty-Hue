import { motion } from 'framer-motion';

export default function PhotoFrame({ image, currentColorHex, frameRef }) {
  return (
    <div 
      ref={frameRef}
      className="photo-frame w-full max-w-[900px] h-[82vh] mx-auto flex flex-col overflow-hidden"
    >
      <div className="px-10 py-8 flex justify-between items-center bg-[#FAF6F0]">
        <h2 className="text-3xl font-black text-navy tracking-widest uppercase opacity-90">Color For You</h2>
        <span className="text-navy/40 tracking-[0.4em] text-xs font-bold">ORIGINAL</span>
      </div>

      <div 
        className="flex-1 w-full relative color-transition flex items-center justify-center"
        style={{ backgroundColor: currentColorHex || '#fafafa' }}
      >
        {image ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-72 h-72 md:w-[420px] md:h-[420px] rounded-full overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.35)] relative border-[10px] border-white/60 z-20"
          >
            <img src={image} alt="Target subject" className="w-full h-full object-cover scale-[1.1]" />
          </motion.div>
        ) : (
          <div className="text-black/5 text-2xl font-light tracking-[1em] uppercase">Loading...</div>
        )}

        <div className="absolute right-6 bottom-8 z-30">
          <span className="text-[10px] text-white/30 uppercase tracking-[0.5em] font-bold transform -rotate-180" style={{ writingMode: 'vertical-rl' }}>
            PHOTOGRAPHY BY BEAUTY HUE
          </span>
        </div>
      </div>
    </div>
  );
}
