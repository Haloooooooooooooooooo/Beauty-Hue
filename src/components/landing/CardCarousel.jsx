import { useRef, useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import SeasonCard from './SeasonCard';
import { SEASONS, SEASON_KEYS } from '../../data/seasonColors';

export default function CardCarousel() {
  const carouselRef = useRef(null);
  const [dragConstraints, setDragConstraints] = useState({ right: 0, left: 0 });
  
  const seasonsList = SEASON_KEYS.map(key => SEASONS[key]);

  useEffect(() => {
    if (carouselRef.current) {
      // Calculate how far left we can drag avoiding white space on right edge.
      // 12 cards * (340px width + 32px margin) approx.
      const scrollWidth = carouselRef.current.scrollWidth;
      const viewportWidth = carouselRef.current.offsetWidth;
      setDragConstraints({ right: 0, left: - (scrollWidth - viewportWidth + 32) });
    }
  }, []);

  return (
    <div className="relative w-full h-[600px] flex items-center overflow-hidden carousel-mask pl-8">
      <motion.div 
        ref={carouselRef}
        className="flex cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        dragTransition={{ bounceStiffness: 100, bounceDamping: 20 }}
      >
        {seasonsList.map((season, index) => (
          <SeasonCard key={index} season={season} />
        ))}
      </motion.div>
    </div>
  );
}
