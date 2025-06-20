import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product, ProductColor } from '../types/product';
import { Button } from './Button';

const ProductSection = styled.section<{ $isProductPage?: boolean }>`
  padding: ${props => props.$isProductPage ? '0' : '80px 20px'};
  background: white;
  width: 100%;
  box-sizing: border-box;
`;

const SectionHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto 40px;
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 3.5rem;
  line-height: 1;
  margin-bottom: 1rem;
  text-align: left;
  font-weight: 500;
  color: #000;

  @media (max-width: 768px) {
    font-size: 2rem;
    text-align: center;
  }
`;

const SectionDescription = styled.p`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  line-height: 1.2;
  font-size: 1.8rem;
  color: #333;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
    text-align: center;
  }
`;

const ProductGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  width: 100%;
  box-sizing: border-box;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 2000px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ProductCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProductImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  overflow: hidden;
`;

const ProductImage = styled.div<{ $imageUrl: string; $isHovered: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$imageUrl});
  background-size: cover;
  background-position: center;
  transition: opacity 0.3s ease;
  opacity: 1;
  will-change: opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
`;

const ProductImageHover = styled.div<{ $imageUrl: string; $isHovered: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$imageUrl});
  background-size: cover;
  background-position: center;
  transition: opacity 0.3s ease;
  opacity: ${props => props.$isHovered ? 1 : 0};
  will-change: opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
`;

const ProductInfo = styled.div`
  display: flex;
  line-height: 1;
  flex-direction: column;
  gap: 8px;
`;

const ProductName = styled.h3`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.4rem;
  margin-botton: 10px;
  font-weight: 500;
  color: #000;
`;

const ProductDesigner = styled.p`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.1rem;
  color: #333;
  margin: 0;
`;

const ProductSize = styled.p`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  color: #333;
  margin: 0;
`;

const ProductPrice = styled.p`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.3rem;
  font-weight: 500;
  margin: 0;
  color: #000;
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 10px;

`;

const ColorOption = styled.div<{ $color: string; $title: string }>`
  width: 24px;
  height: 24px;
  background-color: ${props => props.$color};
  cursor: pointer;
  border: 1px solid #ddd;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

interface ProductGridProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
  showHeader?: boolean;
  isProductPage?: boolean;
}

export const ProductGridSection: React.FC<ProductGridProps> = ({ 
  products, 
  onEdit, 
  onDelete,
  isAdmin = false,
  showHeader = true,
  isProductPage = false
}) => {
  const navigate = useNavigate();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<{ [key: string]: number }>({});
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const [visibleProducts, setVisibleProducts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const productId = entry.target.getAttribute('data-product-id');
          if (productId) {
            setVisibleProducts(prev => {
              const next = new Set(prev);
              if (entry.isIntersecting) {
                next.add(productId);
              } else {
                next.delete(productId);
              }
              return next;
            });
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );

    document.querySelectorAll('.product-card').forEach(card => {
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, [products]);

  useEffect(() => {
    const imagesToPreload = new Set<string>();
    
    products.forEach(product => {
      if (visibleProducts.has(product.id)) {
        const colorIndex = selectedColors[product.id] || 0;
        const color = product.colors[colorIndex];
        
        if (color) {
          // Приоритизируем загрузку основных изображений
          imagesToPreload.add(color.mainImage);
          imagesToPreload.add(color.secondaryImage);
          
          // Дополнительные изображения загружаем только если они видны
          if (color.additionalImages) {
            color.additionalImages.forEach(img => {
              if (img && !preloadedImages.has(img)) {
                imagesToPreload.add(img);
              }
            });
          }
        }
      }
    });

    imagesToPreload.forEach(url => {
      if (!preloadedImages.has(url)) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          setPreloadedImages(prev => new Set([...prev, url]));
        };
      }
    });
  }, [products, selectedColors, visibleProducts, preloadedImages]);

  // Инициализация выбранных цветов
  useEffect(() => {
    const initialColors: Record<string, number> = {};
    products.forEach(product => {
      if (product.colors && product.colors.length > 0) {
        initialColors[product.id] = 0;
      }
    });
    setSelectedColors(initialColors);
  }, [products]);

  const handleColorSelect = (productId: string, colorIndex: number) => {
    setSelectedColors(prev => ({
      ...prev,
      [productId]: colorIndex
    }));
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <ProductSection $isProductPage={isProductPage} className="product-section">
      {showHeader && (
        <SectionHeader>
          <SectionTitle>Наши лампы</SectionTitle>
          <SectionDescription>
            Каждая лампа создана с любовью и вниманием к деталям
          </SectionDescription>
        </SectionHeader>
      )}
      <ProductGridContainer>
        {products.map(product => {
          const selectedColorIndex = selectedColors[product.id] || 0;
          const selectedColor = product.colors?.[selectedColorIndex];

          if (!selectedColor) return null;

          return (
            <ProductCard 
              key={product.id} 
              className="product-card"
              data-product-id={product.id}
            >
              <ProductImageContainer
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => handleProductClick(product.id)}
              >
                <ProductImage
                  $imageUrl={selectedColor.mainImage}
                  $isHovered={hoveredProduct === product.id}
                />
                <ProductImageHover
                  $imageUrl={selectedColor.secondaryImage}
                  $isHovered={hoveredProduct === product.id}
                />
              </ProductImageContainer>
              <ProductInfo>
                <ProductName>{product.name}</ProductName>
                <ProductSize>Высота: {product.size} см</ProductSize>
                <ProductPrice>{product.price.toLocaleString()} ₽</ProductPrice>
                <ColorOptions>
                  {product.colors?.map((color, index) => (
                    <ColorOption
                      key={index}
                      $color={color.color}
                      $title={color.name}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleColorSelect(product.id, index);
                      }}
                    />
                  ))}
                </ColorOptions>
              </ProductInfo>
              {isAdmin && (
                <ButtonGroup>
                  <Button onClick={() => onEdit?.(product)}>Редактировать</Button>
                  <Button onClick={() => onDelete?.(product.id)}>Удалить</Button>
                </ButtonGroup>
              )}
            </ProductCard>
          );
        })}
      </ProductGridContainer>
    </ProductSection>
  );
};

const AdminControls = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  z-index: 2;
`;

const AdminButton = styled.button`
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 8px 16px;
  font-family: var(--font-buch), "Helvetica", sans-serif;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 4px;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`; 