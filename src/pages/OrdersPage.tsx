import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { apiService } from '../services/api';
import type { Order, OrderListResponse } from '../services/api';

const Container = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  padding: 40px 20px;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 3.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 20px;
  letter-spacing: 0.1em;
`;

const Subtitle = styled.p`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.6rem;
  color: #7f8c8d;
  margin: 0;
  letter-spacing: 0.05em;
`;

const SearchForm = styled.form`
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 600;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.4rem;
  letter-spacing: 0.05em;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #1e3ea8;
  }
`;

const Button = styled.button`
  background: #1e3ea8;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.05em;
  
  &:hover {
    background: #152a7a;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
  }
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

const OrdersList = styled.div`
  display: grid;
  gap: 20px;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
`;

const OrderNumber = styled.h3`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  letter-spacing: 0.05em;
`;

const OrderDate = styled.span`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.2rem;
  color: #7f8c8d;
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
      case 'shipped':
        return `
          background: #d1ecf1;
          color: #0c5460;
        `;
      case 'delivered':
        return `
          background: #d4edda;
          color: #155724;
        `;
      default:
        return `
          background: #f8d7da;
          color: #721c24;
        `;
    }
  }}
`;

const OrderDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.span`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.2rem;
  color: #6c757d;
  margin-bottom: 5px;
  letter-spacing: 0.05em;
`;

const DetailValue = styled.span`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.4rem;
  color: #2c3e50;
  font-weight: 600;
  letter-spacing: 0.05em;
`;

const ItemsList = styled.div`
  margin-top: 20px;
`;

const ItemsTitle = styled.h4`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.4rem;
  color: #2c3e50;
  margin: 0 0 15px;
  letter-spacing: 0.05em;
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.span`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.3rem;
  color: #2c3e50;
  font-weight: 600;
  letter-spacing: 0.05em;
`;

const ItemDetails = styled.span`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-left: 10px;
  letter-spacing: 0.05em;
`;

const ItemPrice = styled.span`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.3rem;
  color: #2c3e50;
  font-weight: 600;
  letter-spacing: 0.05em;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const EmptyTitle = styled.h3`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 2rem;
  color: #6c757d;
  margin: 0 0 10px;
  letter-spacing: 0.05em;
`;

const EmptyText = styled.p`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.4rem;
  color: #adb5bd;
  margin: 0;
  letter-spacing: 0.05em;
`;

const OrdersPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (email) {
      handleSearch();
    }
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!email.trim()) {
      setError('Введите email для поиска заказов');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response: OrderListResponse = await apiService.getOrdersByEmail(email);
      setOrders(response.orders);
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err);
      setError('Не удалось загрузить заказы. Проверьте правильность email.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

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

  const getSizeLabel = (size: number) => {
    const sizeLabels = ['XS', 'S', 'M', 'L', 'XL'];
    return sizeLabels[size] || `Размер ${size}`;
  };

  return (
    <Container>
      <Content>
        <Header>
          <Title>Отслеживание Заказов</Title>
          <Subtitle>Введите ваш email для просмотра истории заказов</Subtitle>
        </Header>

        <SearchForm onSubmit={handleSearch}>
          <FormGroup>
            <Label htmlFor="email">Email адрес</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </FormGroup>
          <Button type="submit" disabled={loading}>
            {loading && <LoadingSpinner />}
            {loading ? 'Поиск...' : 'Найти заказы'}
          </Button>
        </SearchForm>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        {hasSearched && !loading && orders.length === 0 && !error && (
          <EmptyState>
            <EmptyIcon>📦</EmptyIcon>
            <EmptyTitle>Заказы не найдены</EmptyTitle>
            <EmptyText>По указанному email заказы не найдены</EmptyText>
          </EmptyState>
        )}

        {orders.length > 0 && (
          <OrdersList>
            {orders.map((order) => (
              <OrderCard key={order.id}>
                <OrderHeader>
                  <div>
                    <OrderNumber>Заказ #{order.order_number}</OrderNumber>
                    <OrderDate>
                      {new Date(order.created_at).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </OrderDate>
                  </div>
                  <StatusBadge status={order.status}>
                    {getStatusText(order.status)}
                  </StatusBadge>
                </OrderHeader>

                <OrderDetails>
                  <DetailItem>
                    <DetailLabel>Сумма заказа</DetailLabel>
                    <DetailValue>{order.total_amount} RUB</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Способ оплаты</DetailLabel>
                    <DetailValue>
                      {order.payment_method === 'yookassa' ? 'ЮKassa' : 'Наличные'}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Адрес доставки</DetailLabel>
                    <DetailValue>{order.delivery_address}</DetailValue>
                  </DetailItem>
                </OrderDetails>

                <ItemsList>
                  <ItemsTitle>Товары в заказе:</ItemsTitle>
                  {order.items.map((item, index) => (
                    <ItemRow key={index}>
                      <ItemInfo>
                        <ItemName>Товар ID: {item.product_id}</ItemName>
                        <ItemDetails>
                          Размер: {getSizeLabel(item.size)}, Количество: {item.quantity}
                        </ItemDetails>
                      </ItemInfo>
                      <ItemPrice>{item.price * item.quantity} RUB</ItemPrice>
                    </ItemRow>
                  ))}
                </ItemsList>
              </OrderCard>
            ))}
          </OrdersList>
        )}
      </Content>
    </Container>
  );
};

export default OrdersPage;
