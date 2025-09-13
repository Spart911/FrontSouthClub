import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background: #ffffff;
  color: #000;
  padding: 40px 20px;
  border-top: 1px solid #e0e0e0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

const LinksContainer = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const FooterLink = styled(Link)`
  text-decoration: none;
  color: #000;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.6rem;
  font-weight: 600;
  transition: color 0.3s ease;
  
  &:hover {
    color: #666;
  }
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: #e0e0e0;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Copyright = styled.div`
  text-align: center;
  color: #666;
  font-family: 'Helvetica', sans-serif;
  font-size: 0.8rem;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <Container>
        <LinksContainer>
          <FooterLink to="/offer">Оферта</FooterLink>
          <Divider />
          <FooterLink to="/privacy">Политика конфиденциальности</FooterLink>
          <Divider />
          <FooterLink to="/terms">Пользовательское соглашение</FooterLink>
        </LinksContainer>
        <Copyright>© 2025 SOUTH CLUB. Все права защищены.</Copyright>
      </Container>
    </FooterContainer>
  );
};

export default Footer;