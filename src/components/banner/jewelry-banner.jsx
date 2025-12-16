import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import ModelViewer from '@/components/ModelViewer';
// internal - slike uklonjene, koristimo samo 3D modele
// nav icon
import nav_icon_1 from '@assets/img/slider/4/nav/icon-1.png';
import nav_icon_2 from '@assets/img/slider/4/nav/icon-2.png';
import nav_icon_3 from '@assets/img/slider/4/nav/icon-3.png';
import nav_icon_4 from '@assets/img/slider/4/nav/icon-4.png';
import { ArrowNextTwo, ArrowPrevTwo, Pause, Play } from '@/svg';
import text_shape from '@assets/img/slider/4/shape/rounded-test.png';
import Link from 'next/link';
import { useRouter } from 'next/router';

// slider data sa 3D modelima - bez slika (smanjeni zoom faktori)
const slider_data = [
  { subtitle: 'Personaliziraj svoje', title: 'Majice', model: '/shirt/scene.gltf', zoom: 2.0, color: '#00008B' },
  { subtitle: 'Personaliziraj svoje', title: 'Šolje', model: '/cup/scene.gltf', zoom: 0.12, color: '#FFFFFF' },
  { subtitle: 'Personaliziraj svoje', title: 'Kese i Cekere', model: '/bag/scene.gltf', zoom: 1.0, color: '#D2B48C' },
  { subtitle: 'Personaliziraj svoje', title: 'Olovke', model: '/pen/scene.gltf', zoom: 0.08, color: '#FF0000' },
]

// slider nav data
const slider_nav_data = [
  { icon: nav_icon_1, title: 'Majice' },
  { icon: nav_icon_2, title: 'Šolje' },
  { icon: nav_icon_3, title: 'Kese i Cekeri' },
  { icon: nav_icon_4, title: 'Olovke' }
]

