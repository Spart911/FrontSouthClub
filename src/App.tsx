import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProductGrid} from './components/ProductGrid';
import { Header } from './components/Header';
import { ScrollToTop } from './components/ScrollToTop';
import { Logo } from './components/Logo';
import { PhotoStrip } from './components/PhotoStrip';
import { GlobalStyles } from './styles/GlobalStyles';
import { LazyLoad } from './components/LazyLoad';
import { ConsentModal } from './components/ConsentModal';
import { ConsentBanner } from './components/ConsentBanner';
import { useConsent } from './hooks/useConsent';

// Lazy load components below the fold
const CommunitySection = lazy(() => import('./components/CommunitySection').then(module => ({ default: module.CommunitySection })));
const FeedbackSection = lazy(() => import('./components/FeedbackSection').then(module => ({ default: module.FeedbackSection })));
const InfoAccordion = lazy(() => import('./components/InfoAccordion').then(module => ({ default: module.InfoAccordion })));
const RunningTape = lazy(() => import('./components/RunningTape').then(module => ({ default: module.RunningTape })));

// Lazy load pages
const ProductPage = lazy(() => import('./pages/ProductPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const OfferPage = lazy(() => import('./pages/OfferPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const SuccessPage = lazy(() => import('./pages/SuccessPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const Footer = lazy(() => import('./components/Footer'));

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isPrivacyPage = location.pathname === '/privacy';
  const { hasConsent, isModalOpen, acceptConsent, declineConsent, requestConsent } = useConsent();
  // const [products, setProducts] = useState<Product[]>([]);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const loadProducts = async () => {
  //     try {
  //       console.log('Starting to load products...');
  //       const lamps = await lampService.getAllLamps();
  //       console.log('Loaded products:', lamps.length, 'items');
  //       setProducts(lamps);
  //     } catch (error) {
  //       console.error('Error loading products:', error);
  //     } finally {
  //       console.log('Loading finished');
  //       setLoading(false);
  //     }
  //   };

  //   loadProducts();
  // }, []);

  // if (loading) {
  //   return (
  //     <div style={{ 
  //       display: 'flex', 
  //       justifyContent: 'center', 
  //       alignItems: 'center', 
  //       minHeight: '100vh',
  //       fontFamily: 'var(--font-buch), "Helvetica", sans-serif',
  //       backgroundColor: 'white',
  //       color: 'black'
  //     }}>
  //       <div>Загрузка продуктов...</div>
  //     </div>
  //   );
  // }

  return (
    <>
      <GlobalStyles />
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={
          <>
            <Logo />
            <PhotoStrip />
            <LazyLoad height="200px">
              <Suspense fallback={<div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Загрузка...</div>}>
                <RunningTape />
              </Suspense>
            </LazyLoad>
            <ProductGrid />
            <Suspense fallback={<div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Загрузка...</div>}>
              <CommunitySection />
            </Suspense>
            <Suspense fallback={<div style={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Загрузка...</div>}>
              <FeedbackSection />
            </Suspense>
            <LazyLoad height="300px">
              <Suspense fallback={<div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Загрузка...</div>}>
                <InfoAccordion />
              </Suspense>
            </LazyLoad>
          </>
        } />
        <Route path="/product/:id" element={
          <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Загрузка товара...</div>}>
            <ProductPage />
          </Suspense>
        } />
        <Route path="/terms" element={
          <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Загрузка...</div>}>
            <TermsPage />
          </Suspense>
        } />
        <Route path="/offer" element={
          <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Загрузка...</div>}>
            <OfferPage />
          </Suspense>
        } />
        <Route path="/privacy" element={
          <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Загрузка...</div>}>
            <PrivacyPage />
          </Suspense>
        } />
        <Route path="/admin" element={
          <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Загрузка админки...</div>}>
            <AdminPage />
          </Suspense>
        } />
        <Route path="/success" element={
          <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Загрузка...</div>}>
            <SuccessPage />
          </Suspense>
        } />
        <Route path="/orders" element={
          <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Загрузка...</div>}>
            <OrdersPage />
          </Suspense>
        } />
      </Routes>

      {!isAdminRoute && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}

      {/* Consent Management */}
      {isModalOpen && !isPrivacyPage && (
        <ConsentModal
          onAccept={acceptConsent}
          onDecline={declineConsent}
        />
      )}
      
      {!hasConsent && !isModalOpen && !isAdminRoute && (
        <ConsentBanner
          onAccept={acceptConsent}
          onDecline={declineConsent}
          onSettings={requestConsent}
        />
      )}
    </>
  );
};

const App = () => {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <ScrollToTop />
      <AppContent />
    </Router>
  );
};

export default App;