import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ProductGallery } from '../components/ProductGallery';
import { lampService } from '../services/lampService';
import { cartService } from '../services/cartService';
import type { Product, ProductColor } from '../types/product';
import { ProductGridSection } from '../components/ProductGrid';
import { Button } from '../components/Button';
import { useCart } from '../contexts/CartContext';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: white;
  position: relative;
  overflow: hidden;
`;

const BlackBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background-color: black;
  z-index: 0;
  pointer-events: none;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: calc(100vh - 80px);
  margin-top: 80px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    margin-top: 60px;
  }
`;

const ProductInfo = styled.div`
  padding: 4rem;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  background: white;
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin-top: 0;
    position: relative;
    z-index: 3;
  }
`;

const Title = styled.h1`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 2.5rem;
  margin-bottom: 0.1rem;
  color: #000;
  position: relative;
  z-index: 3;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-top: 20px;
  }
`;

const Designer = styled.p`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.2rem;
  color: #000;
  margin-bottom: 0.2rem;
`;

const Price = styled.div`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #000;
`;

const ColorSection = styled.div`
  margin-bottom: 2rem;
`;

const ColorTitle = styled.h3`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.2rem;
  margin-bottom: 0.2rem;
  color: #000;
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ColorOption = styled.button<{ $isSelected: boolean; $color: string }>`
  width: 30px;
  height: 30px;
  padding: 2px;
  border-radius: 0;
  border: 2px solid #E5E5E5;
  background-color: ${props => props.$color};
  cursor: pointer;
  transition: border-color 0.3s;

  &:hover {
    border-color: #666;
  }
`;

const AddToCartButton = styled.button`
  background-color: rgb(0, 133, 91);
  color: white;
  border: none;
  padding: 1.2rem 2.4rem;
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;

  text-transform: uppercase;
  letter-spacing: 1.2px;
  border-radius: 0;

  &:hover {
    background-color: rgb(3, 161, 111);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 1rem 2rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: var(--font-buch), "Helvetica", sans-serif;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: var(--font-buch), "Helvetica", sans-serif;
  color: red;
`;

const DeliveryInfo = styled.div`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 0.9rem;
  color: #666;
  margin-top: 1rem;
  line-height: 1.4;
`;

const DescriptionSection = styled.div`
  margin-top: 0.25rem;
  padding-left: 8vw;
  padding-right: 8vw;
  grid-column: 1 / -1;
  max-width: 1400px;
  margin-left: 0;
  margin-right: 0;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding-left: 18px;
    padding-right: 18px;
    margin-top: 1rem;
  }
`;

const DescriptionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  user-select: none;
`;

const DescriptionContent = styled.div<{ $isOpen: boolean }>`
  height: ${props => props.$isOpen ? 'auto' : '0'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  margin-top: ${props => props.$isOpen ? '0.1rem' : '0'};
  margin-bottom: ${props => props.$isOpen ? '2rem' : '0'};
`;

const DescriptionText = styled.p`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #000;

`;

const SpecificationsSection = styled.div`
  margin-top: -1rem;
  padding-left: 8vw;
  padding-right: 8vw;
  grid-column: 1 / -1;
  max-width: 1400px;
  margin-left: 0;
  margin-right: 0;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding-left: 18px;
    padding-right: 18px;
  }
`;

const SpecificationsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  user-select: none;
`;

const SpecificationsIcon = styled.div<{ $isOpen: boolean }>`
  width: 20px;
  height: 20px;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    background-color: #000;
    transition: transform 0.3s ease;
  }
  
  &::before {
    width: 2px;
    height: 20px;
    left: 9px;
    top: 0;
  }
  
  &::after {
    width: 20px;
    height: 2px;
    left: 0;
    top: 9px;
    transform: ${props => props.$isOpen ? 'rotate(90deg)' : 'rotate(0)'};
  }
