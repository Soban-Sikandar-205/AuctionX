import React from 'react';
import BlueLogo from './BlueLogo';

function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute w-64 h-64 bg-sky-500/10 rounded-full filter blur-[100px] animate-pulse"></div>
      
      {/* 3D Spinning Logo Container */}
      <div className="relative w-28 h-28 preserve-3d spin-3d z-10">
        {/* Layer 1: Back (Deep blue/shadow) */}
        <div className="absolute inset-0 text-sky-950 transform translate-z-back-layer">
          <BlueLogo className="w-full h-full" />
        </div>
        {/* Layer 2: Middle (Mid blue/glow) */}
        <div className="absolute inset-0 text-sky-600/70 transform translate-z-mid-layer">
          <BlueLogo className="w-full h-full" />
        </div>
        {/* Layer 3: Front (Neon bright sky blue) */}
        <div className="absolute inset-0 text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.6)] transform translate-z-0">
          <BlueLogo className="w-full h-full" />
        </div>
      </div>
      
      {/* App Branding */}
      <div className="mt-12 z-10 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Auctio</span>
          <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">Nex</span>
        </h2>
        <p className="text-slate-500 text-xs mt-2 tracking-[0.2em] uppercase animate-pulse">Loading live bidding...</p>
      </div>

      {/* Embedded styles for 3D spin */}
      <style>{`
        @keyframes spin3d {
          0% { transform: rotateY(0deg) rotateX(15deg); }
          100% { transform: rotateY(360deg) rotateX(15deg); }
        }
        .spin-3d {
          animation: spin3d 3.5s infinite linear;
          transform-style: preserve-3d;
        }
        .preserve-3d {
          transform-style: preserve-3d;
          perspective: 800px;
        }
        .translate-z-back-layer {
          transform: translateZ(-8px);
        }
        .translate-z-mid-layer {
          transform: translateZ(-4px);
        }
      `}</style>
    </div>
  );
}

export default Loading;
