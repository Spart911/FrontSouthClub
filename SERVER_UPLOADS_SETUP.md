# Настройка обслуживания файлов на сервере

## Проблема
Фронтенд ожидает, что файлы будут доступны по URL:
```
https://southclub.ru/api/v1/photos/...
```

Но файлы находятся в файловой системе сервера по пути:
```
/home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/
```

## Решение

### 1. Настройка веб-сервера (Nginx/Apache)

Нужно настроить веб-сервер так, чтобы он обслуживал файлы из папки `/home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/` по URL `/api/v1/photos/`.

#### Для Nginx:
```nginx
server {
    listen 80;
    server_name southclub.ru;
    
    # Обслуживание статических файлов
    location /api/v1/photos/ {
        alias /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Остальная конфигурация...
}
```

#### Для Apache:
```apache
<VirtualHost *:80>
    ServerName southclub.ru
    
    # Обслуживание статических файлов
    Alias /api/v1/photos/ /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/
    <Directory "/home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/">
        Options -Indexes
        AllowOverride None
        Require all granted
    </Directory>
    
    # Остальная конфигурация...
</VirtualHost>
```

### 2. Настройка FastAPI (если используется)

Если файлы обслуживаются через FastAPI, добавьте статический маршрут:

```python
from fastapi.staticfiles import StaticFiles

app.mount("/uploads", StaticFiles(directory="/home/nyuroprint/Backend_SOUTH_CLUB/uploads"), name="uploads")
```

### 3. Проверка прав доступа

Убедитесь, что веб-сервер имеет права на чтение файлов:

```bash
# Проверить права доступа
ls -la /home/nyuroprint/Backend_SOUTH_CLUB/uploads/

# Установить правильные права (если нужно)
sudo chmod -R 755 /home/nyuroprint/Backend_SOUTH_CLUB/uploads/
sudo chown -R www-data:www-data /home/nyuroprint/Backend_SOUTH_CLUB/uploads/
```

## Тестирование

После настройки проверьте:

1. **Прямой доступ к файлу:**
   ```
   https://southclub.ru/uploads/products/c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg
   ```

2. **Проверка в браузере:**
   - Откройте URL файла напрямую
   - Убедитесь, что изображение загружается

3. **Проверка на фронтенде:**
   - Откройте сайт
   - Проверьте, что изображения товаров отображаются
   - Откройте Network tab в DevTools
   - Убедитесь, что запросы к `/uploads/` возвращают 200 OK

## Структура файлов

Ожидаемая структура на сервере:
```
/home/nyuroprint/Backend_SOUTH_CLUB/uploads/
├── products/
│   ├── c0d0c3a9-d6d3-4442-b409-7043ca557293/
│   │   ├── photo_1.jpg
│   │   ├── photo_2.jpg
│   │   └── ...
│   └── ...
├── slider/
│   ├── slide_1.jpg
│   └── ...
└── feedback/
    └── ...
```

## Альтернативное решение

Если нельзя изменить настройки веб-сервера, можно:

1. **Изменить API** - чтобы он возвращал правильные пути
2. **Использовать прокси** - настроить проксирование запросов
3. **Изменить фронтенд** - подстроиться под существующие пути

Но рекомендуемое решение - настроить веб-сервер для обслуживания файлов по пути `/uploads/`.
