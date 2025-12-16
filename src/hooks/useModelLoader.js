import { useState, useEffect } from 'react';

export const useModelLoader = (modelPaths = []) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedModels, setLoadedModels] = useState(new Set());
  const [totalModels, setTotalModels] = useState(0);

  useEffect(() => {
    if (modelPaths.length === 0) {
      setIsLoading(false);
      return;
    }

    setTotalModels(modelPaths.length);
    setLoadedModels(new Set());
    setIsLoading(true);

    // Preload 3D models
    const loadModel = async (modelPath) => {
      try {
        // Simulate model loading with fetch to check if file exists
        const response = await fetch(modelPath, { method: 'HEAD' });
        if (response.ok) {
          setLoadedModels(prev => new Set([...prev, modelPath]));
        }
      } catch (error) {
        console.warn(`Failed to load model: ${modelPath}`, error);
        // Still mark as loaded to prevent infinite loading
        setLoadedModels(prev => new Set([...prev, modelPath]));
      }
    };

    // Load all models
    modelPaths.forEach(loadModel);
  }, [modelPaths]);

  useEffect(() => {
    if (totalModels > 0 && loadedModels.size >= totalModels) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [loadedModels.size, totalModels]);

  return {
    isLoading,
    progress: totalModels > 0 ? (loadedModels.size / totalModels) * 100 : 100,
    loadedCount: loadedModels.size,
    totalCount: totalModels
  };
};

// Hook for global page loading
export const usePageLoader = () => {
  const [isLoading, setIsLoading] = useState(true);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return {
    isLoading,
    startLoading,
    stopLoading
  };
};