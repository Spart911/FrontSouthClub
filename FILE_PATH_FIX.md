# Исправление пути к файлам

## Проблема
Фронтенд делал запросы к неправильному URL:
```
https://southclub.ru/app/uploads/products/c0d0c3a9-d6d3-4442-b409-7043ca557293.jpg
```

## Причина
Сервер возвращает `file_path` в формате `/app/uploads/products/...`, а функция `buildFileUrl` просто добавляет к нему origin от API_BASE_URL, что создает неправильный URL.

## Анализ

### Что происходило:
1. **API_BASE_URL** = `https://southclub.ru/api/v1`
2. **file_path от сервера** = `/app/uploads/products/...`
3. **buildFileUrl результат** = `https://southclub.ru` + `/app/uploads/products/...` = `https://southclub.ru/app/uploads/products/...`

### Правильный URL должен быть:
- `https://southclub.ru/api/v1/photos/...` (файлы находятся в `/home/nyuroprint/Backend_SOUTH_CLUB/uploads` на сервере)
- Сервер должен обслуживать файлы по пути `/api/v1/photos/` для доступа через веб

## Исправление

### Было:
```typescript
export const buildFileUrl = (filePath: string): string => {
  if (!filePath) return filePath;
  if (/^https?:\/\//i.test(filePath)) return filePath;
  try {
    const origin = new URL(API_BASE_URL).origin;
    return `${origin}${filePath}`;
  } catch {
    return filePath;
  }
};
```

### Стало:
```typescript
export const buildFileUrl = (filePath: string): string => {
  if (!filePath) return filePath;
  if (/^https?:\/\//i.test(filePath)) return filePath;
  
  try {
    const origin = new URL(API_BASE_URL).origin;
    
    // Если путь начинается с /app/uploads/, извлекаем только название файла
    if (filePath.startsWith('/app/uploads/products/')) {
      // Извлекаем только название файла из полного пути
      const fileName = filePath.split('/').pop();
      return `${origin}/api/v1/photos/${fileName}`;
    }
    
    return `${origin}${filePath}`;
  } catch {
    return filePath;
  }
};
```

## Результат

Теперь URL формируется правильно:
- **Было**: `https://southclub.ru/app/uploads/products/...`
- **Стало**: `https://southclub.ru/api/v1/photos/...`

## Где используется

Функция `buildFileUrl` используется в:
- `ProductGrid.tsx` - для отображения товаров
- `ProductPage.tsx` - для страницы товара
- `AdminProducts.tsx` - в админ-панели
- `AdminSlider.tsx` - для слайдера
- `CartModal.tsx` - в корзине
- `PhotoStrip.tsx` - для полосы фотографий

## Тестирование

Для проверки исправления:
1. Откройте сайт
2. Проверьте, что изображения товаров загружаются
3. Откройте Network tab в DevTools
4. Убедитесь, что запросы идут к правильному URL: `https://southclub.ru/api/v1/photos/...`
5. Проверьте, что изображения отображаются корректно
