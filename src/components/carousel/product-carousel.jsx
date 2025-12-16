import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ModelViewer from "@/components/ModelViewer";
import { ArrowNextTwo, ArrowPrevTwo } from '@/svg';

// Isti podaci kao u shop-category-area
const carouselData = [
  { id: 1, parent: 'Majice', model: '/shirt/scene.gltf', zoom: 2.5, color: '#00008B' },
  { id: 2, parent: 'Kape', model: '/cap/scene.gltf', zoom: 1.5, color: '#000000' },
  { id: 3, parent: 'Šolje', model: '/cup/scene.gltf', zoom: 0.15, color: '#FFFFFF' },
  { id: 4, parent: 'Olovke', model: '/pen/scene.gltf', zoom: 0.1, color: '#FF0000' },
  { id: 5, parent: 'Kesice i Cekeri', model: '/bag/scene.gltf', zoom: 1.25, color: '#D2B48C' },
  { id: 6, parent: 'Privjesci', model: '/pendants/scene.gltf', zoom: 4, color: '#FF8C00' },
  { id: 7, parent: 'Bedževi', model: '/badge/scene.gltf', zoom: 0.3, color: '#FFFF00' },
  { id: 8, parent: 'Upaljači', model: '/lighter/scene.gltf', zoom: 0.008, color: '#800080' },
  { id: 9, parent: 'Rokovnici', model: '/agenda/scene.gltf', zoom: 0.01024, color: '#008000' }
];

