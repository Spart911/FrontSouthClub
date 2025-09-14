import React from 'react';
import styled from 'styled-components';

const Banner = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #000;
  color: white;
  padding: 15px 20px;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
`;

const Text = styled.p`
  font-size: 1.4rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  margin: 0;
  flex: 1;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 1.4rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  ${props => props.$variant === 'primary' ? `
    background: white;
    color: #000;
    
    &:hover {
      background: #f0f0f0;
    }
  ` : `
    background: transparent;
    color: white;
    border: 1px solid white;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `}
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    padding: 10px 20px;
    flex: 1;
  }
`;

interface ConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
  onSettings: () => void;
}

export const ConsentBanner: React.FC<ConsentBannerProps> = ({ 
  onAccept, 
  onDecline, 
  onSettings 
}) => {
  return (
    <Banner>
      <Text>
        Мы используем файлы cookie для улучшения работы сайта. 
        Продолжая использование, вы соглашаетесь с нашей политикой.
      </Text>
      <ButtonGroup>
        <Button $variant="secondary" onClick={onSettings}>
          Подробнее
        </Button>
        <Button $variant="primary" onClick={onAccept}>
          Принять все
        </Button>
      </ButtonGroup>
    </Banner>
  );
};


