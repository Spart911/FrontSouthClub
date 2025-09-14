# Исправление дублирования URL в запросах

## Проблема
URL запроса содержал дублирование базового URL:
```
https://southclub.ru/api/v1https://southclub.ru/api/v1/photos/upload/?product_id=...&priority=2
```

## Причина
В методе `uploadProductPhoto` мы передавали полный URL в метод `request`, но метод `request` сам добавляет `this.baseUrl`, что приводило к дублированию.

## Исправления

### 1. Исправлен метод `uploadProductPhoto`

**Было:**
```typescript
const url = `${this.baseUrl}/photos/upload/?product_id=${productId}&priority=${priority}`;

return this.request<ProductPhoto>(url, {
  method: 'POST',
  body: formData,
});
```

**Стало:**
```typescript
// Передаем только endpoint, baseUrl добавляется в методе request
const endpoint = `/photos/upload/?product_id=${productId}&priority=${priority}`;

return this.request<ProductPhoto>(endpoint, {
  method: 'POST',
  body: formData,
});
```

### 2. Исправлен метод `request` для FormData

**Было:**
```typescript
const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  ...(options.headers as Record<string, string>),
};
```

**Стало:**
```typescript
const headers: Record<string, string> = {
  ...(options.headers as Record<string, string>),
};

// Only set Content-Type for JSON requests, not for FormData
if (!(options.body instanceof FormData)) {
  headers['Content-Type'] = 'application/json';
}
```

## Результат

Теперь URL формируется правильно:
```
https://southclub.ru/api/v1/photos/upload/?product_id=b60d3c12-ed49-4b55-957d-b508a2f747ff&priority=2
```

## Ключевые изменения

1. **Правильное формирование URL** - передаем только endpoint в метод `request`
2. **Корректная обработка FormData** - не устанавливаем Content-Type для FormData
3. **Сохранение функциональности** - все остальные методы работают как прежде

## Тестирование

После исправления:
1. Откройте админ-панель
2. Создайте новый товар
3. Загрузите фотографию
4. Проверьте Network tab в DevTools - URL должен быть корректным
5. Загрузка должна работать без ошибок
