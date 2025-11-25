# Интеграция системы оплаты

## Обзор

Система оплаты интегрирована с новым API заказов и включает в себя:

- Создание заказов через API
- Интеграция с YooKassa для оплаты
- Отслеживание статуса заказов
- Админ-панель для управления заказами

## Новые API Endpoints

### Заказы
- `POST /api/v1/orders/` - Создание заказа с оплатой
- `GET /api/v1/orders/{order_id}` - Получение заказа по ID
- `GET /api/v1/orders/{order_id}/status` - Получение статуса заказа
- `GET /api/v1/orders/email/{email}` - Получение заказов по email
- `POST /api/v1/orders/webhook` - Webhook для уведомлений ЮKassa
- `GET /api/v1/orders/` - Получение всех заказов (для админа)
- `GET /api/v1/orders/statistics/summary` - Статистика заказов

## Новые компоненты

### 1. CartModal (обновлен)
- Интеграция с новым API заказов
- Создание заказов через `apiService.createOrder()`
- Автоматическая очистка корзины после успешного заказа

### 2. SuccessPage
- Страница успешной оплаты
- Отображение информации о заказе
- Ссылки на отслеживание заказа

### 3. OrdersPage
- Страница отслеживания заказов
- Поиск заказов по email
- Отображение истории заказов

### 4. OrderStatusTracker
- Компонент для отслеживания статуса заказа в реальном времени
- Автоматическое обновление статуса
- Визуальные индикаторы статуса

### 5. AdminOrders
- Админ-панель для управления заказами
- Статистика заказов
- Фильтрация по статусам
- Пагинация

## Типы данных

### OrderCreate
```typescript
interface OrderCreate {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  items: OrderItem[];
  total_amount: number;
}
```

### Order
```typescript
interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_url?: string;
  payment_id?: string;
  created_at: string;
  updated_at: string;
}
```

### OrderItem
```typescript
interface OrderItem {
  product_id: string;
  quantity: number;
  size: number;
  price: number;
}
```

## Маршруты

- `/success` - Страница успешной оплаты
- `/orders` - Страница отслеживания заказов
- `/admin/orders` - Админ-панель заказов (если добавлена в AdminPage)

## Процесс оплаты

1. Пользователь заполняет форму в CartModal
2. Создается заказ через `apiService.createOrder()`
3. Открывается окно оплаты YooKassa
4. После оплаты пользователь перенаправляется на `/success`
5. На странице успеха отображается информация о заказе
6. Пользователь может отследить заказ через `/orders`

## Статусы заказов

- `pending` - Ожидает оплаты
- `paid` - Оплачен
- `processing` - В обработке
- `shipped` - Отправлен
- `delivered` - Доставлен
- `cancelled` - Отменен

## Интеграция с YooKassa

- Используется YooKassa Checkout Widget
- Поддержка различных способов оплаты
- Webhook для обновления статусов
- Автоматическое перенаправление после оплаты

## Безопасность

- Валидация всех входных данных
- Проверка согласия на обработку персональных данных
- Безопасная передача данных через HTTPS
- Аутентификация для админ-функций

## Мониторинг

- Отслеживание статуса заказов в реальном времени
- Статистика заказов для админов
- Логирование ошибок
- Уведомления об изменениях статуса

