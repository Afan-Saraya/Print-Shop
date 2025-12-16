import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
// internal
import BackToTopCom from "../components/common/back-to-top";
import GlobalLoader from "../components/loader/global-loader";

const Wrapper = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // Check if this is the first load or navigation
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (hasVisited) {
      // Not first load - skip loading screen for navigation
      setIsLoading(false);
      setIsFirstLoad(false);
    } else {
      // First load - show loading screen
      sessionStorage.setItem('hasVisited', 'true');
      setIsFirstLoad(true);
      
      // Simulate loading time for first visit
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle route changes - no loading screen for navigation
  useEffect(() => {
    const handleRouteChangeStart = () => {
      if (!isFirstLoad) {
        setIsLoading(false);
      }
    };

    const handleRouteChangeComplete = () => {
      setIsLoading(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router.events, isFirstLoad]);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  return (
    <div id="wrapper">
      <GlobalLoader 
        isLoading={isLoading} 
        onLoadComplete={handleLoadComplete}
      />
      <div style={{ 
        opacity: isLoading ? 0 : 1, 
        transition: 'opacity 0.5s ease-in-out' 
      }}>
        {children}
      </div>
      <BackToTopCom />
      <ToastContainer />
    </div>
  );
};

export default Wrapper;
