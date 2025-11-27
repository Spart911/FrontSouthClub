import styled, { keyframes, css } from 'styled-components';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MobileMenu } from './MobileMenu';
import { CartModal } from './CartModal';
import { cartService } from '../services/cartService';
import { scrollToSection, scrollToSectionFromOtherPage } from '../utils/scrollToSection';

const floatA = keyframes`
  0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.35; }
  50% { transform: translate3d(10px, -12px, 0) scale(1.05); opacity: 0.5; }
  100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.35; }
`;

const floatB = keyframes`
  0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.25; }
  50% { transform: translate3d(-12px, 10px, 0) scale(1.08); opacity: 0.4; }
  100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.25; }
`;

const HeaderContainer = styled.header<{ $isTransparent?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  background-color: transparent;
  transition: background-color 0.3s ease;
  overflow: visible;
`;

const GradientBar = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  background: linear-gradient(90deg, #ff3b81 0%, #7a5cff 50%, #00e6a7 100%);
  opacity: 0.9;
`;

const Glow = styled.div<{ $variant?: 'pink' | 'violet' | 'teal' }>`
  position: absolute;
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
  ${(p) => p.$variant === 'pink' && css`
    width: 180px; height: 180px; left: -40px; top: -40px;
    background: radial-gradient(35% 35% at 50% 50%, rgba(255,59,129,0.55) 0%, rgba(255,59,129,0) 80%);
    animation: ${floatA} 8s ease-in-out infinite;
  `}
  ${(p) => p.$variant === 'violet' && css`
    width: 220px; height: 220px; right: 15%; top: -60px;
    background: radial-gradient(35% 35% at 50% 50%, rgba(122,92,255,0.45) 0%, rgba(122,92,255,0) 80%);
    animation: ${floatB} 10s ease-in-out infinite;
  `}
  ${(p) => p.$variant === 'teal' && css`
    width: 240px; height: 240px; right: -60px; top: -80px;
    background: radial-gradient(35% 35% at 50% 50%, rgba(0,230,167,0.35) 0%, rgba(0,230,167,0) 80%);
    animation: ${floatA} 12s ease-in-out infinite;
  `}
`;



const MenuButton = styled.button<{ $dark?: boolean }>`
  background: none;
  border: none;
  
  color: black;
  font-size: 4em;
  cursor: pointer;
  padding: 0;
  width: 4em;
  height: 2em;
  display: none;
  align-items: center;
  
  // justify-content: center;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Navigation = styled.nav`
  padding-top: 3vw;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const NavSurface = styled.div<{ $isTransparent?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 12px 16px;
  border-radius: 14px;
  background: ${p => p.$isTransparent ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.06)'};
  border: 1px solid ${p => p.$isTransparent ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'};
  backdrop-filter: ${p => p.$isTransparent ? 'saturate(140%) blur(10px)' : 'blur(8px)'};

  @media (max-width: 900px) {
    gap: 16px;
    padding: 10px 12px;
    border-radius: 12px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  gap: 18px;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li``;

const NavLink = styled(Link)<{ $dark?: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  text-decoration: none;
  color: ${p => (p.$dark ? '#000' : '#fff')};
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 2vw;
  transition: transform 0.2s ease, color 0.2s ease, opacity 0.2s ease;
  opacity: 0.92;

  &:hover {
    transform: translateY(-1px);
    opacity: 1;
       color: #00338e;
  }

  &::after {
    content: '';
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 4px;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.25s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

// Убрали отдельную кнопку корзины — пункт «Корзина» теперь в навигации

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const isHomePage = location.pathname === '/' || location.pathname.startsWith('/product/');
  const isProductPage = location.pathname.startsWith('/product/');
  const isLegalPage = ['/offer', '/privacy', '/terms', '/privacy-policy'].includes(location.pathname);

  // Update cart count when component mounts or when cart changes
  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(cartService.getCartItemsCount());
    };

    updateCartCount();

    // Listen for cart changes
    const handleStorageChange = () => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom cart update events
    window.addEventListener('cartUpdated', updateCartCount);

    // Listen for cart open events
    const handleOpenCart = () => {
      setIsCartOpen(true);
    };
    window.addEventListener('openCart', handleOpenCart);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('openCart', handleOpenCart);
    };
  }, []);


  const handleScrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      scrollToSectionFromOtherPage(sectionId);
    } else {
      // Even on home page, wait a bit for lazy components to load
      setTimeout(() => {
        scrollToSection(sectionId).catch(console.warn);
      }, 100);
    }
  };

  const handleSectionClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    handleScrollToSection(sectionId);
  };

  return (
    <>
      <HeaderContainer $isTransparent={isHomePage}>
        <GradientBar />
        <Glow $variant="pink" />
        <Glow $variant="violet" />
        <Glow $variant="teal" />
        <MenuButton $dark={!isHomePage} onClick={() => setIsMobileMenuOpen(true)}>☰</MenuButton>
        <Navigation>
          <NavSurface $isTransparent={isHomePage || isLegalPage}>
            <NavList>
              {isLegalPage ? (
                <>
                  <NavItem>
                    <NavLink $dark={isHomePage || isLegalPage} to="/" onClick={(e) => {
                      e.preventDefault();
                      navigate('/');
                    }}>Главная</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink $dark={isHomePage || isLegalPage} to="#" onClick={(e) => handleSectionClick(e, 'products')}>Товары</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink $dark={isHomePage || isLegalPage} to="#" onClick={(e) => handleSectionClick(e, 'community')}>Комьюнити</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink $dark={isHomePage || isLegalPage} to="#" onClick={(e) => {
                      e.preventDefault();
                      setIsCartOpen(true);
                    }}>Корзина ({cartCount})</NavLink>
                  </NavItem>
                </>
              ) : (
                <>
                  {isProductPage && (
                    <NavItem>
                      <NavLink $dark={isHomePage} to="/" onClick={(e) => {
                        e.preventDefault();
                        navigate('/');
                      }}>Главная</NavLink>
                    </NavItem>
                  )}
                  <NavItem>
                    <NavLink $dark={isHomePage} to="#" onClick={(e) => handleSectionClick(e, 'products')}>Товары</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink $dark={isHomePage} to="#" onClick={(e) => handleSectionClick(e, 'community')}>Комьюнити</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink $dark={isHomePage} to="#" onClick={(e) => {
                      e.preventDefault();
                      setIsCartOpen(true);
                    }}>Корзина ({cartCount})</NavLink>
                  </NavItem>
                </>
              )}
            </NavList>
          </NavSurface>
        </Navigation>
      </HeaderContainer>
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}; 