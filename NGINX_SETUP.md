# Настройка Nginx для прямого доступа к файлам

## ⚠️ ВАЖНО: Где настраивать

Это нужно настроить в **основном конфиге nginx** на сервере, где находится бэкенд и файлы, а НЕ в конфиге фронтенда.

## Пошаговая настройка

### 1. Подключитесь к серверу
```bash
ssh user@southclub.ru
```

### 2. Найдите конфиг nginx
```bash
# Основной конфиг
sudo nano /etc/nginx/nginx.conf

# Или конфиг сайта
sudo nano /etc/nginx/sites-available/southclub.ru
sudo nano /etc/nginx/sites-enabled/southclub.ru
```

### 3. Добавьте location блок

Найдите секцию `server` для вашего домена и добавьте:

```nginx
server {
    listen 80;
    server_name southclub.ru www.southclub.ru;
    
    # Основное приложение (API) - ПЕРВЫМ
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Прямой доступ к файлам товаров - ПОСЛЕ основного location
    location /uploads/products/ {
        alias /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        # CORS заголовки для фронтенда
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
        
        # Обработка CORS preflight запросов
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "*";
            add_header Access-Control-Allow-Methods "GET, OPTIONS";
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type "text/plain; charset=utf-8";
            add_header Content-Length 0;
            return 204;
        }
    }
    
    # Прямой доступ к файлам слайдера
    location /uploads/slider/ {
        alias /home/nyuroprint/Backend_SOUTH_CLUB/uploads/slider/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        
        # CORS заголовки для фронтенда
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
        
        # Обработка CORS preflight запросов
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "*";
            add_header Access-Control-Allow-Methods "GET, OPTIONS";
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type "text/plain; charset=utf-8";
            add_header Content-Length 0;
            return 204;
        }
    }
    
    # Кеширование статики - ПОСЛЕ блоков /uploads/
    location ~* \.(?:ico|png|jpg|jpeg|gif|svg|webp|css|js|woff2?|ttf|eot)$ {
        try_files $uri =404;
        expires 1y;
        access_log off;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        
        # Дополнительные заголовки для оптимизации
        add_header X-Content-Type-Options "nosniff";
        add_header X-Frame-Options "SAMEORIGIN";
    }
    
    # Специальное кеширование для шрифтов
    location ~* \.(?:woff2?|ttf|eot|otf)$ {
        expires 1y;
        access_log off;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        add_header Access-Control-Allow-Origin "*";
    }
    
    # Кеширование для изображений товаров и слайдера
    location ~* ^/(uploads/products/|uploads/slider/|images/production/|main_images/) {
        expires 1y;
        access_log off;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
    }
    
    # Кеширование для JS и CSS файлов
    location ~* ^/assets/.*\.(js|css)$ {
        expires 1y;
        access_log off;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        add_header X-Content-Type-Options "nosniff";
    }
    
    # Главный блок для SPA (React/Vite)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 4. Проверьте конфиг
```bash
sudo nginx -t
```

Если есть ошибки, исправьте их и повторите проверку.

### 5. Перезапустите nginx
```bash
sudo systemctl reload nginx
# или
sudo service nginx reload
```

### 6. Проверьте права доступа
```bash
# Убедитесь, что nginx может читать файлы
sudo chown -R www-data:www-data /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/
sudo chmod -R 755 /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/

# Проверьте, что файлы существуют
ls -la /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/
```

## Тестирование

### 1. Проверьте прямой доступ к файлу
```bash
curl -I https://southclub.ru/uploads/products/test.jpg
```

Должен вернуть `200 OK` и заголовки изображения.

### 2. Проверьте в браузере
Откройте в браузере:
```
https://southclub.ru/uploads/products/{filename}
```

### 3. Проверьте на фронтенде
1. Откройте сайт
2. Проверьте, что изображения товаров загружаются
3. Откройте Network tab в DevTools
4. Убедитесь, что запросы идут к правильному URL

## Возможные проблемы

### 1. 403 Forbidden
```bash
# Проверьте права доступа
sudo chown -R www-data:www-data /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/
sudo chmod -R 755 /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/
```

### 2. 404 Not Found
```bash
# Проверьте, что файлы существуют
ls -la /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/

# Проверьте путь в nginx конфиге
grep -r "uploads/products" /etc/nginx/
```

### 3. CORS ошибки
Убедитесь, что добавили CORS заголовки в location блок.

### 4. Конфликт с API
Убедитесь, что location `/uploads/products/` идет ПОСЛЕ location `/`.

## Альтернативная настройка через FastAPI

Если не хотите настраивать nginx, можно добавить в FastAPI:

```python
from fastapi.staticfiles import StaticFiles

app.mount("/uploads/products", StaticFiles(directory="/home/nyuroprint/Backend_SOUTH_CLUB/uploads/products"), name="products")
```

Но nginx будет быстрее для статических файлов.

## Проверка работы

После настройки:

1. **Файл должен быть доступен**: `https://southclub.ru/uploads/products/filename.jpg`
2. **Фронтенд должен загружать изображения** без ошибок
3. **Network tab** должен показывать успешные запросы к `/uploads/products/`

## Логи nginx

Если что-то не работает, проверьте логи:
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Content Security Policy (CSP)

### Добавьте в server блок nginx:

```nginx
server {
    listen 443 ssl http2;
    server_name southclub.ru www.southclub.ru;
    
    # Content Security Policy (CSP)
    add_header Content-Security-Policy "
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://yookassa.ru https://static.yoomoney.ru;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com data:;
      img-src 'self' data: https: blob:;
      connect-src 'self' https://southclub.ru https://yookassa.ru https://static.yoomoney.ru;
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

### Что защищает CSP:
- ✅ **XSS атаки** - блокирует неавторизованные скрипты
- ✅ **Clickjacking** - запрещает встраивание в iframe
- ✅ **Mixed content** - принудительный HTTPS
- ✅ **Data injection** - ограничивает источники данных
- ✅ **Plugin attacks** - блокирует плагины

### Тестирование CSP:
1. Откройте DevTools → Security tab
2. Проверьте, что CSP активна
3. Убедитесь, что нет нарушений в Console
4. Проверьте, что все функции работают
