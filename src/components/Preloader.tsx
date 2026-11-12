import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Smooth, rapid load counter that finishes gracefully in under 200ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 80); // Swift exit without holding the user back
          return 100;
        }
        return prev + 12;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-zinc-950 text-white pointer-events-auto"
      initial={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '-100%' }}
      transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
    >
      <div className="relative overflow-hidden text-6xl md:text-9xl font-display font-light flex items-end">
        <motion.span
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          AM
        </motion.span>
        <div className="text-xl md:text-3xl ml-4 font-mono font-light text-zinc-500 mb-2 w-16">
          {progress}%
        </div>
      </div>
      <div className="w-64 h-px bg-zinc-800 mt-8 relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-white"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}

export default Preloader;
