import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { apiService, type Product, buildFileUrl, getSizeLabel } from '../services/api';
import { cartService } from '../services/cartService';


const PageWrapper = styled.div`
  background: white;
  min-height: 100vh;
  padding: 8vw 20px 40px;
  position: relative;
  @media (max-width: 1400px) {
    padding: 10vw 15px 30px;
  }
  @media (max-width: 1200px) {
    padding: 12vw 15px 30px;
  }
    @media (max-width: 1025px) {
    padding: 15vw 15px 30px;
  }
    @media (max-width: 760px) {
    padding: 20vw 15px 30px;
  }
`;

const Container = styled.div`
  max-width: 90%;
  margin: 0 auto;
`;

const ProductSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 60px;
  
  @media (max-width: 1199px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  @media (max-width: 768px) {
    gap: 30px;
    margin-bottom: 40px;
  }
`;

const ImageSection = styled.div`
  position: relative;
`;

const MainImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;

  background: #fff;
  overflow: hidden;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
    pointer-events: none;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const AddToCartButton = styled.button`
  position: absolute;
  top: 30vw;
    left: 25vw;
  min-width: 700px;
  background: #1e3ea8;
  color: white;
  border-radius: 50px;
  border: 10px solid rgb(255, 255, 255);
  padding: 5px 0px;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 4vw;
  
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;

  @media (max-width: 1200px) {
    position: relative;
    top: auto;
    left: auto;
    right: auto;
    bottom: auto;
    display: block;
    width: 100%;
    max-width: 480px;
    min-width: 0;
    margin: 20px auto 0;
    font-size: 2.4rem;
    padding: 16px 24px;
  }
  
  &:hover {
    background: #1e3ea8;
    border: 10px solidrgb(38, 68, 167);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    position: relative;
    bottom: auto;
    right: auto;
    width: 100%;
    margin-top: 20px;
    padding: 20px;
    font-size: 2rem;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  @media (max-width: 768px) {
    gap: 25px;
  }
`;

const ProductTitle = styled.h1`
  font-size: 4rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 900;
  color: #000;
  margin: 0;
  
  @media (max-width: 1679px) {
    font-size: 3.2rem;
  }
  
  @media (max-width: 1400px) {
    font-size: 3rem;
  }
  
  @media (max-width: 1200px) {
    font-size: 2.6rem;
  }
  
  @media (max-width: 1024px) {
    font-size: 2.4rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2.3rem;
  }
`;

const Price = styled.div`
  font-size: 2.4rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 700;
  color:rgb(0, 0, 0);
  
  @media (max-width: 1679px) {
    font-size: 2rem;
  }
  
  @media (max-width: 1400px) {
    font-size: 1.9rem;
  }
  
  @media (max-width: 1200px) {
    font-size: 1.7rem;
  }
  
  @media (max-width: 1024px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SpecificationsSection = styled.div`
  display: flex;
  flex-direction: column;

`;

const SpecificationsTitle = styled.h2`
  font-size: 2.4rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 700;
  color: #000;
  margin: 0;
  
  @media (max-width: 1679px) {
    font-size: 1.9rem;
  }
  
  @media (max-width: 1400px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 1200px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 1024px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const SpecificationsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
`;

const SpecificationItem = styled.li`
  display: flex;
  justify-content: start;
  align-items: center;
gap: 10px;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SpecificationLabel = styled.span`
  font-size: 2rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  color: #000;
  
  @media (max-width: 1679px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 1400px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 1200px) {
    font-size: 1.4rem;
  }
  
  @media (max-width: 1024px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const SpecificationValue = styled.span`
  font-size: 2rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  color: #000000;
  font-weight: 500;
  
  @media (max-width: 1679px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 1400px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 1200px) {
    font-size: 1.4rem;
  }
  
  @media (max-width: 1024px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const SizeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SizeTitle = styled.h3`
  font-size: 2rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 700;
  color: #000;
  margin: 0;
  
  @media (max-width: 1679px) {
    font-size: 1.7rem;
  }
  
  @media (max-width: 1400px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 1200px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 1024px) {
    font-size: 1.4rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const SizeButtons = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const SizeButton = styled.button<{ $isActive: boolean }>`
  padding: 12px 24px;
  border: ${props => props.$isActive ? '2px solid #999' : '1px solid #cfcfcf'};
  background: white;
  color: #000;
  border-radius: 0;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  
  &:hover {
    border-color: #bdbdbd;
    background: #f7f7f7;
  }
  
  &:focus {
    outline: none;
    box-shadow: none;
  }
  
  &:active {
    background: #f0f0f0;
    border-color: #bdbdbd;
    color: #000;
  }
  
  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 1.4rem;
  }
`;

const GallerySection = styled.section`
  margin-top: 60px;
  
  @media (max-width: 768px) {
    margin-top: 40px;
  }
`;

const GalleryTitle = styled.h2`
  font-size: 4rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 700;
  color: #000;
  text-align: center;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-bottom: 30px;
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  
  @media (max-width: 1199px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
`;

const GalleryItem = styled.div<{ $isActive: boolean }>`
  position: relative;
  aspect-ratio: 1;
  border: 2px solid #e0e0e0;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #bdbdbd;
    transform: translateY(-2px);
  }
  
  img {
    width: 100%;
    height: 100%;
    pointer-events: none;
    object-fit: cover;
  }
`;

const RecommendedSection = styled.section`
  margin-top: 60px;
  padding: 40px 0 0;
  background: #ffffff;
  
  @media (max-width: 768px) {
    margin-top: 40px;
    padding-top: 30px;
  }
`;

const RecommendedTitle = styled.h2`
  font-size: 5rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 900;
  text-align: center;
  margin-bottom: 32px;
  color: rgb(0, 0, 0);
`;

const RecommendedGrid = styled.div`
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  justify-items: stretch;

  @media (max-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
const RecommendedCard = styled.a<{ $isComingSoon: boolean }>`
  position: relative;
  width: 100%;
  max-width: none;
  padding-bottom: 60px;
  border: 5px solid #1e3ea8;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: visible;
  text-decoration: none;
  color: inherit;
  cursor: ${({ $isComingSoon }) => $isComingSoon ? 'default' : 'pointer'};

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
`;

const RecommendedImageWrap = styled.div<{ $isComingSoon?: boolean }>`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
    transition: opacity 0.4s ease, transform 0.4s ease;
    display: block;
    ${({ $isComingSoon }) => $isComingSoon ? css`
      filter: blur(6px) saturate(0.9) brightness(0.9);
      transform: scale(1.05);
    ` : ''}
  }
`;

const RecommendedInfo = styled.div`
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  width: 90%;
  padding: 12px 16px;
  border-radius: 8px;
  text-align: center;
  z-index: 5;
`;

const RecommendedName = styled.div`
  background: #1e3ea8;
  color: #fff;
  font-weight: 800;
  font-size: 2.0rem;
  text-transform: uppercase;
  border-radius: 18px;
  display: inline-block;
  padding: 0px 12px;
`;

const RecommendedPrice = styled.div`
  font-weight: 500;
  font-size: 1.6rem;
  color: #000;
`;

const LightboxOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: ${p => (p.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const LightboxContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border: 2px solid #ffffff22;
  }
`;

const LightboxButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.1);
  color: #fff;
  border: 1px solid #ffffff44;
  padding: 10px 16px;
  cursor: pointer;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.6rem;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba(255,255,255,0.2);
    border-color: #ffffff77;
  }
`;

const PrevButton = styled(LightboxButton)`
  left: -56px;

  @media (max-width: 768px) {
    left: 10px;
  }
`;

const NextButton = styled(LightboxButton)`
  right: -56px;

  @media (max-width: 768px) {
    right: 10px;
  }
`;

const CloseButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: transparent;
  color: #fff;
  border: 1px solid #ffffff44;
  padding: 8px 14px;
  cursor: pointer;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.6rem;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba(255,255,255,0.15);
    border-color: #ffffff77;
  }
`;

const MoreImagesOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(30, 62, 168, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 2rem;
  font-weight: 700;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 2rem;
  color: #666;
`;

const CornerLogo = styled.img`
  position: absolute;
  top: 16px;
  left: 16px;
  width: 13vw;
  height: auto;


  @media (max-width: 768px) {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 150px;
    top: 12px;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 2rem;
  color: #e74c3c;
`;

const Notification = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 20px;
  right: ${props => props.$isVisible ? '20px' : '0px'};
  background: #1e3ea8;
  color: white;
  padding: 15px 25px;
  border-radius: 5px;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.6rem;
  z-index: 1000;
  transform: translateX(${props => props.$isVisible ? '0' : '100%'});
  transition: transform 0.3s ease;
  
  @media (max-width: 768px) {
    top: 10px;
    right: ${props => props.$isVisible ? '10px' : '0px'};
    left: 10px;
    text-align: center;
  }
`;

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const { addToCart } = useCart(); // Временно отключено
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [recommended, setRecommended] = useState<Product[]>([]);
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('ID товара не найден');
        setLoading(false);
        return;
      }

      try {
        const productData = await apiService.getProduct(id);
        setProduct(productData);
        // Set first available size as selected
        if (productData.size && productData.size.length > 0) {
          setSelectedSize(productData.size[0]);
        }
        // Load recommended products
        try {
          const res = await apiService.getProducts(1, 20);
          const list = (res.products || [])
            .filter(p => p.id !== productData.id)
            .sort((a, b) => (a.order_number ?? 0) - (b.order_number ?? 0))
            .slice(0, 8);
          setRecommended(list);
        } catch (e) {
          console.warn('Failed to load recommended products', e);
        }
      } catch (err) {
        setError('Ошибка загрузки товара');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleImageClick = (index: number) => {
    // Не меняем основное фото, только открываем лайтбокс на выбранном индексе
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Размер фиксирован для текущей модели товара

  const handleAddToCart = () => {
    if (!product || selectedSize === null) {
      alert('Пожалуйста, выберите размер');
      return;
    }

    // Add to cart using cart service
    cartService.addToCart(product, selectedSize);
    
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleMainImageClick = () => {
    setLightboxIndex(selectedImage || 0);
    setIsLightboxOpen(true);
  };

  const handleLightboxClose = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const showPrev = useCallback(() => {
    if (!product?.photos?.length) return;
    setLightboxIndex(prev => (prev - 1 + product.photos.length) % product.photos.length);
  }, [product]);

  const showNext = useCallback(() => {
    if (!product?.photos?.length) return;
    setLightboxIndex(prev => (prev + 1) % product.photos.length);
  }, [product]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleLightboxClose();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isLightboxOpen, handleLightboxClose, showPrev, showNext]);

  if (loading) {
    return (
      <PageWrapper>
        <Container>
          <LoadingSpinner>Загрузка товара...</LoadingSpinner>
        </Container>
      </PageWrapper>
    );
  }

  if (error || !product) {
    return (
      <PageWrapper>
        <Container>
          <ErrorMessage>
            {error || 'Товар не найден'}
          </ErrorMessage>
        </Container>
      </PageWrapper>
    );
  }

  const images = product.photos || [];
  const specifications = {
    color: product.color,
    composition: product.composition,
    print_technology: product.print_technology,
  };

  return (
    <PageWrapper>
      <CornerLogo src={'/images/production/logo_SC.webp'} alt="SOUTH CLUB" loading="lazy" decoding="async" />
      <Container>
        <ProductSection>
          <ImageSection>
            <MainImage onClick={handleMainImageClick}>
              <img 
                src={images[selectedImage] ? buildFileUrl(images[selectedImage].file_path) : '/images/production/1.webp'} 
                alt={product.name}
                decoding="async"
                loading="eager"
              />
            </MainImage>
            <AddToCartButton onClick={handleAddToCart}>
              ДОБАВИТЬ В КОРЗИНУ
            </AddToCartButton>
          </ImageSection>

          <InfoSection>
            <ProductTitle>{product.name}</ProductTitle>
            
            <SpecificationsSection>
              <SpecificationsTitle>Характеристики:</SpecificationsTitle>
              <SpecificationsList>
                {product.color && (
                  <SpecificationItem>
                    <SpecificationLabel>Цвет: </SpecificationLabel>
                    <SpecificationValue>{product.color}</SpecificationValue>
                  </SpecificationItem>
                )}
                {product.composition && (
                  <SpecificationItem>
                    <SpecificationLabel>Состав: </SpecificationLabel>
                    <SpecificationValue>{product.composition}</SpecificationValue>
                  </SpecificationItem>
                )}
                {product.print_technology && (
                  <SpecificationItem>
                    <SpecificationLabel>Технология печати: </SpecificationLabel>
                    <SpecificationValue>{product.print_technology}</SpecificationValue>
                  </SpecificationItem>
                )}
              </SpecificationsList>
            </SpecificationsSection>

            <SizeSection>
              <SizeTitle>Размеры на выбор</SizeTitle>
              <SizeButtons>
                {product.size?.map((size) => (
                  <SizeButton
                    key={size}
                    $isActive={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                  >
                    {getSizeLabel(size)}
                  </SizeButton>
                ))}
              </SizeButtons>
            </SizeSection>

            <Price>Цена: {product.price.toLocaleString()} RUB</Price>
          </InfoSection>
        </ProductSection>

        {images.length > 1 && (
          <GallerySection>
            <GalleryTitle>Галерея</GalleryTitle>
            <GalleryGrid>
              {images.slice(0, 5).map((image, index) => (
                <GalleryItem
                  key={index}
                  $isActive={selectedImage === index}
                  onClick={() => handleImageClick(index)}
                >
                  <img src={buildFileUrl(image.file_path)} alt={`${product.name} - фото ${index + 1}`} decoding="async" loading="lazy" />
                  {index === 4 && images.length > 5 && (
                    <MoreImagesOverlay>+{images.length - 5}</MoreImagesOverlay>
                  )}
                </GalleryItem>
              ))}
            </GalleryGrid>
          </GallerySection>
        )}

        {recommended.length > 0 && (
          <RecommendedSection>
            <RecommendedTitle>Предложенные товары</RecommendedTitle>
            <RecommendedGrid>
              {recommended.map((p) => {
                const isComingSoon = !!(p as any).soon;
                const preview = p.photos && p.photos.length > 0 ? buildFileUrl((p.photos[0]).file_path) : '/images/production/logo.png';
                return (
                  <RecommendedCard 
                    key={p.id} 
                    href={isComingSoon ? '#' : `/product/${p.id}`}
                    $isComingSoon={isComingSoon}
                    onClick={(e) => {
                      if (isComingSoon) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <RecommendedImageWrap $isComingSoon={isComingSoon}>
                      <img src={preview} alt={p.name} />
                    </RecommendedImageWrap>
                    {!isComingSoon && (
                      <RecommendedInfo>
                        <RecommendedName>{p.name}</RecommendedName>
                        <RecommendedPrice>{p.price} RUB</RecommendedPrice>
                      </RecommendedInfo>
                    )}
                  </RecommendedCard>
                );
              })}
            </RecommendedGrid>
          </RecommendedSection>
        )}
      </Container>

      <Notification $isVisible={showNotification}>
        Товар добавлен в корзину!
      </Notification>

      <LightboxOverlay $isOpen={isLightboxOpen} onClick={handleLightboxClose}>
        <CloseButton onClick={handleLightboxClose}>Закрыть</CloseButton>
        <LightboxContent onClick={(e) => e.stopPropagation()}>
          <PrevButton onClick={showPrev} aria-label="Предыдущее">‹</PrevButton>
          {product.photos && product.photos[lightboxIndex] && (
            <img src={buildFileUrl(product.photos[lightboxIndex].file_path)} alt={`Фото ${lightboxIndex + 1}`} />
          )}
          <NextButton onClick={showNext} aria-label="Следующее">›</NextButton>
        </LightboxContent>
      </LightboxOverlay>
    </PageWrapper>
  );
};

export default ProductPage;
