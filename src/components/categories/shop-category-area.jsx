import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ModelViewer from "@/components/ModelViewer";
import ProductCarousel from "@/components/carousel/product-carousel";

// Hardkodirane kategorije za gift shop sa modelima i fiksnim bojama
// gridArea: row-start / col-start / row-end / col-end
// Layout tačno kao na slici - bento grid 4 kolone x 3 reda
const hardcoded_categories = [
  { id: 1, parent: 'Majice', products_count: 5, model: '/shirt/scene.gltf', zoom: 2.5, color: '#00008B', gridArea: '1 / 8 / 7 / 11' }, // 3 reda, do kraja grida (zamijenio sa Olovkama)
  { id: 2, parent: 'Kape', products_count: 3, model: '/cap/scene.gltf', zoom: 1.5, color: '#000000', gridArea: '1 / 1 / 6 / 3' }, // 2.5 reda, 2 kolone (zamijenio sa Olovkama)
  { id: 3, parent: 'Šolje', products_count: 4, model: '/cup/scene.gltf', zoom: 0.15, color: '#FFFFFF', gridArea: '6 / 1 / 9 / 3' }, // 1.5 reda, 2 kolone (zamijenio sa Kesicama)
  { id: 4, parent: 'Olovke', products_count: 6, model: '/pen/scene.gltf', zoom: 0.1, color: '#FF0000', gridArea: '1 / 3 / 3 / 6' }, // 1 red, 3 kolone (zamijenio sa Kapama)
  { id: 5, parent: 'Kesice i Cekeri', products_count: 3, model: '/bag/scene.gltf', zoom: 1.25, color: '#D2B48C', gridArea: '4 / 6 / 7 / 8' }, // 1.5 reda, 1.5 kolone (zamijenio sa Šoljama)
  { id: 6, parent: 'Privjesci', products_count: 2, model: '/pendants/scene.gltf', zoom: 4, color: '#FF8C00', gridArea: '3 / 3 / 5 / 6' }, // 1 red, 3 kolone (pomjereno desno)
  { id: 7, parent: 'Bedževi', products_count: 2, model: '/badge/scene.gltf', zoom: 0.3, color: '#FFFF00', gridArea: '1 / 6 / 4 / 8' }, // 1.5 reda, 1.5 kolone
  { id: 8, parent: 'Upaljači', products_count: 1, model: '/lighter/scene.gltf', zoom: 0.008, color: '#800080', gridArea: '5 / 3 / 7 / 6' }, // 1 red, 1.5 kolone (pomjereno desno)
  { id: 9, parent: 'Rokovnici', products_count: 1, model: '/agenda/scene.gltf', zoom: 0.01024, color: '#008000', gridArea: '7 / 3 / 9 / 11' }, // Zadnji red, 8 kolona (pomjereno desno)
];