const ProductCarousel = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % carouselData.length);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + carouselData.length) % carouselData.length);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 600);
  };

  // Handle category route - otvori editor sa odabranim modelom
  const handleCategoryRoute = (model) => {
    router.push(`/editor?model=${encodeURIComponent(model)}&fromCategory=true`);
  };

  const getCurrentItem = () => carouselData[currentIndex];
  const getPrevItem = () => carouselData[(currentIndex - 1 + carouselData.length) % carouselData.length];
  const getNextItem = () => carouselData[(currentIndex + 1) % carouselData.length];
  const getPrevItem2 = () => carouselData[(currentIndex - 2 + carouselData.length) % carouselData.length];
  const getNextItem2 = () => carouselData[(currentIndex + 2) % carouselData.length];

  return (
    <div className="product-carousel-container">
      <div className="carousel-wrapper">
        {/* Lijevi proizvodi */}
        <div className="left-side">
          {/* Dalji lijevi proizvod (manji) */}
          <div 
            className={`side-product left-product-far ${isTransitioning ? 'transitioning' : ''}`}
            onClick={prevSlide}
          >
            <div className="side-model-container with-frame">
              <ModelViewer 
                key={`left-far-${getPrevItem2().id}`}
                modelPath={getPrevItem2().model}
                zoom={isMobile ? getPrevItem2().zoom * 0.3 : getPrevItem2().zoom * 0.4}
                autoRotate={true}
                modelColor={getPrevItem2().color}
                showShadow={false}
                showLoadingSpinner={true}
                loadingSpinnerStyle="slider"
                containerStyle={{
                  width: '100%',
                  height: '100%',
                  background: 'transparent'
                }}
              />
            </div>
            <h5 className="side-product-title small">{getPrevItem2().parent}</h5>
          </div>

          {/* Bliži lijevi proizvod (veći) */}
          <div 
            className={`side-product left-product-near ${isTransitioning ? 'transitioning' : ''}`}
            onClick={prevSlide}
          >
            <div className="side-model-container with-frame">
              <ModelViewer 
                key={`left-near-${getPrevItem().id}`}
                modelPath={getPrevItem().model}
                zoom={isMobile ? getPrevItem().zoom * 0.4 : getPrevItem().zoom * 0.6}
                autoRotate={true}
                modelColor={getPrevItem().color}
                showShadow={false}
                showLoadingSpinner={true}
                loadingSpinnerStyle="slider"
                containerStyle={{
                  width: '100%',
                  height: '100%',
                  background: 'transparent'
                }}
              />
            </div>
            <h4 className="side-product-title">{getPrevItem().parent}</h4>
          </div>
        </div>

        {/* Glavni proizvod u sredini */}
        <div className={`main-product ${isTransitioning ? 'transitioning' : ''}`}>
          <div className="main-model-container with-main-frame">
            <ModelViewer 
              key={`main-${getCurrentItem().id}`}
              modelPath={getCurrentItem().model}
              zoom={isMobile ? getCurrentItem().zoom * 0.5 : getCurrentItem().zoom * 1.2}
              autoRotate={true}
              modelColor={getCurrentItem().color}
              showShadow={true}
              showLoadingSpinner={true}
              loadingSpinnerStyle="slider"
              containerStyle={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(135deg, 
                  ${getCurrentItem().color}20 0%, 
                  ${getCurrentItem().color}15 25%, 
                  ${getCurrentItem().color}25 50%, 
                  ${getCurrentItem().color}10 75%, 
                  ${getCurrentItem().color}30 100%)`,
                backdropFilter: 'blur(20px)',
                borderRadius: '20px'
              }}
            />
          </div>
          <div className="main-product-info">
            <h2 className="main-product-title">{getCurrentItem().parent}</h2>
            <button 
              className="customize-btn"
              onClick={() => handleCategoryRoute(getCurrentItem().model)}
            >
              Personaliziraj
            </button>
          </div>
        </div>

        {/* Desni proizvodi */}
        <div className="right-side">
          {/* Bliži desni proizvod (veći) */}
          <div 
            className={`side-product right-product-near ${isTransitioning ? 'transitioning' : ''}`}
            onClick={nextSlide}
          >
            <div className="side-model-container with-frame">
              <ModelViewer 
                key={`right-near-${getNextItem().id}`}
                modelPath={getNextItem().model}
                zoom={isMobile ? getNextItem().zoom * 0.4 : getNextItem().zoom * 0.6}
                autoRotate={true}
                modelColor={getNextItem().color}
                showShadow={false}
                showLoadingSpinner={true}
                loadingSpinnerStyle="slider"
                containerStyle={{
                  width: '100%',
                  height: '100%',
                  background: 'transparent'
                }}
              />
            </div>
            <h4 className="side-product-title">{getNextItem().parent}</h4>
          </div>

          {/* Dalji desni proizvod (manji) */}
          <div 
            className={`side-product right-product-far ${isTransitioning ? 'transitioning' : ''}`}
            onClick={nextSlide}
          >
            <div className="side-model-container with-frame">
              <ModelViewer 
                key={`right-far-${getNextItem2().id}`}
                modelPath={getNextItem2().model}
                zoom={isMobile ? getNextItem2().zoom * 0.3 : getNextItem2().zoom * 0.4}
                autoRotate={true}
                modelColor={getNextItem2().color}
                showShadow={false}
                showLoadingSpinner={true}
                loadingSpinnerStyle="slider"
                containerStyle={{
                  width: '100%',
                  height: '100%',
                  background: 'transparent'
                }}
              />
            </div>
            <h5 className="side-product-title small">{getNextItem2().parent}</h5>
          </div>
        </div>

        {/* Strelice za navigaciju */}
        <button className="carousel-arrow prev-arrow" onClick={prevSlide}>
          <ArrowPrevTwo />
        </button>
        <button className="carousel-arrow next-arrow" onClick={nextSlide}>
          <ArrowNextTwo />
        </button>
      </div>

      {/* Dots indikatori */}
      <div className="carousel-dots">
        {carouselData.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      <style jsx>{`
        .product-carousel-container {
          width: 100%;
          padding: 40px 20px;
          margin-bottom: 60px;
        }

        .carousel-wrapper {
          position: relative;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 30px;
          max-width: 1600px;
          margin: 0 auto;
          height: 550px;
          padding-top: 50px;
        }

        .left-side, .right-side {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-top: 80px;
        }

        .main-product {
          flex: 1;
          max-width: 600px;
          height: 500px;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 2;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .main-product.transitioning {
          transform: scale(0.95);
          opacity: 0.8;
        }

        .main-model-container {
          height: 350px;
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          border: 2px solid rgba(255,255,255,0.2);
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .with-main-frame {
          border: 3px solid rgba(255,255,255,0.3);
          box-shadow: 
            0 20px 60px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.2),
            0 0 0 1px rgba(255,255,255,0.1);
        }

        .main-product.transitioning .main-model-container {
          transform: rotateY(10deg) scale(0.95);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .main-product-info {
          padding: 30px 0;
          text-align: center;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .main-product.transitioning .main-product-info {
          transform: translateY(10px);
          opacity: 0.7;
        }

        .main-product-title {
          font-size: 32px;
          font-weight: 700;
          color: #333;
          margin-bottom: 20px;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .customize-btn {
          background: linear-gradient(135deg, #674AD9, #9C88FF);
          color: white;
          border: none;
          padding: 15px 40px;
          border-radius: 30px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .customize-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(103, 74, 217, 0.3);
        }

        .side-product {
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
        }

        .left-product-near, .right-product-near {
          width: 200px;
          height: 280px;
          opacity: 0.8;
        }

        .left-product-far, .right-product-far {
          width: 150px;
          height: 220px;
          opacity: 0.6;
        }

        .side-product.transitioning {
          transform: translateX(0) scale(0.9);
          opacity: 0.4;
        }

        .left-product-near.transitioning, .left-product-far.transitioning {
          transform: translateX(-20px) scale(0.9);
        }

        .right-product-near.transitioning, .right-product-far.transitioning {
          transform: translateX(20px) scale(0.9);
        }

        .left-product-near:hover, .right-product-near:hover {
          opacity: 1;
          transform: translateY(-8px) scale(1.05);
        }

        .left-product-far:hover, .right-product-far:hover {
          opacity: 0.9;
          transform: translateY(-5px) scale(1.1);
        }

        .side-product:hover .with-frame {
          border-color: rgba(255,255,255,0.4);
          box-shadow: 
            0 12px 40px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.25),
            0 0 0 1px rgba(255,255,255,0.1);
        }

        .side-model-container {
          flex: 1;
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .with-frame {
          border: 2px solid rgba(255,255,255,0.25);
          box-shadow: 
            0 8px 32px rgba(0,0,0,0.1),
            inset 0 1px 0 rgba(255,255,255,0.15),
            0 0 0 1px rgba(255,255,255,0.05);
          background: linear-gradient(135deg, 
            rgba(255,255,255,0.15) 0%, 
            rgba(255,255,255,0.05) 100%);
        }

        .side-product.transitioning .side-model-container {
          transform: scale(0.85);
          opacity: 0.6;
        }

        .side-product-title {
          text-align: center;
          margin-top: 15px;
          font-size: 16px;
          font-weight: 600;
          color: #666;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .side-product-title.small {
          font-size: 14px;
          margin-top: 10px;
          color: #888;
        }

        .side-product.transitioning .side-product-title {
          transform: translateY(5px);
          opacity: 0.5;
        }

        .carousel-arrow {
          position: absolute;
          top: 42%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.9);
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 3;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }

        .carousel-arrow:hover {
          background: white;
          transform: translateY(-50%) scale(1.1);
        }

        .prev-arrow {
          left: -25px;
        }

        .next-arrow {
          right: -25px;
        }

        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 30px;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: none;
          background: rgba(103, 74, 217, 0.3);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .dot.active {
          background: #674AD9;
          transform: scale(1.2);
          box-shadow: 0 0 20px rgba(103, 74, 217, 0.4);
        }

        .dot:hover {
          background: rgba(103, 74, 217, 0.6);
          transform: scale(1.1);
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .product-carousel-container {
            padding: 20px 10px;
          }

          .carousel-wrapper {
            height: 420px;
            gap: 10px;
            padding-top: 30px;
          }

          .left-side, .right-side {
            gap: 8px;
            margin-top: 60px;
          }

          .main-product {
            height: 380px;
            max-width: 280px;
          }

          .main-model-container {
            height: 250px;
          }

          .main-product-info {
            padding: 20px 0;
          }

          .left-product-near, .right-product-near {
            width: 100px;
            height: 160px;
          }

          .left-product-far, .right-product-far {
            width: 80px;
            height: 120px;
          }

          .main-product-title {
            font-size: 20px;
            margin-bottom: 15px;
          }

          .customize-btn {
            padding: 10px 25px;
            font-size: 14px;
          }

          .side-product-title {
            font-size: 12px;
            margin-top: 10px;
          }

          .side-product-title.small {
            font-size: 10px;
            margin-top: 8px;
          }

          .carousel-arrow {
            width: 35px;
            height: 35px;
            top: 40%;
          }

          .prev-arrow {
            left: -15px;
          }

          .next-arrow {
            right: -15px;
          }

          .carousel-dots {
            margin-top: -5px;
          }

          .dot {
            width: 10px;
            height: 10px;
          }
        }

        @media (max-width: 480px) {
          .product-carousel-container {
            padding: 15px 5px;
          }

          .carousel-wrapper {
            height: 350px;
            gap: 8px;
            padding-top: 20px;
          }

          .left-side, .right-side {
            margin-top: 50px;
          }

          .main-product {
            height: 320px;
            max-width: 220px;
          }

          .main-model-container {
            height: 200px;
          }

          .main-product-info {
            padding: 15px 0;
          }

          .left-product-far, .right-product-far {
            display: none;
          }

          .left-product-near, .right-product-near {
            width: 80px;
            height: 130px;
          }

          .main-product-title {
            font-size: 18px;
            margin-bottom: 12px;
          }

          .customize-btn {
            padding: 8px 20px;
            font-size: 12px;
          }

          .side-product-title {
            font-size: 10px;
            margin-top: 8px;
          }

          .carousel-arrow {
            width: 30px;
            height: 30px;
            top: 38%;
          }

          .prev-arrow {
            left: -10px;
          }

          .next-arrow {
            right: -10px;
          }

          .carousel-dots {
            margin-top: -8px;
            gap: 8px;
          }

          .dot {
            width: 8px;
            height: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductCarousel;