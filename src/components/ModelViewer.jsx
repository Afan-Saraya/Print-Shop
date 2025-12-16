import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function ModelViewer({ modelPath = '/cap/scene.gltf', showShadow = true, zoom = 1, autoRotate = false, modelColor = '#d1d1cf', verticalOffset = 0, rotationX = 0, containerStyle = {}, onModelLoad = null, onModelError = null, disableInteraction = false, showLoadingSpinner = true, loadingSpinnerStyle = 'default' }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const originalMaterialsRef = useRef(new Map());
  const decalsRef = useRef([]);
  const stageRef = useRef(null);
  const [webglSupported, setWebglSupported] = React.useState(true);
  const [modelLoaded, setModelLoaded] = React.useState(false);
  const [showSpinner, setShowSpinner] = React.useState(true);

  // Check WebGL support
  const checkWebGLSupport = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Reset spinner state
    setShowSpinner(true);
    setModelLoaded(false);
    
    // Debug log for slider spinner
    if (loadingSpinnerStyle === 'slider') {
      console.log('ModelViewer: Slider spinner should be visible for:', modelPath);
    }

    // Check WebGL support first
    if (!checkWebGLSupport()) {
      console.warn('WebGL not supported, showing fallback');
      setWebglSupported(false);
      setShowSpinner(false);
      if (onModelError) {
        onModelError(modelPath);
      }
      if (onModelLoad) {
        onModelLoad(modelPath);
      }
      return;
    }

    // Global texture error suppression
    const originalConsoleError = console.error;
    const suppressTextureErrors = (...args) => {
      const message = args.join(' ');
      if (message.includes('THREE.GLTFLoader: Couldn\'t load texture') || 
          message.includes('Couldn\'t load texture') ||
          message.includes('texture') && (message.includes('.jpeg') || message.includes('.jpg') || message.includes('.png'))) {
        // Suppress texture-related errors completely
        return;
      }
      // Allow other errors through
      originalConsoleError.apply(console, args);
    };
    
    // Override console.error globally for this component
    console.error = suppressTextureErrors;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background to show CSS gradient
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, verticalOffset, 1 / zoom); // Adjust zoom based on parameter and add vertical offset
    cameraRef.current = camera;

    // Renderer setup with mobile optimizations
    const isMobile = window.innerWidth <= 768;
    let renderer;
    
    try {
      renderer = new THREE.WebGLRenderer({ 
        antialias: true, // Keep antialiasing for quality
        alpha: true,
        powerPreference: isMobile ? 'default' : 'high-performance',
        failIfMajorPerformanceCaveat: false // Allow fallback to software rendering
      });
      
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      renderer.setSize(containerWidth, containerHeight);
      
      // Better pixel ratio for quality - only slightly reduced on mobile
      const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(pixelRatio);
      
      // Mobile-specific optimizations
      if (isMobile) {
        renderer.shadowMap.enabled = false;
        renderer.physicallyCorrectLights = false;
      }
    } catch (error) {
      console.error('Failed to create WebGL renderer:', error);
      setWebglSupported(false);
      if (onModelError) {
        onModelError(modelPath);
      }
      if (onModelLoad) {
        onModelLoad(modelPath);
      }
      return;
    }
    
    // Style the canvas for proper centering and mobile coverage
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '50%';
    renderer.domElement.style.left = '50%';
    renderer.domElement.style.transform = 'translate(-50%, -50%)';
    
    // Mobile-specific canvas styling
    if (isMobile) {
      renderer.domElement.style.width = '120%';
      renderer.domElement.style.height = '120%';
      renderer.domElement.style.objectFit = 'cover';
    } else {
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.objectFit = 'contain';
    }
    
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Handle WebGL context loss (common on mobile)
    const handleContextLoss = (event) => {
      event.preventDefault();
      console.warn('WebGL context lost, showing fallback');
      setWebglSupported(false);
      if (onModelError) {
        onModelError(modelPath);
      }
    };

    const handleContextRestore = () => {
      console.log('WebGL context restored');
      // Optionally reload the component
    };

    renderer.domElement.addEventListener('webglcontextlost', handleContextLoss);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestore);

    // Lighting setup - keep quality but optimize for mobile
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    // Rim light - purple glow from the right side (reduced intensity on mobile)
    const rimLight = new THREE.PointLight(0x674AD9, isMobile ? 2.0 : 2.5, 10);
    rimLight.position.set(3, 0, 0);
    scene.add(rimLight);
    
    // Additional rim lights on right side for stronger glow effect
    const rimLight2 = new THREE.PointLight(0x674AD9, isMobile ? 1.2 : 1.5, 8);
    rimLight2.position.set(2.5, 1, 1);
    scene.add(rimLight2);
    
    const rimLight3 = new THREE.PointLight(0x674AD9, isMobile ? 1.2 : 1.5, 8);
    rimLight3.position.set(2.5, -1, 1);
    scene.add(rimLight3);

    // Fake shadow under the model (ellipse with gradient) - only if showShadow is true
    // Eksplicitno ne dodavaj shadow za olovke
    if (showShadow && !modelPath.includes('/pen/')) {
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 256;
      shadowCanvas.height = 256;
      const shadowCtx = shadowCanvas.getContext('2d');
      const gradient = shadowCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      shadowCtx.fillStyle = gradient;
      shadowCtx.fillRect(0, 0, 256, 256);
      
      const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
      const shadowGeometry = new THREE.PlaneGeometry(3, 3);
      const shadowMaterial = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false
      });
      const shadowMesh = new THREE.Mesh(shadowGeometry, shadowMaterial);
      shadowMesh.rotation.x = -Math.PI / 2;
      shadowMesh.position.y = -1.2;
      scene.add(shadowMesh);
    }



    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = autoRotate ? 2 : 0;
    
    // Disable interaction if specified
    if (disableInteraction) {
      controls.enabled = false;
      controls.enableRotate = false;
      controls.enableZoom = false;
      controls.enablePan = false;
    }
    
    controlsRef.current = controls;

    // Track current model color (default light gray #d1d1cf)
    const modelColorRef = { current: new THREE.Color(0xd1d1cf) };

    // Load GLTF model with retry logic and complete texture bypass
    const loader = new GLTFLoader();
    let retryCount = 0;
    const maxRetries = 3;
    
    // Completely override texture loading to prevent any texture-related errors
    const originalLoadTexture = loader.loadTexture;
    loader.loadTexture = function(textureIndex) {
      // Return a promise that resolves to null - no texture loading at all
      return Promise.resolve(null);
    };
    
    // Also override getDependency for textures
    const originalGetDependency = loader.getDependency;
    loader.getDependency = function(type, index) {
      if (type === 'texture') {
        // Return a simple white texture instead of loading from file
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 1, 1);
        return Promise.resolve(new THREE.CanvasTexture(canvas));
      }
      return originalGetDependency.call(this, type, index);
    };
    
    const loadModelWithRetry = () => {
      // Add cache busting parameter on retry
      const cacheBustParam = retryCount > 0 ? `?v=${Date.now()}` : '';
      const fullModelPath = modelPath + cacheBustParam;
      
      loader.load(
        fullModelPath, 
        (gltf) => {
          const model = gltf.scene;
          model.scale.set(1, 1, 1);
          scene.add(model);
          modelRef.current = model;

          // Store original materials and force replace with solid color materials
          model.traverse((child) => {
            if (child.isMesh && child.material) {
              // Store original but don't use it
              originalMaterialsRef.current.set(child, child.material.clone());
              
              // Always create new material with solid color - ignore any textures
              child.material = new THREE.MeshStandardMaterial({
                color: modelColor,
                side: THREE.DoubleSide,
                roughness: 0.5,
                metalness: 0.1,
                // Explicitly disable any texture maps
                map: null,
                normalMap: null,
                roughnessMap: null,
                metalnessMap: null,
                aoMap: null,
                emissiveMap: null
              });
              child.material.needsUpdate = true;
            }
          });

          // Center model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center);
          
          // Apply rotation if specified
          if (rotationX !== 0) {
            model.rotation.x = rotationX;
          }
          
          // Mark model as loaded with delay for slider spinner visibility
          if (loadingSpinnerStyle === 'slider') {
            console.log('Model loaded, showing slider spinner for 1.5s more...');
            // Show spinner for at least 1.5 seconds in sliders
            setTimeout(() => {
              console.log('Hiding slider spinner now');
              setModelLoaded(true);
              setShowSpinner(false);
            }, 1500);
          } else {
            setModelLoaded(true);
            setShowSpinner(false);
          }
          
          // Notify that model is loaded
          if (onModelLoad) {
            onModelLoad(modelPath);
          }
        },
        (progress) => {
          // Loading progress callback
          console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
        },
        (error) => {
          console.error(`Error loading model (attempt ${retryCount + 1}):`, error);
          
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying model load... (${retryCount}/${maxRetries})`);
            setTimeout(() => {
              loadModelWithRetry();
            }, 1000 * retryCount); // Exponential backoff
          } else {
            console.error('Max retries reached for model:', modelPath);
            // Notify error callback
            if (onModelError) {
              onModelError(modelPath);
            }
            // Still notify load complete to prevent infinite loading
            setShowSpinner(false);
            if (onModelLoad) {
              onModelLoad(modelPath);
            }
          }
        }
      );
    };
    
    // Start loading with a small delay to avoid race conditions
    setTimeout(() => {
      loadModelWithRetry();
    }, 100);

    // Store stage reference for layer tracking
    stageRef.current = document.getElementById('design-stage');

    // Create master canvas for all decals with good resolution
    const masterCanvas = document.createElement('canvas');
    const canvasSize = isMobile ? 3072 : 4096; // Better resolution on mobile
    masterCanvas.width = canvasSize;
    masterCanvas.height = canvasSize;
    const masterCtx = masterCanvas.getContext('2d', { willReadFrequently: true });
    // Enable high quality rendering
    masterCtx.imageSmoothingEnabled = true;
    masterCtx.imageSmoothingQuality = 'high';
    
    const redrawAllDecals = () => {
      // Clear master canvas with current model color
      const colorHex = '#' + modelColorRef.current.getHexString();
      masterCtx.fillStyle = colorHex;
      masterCtx.fillRect(0, 0, masterCanvas.width, masterCanvas.height);
      
      // Redraw all decals
      decalsRef.current.forEach((decal) => {
        const size = Math.min(masterCanvas.width, masterCanvas.height) * decal.scale;
        const x = (masterCanvas.width - size) / 2 + decal.posX * masterCanvas.width;
        const y = (masterCanvas.height - size) / 2 + decal.posY * masterCanvas.height;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        
        // Save context and apply rotation
        masterCtx.save();
        masterCtx.translate(centerX, centerY);
        masterCtx.rotate((decal.rotation || 0) * Math.PI / 180);
        
        if (decal.img) {
          // Draw image with high quality
          masterCtx.imageSmoothingEnabled = true;
          masterCtx.imageSmoothingQuality = 'high';
          masterCtx.drawImage(decal.img, -size / 2, -size / 2, size, size);
        } else if (decal.text) {
          // Draw text
          const fontSize = size * 0.3;
          masterCtx.font = `${decal.fontWeight || 600} ${fontSize}px ${decal.fontFamily || 'Arial, sans-serif'}`;
          masterCtx.fillStyle = decal.color || '#111111';
          masterCtx.textAlign = 'center';
          masterCtx.textBaseline = 'middle';
          masterCtx.fillText(decal.text, 0, 0);
        }
        
        masterCtx.restore();
      });
      
      // Update texture with ultra high quality settings
      const canvasTexture = new THREE.CanvasTexture(masterCanvas);
      canvasTexture.flipY = true;
      canvasTexture.colorSpace = THREE.SRGBColorSpace;
      canvasTexture.magFilter = THREE.LinearFilter;
      canvasTexture.minFilter = THREE.LinearMipmapLinearFilter;
      canvasTexture.anisotropy = renderer.capabilities.maxAnisotropy;
      
      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          // Use MeshStandardMaterial with emissive to show texture brightly with rim light
          const newMaterial = new THREE.MeshStandardMaterial({
            map: canvasTexture,
            side: THREE.DoubleSide,
            roughness: 0.5,
            metalness: 0.1,
            emissive: 0x222222,
            emissiveIntensity: 0.3
          });
          newMaterial.needsUpdate = true;
          child.material = newMaterial;
        }
      });
    };

    // Global function to add decal (image) to model with upscaling
    window.addDecalToModel = (imageUrl, scale = 0.3, posX = 0, posY = 0.2, posZ = 0, layerId = null) => {
      if (!modelRef.current) return;
      
      const img = new Image();
      img.onload = () => {
        // Upscale image to higher resolution for better quality
        const canvas = document.createElement('canvas');
        const scaleFactor = 4; // Upscale 4x
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to image
        const upscaledImg = new Image();
        upscaledImg.onload = () => {
          const decalData = { imageUrl, scale, posX, posY, posZ, layerId, img: upscaledImg, type: 'image' };
          decalsRef.current.push(decalData);
          redrawAllDecals();
        };
        upscaledImg.src = canvas.toDataURL();
      };
      img.src = imageUrl;
    };

    // Global function to add text decal to model
    window.addTextDecalToModel = (text, scale = 0.3, posX = 0, posY = 0.2, posZ = 0, layerId = null, color = '#111111', fontFamily = 'Arial, sans-serif', fontWeight = 600) => {
      if (!modelRef.current) return;
      
      const decalData = { text, scale, posX, posY, posZ, layerId, type: 'text', color, fontFamily, fontWeight };
      decalsRef.current.push(decalData);
      redrawAllDecals();
    };

    // Global function to update decal position and scale
    window.updateDecalPosition = (layerId, scale, posX, posY, rotation = null) => {
      console.log('updateDecalPosition called:', { layerId, scale, posX, posY, rotation });
      const decal = decalsRef.current.find(d => d.layerId === layerId);
      console.log('Found decal:', decal);
      if (decal) {
        decal.scale = scale;
        decal.posX = posX;
        decal.posY = posY;
        // Only update rotation if it's explicitly provided
        if (rotation !== null && rotation !== undefined) {
          decal.rotation = rotation;
        }
        redrawAllDecals();
        console.log('All decals redrawn');
      }
    };

    // Global function to update decal rotation
    window.updateDecalRotation = (layerId, rotation) => {
      console.log('updateDecalRotation called:', { layerId, rotation });
      const decal = decalsRef.current.find(d => d.layerId === layerId);
      console.log('Found decal for rotation:', decal);
      if (decal) {
        decal.rotation = rotation;
        console.log('Updated decal rotation to:', rotation);
        redrawAllDecals();
      }
    };

    // Global function to update text decal properties
    window.updateTextDecalProperties = (layerId, text, color, fontFamily, fontWeight) => {
      const decal = decalsRef.current.find(d => d.layerId === layerId);
      if (decal && decal.type === 'text') {
        if (text !== undefined) decal.text = text;
        if (color !== undefined) decal.color = color;
        if (fontFamily !== undefined) decal.fontFamily = fontFamily;
        if (fontWeight !== undefined) decal.fontWeight = fontWeight;
        redrawAllDecals();
      }
    };

    // Global function to clear all decals
    window.clearDecals = () => {
      if (!modelRef.current) return;
      
      decalsRef.current = [];
      masterCtx.clearRect(0, 0, masterCanvas.width, masterCanvas.height);
      
      modelRef.current.traverse((child) => {
        if (child.isMesh) {
          const originalMaterial = originalMaterialsRef.current.get(child);
          if (originalMaterial) {
            child.material = originalMaterial.clone();
            child.material.needsUpdate = true;
          }
        }
      });
    };

    // Global function to change model base color
    window.changeModelColor = (colorHex) => {
      if (!modelRef.current) return;
      
      const color = new THREE.Color(colorHex);
      modelColorRef.current.copy(color);
      
      // Ako nema decala, direktno promijeni boju materijala
      if (decalsRef.current.length === 0) {
        modelRef.current.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: color,
              side: THREE.DoubleSide,
              roughness: 0.5,
              metalness: 0.1,
              // Explicitly disable any texture maps
              map: null,
              normalMap: null,
              roughnessMap: null,
              metalnessMap: null,
              aoMap: null,
              emissiveMap: null
            });
            child.material.needsUpdate = true;
          }
        });
      } else {
        // Redraw decals with new color background
        redrawAllDecals();
      }
    };

    // Global function to set zoom level
    window.setModelZoom = (zoomLevel) => {
      if (!cameraRef.current) return;
      // Adjust camera position based on zoom (closer = bigger)
      const baseDistance = 2;
      cameraRef.current.position.z = baseDistance / zoomLevel;
      cameraRef.current.updateProjectionMatrix();
    };

    // Global function to reorder decals (for layer ordering)
    window.reorderDecals = (layerIds) => {
      if (!layerIds || !layerIds.length) return;
      // Reorder decalsRef based on layerIds order
      const newOrder = [];
      layerIds.forEach(id => {
        const decal = decalsRef.current.find(d => d.layerId === id);
        if (decal) newOrder.push(decal);
      });
      // Add any decals not in layerIds at the end
      decalsRef.current.forEach(d => {
        if (!layerIds.includes(d.layerId)) newOrder.push(d);
      });
      decalsRef.current = newOrder;
      redrawAllDecals();
    };

    // Global function to remove a single decal by layerId
    window.removeDecalFromModel = (layerId) => {
      if (!modelRef.current) return;
      
      const index = decalsRef.current.findIndex(d => d.layerId === layerId);
      if (index !== -1) {
        decalsRef.current.splice(index, 1);
        redrawAllDecals();
      }
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !renderer) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      
      // Maintain canvas centering after resize
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '50%';
      renderer.domElement.style.left = '50%';
      renderer.domElement.style.transform = 'translate(-50%, -50%)';
      
      // Check if mobile for different sizing after resize
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        renderer.domElement.style.width = '120%';
        renderer.domElement.style.height = '120%';
        renderer.domElement.style.objectFit = 'cover';
      } else {
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.objectFit = 'contain';
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Restore original console.error
      console.error = originalConsoleError;
      
      // Remove WebGL context event listeners
      if (renderer && renderer.domElement) {
        renderer.domElement.removeEventListener('webglcontextlost', handleContextLoss);
        renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestore);
      }
      
      window.removeEventListener('resize', handleResize);
      delete window.addDecalToModel;
      delete window.addTextDecalToModel;
      delete window.clearDecals;
      delete window.updateDecalPosition;
      delete window.updateDecalRotation;
      delete window.updateTextDecalProperties;
      delete window.changeModelColor;
      delete window.setModelZoom;
      delete window.reorderDecals;
      delete window.removeDecalFromModel;
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelPath, loadingSpinnerStyle]);

  // Fallback UI for when WebGL is not supported or model fails to load
  if (!webglSupported) {
    return (
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          background: 'none',
          borderRadius: 'inherit',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: disableInteraction ? 'none' : 'auto',
          ...containerStyle,
          background: 'none !important'
        }}
      >
        {/* Show spinner even when WebGL fails if it's slider style */}
        {showSpinner && showLoadingSpinner && loadingSpinnerStyle === 'slider' && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            pointerEvents: 'none'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              position: 'relative'
            }}>
              <div className="model-cube-loader slider-style">
                <div className="model-cube-face model-cube-front"></div>
                <div className="model-cube-face model-cube-back"></div>
                <div className="model-cube-face model-cube-right"></div>
                <div className="model-cube-face model-cube-left"></div>
                <div className="model-cube-face model-cube-top"></div>
                <div className="model-cube-face model-cube-bottom"></div>
              </div>
            </div>
            <style jsx>{`
              .model-cube-loader {
                width: 60px;
                height: 60px;
                position: relative;
                transform-style: preserve-3d;
                animation: rotateModelCube 2s infinite linear;
              }
              .model-cube-face {
                position: absolute;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, rgba(103, 74, 217, 0.8), rgba(156, 136, 255, 0.6));
                border: 2px solid rgba(255, 255, 255, 0.4);
                opacity: 0.9;
                backdrop-filter: blur(8px);
                box-shadow: 0 0 20px rgba(103, 74, 217, 0.3);
              }
              .model-cube-front { transform: rotateY(0deg) translateZ(30px); }
              .model-cube-back { transform: rotateY(180deg) translateZ(30px); }
              .model-cube-right { transform: rotateY(90deg) translateZ(30px); }
              .model-cube-left { transform: rotateY(-90deg) translateZ(30px); }
              .model-cube-top { transform: rotateX(90deg) translateZ(30px); }
              .model-cube-bottom { transform: rotateX(-90deg) translateZ(30px); }
              @keyframes rotateModelCube {
                0% { transform: rotateX(0deg) rotateY(0deg); }
                100% { transform: rotateX(360deg) rotateY(360deg); }
              }
            `}</style>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        background: 'none',
        borderRadius: 'inherit',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: disableInteraction ? 'none' : 'auto',
        ...containerStyle,
        background: 'none !important'
      }}
    >
      {/* Loading indicator while model is loading - 3D cube animation without text */}
      {showSpinner && showLoadingSpinner && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: loadingSpinnerStyle === 'slider' ? 1000 : 10,
            pointerEvents: 'none'
          }}
          onLoad={() => {
            if (loadingSpinnerStyle === 'slider') {
              console.log('Slider spinner is now visible!');
            }
          }}
        >
          {/* 3D Cube Animation */}
          <div style={{
            width: loadingSpinnerStyle === 'slider' ? '60px' : '40px',
            height: loadingSpinnerStyle === 'slider' ? '60px' : '40px',
            position: 'relative'
          }}>
            <div className={`model-cube-loader ${loadingSpinnerStyle === 'slider' ? 'slider-style' : ''}`}>
              <div className="model-cube-face model-cube-front"></div>
              <div className="model-cube-face model-cube-back"></div>
              <div className="model-cube-face model-cube-right"></div>
              <div className="model-cube-face model-cube-left"></div>
              <div className="model-cube-face model-cube-top"></div>
              <div className="model-cube-face model-cube-bottom"></div>
            </div>
          </div>

          {/* CSS Animations */}
          <style jsx>{`
            .model-cube-loader {
              width: 40px;
              height: 40px;
              position: relative;
              transform-style: preserve-3d;
              animation: rotateModelCube 2s infinite linear;
            }

            .model-cube-loader.slider-style {
              width: 60px;
              height: 60px;
            }

            .model-cube-face {
              position: absolute;
              width: 40px;
              height: 40px;
              background: linear-gradient(135deg, #674AD9, #9C88FF);
              border: 1px solid rgba(255, 255, 255, 0.3);
              opacity: 0.8;
            }

            .slider-style .model-cube-face {
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, rgba(103, 74, 217, 0.8), rgba(156, 136, 255, 0.6));
              border: 2px solid rgba(255, 255, 255, 0.4);
              opacity: 0.9;
              backdrop-filter: blur(8px);
              box-shadow: 0 0 20px rgba(103, 74, 217, 0.3);
            }

            .model-cube-front { transform: rotateY(0deg) translateZ(20px); }
            .model-cube-back { transform: rotateY(180deg) translateZ(20px); }
            .model-cube-right { transform: rotateY(90deg) translateZ(20px); }
            .model-cube-left { transform: rotateY(-90deg) translateZ(20px); }
            .model-cube-top { transform: rotateX(90deg) translateZ(20px); }
            .model-cube-bottom { transform: rotateX(-90deg) translateZ(20px); }

            .slider-style .model-cube-front { transform: rotateY(0deg) translateZ(30px); }
            .slider-style .model-cube-back { transform: rotateY(180deg) translateZ(30px); }
            .slider-style .model-cube-right { transform: rotateY(90deg) translateZ(30px); }
            .slider-style .model-cube-left { transform: rotateY(-90deg) translateZ(30px); }
            .slider-style .model-cube-top { transform: rotateX(90deg) translateZ(30px); }
            .slider-style .model-cube-bottom { transform: rotateX(-90deg) translateZ(30px); }

            @keyframes rotateModelCube {
              0% { transform: rotateX(0deg) rotateY(0deg); }
              100% { transform: rotateX(360deg) rotateY(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
