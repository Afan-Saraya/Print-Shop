import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function ModelViewer({ modelPath = '/cap/scene.gltf' }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const originalMaterialsRef = useRef(new Map());
  const decalsRef = useRef([]);
  const stageRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

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
    camera.position.set(0, 0, 1); // Default 2x zoom (closer to model)
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting - brighter to prevent darkening
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    // Rim light - purple glow from the right side
    const rimLight = new THREE.PointLight(0x674AD9, 2.5, 10);
    rimLight.position.set(3, 0, 0);
    scene.add(rimLight);
    
    // Additional rim lights on right side for stronger glow effect
    const rimLight2 = new THREE.PointLight(0x674AD9, 1.5, 8);
    rimLight2.position.set(2.5, 1, 1);
    scene.add(rimLight2);
    
    const rimLight3 = new THREE.PointLight(0x674AD9, 1.5, 8);
    rimLight3.position.set(2.5, -1, 1);
    scene.add(rimLight3);

    // Fake shadow under the model (ellipse with gradient)
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

    // Backlight glow effect behind the model
    const backlightCanvas = document.createElement('canvas');
    backlightCanvas.width = 512;
    backlightCanvas.height = 512;
    const backlightCtx = backlightCanvas.getContext('2d');
    const backlightGradient = backlightCtx.createRadialGradient(256, 256, 0, 256, 256, 256);
    backlightGradient.addColorStop(0, 'rgba(103, 74, 217, 0.6)');
    backlightGradient.addColorStop(0.3, 'rgba(103, 74, 217, 0.3)');
    backlightGradient.addColorStop(0.6, 'rgba(103, 74, 217, 0.1)');
    backlightGradient.addColorStop(1, 'rgba(103, 74, 217, 0)');
    backlightCtx.fillStyle = backlightGradient;
    backlightCtx.fillRect(0, 0, 512, 512);
    
    const backlightTexture = new THREE.CanvasTexture(backlightCanvas);
    const backlightGeometry = new THREE.PlaneGeometry(4, 4);
    const backlightMaterial = new THREE.MeshBasicMaterial({
      map: backlightTexture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const backlightMesh = new THREE.Mesh(backlightGeometry, backlightMaterial);
    backlightMesh.position.z = -1;
    backlightMesh.position.y = 0;
    scene.add(backlightMesh);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0;
    controlsRef.current = controls;

    // Track current model color (default light gray #d1d1cf)
    const modelColorRef = { current: new THREE.Color(0xd1d1cf) };

    // Load GLTF model
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
      const model = gltf.scene;
      model.scale.set(1, 1, 1);
      scene.add(model);
      modelRef.current = model;

      // Store original materials and set default color (#d1d1cf)
      model.traverse((child) => {
        if (child.isMesh && child.material) {
          originalMaterialsRef.current.set(child, child.material.clone());
          // Set default light gray material with rim light support
          child.material = new THREE.MeshStandardMaterial({
            color: 0xd1d1cf,
            side: THREE.DoubleSide,
            roughness: 0.5,
            metalness: 0.1
          });
        }
      });

      // Center model
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center);
    });

    // Store stage reference for layer tracking
    stageRef.current = document.getElementById('design-stage');

    // Create master canvas for all decals
    const masterCanvas = document.createElement('canvas');
    masterCanvas.width = 1024;
    masterCanvas.height = 1024;
    const masterCtx = masterCanvas.getContext('2d');
    
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
          // Draw image
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
      
      // Update texture
      const canvasTexture = new THREE.CanvasTexture(masterCanvas);
      canvasTexture.flipY = true;
      canvasTexture.colorSpace = THREE.SRGBColorSpace;
      
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

    // Global function to add decal (image) to model
    window.addDecalToModel = (imageUrl, scale = 0.3, posX = 0, posY = 0.2, posZ = 0, layerId = null) => {
      if (!modelRef.current) return;
      
      const img = new Image();
      img.onload = () => {
        const decalData = { imageUrl, scale, posX, posY, posZ, layerId, img, type: 'image' };
        decalsRef.current.push(decalData);
        redrawAllDecals();
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
              metalness: 0.1
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
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
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
  }, [modelPath]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: 'linear-gradient(135deg, #674AD9 0%, #1a1a2e 100%)',
        borderRadius: 'inherit',
        overflow: 'hidden',
      }}
    />
  );
}
