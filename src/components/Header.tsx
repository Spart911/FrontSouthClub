import styled from 'styled-components';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useState, useEffect } from 'react';
import { CartSidebar } from './CartSidebar';
import { MobileMenu } from './MobileMenu';

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
  background-color: ${props => props.$isTransparent ? 'transparent' : 'black'};
  transition: background-color 0.3s ease;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;

  @media (max-width: 768px) {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 2em;
  cursor: pointer;
  padding: 0;
  width: 2em;
  height: 2em;
  display: none;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 40px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  gap: 40px;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  a {
    color: white;
    text-decoration: none;
    font-size: 1rem;
    opacity: 1;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1rem;
  opacity: 1;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const CartButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 40px;
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: rgb(0, 133, 91);
  color: white;
  font-size: 0.8rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-buch), "Helvetica", sans-serif;
`;

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    if (location.pathname === '/checkout') {
      const event = new CustomEvent('navigationAttempt', { detail: { path } });
      window.dispatchEvent(event);
    } else {
      navigate(path);
    }
    setIsMobileMenuOpen(false);
  };

  const handleShopClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/checkout') {
      const event = new CustomEvent('navigationAttempt', { detail: { path: '/' } });
      window.dispatchEvent(event);
    } else {
      navigate('/');
      setTimeout(() => {
        const productsSection = document.querySelector('.product-section');
        if (productsSection) {
          const offset = 80; // Отступ в пикселях
          const elementPosition = productsSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  return (
    <>
      <HeaderContainer $isTransparent={isHomePage && !isScrolled}>
        <MenuButton onClick={() => setIsMobileMenuOpen(true)}>☰</MenuButton>
        <Logo onClick={() => handleNavigation('/')}>LUMNI</Logo>
        <Navigation>
          <NavList>
            <NavItem>
              <NavLink to="/" onClick={handleShopClick}>Магазин</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/made" onClick={(e) => {
                e.preventDefault();
                handleNavigation('/made');
              }}>Производство</NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/about" onClick={(e) => {
                e.preventDefault();
                handleNavigation('/about');
              }}>О нас</NavLink>
            </NavItem>
          </NavList>
        </Navigation>
        <CartButton onClick={() => setIsCartOpen(true)}>
          <svg width="2em" height="2em" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 0 16 16" role="img" cursor="pointer" opacity="1" aria-hidden="false" aria-label="payment:shopping_bag">
            <path d="M6.75 4a1.25 1.25 0 1 1 2.5 0h1.5a2.75 2.75 0 0 0-5.5 0h1.5zm6.55 1H2.8v10h10.5V5z"></path>
          </svg>
          {totalItems > 0 && <CartCount>{totalItems}</CartCount>}
        </CartButton>
      </HeaderContainer>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
}; 