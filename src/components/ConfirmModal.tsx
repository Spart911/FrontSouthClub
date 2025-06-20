import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  position: relative;
`;

const Title = styled.h2`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.5rem;
  color: #000;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button<{ $isPrimary?: boolean }>`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  padding: 0.8rem 1.6rem;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s ease;
  flex: 1;
  text-transform: uppercase;
  letter-spacing: 1.2px;

  ${props => props.$isPrimary ? `
    background: rgb(0, 133, 91);
    color: white;
  ` : `
    background: #000;
    color: white;
  `}

  &:hover {
    opacity: 0.8;
  }
`;

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <ModalContainer>
        <Title>Подтверждение выхода</Title>
        <Text>
          Вы уверены, что хотите покинуть страницу оформления заказа? 
          Все введенные данные будут утеряны.
        </Text>
        <ButtonGroup>
          <Button onClick={onCancel}>Отмена</Button>
          <Button $isPrimary onClick={onConfirm}>Выйти</Button>
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  );
}; 