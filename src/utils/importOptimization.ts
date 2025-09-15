// Утилиты для оптимизации импортов и tree-shaking

// Оптимизированные импорты React
export { useState, useEffect, useCallback, useMemo, useRef, useId } from 'react';
export type { FC, ReactNode, MouseEvent, ChangeEvent } from 'react';

// Оптимизированные импорты React Router
export { useParams, useNavigate, useLocation } from 'react-router-dom';

// Оптимизированные импорты Styled Components
export { default as styled, css, keyframes } from 'styled-components';
export type { DefaultTheme } from 'styled-components';

// Оптимизированные импорты API
export { 
  apiService, 
  buildFileUrl, 
  getSizeLabel,
  SIZE_OPTIONS 
} from '../services/api';

// Оптимизированные импорты типов
export type { 
  Product, 
  ProductPhoto, 
  Order, 
  OrderCreate, 
  OrderItem,
  SliderPhoto 
} from '../services/api';

// Утилиты для ленивой загрузки
export const lazyImport = <T extends Record<string, any>>(
  importFn: () => Promise<T>,
  componentName: keyof T
) => {
  return () => importFn().then(module => ({ default: module[componentName] }));
};

// Утилита для динамических импортов с retry
export const dynamicImport = async <T>(
  importFn: () => Promise<T>,
  retries = 3
): Promise<T> => {
  try {
    return await importFn();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Import failed, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return dynamicImport(importFn, retries - 1);
    }
    throw error;
  }
};

// Утилита для проверки поддержки браузером
export const browserSupport = {
  // Проверка поддержки ES2020+ функций
  supportsES2020: () => {
    try {
      // Проверяем поддержку Optional Chaining
      eval('const obj = {}; obj?.prop;');
      // Проверяем поддержку Nullish Coalescing
      eval('const a = null; const b = a ?? "default";');
      return true;
    } catch {
      return false;
    }
  },
  
  // Проверка поддержки современных API
  supportsModernAPIs: () => {
    return (
      'IntersectionObserver' in window &&
      'ResizeObserver' in window &&
      'requestIdleCallback' in window
    );
  }
};

// Утилита для условной загрузки полифиллов
export const loadPolyfills = async () => {
  const polyfills = [];
  
  // Загружаем полифиллы только для старых браузеров
  if (!browserSupport.supportsES2020()) {
    polyfills.push(import('core-js/stable'));
  }
  
  if (!browserSupport.supportsModernAPIs()) {
    polyfills.push(import('intersection-observer'));
  }
  
  if (polyfills.length > 0) {
    await Promise.all(polyfills);
  }
};

// Утилита для оптимизации изображений
export const optimizeImage = (src: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
} = {}) => {
  const { width, height, quality = 80, format = 'webp' } = options;
  
  // Если это внешний URL, возвращаем как есть
  if (src.startsWith('http')) {
    return src;
  }
  
  // Для локальных изображений можно добавить параметры оптимизации
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (quality) params.set('q', quality.toString());
  if (format) params.set('f', format);
  
  return params.toString() ? `${src}?${params.toString()}` : src;
};

// Утилита для debounce (оптимизация производительности)
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Утилита для throttle (оптимизация производительности)
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
