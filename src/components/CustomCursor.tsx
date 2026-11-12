import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from './ThemeProvider';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Only show custom cursor on fine pointers (desktop)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;
    
    setIsVisible(true);

    let animationFrameId: number;
    let latestX = 0;
    let latestY = 0;

    const updateMousePosition = (e: MouseEvent) => {
      latestX = e.clientX;
      latestY = e.clientY;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(() => {
          setMousePosition({ x: latestX, y: latestY });
          animationFrameId = 0;
        });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hoverable = target.closest('a, button, input, textarea, [data-hover]');
      
      if (hoverable) {
        setIsHovering(true);
        const text = hoverable.getAttribute('data-cursor-text');
        if (text) setCursorText(text);
        else setCursorText('');
      } else {
        setIsHovering(false);
        setCursorText('');
      }
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full flex items-center justify-center will-change-transform transform-gpu shadow-lg"
      style={{
        width: isHovering && cursorText ? 68 : isHovering ? 28 : 10,
        height: isHovering && cursorText ? 68 : isHovering ? 28 : 10,
      }}
      animate={{
        x: mousePosition.x - (isHovering && cursorText ? 34 : isHovering ? 14 : 5),
        y: mousePosition.y - (isHovering && cursorText ? 34 : isHovering ? 14 : 5),
      }}
      transition={{
        type: 'spring',
        mass: 0.05,
        stiffness: 1000,
        damping: 60,
      }}
    >
      <div 
        className={`w-full h-full rounded-full flex items-center justify-center transition-colors duration-200 ${
          isHovering 
            ? 'bg-amber-400 text-zinc-950 border border-amber-300 shadow-xl' 
            : 'bg-zinc-900/80 dark:bg-white/80 border border-white/30 dark:border-black/30 backdrop-blur-sm'
        }`}
      >
        {isHovering && cursorText && (
          <span className="text-[9px] font-mono font-bold tracking-widest uppercase text-center px-1">
            {cursorText}
          </span>
        )}
      </div>
    </motion.div>
  );
}
