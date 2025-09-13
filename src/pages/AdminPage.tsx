import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { apiService } from '../services/api';
import AdminLogin from './AdminLogin';
import AdminProducts from './AdminProducts';
import AdminSlider from './AdminSlider';

const AdminContainer = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
`;

const AdminHeader = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const AdminTitle = styled.h1`
  font-size: 2rem;
  color: #1e3ea8;
  margin: 0 0 10px 0;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
`;

const AdminSubtitle = styled.p`
  color: #666;
  margin: 0;
`;

const AdminNav = styled.nav`
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 20px;
`;

const NavItem = styled.li<{ $active: boolean }>`
  a {
    text-decoration: none;
    color: ${props => props.$active ? '#1e3ea8' : '#666'};
    font-weight: ${props => props.$active ? 'bold' : 'normal'};
    padding: 10px 20px;
    border-radius: 4px;
    background: ${props => props.$active ? '#f0f4ff' : 'transparent'};
    transition: all 0.2s ease;
    
    &:hover {
      background: #f0f4ff;
      color: #1e3ea8;
    }
  }
`;

const AdminContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const LogoutButton = styled.button`
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-left: auto;
  
  &:hover {
    background: #c82333;
  }
`;

type AdminSection = 'products' | 'slider';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<AdminSection>('products');

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = apiService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <AdminContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px',
          fontSize: '18px',
          color: '#1e3ea8'
        }}>
          Загрузка...
        </div>
      </AdminContainer>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminContainer>
      <AdminHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <AdminTitle>Админ панель SOUTH CLUB</AdminTitle>
            <AdminSubtitle>Управление товарами и контентом</AdminSubtitle>
          </div>
          <LogoutButton onClick={handleLogout}>
            Выйти
          </LogoutButton>
        </div>
      </AdminHeader>

      <AdminNav>
        <NavList>
          <NavItem $active={activeSection === 'products'}>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('products'); }}>
              Товары
            </a>
          </NavItem>
          <NavItem $active={activeSection === 'slider'}>
            <a href="#" onClick={(e) => { e.preventDefault(); setActiveSection('slider'); }}>
              Слайдер
            </a>
          </NavItem>
        </NavList>
      </AdminNav>

      <AdminContent>
        {activeSection === 'products' && <AdminProducts />}
        {activeSection === 'slider' && <AdminSlider />}
      </AdminContent>
    </AdminContainer>
  );
};

export default AdminPage;
