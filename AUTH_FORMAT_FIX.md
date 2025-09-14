# Исправление формата данных аутентификации

## Проблема
Сервер возвращал ошибку 422, указывая, что поля `username` и `password` отсутствуют в теле запроса, хотя данные передавались:
```
{username: "exrop4sc", password: "SWPXYZ4X_e3P"}
```

## Причина
Сервер ожидает данные в формате `application/x-www-form-urlencoded` (стандарт OAuth2), а мы отправляли JSON.

## Исправление

### Было (JSON формат):
```typescript
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
```

### Стало (Form-data формат):
```typescript
// Используем form-data формат, как ожидает OAuth2
const formData = new URLSearchParams();
formData.append('username', credentials.username);
formData.append('password', credentials.password);
formData.append('grant_type', 'password');

const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: formData,
});
```

## Ключевые изменения

1. **Изменен Content-Type** с `application/json` на `application/x-www-form-urlencoded`
2. **Использован URLSearchParams** вместо JSON.stringify
3. **Добавлен grant_type** - обязательный параметр для OAuth2
4. **Правильный формат данных** - сервер теперь может корректно парсить данные

## Результат

Теперь аутентификация должна работать корректно:
- ✅ Данные передаются в правильном формате
- ✅ Сервер может корректно парсить username и password
- ✅ Соответствует стандарту OAuth2
- ✅ Добавлен обязательный параметр grant_type

## Тестирование

Для проверки исправления:
1. Откройте админ-панель
2. Введите логин и пароль
3. Нажмите "Войти"
4. Проверьте Network tab - Content-Type должен быть `application/x-www-form-urlencoded`
5. Убедитесь, что аутентификация проходит успешно
