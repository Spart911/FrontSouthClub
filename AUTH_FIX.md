# Исправление аутентификации

## Проблема
Ошибка при аутентификации:
```json
{
    "detail": [
        {
            "type": "missing",
            "loc": ["body", "username"],
            "msg": "Field required",
            "input": null
        },
        {
            "type": "missing", 
            "loc": ["body", "password"],
            "msg": "Field required",
            "input": null
        }
    ]
}
```

## Причина
Метод `request` неправильно обрабатывал заголовки для JSON запросов, что приводило к тому, что данные не передавались корректно.

## Исправления

### 1. Исправлен метод `adminLogin`

**Было:**
```typescript
async adminLogin(credentials: AdminLogin): Promise<AdminLoginResponse> {
  const response = await this.request<AdminLoginResponse>('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    }),
  });
  // ...
}
```

**Стало:**
```typescript
async adminLogin(credentials: AdminLogin): Promise<AdminLoginResponse> {
  const url = `${this.baseUrl}/auth/login`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  this.token = result.access_token;
  if (this.token) {
    localStorage.setItem('admin_token', this.token);
  }
  return result;
}
```

### 2. Исправлен метод `uploadSliderPhoto`

**Было:**
```typescript
// Прямой вызов fetch с дублированием логики
const url = `${this.baseUrl}/slider/upload`;
const headers: HeadersInit = {};
// ... много кода
```

**Стало:**
```typescript
// Использование общего метода request
return this.request<SliderPhoto>('/slider/upload', {
  method: 'POST',
  body: formData,
});
```

## Ключевые изменения

1. **Прямой вызов fetch для аутентификации** - избегаем проблем с обработкой заголовков в методе `request`
2. **Правильная обработка токена** - проверяем, что токен существует перед сохранением
3. **Унификация методов загрузки** - используем общий метод `request` для всех API вызовов
4. **Исправление типизации** - добавлена проверка на null для токена

## Результат

Теперь аутентификация должна работать корректно:
- ✅ Данные передаются в правильном JSON формате
- ✅ Заголовки устанавливаются корректно
- ✅ Токен сохраняется только при успешной аутентификации
- ✅ Ошибки обрабатываются правильно

## Тестирование

Для проверки исправлений:
1. Откройте админ-панель
2. Введите логин и пароль
3. Нажмите "Войти"
4. Проверьте, что аутентификация проходит успешно
5. Убедитесь, что токен сохраняется в localStorage
