import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const PageWrapper = styled.div`
  background: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Container = styled.div`
  max-width: 600px;
  width: 100%;
  text-align: center;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: rgb(0, 133, 91);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  
  svg {
    width: 40px;
    height: 40px;
    fill: white;
  }
`;

const Title = styled.h1`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 2rem;
  color: #000;
  margin-bottom: 20px;
`;

const Message = styled.p`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.5;
`;

const OrderInfo = styled.div`
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
`;

const DeliveryInfo = styled.p`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  color: #666;
  margin-bottom: 5px;
`;

const Button = styled.button`
  padding: 15px 30px;
  background: rgb(0, 133, 91);
  color: white;
  border: none;
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 4px;

  &:hover {
    background: rgb(3, 161, 111);
  }
`;

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const deliveryTime = searchParams.get('delivery_time');
  const address = searchParams.get('address');
  const totalAmount = searchParams.get('total_amount');

  return (
    <PageWrapper>
      <Container>
        <SuccessIcon>
          <svg viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
        </SuccessIcon>
        <Title>Оплата прошла успешно!</Title>
        <Message>
          Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время для подтверждения.
        </Message>
        <OrderInfo>
          {deliveryTime && (
            <DeliveryInfo>
              Дата доставки: {new Date(deliveryTime).toLocaleDateString('ru-RU')}
            </DeliveryInfo>
          )}
          {address && (
            <DeliveryInfo>
              Адрес доставки: {address}
            </DeliveryInfo>
          )}
          {totalAmount && (
            <DeliveryInfo>
              Сумма заказа: {Number(totalAmount).toLocaleString()} ₽
            </DeliveryInfo>
          )}
        </OrderInfo>
        <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
      </Container>
    </PageWrapper>
  );
};

export default SuccessPage; 