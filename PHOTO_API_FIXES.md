# Исправления API для работы с фотографиями товаров

## Обзор изменений

Исправлена работа с фотографиями товаров согласно новой документации API. Основные изменения касаются правильной передачи параметров и использования корректных эндпоинтов.

## Изменения в API Service

### 1. Обновлен метод `uploadProductPhoto`

**Было:**
```typescript
async uploadProductPhoto(productId: string, photo: File, extra?: { name: string; priority: number }): Promise<ProductPhoto> {
  const formData = new FormData();
  formData.append('photo', photo);
  
  if (extra) {
    formData.append('name', extra.name);
    formData.append('priority', extra.priority.toString());
  }

  const url = `${this.baseUrl}/photos/upload/?product_id=${productId}`;
  // ... прямой вызов fetch
}
```

**Стало:**
```typescript
async uploadProductPhoto(productId: string, photo: File, priority: number = 0): Promise<ProductPhoto> {
  console.log('Uploading photo:', {
    productId,
    fileName: photo.name,
    fileSize: photo.size,
    fileType: photo.type,
    priority
  });

  const formData = new FormData();
  formData.append('photo', photo);

  // Согласно документации, priority передается как query parameter
  const url = `${this.baseUrl}/photos/upload/?product_id=${productId}&priority=${priority}`;

  return this.request<ProductPhoto>(url, {
    method: 'POST',
    body: formData,
  });
}
```

### 2. Добавлен метод `getProductPhotos`

```typescript
async getProductPhotos(productId: string): Promise<ProductPhoto[]> {
  const cacheKey = `product_photos_${productId}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    return cached;
  }

  const result = await this.request<ProductPhoto[]>(`/photos/product/${productId}`);
  setCachedData(cacheKey, result);
  return result;
}
```

## Изменения в AdminProducts.tsx

### Обновлен процесс загрузки фотографий

**Было:**
```typescript
for (const photoUpload of photoUploads) {
  try {
    const created = await apiService.uploadProductPhoto(productId, photoUpload.file, {
      name: photoUpload.name,
      priority: photoUpload.priority
    });
    if (created && created.id != null && created.priority !== photoUpload.priority) {
      await apiService.updateProductPhoto(created.id, { priority: photoUpload.priority });
    }
  } catch (uploadErr) {
    console.error('Ошибка загрузки фото:', uploadErr);
  }
}
```

**Стало:**
```typescript
const uploadErrors: string[] = [];
for (const photoUpload of photoUploads) {
  try {
    console.log('Загружаем фото:', photoUpload.name, 'для товара:', productId, 'с приоритетом:', photoUpload.priority);
    
    // Согласно новой документации, priority передается как query parameter
    const created = await apiService.uploadProductPhoto(productId, photoUpload.file, photoUpload.priority);
    console.log('Фото загружено:', created);
    
  } catch (uploadErr) {
    const errorMsg = `Ошибка загрузки фото "${photoUpload.name}": ${uploadErr instanceof Error ? uploadErr.message : 'Неизвестная ошибка'}`;
    console.error(errorMsg, uploadErr);
    uploadErrors.push(errorMsg);
  }
}

// Показываем ошибки загрузки фотографий, если они есть
if (uploadErrors.length > 0) {
  setError(`Товар создан, но возникли ошибки при загрузке фотографий:\n${uploadErrors.join('\n')}`);
}
```

## Ключевые исправления

### 1. Правильная передача параметров
- **Priority** теперь передается как query parameter, а не в FormData
- **Name** больше не передается в FormData (генерируется автоматически на сервере)

### 2. Упрощенный API
- Убран лишний параметр `extra` из метода загрузки
- Priority передается напрямую как число

### 3. Улучшенная обработка ошибок
- Детальное логирование процесса загрузки
- Сбор всех ошибок загрузки фотографий
- Отображение ошибок пользователю

### 4. Кэширование
- Добавлено кэширование для метода `getProductPhotos`
- Использование общего метода `request` для всех API вызовов

## Соответствие документации

Теперь API полностью соответствует предоставленной документации:

- ✅ **POST** `/api/v1/photos/upload/` с `product_id` и `priority` как query parameters
- ✅ **GET** `/api/v1/photos/product/{product_id}` для получения фотографий товара
- ✅ **PUT** `/api/v1/photos/{photo_id}` для обновления фотографии
- ✅ **DELETE** `/api/v1/photos/{photo_id}` для удаления фотографии
- ✅ Правильные заголовки `Authorization: Bearer <JWT_TOKEN>`
- ✅ `Content-Type: multipart/form-data` для загрузки файлов

## Тестирование

Для проверки исправлений:

1. Откройте админ-панель
2. Создайте новый товар
3. Загрузите фотографии с разными приоритетами (0, 1, 2)
4. Проверьте консоль браузера на наличие отладочной информации
5. Убедитесь, что фотографии отображаются в списке товаров
6. Проверьте, что приоритеты фотографий сохраняются корректно

## Ограничения файлов

- **Поддерживаемые форматы:** JPG, JPEG, PNG, WEBP
- **Максимальный размер:** 10MB
- **Приоритеты:** 0-2 (0 - обычная, 1 - важная, 2 - главная)
