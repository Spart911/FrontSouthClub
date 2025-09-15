# Инструкции для сборки на сервере

## Проблема
На сервере отсутствует пакет `rollup-plugin-visualizer`, который используется в основной конфигурации Vite для анализа размера бандла.

## Решение

### Вариант 1: Использовать продакшн конфигурацию (рекомендуется)

```bash
# Используйте продакшн конфигурацию без visualizer
npm run build:prod
```

### Вариант 2: Установить недостающий пакет

```bash
# Установить пакет для анализа бандла
npm install --save-dev rollup-plugin-visualizer

# Затем использовать обычную сборку
npm run build
```

### Вариант 3: Временно изменить основную конфигурацию

Если нужно использовать `npm run build`, временно закомментируйте visualizer в `vite.config.ts`:

```typescript
// import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react({
      // ... остальная конфигурация
    }),
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    // Временно закомментировано
    // visualizer({
    //   filename: 'dist/stats.html',
    //   open: false,
    //   gzipSize: true,
    //   brotliSize: true,
    // }),
  ],
  // ... остальная конфигурация
})
```

## Рекомендуемые команды для сервера

```bash
# 1. Перейти в директорию проекта
cd ~/FrontSouthClub

# 2. Установить зависимости (если нужно)
npm install

# 3. Собрать проект для продакшена
npm run build:prod

# 4. Проверить результат
ls -la dist/

# 5. Скопировать файлы в веб-директорию
sudo cp -r dist/* /var/www/southclub.ru/

# 6. Перезагрузить Nginx
sudo systemctl reload nginx
```

## Проверка сборки

После успешной сборки вы должны увидеть:

```
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
├── index.html
└── [other files]
```

## Оптимизации в продакшн конфигурации

- ✅ Удаление console.log
- ✅ Минификация кода
- ✅ Сжатие gzip и brotli
- ✅ Разделение на чанки
- ✅ Оптимизация для современных браузеров
- ❌ Анализ размера бандла (только для разработки)

## Примечания

- Продакшн конфигурация (`vite.config.prod.ts`) содержит все оптимизации кроме visualizer
- Основная конфигурация (`vite.config.ts`) предназначена для разработки с анализом бандла
- Используйте `npm run build:prod` для продакшн сборки на сервере
