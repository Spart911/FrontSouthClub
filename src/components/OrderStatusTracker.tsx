import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { apiService, OrderStatus } from '../services/api';

interface OrderStatusTrackerProps {
  orderId: string;
  onStatusChange?: (status: OrderStatus) => void;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 1px solid #e9ecef;
`;

const StatusIndicator = styled.div<{ status: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  
  ${props => {
    switch (props.status) {
      case 'paid':
        return `
          background: #28a745;
          box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
        `;
      case 'pending':
        return `
          background: #ffc107;
          box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.2);
        `;
      case 'processing':
        return `
          background: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
        `;
      case 'shipped':
        return `
          background: #17a2b8;
          box-shadow: 0 0 0 3px rgba(23, 162, 184, 0.2);
        `;
      case 'delivered':
        return `
          background: #28a745;
          box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
        `;
      default:
        return `
          background: #6c757d;
          box-shadow: 0 0 0 3px rgba(108, 117, 125, 0.2);
        `;
    }
  }}
`;

const StatusText = styled.div`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 0.05em;
`;

const LastUpdated = styled.div`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.2rem;
  color: #6c757d;
  margin-left: auto;
  letter-spacing: 0.05em;
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #1e3ea8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.2rem;
  color: #dc3545;
  letter-spacing: 0.05em;
`;

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  orderId,
  onStatusChange,
  autoRefresh = false,
  refreshInterval = 30000 // 30 seconds
}) => {
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      setError(null);
      const orderStatus = await apiService.getOrderStatus(orderId);
      setStatus(orderStatus);
      
      if (onStatusChange) {
        onStatusChange(orderStatus);
      }
    } catch (err) {
      console.error('Ошибка загрузки статуса заказа:', err);
      setError('Не удалось загрузить статус заказа');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [orderId]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchStatus, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, orderId]);

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

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'только что';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} мин назад`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ч назад`;
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner />
        <StatusText>Загрузка статуса...</StatusText>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  if (!status) {
    return (
      <Container>
        <ErrorMessage>Статус не найден</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <StatusIndicator status={status.status} />
      <StatusText>{getStatusText(status.status)}</StatusText>
      <LastUpdated>
        Обновлено: {formatLastUpdated(status.updated_at)}
      </LastUpdated>
    </Container>
  );
};

export default OrderStatusTracker;
