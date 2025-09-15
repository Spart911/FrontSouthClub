import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { apiService, type Product, buildFileUrl } from '../services/api';

const SectionWrapper = styled.section`
  padding: 40px 20px;
  background: #ffffff;
  scroll-margin-top: 50px;
  @media (max-width: 768px) {
  padding-top: 0px;
`;

const Title = styled.h2`
  font-size: 5rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 900;
  text-align: center;
  margin-bottom: 32px;
  color: rgb(0, 0, 0);
`;
const Grid = styled.div`
  width: 100%;
  max-width: 1800px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  justify-items: stretch;
  min-height: 600px; /* Предотвращаем CLS */

  @media (max-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
    min-height: 500px;
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    min-height: 400px;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 44px 38px;
    min-height: 350px;
  }
`;

const CardWrapper = styled.div<{ $isComingSoon: boolean; $hasHover: boolean }>`
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

  ${({ $hasHover }) =>
    $hasHover &&
    css`
      &:hover img.hoverImg {
        opacity: 1;
      }

      &:hover img.mainImg {
        opacity: 0;
      }
    `}

  img {
    pointer-events: none;
    width: 100%;
    object-fit: cover;
    transition: opacity 0.4s ease, transform 0.4s ease;
    display: block;
  }

  img.hoverImg {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 1;
  }

  ${({ $isComingSoon }) =>
    $isComingSoon &&
    css`
      &::before {
        content: '';
        position: absolute;
        top: 50%;
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
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-weight: 900;
        font-size: clamp(20px, 6vw, 56px);
        text-align: center;
        color: #ffffff;
        z-index: 3;
      img {
        filter: blur(3px);
        clip-path: inset(0);
        }
    `}
`;

const ImageContainer = styled.div`
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
  }

  img.hoverImg {
    opacity: 0;
    z-index: 1;
  }
`;

const InfoBlock = styled.div`
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

  @media (max-width: 768px) {
    bottom: -38px;
        width: 90%;
        padding: 1px 0px;

  }
`;

const EmptyBlock = styled(InfoBlock)`
  height: 60px;
  padding: 0;
`;

const ProductName = styled.div`
  background: #1e3ea8;
  color: #fff;
  font-weight: 800;
  font-size: 2.4rem;
  text-transform: uppercase;
  border-radius: 18px;
  display: inline-block;
    padding: 0px 12px;
    @media (max-width: 768px) {
        font-size: 1.4rem;
        letter-spacing: 0.1rem;
        line-height: 1.1;
        padding: 4px 12px;
    }
`;

const ProductPrice = styled.div`
  font-weight: 500;
  font-size: 1.7rem;
  color: #000;
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

export const ProductGrid: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getProducts(1, 20); // Load fewer products initially
        // Sort by order_number (ascending); undefined go to end
        const sorted = [...response.products].sort((a: Product, b: Product) => {
          const ao = (a as any).order_number ?? Number.MAX_SAFE_INTEGER;
          const bo = (b as any).order_number ?? Number.MAX_SAFE_INTEGER;
          return ao - bo;
        });
        setProducts(sorted);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Ошибка загрузки товаров');
        // Fallback to static data if API fails
        setProducts([
          { id: '1', name: 'T-SHIRT CREW RND', price: 2999, size: [1, 2, 3], photos: [] },
          { id: '2', name: 'HOODIE ZIP RND', price: 4999, size: [1, 2, 3, 4], photos: [] },
          { id: '3', name: 'JACKET RAIN RND', price: 7999, size: [2, 3, 4], photos: [] },
        ] as unknown as Product[]);
      } finally {
        setLoading(false);
      }
    };

    // Delay initial load slightly to prioritize critical rendering
    const timeoutId = setTimeout(loadProducts, 50);
    return () => clearTimeout(timeoutId);
  }, []);

  if (loading) {
    return (
      <SectionWrapper id="products">
        <Title>ТОВАРЫ</Title>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '200px',
          fontFamily: 'var(--font-buch), "Helvetica", sans-serif',
          color: '#1e3ea8'
        }}>
          Загрузка товаров...
        </div>
      </SectionWrapper>
    );
  }

  if (error) {
    console.warn('Using fallback data due to API error:', error);
  }

  return (
    <SectionWrapper id="products">
      <Title>ТОВАРЫ</Title>
      <Grid>
        {products.map((product) => {
          const isComingSoon = !!(product as any).soon;
          const mainPhoto = product.photos.find(p => p.priority === 0) || product.photos[0];
          const hoverPhoto = product.photos.find(p => p.priority === 1);
          
          return (
            <CardWrapper 
              key={product.id} 
              $isComingSoon={isComingSoon} 
              $hasHover={!!hoverPhoto}
              onClick={() => !isComingSoon && navigate(`/product/${product.id}`)}
              style={{ cursor: isComingSoon ? 'default' : 'pointer' }}
            >
              <ImageContainer>
                {mainPhoto ? (
                  <img 
                    src={buildFileUrl(mainPhoto.file_path)} 
                    alt={product.name} 
                    className="mainImg"
                    decoding="async"
                    loading="lazy"
                  />
                ) : (
                  <img src="/images/production/logo.png" alt={product.name} className="mainImg" decoding="async" loading="lazy" />
                )}
                
                {hoverPhoto && (
                  <img 
                    src={buildFileUrl(hoverPhoto.file_path)} 
                    alt={product.name} 
                    className="hoverImg"
                    decoding="async"
                    loading="lazy"
                  />
                )}
              </ImageContainer>

              {isComingSoon ? (
                <EmptyBlock />
              ) : (
                <InfoBlock>
                  <ProductName>{product.name}</ProductName>
                  <ProductPrice>{product.price} RUB</ProductPrice>
                </InfoBlock>
              )}
            </CardWrapper>
          );
        })}
      </Grid>
    </SectionWrapper>
  );
};
