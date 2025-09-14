# Настройка прямого доступа к файлам

## Проблема
Фронтенд должен обращаться к файлам напрямую без API запросов:
```
https://southclub.ru/uploads/products/c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg
```

Файлы находятся в файловой системе сервера:
```
/home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/
```

## Решение

### 1. Настройка Nginx

Добавьте в конфигурацию Nginx:

```nginx
server {
    listen 80;
    server_name southclub.ru;
    
    # Прямой доступ к файлам товаров
    location /uploads/products/ {
        alias /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }
    
    # Остальная конфигурация...
}
```

### 2. Настройка Apache

Добавьте в конфигурацию Apache:

```apache
<VirtualHost *:80>
    ServerName southclub.ru
    
    # Прямой доступ к файлам товаров
    Alias /uploads/products/ /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/
    <Directory "/home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/">
        Options -Indexes
        AllowOverride None
        Require all granted
        Header set Access-Control-Allow-Origin "*"
    </Directory>
    
    # Остальная конфигурация...
</VirtualHost>
```

### 3. Настройка FastAPI (альтернатива)

Если используете FastAPI, добавьте статический маршрут:

```python
from fastapi.staticfiles import StaticFiles

# Прямой доступ к файлам товаров
app.mount("/uploads/products", StaticFiles(directory="/home/nyuroprint/Backend_SOUTH_CLUB/uploads/products"), name="products")
```

## Проверка прав доступа

Убедитесь, что веб-сервер имеет права на чтение файлов:

```bash
# Проверить права доступа
ls -la /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/

# Установить правильные права (если нужно)
sudo chmod -R 755 /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/
sudo chown -R www-data:www-data /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/
```

## Структура файлов

Ожидаемая структура на сервере:
```
/home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/
├── c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg
├── d1e1f2g3-h4i5-j6k7-l8m9-n0o1p2q3r4s5.jpg
├── e2f3g4h5-i6j7-k8l9-m0n1-o2p3q4r5s6t7.jpg
└── ...
```

## Тестирование

### 1. Прямой доступ к файлу
Откройте в браузере:
```
https://southclub.ru/uploads/products/c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg
```

### 2. Проверка на фронтенде
1. Откройте сайт
2. Проверьте, что изображения товаров загружаются
3. Откройте Network tab в DevTools
4. Убедитесь, что запросы идут к правильному URL
5. Проверьте, что изображения отображаются корректно

## Преимущества прямого доступа

1. **Производительность** - нет дополнительных API запросов
2. **Кэширование** - браузер может кэшировать файлы
3. **Простота** - не нужно обрабатывать файлы через API
4. **Масштабируемость** - веб-сервер эффективно обслуживает статические файлы

## Безопасность

- Файлы доступны публично по URL
- Убедитесь, что в папке нет чувствительных данных
- Рассмотрите возможность добавления проверки прав доступа при необходимости
