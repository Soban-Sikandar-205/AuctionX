import React, { useState, useEffect, useRef, useCallback } from 'react';
import BlueLogo from '../Components/utils/BlueLogo';

const WelcomeScreen = ({ onSwipeUp }) => {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const screenRef = useRef(null);

  const handleStart = (y) => {
    if (isTransitioning) return;
    setStartY(y);
    setCurrentY(y);
    setIsDragging(true);
  };

  const handleMove = (y) => {
    if (!isDragging || isTransitioning) return;
    setCurrentY(y);
  };

  const handleEnd = () => {
    if (!isDragging || isTransitioning) return;
    setIsDragging(false);
    const diff = startY - currentY;
    // If swiped up by more than 80px, trigger swipe up success
    if (diff > 80) {
      triggerProceed();
    } else {
      // Snap back
      setCurrentY(startY);
    }
  };

  // Touch handlers
  const handleTouchStart = (e) => handleStart(e.touches[0].clientY);
  const handleTouchMove = (e) => handleMove(e.touches[0].clientY);
  const handleTouchEnd = () => handleEnd();

  // Mouse handlers for desktop testing
  const handleMouseDown = (e) => handleStart(e.clientY);
  const handleMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientY);
    }
  };
  const handleMouseUp = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  const triggerProceed = useCallback(() => {
    setIsTransitioning(true);
    // Slide up completely
    setTimeout(() => {
      onSwipeUp();
    }, 600); // matches the transition duration
  }, [onSwipeUp]);

  // Wheel listener for desktop scroll
  useEffect(() => {
    const handleWheel = (e) => {
      if (isTransitioning) return;
      if (e.deltaY > 20) { // scroll down / swipe up equivalent
        triggerProceed();
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isTransitioning, triggerProceed]);

  // Calculate current translation
  const dragDiff = startY - currentY;

  return (
    <div
      ref={screenRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`fixed inset-0 z-[9999] flex flex-col justify-between items-center bg-slate-950 text-white select-none overflow-hidden`}
      style={{
        transform: isTransitioning 
          ? 'translateY(-100%)' 
          : `translateY(-${dragDiff > 0 ? Math.min(dragDiff, window.innerHeight) : 0}px)`,
        transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {/* Floating 3D Glowing Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600/30 rounded-full filter blur-[100px] opacity-40 animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/25 rounded-full filter blur-[120px] opacity-35 animate-blob animation-delay-4000"></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-sky-500/20 rounded-full filter blur-[90px] opacity-20 animate-blob animation-delay-2000"></div>

      {/* Grid Pattern overlay for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40"></div>

      {/* Top bar (aesthetic details) */}
      <div className="mt-16 z-10 flex flex-col items-center">
        <span className="text-[10px] tracking-[0.3em] text-sky-400 font-bold uppercase bg-sky-950/40 border border-sky-500/20 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(56,189,248,0.1)]">
          Live Bidding Experience
        </span>
      </div>

      {/* Main Content Area */}
      <div className="z-10 text-center px-6 max-w-lg">
        {/* Floating Blue Logo in 3D */}
        <div className="flex justify-center mb-8">
          <div className="relative w-28 h-28 preserve-3d animate-float-spin">
            {/* Layer 1: Back (Deep blue/shadow) */}
            <div className="absolute inset-0 text-sky-950 transform translate-z-back">
              <BlueLogo className="w-full h-full" />
            </div>
            {/* Layer 2: Middle */}
            <div className="absolute inset-0 text-sky-600/70 transform translate-z-mid">
              <BlueLogo className="w-full h-full" />
            </div>
            {/* Layer 3: Front (Neon bright sky blue) */}
            <div className="absolute inset-0 text-sky-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.7)] transform translate-z-0">
              <BlueLogo className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-black tracking-tight select-none mb-6">
          <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">Auctio</span>
          <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]">Nex</span>
        </h1>

        {/* Sayings */}
        <div className="space-y-3">
          <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-200 via-sky-100 to-cyan-200 bg-clip-text text-transparent">
            Bid. Win. Own.
          </p>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-sm mx-auto">
            Experience the thrill of premium, real-time auctions right at your fingertips.
          </p>
        </div>
      </div>

      {/* Swipe/Interact Indicator */}
      <div className="mb-16 z-10 flex flex-col items-center cursor-pointer" onClick={triggerProceed}>
        <div className="flex flex-col items-center space-y-2 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="currentColor"
            className="w-6 h-6 text-sky-400 drop-shadow-[0_0_5px_rgba(56,189,248,0.6)]"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mt-3">
          Swipe Up to Enter
        </span>
        <span className="text-[10px] text-slate-500 mt-1">
          (or scroll/click here)
        </span>
      </div>

      {/* CSS helper styles */}
      <style>{`
        @keyframes float-spin {
          0% { transform: translateY(0px) rotateY(0deg) rotateX(10deg); }
          50% { transform: translateY(-12px) rotateY(180deg) rotateX(10deg); }
          100% { transform: translateY(0px) rotateY(360deg) rotateX(10deg); }
        }
        .animate-float-spin {
          animation: float-spin 7s ease-in-out infinite;
          transform-style: preserve-3d;
        }
        .preserve-3d {
          transform-style: preserve-3d;
          perspective: 1000px;
        }
        .translate-z-back {
          transform: translateZ(-8px);
        }
        .translate-z-mid {
          transform: translateZ(-4px);
        }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;
