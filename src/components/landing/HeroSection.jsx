import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center h-full max-w-lg pl-10 pr-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-navy text-[64px] font-bold leading-[1.1] tracking-tight mb-4">
          Discover Your<br />Perfect Colors
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
          Start Your Test
        </button>
      </motion.div>
    </div>
  );
}
