import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression2'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Базовая конфигурация React без дополнительных Babel плагинов
    }),
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
    }),
  ],
  server: {
    host: true, // Слушать все сетевые интерфейсы
    port: 5173,
    strictPort: false, // Позволяем использовать другие порты
    open: true, // Автоматически открывать браузер
    cors: true, // Включаем CORS
    hmr: {
      port: 5173,
      host: 'localhost'
    }
  },
  build: {
    // Целевая версия для современных браузеров (ES2020+)
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        // Удаляем неиспользуемый код
        unused: true,
        dead_code: true,
        // Удаляем полифиллы для современных браузеров
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        // Улучшенное сжатие имен
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        // Более детальное разделение чанков
        manualChunks: {
          // Основные библиотеки React
          'react-vendor': ['react', 'react-dom'],
          // Роутинг
          'router': ['react-router-dom'],
          // Стилизация
          'ui': ['styled-components'],
          // Утилиты
          'utils': ['react', 'react-dom'],
        },
        // Оптимизация имен файлов
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      // Внешние зависимости (не включаем в бандл)
      external: [],
    },
    // Увеличиваем лимит предупреждений о размере
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'styled-components'],
  },
  base: '/'
})
