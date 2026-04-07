import { useRef, useEffect, useMemo, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import SeasonCard from './SeasonCard';
import { SEASONS, SEASON_KEYS } from '../../data/seasonColors';

// 单张卡片组件
function CarouselCard({ season, index, x, cardWidth, containerWidth, totalCards }) {
  const cardCenter = index * cardWidth + cardWidth / 2;

  // 计算卡片位置状态
  // status: 'exiting' | 'visible-left' | 'visible-right' | 'entering'
  const getPosition = (latestX) => {
    const cardPos = cardCenter + latestX;
    const containerCenter = containerWidth / 2;

    // 主显示区域的左边界和右边界
    const leftEdge = containerCenter - cardWidth;
    const rightEdge = containerCenter + cardWidth;

    if (cardPos < leftEdge - cardWidth * 0.5) {
      return { status: 'exiting', progress: Math.min(1, (leftEdge - cardWidth * 0.5 - cardPos) / (cardWidth * 0.8)) };
    }
    if (cardPos < leftEdge) {
      return { status: 'visible-left', progress: 0 };
    }
    if (cardPos < rightEdge) {
      return { status: 'visible-right', progress: 0 };
    }
    if (cardPos < rightEdge + cardWidth * 0.8) {
      return { status: 'entering', progress: (cardPos - rightEdge) / (cardWidth * 0.8) };
    }
    return { status: 'hidden', progress: 1 };
  };

  // opacity - 淡入淡出
  const opacity = useTransform(x, (latestX) => {
    const { status, progress } = getPosition(latestX);

    if (status === 'exiting') {
      // 左边淡出
      return Math.max(0, 1 - progress);
    }
    if (status === 'entering') {
      // 右边淡入
      return Math.max(0.1, 1 - progress);
    }
    if (status === 'visible-left' || status === 'visible-right') {
      // 主显示区域清晰
      return 1;
    }
    return 0;
  });

  // y 偏移 - 左上后方和右下前方
  const y = useTransform(x, (latestX) => {
    const { status, progress } = getPosition(latestX);

    if (status === 'exiting') {
      // 左上后方：向上移动
      return -progress * 80;
    }
    if (status === 'entering') {
      // 右下前方：向下移动
      return progress * 80;
    }
    return 0;
  });

  // x 偏移 - 模拟"后方"的深度感
  const xOffset = useTransform(x, (latestX) => {
    const { status, progress } = getPosition(latestX);

    if (status === 'exiting') {
      // 左边额外向左偏移
      return -progress * 60;
    }
    if (status === 'entering') {
      // 右边额外向右偏移
      return progress * 60;
    }
    return 0;
  });

  // zIndex
  const zIndex = useTransform(x, (latestX) => {
    const { status } = getPosition(latestX);
    if (status === 'visible-left') return 12;
    if (status === 'visible-right') return 11;
    if (status === 'exiting') return 5;
    if (status === 'entering') return 5;
    return 1;
  });

  // 悬浮放大
  const [isHovered, setIsHovered] = useState(false);
  const { status } = getPosition(x.get());
  const canHover = status === 'visible-left' || status === 'visible-right';
  const hoverScale = isHovered && canHover ? 1.03 : 1;

  return (
    <motion.div
      className="flex-shrink-0"
      style={{
        scale: hoverScale,
      }}
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
  const cardWidth = 360; // 卡片宽度340 + 间距20

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

  // 位置状态
  const x = useMotionValue(-cardWidth * totalCards);

  // 测量容器宽度
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 自动轮播
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
      <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-gradient-to-r from-kraft via-kraft/60 to-transparent pointer-events-none z-30" />
      {/* 右边渐变遮罩 */}
      <div className="absolute right-0 top-0 bottom-0 w-[15%] bg-gradient-to-l from-kraft via-kraft/60 to-transparent pointer-events-none z-30" />
    </div>
  );
}