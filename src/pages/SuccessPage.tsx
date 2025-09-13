import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { apiService, Order } from '../services/api';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
`;

const SuccessCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4CAF50, #45a049);
  }
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #4CAF50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  font-size: 40px;
  color: white;
  animation: bounce 0.6s ease-in-out;
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
`;

const Title = styled.h1`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 20px;
  letter-spacing: 0.1em;
`;

const Subtitle = styled.p`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.6rem;
  color: #7f8c8d;
  margin: 0 0 30px;
  line-height: 1.6;
  letter-spacing: 0.05em;
`;

const OrderInfo = styled.div`
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
  margin: 30px 0;
  text-align: left;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-size: 1.4rem;
  color: #6c757d;
  font-weight: 500;
  letter-spacing: 0.05em;
`;

const InfoValue = styled.span`
  font-size: 1.4rem;
  color: #2c3e50;
  font-weight: 600;
  letter-spacing: 0.05em;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  
  ${props => {
    switch (props.status) {
      case 'paid':
        return `
          background: #d4edda;
          color: #155724;
        `;
      case 'pending':
        return `
          background: #fff3cd;
          color: #856404;
        `;
      case 'processing':
        return `
          background: #cce5ff;
          color: #004085;
        `;
      default:
        return `
          background: #f8d7da;
          color: #721c24;
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 30px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.05em;
  min-width: 150px;
  
  ${props => props.variant === 'primary' ? `
    background: #1e3ea8;
    color: white;
    
    &:hover {
      background: #152a7a;
      transform: translateY(-2px);
    }
  ` : `
    background: #f8f9fa;
    color: #6c757d;
    border: 2px solid #e9ecef;
    
    &:hover {
      background: #e9ecef;
      color: #495057;
      transform: translateY(-2px);
    }
  `}
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1e3ea8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.4rem;
  letter-spacing: 0.05em;
`;

const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('order_id');
  const orderNumber = searchParams.get('order_number');

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Номер заказа не найден');
        setLoading(false);
        return;
      }

      try {
        const orderData = await apiService.getOrder(orderId);
        setOrder(orderData);
      } catch (err) {
        console.error('Ошибка загрузки заказа:', err);
        setError('Не удалось загрузить информацию о заказе');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'Ожидает оплаты',
      'paid': 'Оплачен',
      'processing': 'В обработке',
      'shipped': 'Отправлен',
      'delivered': 'Доставлен',
      'cancelled': 'Отменен'
    };
    return statusMap[status] || status;
  };

  const handleTrackOrder = () => {
    if (order?.customer_email) {
      navigate(`/orders?email=${encodeURIComponent(order.customer_email)}`);
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Container>
        <SuccessCard>
          <LoadingSpinner />
          <Title>Загрузка...</Title>
          <Subtitle>Получаем информацию о вашем заказе</Subtitle>
        </SuccessCard>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <SuccessCard>
          <SuccessIcon>⚠️</SuccessIcon>
          <Title>Ошибка</Title>
          <ErrorMessage>{error}</ErrorMessage>
          <ActionButtons>
            <Button onClick={handleContinueShopping}>
              Вернуться на главную
            </Button>
          </ActionButtons>
        </SuccessCard>
      </Container>
    );
  }

  return (
    <Container>
      <SuccessCard>
        <SuccessIcon>✓</SuccessIcon>
        <Title>Заказ Оформлен!</Title>
        <Subtitle>
          Спасибо за ваш заказ! Мы получили вашу заявку и свяжемся с вами в ближайшее время.
        </Subtitle>

        {order && (
          <OrderInfo>
            <InfoRow>
              <InfoLabel>Номер заказа:</InfoLabel>
              <InfoValue>{order.order_number}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Статус:</InfoLabel>
              <StatusBadge status={order.status}>
                {getStatusText(order.status)}
              </StatusBadge>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Сумма заказа:</InfoLabel>
              <InfoValue>{order.total_amount} RUB</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Способ оплаты:</InfoLabel>
              <InfoValue>
                {order.payment_method === 'yookassa' ? 'ЮKassa' : 'Наличные'}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Дата создания:</InfoLabel>
              <InfoValue>
                {new Date(order.created_at).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </InfoValue>
            </InfoRow>
          </OrderInfo>
        )}

        <ActionButtons>
          <Button variant="primary" onClick={handleTrackOrder}>
            Отследить заказ
          </Button>
          <Button onClick={handleContinueShopping}>
            Продолжить покупки
          </Button>
        </ActionButtons>
      </SuccessCard>
    </Container>
  );
};

export default SuccessPage;

