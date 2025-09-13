import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  max-height: 95vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2`
  font-size: 2.4rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 900;
  text-align: center;
  margin-bottom: 20px;
  color: #000;
`;

const Text = styled.p`
  font-size: 1.6rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  line-height: 1.5;
  margin-bottom: 20px;
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1.6rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.$variant === 'primary' ? `
    background: #000;
    color: white;
    
    &:hover {
      background: #333;
    }
  ` : `
    background: #f5f5f5;
    color: #333;
    border: 1px solid #ddd;
    
    &:hover {
      background: #e5e5e5;
    }
  `}
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 20px 0;
  cursor: pointer;
`;

const Checkbox = styled.input`
  margin: 0;
  transform: scale(1.2);
`;

const CheckboxText = styled.span`
  font-size: 1.4rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  line-height: 1.4;
  color: #333;
`;

interface ConsentModalProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ onAccept, onDecline }) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Overlay>
      <Modal>
        <Title>Согласие на обработку персональных данных</Title>
        
        <Text>
          Мы используем файлы cookie и другие технологии для улучшения работы сайта, 
          анализа трафика и персонализации контента. Продолжая использовать наш сайт, 
          вы соглашаетесь с обработкой ваших персональных данных.
        </Text>
        
        <Text>
          Подробная информация о том, как мы обрабатываем ваши данные, 
          содержится в нашей <a href="/privacy" target="_blank" style={{ color: '#000', textDecoration: 'underline' }}>Политике конфиденциальности</a>.
        </Text>
        
        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <CheckboxText>
            Я согласен(на) на обработку персональных данных и использование файлов cookie
          </CheckboxText>
        </CheckboxContainer>
        
        <ButtonGroup>
          <Button $variant="secondary" onClick={onDecline}>
            Отклонить
          </Button>
          <Button 
            $variant="primary" 
            onClick={onAccept}
            disabled={!isChecked}
            style={{ 
              opacity: isChecked ? 1 : 0.5, 
              cursor: isChecked ? 'pointer' : 'not-allowed' 
            }}
          >
            Принять
          </Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};


