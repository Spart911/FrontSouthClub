# Оптимизация кэширования Nginx

## Проблема
Все статические ресурсы (изображения, файлы) загружаются без заголовков кэширования, что приводит к повторной загрузке при каждом посещении. Потенциальная экономия: 633 КиБ.

## Решение

### 1. Обновленная конфигурация Nginx

Добавьте следующие блоки в ваш файл конфигурации Nginx:

```nginx
# Кэширование статических файлов
location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
    
    # Включаем gzip для изображений
    gzip_static on;
    
    # ETag для условных запросов
    etag on;
    
    # Безопасность
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
}

# Кэширование шрифтов
location ~* \.(woff|woff2|ttf|otf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
    
    # CORS для шрифтов
    add_header Access-Control-Allow-Origin "*";
    add_header Access-Control-Allow-Methods "GET, OPTIONS";
    add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept";
    
    # ETag
    etag on;
}

# Кэширование CSS и JS
location ~* \.(css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
    
    # ETag
    etag on;
}

# Кэширование HTML
location ~* \.(html|htm)$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
    add_header Vary "Accept-Encoding";
    
    # ETag
    etag on;
}

# Кэширование для загруженных файлов
location /uploads/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
    
    # ETag
    etag on;
    
    # Безопасность
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    
    # Отключаем выполнение скриптов в загруженных файлах
    location ~* \.(php|pl|py|jsp|asp|sh|cgi)$ {
        deny all;
    }
}
```

### 2. Полная конфигурация сервера

```nginx
server {
    listen 80;
    server_name southclub.ru www.southclub.ru;
    
    # Редирект на HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name southclub.ru www.southclub.ru;
    
    # SSL сертификаты
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # SSL настройки
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Безопасность
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # CSP заголовки
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://yookassa.ru https://static.yoomoney.ru; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://yookassa.ru https://static.yoomoney.ru; frame-src https://yookassa.ru;" always;
    
    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Основная директория
    root /var/www/southclub.ru;
    index index.html;
    
    # Обработка статических файлов
    location / {
        try_files $uri $uri/ /index.html;
        
        # Кэширование HTML
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
        add_header Vary "Accept-Encoding";
        etag on;
    }
    
    # Кэширование изображений
    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        etag on;
        add_header X-Content-Type-Options nosniff;
    }
    
    # Кэширование шрифтов
    location ~* \.(woff|woff2|ttf|otf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        add_header Access-Control-Allow-Origin "*";
        etag on;
    }
    
    # Кэширование CSS и JS
    location ~* \.(css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        etag on;
    }
    
    # Кэширование загруженных файлов
    location /uploads/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
        etag on;
        add_header X-Content-Type-Options nosniff;
        
        # Безопасность для загруженных файлов
        location ~* \.(php|pl|py|jsp|asp|sh|cgi)$ {
            deny all;
        }
    }
    
    # API прокси
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Кэширование API ответов (только для GET запросов)
        proxy_cache_methods GET HEAD;
        proxy_cache_valid 200 302 10m;
        proxy_cache_valid 404 1m;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    }
}
```

### 3. Команды для применения изменений

```bash
# Проверить конфигурацию
sudo nginx -t

# Перезагрузить Nginx
sudo systemctl reload nginx

# Проверить статус
sudo systemctl status nginx
```

### 4. Проверка кэширования

После применения изменений проверьте заголовки ответов:

```bash
# Проверить заголовки изображения
curl -I https://southclub.ru/images/production/logo_SC.webp

# Проверить заголовки загруженного файла
curl -I https://southclub.ru/uploads/products/321c465d-0360-4bdf-aba9-08afe36c6740.jpg

# Проверить заголовки шрифта
curl -I https://southclub.ru/fonts/heathergreen.otf
```

Ожидаемые заголовки:
- `Cache-Control: public, immutable`
- `Expires: [дата через год]`
- `ETag: [хеш файла]`

### 5. Дополнительные оптимизации

#### Включить модуль gzip_static
```bash
# Установить модуль (если не установлен)
sudo apt-get install nginx-module-gzip-static

# Добавить в конфигурацию
load_module modules/ngx_http_gzip_static_module.so;
```

#### Настроить кэш Nginx
```nginx
# В http блоке
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m use_temp_path=off;
```

### 6. Мониторинг

Добавьте логирование для мониторинга кэша:

```nginx
# В server блоке
access_log /var/log/nginx/southclub_access.log;
error_log /var/log/nginx/southclub_error.log;

# Логирование кэша
log_format cache_log '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" '
                    'cache_status:$upstream_cache_status';
```

## Результат

После применения этих настроек:
- Изображения будут кэшироваться на 1 год
- Шрифты будут кэшироваться на 1 год  
- CSS/JS файлы будут кэшироваться на 1 год
- HTML файлы будут кэшироваться на 1 час
- Загруженные файлы будут кэшироваться на 1 год
- Потенциальная экономия: 633 КиБ при повторных посещениях
