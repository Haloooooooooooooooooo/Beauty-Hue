import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center h-full pl-0 pr-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h1 className="text-navy text-[72px] font-bold leading-[1.15] tracking-tight mb-1">
          Discover Your
        </h1>
        <h1 className="text-navy text-[88px] font-bold leading-[1.15] tracking-tight mb-4 flex items-baseline gap-4 whitespace-nowrap">
          <span className="-ml-6">Perfect</span>
          <span>Colors</span>
        </h1>
        <h2 className="text-text text-2xl mb-6">
          找到真正适合你的色彩
        </h2>
        <p className="text-muted text-lg mb-12 max-w-md leading-relaxed">
          A professional color analysis experience based on seasonal color theory.
        </p>

        <button
          onClick={() => navigate('/test')}
          className="btn-cta"
        >
          开始体验
        </button>
      </motion.div>
    </div>
  );
}
