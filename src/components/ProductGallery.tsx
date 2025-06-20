import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ImageModal } from './ImageModal';

const GalleryContainer = styled.div`
  position: relative;
  background-color: white;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  margin-top: 2rem;
`;

const MainImageContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  margin-top: 20px;
  background-color: white;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 6.5vw;
  box-sizing: border-box;

  @media (max-width: 900px) {
    max-width: 100%;
  }

  @media (max-width: 768px) {
    padding-left: 20px;
    padding-right: 20px;
    margin-top: 18px;
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: auto;
  max-height: calc(100vh - 300px);
  object-fit: contain;
  cursor: pointer;
  transition: opacity 0.3s ease;
  padding-bottom: 2px;
`;

const ThumbnailGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0 6vw;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  box-sizing: border-box;
  position: relative;
  z-index: 1;

  @media (max-width: 900px) {
    max-width: 100%;
  }

  @media (max-width: 768px) {
    padding: 0 18px;
    justify-content: flex-start;
    margin-bottom: 20px;
  }
`;

const ThumbnailContainer = styled.div<{ $isActive: boolean }>`
  position: relative;
  width: 160px;
  height: 160px;
  cursor: pointer;
  border: none;
  transition: opacity 0.3s;
  background-color: transparent;

  @media (max-width: 768px) {
    width: calc(33.333% - 7px);
    height: auto;
    aspect-ratio: 1;
  }

  @media (max-width: 480px) {
    width: calc(33.333% - 7px);
  }

  &:hover {
    opacity: 0.8;
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 2px;
`;

const AdditionalImagesCount = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1.2rem;
  font-family: var(--font-buch), "Helvetica", sans-serif;
`;

interface ProductGalleryProps {
  images: string[];
  selectedImage: number;
  onImageSelect: (index: number) => void;
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  selectedImage,
  onImageSelect,
  productName
}) => {
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const visibleThumbnails = images.slice(0, 3);
  const additionalImagesCount = images.length - 3;

  // Предзагрузка изображений
  useEffect(() => {
    const preloadImage = (url: string) => {
      if (!preloadedImages.has(url)) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, url]));
        };
      }
    };

    // Сначала загружаем выбранное изображение
    preloadImage(images[selectedImage]);

    // Затем загружаем остальные изображения
    images.forEach((image, index) => {
      if (index !== selectedImage) {
        preloadImage(image);
      }
    });
  }, [images, selectedImage]);

  return (
    <GalleryContainer>
      <MainImageContainer>
        <MainImage 
          src={images[selectedImage]} 
          alt={productName}
          draggable="false"
          loading="lazy"
          style={{ opacity: preloadedImages.has(images[selectedImage]) ? 1 : 0 }}
          onClick={() => setIsModalOpen(true)}
        />
      </MainImageContainer>
      <ThumbnailGrid>
        {visibleThumbnails.map((image, index) => (
          <ThumbnailContainer
            key={index}
            $isActive={index === selectedImage}
            onClick={() => onImageSelect(index)}
          >
            <Thumbnail 
              src={image} 
              alt=""
              draggable="false"
              loading="lazy"
              style={{ opacity: preloadedImages.has(image) ? 1 : 0 }}
            />
          </ThumbnailContainer>
        ))}
        {additionalImagesCount > 0 && (
          <ThumbnailContainer
            $isActive={false}
            onClick={() => {
              onImageSelect(3);
              setIsModalOpen(true);
            }}
          >
            <Thumbnail 
              src={images[3]} 
              alt=""
              draggable="false"
              loading="lazy"
              style={{ opacity: preloadedImages.has(images[3]) ? 1 : 0 }}
            />
            <AdditionalImagesCount>
              +{additionalImagesCount}
            </AdditionalImagesCount>
          </ThumbnailContainer>
        )}
      </ThumbnailGrid>
      {isModalOpen && (
        <ImageModal
          images={images}
          initialIndex={selectedImage}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </GalleryContainer>
  );
}; 