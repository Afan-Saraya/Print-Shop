import React, { useState, useEffect } from 'react';

const GlobalLoader = ({ isLoading, onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Učitavanje...');

  useEffect(() => {
    if (isLoading) {
      const texts = [
        'Učitavanje 3D modela...',
        'Priprema personalizacije...',
        'Skoro gotovo...',
        'Finalizacija...'
      ];
      
      let textIndex = 0;
      let progressValue = 0;
      
      const interval = setInterval(() => {
        progressValue += Math.random() * 15 + 5;
        if (progressValue > 100) progressValue = 100;
        
        setProgress(progressValue);
        
        if (progressValue > 25 && textIndex === 0) {
          setLoadingText(texts[1]);
          textIndex = 1;
        } else if (progressValue > 60 && textIndex === 1) {
          setLoadingText(texts[2]);
          textIndex = 2;
        } else if (progressValue > 85 && textIndex === 2) {
          setLoadingText(texts[3]);
          textIndex = 3;
        }
        
        if (progressValue >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onLoadComplete();
          }, 500);
        }
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [isLoading, onLoadComplete]);

  if (!isLoading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* 3D Cube Animation */}
      <div style={{
        width: '80px',
        height: '80px',
        position: 'relative',
        marginBottom: '30px'
      }}>
        <div className="cube-loader">
          <div className="cube-face cube-front"></div>
          <div className="cube-face cube-back"></div>
          <div className="cube-face cube-right"></div>
          <div className="cube-face cube-left"></div>
          <div className="cube-face cube-top"></div>
          <div className="cube-face cube-bottom"></div>
        </div>
      </div>

      {/* Loading Text */}
      <h3 style={{
        fontSize: '24px',
        fontWeight: '600',
        background: 'linear-gradient(135deg, #674AD9, #9C88FF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        {loadingText}
      </h3>

      {/* Progress Bar */}
      <div style={{
        width: '300px',
        height: '6px',
        backgroundColor: '#e0e0e0',
        borderRadius: '3px',
        overflow: 'hidden',
        marginBottom: '15px'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(135deg, #674AD9, #9C88FF)',
          borderRadius: '3px',
          transition: 'width 0.3s ease'
        }}></div>
      </div>

      {/* Progress Percentage */}
      <p style={{
        fontSize: '16px',
        color: '#666',
        margin: 0
      }}>
        {Math.round(progress)}%
      </p>

      {/* CSS Animations */}
      <style jsx>{`
        .cube-loader {
          width: 80px;
          height: 80px;
          position: relative;
          transform-style: preserve-3d;
          animation: rotateCube 2s infinite linear;
        }

        .cube-face {
          position: absolute;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #674AD9, #9C88FF);
          border: 2px solid rgba(255, 255, 255, 0.3);
          opacity: 0.8;
        }

        .cube-front { transform: rotateY(0deg) translateZ(40px); }
        .cube-back { transform: rotateY(180deg) translateZ(40px); }
        .cube-right { transform: rotateY(90deg) translateZ(40px); }
        .cube-left { transform: rotateY(-90deg) translateZ(40px); }
        .cube-top { transform: rotateX(90deg) translateZ(40px); }
        .cube-bottom { transform: rotateX(-90deg) translateZ(40px); }

        @keyframes rotateCube {
          0% { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }

        @media (max-width: 768px) {
          .cube-loader {
            width: 60px;
            height: 60px;
          }
          
          .cube-face {
            width: 60px;
            height: 60px;
          }
          
          .cube-front, .cube-back, .cube-right, .cube-left, .cube-top, .cube-bottom {
            transform-origin: center;
          }
          
          .cube-front { transform: rotateY(0deg) translateZ(30px); }
          .cube-back { transform: rotateY(180deg) translateZ(30px); }
          .cube-right { transform: rotateY(90deg) translateZ(30px); }
          .cube-left { transform: rotateY(-90deg) translateZ(30px); }
          .cube-top { transform: rotateX(90deg) translateZ(30px); }
          .cube-bottom { transform: rotateX(-90deg) translateZ(30px); }
        }
      `}</style>
    </div>
  );
};

export default GlobalLoader;