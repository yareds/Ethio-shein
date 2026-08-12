import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface TextSegment {
  text: string;
  className?: string;
  isItalic?: boolean;
}

interface ShatterTextProps {
  segments: TextSegment[];
  className?: string;
}

// Helper to generate deterministic pseudo-random offsets for each letter index
function getRandomOffset(index: number, seed: number) {
  const sin1 = Math.sin(index * 12.9898 + seed * 78.233);
  const sin2 = Math.cos(index * 4.1412 + seed * 33.123);
  const sin3 = Math.sin(index * 8.3214 + seed * 91.431);

  return {
    x: sin1 * 120, // horizontal blast range
    y: sin2 * 140, // vertical blast range
    z: sin3 * 200, // depth
    rotateX: sin2 * 360,
    rotateY: sin1 * 360,
    rotateZ: sin3 * 180,
    scale: 0.2 + Math.abs(sin1) * 0.8,
    opacity: 0,
    filter: 'blur(8px)',
  };
}

export default function ShatterText({ segments, className = '' }: ShatterTextProps) {
  const [isShattered, setIsShattered] = useState(false);
  const [shatterKey, setShatterKey] = useState(0);

  // Flatten segments into an array of individual printable characters with segment metadata
  const charList = useMemo(() => {
    const list: {
      char: string;
      segmentIndex: number;
      charIndex: number;
      className?: string;
      isItalic?: boolean;
    }[] = [];

    let globalCount = 0;
    segments.forEach((seg, sIdx) => {
      const chars = Array.from(seg.text);
      chars.forEach((c) => {
        list.push({
          char: c,
          segmentIndex: sIdx,
          charIndex: globalCount++,
          className: seg.className,
          isItalic: seg.isItalic,
        });
      });
    });

    return list;
  }, [segments]);

  const triggerShatter = () => {
    if (isShattered) return;
    setIsShattered(true);
    setShatterKey((prev) => prev + 1);
    setTimeout(() => {
      setIsShattered(false);
    }, 1200);
  };

  return (
    <div className={`relative inline-block select-none cursor-pointer group ${className}`} onClick={triggerShatter}>
      {/* Background glass shard particles during shatter trigger */}
      <AnimatePresence>
        {isShattered && (
          <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
            {Array.from({ length: 18 }).map((_, i) => {
              const seed = i + shatterKey * 10;
              const offset = getRandomOffset(i, seed);
              return (
                <motion.span
                  key={`shard-${i}-${shatterKey}`}
                  initial={{
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 0.9,
                    rotate: 0,
                  }}
                  animate={{
                    x: offset.x * 1.5,
                    y: offset.y * 1.5,
                    scale: 0,
                    opacity: 0,
                    rotate: offset.rotateZ * 2,
                  }}
                  transition={{
                    duration: 0.9 + (i % 4) * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="absolute left-1/2 top-1/2 w-3 h-3 bg-terracotta/40 border border-ochre/60 rounded-xs pointer-events-none backdrop-blur-xs"
                  style={{
                    clipPath:
                      i % 3 === 0
                        ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                        : i % 3 === 1
                        ? 'polygon(20% 0%, 100% 40%, 70% 100%, 0% 80%)'
                        : 'polygon(0% 0%, 100% 20%, 80% 100%)',
                  }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Shattering Letters Container */}
      <motion.span
        key={segments.map((s) => s.text).join('-') + '-' + shatterKey}
        className="inline-flex flex-wrap items-baseline perspective-1000"
      >
        {charList.map((item) => {
          const isSpace = item.char === ' ';
          const seed = item.charIndex + shatterKey * 100;
          const offset = getRandomOffset(item.charIndex, seed);

          if (isSpace) {
            return (
              <span key={`space-${item.charIndex}`} className="inline-block w-[0.28em]">
                &nbsp;
              </span>
            );
          }

          return (
            <motion.span
              key={`char-${item.charIndex}-${shatterKey}`}
              initial={
                isShattered
                  ? { x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, opacity: 1, filter: 'blur(0px)' }
                  : {
                      x: offset.x,
                      y: offset.y,
                      z: offset.z,
                      rotateX: offset.rotateX,
                      rotateY: offset.rotateY,
                      rotateZ: offset.rotateZ,
                      scale: offset.scale,
                      opacity: 0,
                      filter: 'blur(10px)',
                    }
              }
              animate={
                isShattered
                  ? {
                      x: offset.x * 1.3,
                      y: offset.y * 1.3,
                      z: offset.z,
                      rotateX: offset.rotateX,
                      rotateY: offset.rotateY,
                      rotateZ: offset.rotateZ,
                      scale: offset.scale,
                      opacity: 0,
                      filter: 'blur(6px)',
                    }
                  : {
                      x: 0,
                      y: 0,
                      z: 0,
                      rotateX: 0,
                      rotateY: 0,
                      rotateZ: 0,
                      scale: 1,
                      opacity: 1,
                      filter: 'blur(0px)',
                    }
              }
              whileHover={{
                scale: 1.18,
                rotateZ: (item.charIndex % 2 === 0 ? 1 : -1) * 12,
                y: -6,
                color: '#C85A32',
                transition: { type: 'spring', stiffness: 400, damping: 15 },
              }}
              transition={{
                duration: isShattered ? 0.75 : 0.85,
                delay: isShattered ? (item.charIndex % 5) * 0.02 : item.charIndex * 0.03,
                type: 'spring',
                stiffness: 140,
                damping: 14,
              }}
              className={`inline-block origin-center transform-gpu transition-colors duration-200 ${
                item.className || ''
              } ${item.isItalic ? 'italic font-normal' : ''}`}
              style={{
                display: 'inline-block',
                backfaceVisibility: 'hidden',
                willChange: 'transform, opacity, filter',
              }}
            >
              {item.char}
            </motion.span>
          );
        })}
      </motion.span>


    </div>
  );
}
