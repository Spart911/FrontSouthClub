import React from 'react';
import styled from 'styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  width: 90vw;
  height: 90vh;
  max-width: 1200px;
  cursor: default;
  margin-top: 40px;
`;

const CloseButton = styled.button`
  position: fixed;
  top: 100px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  z-index: 1001;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 24px;
    height: 24px;
    stroke: #666;
    transition: stroke 0.3s ease;
  }
  
  &:hover svg {
    stroke: #999;
  }
`;

const StyledSwiper = styled(Swiper)`
  width: 100%;
  height: 100%;
  
  .swiper-button-next,
  .swiper-button-prev {
    color: white;
    
    &:after {
      font-size: 2rem;
    }
  }
`;

const ModalImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

interface ImageModalProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  images,
  initialIndex,
  onClose
}) => {
  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </CloseButton>
        <StyledSwiper
          modules={[Navigation, Keyboard]}
          initialSlide={initialIndex}
          navigation
          keyboard={{ enabled: true }}
          loop={true}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <ModalImage src={image} alt={`Изображение ${index + 1}`} />
            </SwiperSlide>
          ))}
        </StyledSwiper>
      </ModalContent>
    </ModalOverlay>
  );
}; 