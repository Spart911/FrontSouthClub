import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import styled from 'styled-components';
import type { SlideData } from '../data/slides';
import { slides } from '../data/slides';
import { Header } from './Header';
import 'swiper/css';
import 'swiper/css/autoplay';

const SliderContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`;

const Slide = styled.div<{ bgImage: string; $slideId: number }>`
  width: 100%;
  height: 100vh;
  background-image: url(${props => props.bgImage});
  background-size: cover;
  background-position: ${props => props.$slideId === 1 || props.$slideId === 3 ? 'center' : 'right center'};
  position: relative;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
`;

const TextBlock = styled.div`
  position: absolute;
  top: 40%;
  left: 1vw;
  transform: translateY(-50%);
  color: white;
  z-index: 10;
  max-width: 500px;
  width: 60%;
  text-align: left;
  padding: 0 20px;

  @media (max-width: 768px) {
    left: 1vw;
    width: 60%;
    padding: 0 15px;
  }

  @media (max-width: 480px) {
    left: 1vw;
    width: 60%;
    padding: 0 10px;
  }
`;

const Title = styled.h2`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 3.5rem;
  margin-bottom: 0.8rem;
  font-weight: 500;
  line-height: 0.8;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
`;

const Subtitle = styled.p`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    margin-bottom: 1.5rem;
    line-height: 1.3;
    margin-top: 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.7rem;
    margin-bottom: 1.2rem;
    line-height: 1.3;
    margin-top: 0.5rem;
  }
`;

const ShopButton = styled.button`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  background: rgb(0, 133, 91);
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0;

  &:hover {
    background: rgb(3, 161, 111);
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
`;

export const HeroSlider = () => {
  const [activeSlide, setActiveSlide] = useState<SlideData>(slides[0]);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

  // Предзагрузка изображений
  useEffect(() => {
    slides.forEach(slide => {
      const img = new Image();
      img.src = slide.image;
      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, slide.image]));
      };
    });
  }, []);

  const handleShopClick = () => {
    const productsSection = document.querySelector('.product-section');
    if (productsSection) {
      const offset = 80;
      const elementPosition = productsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <SliderContainer>
      <Header />
      <TextBlock>
        <Title>{activeSlide.title}</Title>
        <Subtitle>{activeSlide.subtitle}</Subtitle>
        <ShopButton onClick={handleShopClick}>Магазин</ShopButton>
      </TextBlock>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        onSlideChange={(swiper) => {
          setActiveSlide(slides[swiper.realIndex]);
        }}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <Slide 
              bgImage={slide.image}
              $slideId={slide.id}
              style={{ 
                opacity: preloadedImages.has(slide.image) ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </SliderContainer>
  );
}; 