# Прямой доступ к файлам по названию

## Проблема
Сервер возвращает полный путь к файлу `/app/uploads/products/c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg`, но нам нужен только URL для доступа к файлу.

## Решение
Извлекаем только название файла из полного пути и формируем URL напрямую.

## Исправление

### Было:
```typescript
// Убираем /app/uploads/products/ и заменяем на /api/v1/photos/
const correctedPath = filePath.replace('/app/uploads/products/', '/api/v1/photos/');
return `${origin}${correctedPath}`;
```

### Стало:
```typescript
// Извлекаем только название файла из полного пути
const fileName = filePath.split('/').pop();
return `${origin}/api/v1/photos/${fileName}`;
```

## Примеры

### Входные данные:
- `filePath` = `/app/uploads/products/c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg`

### Результат:
- `fileName` = `c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg`
- URL = `https://southclub.ru/uploads/products/c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg`

## Преимущества

1. **Простота** - не нужно парсить сложные пути
2. **Надежность** - работает с любыми названиями файлов
3. **Производительность** - нет дополнительных запросов к серверу
4. **Гибкость** - легко изменить базовый путь

## Структура файлов на сервере

```
/home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/
├── c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg
├── d1e1f2g3-h4i5-j6k7-l8m9-n0o1p2q3r4s5.jpg
└── ...
```

## Настройка сервера

### ⚠️ ВАЖНО: Настройка в nginx.conf на сервере

Это нужно настроить в **основном конфиге nginx** на сервере, где находится бэкенд и файлы, а НЕ в конфиге фронтенда.

### 1. Откройте nginx.conf на сервере:
```bash
sudo nano /etc/nginx/nginx.conf
# или
sudo nano /etc/nginx/sites-available/southclub.ru
```

### 2. Добавьте location блок в server секцию:
```nginx
server {
    listen 80;
    server_name southclub.ru www.southclub.ru;
    
    # Основное приложение (API)
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Прямой доступ к файлам товаров (БЕЗ API)
    location /uploads/products/ {
        alias /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/;
        expires 1y;
        add_header Cache-Control "public, immutable";
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
}
```

### 3. Проверьте конфиг и перезапустите nginx:
```bash
# Проверить конфиг
sudo nginx -t

# Перезапустить nginx
sudo systemctl reload nginx
# или
sudo service nginx reload
```

### 4. Проверьте права доступа:
```bash
# Убедитесь, что nginx может читать файлы
sudo chown -R www-data:www-data /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/
sudo chmod -R 755 /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/
```

### Альтернатива через FastAPI (если используете):
```python
from fastapi.staticfiles import StaticFiles

app.mount("/uploads/products", StaticFiles(directory="/home/nyuroprint/Backend_SOUTH_CLUB/uploads/products"), name="products")
```

## Тестирование

1. Откройте сайт
2. Проверьте, что изображения товаров загружаются
3. Откройте Network tab в DevTools
4. Убедитесь, что запросы идут к правильному URL: `https://southclub.ru/uploads/products/{filename}`
5. Проверьте, что изображения отображаются корректно
