import React, { ReactNode } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  height?: string;
  threshold?: number;
  rootMargin?: string;
}

export const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  fallback = <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Загрузка...</div>,
  height = '200px',
  threshold = 0.1,
  rootMargin = '100px'
}) => {
  const { ref, hasIntersected } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  return (
    <div ref={ref} style={{ minHeight: height }}>
      {hasIntersected ? children : fallback}
    </div>
  );
};