const JewelryBanner = () => {
  const router = useRouter();
  const [slider1, setSlider1] = useState(null);
  const [slider2, setSlider2] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [modelLoadErrors, setModelLoadErrors] = useState(new Set());

  // Handle category route - otvori editor sa odabranim modelom
  const handleCategoryRoute = (model) => {
    router.push(`/editor?model=${encodeURIComponent(model)}&fromCategory=true`);
  };

  // Force re-render kada se slider promijeni
  useEffect(() => {
    if (slider1) {
      slider1.slickGoTo(0);
    }
  }, [slider1]);

  // Handle model load errors
  const handleModelLoadError = (modelPath) => {
    setModelLoadErrors(prev => new Set([...prev, modelPath]));
  };

  const handleModelLoadSuccess = (modelPath) => {
    setModelLoadErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(modelPath);
      return newSet;
    });
  };

  //  slider setting 
  const main_slider_setting = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    centerMode: false,
    afterChange: (index) => setCurrentSlide(index),
  }
  // nav slider setting 
  const nav_slider_setting = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    vertical: true,
    dots: false,
    arrows: false,
    centerMode: false,
    focusOnSelect: true,
  }

  // 
  const [play, setPlay] = useState(false);

  const handleToggle = () => {
    if (play === false) {
      setPlay(true);
      const videos = document.querySelectorAll('.tp-slider-video video');
      videos.forEach((video) => video.play());
    } else {
      setPlay(false);
      const videos = document.querySelectorAll('.tp-slider-video video');
      videos.forEach((video) => video.pause());
    }
  };
  return (
    <>
      <section className="tp-slider-area p-relative z-index-1 fix">
        <Slider {...main_slider_setting} asNavFor={slider2} ref={(slider) => setSlider1(slider)} className="tp-slider-active-4 khaki-bg">
          {slider_data.map((item, i) => (
            <div key={i} className="tp-slider-item-4 tp-slider-height-4 p-relative khaki-bg d-flex align-items-center" >
                <div className="tp-slider-thumb-4">
                {/* Samo 3D Model - bez slika */}
                <div className="tp-slider-3d-model">
                  <ModelViewer 
                    key={`hero-${i}-${item.title}`}
                    modelPath={item.model} 
                    zoom={item.zoom} 
                    autoRotate={true} 
                    modelColor={item.color} 
                    showShadow={!item.model.includes('/pen/')}
                    disableInteraction={true}
                    showLoadingSpinner={true}
                    loadingSpinnerStyle="slider"
                    containerStyle={{
                      width: '100%',
                      height: '100%',
                      background: 'transparent'
                    }}
                    onModelLoad={(path) => {
                      console.log(`Hero model loaded: ${path}`);
                      handleModelLoadSuccess(path);
                    }}
                    onModelError={(path) => {
                      console.error(`Hero model failed: ${path}`);
                      handleModelLoadError(path);
                    }}
                  />
                </div>
                <div className="tp-slider-thumb-4-shape">
                  <span className="tp-slider-thumb-4-shape-1"></span>
                  <span className="tp-slider-thumb-4-shape-2"></span>
                </div>
                </div>

              <div className="tp-slider-video-wrapper">
                {/* <!-- video --> */}
                <div className={`tp-slider-video transition-3 ${play?'full-width':''}`}>

                  <video loop>
                    <source type="video/mp4" src="http://weblearnbd.net/tphtml/videos/shofy/jewellery-1.mp4#t=3" />
                  </video>
                </div>
                {/* <!-- video button --> */}
                <div className="tp-slider-play">

                  <button onClick={handleToggle} type="button" className={`tp-slider-play-btn tp-slider-video-move-btn tp-video-toggle-btn ${play?'hide':''}`}>
                    <Image className="text-shape" src={text_shape} alt="text shape" priority />
                    <span className="play-icon">
                      <Play/>
                    </span>
                    <span className="pause-icon">
                      <Pause/>
                    </span>
                  </button>
                </div>
              </div>

              <div className="container">
                <div className="row align-items-center">
                  <div className="col-12">
                    <div className="tp-slider-content-4 p-relative z-index-1" style={{
                      textAlign: 'left',
                      maxWidth: 'none',
                      paddingLeft: '0',
                      marginLeft: '0',
                      paddingRight: '0',
                      marginRight: '0',
                      width: '100%'
                    }}>
                      <span>{item.subtitle}</span>
                      <h3 className="tp-slider-title-4">{item.title}</h3>
                      <div className="tp-slider-btn-4">
                        <button 
                          onClick={() => handleCategoryRoute(item.model)}
                          className="tp-btn tp-btn-border tp-btn-border-white"
                        >
                          Uredi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        {/* arrow start */}
        <div className="tp-slider-arrow-4">
          <button className="tp-slider-3-button-prev slick-arrow" onClick={() => slider1?.slickPrev()}>
            <ArrowPrevTwo/>
          </button>
          <button className="tp-slider-3-button-next slick-arrow" onClick={() => slider1?.slickNext()}>
            <ArrowNextTwo/>
          </button>
          </div>
        {/* arrow end */}

        <div className="tp-slider-nav">

          <Slider {...nav_slider_setting} asNavFor={slider1} ref={(slider) => setSlider2(slider)} className="tp-slider-nav-active">
            {slider_nav_data.map((item, i) => (
              <div key={i} className="tp-slider-nav-item d-flex align-items-center">
                <div className="tp-slider-nav-icon">
                  <span>
                    <Image src={item.icon} alt="icon" />
                  </span>
                </div>
                <div className="tp-slider-nav-content">
                  <h3 className="tp-slider-nav-title">{item.title}</h3>
                </div>
              </div>
            ))}
          </Slider>

        </div>
      </section>
      
      {/* CSS stilovi za 3D modele u hero sekciji */}
      <style jsx>{`
        .tp-slider-thumb-4 {
          position: relative !important;
          width: 100% !important;
          height: 100% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        
        .tp-slider-3d-model {
          width: 100% !important;
          height: 100% !important;
          position: relative !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          pointer-events: auto !important;
          transform: translateY(50px) translateX(150px) scale(1.5) !important;
          margin-left: 0 !important;
        }
        
        .tp-slider-3d-model > div {
          width: 100% !important;
          height: 100% !important;
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
        }
        
        /* Ukloni pozadinu iz svih child elemenata */
        .tp-slider-3d-model * {
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
        }
        
        /* Prilagodi visinu za različite ekrane i povećaj modele */
        @media (max-width: 576px) {
          .tp-slider-3d-model {
            min-height: 350px !important;
            width: 90% !important;
            height: 90% !important;
            transform: translateY(160px) translateX(90px) scale(1.35) !important;
            margin-left: -5% !important;
          }
        }
        
        @media (min-width: 577px) and (max-width: 768px) {
          .tp-slider-3d-model {
            min-height: 450px !important;
            width: 95% !important;
            height: 95% !important;
            transform: translateY(100px) translateX(120px) scale(1.4) !important;
            margin-left: -7.5% !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .tp-slider-3d-model {
            min-height: 600px !important;
            width: 100% !important;
            height: 100% !important;
            transform: translateY(50px) translateX(150px) scale(1.5) !important;
            margin-left: -10% !important;
          }
        }
        
        @media (min-width: 1025px) {
          .tp-slider-3d-model {
            min-height: 750px !important;
            width: 110% !important;
            height: 110% !important;
            transform: translateY(60px) translateX(180px) scale(1.6) !important;
            margin-left: -15% !important;
          }
        }
        
        /* Agresivno uklanjanje svih pozadina */
        .tp-slider-item-4,
        .tp-slider-item-4.khaki-bg,
        .tp-slider-active-4,
        .tp-slider-active-4.khaki-bg,
        .tp-slider-thumb-4,
        .tp-slider-thumb-4-shape,
        .tp-slider-thumb-4-shape-1,
        .tp-slider-thumb-4-shape-2,
        .tp-slider-3d-model,
        .khaki-bg {
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
        }
        
        /* Ukloni sve moguće pozadine iz section-a */
        .tp-slider-area {
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
        }
        
        /* Osiguraj da se 3D model prikazuje preko shape elemenata */
        .tp-slider-thumb-4-shape {
          z-index: 1 !important;
        }
        
        .tp-slider-3d-model {
          z-index: 2 !important;
          pointer-events: none !important;
        }
        
        /* Omogući skrolovanje preko 3D modela u hero sekciji i ukloni pozadinu */
        .tp-slider-3d-model canvas {
          pointer-events: none !important;
          background: transparent !important;
          background-color: transparent !important;
        }
        
        /* Ukloni pozadinu iz WebGL canvas-a */
        canvas {
          background: transparent !important;
          background-color: transparent !important;
        }
        
        /* Forsirano pozicioniranje teksta lijevo u ravni sa navigation */
        .tp-slider-content-4 {
          position: absolute !important;
          left: 250px !important;
          top: 40% !important;
          transform: translateY(-50%) !important;
          text-align: left !important;
          padding: 0 !important;
          margin: 0 !important;
          width: auto !important;
          max-width: none !important;
          z-index: 10 !important;
        }
        
        .tp-slider-content-4 span,
        .tp-slider-content-4 .tp-slider-title-4 {
          text-align: left !important;
          margin-left: 0 !important;
          padding-left: 0 !important;
        }
        
        /* Override postojećih stilova */
        .tp-slider-item-4 .container {
          padding-left: 15px !important;
          padding-right: 15px !important;
        }
        
        .tp-slider-item-4 .row {
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        
        .tp-slider-item-4 .col-12 {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        
        /* Responsive pozicioniranje teksta */
        @media (max-width: 576px) {
          .tp-slider-content-4 {
            left: 15px !important;
            top: 35% !important;
          }
        }
        
        @media (min-width: 577px) and (max-width: 768px) {
          .tp-slider-content-4 {
            left: 20px !important;
            top: 38% !important;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .tp-slider-content-4 {
            left: 250px !important;
            top: 50% !important;
          }
        }
        
        @media (min-width: 1025px) {
          .tp-slider-content-4 {
            left: 270px !important;
            top: 50% !important;
          }
        }
        
        /* Pozicioniranje navigacije bliže naslovu na desktop verziji */
        .tp-slider-nav {
          position: absolute !important;
          z-index: 15 !important;
        }
        
        @media (min-width: 769px) {
          .tp-slider-nav {
            top: 70% !important;
            left: 270px !important;
          }
        }
        
        @media (min-width: 1025px) {
          .tp-slider-nav {
            top: 65% !important;
            left: 270px !important;
          }
        }
      `}</style>
    </>
  );
};

export default JewelryBanner;
