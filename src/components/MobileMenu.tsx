import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CartModal } from './CartModal';
import { cartService } from '../services/cartService';
import { scrollToSection, scrollToSectionFromOtherPage } from '../utils/scrollToSection';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 1000;
`;

const MenuContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 50%;
  max-width: 300px;
  height: 100vh;
  background-color: white;
  transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
  transition: transform 0.3s ease;
  z-index: 1001;
  padding: 2rem;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 4rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 700;
  cursor: pointer;
  padding: 0.5rem;
  color: #000;
  outline: none;
  transition: all 0.3s ease;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background: #f0f0f0;
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  // margin: 2rem 0 0 0;
`;

const MenuItem = styled.li`
  margin-bottom: 1.5rem;
`;

const MenuLink = styled(Link)`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 2rem;
  color: #000;
  letter-spacing: 1px;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #666;
  }
`;

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const isLegalPage = ['/offer', '/privacy', '/terms', '/privacy-policy'].includes(location.pathname);
  const isProductPage = location.pathname.startsWith('/product/');

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

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);


  const handleScrollToSection = (sectionId: string) => {
    onClose(); // Close menu first
    
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

  const handleShopClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleScrollToSection('products');
  };

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={onClose} />
      <MenuContainer $isOpen={isOpen}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <MenuList>
          {(isLegalPage || isProductPage) && (
            <MenuItem>
              <MenuLink to="/" onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}>Главная</MenuLink>
            </MenuItem>
          )}
          <MenuItem>
            <MenuLink to="/" onClick={handleShopClick}>Товары</MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to="/" onClick={(e) => {
              e.preventDefault();
              handleScrollToSection('community');
            }}>Комьюнити</MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to="/" onClick={(e) => {
              e.preventDefault();
              handleScrollToSection('feedback');
            }}>Обратная связь</MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to="#" onClick={(e) => {
              e.preventDefault();
              setIsCartOpen(true);
            }}>Корзина ({cartCount})</MenuLink>
          </MenuItem>
        </MenuList>
      </MenuContainer>
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}; 