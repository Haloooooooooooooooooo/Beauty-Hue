import { useRef, useEffect, useMemo } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import SeasonCard from './SeasonCard';
import { SEASONS, SEASON_KEYS } from '../../data/seasonColors';

export default function CardCarousel() {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const isDraggingRef = useRef(false);

  const seasonsList = SEASON_KEYS.map(key => SEASONS[key]);
  const totalCards = seasonsList.length;
  const cardWidth = 360; // 卡片宽度 + 间距

  // 创建3组卡片实现无缝循环
  const extendedList = useMemo(() => {
    const list = [];
    for (let i = 0; i < 3; i++) {
      seasonsList.forEach((season, idx) => {
        list.push({ ...season, uniqueId: `${season.name}-${i}-${idx}` });
      });
    }
    return list;
  }, [seasonsList]);

  // 位置状态 - 从中间组开始
  const x = useMotionValue(-cardWidth * totalCards);

  // 自动轮播
  useEffect(() => {
    let lastTime = null;
    const speed = 80; // 像素/秒

    const animate = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      if (!isDraggingRef.current) {
        let currentX = x.get();
        currentX -= (speed * delta) / 1000;

        // 循环：当移出中间组范围时，跳回
        const totalWidth = cardWidth * totalCards;
        if (currentX < -cardWidth * totalCards * 2) {
          currentX += totalWidth;
        }
        if (currentX > 0) {
          currentX -= totalWidth;
        }

        x.set(currentX);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [totalCards, x]);

  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;

    // 归一化位置，保持在中间组
    const currentX = x.get();
    const totalWidth = cardWidth * totalCards;

    let normalizedX = currentX;
    while (normalizedX > -cardWidth * totalCards * 0.5) {
      normalizedX -= totalWidth;
    }
    while (normalizedX < -cardWidth * totalCards * 1.5) {
      normalizedX += totalWidth;
    }
    x.set(normalizedX);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600px] flex items-center overflow-hidden"
    >
      <motion.div
        className="flex cursor-grab active:cursor-grabbing"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -Infinity, right: Infinity }}
        dragElastic={0}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {extendedList.map((season) => (
          <div key={season.uniqueId} className="flex-shrink-0 mx-2.5">
            <SeasonCard season={season} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}