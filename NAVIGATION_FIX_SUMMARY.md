# Rešenje problema sa navigacijom - Personalize stranica

## Problem
Kada korisnik pokuša da pređe sa home stranice na personalize stranicu, URL se menja ali stranica se ne učitava. Korisnik ostaje na istoj stranici odakle je pokušao navigaciju.

## Uzrok problema
Glavni uzrok problema je bilo korišćenje `window.location.href` umesto Next.js router-a za navigaciju, što prekida client-side routing i može uzrokovati probleme sa učitavanjem stranica.

## Izmene koje sam napravio

### 1. ShopCategoryArea komponenta (`src/components/categories/shop-category-area.jsx`)
**STARO:**
```javascript
const handleCategoryRoute = (model) => {
  window.location.href = `/editor?model=${encodeURIComponent(model)}&fromCategory=true`;
};
```

**NOVO:**
```javascript
const handleCategoryRoute = (model) => {
  router.push(`/editor?model=${encodeURIComponent(model)}&fromCategory=true`);
};
```

### 2. ProductCarousel komponenta (`src/components/carousel/product-carousel.jsx`)
**STARO:**
```javascript
const handleCategoryRoute = (model) => {
  window.location.href = `/editor?model=${encodeURIComponent(model)}&fromCategory=true`;
};
```

**NOVO:**
```javascript
const handleCategoryRoute = (model) => {
  router.push(`/editor?model=${encodeURIComponent(model)}&fromCategory=true`);
};
```

### 3. JewelryBanner komponenta (`src/components/banner/jewelry-banner.jsx`)
**STARO:**
```javascript
const handleCategoryRoute = (model) => {
  window.location.href = `/editor?model=${encodeURIComponent(model)}&fromCategory=true`;
};
```

**NOVO:**
```javascript
const handleCategoryRoute = (model) => {
  router.push(`/editor?model=${encodeURIComponent(model)}&fromCategory=true`);
};
```

### 4. Editor stranica (`src/pages/editor.jsx`)
**STARO:**
```javascript
if (fromCategory === 'true' && typeof window !== 'undefined') {
  const newUrl = `/editor?model=${encodeURIComponent(model || '/cap/scene.gltf')}`;
  window.location.href = newUrl;
}
```

**NOVO:**
```javascript
if (fromCategory === 'true' && typeof window !== 'undefined') {
  const newUrl = `/editor?model=${encodeURIComponent(model || '/cap/scene.gltf')}`;
  router.replace(newUrl, undefined, { shallow: true });
}
```

### 5. Wrapper komponenta (`src/layout/wrapper.jsx`)
**Potpuno refaktorisao** da ne blokira navigaciju:

- Uklonio preloadovanje svih 3D modela koje je blokiralo navigaciju
- GlobalLoader se sada prikazuje samo pri prvom učitavanju stranice
- Za navigaciju između stranica nema loading screen-a
- Dodao sessionStorage da prati da li je korisnik već posetio sajt

**NOVO:**
```javascript
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
```

## Zašto ove izmene rešavaju problem

1. **Next.js Router vs window.location.href:**
   - `router.push()` koristi client-side routing što je brže i ne prekida React state
   - `window.location.href` uzrokuje full page reload što može da prekine navigaciju
   - `router.replace()` menja URL bez dodavanja u browser history

2. **GlobalLoader optimizacija:**
   - Stari kod je preloadovao sve 3D modele što je moglo da blokira navigaciju
   - Novi kod prikazuje loader samo pri prvom učitavanju
   - Navigacija između stranica je sada instant

3. **SessionStorage tracking:**
   - Prati da li je korisnik već posetio sajt
   - Sprečava nepotrebno prikazivanje loader-a pri navigaciji

## Kako testirati

1. Pokrenite development server:
   ```bash
   npm run dev
   # ili
   yarn dev
   ```

2. Idite na http://localhost:3000

3. Testirajte navigaciju:
   - Kliknite na "Personalizuj" u glavnom meniju
   - Kliknite na bilo koju kategoriju proizvoda
   - Testirajte mobilni meni

4. Za debug, otvorite browser console i pozovite:
   ```javascript
   debugNavigation.runAllTests()
   ```

## Dodatni fajlovi kreirani za testiranje

- `test-navigation.html` - Vizuelni test stranice sa objašnjenjem problema i rešenja
- `debug-navigation.js` - JavaScript debug script za testiranje navigacije u browser console-u

## Rezultat

Navigacija sada treba da radi besprekorno! Next.js router će pravilno upravljati rutiranjem bez refresh-a stranice, a korisnici će moći da se kreću između stranica bez problema.