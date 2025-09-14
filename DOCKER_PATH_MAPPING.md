# Обработка путей Docker контейнера

## Проблема
Сервер (в Docker) возвращает пути вида `/app/uploads/products/filename.jpg`, но фронтенд (вне Docker) не может обращаться к этим путям напрямую.

## Архитектура

### Docker контейнер (Backend):
- **Внутренний путь**: `/app/uploads/products/filename.jpg`
- **Внешний путь**: `/home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/filename.jpg`

### Фронтенд (вне Docker):
- **Ожидаемый URL**: `https://southclub.ru/uploads/products/filename.jpg`
- **Реальный файл**: `/home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/filename.jpg`

## Решение

### 1. Обработка путей в buildFileUrl

```typescript
export const buildFileUrl = (filePath: string): string => {
  if (!filePath) return filePath;
  if (/^https?:\/\//i.test(filePath)) return filePath;
  
  try {
    const origin = new URL(API_BASE_URL).origin;
    
    // Если путь содержит /app/uploads/products/, это путь из Docker контейнера
    if (filePath.includes('/app/uploads/products/')) {
      // Извлекаем только название файла из полного пути
      const fileName = filePath.split('/').pop();
      return `${origin}/uploads/products/${fileName}`;
    }
    
    // Если путь уже содержит /uploads/products/, используем как есть
    if (filePath.startsWith('/uploads/products/')) {
      return `${origin}${filePath}`;
    }
    
    return `${origin}${filePath}`;
  } catch {
    return filePath;
  }
};
```

### 2. Настройка веб-сервера

Веб-сервер должен обслуживать файлы по пути `/uploads/products/`:

#### Nginx:
```nginx
server {
    listen 80;
    server_name southclub.ru;
    
    # Прямой доступ к файлам товаров
    location /uploads/products/ {
        alias /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Apache:
```apache
<VirtualHost *:80>
    ServerName southclub.ru
    
    Alias /uploads/products/ /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/
    <Directory "/home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/">
        Options -Indexes
        AllowOverride None
        Require all granted
    </Directory>
</VirtualHost>
```

## Примеры работы

### Входные данные от сервера:
- `filePath` = `/app/uploads/products/c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg`

### Обработка:
1. Проверяем, содержит ли путь `/app/uploads/products/`
2. Извлекаем название файла: `c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg`
3. Формируем URL: `https://southclub.ru/uploads/products/c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg`

### Результат:
- **URL для фронтенда**: `https://southclub.ru/uploads/products/c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg`
- **Файл на сервере**: `/home/nyuroprint/Backend_SOUTH_CLUB/uploads/products/c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg`

## Преимущества

1. **Совместимость** - работает с Docker и без Docker
2. **Производительность** - прямой доступ к файлам
3. **Гибкость** - обрабатывает разные форматы путей
4. **Простота** - не требует изменения API

## Тестирование

1. Откройте сайт
2. Проверьте, что изображения товаров загружаются
3. Откройте Network tab в DevTools
4. Убедитесь, что запросы идут к правильному URL
5. Проверьте, что изображения отображаются корректно

## Альтернативные решения

### 1. Изменение API
Можно изменить API, чтобы он возвращал правильные пути:
```json
{
  "file_path": "/uploads/products/filename.jpg"
}
```

### 2. Проксирование
Настроить проксирование запросов от `/app/uploads/` к `/uploads/`

### 3. Символические ссылки
Создать символическую ссылку на сервере:
```bash
ln -s /home/nyuroprint/Backend_SOUTH_CLUB/uploads/products /var/www/uploads/products
```

Но рекомендуемое решение - обработка путей на фронтенде, как показано выше.
