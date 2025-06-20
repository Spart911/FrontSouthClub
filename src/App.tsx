import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { HeroSlider } from './components/HeroSlider';
import { ProductGridSection } from './components/ProductGrid';
import { ProcessSection } from './components/ProcessSection';
import { ProductPage } from './pages/ProductPage';
import { AboutPage } from './pages/AboutPage';
import { lampService } from './services/lampService';
import { Header } from './components/Header';
import { CartProvider, useCart } from './contexts/CartContext';
import CheckoutPage from './pages/CheckoutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import ContactsPage from './pages/ContactsPage';
import Footer from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import MadePage from './pages/MadePage';
import { ScrollToTop } from './components/ScrollToTop';
import SuccessPage from './pages/SuccessPage';
import type { Product } from './types/product';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const AdminLink = styled(Link)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #000;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  font-family: var(--font-buch), "Helvetica", sans-serif;
  border-radius: 4px;
  z-index: 1000;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

const AppContent = () => {
  const { showCart, setShowCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const lamps = await lampService.getAllLamps();
        setProducts(lamps);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={
          <>
            <HeroSlider />
            <ProductGridSection products={products} />
            <ProcessSection />
          </>
        } />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/made" element={<MadePage />} />
      </Routes>
      <CartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <Router>
      <CartProvider>
        <ScrollToTop />
        <AppContent />
      </CartProvider>
    </Router>
  );
};

export default App;
