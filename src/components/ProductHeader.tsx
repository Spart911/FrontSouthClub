import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: black;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
`;

const Logo = styled.div`
  color: white;
  text-decoration: none;
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.5rem;
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

const CartButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

export const ProductHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleShopClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
    // Добавляем небольшую задержку, чтобы страница успела загрузиться
    setTimeout(() => {
      const productsSection = document.querySelector('.product-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <HeaderContainer>
      <Logo onClick={() => navigate('/')}>LUMNI</Logo>
      <Nav>
        <NavLink to="/" onClick={handleShopClick}>Магазин</NavLink>
        <NavLink to="/made">Производство</NavLink>
        <NavLink to="/about">О нас</NavLink>
      </Nav>
      <CartButton>Cart (0)</CartButton>
    </HeaderContainer>
  );
}; 