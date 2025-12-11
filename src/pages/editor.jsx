"use client";
import Script from "next/script";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const ModelViewer = dynamic(() => import("@/components/ModelViewer"), { ssr: false });

export default function Editor() {
  const router = useRouter();
  const [modelPath, setModelPath] = useState('/cap/scene.gltf');
  const [editorReady, setEditorReady] = useState(false);
  
  // Čekaj da router bude spreman prije čitanja query parametra
  useEffect(() => {
    if (router.isReady) {
      const { model, fromCategory } = router.query;
      if (model) {
        setModelPath(model);
      }
      // Refresh stranice jednom kada dolazi sa shop-category
      if (fromCategory === 'true' && typeof window !== 'undefined') {
        // Ukloni fromCategory iz URL-a i refreshaj
        const newUrl = `/editor?model=${encodeURIComponent(model || '/cap/scene.gltf')}`;
        window.location.href = newUrl;
      }
    }
  }, [router.isReady, router.query]);

  // Inicijaliziraj editor kada se komponenta mountuje
  useEffect(() => {
    // Resetuj flag da omogući reinicijalizaciju
    window.editorInitialized = false;
    
    const initEditor = () => {
      if (window.initEditorFunctions) {
        window.initEditorFunctions();
        setEditorReady(true);
      }
    };
    
    // Čekaj da jQuery bude spreman
    const checkAndInit = () => {
      if (window.$ && window.$.fn && window.$.fn.draggable && window.$.fn.resizable) {
        initEditor();
      } else {
        setTimeout(checkAndInit, 50);
      }
    };
    
    checkAndInit();
    
    // Cleanup - resetuj flag kada se komponenta unmountuje
    return () => {
      window.editorInitialized = false;
    };
  }, []);
  
  return (
    <div className="designer-area fs" style={{ display: "block" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Sofia&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/html/assets/css/vendor/bootstrap.min.css" />
      <link rel="stylesheet" href="/html/assets/css/vendor/animate.min.css" />
      <link rel="stylesheet" href="/html/assets/css/plugins/swiper.min.css" />
      <link rel="stylesheet" href="/html/assets/css/vendor/magnific-popup.css" />
      <link rel="stylesheet" href="/html/assets/css/vendor/fontawesome-pro.css" />
      <link rel="stylesheet" href="/html/assets/css/vendor/spacing.css" />
      <link rel="stylesheet" href="/html/assets/css/vendor/custom-font.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <link rel="stylesheet" href="/html/assets/css/main.css" />
      <div className="container">
        <div className="designer-topbar d-flex align-items-center justify-content-between">
          <div className="left d-flex gap-10 position-relative d-none d-lg-flex">
            <button id="btn-back" className="rr-btn icon-btn"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#fff" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></button>
          </div>
          <div className="middle d-flex align-items-center gap-10">
            <button id="btn-undo" className="rr-btn icon-btn"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#fff" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6a6 6 0 0 1-6 6c-1.65 0-3.15-.67-4.24-1.76l-1.42 1.42A7.963 7.963 0 0 0 12 21a8 8 0 0 0 8-8c0-4.42-3.58-8-8-8z"/></svg></button>
            <button id="btn-redo" className="rr-btn icon-btn"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#fff" d="M12 5c-4.42 0-8 3.58-8 8a8 8 0 0 0 13.66 5.66l-1.42-1.42A6 6 0 0 1 12 19c-3.31 0-6-2.69-6-6a6 6 0 0 1 6-6v4l5-5-5-5v4z"/></svg></button>
            <button id="btn-reset" className="rr-btn icon-btn d-none d-lg-flex"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#fff" d="M12 6V3L8 7l4 4V8c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5H5c0 3.86 3.14 7 7 7s7-3.14 7-7-3.14-7-7-7z"/></svg></button>
            <button id="btn-zoom-in" className="rr-btn icon-btn"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#fff" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm1-8h-2v2H6v2h2v2h2v-2h2V8h-2z"/></svg></button>
            <button id="btn-zoom-out" className="rr-btn icon-btn"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#fff" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"/></svg></button>
          </div>
          <div className="right d-none d-lg-flex gap-10">
            <button id="btn-download" className="rr-btn icon-btn"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#fff" d="M5 20h14v-2H5v2zm7-18l-5 5h3v6h4V7h3l-5-5z"/></svg></button>
            <button id="btn-print" className="rr-btn icon-btn"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#fff" d="M19 8H5c-1.66 0-3 1.34-3 3v4h4v4h12v-4h4v-4c0-1.66-1.34-3-3-3zm-3 9H8v-5h8v5zm3-9V3H5v5h14z"/></svg></button>
          </div>
          <div className="mobile-bar d-flex align-items-center gap-10">
            <button id="m-back" className="rr-btn icon-btn"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#fff" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></button>
            <button id="m-more" className="rr-btn icon-btn"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#fff" d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg></button>
            <button id="m-menu" className="rr-btn icon-btn"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#fff" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg></button>
            <div id="m-menu-dd" className="menu-dropdown" style={{ display: "none" }}>
              <button className="dropdown-item" data-action="download"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#333" d="M5 20h14v-2H5v2zm7-18l-5 5h3v6h4V7h3l-5-5z"/></svg> Download</button>
              <button className="dropdown-item" data-action="print"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#333" d="M19 8H5c-1.66 0-3 1.34-3 3v4h4v4h12v-4h4v-4c0-1.66-1.34-3-3-3zm-3 9H8v-5h8v5zm3-9V3H5v5h14z"/></svg> Print</button>
            </div>
            <div id="m-tools-dd" className="menu-dropdown" style={{ display: "none" }}>
              <button className="dropdown-item" data-action="undo"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#333" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6a6 6 0 0 1-6 6c-1.65 0-3.15-.67-4.24-1.76l-1.42 1.42A7.963 7.963 0 0 0 12 21a8 8 0 0 0 8-8c0-4.42-3.58-8-8-8z"/></svg> Undo</button>
              <button className="dropdown-item" data-action="redo"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#333" d="M12 5c-4.42 0-8 3.58-8 8a8 8 0 0 0 13.66 5.66l-1.42-1.42A6 6 0 0 1 12 19c-3.31 0-6-2.69-6-6a6 6 0 0 1 6-6v4l5-5-5-5v4z"/></svg> Redo</button>
              <button className="dropdown-item" data-action="reset"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#333" d="M12 6V3L8 7l4 4V8c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5H5c0 3.86 3.14 7 7 7s7-3.14 7-7-3.14-7-7-7z"/></svg> Reset</button>
              <button className="dropdown-item" data-action="zoom-in"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#333" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm1-8h-2v2H6v2h2v2h2v-2h2V8h-2z"/></svg> Zoom In</button>
              <button className="dropdown-item" data-action="zoom-out"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#333" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"/></svg> Zoom Out</button>
            </div>
          </div>
        </div>
        <div className="row" style={{ margin: 0 }}>
          <div className="col-xl-4 col-lg-5" style={{ padding: 0 }}>
            <div className="design-sidebar">
              <div className="designer-box">
                <div className="designer-nav">
                  <button className="tab-btn" data-tab="tab-designs"><span className="tab-icon"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="#333"/></svg></span><span className="tab-label">Graphics</span></button>
                  <button className="tab-btn" data-tab="tab-layers"><span className="tab-icon"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2l9 4-9 4-9-4 9-4zm0 7l9 4-9 4-9-4 9-4zm0 7l9 4-9 4-9-4 9-4z" fill="#333"/></svg></span><span className="tab-label">Layers</span></button>
                  <button className="tab-btn" data-tab="tab-text-layers"><span className="tab-icon"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M5 4v3h5v12h3V7h6V4H5z" fill="#333"/></svg></span><span className="tab-label">Text Layers</span></button>
                  <button className="tab-btn" data-tab="tab-colors"><span className="tab-icon"><svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="#333"/></svg></span><span className="tab-label">Colors</span></button>
                </div>
                <div className="designer-content">
                  <div id="tab-designs" className="tab-pane">
                    <div className="tab-header">
                      <span className="tab-title">Graphics</span>
                      <button className="tab-close-btn" data-close-tab="tab-designs">Done</button>
                    </div>
                    <div>
                      <button id="btn-browse" className="rr-btn btn-add-photo"><svg width="16" height="16" viewBox="0 0 24 24"><path fill="#fff" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg><span>Add Photo</span></button>
                    </div>

                    <input id="design-upload" type="file" accept="image/*" className="form-control" style={{ display: 'none' }} />
                    <div id="design-canvas" className="design-canvas-inline" style={{ width: '100%', height: '300px', position: 'relative', background: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px), rgba(255,255,255,0.1)', backgroundSize: '20px 20px', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                    </div>
                    <div className="design-controls">
                      <div className="control-row">
                        <label className="control-label"><svg width="14" height="14" viewBox="0 0 24 24"><path fill="#fff" d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3h-6zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3v6zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6h6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6v-6z"/></svg></label>
                        <input type="range" id="design-scale" min="10" max="100" defaultValue="30" className="liquid-range" />
                        <span id="design-scale-value" className="control-value">30%</span>
                      </div>
                      <div className="control-row">
                        <label className="control-label"><svg width="14" height="14" viewBox="0 0 24 24"><path fill="#fff" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg></label>
                        <input type="range" id="design-rotation" min="0" max="360" defaultValue="0" className="liquid-range" />
                        <span id="design-rotation-value" className="control-value">0°</span>
                      </div>
                      <div className="control-buttons">
                        <button id="btn-reset-design" className="rr-btn btn-reset-design"><svg width="14" height="14" viewBox="0 0 24 24"><path fill="#fff" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg><span>Reset</span></button>
                        <button id="btn-remove-layer" className="rr-btn btn-remove-layer"><svg width="14" height="14" viewBox="0 0 24 24"><path fill="#ff6b6b" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg><span>Remove</span></button>
                      </div>
                    </div>
                  </div>
                  <div id="tab-layers" className="tab-pane">
                    <div className="tab-header">
                      <span className="tab-title">Layers</span>
                      <button className="tab-close-btn" data-close-tab="tab-layers">Done</button>
                    </div>
                    <div id="layers-panel" className="layers-panel mb-10"></div>
                  </div>
                  <div id="tab-text-layers" className="tab-pane">
                    <div className="tab-header">
                      <span className="tab-title">Text</span>
                      <button className="tab-close-btn" data-close-tab="tab-text-layers">Done</button>
                    </div>
                    <div className="text-input-row">
                      <input id="text-input" type="text" className="form-control" placeholder="Unesite tekst" />
                      <button id="btn-add-text" className="rr-btn btn-add-text-inline"><svg width="14" height="14" viewBox="0 0 24 24"><path fill="#fff" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg><span>Add Text</span></button>
                    </div>
                    <div id="text-canvas" className="design-canvas-inline" style={{ width: '100%', height: '300px', position: 'relative', background: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px), rgba(255,255,255,0.1)', backgroundSize: '20px 20px', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                    </div>
                    <div className="text-controls-box">
                      <div className="text-controls-row">
                        <input id="text-color" type="color" defaultValue="#111111" title="Boja" className="liquid-color-input" />
                        <select id="text-font" className="liquid-select">
                          <option value="Arial, sans-serif">Arial</option>
                          <option value="'Times New Roman', serif">Times New Roman</option>
                          <option value="Georgia, serif">Georgia</option>
                          <option value="Tahoma, sans-serif">Tahoma</option>
                          <option value="'Courier New', monospace">Courier New</option>
                        </select>
                        <input id="text-size" type="number" min={8} max={120} defaultValue={24} title="Veličina" className="liquid-number-input" />
                        <button id="btn-bold" className="rr-btn liquid-btn">B</button>
                      </div>
                    </div>
                  </div>
                  <div id="tab-colors" className="tab-pane">
                    <div className="tab-header">
                      <span className="tab-title">Colors</span>
                      <button className="tab-close-btn" data-close-tab="tab-colors">Done</button>
                    </div>
                    <div className="colors-palette">
                      <div className="color-item"><span className="color-name">White</span><button className="color-btn" data-color="#d1d1cf" style={{ backgroundColor: '#d1d1cf', border: '2px solid #ddd' }}></button></div>
                      <div className="color-item"><span className="color-name">Black</span><button className="color-btn" data-color="#000000" style={{ backgroundColor: '#000000' }}></button></div>
                      <div className="color-item"><span className="color-name">Red</span><button className="color-btn" data-color="#FF0000" style={{ backgroundColor: '#FF0000' }}></button></div>
                      <div className="color-item"><span className="color-name">Blue</span><button className="color-btn" data-color="#0000FF" style={{ backgroundColor: '#0000FF' }}></button></div>
                      <div className="color-item"><span className="color-name">Green</span><button className="color-btn" data-color="#00FF00" style={{ backgroundColor: '#00FF00' }}></button></div>
                      <div className="color-item"><span className="color-name">Yellow</span><button className="color-btn" data-color="#FFFF00" style={{ backgroundColor: '#FFFF00' }}></button></div>
                      <div className="color-item"><span className="color-name">Orange</span><button className="color-btn" data-color="#FF6600" style={{ backgroundColor: '#FF6600' }}></button></div>
                      <div className="color-item"><span className="color-name">Purple</span><button className="color-btn" data-color="#800080" style={{ backgroundColor: '#800080' }}></button></div>
                      <div className="color-item"><span className="color-name">Pink</span><button className="color-btn" data-color="#FFC0CB" style={{ backgroundColor: '#FFC0CB' }}></button></div>
                      <div className="color-item"><span className="color-name">Cyan</span><button className="color-btn" data-color="#00FFFF" style={{ backgroundColor: '#00FFFF' }}></button></div>
                      <div className="color-item"><span className="color-name">Brown</span><button className="color-btn" data-color="#8B4513" style={{ backgroundColor: '#8B4513' }}></button></div>
                      <div className="color-item"><span className="color-name">Gray</span><button className="color-btn" data-color="#808080" style={{ backgroundColor: '#808080' }}></button></div>
                      <div className="color-item"><span className="color-name">Navy</span><button className="color-btn" data-color="#000080" style={{ backgroundColor: '#000080' }}></button></div>
                      <div className="color-item"><span className="color-name">Dark Green</span><button className="color-btn" data-color="#006400" style={{ backgroundColor: '#006400' }}></button></div>
                      <div className="color-item"><span className="color-name">Gold</span><button className="color-btn" data-color="#FFD700" style={{ backgroundColor: '#FFD700' }}></button></div>
                      <div className="color-item"><span className="color-name">Silver</span><button className="color-btn" data-color="#C0C0C0" style={{ backgroundColor: '#C0C0C0' }}></button></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-8 col-lg-7" style={{ padding: 0 }}>
            <div id="stage-container" style={{ display: 'flex', flexDirection: 'row', height: '100vh', gap: '10px', width: '100%' }}>
              <div id="design-stage" className="design-stage" style={{ flex: '1 1 auto', minWidth: '0' }}>
                <ModelViewer modelPath={modelPath} />
                <div id="tab-overlay" className="tab-overlay">
                  <div className="tab-overlay-body"></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
      .designer-topbar{background:rgba(255,255,255,0.15);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);color:#fff;border-radius:0 0 8px 8px;padding:10px;min-height:48px;width:100%;position:relative;flex-shrink:0;border:1px solid rgba(255,255,255,0.2);border-top:none}
      @media (min-width: 992px){ .designer-topbar{background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.2);border-top:none} }
      .designer-topbar .rr-btn{background:rgba(255,255,255,0.2);color:#fff;border-radius:6px;border:1px solid rgba(255,255,255,0.3);cursor:pointer;padding:6px 12px;font-size:14px}
      .designer-topbar .rr-btn:hover{background:rgba(255,255,255,0.3)}
      .designer-topbar .icon-btn{background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.3);padding:8px;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:6px}
      .designer-topbar .icon-btn:hover{background:rgba(255,255,255,0.3)}
      .designer-topbar .icon-btn svg{margin:0;vertical-align:middle}
      .designer-topbar .menu-dropdown{position:absolute;top:50px;left:8px;right:auto;max-width:calc(100vw - 16px);background:#fff;border:1px solid #eee;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.12);padding:8px;z-index:200000;box-sizing:border-box}
      .designer-topbar .menu-dropdown .dropdown-item{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:6px;background:#fff;color:#111}
      .designer-topbar .menu-dropdown .dropdown-item:hover{background:#f7f7f7}
      .design-toolbar .rr-btn{padding:6px 10px}
      .layer-card .icon-btn{border:1px solid #eee;background:#fafafa;color:#333;border-radius:6px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer}
      .layer-card .icon-btn:hover{background:#f0f0f0}
      .sidebar-section .section-body .rr-btn{padding:6px 10px}
      .layers-list{display:flex;flex-direction:column;gap:10px}
      .layer-card{border:1px solid #eee;border-radius:8px;background:#fff;padding:10px;display:flex;align-items:center;justify-content:space-between;width:100%;box-sizing:border-box}
      .layer-card .info{display:flex;flex-direction:column;gap:4px;min-width:0}
      .layer-card .title{font-weight:600;color:#111}
      .layer-card .meta{font-size:12px;color:#666}
      .layer-card .actions{display:flex;align-items:center;gap:8px;flex-shrink:0}
      .layer-card .title,.layer-card .meta{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .design-stage{position:relative;background:#000;border:none;display:flex;align-items:center;justify-content:center;overflow:hidden;width:100%;flex:1;padding:0;border-radius:0}
      @media (max-width: 991px){ .design-stage{border-radius:30px} }
      .design-stage .shirt-base{max-width:100%;max-height:100%;width:auto;height:auto;pointer-events:none;object-fit:contain}
      .design-stage canvas{width:100% !important;height:100% !important}
      .design-canvas{position:relative;background:#f9f9f9;border:1px solid #eee;border-radius:8px;overflow:hidden;flex:1;height:100vh;display:flex;align-items:center;justify-content:center}
      .mobile-bar{display:none}
      @media (max-width: 991px){.design-stage{min-height:360px;padding:10px;box-sizing:border-box}}
      @media (max-width: 991px){
        .designer-topbar{position:static;padding:8px 10px;min-height:44px;justify-content:space-between !important}
        .designer-topbar .left,.designer-topbar .middle,.designer-topbar .right{display:none !important}
        .mobile-bar{display:flex !important;gap:0 !important;flex:1;justify-content:space-between}
        .designer-area.fs .row{padding:0 !important;margin:0 !important}
        .designer-area.fs .col-xl-8.col-lg-7{padding:0 !important;margin:0 !important;flex:1;display:flex;flex-direction:column;width:100% !important;max-width:100% !important;min-height:0}
        #stage-container{flex-direction:column !important;height:calc(100vh - 44px - 70px) !important;gap:0 !important}
        .designer-area.fs.designs-open #design-stage{height:70% !important;max-height:70% !important;flex:none !important}
        .design-canvas-inline{min-height:200px !important;height:auto !important;max-height:300px !important}
        .designer-area.fs .design-stage{flex:1;padding:10px;padding-bottom:10px;box-sizing:border-box;width:100%;display:flex;align-items:center;justify-content:center;margin:0;border:none;min-height:0}
        .designer-area.fs .design-stage .shirt-base{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain}
        .designer-area.fs .tab-overlay{bottom:70px}
      }
      @media (min-width: 992px){ .mobile-bar{display:none !important} }
      .drop-zone{border:1px dashed #bbb;border-radius:6px;padding:10px;text-align:center;color:#666;width:100%;box-sizing:border-box}
      .layers-panel{border:1px solid #eee;border-radius:6px;padding:10px;min-height:80px;max-height:420px;overflow:auto;width:100%;box-sizing:border-box}
      .designer-nav{width:140px;border-right:1px solid rgba(255,255,255,0.2);padding:10px;background:rgba(255,255,255,0.15);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
      @media (min-width: 992px){ .designer-nav{height:100vh} }
      .designer-nav .tab-btn{display:flex;flex-direction:column;align-items:center;gap:8px;width:100%;text-align:center;margin-bottom:8px;border:1px solid rgba(255,255,255,0.3);border-radius:6px;padding:10px;background:rgba(255,255,255,0.2);color:#fff;white-space:normal;word-break:break-word}
      .designer-nav .tab-btn svg path{fill:#fff}
      .designer-nav .tab-btn.active{background:rgba(103,74,217,0.8);border-color:rgba(103,74,217,0.5);color:#fff}
      .designer-nav .tab-btn .tab-icon{width:18px;height:18px;display:block;margin:0 auto}
      .designer-nav .tab-btn .tab-label{display:block;line-height:1.2}
      .designs-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;width:100%;box-sizing:border-box}
      .designs-grid .design-thumb{border:none;border-radius:0;overflow:visible;cursor:pointer;background:transparent;padding:0;width:100%}
      .designs-grid .design-thumb img{width:100%;max-width:100%;height:auto;display:block;object-fit:contain}
      .file-name{font-size:12px;color:#555}
      #text-input{margin:0 0 6px 0;padding:6px;width:100%;box-sizing:border-box;height:32px;border:1px solid rgba(255,255,255,0.3);border-radius:6px;background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:#111}
      #text-input::placeholder{color:rgba(255,255,255,0.6)}
      .text-controls-row{display:flex;flex-direction:row;align-items:center;gap:6px;width:100%;box-sizing:border-box}
      .text-controls-row input[type="color"]{width:36px;height:36px;padding:2px;border:1px solid #ddd;border-radius:6px;cursor:pointer;flex-shrink:0}
      .text-controls-row select{flex:1;min-width:80px;height:36px;padding:0;border:1px solid #ddd;border-radius:6px;font-size:13px}
      .text-controls-row input[type="number"]{width:45px;height:36px;padding:0;margin:0;border:1px solid #ddd;border-radius:6px;text-align:center;font-size:13px;flex-shrink:0}
      .text-controls-row .rr-btn{height:36px;padding:0 12px;font-size:13px;flex-shrink:0}
      #tab-text-layers .text-controls .form-control, #tab-text-layers #btn-bold{font-size:14px}
      @media (max-width: 991px){ .text-controls .form-control{min-width:80px} }
      
      .designer-area.fs .designer-content{display:none !important}
      .design-sidebar{position:sticky;top:20px;display:flex;flex-direction:column;height:100%}
      .designer-nav{width:160px;border-right:none}
      .design-sidebar{width:160px;max-width:160px;flex:0 0 160px}
      @media (min-width: 992px){
        .designer-area.fs .col-xl-4.col-lg-5{flex:0 0 160px;max-width:160px;display:flex;flex-direction:column}
      }
      @media (max-width: 991px){
        .designer-area.fs .col-xl-4.col-lg-5{position:fixed !important;left:0 !important;right:0 !important;bottom:0 !important;top:auto !important;width:100% !important;max-width:100% !important;height:auto !important;z-index:100000 !important;padding:10px !important;margin:0 !important;flex:none !important;background:transparent;backdrop-filter:none;-webkit-backdrop-filter:none}
        .design-sidebar{position:relative !important;width:100% !important;max-width:100% !important;height:auto !important;padding:0 !important;margin:0 !important;flex:none !important}
        .designer-area.fs .designer-box{display:block !important;height:auto !important;overflow:hidden !important;padding:0 !important;margin:0 !important}
        .designer-area.fs .designer-box .designer-content{display:none !important}
        .designer-area.fs .designer-nav{position:relative !important;display:grid !important;grid-template-columns:repeat(4,1fr) !important;width:100% !important;background:transparent;backdrop-filter:none;-webkit-backdrop-filter:none;border-top:none;padding:6px 4px 12px 4px !important;margin:0 !important;gap:4px;box-sizing:border-box}
        .designer-area.fs .designer-nav .tab-btn{margin:0 !important;margin-bottom:3px !important;padding:8px 2px !important;font-size:10px;border:1px solid rgba(255,255,255,0.3);background:rgba(255,255,255,0.2);color:#fff}
        .designer-area.fs .designer-nav .tab-btn svg path{fill:#fff}
        .designer-area.fs .designer-nav .tab-btn.active{background:rgba(103,74,217,0.8);border-color:rgba(103,74,217,0.5)}
      }
      .tab-overlay{position:absolute;left:0;right:0;top:0;bottom:0;background:rgba(255,255,255,0.15);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.2);transform:translateX(-100%);transition:transform .35s ease, opacity .2s ease;z-index:99999;display:flex;flex-direction:column;opacity:0;visibility:hidden;box-sizing:border-box;margin:0;padding:0}
      .tab-overlay.open{transform:translateX(0);opacity:1;visibility:visible}
      @media (max-width: 991px){ .tab-overlay{position:fixed;left:0;right:0;top:50%;bottom:70px;width:100%;height:auto;transform:translateY(100%);overflow:auto;padding:10px;margin:0;box-sizing:border-box;background:rgba(255,255,255,0.15);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,0.2)} .tab-overlay.open{transform:translateY(0)} }
      @media (min-width: 992px){ .tab-overlay{width:30%; right:auto} }
      .tab-overlay-header{padding:2px 4px;border-bottom:1px solid rgba(255,255,255,0.2);display:flex;justify-content:flex-end;flex-shrink:0;background:transparent}
      .tab-overlay-header .icon-btn{background:rgba(255,255,255,0.2);border:none;box-shadow:none;padding:2px;border-radius:6px}
      .tab-overlay-header .icon-btn:hover{background:rgba(255,255,255,0.3)}
      .tab-overlay-header .icon-btn svg{width:22px;height:22px}
      .tab-overlay-header #tab-overlay-close svg path{fill:#674AD9}
      .tab-overlay-body{flex:1;overflow:auto;padding:10px;position:relative;width:100%;box-sizing:border-box;background:transparent}
      .tab-overlay .tab-pane{height:auto;opacity:1;overflow:visible;border:none;border-radius:0;background:transparent;padding:0;box-shadow:none;width:100%;box-sizing:border-box}
      .tab-overlay .tab-pane .rr-btn{background:rgba(103,74,217,0.8);backdrop-filter:blur(10px)}
      .tab-overlay .tab-pane .rr-btn:hover{background:rgba(103,74,217,1)}
      .btn-add-photo{width:100%;display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;padding:0 10px;height:32px;background:rgba(255,255,255,0.15) !important;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.3) !important;margin-bottom:5px}
      .btn-add-photo:hover{background:rgba(255,255,255,0.25) !important}
      .control-buttons{display:flex;gap:10px;margin-top:10px}
      .btn-remove-layer,.btn-reset-design{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;padding:6px 10px;border-radius:6px;cursor:pointer}
      .btn-remove-layer{background:rgba(255,100,100,0.2) !important;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,100,100,0.4) !important;color:#ff6b6b !important}
      .btn-remove-layer:hover{background:rgba(255,100,100,0.35) !important}
      .btn-reset-design{background:rgba(255,255,255,0.15) !important;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.3) !important;color:#fff !important}
      .btn-reset-design:hover{background:rgba(255,255,255,0.25) !important}
      .text-controls-box{background:rgba(255,255,255,0.1);border-radius:8px;border:1px solid rgba(255,255,255,0.2);padding:10px}
      .text-controls-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
      .liquid-select{background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:6px;color:#fff;padding:6px 10px;font-size:13px;min-width:100px;flex:1}
      .liquid-select option{background:#333;color:#fff}
      .liquid-number-input{background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:6px;color:#fff;padding:6px;font-size:13px;width:50px;text-align:center}
      .liquid-color-input{width:36px;height:36px;padding:2px;border:1px solid rgba(255,255,255,0.3);border-radius:6px;cursor:pointer;background:rgba(255,255,255,0.15)}
      .liquid-btn{background:rgba(255,255,255,0.15) !important;border:1px solid rgba(255,255,255,0.3) !important;color:#fff !important;padding:6px 12px}
      .liquid-btn:hover{background:rgba(255,255,255,0.25) !important}
      .text-input-row{display:flex;gap:8px;align-items:center}
      .text-input-row .form-control{flex:1}
      .btn-add-text-inline{background:rgba(255,255,255,0.15) !important;border:1px solid rgba(255,255,255,0.3) !important;padding:0 12px !important;border-radius:6px;display:flex;align-items:center;justify-content:center;gap:6px;height:32px;font-size:12px;white-space:nowrap;flex-shrink:0;position:relative;top:-3px}
      .btn-add-text-inline:hover{background:rgba(255,255,255,0.25) !important}
      .tab-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
      .tab-title{color:#fff;font-size:14px;font-weight:600}
      .tab-close-btn{background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:6px;padding:0 12px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;color:#fff}
      .tab-close-btn:hover{background:rgba(255,255,255,0.25)}
      .layers-empty{color:rgba(255,255,255,0.6);font-size:13px;text-align:center;padding:20px 10px}
      .design-controls{display:flex;flex-direction:column;gap:10px;padding:10px;background:rgba(255,255,255,0.1);border-radius:8px;border:1px solid rgba(255,255,255,0.2)}
      .control-row{display:flex;align-items:center;gap:10px}
      .control-label{display:flex;align-items:center;justify-content:center;width:28px;height:28px;background:rgba(255,255,255,0.15);border-radius:6px;flex-shrink:0}
      .control-value{color:#fff;font-size:12px;min-width:40px;text-align:right}
      .liquid-range{flex:1;-webkit-appearance:none;appearance:none;height:6px;background:rgba(255,255,255,0.2);border-radius:3px;outline:none}
      .liquid-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:16px;height:16px;background:rgba(255,255,255,0.9);border-radius:50%;cursor:pointer;border:2px solid rgba(103,74,217,0.8)}
      .liquid-range::-moz-range-thumb{width:16px;height:16px;background:rgba(255,255,255,0.9);border-radius:50%;cursor:pointer;border:2px solid rgba(103,74,217,0.8)}
      .tab-overlay .form-control{background:rgba(255,255,255,0.9);border:1px solid rgba(255,255,255,0.3)}
      .tab-overlay .layers-panel{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2)}
      .tab-overlay .layer-card{background:rgba(255,255,255,0.9);border:1px solid rgba(0,0,0,0.1);backdrop-filter:blur(10px)}
      .tab-overlay .layer-card .title{color:#111}
      .tab-overlay .layer-card .meta{color:#666}
      .tab-overlay .layer-card .icon-btn{background:rgba(255,255,255,0.8);border:1px solid #ddd}
      .tab-overlay .layer-card .icon-btn:hover{background:rgba(255,255,255,1)}
      .tab-overlay .layer-card .icon-btn svg path{fill:#333}
      .tab-overlay .design-canvas-inline{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2)}
      .tab-overlay .colors-palette .color-btn{border:2px solid rgba(255,255,255,0.3)}
      .tab-overlay .colors-palette .color-btn:hover{border-color:rgba(255,255,255,0.5)}
      .tab-overlay .colors-palette .color-btn.active{border-color:#674AD9;box-shadow:0 0 0 3px rgba(103,74,217,0.4)}
      .tab-overlay .file-name{color:rgba(255,255,255,0.8)}
      .tab-overlay .designs-grid .design-thumb{background:rgba(255,255,255,0.1);border-radius:8px;padding:5px}
      .tab-overlay .text-controls-row input[type="color"]{border:1px solid rgba(255,255,255,0.3)}
      .tab-overlay .text-controls-row select{background:rgba(255,255,255,0.9);border:1px solid rgba(255,255,255,0.3)}
      .tab-overlay .text-controls-row input[type="number"]{background:rgba(255,255,255,0.9);border:1px solid rgba(255,255,255,0.3)}
      @media (max-width: 991px){ .tab-overlay .tab-pane{padding:0} }
      .designer-area.fs{position:fixed;inset:0;z-index:99999;overflow:hidden;background:#000;display:flex;flex-direction:column;height:100vh;width:100vw}
      @media (min-width: 992px){ .designer-area.fs{background:#000} }
      .designer-area.fs > .container{display:flex;flex-direction:column;max-width:100% !important;width:100% !important;padding-left:0;padding-right:0;flex:1;min-height:0}
      .designer-area.fs .row{display:flex;flex-direction:row;flex:1;min-height:0;width:100%}
      .designer-area.fs .designer-box{display:flex;flex-direction:column;min-height:0 !important;height:100% !important;flex:1}
      .designer-area.fs .design-stage{min-height:0 !important;height:100% !important;flex:1}
      .designer-area.fs .design-stage .shirt-base{max-height:100%;width:auto;max-width:100%;object-fit:contain}
      @media (min-width: 992px){ .designer-content{display:none !important} }
      .designer-area .close-fs{z-index:100000}
      .designer-area .col-xl-8.col-lg-7{flex:1 1 auto;display:flex;flex-direction:column;min-height:0}
      #design-stage{margin:0;width:100%;flex:1}
      .design-layer{position:absolute;left:0;top:0;width:120px;height:120px;display:flex;align-items:center;justify-content:center;border:1px dashed transparent}
      .design-layer.selected{border-color:#674AD9}
      .design-layer img{max-width:100%;max-height:100%;pointer-events:none}
      .rotate-handle{position:absolute;right:-18px;top:-18px;width:36px;height:36px;border-radius:50%;background:#674AD9;cursor:grab;touch-action:none;z-index:100;box-shadow:0 2px 8px rgba(103,74,217,0.4)}
      .rotate-handle:active{background:#5a3fb8;transform:scale(1.1)}
      .rotate-handle::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:18px;height:18px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z'/%3E%3C/svg%3E") center/contain no-repeat}
      .menu-dropdown{position:fixed;background:#fff;border:1px solid #eee;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,0.08);padding:8px;z-index:200000}
      .dropdown-item{padding:8px 10px;border:none;background:#fff;width:100%;text-align:left}
      .ui-resizable-handle{position:absolute;background:#674AD9;width:16px;height:16px;z-index:90}
      .ui-resizable-se{right:-8px;bottom:-8px;cursor:se-resize;border-radius:4px}
      .ui-resizable-ne{right:-5px;top:-5px;cursor:ne-resize}
      .ui-resizable-sw{left:-5px;bottom:-5px;cursor:sw-resize}
      .ui-resizable-nw{left:-5px;top:-5px;cursor:nw-resize}
      .ui-resizable-e{right:-5px;top:50%;transform:translateY(-50%);cursor:e-resize}
      .ui-resizable-w{left:-5px;top:50%;transform:translateY(-50%);cursor:w-resize}
      .ui-resizable-n{top:-5px;left:50%;transform:translateX(-50%);cursor:n-resize}
      .ui-resizable-s{bottom:-5px;left:50%;transform:translateX(-50%);cursor:s-resize}
      .resize-handle{display:none}
      @media (max-width: 991px){
        .resize-handle{display:block;position:absolute;right:-18px;bottom:-18px;width:40px;height:40px;background:#674AD9;border-radius:8px;cursor:se-resize;touch-action:none;z-index:100;box-shadow:0 2px 8px rgba(103,74,217,0.4)}
        .resize-handle:active{background:#5a3fb8;transform:scale(1.1)}
        .resize-handle::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:16px;height:16px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM18 18H16V16H18V18ZM14 22H12V20H14V22ZM18 14H16V12H18V14ZM14 18H12V16H14V18ZM10 22H8V20H10V22Z'/%3E%3C/svg%3E") center/contain no-repeat}
        .ui-resizable-handle{display:none !important}
      }
      .colors-palette{display:flex;flex-direction:column;gap:8px;width:100%;box-sizing:border-box;padding:10px}
      .color-item{display:flex;flex-direction:column;gap:4px}
      .color-name{color:#fff;font-size:12px}
      .color-btn{width:100%;height:32px;border-radius:6px;border:2px solid rgba(255,255,255,0.3);cursor:pointer;transition:all 0.2s ease;box-sizing:border-box}
      .color-btn:hover{transform:scale(1.05);box-shadow:0 2px 8px rgba(0,0,0,0.15)}
      .color-btn.active{border-color:#674AD9;box-shadow:0 0 0 3px rgba(103,74,217,0.2)}
      ` }} />

      <Script src="/html/assets/js/vendor/jquery-3.6.0.min.js" strategy="afterInteractive" />
      <Script src="/html/assets/js/vendor/jquery-ui.min.js" strategy="afterInteractive" />
      <Script id="editor-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
        (function(){
          // Spremi inicijalizaciju kao globalnu funkciju
          window.initEditorFunctions = function(){
          if(window.editorInitialized) return;
          window.editorInitialized = true;
          // Resetuj globalne varijable
          window.editorLayers = [];
          var overlay = document.getElementById('design-canvas');
          var stage = document.getElementById('design-stage');
          var box = document.querySelector('.designer-box');
          function isDesktop(){ return window.innerWidth > 991; }
          function syncSidebarHeight(){ if(stage && box){ box.style.height = isDesktop() ? (stage.offsetHeight + 'px') : 'auto'; } }
          function layoutEditor(){ try{ var fs = document.querySelector('.designer-area.fs'); if(!fs) return; var topbar = fs.querySelector('.designer-topbar'); var hTop = topbar ? topbar.offsetHeight : 0; var padding = 0; var avail = Math.max(0, window.innerHeight - hTop - padding); if(box){ box.style.height = avail + 'px'; box.style.maxHeight = avail + 'px'; } if(stage){ stage.style.height = avail + 'px'; stage.style.maxHeight = avail + 'px'; stage.style.minHeight = avail + 'px'; } }catch(e){} }
          var baseImgEl = stage ? stage.querySelector('.shirt-base') : null; if(baseImgEl){ baseImgEl.onload = syncSidebarHeight; }
          window.addEventListener('resize', function(){ syncSidebarHeight(); layoutEditor(); });
          syncSidebarHeight();
          layoutEditor();
          setTimeout(function(){ layoutEditor(); }, 100);
          var layers = window.editorLayers;
          var activeLayer = null;
          var textStyle = { color:'#111', fontFamily:'Arial, sans-serif', fontWeight:'600', fontSize:24 };
          function deselect(){ if(activeLayer){ activeLayer.classList.remove('selected'); activeLayer = null; }}
          function select(el){ deselect(); activeLayer = el; el.classList.add('selected'); }
          function snapshot(el){ return {left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height, rotation: el.dataset.rotation||'0'}; }
          function applySnap(el, s){ el.style.left = s.left; el.style.top = s.top; el.style.width = s.width; el.style.height = s.height; el.dataset.rotation = s.rotation; el.style.transform = 'rotate('+parseFloat(s.rotation)+'deg)'; }
          var undoStack = []; var redoStack = [];
          function addRotation(layer){ var rotating = false; var cx = 0; var cy = 0; var rotate = layer.querySelector('.rotate-handle'); function start(x, y){ rotating = true; var rect = layer.getBoundingClientRect(); cx = rect.left + rect.width/2; cy = rect.top + rect.height/2; document.body.style.cursor = 'grabbing'; }
            function move(x, y){ if(!rotating) return; var angle = Math.atan2(y - cy, x - cx) * 180/Math.PI; layer.style.transform = 'rotate(' + angle + 'deg)'; layer.dataset.rotation = angle; console.log('Rotation angle:', angle, 'layerId:', layer.layerId); if(layer.layerId && window.updateDecalRotation){ console.log('Calling updateDecalRotation'); window.updateDecalRotation(layer.layerId, angle); } }
            function end(){ if(rotating){ rotating = false; document.body.style.cursor = 'default'; } }
            rotate.addEventListener('mousedown', function(e){ e.preventDefault(); start(e.clientX, e.clientY); });
            document.addEventListener('mousemove', function(e){ move(e.clientX, e.clientY); });
            document.addEventListener('mouseup', function(){ end(); });
            rotate.addEventListener('touchstart', function(e){ var t = e.changedTouches[0]; if(!t) return; e.preventDefault(); start(t.clientX, t.clientY); }, {passive:false});
            document.addEventListener('touchmove', function(e){ var t = e.changedTouches[0]; if(!t) return; move(t.clientX, t.clientY); }, {passive:false});
            document.addEventListener('touchend', function(){ end(); }); }
          function makeInteractive(layer, canvasId){ 
            var cid = canvasId || 'design-canvas';
            layer.dataset.canvasId = cid;
            try{ 
              var $layer = window.$(layer); 
              var canvas = document.getElementById(cid); 
              $layer.draggable({ 
                containment: canvas || 'parent', 
                start:function(){ select(layer); undoStack.push(snapshot(layer)); redoStack = []; }, 
                drag:function(){ 
                  canvas = document.getElementById(cid); 
                  if(layer.layerId && window.updateDecalPosition){ 
                    var canvasRect = canvas ? canvas.getBoundingClientRect() : overlay.getBoundingClientRect(); 
                    var scale = parseFloat(layer.style.width) / canvasRect.width; 
                    var posX = (parseFloat(layer.style.left) + parseFloat(layer.style.width)/2 - canvasRect.width/2) / canvasRect.width; 
                    var posY = (parseFloat(layer.style.top) + parseFloat(layer.style.height)/2 - canvasRect.height/2) / canvasRect.height; 
                    window.updateDecalPosition(layer.layerId, scale, posX, posY); 
                  } 
                } 
              }).resizable({ 
                handles: 'se', 
                minWidth: 30,
                minHeight: 30,
                start:function(){ select(layer); undoStack.push(snapshot(layer)); redoStack = []; }, 
                resize:function(e, ui){ 
                  canvas = document.getElementById(cid); 
                  if(layer.layerId && window.updateDecalPosition){ 
                    var canvasRect = canvas ? canvas.getBoundingClientRect() : overlay.getBoundingClientRect(); 
                    var scale = ui.size.width / canvasRect.width; 
                    var posX = (parseFloat(layer.style.left) + ui.size.width/2 - canvasRect.width/2) / canvasRect.width; 
                    var posY = (parseFloat(layer.style.top) + ui.size.height/2 - canvasRect.height/2) / canvasRect.height; 
                    window.updateDecalPosition(layer.layerId, scale, posX, posY); 
                  } 
                } 
              }); 
            }catch(e){ console.error('Error in makeInteractive:', e); } 
            layer.addEventListener('mousedown', function(){ select(layer); }); 
            layer.addEventListener('touchstart', function(){ select(layer); }, {passive:true}); 
            addRotation(layer); 
            addTouchGestures(layer, cid); 
            var textColorInput = document.getElementById('text-color'); 
            var textFontSelect = document.getElementById('text-font'); 
            var textBoldBtn = document.getElementById('btn-bold'); 
            if(textColorInput){ textColorInput.addEventListener('input', function(){ if(layer.layerId && layer.querySelector('span') && window.updateTextDecalProperties){ window.updateTextDecalProperties(layer.layerId, null, this.value, null, null); } }); } 
            if(textFontSelect){ textFontSelect.addEventListener('change', function(){ if(layer.layerId && layer.querySelector('span') && window.updateTextDecalProperties){ window.updateTextDecalProperties(layer.layerId, null, null, this.value, null); } }); } 
            if(textBoldBtn){ textBoldBtn.addEventListener('click', function(){ if(layer.layerId && layer.querySelector('span') && window.updateTextDecalProperties){ var fw = textStyle.fontWeight === '700' || textStyle.fontWeight === 'bold' ? 400 : 700; window.updateTextDecalProperties(layer.layerId, null, null, null, fw); } }); } 
          }
          function addTouchGestures(layer, canvasId){ 
            var cid = canvasId || 'design-canvas';
            var state = { dragging: false, resizing: false, sx: 0, sy: 0, ox: 0, oy: 0, rsx: 0, rsy: 0, rbw: 0, rbh: 0 };
            // Add resize handle for touch
            var resizeHandle = document.createElement('div');
            resizeHandle.className = 'resize-handle';
            layer.appendChild(resizeHandle);
            
            // Document-level handlers for resize (to catch moves outside element)
            function onResizeMove(e){
              if(!state.resizing) return;
              e.preventDefault();
              var t = e.touches ? e.touches[0] : e;
              var dx = t.clientX - state.rsx;
              var dy = t.clientY - state.rsy;
              var nw = Math.max(40, state.rbw + dx);
              var nh = Math.max(40, state.rbh + dy);
              layer.style.width = nw + 'px';
              layer.style.height = nh + 'px';
              var canvas = document.getElementById(cid);
              var rect = canvas ? canvas.getBoundingClientRect() : {width:300,height:300};
              if(layer.layerId && window.updateDecalPosition){
                var scale = nw / rect.width;
                var posX = (parseFloat(layer.style.left) + nw/2 - rect.width/2) / rect.width;
                var posY = (parseFloat(layer.style.top) + nh/2 - rect.height/2) / rect.height;
                window.updateDecalPosition(layer.layerId, scale, posX, posY);
              }
            }
            function onResizeEnd(e){
              if(state.resizing){
                state.resizing = false;
                document.removeEventListener('touchmove', onResizeMove);
                document.removeEventListener('touchend', onResizeEnd);
              }
            }
            
            // Resize touch start
            resizeHandle.addEventListener('touchstart', function(e){
              e.preventDefault(); e.stopPropagation();
              state.resizing = true;
              state.dragging = false;
              var t = e.touches[0];
              state.rsx = t.clientX; state.rsy = t.clientY;
              state.rbw = layer.offsetWidth; state.rbh = layer.offsetHeight;
              undoStack.push(snapshot(layer)); redoStack=[];
              select(layer);
              document.addEventListener('touchmove', onResizeMove, {passive:false});
              document.addEventListener('touchend', onResizeEnd, {passive:false});
            }, {passive:false});
            
            // Document-level handlers for drag
            function onDragMove(e){
              if(!state.dragging || state.resizing) return;
              e.preventDefault();
              var t = e.touches ? e.touches[0] : e;
              var canvas = document.getElementById(cid);
              var rect = canvas ? canvas.getBoundingClientRect() : overlay.getBoundingClientRect();
              var dx = t.clientX - state.sx;
              var dy = t.clientY - state.sy;
              var nl = Math.max(0, Math.min(state.ox + dx, rect.width - layer.offsetWidth));
              var nt = Math.max(0, Math.min(state.oy + dy, rect.height - layer.offsetHeight));
              layer.style.left = nl + 'px';
              layer.style.top = nt + 'px';
              if(layer.layerId && window.updateDecalPosition){
                var scale = parseFloat(layer.style.width) / rect.width;
                var posX = (nl + parseFloat(layer.style.width)/2 - rect.width/2) / rect.width;
                var posY = (nt + parseFloat(layer.style.height)/2 - rect.height/2) / rect.height;
                window.updateDecalPosition(layer.layerId, scale, posX, posY);
              }
            }
            function onDragEnd(e){
              if(state.dragging){
                state.dragging = false;
                document.removeEventListener('touchmove', onDragMove);
                document.removeEventListener('touchend', onDragEnd);
              }
            }
            
            // Drag touch start on layer
            layer.addEventListener('touchstart', function(e){ 
              if(e.target.classList.contains('resize-handle') || e.target.classList.contains('rotate-handle')) return;
              if(state.resizing) return;
              var t = e.touches;
              if(t.length === 1){
                e.preventDefault();
                state.dragging = true;
                state.sx = t[0].clientX;
                state.sy = t[0].clientY;
                state.ox = parseFloat(layer.style.left || '0');
                state.oy = parseFloat(layer.style.top || '0');
                undoStack.push(snapshot(layer));
                redoStack = [];
                select(layer);
                document.addEventListener('touchmove', onDragMove, {passive:false});
                document.addEventListener('touchend', onDragEnd, {passive:false});
              }
            }, {passive:false});
          }
          function createImageLayer(src, fileName){ var layer = document.createElement('div'); layer.className = 'design-layer'; var layerId = 'layer-' + Date.now() + '-' + Math.random(); layer.id = layerId; layer.layerId = layerId; var img = document.createElement('img'); img.src = src; var rotate = document.createElement('div'); rotate.className = 'rotate-handle'; layer.appendChild(img); layer.appendChild(rotate); var canvas = document.getElementById('design-canvas'); if(canvas){ canvas.appendChild(layer); } else { overlay.appendChild(layer); } overlay.classList.add('has-layer'); var containerRect = canvas ? canvas.getBoundingClientRect() : overlay.getBoundingClientRect(); var initW = Math.min(containerRect.width*0.3, 300); var initH = initW; layer.style.width = initW+'px'; layer.style.height = initH+'px'; layer.style.left = (containerRect.width/2 - initW/2) + 'px'; layer.style.top = (containerRect.height/2 - initH/2) + 'px'; makeInteractive(layer, 'design-canvas'); var displayName = fileName || 'Slika'; layers.push({ el: layer, type: 'image', src: src, name: displayName, locked: false, layerId: layerId, canvasId: 'design-canvas' }); rebuildLayers(); select(layer); if(window.addDecalToModel){ var scale = initW / containerRect.width; var posX = (parseFloat(layer.style.left) + initW/2 - containerRect.width/2) / containerRect.width; var posY = (parseFloat(layer.style.top) + initH/2 - containerRect.height/2) / containerRect.height; window.addDecalToModel(src, scale, posX, posY, 0, layerId); } }
          function createTextLayer(text){ var layer = document.createElement('div'); layer.className = 'design-layer'; var layerId = 'layer-' + Date.now() + '-' + Math.random(); layer.id = layerId; layer.layerId = layerId; var span = document.createElement('span'); span.textContent = text || 'Text'; span.style.fontFamily = textStyle.fontFamily; span.style.fontWeight = textStyle.fontWeight; span.style.fontSize = textStyle.fontSize+'px'; span.style.color = textStyle.color; span.style.display = 'inline-block'; span.style.width = '100%'; span.style.textAlign = 'center'; var rotate = document.createElement('div'); rotate.className = 'rotate-handle'; layer.appendChild(span); layer.appendChild(rotate); var textCanvas = document.getElementById('text-canvas'); if(textCanvas){ textCanvas.appendChild(layer); } else { overlay.appendChild(layer); } overlay.classList.add('has-layer'); var containerRect = textCanvas ? textCanvas.getBoundingClientRect() : overlay.getBoundingClientRect(); var initW = Math.min(containerRect.width*0.3, 300); var initH = 50; layer.style.width = initW+'px'; layer.style.height = initH+'px'; layer.style.left = (containerRect.width/2 - initW/2) + 'px'; layer.style.top = (containerRect.height/2 - initH/2) + 'px'; makeInteractive(layer, 'text-canvas'); layer.addEventListener('dblclick', function(){ var t = prompt('Unesite tekst', span.textContent || ''); if(t!==null){ span.textContent = t; var idx = layers.findIndex(function(x){ return x.el===layer; }); if(idx>-1){ layers[idx].text = t; layers[idx].name = t || 'Text'; if(window.updateTextDecalProperties){ window.updateTextDecalProperties(layerId, t, textStyle.color, textStyle.fontFamily, parseInt(textStyle.fontWeight)); } } } }); layers.push({ el: layer, type: 'text', text: text || 'Text', name: text || 'Text', locked: false, layerId: layerId, canvasId: 'text-canvas' }); rebuildLayers(); select(layer); if(window.addTextDecalToModel){ var scale = initW / containerRect.width; var posX = (parseFloat(layer.style.left) + initW/2 - containerRect.width/2) / containerRect.width; var posY = (parseFloat(layer.style.top) + initH/2 - containerRect.height/2) / containerRect.height; window.addTextDecalToModel(text || 'Text', scale, posX, posY, 0, layerId, textStyle.color, textStyle.fontFamily, parseInt(textStyle.fontWeight)); } }
          function setLocked(layerEl, locked){ try{ window.$(layerEl).draggable(locked ? 'disable' : 'enable'); window.$(layerEl).resizable(locked ? 'disable' : 'enable'); }catch(e){} }
          function duplicateLayer(L){ if(!L) return; var s = snapshot(L.el); var offset = 20; var copy; if(L.type==='image'){ copy = document.createElement('div'); copy.className = 'design-layer'; var img = document.createElement('img'); img.src = L.src; var rotate = document.createElement('div'); rotate.className = 'rotate-handle'; copy.appendChild(img); copy.appendChild(rotate); overlay.appendChild(copy); } else { copy = document.createElement('div'); copy.className = 'design-layer'; var span = document.createElement('span'); span.textContent = L.text || 'Text'; span.style.fontFamily = 'Arial, sans-serif'; span.style.fontWeight = '600'; span.style.fontSize = '24px'; span.style.color = '#111'; var rotate2 = document.createElement('div'); rotate2.className = 'rotate-handle'; copy.appendChild(span); copy.appendChild(rotate2); overlay.appendChild(copy); }
            copy.style.width = s.width; copy.style.height = s.height; copy.style.left = (parseFloat(s.left||'0') + offset)+'px'; copy.style.top = (parseFloat(s.top||'0') + offset)+'px'; copy.dataset.rotation = s.rotation||'0'; copy.style.transform = 'rotate('+parseFloat(s.rotation||'0')+'deg)'; makeInteractive(copy); layers.push({ el: copy, type: L.type, src: L.src, text: L.text, name: L.name + ' copy', locked: false }); rebuildLayers(); select(copy); }
          function moveLayerUp(idx){ if(idx <= 0) return; var temp = layers[idx]; layers[idx] = layers[idx-1]; layers[idx-1] = temp; updateLayerZIndexes(); rebuildLayers(); }
          function moveLayerDown(idx){ if(idx >= layers.length-1) return; var temp = layers[idx]; layers[idx] = layers[idx+1]; layers[idx+1] = temp; updateLayerZIndexes(); rebuildLayers(); }
          function updateLayerZIndexes(){ layers.forEach(function(L, i){ L.el.style.zIndex = i + 1; }); if(window.reorderDecals){ var ids = layers.map(function(L){ return L.layerId; }); window.reorderDecals(ids); } }
          function rebuildLayers(){ var panel = document.getElementById('layers-panel'); if(!panel) return; panel.innerHTML = ''; if(layers.length === 0){ var empty = document.createElement('div'); empty.className = 'layers-empty'; empty.textContent = 'No layers yet. Add an image or text to get started.'; panel.appendChild(empty); return; } var list = document.createElement('div'); list.className = 'layers-list'; panel.appendChild(list); layers.forEach(function(L, i){ var card = document.createElement('div'); card.className = 'layer-card'; var info = document.createElement('div'); info.className = 'info'; var title = document.createElement('div'); title.className = 'title'; title.textContent = L.name || (L.type==='text' ? 'Text' : 'upload'); var meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = 'W: '+L.el.offsetWidth+'px  H: '+L.el.offsetHeight+'px'; info.appendChild(title); info.appendChild(meta); var actions = document.createElement('div'); actions.className = 'actions';
            var btnUp = document.createElement('button'); btnUp.className = 'icon-btn'; btnUp.title = 'Pomjeri gore'; btnUp.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5H7z" fill="#333"/></svg>'; btnUp.onclick = function(e){ e.stopPropagation(); moveLayerUp(i); };
            var btnDown = document.createElement('button'); btnDown.className = 'icon-btn'; btnDown.title = 'Pomjeri dolje'; btnDown.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5H7z" fill="#333"/></svg>'; btnDown.onclick = function(e){ e.stopPropagation(); moveLayerDown(i); };
            var btnLock = document.createElement('button'); btnLock.className = 'icon-btn'; btnLock.title = 'Lock/Unlock'; btnLock.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 1a5 5 0 0 1 5 5v3h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5zm-3 8h6V6a3 3 0 0 0-6 0v3z" fill="#333"/></svg>'; btnLock.onclick = function(e){ e.stopPropagation(); L.locked = !L.locked; setLocked(L.el, L.locked); };
            var btnDup = document.createElement('button'); btnDup.className = 'icon-btn'; btnDup.title = 'Duplicate'; btnDup.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24"><path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14h13a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z" fill="#333"/></svg>'; btnDup.onclick = function(e){ e.stopPropagation(); duplicateLayer(L); };
            var btnDel = document.createElement('button'); btnDel.className = 'icon-btn'; btnDel.title = 'Delete'; btnDel.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24"><path d="M3 6h18v2H3V6zm2 3h14l-1 12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 9zm5-6h4l1 2H9l1-2z" fill="#333"/></svg>'; btnDel.onclick = function(e){ e.stopPropagation(); if(window.removeDecalFromModel){ window.removeDecalFromModel(L.layerId); } L.el.remove(); layers.splice(i,1); rebuildLayers(); };
            var btnSelect = document.createElement('button'); btnSelect.className = 'icon-btn'; btnSelect.title = 'Select'; btnSelect.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24"><path d="M4 4h16v16H4z" fill="#333"/></svg>'; btnSelect.onclick = function(e){ e.stopPropagation(); select(L.el); };
            actions.appendChild(btnUp); actions.appendChild(btnDown); actions.appendChild(btnSelect); actions.appendChild(btnLock); actions.appendChild(btnDup); actions.appendChild(btnDel); card.appendChild(info); card.appendChild(actions); card.addEventListener('click', function(){ select(L.el); }); list.appendChild(card); }); }
          function addUploadThumb(src, fileName){ var grid = document.getElementById('uploads-grid'); if(!grid) return; var d = document.createElement('div'); d.className = 'design-thumb'; var img = document.createElement('img'); img.src = src; d.appendChild(img); d.addEventListener('click', function(){ createImageLayer(src, fileName); }); grid.appendChild(d); }
          var upload = document.getElementById('design-upload');
          if(upload){ upload.addEventListener('change', function(){ var f = this.files[0]; if(!f) return; var fileName = f.name || 'Slika'; var url = URL.createObjectURL(f); createImageLayer(url, fileName); }); }
          
          // Design controls - scale and rotation sliders
          var designScale = document.getElementById('design-scale');
          var designScaleValue = document.getElementById('design-scale-value');
          var designRotation = document.getElementById('design-rotation');
          var designRotationValue = document.getElementById('design-rotation-value');
          
          if(designScale){ 
            designScale.addEventListener('input', function(){ 
              var val = this.value;
              if(designScaleValue) designScaleValue.textContent = val + '%';
              if(activeLayer && activeLayer.dataset.canvasId === 'design-canvas'){
                var canvas = document.getElementById('design-canvas');
                var canvasRect = canvas ? canvas.getBoundingClientRect() : null;
                if(canvasRect){
                  var newSize = canvasRect.width * (val / 100);
                  activeLayer.style.width = newSize + 'px';
                  activeLayer.style.height = newSize + 'px';
                  // Sync with 3D model
                  if(activeLayer.layerId && window.updateDecalPosition){
                    var scale = val / 100;
                    var posX = (parseFloat(activeLayer.style.left) + newSize/2 - canvasRect.width/2) / canvasRect.width;
                    var posY = (parseFloat(activeLayer.style.top) + newSize/2 - canvasRect.height/2) / canvasRect.height;
                    window.updateDecalPosition(activeLayer.layerId, scale, posX, posY);
                  }
                }
              }
            }); 
          }
          
          if(designRotation){ 
            designRotation.addEventListener('input', function(){ 
              var val = this.value;
              if(designRotationValue) designRotationValue.textContent = val + '°';
              if(activeLayer && activeLayer.dataset.canvasId === 'design-canvas'){
                activeLayer.style.transform = 'rotate(' + val + 'deg)';
                activeLayer.dataset.rotation = val;
                // Sync with 3D model
                if(activeLayer.layerId && window.updateDecalRotation){
                  window.updateDecalRotation(activeLayer.layerId, parseFloat(val));
                }
              }
            }); 
          }
          
          // Update sliders when layer is selected
          function updateDesignControls(){
            if(activeLayer && activeLayer.dataset.canvasId === 'design-canvas'){
              var canvas = document.getElementById('design-canvas');
              var canvasRect = canvas ? canvas.getBoundingClientRect() : null;
              if(canvasRect && designScale){
                var currentScale = Math.round((parseFloat(activeLayer.style.width) / canvasRect.width) * 100);
                designScale.value = currentScale;
                if(designScaleValue) designScaleValue.textContent = currentScale + '%';
              }
              if(designRotation){
                var currentRotation = parseFloat(activeLayer.dataset.rotation) || 0;
                designRotation.value = currentRotation;
                if(designRotationValue) designRotationValue.textContent = Math.round(currentRotation) + '°';
              }
            }
          }
          
          // Override select function to update controls
          var originalSelect = select;
          select = function(el){ originalSelect(el); updateDesignControls(); };
          var drop = document.getElementById('drop-zone');
          if(drop){ drop.addEventListener('dragover', function(e){ e.preventDefault(); this.classList.add('drag'); }); drop.addEventListener('dragleave', function(){ this.classList.remove('drag'); }); drop.addEventListener('drop', function(e){ e.preventDefault(); this.classList.remove('drag'); var f = e.dataTransfer.files && e.dataTransfer.files[0]; if(!f) return; var fileName = f.name || 'Slika'; var url = URL.createObjectURL(f); addUploadThumb(url, fileName); createImageLayer(url, fileName); }); }
          var btnBrowse = document.getElementById('btn-browse'); if(btnBrowse){ btnBrowse.addEventListener('click', function(){ if(upload) upload.click(); }); }
          var btnRemoveLayer = document.getElementById('btn-remove-layer'); if(btnRemoveLayer){ btnRemoveLayer.addEventListener('click', function(){ if(activeLayer){ var layerId = activeLayer.layerId; if(window.removeDecalFromModel){ window.removeDecalFromModel(layerId); } activeLayer.remove(); var idx = layers.findIndex(function(L){ return L.layerId === layerId; }); if(idx > -1){ layers.splice(idx, 1); } rebuildLayers(); deselect(); } }); }
          var btnResetDesign = document.getElementById('btn-reset-design'); if(btnResetDesign){ btnResetDesign.addEventListener('click', function(){ if(activeLayer && activeLayer.dataset.canvasId === 'design-canvas'){ var canvas = document.getElementById('design-canvas'); var canvasRect = canvas ? canvas.getBoundingClientRect() : null; if(canvasRect){ var initW = Math.min(canvasRect.width * 0.3, 300); var initH = initW; activeLayer.style.width = initW + 'px'; activeLayer.style.height = initH + 'px'; activeLayer.style.left = (canvasRect.width/2 - initW/2) + 'px'; activeLayer.style.top = (canvasRect.height/2 - initH/2) + 'px'; activeLayer.style.transform = 'rotate(0deg)'; activeLayer.dataset.rotation = '0'; var scale = initW / canvasRect.width; var posX = 0; var posY = 0; if(activeLayer.layerId && window.updateDecalPosition){ window.updateDecalPosition(activeLayer.layerId, scale, posX, posY); } if(activeLayer.layerId && window.updateDecalRotation){ window.updateDecalRotation(activeLayer.layerId, 0); } if(designScale){ designScale.value = 30; if(designScaleValue) designScaleValue.textContent = '30%'; } if(designRotation){ designRotation.value = 0; if(designRotationValue) designRotationValue.textContent = '0°'; } } } }); }
          var btnMenu = document.getElementById('btn-menu'); var menu = document.getElementById('menu-dropdown'); if(btnMenu && menu){ btnMenu.addEventListener('click', function(e){ e.stopPropagation(); menu.style.display = (menu.style.display==='none' || !menu.style.display) ? 'block' : 'none'; }); document.addEventListener('click', function(){ if(menu) menu.style.display = 'none'; }); Array.prototype.forEach.call(menu.querySelectorAll('.dropdown-item'), function(item){ item.addEventListener('click', function(){ var act = this.dataset.action; if(act==='download'){ var b = document.getElementById('btn-download'); if(b) b.click(); } else if(act==='print'){ var b2 = document.getElementById('btn-print'); if(b2) b2.click(); } menu.style.display = 'none'; }); }); }
          function positionDropdown(btn, dd){ var topbar = document.querySelector('.designer-topbar'); var br = btn.getBoundingClientRect(); var tr = topbar.getBoundingClientRect(); dd.style.display = 'block'; dd.style.top = (tr.bottom - tr.top + 6) + 'px'; var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0); var left = br.left + br.width/2 - dd.offsetWidth/2; left = Math.max(8, Math.min(left, vw - dd.offsetWidth - 8)); dd.style.left = left + 'px'; }
          var btnAddText = document.getElementById('btn-add-text'); var textInput = document.getElementById('text-input'); if(btnAddText){ btnAddText.addEventListener('click', function(){ var t = textInput ? textInput.value : ''; createTextLayer(t || 'Text'); }); }
          var textColor = document.getElementById('text-color'); if(textColor){ textColor.addEventListener('input', function(){ textStyle.color = this.value || '#111'; if(activeLayer){ var s = activeLayer.querySelector('span'); if(s) s.style.color = textStyle.color; } }); }
          var textFont = document.getElementById('text-font'); if(textFont){ textFont.addEventListener('change', function(){ textStyle.fontFamily = this.value || 'Arial, sans-serif'; if(activeLayer){ var s = activeLayer.querySelector('span'); if(s) s.style.fontFamily = textStyle.fontFamily; } }); }
          var textSize = document.getElementById('text-size'); if(textSize){ textSize.addEventListener('input', function(){ var v = parseInt(this.value, 10); textStyle.fontSize = isNaN(v) ? 24 : v; if(activeLayer){ var s = activeLayer.querySelector('span'); if(s) s.style.fontSize = textStyle.fontSize+'px'; } }); }
            var btnBold = document.getElementById('btn-bold'); if(btnBold){ btnBold.addEventListener('click', function(){ textStyle.fontWeight = (textStyle.fontWeight==='700' || textStyle.fontWeight==='bold') ? '400' : '700'; var isBold = (textStyle.fontWeight==='700' || textStyle.fontWeight==='bold'); btnBold.classList.toggle('active', isBold); if(activeLayer){ var s = activeLayer.querySelector('span'); if(s) s.style.fontWeight = textStyle.fontWeight; } }); }

            // Function to sync layer with 3D model
            function syncLayerTo3D(layer){
              if(!layer || !layer.layerId || !window.updateDecalPosition) return;
              var canvasId = layer.dataset.canvasId || 'design-canvas';
              var canvas = document.getElementById(canvasId);
              var rect = canvas ? canvas.getBoundingClientRect() : overlay.getBoundingClientRect();
              var w = parseFloat(layer.style.width);
              var h = parseFloat(layer.style.height);
              var left = parseFloat(layer.style.left || '0');
              var top = parseFloat(layer.style.top || '0');
              var rotation = parseFloat(layer.dataset.rotation || '0');
              var scale = w / rect.width;
              var posX = (left + w/2 - rect.width/2) / rect.width;
              var posY = (top + h/2 - rect.height/2) / rect.height;
              window.updateDecalPosition(layer.layerId, scale, posX, posY);
              if(window.updateDecalRotation){ window.updateDecalRotation(layer.layerId, rotation); }
            }
            var btnUndo = document.getElementById('btn-undo'); if(btnUndo){ btnUndo.addEventListener('click', function(){ if(activeLayer && undoStack.length){ var s = undoStack.pop(); redoStack.push(snapshot(activeLayer)); applySnap(activeLayer, s); syncLayerTo3D(activeLayer); } }); }
            var btnRedo = document.getElementById('btn-redo'); if(btnRedo){ btnRedo.addEventListener('click', function(){ if(activeLayer && redoStack.length){ var s = redoStack.pop(); undoStack.push(snapshot(activeLayer)); applySnap(activeLayer, s); syncLayerTo3D(activeLayer); } }); }
            var btnReset = document.getElementById('btn-reset'); if(btnReset){ btnReset.addEventListener('click', function(){ 
              // Remove all layers from designer canvas
              layers.slice().forEach(function(L){ if(L.el) L.el.remove(); }); 
              layers = []; 
              // Clear uploads grid
              var uploadsGrid = document.getElementById('uploads-grid');
              if(uploadsGrid) uploadsGrid.innerHTML = '';
              // Clear 3D model decals
              if(window.clearDecals) window.clearDecals();
              // Reset model color to default
              if(window.changeModelColor) window.changeModelColor('#d1d1cf');
              // Reset color buttons
              var colorBtns = document.querySelectorAll('.color-btn');
              colorBtns.forEach(function(b){ b.classList.remove('active'); });
              var defaultBtn = document.querySelector('.color-btn[data-color="#d1d1cf"]');
              if(defaultBtn) defaultBtn.classList.add('active');
              // Reset zoom
              zoom = 1;
              if(window.setModelZoom) window.setModelZoom(1);
              // Clear stacks
              undoStack = []; redoStack = [];
              // Rebuild layers panel
              rebuildLayers();
              deselect();
              overlay.classList.remove('has-layer');
            }); }
            // Zoom functionality
            var zoom = 1;
            function applyZoom(){ 
              if(window.setModelZoom){ window.setModelZoom(zoom); }
            }
            var btnZoomIn = document.getElementById('btn-zoom-in'); 
            if(btnZoomIn){ btnZoomIn.addEventListener('click', function(){ zoom = Math.min(2, zoom + 0.25); applyZoom(); }); }
            var btnZoomOut = document.getElementById('btn-zoom-out'); 
            if(btnZoomOut){ btnZoomOut.addEventListener('click', function(){ zoom = Math.max(0.5, zoom - 0.25); applyZoom(); }); }
            var btnPrint = document.getElementById('btn-print'); if(btnPrint){ btnPrint.addEventListener('click', function(){ var baseImg = stage.querySelector('.shirt-base'); var rect = overlay.getBoundingClientRect(); var canvas = document.createElement('canvas'); canvas.width = Math.floor(rect.width); canvas.height = Math.floor(rect.height); var ctx = canvas.getContext('2d'); var done = function(){ var data = canvas.toDataURL('image/png'); var w = window.open(''); if(w){ w.document.write('<img src="'+data+'" style="max-width:100%">'); w.document.close(); w.focus(); w.print(); } }; if(baseImg){ var img = new Image(); img.onload = function(){ ctx.drawImage(img, 0, 0, canvas.width, canvas.height); draw(); }; img.src = baseImg.src; } else { draw(); } function draw(){ layers.forEach(function(L){ var el = L.el; var left = parseFloat(el.style.left||'0'); var top = parseFloat(el.style.top||'0'); var w = el.offsetWidth; var h = el.offsetHeight; var rot = parseFloat(el.dataset.rotation||'0') * Math.PI/180; ctx.save(); ctx.translate(left + w/2, top + h/2); ctx.rotate(rot); if(L.type==='image'){ var im = el.querySelector('img'); if(im){ var iw = im.naturalWidth || w; var ih = im.naturalHeight || h; var scale = Math.min(w/iw, h/ih); var dw = iw * scale; var dh = ih * scale; ctx.drawImage(im, -dw/2, -dh/2, dw, dh); } } else if(L.type==='text'){ var span = el.querySelector('span'); var txt = span ? span.textContent : (L.text||''); var fs = 24; ctx.fillStyle = '#111'; ctx.font = '600 '+fs+'px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, 0, 0); } ctx.restore(); }); done(); }
            }); }

            function toggleMobileDD(id, btn){ var dd = document.getElementById(id); if(!dd) return; var shown = dd.style.display !== 'none'; var all = document.querySelectorAll('.mobile-bar .menu-dropdown'); all.forEach(function(x){ x.style.display='none'; }); dd.style.display = shown ? 'none' : 'block'; if(!shown) positionDropdown(btn, dd); }
            function bindMobile(){ var mMenu = document.getElementById('m-menu'); var mTools = document.getElementById('m-tools'); var mMore = document.getElementById('m-more'); var mBack = document.getElementById('m-back'); var btnBack = document.getElementById('btn-back'); if(mMenu){ mMenu.addEventListener('click', function(){ toggleMobileDD('m-menu-dd', mMenu); }); } if(mTools){ mTools.addEventListener('click', function(){ toggleMobileDD('m-tools-dd', mTools); }); } if(mMore){ mMore.addEventListener('click', function(){ toggleMobileDD('m-tools-dd', mMore); }); } if(mBack){ mBack.addEventListener('click', function(){ window.history.go(-2); }); } if(btnBack){ btnBack.addEventListener('click', function(){ window.history.go(-2); }); }
              var ddItems = document.querySelectorAll('.mobile-bar .menu-dropdown .dropdown-item'); ddItems.forEach(function(item){ item.addEventListener('click', function(){ var a = item.getAttribute('data-action'); if(a==='download'){ var b = document.getElementById('btn-download'); if(b) b.click(); } else if(a==='print'){ var b2 = document.getElementById('btn-print'); if(b2) b2.click(); } else if(a==='undo'){ var b3 = document.getElementById('btn-undo'); if(b3) b3.click(); } else if(a==='redo'){ var b4 = document.getElementById('btn-redo'); if(b4) b4.click(); } else if(a==='reset'){ var b5 = document.getElementById('btn-reset'); if(b5) b5.click(); } else if(a==='zoom-in'){ var b6 = document.getElementById('btn-zoom-in'); if(b6) b6.click(); } else if(a==='zoom-out'){ var b7 = document.getElementById('btn-zoom-out'); if(b7) b7.click(); } else if(a==='clear'){ layers.slice().forEach(function(L){ L.el.remove(); }); layers = []; overlay.classList.remove('has-layer'); rebuildLayers(); deselect(); }
                var all = document.querySelectorAll('.mobile-bar .menu-dropdown'); all.forEach(function(x){ x.style.display='none'; }); }); }); }
            bindMobile();

            // Color palette functionality
            var colorBtns = document.querySelectorAll('.color-btn');
            colorBtns.forEach(function(btn){
              btn.addEventListener('click', function(){
                var color = this.getAttribute('data-color');
                if(window.changeModelColor){
                  window.changeModelColor(color);
                }
                colorBtns.forEach(function(b){ b.classList.remove('active'); });
                btn.classList.add('active');
              });
            });

            // Tabs overlay behavior identical to HTML
            (function initDesignerTabs(){
              var nav = document.querySelectorAll('.designer-nav .tab-btn');
              var content = document.querySelector('.designer-content');
              var tabOverlay = document.getElementById('tab-overlay');
              var overlayBody = tabOverlay ? tabOverlay.querySelector('.tab-overlay-body') : null;
              var closeBtn = document.getElementById('tab-overlay-close');
              var designCanvas = document.getElementById('design-canvas');
              var placeholder = document.getElementById('tab-content-placeholder') || document.createElement('div');
              placeholder.id = 'tab-content-placeholder';
              if(content && content.parentNode && !document.getElementById('tab-content-placeholder')){ content.parentNode.insertBefore(placeholder, content); }
              function isMobile(){ return window.matchMedia('(max-width: 991px)').matches; }
              var activeId=null;
              var stageContainer = document.getElementById('stage-container');
              var designStage = document.getElementById('design-stage');
              var designerArea = document.querySelector('.designer-area.fs');
              function updateDesignCanvasVisibility(id){
                var isMobileView = isMobile();
                // All tabs now show overlay and adjust canvas - only on mobile
                if(id === 'tab-designs' || id === 'tab-text-layers' || id === 'tab-layers' || id === 'tab-colors'){
                  if(designerArea){ designerArea.classList.add('designs-open'); }
                } else {
                  if(designerArea){ designerArea.classList.remove('designs-open'); }
                }
                // Trigger resize event so ModelViewer can adjust - only on mobile
                if(isMobileView){
                  setTimeout(function(){ window.dispatchEvent(new Event('resize')); }, 50);
                }
              }
              function openOverlay(id){ if(!tabOverlay || !overlayBody) return; nav.forEach(function(b){ b.classList.toggle('active', b.dataset.tab===id); }); var pane = document.getElementById(id); if(!pane) return; var currentInOverlay = overlayBody.querySelector('.tab-pane'); if(currentInOverlay && content){ content.appendChild(currentInOverlay); currentInOverlay.classList.remove('active'); currentInOverlay.style.height=''; currentInOverlay.style.opacity=''; }
                overlayBody.appendChild(pane); pane.classList.add('active'); pane.style.height='auto'; pane.style.opacity='1'; tabOverlay.classList.add('open'); activeId=id; updateDesignCanvasVisibility(id); }
              function closeOverlay(){ if(!tabOverlay || !overlayBody || !content) return; var currentInOverlay = overlayBody.querySelector('.tab-pane'); if(currentInOverlay){ content.appendChild(currentInOverlay); currentInOverlay.classList.remove('active'); currentInOverlay.style.height=''; currentInOverlay.style.opacity=''; } tabOverlay.classList.remove('open'); if(designerArea){ designerArea.classList.remove('designs-open'); } if(isMobile()){ setTimeout(function(){ window.dispatchEvent(new Event('resize')); }, 50); } }
              nav.forEach(function(b){ b.addEventListener('click', function(){ var id=this.dataset.tab; if(isMobile()){ if(activeId===id && tabOverlay && tabOverlay.classList.contains('open')){ closeOverlay(); activeId=null; } else { openOverlay(id); } } else { if(activeId===id && tabOverlay && tabOverlay.classList.contains('open')){ closeOverlay(); activeId=null; } else { openOverlay(id); } } }); });
              if(closeBtn){ closeBtn.addEventListener('click', function(){ closeOverlay(); activeId=null; }); }
              document.addEventListener('click', function(e){ if(e.target.classList.contains('tab-close-btn')){ closeOverlay(); activeId=null; nav.forEach(function(b){ b.classList.remove('active'); }); } });
              // Initially hide design-canvas and set full width for model stage
              if(designStage){ designStage.style.width = '100%'; designStage.style.flex = '1 1 100%'; }
              if(stageContainer){ stageContainer.style.gap = '0'; }
            })();
            // Initial rebuild to show empty state
            rebuildLayers();

          };
          // Automatski pokreni ako je jQuery već učitan
          function ready(){ return !!(window.$ && window.$.fn && window.$.fn.draggable && window.$.fn.resizable); }
          function wait(fn){ if(ready()) fn(); else setTimeout(function(){ wait(fn); }, 50); }
          wait(function(){ window.initEditorFunctions(); });
        })();
      ` }} />
    </div>
  );
}

