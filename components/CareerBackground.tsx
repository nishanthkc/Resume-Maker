'use client';

import { useEffect, useRef } from 'react';

export function CareerBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Career-related icons/symbols to animate
    const symbols = [
      { x: 0, y: 0, size: 20, speed: 0.5, symbol: '💼' },
      { x: 0, y: 0, size: 20, speed: 0.3, symbol: '📄' },
      { x: 0, y: 0, size: 20, speed: 0.4, symbol: '🎯' },
      { x: 0, y: 0, size: 20, speed: 0.6, symbol: '⭐' },
      { x: 0, y: 0, size: 20, speed: 0.35, symbol: '🚀' },
    ];

    // Floating particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const initializeCanvas = () => {
      if (!canvas) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Set canvas size
      canvas.width = width;
      canvas.height = height;
      
      // Initialize symbols positions
      symbols.forEach((symbol) => {
        symbol.x = Math.random() * width;
        symbol.y = Math.random() * height;
      });
      
      // Initialize particles
      particles.length = 0;
      for (let i = 0; i < 30; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const resizeCanvas = () => {
      if (!canvas) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Set canvas size
      canvas.width = width;
      canvas.height = height;
      
      // Update symbols and particles positions if canvas was resized
      symbols.forEach((symbol) => {
        if (symbol.x > width) symbol.x = Math.random() * width;
        if (symbol.y > height) symbol.y = Math.random() * height;
      });
      
      particles.forEach((particle) => {
        if (particle.x > width) particle.x = Math.random() * width;
        if (particle.y > height) particle.y = Math.random() * height;
      });
    };

    // Initial setup
    initializeCanvas();

    let animationFrameId: number;
    let isAnimating = true;

    const animate = () => {
      if (!canvas || !ctx || !isAnimating) return;

      // Ensure canvas dimensions are valid
      if (canvas.width === 0 || canvas.height === 0) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.05)');
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.05)');
      gradient.addColorStop(1, 'rgba(168, 85, 247, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity})`;
        ctx.fill();
      });

      // Update and draw symbols
      symbols.forEach((symbol) => {
        symbol.y += symbol.speed;
        if (symbol.y > canvas.height + 50) {
          symbol.y = -50;
          symbol.x = Math.random() * canvas.width;
        }

        ctx.font = `${symbol.size}px Arial`;
        ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.fillText(symbol.symbol, symbol.x, symbol.y);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Throttle resize events
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isAnimating = false;
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
