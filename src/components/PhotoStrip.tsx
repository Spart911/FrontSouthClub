import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import styled from 'styled-components';
import { apiService } from '../services/api';
import { buildFileUrl } from '../services/api';

const PhotoStripContainer = styled.div`
  width: 100vw;
  background: white;
padding-bottom: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #eee;
  overflow: hidden;
`;

const PhotoStripWrapper = styled.div<{ $dragOffset: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  user-select: none;
  transition: transform 0.6s ease;
  transform: translateX(${({ $dragOffset }) => $dragOffset}px);
  @media (max-width: 768px) {
    gap: 20px;
  }
`;


const PhotoPanel = styled.div<{ $isActive: boolean; $filterId?: string }>`
  width: 849px;
  height: 429px;
  border-radius: 34px;
  overflow: hidden;
  transition: all 0.6s ease;
  cursor: pointer;

  @media (max-width: 768px) {
    // width: 849px;
    // height: 429px;
    width: 320px;
    height: 200px;
  }

  ${({ $isActive, $filterId }) =>
    $isActive
      ? `
        opacity: 1;
        filter: none;
        box-shadow: 0 12px 30px rgba(0,0,0,0.2);
        z-index: 2;
      `
      : `
        opacity: 0.85;
        filter: url(#${$filterId}) brightness(0.9) saturate(0.95);
        z-index: 1;
      `
  }
`;

const PhotoImage = styled.img`
  pointer-events: none;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const fallbackPhotos = [
  '/images/production/1.webp',
  '/images/production/2.webp',
  '/images/production/logo.png', // Using logo as fallback for 3rd image
];

export const PhotoStrip: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const uid = useId();
  const noiseId = `noise-${uid}`;
  const filterId = `displace-${uid}`;

  const getSafeIndex = useCallback((index: number) => {
    return photos.length ? (index + photos.length) % photos.length : 0;
  }, [photos.length]);

  const goToNext = useCallback(() => {
    if (photos.length > 0) {
      setCurrentIndex(prev => (prev + 1) % photos.length);
    }
  }, [photos.length]);

  const goToPrevious = useCallback(() => {
    if (photos.length > 0) {
      setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length);
    }
  }, [photos.length]);

  useEffect(() => {
    if (photos.length > 1) {
      autoPlayRef.current = setInterval(() => {
        if (!isDragging) goToNext();
      }, 5000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isDragging, goToNext, photos.length]);

  useEffect(() => {
    const loadSlider = async () => {
      try {
        const res = await apiService.getSliderPhotos();
        const list = (res.photos || []).sort((a, b) => a.order_number - b.order_number);
        if (list.length > 0) {
          setPhotos(list.map(p => buildFileUrl(p.file_path)));
          setCurrentIndex(0);
        }
      } catch (e) {
        // Only use fallback if API fails and there are no photos
        setPhotos(fallbackPhotos);
      }
    };
    // Delay slider load slightly to prioritize main content
    const timeoutId = setTimeout(loadSlider, 50);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (Math.abs(dragDistance) > 80) {
      dragDistance > 0 ? goToNext() : goToPrevious();
    }
    setIsDragging(false);
    setDragDistance(0);
  }, [dragDistance, goToNext, goToPrevious]);

  if (photos.length === 0) {
    return null;
  }

  return (
    <PhotoStripContainer>
      {/* SVG-фильтр для искажения */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.161"  /* текстура ≈ 6.1 */
              numOctaves="2"
              seed="7"
              result={noiseId}
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2={noiseId}
              scale="30.8"           /* радиус ≈ 5.8 */
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <PhotoStripWrapper
        $dragOffset={isDragging ? -dragDistance : 0}
        onMouseDown={e => {
          setIsDragging(true);
          setStartX(e.pageX);
        }}
        onMouseMove={e => isDragging && setDragDistance(startX - e.pageX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={e => {
          setIsDragging(true);
          setStartX(e.touches[0].pageX);
        }}
        onTouchMove={e =>
          isDragging && setDragDistance(startX - e.touches[0].pageX)
        }
        onTouchEnd={handleDragEnd}
      >
        <PhotoPanel $isActive={false} $filterId={filterId} onClick={goToPrevious}>
          <PhotoImage 
            src={photos[getSafeIndex(currentIndex - 1)]} 
            alt="" 
            loading="lazy"
            decoding="async"
          />
        </PhotoPanel>

        <PhotoPanel $isActive={true}>
          <PhotoImage 
            src={photos[currentIndex]} 
            alt="" 
            loading="eager"
            decoding="async"
          />
        </PhotoPanel>

        <PhotoPanel $isActive={false} $filterId={filterId} onClick={goToNext}>
          <PhotoImage 
            src={photos[getSafeIndex(currentIndex + 1)]} 
            alt="" 
            loading="lazy"
            decoding="async"
          />
        </PhotoPanel>
      </PhotoStripWrapper>
    </PhotoStripContainer>
  );
};
