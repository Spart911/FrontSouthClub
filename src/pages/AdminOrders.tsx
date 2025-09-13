import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { apiService, Order, OrderListResponse, OrderStatistics } from '../services/api';
import OrderStatusTracker from '../components/OrderStatusTracker';

const Container = styled.div`
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
`;

const Title = styled.h1`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  letter-spacing: 0.1em;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  text-align: center;
`;

const StatValue = styled.div`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 2.4rem;
  font-weight: 700;
  color: #1e3ea8;
  margin-bottom: 8px;
  letter-spacing: 0.05em;
`;

const StatLabel = styled.div`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.4rem;
  color: #6c757d;
  letter-spacing: 0.05em;
`;

const Controls = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  align-items: center;
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.4rem;
  background: white;
  letter-spacing: 0.05em;
  
  &:focus {
    outline: none;
    border-color: #1e3ea8;
  }
`;

const Button = styled.button`
  background: #1e3ea8;
  color: white;
  border: none;
  padding: 12px 24px;
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

const OrdersTable = styled.div`
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 0.05em;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: #f8f9fa;
  }
`;

const TableCell = styled.div`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.3rem;
  color: #2c3e50;
  letter-spacing: 0.05em;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 1.1rem;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.6rem;
  letter-spacing: 0.05em;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 10px 15px;
  border: 2px solid ${props => props.active ? '#1e3ea8' : '#e9ecef'};
  background: ${props => props.active ? '#1e3ea8' : 'white'};
  color: ${props => props.active ? 'white' : '#6c757d'};
  border-radius: 8px;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.05em;
  
  &:hover {
    border-color: #1e3ea8;
    color: #1e3ea8;
    background: white;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statistics, setStatistics] = useState<OrderStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pageSize] = useState(10);

  const loadOrders = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: OrderListResponse = await apiService.getAllOrders(page, pageSize);
      setOrders(response.orders);
      setTotalPages(Math.ceil(response.total / pageSize));
      setCurrentPage(page);
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err);
      setError('Не удалось загрузить заказы');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await apiService.getOrderStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err);
    }
  };

  useEffect(() => {
    loadOrders();
    loadStatistics();
  }, []);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const handlePageChange = (page: number) => {
    loadOrders(page);
  };

  const handleRefresh = () => {
    loadOrders(currentPage);
    loadStatistics();
  };

  return (
    <Container>
      <Header>
        <Title>Управление Заказами</Title>
        <Button onClick={handleRefresh} disabled={loading}>
          {loading && <LoadingSpinner />}
          Обновить
        </Button>
      </Header>

      {statistics && (
        <StatsGrid>
          <StatCard>
            <StatValue>{statistics.total_orders}</StatValue>
            <StatLabel>Всего заказов</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{statistics.total_revenue} RUB</StatValue>
            <StatLabel>Общая выручка</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{statistics.pending_orders}</StatValue>
            <StatLabel>Ожидают оплаты</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{statistics.processing_orders}</StatValue>
            <StatLabel>В обработке</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{statistics.delivered_orders}</StatValue>
            <StatLabel>Доставлено</StatLabel>
          </StatCard>
        </StatsGrid>
      )}

      <Controls>
        <Select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Все статусы</option>
          <option value="pending">Ожидает оплаты</option>
          <option value="paid">Оплачен</option>
          <option value="processing">В обработке</option>
          <option value="shipped">Отправлен</option>
          <option value="delivered">Доставлен</option>
          <option value="cancelled">Отменен</option>
        </Select>
      </Controls>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading ? (
        <EmptyState>
          <LoadingSpinner />
          Загрузка заказов...
        </EmptyState>
      ) : filteredOrders.length === 0 ? (
        <EmptyState>
          Заказы не найдены
        </EmptyState>
      ) : (
        <>
          <OrdersTable>
            <TableHeader>
              <div>Номер заказа</div>
              <div>Клиент</div>
              <div>Сумма</div>
              <div>Статус</div>
              <div>Дата создания</div>
              <div>Действия</div>
            </TableHeader>
            
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.order_number}</TableCell>
                <TableCell>
                  <div>{order.customer_name}</div>
                  <div style={{ fontSize: '1.1rem', color: '#6c757d' }}>
                    {order.customer_email}
                  </div>
                </TableCell>
                <TableCell>{order.total_amount} RUB</TableCell>
                <TableCell>
                  <StatusBadge status={order.status}>
                    {getStatusText(order.status)}
                  </StatusBadge>
                </TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>
                  <OrderStatusTracker 
                    orderId={order.id} 
                    autoRefresh={true}
                    refreshInterval={60000}
                  />
                </TableCell>
              </TableRow>
            ))}
          </OrdersTable>

          {totalPages > 1 && (
            <Pagination>
              <PageButton 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Назад
              </PageButton>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PageButton
                  key={page}
                  active={page === currentPage}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PageButton>
              ))}
              
              <PageButton 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Вперед
              </PageButton>
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default AdminOrders;
