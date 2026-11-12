import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Ultra-smooth, lightweight scrolling that never hitches or halts
    const lenis = new Lenis({
      duration: 0.5, // Immediate response without heavy lingering inertia
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0, // Natural 1:1 wheel mapping
      touchMultiplier: 1.0,
      syncTouch: false, // Never hijack native 120Hz momentum on touchscreens & trackpads
      infinite: false,
    });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Keep Lenis dimensions in sync with dynamic DOM changes without scroll halts
    const handleResize = () => {
      lenis.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}