const ShopCategoryArea = ({ showTitle = true, showCarousel = true }) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Provjeri veličinu ekrana
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // handle category route - otvori editor sa odabranim modelom
  const handleCategoryRoute = (model) => {
    router.push(`/editor?model=${encodeURIComponent(model)}&fromCategory=true`);
  };

  // Koristi hardkodirane kategorije umjesto API-ja
  const category_items = hardcoded_categories;
  
  return (
    <>
      <section className="tp-category-area pb-120">
        <div className="container">
          {/* Naslov sekcije - prikazuje se samo ako je showTitle true */}
          {showTitle && (
            <div style={{
              textAlign: 'center',
              marginBottom: '40px'
            }}>
              <h2 style={{
                fontSize: isMobile ? '28px' : '36px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #674AD9, #9C88FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '12px'
              }}>
                Personaliziraj Proizvode
              </h2>
              <p style={{
                fontSize: isMobile ? '16px' : '18px',
                color: '#6c757d',
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                Odaberi kategoriju i kreiraj jedinstvene proizvode prema svojoj želji
              </p>
            </div>
          )}

          {/* 3D Carousel Slider */}
          {showCarousel && <ProductCarousel />}

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : '1.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 0.5fr 1fr 0.8fr 0.2fr',
            gridTemplateRows: isMobile ? 'repeat(6, 120px)' : 'repeat(8, 82.5px)',
            gap: isMobile ? '12px' : '15px',
            background: '#ffffff',
            padding: isMobile ? '12px' : '20px'
          }}>
            {category_items.map((item) => {
              // Mobile grid areas (3 kolone x 6 redova) - tačno kao na slici
              const mobileGridAreas = {
                1: '1 / 1 / 3 / 3', // Majice - velika lijevo (2x2) - red 1-2, kolone 1-2
                2: '1 / 3 / 2 / 4', // Kape - mala gore desno - red 1, kolona 3
                3: '2 / 3 / 3 / 4', // Šolje - mala sredina desno - red 2, kolona 3
                4: '3 / 1 / 4 / 4', // Olovke - široka (3 kolone) - red 3, sve kolone
                5: '2 / 2 / 3 / 3', // Kesice - mala sredina - red 2, kolona 2
                6: '4 / 3 / 5 / 4', // Privjesci - mala - red 4, kolona 3
                7: '4 / 1 / 5 / 3', // Bedževi - široka dolje (2 kolone) - red 4, kolone 1-2
                8: '5 / 2 / 7 / 4', // Upaljači - velika sredina (2x2) - red 5-6, kolone 2-3
                9: '4 / 3 / 5 / 4', // Rokovnici - mala desno - red 4, kolona 3
              };
              
              // Dodaj dodatne pozicije za kompletan layout
              if (isMobile) {
                // Koristimo postojeće elemente za dodatne pozicije
                if (item.id === 5) mobileGridAreas[5] = '5 / 1 / 6 / 2'; // Kesice red 5 lijevo
                if (item.id === 6) mobileGridAreas[6] = '6 / 1 / 7 / 2'; // Privjesci red 6 lijevo
              };
              
              const gridArea = isMobile ? mobileGridAreas[item.id] : item.gridArea;
              
              return (
                <div
                  key={item.id}
                  className="category-card"
                  style={{ 
                    gridArea: gridArea,
                    background: `linear-gradient(135deg, 
                      ${item.color}20 0%, 
                      ${item.color}15 25%, 
                      ${item.color}25 50%, 
                      ${item.color}10 75%, 
                      ${item.color}30 100%)`,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${item.color}30`,
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: '16px',
                    border: '2px solid rgba(255,255,255,0.2)',
                    boxShadow: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backdropFilter: 'blur(10px)',
                    animation: `fadeInUp 0.6s ease-out ${item.id * 0.1}s both`
                  }}
                  onClick={() => handleCategoryRoute(item.model)}
                  onMouseEnter={() => !isMobile && setHoveredCard(item.id)}
                  onMouseLeave={() => !isMobile && setHoveredCard(null)}
                >
                {/* 3D Model Background */}
                <div 
                  className="model-container"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                    opacity: 0.8,
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: !isMobile && hoveredCard === item.id ? 'scale(1.3)' : 'scale(1)'
                  }}>
                  <ModelViewer 
                    key={`${item.id}-${isMobile ? 'mobile' : 'desktop'}`}
                    modelPath={item.model} 
                    zoom={isMobile ? (
                      item.id === 1 ? item.zoom * 0.5 : // Majice - odzumirano
                      item.id === 2 ? item.zoom * 0.5 : // Kape - odzumirano isto kao majice
                      item.id === 3 ? item.zoom * 0.5 : // Šolje - odzumirano isto kao majice
                      item.id === 4 ? item.zoom * 0.5 : // Olovke - odzumirano isto kao majice
                      item.id === 5 ? item.zoom * 0.5 : // Kesice - odzumirano isto kao majice
                      item.id === 6 ? item.zoom * 0.5 : // Privjesci - odzumirano isto kao majice
                      item.id === 7 ? item.zoom * 0.5 : // Bedževi - odzumirano isto kao majice
                      item.id === 8 ? item.zoom * 0.5 : // Upaljači - odzumirano isto kao majice
                      item.zoom * 0.5 // Rokovnici i ostali - odzumirano isto kao majice
                    ) : item.zoom} // Desktop: koristimo osnovni zoom, hover efekat će biti preko CSS transform
                    autoRotate={true} 
                    modelColor={item.color} 
                    showShadow={false}
                    showLoadingSpinner={true}
                    loadingSpinnerStyle="slider"
                    onModelLoad={(path) => console.log(`Category model loaded: ${path}`)} 
                    verticalOffset={item.model.includes('/badge/') ? 0.9 : item.model.includes('/agenda/') ? 0.5 : 0} 
                    rotationX={item.model.includes('/agenda/') ? Math.PI / 2 : 0}
                    containerStyle={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'transparent'
                    }}
                  />
                </div>

                {/* Ikona u desnom uglu */}
                <div style={{
                  position: "absolute",
                  top: '12px',
                  right: '12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 3,
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <span style={{
                    fontSize: '16px',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                  }}>
                    {item.id === 1 ? '👕' : 
                     item.id === 2 ? '🧢' : 
                     item.id === 3 ? '☕' : 
                     item.id === 4 ? '✏️' : 
                     item.id === 5 ? '🎒' : 
                     item.id === 6 ? '🔗' : 
                     item.id === 7 ? '🏷️' : 
                     item.id === 8 ? '🔥' : '📔'}
                  </span>
                </div>

                {/* Popularni bedž za neke kategorije */}
                {[1, 2, 3].includes(item.id) && (
                  <div style={{
                    position: "absolute",
                    top: '12px',
                    left: '12px',
                    background: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
                    color: 'white',
                    borderRadius: '15px',
                    padding: '3px 8px',
                    fontSize: '10px',
                    fontWeight: '600',
                    zIndex: 3,
                    boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)'
                  }}>
                    POPULARNO
                  </div>
                )}

                {/* Content Overlay */}
                <div style={{
                  position: "absolute",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  height: "100%",
                  width: "100%",
                  bottom: 0,
                  left: 0,
                  padding: '12px',
                  background: 'linear-gradient(transparent 0%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.5) 100%)'
                }}>
                  {/* Naziv kategorije lijevo */}
                  <h3 style={{
                    color: "white",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                    margin: 0,
                    fontSize: isMobile ? '14px' : '16px',
                    fontWeight: '600',
                    letterSpacing: '0.3px'
                  }}>
                    {item.parent}
                  </h3>
                  
                  {/* Dugme "Uredi" desno */}
                  <button style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '15px',
                    padding: isMobile ? '4px 8px' : '6px 12px',
                    fontSize: isMobile ? '10px' : '11px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textTransform: 'capitalize',
                    letterSpacing: '0.3px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'scale(1)';
                  }}>
                    Uredi
                  </button>
                </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* CSS Animacije i ModelViewer stilovi */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        /* Liquid Glass Effect */
        .category-card {
          position: relative;
          overflow: hidden !important;
        }
        
        .category-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, 
            rgba(255,255,255,0.1) 0%, 
            transparent 50%, 
            rgba(255,255,255,0.05) 100%);
          pointer-events: none;
          z-index: 1;
        }
        
        .category-card::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, 
            rgba(255,255,255,0.1) 0%, 
            transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 1;
        }
        
        .category-card:hover::after {
          opacity: 1;
        }
        
        .model-container {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          overflow: hidden !important;
        }
        
        .model-container > div {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
        }
        
        .model-container canvas {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          object-fit: contain !important;
        }
        
        @media (max-width: 768px) {
          .model-container canvas {
            width: 120% !important;
            height: 120% !important;
            max-width: 120% !important;
            max-height: 120% !important;
            object-fit: cover !important;
          }
          
          .model-container {
            overflow: visible !important;
          }
        }
      `}</style>
    </>
  );
};

export default ShopCategoryArea;
