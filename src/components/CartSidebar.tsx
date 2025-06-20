import React from 'react';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types/product';

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 1000;
`;

const Sidebar = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 480px;
  height: 100vh;
  background: white;
  transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #E5E5E5;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  font-size: 24px;
  color: #000;
  width: 30px;
  height: 30px;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: #666;
  }
`;

const Title = styled.h2`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.5rem;
  margin: 0;
  color: #000;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  padding-bottom: calc(200px + env(safe-area-inset-bottom, 0));

  @media (max-width: 768px) {
    padding-bottom: calc(250px + env(safe-area-inset-bottom, 0));
  }
`;

const CartItem = styled.div`
  display: flex;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E5E5E5;
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.2rem;
  margin: 0 0 5px 0;
  color: #000;
`;

const ItemColor = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ColorCircle = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  background-color: ${props => props.$color};
  border: 1px solid #E5E5E5;
`;

const ColorName = styled.p`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  color: #666;
  margin: 0;
`;

const ItemPrice = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
`;

const PricePerItem = styled.p`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  color: #666;
  margin: 0;
`;

const TotalPrice = styled.p`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.2rem;
  color: #000;
  margin: 0;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 20px;
`;

const QuantityButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: #666;
  font-size: 1.2rem;
`;

const Quantity = styled.span`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  color: #000;
`;

const Footer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid #eee;
  background: white;
  position: sticky;
  bottom: 0;
  margin-bottom: env(safe-area-inset-bottom, 0);
  padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0));

  @media (max-width: 768px) {
    padding-bottom: calc(2rem + env(safe-area-inset-bottom, 0));
  }
`;

const Summary = styled.div`
  margin-bottom: 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-family: var(--font-buch), "Helvetica", sans-serif;
`;

const SummaryLabel = styled.span`
  color: #666;
`;

const SummaryValue = styled.span`
  color: #000;
  font-weight: bold;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 15px;
  background: rgb(0, 133, 91);
  color: white;
  border: none;
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background: rgb(3, 161, 111);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const DeliveryDate = styled.div`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
`;

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const getDeliveryDate = (totalItems: number) => {
  const date = new Date();
  // Базовая неделя + дополнительный день для каждой лампы
  date.setDate(date.getDate() + 7 + (totalItems - 1));
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long'
  });
};

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { getCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const cartItems = getCart();

  const handleQuantityChange = (productId: string, selectedColor: number, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(productId, selectedColor, newQuantity);
    } else {
      removeFromCart(productId, selectedColor);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
      onClose();
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shipping = 500;
  const total = subtotal + shipping;

  // Подсчитываем общее количество товаров в корзине
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={onClose} />
      <Sidebar $isOpen={isOpen}>
        <Header>
          <Title>Корзина</Title>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>
        <Content>
          {totalItems > 0 && (
          <DeliveryDate>
            Доставка {getDeliveryDate(totalItems)}
          </DeliveryDate>
          )}
          {cartItems.map((item) => (
            <CartItem key={`${item.product.id}-${item.selectedColor}`}>
              <ItemImage src={item.product.colors[item.selectedColor].mainImage} alt={item.product.name} />
              <ItemInfo>
                <ItemDetails>
                  <ItemName>{item.product.name}</ItemName>
                  <ItemColor>
                    <ColorCircle $color={item.product.colors[item.selectedColor].color} />
                    <ColorName>{item.product.colors[item.selectedColor].name}</ColorName>
                  </ItemColor>
                  <ItemPrice>
                    <PricePerItem>{item.product.price.toLocaleString()} ₽</PricePerItem>
                    <TotalPrice>{(item.product.price * item.quantity).toLocaleString()} ₽</TotalPrice>
                  </ItemPrice>
                </ItemDetails>
                <QuantityControl>
                  <QuantityButton onClick={() => handleQuantityChange(item.product.id, item.selectedColor, item.quantity - 1)}>-</QuantityButton>
                  <Quantity>{item.quantity}</Quantity>
                  <QuantityButton onClick={() => handleQuantityChange(item.product.id, item.selectedColor, item.quantity + 1)}>+</QuantityButton>
                </QuantityControl>
              </ItemInfo>
            </CartItem>
          ))}
        </Content>
        <Footer>
          <Summary>
            <SummaryRow>
              <SummaryLabel>Товары ({cartItems.reduce((total, item) => total + item.quantity, 0)})</SummaryLabel>
              <SummaryValue>{cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0).toLocaleString()} ₽</SummaryValue>
            </SummaryRow>
            {cartItems.length > 0 && (
              <>
            <SummaryRow>
              <SummaryLabel>Доставка</SummaryLabel>
              <SummaryValue>{shipping.toLocaleString()} ₽</SummaryValue>
            </SummaryRow>
                <DeliveryDate>
                  Доставка {getDeliveryDate(cartItems.reduce((total, item) => total + item.quantity, 0))}
                </DeliveryDate>
              </>
            )}
            <SummaryRow>
              <SummaryLabel>Итого</SummaryLabel>
              <SummaryValue>{cartItems.length > 0 ? total.toLocaleString() : '0'} ₽</SummaryValue>
            </SummaryRow>
          </Summary>
          <CheckoutButton 
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Оформить заказ
          </CheckoutButton>
        </Footer>
      </Sidebar>
    </>
  );
}; 