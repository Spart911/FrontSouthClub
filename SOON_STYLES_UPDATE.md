# Обновление стилей SOON для раздела "Предложенные товары"

## ✅ Выполненные изменения

### 1. Обновлен компонент RecommendedCard
- Добавлен проп `$isComingSoon: boolean`
- Добавлен курсор `default` для товаров SOON
- Добавлены стили для отображения "SOON" поверх изображения

### 2. Добавлены стили SOON
```typescript
${({ $isComingSoon }) =>
  $isComingSoon &&
  css`
    &::before {
      content: '';
      position: absolute;
      top: 47%;
      left: 0;
      width: 100%;
      height: 24%;
      background: #1e3ea8;
      transform: translateY(-50%);
      z-index: 2;
    }

    &::after {
      content: 'SOON';
      position: absolute;
      top: 35%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-weight: 900;
      font-size: 10vw; 
      text-align: center;
      background: linear-gradient(to bottom, #1e3ea8 50%, white 50%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      z-index: 3;

      @media (max-width: 1160px) {
        font-size: 15vw;
      }
      @media (max-width: 870px) {
        font-size: 22vw;
      }
    }
  `}
```

### 3. Обновлена логика рендеринга
- Добавлена проверка `isComingSoon = !!(p as any).soon`
- Для товаров SOON:
  - `href` устанавливается в `#`
  - Добавлен `onClick` обработчик для предотвращения перехода
  - Скрыт блок с информацией о товаре (`RecommendedInfo`)

### 4. Импорты
- Добавлен импорт `css` из `styled-components`

## 🎯 Результат

Теперь в разделе "Предложенные товары" на странице товара:

1. **Товары со статусом SOON** отображаются с:
   - Стилем "SOON" поверх изображения
   - Курсором `default` вместо `pointer`
   - Заблокированным переходом по клику
   - Скрытой информацией о товаре

2. **Обычные товары** отображаются как раньше:
   - С полной информацией
   - С возможностью перехода по клику
   - С курсором `pointer`

## 🧪 Тестирование

Для тестирования убедитесь, что:
1. В данных товаров есть поле `soon: true` для тестовых товаров
2. Товары SOON отображаются с надписью "SOON"
3. Клик по товару SOON не приводит к переходу
4. Клик по обычному товару работает как раньше

## 📝 Примечания

- Стили полностью соответствуют стилям из `ProductGrid.tsx`
- Используется та же логика определения статуса `soon`
- Адаптивные стили для разных размеров экрана
- Градиентный текст "SOON" с синим и белым цветами
