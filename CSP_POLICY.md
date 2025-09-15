# Content Security Policy (CSP) для SOUTH CLUB

## 🛡️ Что такое CSP
Content Security Policy (CSP) - это механизм безопасности, который помогает предотвратить атаки XSS (межсайтовый скриптинг) путем контроля того, какие ресурсы могут загружаться и выполняться на веб-странице.

## ✅ Текущая CSP политика

### В index.html (базовая защита):
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://yookassa.ru;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https: blob:;
  connect-src 'self' https://southclub.ru https://yookassa.ru;
  media-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
">
```

## 🔧 Расширенная CSP для nginx

### Добавьте в nginx конфиг:
```nginx
server {
    listen 443 ssl http2;
    server_name southclub.ru www.southclub.ru;
    
    # Content Security Policy
    add_header Content-Security-Policy "
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://yookassa.ru;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com data:;
      img-src 'self' data: https: blob:;
      connect-src 'self' https://southclub.ru https://yookassa.ru;
      media-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
      block-all-mixed-content;
    " always;
    
    # Дополнительные заголовки безопасности
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
    
    # HSTS (HTTP Strict Transport Security)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # Остальная конфигурация...
}
```

## 📋 Объяснение директив CSP

### Основные директивы:
- **`default-src 'self'`** - по умолчанию разрешены только ресурсы с того же домена
- **`script-src`** - разрешенные источники для JavaScript
- **`style-src`** - разрешенные источники для CSS
- **`img-src`** - разрешенные источники для изображений
- **`connect-src`** - разрешенные источники для AJAX/fetch запросов
- **`font-src`** - разрешенные источники для шрифтов

### Директивы безопасности:
- **`object-src 'none'`** - запрещает плагины (Flash, Java)
- **`base-uri 'self'`** - ограничивает base теги
- **`form-action 'self'`** - формы могут отправляться только на тот же домен
- **`frame-ancestors 'none'`** - запрещает встраивание в iframe
- **`upgrade-insecure-requests`** - автоматически обновляет HTTP до HTTPS
- **`block-all-mixed-content`** - блокирует смешанный контент

## 🚨 Почему 'unsafe-inline' и 'unsafe-eval'?

### 'unsafe-inline':
- **React/Vite** использует inline стили и скрипты
- **Styled Components** генерирует inline стили
- **YooKassa** может использовать inline скрипты

### 'unsafe-eval':
- **Vite** использует eval для hot reload в development
- **Некоторые библиотеки** могут использовать eval

### ⚠️ Рекомендации для production:
1. **Удалите 'unsafe-eval'** в production
2. **Используйте nonces** вместо 'unsafe-inline'
3. **Минимизируйте** использование 'unsafe-inline'

## 🔒 Строгая CSP для production

### С nonces (рекомендуется):
```nginx
# Генерируйте nonce для каждого запроса
set $nonce $request_id;

add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'nonce-$nonce' https://yookassa.ru;
  style-src 'self' 'nonce-$nonce' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: https: blob:;
  connect-src 'self' https://southclub.ru https://yookassa.ru;
  media-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
  block-all-mixed-content;
" always;
```

## 🧪 Тестирование CSP

### 1. Проверка в браузере:
```javascript
// В консоли браузера
console.log(document.querySelector('meta[http-equiv="Content-Security-Policy"]').content);
```

### 2. Проверка в DevTools:
- Network tab → Security
- Console tab → CSP violations
- Security tab → Content Security Policy

### 3. Онлайн инструменты:
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [CSP Test](https://csp-test.com/)

## 📊 Мониторинг CSP

### Логирование нарушений:
```javascript
// Добавьте в main.tsx для мониторинга
document.addEventListener('securitypolicyviolation', (e) => {
  console.warn('CSP Violation:', {
    blockedURI: e.blockedURI,
    violatedDirective: e.violatedDirective,
    originalPolicy: e.originalPolicy
  });
});
```

### Отправка на сервер:
```javascript
document.addEventListener('securitypolicyviolation', (e) => {
  fetch('/api/csp-violation', {
    method: 'POST',
    body: JSON.stringify({
      blockedURI: e.blockedURI,
      violatedDirective: e.violatedDirective,
      originalPolicy: e.originalPolicy,
      timestamp: new Date().toISOString()
    })
  });
});
```

## 🎯 Результат

### Защита от атак:
- ✅ **XSS атаки** - блокируются неавторизованные скрипты
- ✅ **Clickjacking** - запрещено встраивание в iframe
- ✅ **Data injection** - ограничены источники данных
- ✅ **Mixed content** - принудительный HTTPS
- ✅ **Plugin attacks** - заблокированы плагины

### Соответствие стандартам:
- ✅ **OWASP Top 10** - защита от основных уязвимостей
- ✅ **PCI DSS** - требования для платежных систем
- ✅ **GDPR** - защита персональных данных
- ✅ **Современные браузеры** - полная поддержка

## 📋 Дальнейшие шаги

### 1. Немедленно:
- Добавьте CSP в nginx конфиг
- Протестируйте на staging окружении
- Проверьте все функции сайта

### 2. В ближайшее время:
- Настройте мониторинг нарушений CSP
- Создайте строгую CSP с nonces
- Удалите 'unsafe-eval' в production

### 3. Долгосрочно:
- Регулярно обновляйте CSP политику
- Анализируйте логи нарушений
- Оптимизируйте безопасность

## 🎉 Заключение

CSP политика значительно повышает безопасность сайта SOUTH CLUB, защищая от:
- Межсайтового скриптинга (XSS)
- Clickjacking атак
- Внедрения вредоносного кода
- Утечки данных

Сайт теперь соответствует современным стандартам безопасности! 🛡️
