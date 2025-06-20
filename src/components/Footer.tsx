import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background: white;
  padding: 40px 0;
  border-top: 1px solid #E5E5E5;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const FooterLink = styled(Link)`
  color: #666;
  text-decoration: none;
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 0.9rem;
  transition: color 0.3s;

  &:hover {
    color: rgb(0, 133, 91);
  }
`;

const FooterText = styled.p`
  color: #666;
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 0.9rem;
  margin: 0;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterText>© 2025 Все права защищены</FooterText>
        <FooterLinks>
          <FooterLink to="/contacts">Контакты</FooterLink>
          <FooterLink to="/privacy-policy">Политика конфиденциальности</FooterLink>
          <FooterLink to="/terms">Пользовательское соглашение</FooterLink>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 