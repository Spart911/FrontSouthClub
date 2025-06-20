import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';

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
  width: 80%;
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
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  color: #000;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0 0 0;
`;

const MenuItem = styled.li`
  margin-bottom: 1.5rem;
`;

const MenuLink = styled(Link)`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.2rem;
  color: #000;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #666;
  }
`;

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    if (location.pathname === '/checkout') {
      const event = new CustomEvent('navigationAttempt', { detail: { path } });
      window.dispatchEvent(event);
    } else {
      navigate(path);
    }
    onClose();
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
    onClose();
  };

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={onClose} />
      <MenuContainer $isOpen={isOpen}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <MenuList>
          <MenuItem>
            <MenuLink to="/" onClick={handleShopClick}>Магазин</MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to="/made" onClick={(e) => {
              e.preventDefault();
              handleNavigation('/made');
            }}>Производство</MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink to="/about" onClick={(e) => {
              e.preventDefault();
              handleNavigation('/about');
            }}>О нас</MenuLink>
          </MenuItem>
        </MenuList>
      </MenuContainer>
    </>
  );
}; 