`;

const SpecificationsContent = styled.div<{ $isOpen: boolean }>`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: ${props => props.$isOpen ? '2rem' : '0'};
  height: ${props => props.$isOpen ? 'auto' : '0'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  margin-top: ${props => props.$isOpen ? '0.1rem' : '0'};
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SpecificationsTitle = styled.h2`
 
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #000;
`;

const SpecificationItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const SpecificationLabel = styled.span`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 0.9rem;
  color: #666;
`;

const SpecificationValue = styled.span`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  color: #000;
`;

const ReviewsSection = styled.div`
  margin-top: -1rem;
  padding-left: 8vw;
  padding-right: 8vw;
  grid-column: 1 / -1;
  max-width: 1400px;
  margin-left: 0;
  margin-right: 0;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding-left: 18px;
    padding-right: 18px;
  }
`;

const ReviewsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  user-select: none;
`;

const ReviewsContent = styled.div<{ $isOpen: boolean }>`
  height: ${props => props.$isOpen ? 'auto' : '0'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  margin-top: ${props => props.$isOpen ? '0.1rem' : '0'};
  margin-bottom: ${props => props.$isOpen ? '2rem' : '0'};
`;

const ReviewItem = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid #E5E5E5;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ReviewAuthor = styled.div`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #000;
`;

const ReviewText = styled.p`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #000;
`;

const OtherProductsSection = styled.div`
  margin-top: -1rem;
  padding-left: 8vw;
  padding-right: 8vw;
  grid-column: 1 / -1;
  max-width: 1400px;
  margin-left: 0;
  margin-bottom: 2rem;
  margin-right: 0;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding-left: 18px;
    padding-right: 18px;
  }
`;

const OtherProductsTitle = styled.h2`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 2rem;
  margin-bottom: 0.8rem;
  color: #000;
  max-width: 1400px;
  margin-left: 0;
  box-sizing: border-box;
`;

const ColorName = styled.span`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 0.9rem;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  position: absolute;
  bottom: 5px;
  left: 5px;
  right: 5px;
  text-align: center;
`;

const getSpecificationLabel = (key: string): string => {
  const labels: { [key: string]: string } = {
    switchType: 'Тип выключателя',
    socketType: 'Тип цоколя',
    maxPower: 'Макс. мощность ламп, Вт',
    includesBulb: 'Лампочка в комплекте',
    lightingArea: 'Площадь освещения, кв.м',
    lightTemperature: 'Температура света, К',
    lightFlow: 'Световой поток, Лм',
    protectionDegree: 'Степень защиты',
    lightType: 'Тип света',
    dimensions: 'Размеры, мм',
    powerType: 'Тип питания',
    bulbCount: 'Количество ламп',
    packaging: 'Упаковка',
    cordLength: 'Длина шнура, м',
    warranty: 'Гарантия',
    materials: 'Материалы'
  };
  return labels[key] || key;
};

export const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, setShowCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [isSpecificationsOpen, setIsSpecificationsOpen] = useState(true);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const [isReviewsOpen, setIsReviewsOpen] = useState(true);
  const [otherProducts, setOtherProducts] = useState<Product[]>([]);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id) {
          navigate('/');
          return;
        }
        const data = await lampService.getLampById(id);
        if (!data) {
          navigate('/');
          return;
        }
        setProduct(data);
      } catch (err) {
        console.error(err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  useEffect(() => {
    const loadOtherProducts = async () => {
      try {
        const products = await lampService.getAllLamps();
        // Исключаем текущий продукт из списка
        const filteredProducts = products.filter(p => p.id !== id);
        setOtherProducts(filteredProducts);
      } catch (err) {
        console.error('Ошибка при загрузке других продуктов:', err);
      }
    };

    loadOtherProducts();
  }, [id]);

  if (loading) {
    return null;
  }

  if (error || !product) {
    return <ErrorContainer>{error || 'Продукт не найден'}</ErrorContainer>;
  }

  const selectedColor = product.colors[selectedColorIndex];
  const images = [
    selectedColor.mainImage,
    selectedColor.secondaryImage,
    ...(selectedColor.additionalImages || [])
  ].filter(Boolean);

  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    });
  };

  const getFeatures = () => {
    const features = { ...product.specifications };
    if (product.colors && product.colors[selectedColorIndex]) {
      features['Цвет'] = product.colors[selectedColorIndex].name;
    }
    return features;
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, selectedColorIndex);
    setShowCart(true);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };

  return (
    <PageContainer>
      <BlackBar />
      <ContentWrapper>
        <ProductGallery
          images={images}
          selectedImage={selectedImage}
          onImageSelect={setSelectedImage}
          productName={product.name}
        />
        <ProductInfo>
          <Title>{product.name}</Title>
          <Designer>Высота: {product.size} см</Designer>
          
          <ColorSection>
            <ColorTitle>Цвет</ColorTitle>
            <ColorOptions>
              {product.colors.map((colorVariant, index) => (
                <ColorOption
                  key={index}
                  $isSelected={selectedColorIndex === index}
                  $color={colorVariant.color}
                  onClick={() => {
                    setSelectedColorIndex(index);
                    setSelectedImage(0);
                  }}
                />
              ))}
            </ColorOptions>
          </ColorSection>
          <Price>{product.price.toLocaleString()} ₽</Price>

          <AddToCartButton onClick={handleAddToCart}>
            {isAddedToCart ? 'Добавлено в корзину' : 'Добавить в корзину'}
          </AddToCartButton>

          <DeliveryInfo>
            Сделано специально для вас, доставка {getDeliveryDate()}<br />
            На данный момент, доставка только в Ростове-на-Дону<br />
          </DeliveryInfo>
        </ProductInfo>

        <DescriptionSection>
          <DescriptionHeader onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}>
            <SpecificationsTitle>Описание</SpecificationsTitle>
            <SpecificationsIcon $isOpen={isDescriptionOpen} />
          </DescriptionHeader>
          <DescriptionContent $isOpen={isDescriptionOpen}>
            <DescriptionText>
              {product.description}
            </DescriptionText>
          </DescriptionContent>
        </DescriptionSection>

        <SpecificationsSection>
          <SpecificationsHeader onClick={() => setIsSpecificationsOpen(!isSpecificationsOpen)}>
            <SpecificationsTitle>Характеристики</SpecificationsTitle>
            <SpecificationsIcon $isOpen={isSpecificationsOpen} />
          </SpecificationsHeader>
          <SpecificationsContent $isOpen={isSpecificationsOpen}>
            {Object.entries(getFeatures()).map(([key, value]) => (
              <SpecificationItem key={key}>
                <SpecificationLabel>{getSpecificationLabel(key)}</SpecificationLabel>
                <SpecificationValue>{value}</SpecificationValue>
              </SpecificationItem>
            ))}
          </SpecificationsContent>
        </SpecificationsSection>

        <ReviewsSection>
          <ReviewsHeader onClick={() => setIsReviewsOpen(!isReviewsOpen)}>
            <SpecificationsTitle>Отзывы</SpecificationsTitle>
            <SpecificationsIcon $isOpen={isReviewsOpen} />
          </ReviewsHeader>
          <ReviewsContent $isOpen={isReviewsOpen}>
            {product.reviews && product.reviews.map((review: { author: string; text: string }, index: number) => (
              <ReviewItem key={index}>
                <ReviewAuthor>{review.author}</ReviewAuthor>
                <ReviewText>{review.text}</ReviewText>
              </ReviewItem>
            ))}
          </ReviewsContent>
        </ReviewsSection>

        <OtherProductsSection>
          <OtherProductsTitle>Другие товары</OtherProductsTitle>
          {otherProducts && otherProducts.length > 0 && (
            <ProductGridSection 
              products={otherProducts} 
              showHeader={false}
              isProductPage={true}
            />
          )}
        </OtherProductsSection>
      </ContentWrapper>
    </PageContainer>
  );
}; 