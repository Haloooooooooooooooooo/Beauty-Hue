import { useRef, useEffect, useMemo, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import SeasonCard from './SeasonCard';
import { SEASONS, SEASON_KEYS } from '../../data/seasonColors';

// 单张卡片组件
function CarouselCard({ season, index, x, cardWidth, containerWidth, totalCards }) {
  const cardCenter = index * cardWidth + cardWidth / 2;

  // 计算卡片位置
  const getCardState = (latestX) => {
    const cardPos = cardCenter + latestX;
    const containerCenter = containerWidth / 2;

    // 主显示区域：屏幕中心左右各一张卡片
    // 卡片2在左边，卡片3在右边
    const mainLeft = containerCenter - cardWidth;      // 卡片2的中心位置
    const mainRight = containerCenter + cardWidth;     // 卡片3的中心位置

    // 淡出区域：比主显示区域更左边
    const exitStart = mainLeft - cardWidth * 0.8;      // 开始淡出的位置
    const exitEnd = mainLeft - cardWidth * 2;          // 完全消失的位置

    // 淡入区域：比主显示区域更右边
    const enterStart = mainRight + cardWidth * 0.5;    // 开始淡入的位置
    const enterEnd = mainRight + cardWidth * 1.5;      // 完全清晰的位置

    if (cardPos < exitEnd) {
      // 完全消失
      return { state: 'gone', progress: 1 };
    }
    if (cardPos < exitStart) {
      // 正在淡出（缓慢）
      const progress = (exitStart - cardPos) / (exitStart - exitEnd);
      return { state: 'exiting', progress };
    }
    if (cardPos < containerCenter) {
      // 主显示左边卡片（卡片2）
      return { state: 'main-left', progress: 0 };
    }
    if (cardPos < mainRight + cardWidth * 0.3) {
      // 主显示右边卡片（卡片3）
      return { state: 'main-right', progress: 0 };
    }
    if (cardPos < enterEnd) {
      // 正在淡入
      const progress = (enterEnd - cardPos) / (enterEnd - enterStart);
      return { state: 'entering', progress };
    }
    // 还在右边等待
    return { state: 'waiting', progress: 1 };
  };

  // opacity
  const opacity = useTransform(x, (latestX) => {
    const { state, progress } = getCardState(latestX);

    switch (state) {
      case 'gone':
        return 0;
      case 'exiting':
        // 缓慢淡出：从1到0.1
        return Math.max(0.1, 1 - progress * 0.9);
      case 'main-left':
      case 'main-right':
        return 1;
      case 'entering':
        // 进入即淡入：从0.4到1
        return 0.4 + (1 - progress) * 0.6;
      case 'waiting':
        return 0.3;
      default:
        return 1;
    }
  });

  // y 偏移
  const y = useTransform(x, (latestX) => {
    const { state, progress } = getCardState(latestX);

    if (state === 'exiting') {
      // 左上后方：向上移动
      return -progress * 60;
    }
    if (state === 'entering' || state === 'waiting') {
      // 右下前方：向下移动
      return 40;
    }
    return 0;
  });

  // x 偏移 - 向右移动，叠到下一张卡片后面被遮挡
  const xOffset = useTransform(x, (latestX) => {
    const { state, progress } = getCardState(latestX);

    if (state === 'exiting') {
      // 向右移动，与下一张卡片重叠，被下一张卡片遮挡
      // 使用卡片视觉宽度340的一半，产生50%折叠效果
      return progress * 170;
    }
    return 0;
  });

  // zIndex
  const zIndex = useTransform(x, (latestX) => {
    const { state } = getCardState(latestX);
    switch (state) {
      case 'main-left':
        return 12;
      case 'main-right':
        return 11;
      case 'exiting':
        return 5;
      case 'entering':
        return 6;
      default:
        return 1;
    }
  });

  // 悬浮放大
  const [isHovered, setIsHovered] = useState(false);
  const { state: cardState } = getCardState(x.get());
  const canHover = cardState === 'main-left' || cardState === 'main-right';
  const hoverScale = isHovered && canHover ? 1.03 : 1;

  return (
    <motion.div
      className="flex-shrink-0"
      style={{ scale: hoverScale }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        style={{
          opacity,
          y,
          x: xOffset,
          zIndex,
          marginLeft: '10px',
          marginRight: '10px',
        }}
      >
        <SeasonCard season={season} />
      </motion.div>
    </motion.div>
  );
}

export default function CardCarousel() {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const isDraggingRef = useRef(false);
  const [containerWidth, setContainerWidth] = useState(800);

  const seasonsList = SEASON_KEYS.map(key => SEASONS[key]);
  const totalCards = seasonsList.length;
  const cardWidth = 360;

  const extendedList = useMemo(() => {
    const list = [];
    for (let i = 0; i < 3; i++) {
      seasonsList.forEach((season, idx) => {
        list.push({ ...season, uniqueId: `${season.name}-${i}-${idx}` });
      });
    }
    return list;
  }, [seasonsList]);

  const x = useMotionValue(-cardWidth * totalCards);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let lastTime = null;
    const speed = 80;

    const animate = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      if (!isDraggingRef.current) {
        let currentX = x.get();
        currentX -= (speed * delta) / 1000;

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
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [totalCards, x]);

  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
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
        {extendedList.map((season, idx) => (
          <CarouselCard
            key={season.uniqueId}
            season={season}
            index={idx}
            x={x}
            cardWidth={cardWidth}
            containerWidth={containerWidth}
            totalCards={totalCards}
          />
        ))}
      </motion.div>

      {/* 左边渐变遮罩 */}
      <div className="absolute left-0 top-0 bottom-0 w-[12%] bg-gradient-to-r from-kraft via-kraft/50 to-transparent pointer-events-none z-30" />
      {/* 右边渐变遮罩 */}
      <div className="absolute right-0 top-0 bottom-0 w-[12%] bg-gradient-to-l from-kraft via-kraft/50 to-transparent pointer-events-none z-30" />
    </div>
  );
}