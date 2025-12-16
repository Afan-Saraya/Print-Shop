// Debug script za testiranje navigacije
// Dodajte ovaj kod u browser console da testirate navigaciju

console.log('🔍 Debug navigacije - Saraya Print Shop');

// Test 1: Proverava da li Next.js router radi
function testNextRouter() {
    console.log('📍 Test 1: Next.js Router');
    
    if (typeof window !== 'undefined' && window.next && window.next.router) {
        console.log('✅ Next.js router je dostupan');
        console.log('Current route:', window.next.router.pathname);
        return true;
    } else {
        console.log('❌ Next.js router nije dostupan');
        return false;
    }
}

// Test 2: Proverava da li postoje problemi sa event listener-ima
function testEventListeners() {
    console.log('📍 Test 2: Event Listeners');
    
    const personalizeLinks = document.querySelectorAll('a[href="/personalize"]');
    console.log(`Pronađeno ${personalizeLinks.length} linkova za personalize stranicu`);
    
    personalizeLinks.forEach((link, index) => {
        console.log(`Link ${index + 1}:`, link);
        
        // Dodaj debug event listener
        link.addEventListener('click', function(e) {
            console.log('🖱️ Klik na personalize link:', this.href);
            console.log('Event:', e);
        });
    });
}

// Test 3: Proverava da li postoje CSS problemi
function testCSSIssues() {
    console.log('📍 Test 3: CSS Problemi');
    
    const hiddenElements = document.querySelectorAll('[style*="display: none"], [style*="visibility: hidden"]');
    console.log(`Pronađeno ${hiddenElements.length} skrivenih elemenata`);
    
    hiddenElements.forEach((el, index) => {
        if (el.textContent.includes('Personalizuj') || el.href && el.href.includes('/personalize')) {
            console.log(`⚠️ Personalize element je skriven:`, el);
        }
    });
}

// Test 4: Proverava da li postoje JavaScript greške
function testJavaScriptErrors() {
    console.log('📍 Test 4: JavaScript Greške');
    
    // Dodaj global error handler
    window.addEventListener('error', function(e) {
        console.log('❌ JavaScript greška:', e.error);
        console.log('File:', e.filename);
        console.log('Line:', e.lineno);
    });
    
    // Dodaj unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(e) {
        console.log('❌ Unhandled Promise Rejection:', e.reason);
    });
}

// Test 5: Simulira klik na personalize link
function simulatePersonalizeClick() {
    console.log('📍 Test 5: Simulacija klika');
    
    const personalizeLink = document.querySelector('a[href="/personalize"]');
    if (personalizeLink) {
        console.log('🖱️ Simuliram klik na personalize link...');
        personalizeLink.click();
    } else {
        console.log('❌ Personalize link nije pronađen');
    }
}

// Test 6: Proverava da li postoje problemi sa loading screen-om
function testLoadingScreen() {
    console.log('📍 Test 6: Loading Screen');
    
    const loader = document.querySelector('[style*="z-index: 9999"]');
    if (loader && loader.style.display !== 'none') {
        console.log('⚠️ Loading screen je možda aktivan:', loader);
    } else {
        console.log('✅ Loading screen nije aktivan');
    }
}

// Pokreni sve testove
function runAllTests() {
    console.log('🚀 Pokretanje svih testova...\n');
    
    testNextRouter();
    testEventListeners();
    testCSSIssues();
    testJavaScriptErrors();
    testLoadingScreen();
    
    console.log('\n📊 Testovi završeni. Proverite rezultate gore.');
    console.log('💡 Za simulaciju klika, pozovite: simulatePersonalizeClick()');
}

// Dodaj funkcije u global scope
window.debugNavigation = {
    runAllTests,
    testNextRouter,
    testEventListeners,
    testCSSIssues,
    testJavaScriptErrors,
    testLoadingScreen,
    simulatePersonalizeClick
};

console.log('✅ Debug script učitan!');
console.log('💡 Pozovite debugNavigation.runAllTests() da pokrenete sve testove');
console.log('💡 Ili pozovite pojedinačne testove: debugNavigation.testNextRouter()');