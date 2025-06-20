import React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const StyledButton = styled.button<ButtonProps>`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.variant === 'secondary' ? '#f5f5f5' : '#000'};
  color: ${props => props.variant === 'secondary' ? '#000' : '#fff'};

  &:hover {
    background-color: ${props => props.variant === 'secondary' ? '#e5e5e5' : '#333'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  return (
    <StyledButton variant={variant} {...props}>
      {children}
    </StyledButton>
  );
}; 