import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  apiService, 
  type Product, 
  type ProductCreate,
  type ProductPhoto,
  type PhotoUpload,
  buildFileUrl,
  SIZE_OPTIONS,
  getSizeLabel
} from '../services/api';

const ProductsContainer = styled.div`
  h2 {
    color: #1e3ea8;
    margin-bottom: 20px;
    font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
  align-items: start;
`;

const ProductCard = styled.div<{ $soon?: boolean }>`
  position: relative;
  border: 2px solid ${props => props.$soon ? '#1e3ea8' : '#e1e5e9'};
  border-radius: 10px;
  padding: 16px;
  background: ${props => props.$soon ? 'linear-gradient(0deg, rgba(30,62,168,0.06), rgba(30,62,168,0.06)), #fff' : 'white'};
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
`;

const SoonBadge = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background: #1e3ea8;
  color: #fff;
  font-weight: 800;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  letter-spacing: 0.5px;
`;

const ProductImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 12px;
`;

const ProductName = styled.h3`
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.1rem;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProductPrice = styled.p`
  margin: 0 0 8px 0;
  color: #1e3ea8;
  font-weight: bold;
  font-size: 1rem;
`;

const ProductDetails = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 12px;
  flex: 1 1 auto;
  
  p {
    margin: 4px 0;
  }
`;

const ProductActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-between;
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #1e3ea8;
          color: white;
          &:hover { background: #1a3590; }
        `;
      case 'danger':
        return `
          background: #dc3545;
          color: white;
          &:hover { background: #c82333; }
        `;
      default:
        return `
          background: #6c757d;
          color: white;
          &:hover { background: #5a6268; }
        `;
    }
  }}
`;

const AddProductButton = styled(Button)`
  background: #28a745;
  color: white;
  padding: 12px 24px;
  font-size: 16px;
  margin-bottom: 20px;
  
  &:hover {
    background: #218838;
  }
`;

const Modal = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    margin: 0;
    color: #1e3ea8;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #1e3ea8;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #1e3ea8;
  }
`;


const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c53030;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  border: 1px solid #feb2b2;
`;

const PhotoUploadSection = styled.div`
  margin-bottom: 20px;
`;

const ExistingPhotosSection = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`;

const PhotoUploadArea = styled.div`
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  margin-bottom: 15px;
  cursor: pointer;
  transition: border-color 0.2s ease;
  
  &:hover {
    border-color: #1e3ea8;
  }
  
  &.dragover {
    border-color: #1e3ea8;
    background: #f0f4ff;
  }
`;

const PhotoPreview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

const PhotoItem = styled.div`
  position: relative;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`;

const PhotoInfo = styled.div`
  padding: 10px;
  background: #f8f9fa;
`;

const PhotoPriority = styled.select`
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 5px;
`;

const PhotoName = styled.input`
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 5px;
`;

const RemovePhotoButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: #c82333;
  }
`;

const SizesSection = styled.div`
  margin-bottom: 20px;
`;

const SizesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;

const SizeCheckbox = styled.label`
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f0f4ff;
    border-color: #1e3ea8;
  }
  
  input[type="checkbox"] {
    margin-right: 8px;
  }
  
  input[type="checkbox"]:checked + span {
    color: #1e3ea8;
    font-weight: bold;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  background: #1e3ea8;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #1a3590;
  }
`;

// Helper to read image as data URL
async function readFileAsDataUrl(file: File): Promise<string> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  return dataUrl;
}

// Helper to load an HTMLImageElement from data URL
async function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  const image: HTMLImageElement = await new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img as HTMLImageElement);
    img.onerror = reject;
    img.src = dataUrl;
  });
  return image;
}

// Helper to resize and center-crop an image to exact square size (default 1000x1000)
async function resizeImageToSquare(file: File, targetSize: number = 1000): Promise<File> {
  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImage(dataUrl);

  // Enforce 1:1 aspect ratio. If not square, throw to let caller show an error and skip file.
  const epsilon = 0.01;
  if (Math.abs(image.width / image.height - 1) > epsilon) {
    throw new Error('aspect_ratio_not_square');
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // Calculate scale to cover the square
  const scale = Math.max(targetSize / image.width, targetSize / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const offsetX = (targetSize - drawWidth) / 2;
  const offsetY = (targetSize - drawHeight) / 2;

  ctx.clearRect(0, 0, targetSize, targetSize);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

  const blob: Blob = await new Promise((resolve) => canvas.toBlob(b => resolve(b as Blob), 'image/jpeg', 0.92));
  const processedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' });
  return processedFile;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductCreate>({
    name: '',
    soon: false,
    color: '',
    composition: '',
    print_technology: '',
    price: 0,
    size: [],
  });
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [photoUploads, setPhotoUploads] = useState<PhotoUpload[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<ProductPhoto[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('Loading products...');
      const response = await apiService.getProducts(1, 100);
      console.log('Products loaded:', response);
      const sorted = (response.products || []).slice().sort((a, b) => (a.order_number ?? 0) - (b.order_number ?? 0));
      setProducts(sorted);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Ошибка загрузки товаров');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      soon: false,
      color: '',
      composition: '',
      print_technology: '',
      price: 0,
      size: [],
    });
    setSelectedSizes([]);
    setPhotoUploads([]);
    setExistingPhotos([]);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      soon: !!product.soon,
      color: product.color || '',
      composition: product.composition || '',
      print_technology: product.print_technology || '',
      size: product.size || [],
      price: product.price,
    });
    setSelectedSizes(product.size || []);
    setPhotoUploads([]);
    setExistingPhotos(product.photos || []);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validate required fields
    if (!formData.name || !formData.name.trim()) {
      setError('Название товара обязательно');
      alert('Название товара обязательно');
      setSubmitting(false);
      return;
    }

    if (!formData.soon) {
      if (!Array.isArray(selectedSizes) || selectedSizes.length === 0) {
        setError('Выберите хотя бы один размер');
        alert('Выберите хотя бы один размер');
        setSubmitting(false);
        return;
      }
    }

    const priceNumber = typeof formData.price === 'number' ? formData.price : parseInt(String(formData.price || 0), 10);
    if (!formData.soon) {
      if (!priceNumber || priceNumber <= 0) {
        setError('Укажите корректную цену (> 0)');
        alert('Укажите корректную цену (> 0)');
        setSubmitting(false);
        return;
      }
    }

    try {
      const updatedFormData = { 
        ...formData, 
        price: formData.soon ? 0 : priceNumber,
        size: selectedSizes 
      };

      console.log('Submitting product data:', updatedFormData);

      let productId: string;
      if (editingProduct) {
        console.log('Updating product:', editingProduct.id);
        await apiService.updateProduct(editingProduct.id, updatedFormData);
        productId = editingProduct.id;
      } else {
        console.log('Creating new product');
        const newProduct = await apiService.createProduct(updatedFormData);
        console.log('Product created:', newProduct);
        productId = newProduct.id;
      }

      // Загружаем фотографии и затем принудительно устанавливаем нужный приоритет,
      // если бэк его игнорирует на этапе загрузки
      for (const photoUpload of photoUploads) {
        try {
          const created = await apiService.uploadProductPhoto(productId, photoUpload.file, {
            name: photoUpload.name,
            priority: photoUpload.priority
          });
          if (created && created.id != null && created.priority !== photoUpload.priority) {
            await apiService.updateProductPhoto(created.id, { priority: photoUpload.priority });
          }
        } catch (uploadErr) {
          console.error('Ошибка загрузки фото:', uploadErr);
        }
      }
      
      setIsModalOpen(false);
      loadProducts();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка сохранения товара';
      setError(errorMessage);
      console.error('Error saving product:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      await apiService.deleteProduct(productId);
      loadProducts();
    } catch (err) {
      setError('Ошибка удаления товара');
      console.error('Error deleting product:', err);
    }
  };

  const handleInputChange = (field: keyof ProductCreate, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSizeChange = (size: number, checked: boolean) => {
    setSelectedSizes(prev => 
      checked 
        ? [...prev, size]
        : prev.filter(s => s !== size)
    );
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;
    
    const processed: PhotoUpload[] = [];
    const errors: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const resized = await resizeImageToSquare(file, 1000);
        processed.push({ file: resized, priority: 2, name: resized.name });
      } catch (err) {
        if (err instanceof Error && err.message === 'aspect_ratio_not_square') {
          errors.push(`Файл ${file.name}: изображение должно быть квадратным (1:1)`);
          alert(`Файл ${file.name} не загружен. Требуется изображение формата 1:1.`);
        } else {
          errors.push(`Файл ${file.name}: не удалось обработать изображение`);
        }
      }
    }
    
    if (errors.length > 0) {
      setError(errors.join('\n'));
    }
    
    if (processed.length > 0) {
      setPhotoUploads(prev => [...prev, ...processed]);
    }
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    await handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removePhoto = (index: number) => {
    setPhotoUploads(prev => prev.filter((_, i) => i !== index));
  };

  const updatePhotoPriority = (index: number, priority: number) => {
    setPhotoUploads(prev => prev.map((photo, i) => 
      i === index ? { ...photo, priority } : photo
    ));
  };

  const updatePhotoName = (index: number, name: string) => {
    setPhotoUploads(prev => prev.map((photo, i) => 
      i === index ? { ...photo, name } : photo
    ));
  };

  // Existing photo management functions
  const deleteExistingPhoto = async (photoId: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить это фото?')) {
      return;
    }

    try {
      await apiService.deleteProductPhoto(photoId);
      setExistingPhotos(prev => prev.filter(photo => photo.id !== photoId));
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError('Ошибка удаления фото');
    }
  };

  const updateExistingPhotoPriority = async (photoId: string, priority: number) => {
    try {
      const updatedPhoto = await apiService.updateProductPhoto(photoId, { priority });
      setExistingPhotos(prev => prev.map(photo => 
        photo.id === photoId ? updatedPhoto : photo
      ));
    } catch (err) {
      console.error('Error updating photo priority:', err);
      setError('Ошибка обновления приоритета фото');
    }
  };

  const updateExistingPhotoName = async (photoId: string, name: string) => {
    try {
      const updatedPhoto = await apiService.updateProductPhoto(photoId, { name });
      setExistingPhotos(prev => prev.map(photo => 
        photo.id === photoId ? updatedPhoto : photo
      ));
    } catch (err) {
      console.error('Error updating photo name:', err);
      setError('Ошибка обновления названия фото');
    }
  };

  // Reorder products (swap order_number with adjacent)
  const sortProductsByOrder = (list: Product[]) => {
    return [...list].sort((a, b) => (a.order_number ?? 0) - (b.order_number ?? 0));
  };

  const moveProductUp = async (productId: string) => {
    const list = sortProductsByOrder(products);
    const index = list.findIndex(p => p.id === productId);
    if (index <= 0) return;
    const current = list[index];
    const prev = list[index - 1];
    if (current.order_number == null || prev.order_number == null) return;

    try {
      const updatedPrev = await apiService.updateProductOrder(prev.id, current.order_number);
      const updatedCurrent = await apiService.updateProductOrder(current.id, prev.order_number);
      // Update local state
      const merged = list.map(p => {
        if (p.id === updatedPrev.id) return { ...p, order_number: updatedPrev.order_number } as Product;
        if (p.id === updatedCurrent.id) return { ...p, order_number: updatedCurrent.order_number } as Product;
        return p;
      });
      setProducts(sortProductsByOrder(merged));
    } catch (err) {
      console.error('Error moving product up:', err);
      alert('Не удалось изменить порядок товара');
    }
  };

  const moveProductDown = async (productId: string) => {
    const list = sortProductsByOrder(products);
    const index = list.findIndex(p => p.id === productId);
    if (index === -1 || index >= list.length - 1) return;
    const current = list[index];
    const next = list[index + 1];
    if (current.order_number == null || next.order_number == null) return;

    try {
      const updatedNext = await apiService.updateProductOrder(next.id, current.order_number);
      const updatedCurrent = await apiService.updateProductOrder(current.id, next.order_number);
      // Update local state
      const merged = list.map(p => {
        if (p.id === updatedNext.id) return { ...p, order_number: updatedNext.order_number } as Product;
        if (p.id === updatedCurrent.id) return { ...p, order_number: updatedCurrent.order_number } as Product;
        return p;
      });
      setProducts(sortProductsByOrder(merged));
    } catch (err) {
      console.error('Error moving product down:', err);
      alert('Не удалось изменить порядок товара');
    }
  };

  if (loading) {
    return (
      <ProductsContainer>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <LoadingSpinner />
          <p>Загрузка товаров...</p>
        </div>
      </ProductsContainer>
    );
  }

  return (
    <ProductsContainer>
      <h2>Управление товарами</h2>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <AddProductButton onClick={handleAddProduct}>
        + Добавить товар
      </AddProductButton>

      <ProductsGrid>
        {products.map((product) => {
          const mainPhoto = product.photos.find(p => p.priority === 0) || product.photos[0];
          
          return (
            <ProductCard key={product.id} $soon={!!(product as any).soon}>
              {(product as any).soon && <SoonBadge>SOON</SoonBadge>}
              {mainPhoto && (
                <ProductImage 
                  src={buildFileUrl(mainPhoto.file_path)} 
                  alt={product.name}
                />
              )}
              <ProductName>{product.name}</ProductName>
              <ProductPrice>{product.price} RUB</ProductPrice>
              <ProductDetails>
                <p><strong>Размеры:</strong> {product.size?.map(size => getSizeLabel(size)).join(', ') || 'Не указаны'}</p>
                {product.color && <p><strong>Цвет:</strong> {product.color}</p>}
                {product.composition && <p><strong>Состав:</strong> {product.composition}</p>}
                {product.print_technology && <p><strong>Печать:</strong> {product.print_technology}</p>}
                <p><strong>Фото:</strong> {product.photos.length}</p>
              </ProductDetails>
              <ProductActions>
                <Button onClick={() => handleEditProduct(product)}>
                  Редактировать
                </Button>
                <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>
                  Удалить
                </Button>
                {typeof product.order_number === 'number' && (
                  <>
                    <Button type="button" onClick={() => moveProductUp(product.id)}>
                      ↑ Вверх
                    </Button>
                    <Button type="button" onClick={() => moveProductDown(product.id)}>
                      ↓ Вниз
                    </Button>
                  </>
                )}
              </ProductActions>
            </ProductCard>
          );
        })}
      </ProductsGrid>

      <Modal $isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <h3>{editingProduct ? 'Редактировать товар' : 'Добавить товар'}</h3>
            <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <Button type="button" variant={formData.soon ? 'secondary' : 'primary'} onClick={() => setFormData(prev => ({ ...prev, soon: false }))}>
                Обычный товар
              </Button>
              <Button type="button" variant={formData.soon ? 'primary' : 'secondary'} onClick={() => setFormData(prev => ({ ...prev, soon: true }))}>
                SOON
              </Button>
            </div>
            <FormGroup>
              <Label>Название *</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </FormGroup>

            {!formData.soon && (
            <FormGroup>
              <Label>Цена (RUB) *</Label>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={String(formData.price ?? '')}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^0-9]/g, '');
                  handleInputChange('price', raw === '' ? ('' as unknown as number) : parseInt(raw, 10));
                }}
                placeholder="Введите цену"
              />
            </FormGroup>
            )}

            {!formData.soon && (
            <SizesSection>
              <Label>Размеры *</Label>
              <SizesGrid>
                {SIZE_OPTIONS.map((size) => (
                  <SizeCheckbox key={size.value}>
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size.value)}
                      onChange={(e) => handleSizeChange(size.value, e.target.checked)}
                    />
                    <span>{size.label}</span>
                  </SizeCheckbox>
                ))}
              </SizesGrid>
            </SizesSection>
            )}

            {!formData.soon && (
            <FormGroup>
              <Label>Цвет</Label>
              <Input
                type="text"
                value={formData.color}
                onChange={(e) => handleInputChange('color', e.target.value)}
              />
            </FormGroup>
            )}

            {!formData.soon && (
            <FormGroup>
              <Label>Состав</Label>
              <TextArea
                value={formData.composition}
                onChange={(e) => handleInputChange('composition', e.target.value)}
              />
            </FormGroup>
            )}


            {!formData.soon && (
            <FormGroup>
              <Label>Технология печати</Label>
              <Input
                type="text"
                value={formData.print_technology}
                onChange={(e) => handleInputChange('print_technology', e.target.value)}
              />
            </FormGroup>
            )}

            <PhotoUploadSection>
              <Label>Фотографии товара</Label>
              
              {/* Existing Photos */}
              {editingProduct && (
                <ExistingPhotosSection>
                  <Label>Существующие фотографии</Label>
                  {existingPhotos.length > 0 ? (
                    <PhotoPreview>
                      {existingPhotos.map((photo) => (
                        <PhotoItem key={photo.id}>
                          <PhotoImage
                            src={buildFileUrl(photo.file_path)}
                            alt={photo.name}
                          />
                          <RemovePhotoButton onClick={() => deleteExistingPhoto(photo.id)}>
                            ×
                          </RemovePhotoButton>
                          <PhotoInfo>
                            <PhotoPriority
                              value={photo.priority}
                              onChange={(e) => updateExistingPhotoPriority(photo.id, parseInt(e.target.value))}
                            >
                              <option value={0}>Первая фотография</option>
                              <option value={1}>Вторая фотография</option>
                              <option value={2}>Остальные фотографии</option>
                            </PhotoPriority>
                            <PhotoName
                              value={photo.name}
                              onChange={(e) => updateExistingPhotoName(photo.id, e.target.value)}
                              placeholder="Название фото"
                            />
                          </PhotoInfo>
                        </PhotoItem>
                      ))}
                    </PhotoPreview>
                  ) : (
                    <p style={{ color: '#666', fontStyle: 'italic', margin: '10px 0' }}>
                      У этого товара пока нет фотографий
                    </p>
                  )}
                </ExistingPhotosSection>
              )}

              {/* New Photo Upload */}
              <div style={{ marginTop: '20px' }}>
                <Label>Добавить новые фотографии</Label>
                <PhotoUploadArea
                  className={dragOver ? 'dragover' : ''}
                  onDrop={handleFileDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
                  <p>Перетащите фотографии сюда или нажмите для выбора</p>
                  <UploadButton type="button">
                    Выбрать файлы
                  </UploadButton>
                  <FileInput
                    id="photo-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />
                </PhotoUploadArea>
              </div>

              {photoUploads.length > 0 && (
                <div style={{ marginTop: '15px' }}>
                  <Label>Новые фотографии для загрузки</Label>
                  <PhotoPreview>
                    {photoUploads.map((photo, index) => (
                      <PhotoItem key={index}>
                        <PhotoImage
                          src={URL.createObjectURL(photo.file)}
                          alt={photo.name || `Фото ${index + 1}`}
                        />
                        <RemovePhotoButton onClick={() => removePhoto(index)}>
                          ×
                        </RemovePhotoButton>
                        <PhotoInfo>
                          <PhotoPriority
                            value={photo.priority}
                            onChange={(e) => updatePhotoPriority(index, parseInt(e.target.value))}
                          >
                            <option value={0}>Первая фотография</option>
                            <option value={1}>Вторая фотография</option>
                            <option value={2}>Остальные фотографии</option>
                          </PhotoPriority>
                          <PhotoName
                            value={photo.name || ''}
                            onChange={(e) => updatePhotoName(index, e.target.value)}
                            placeholder="Название фото"
                          />
                        </PhotoInfo>
                      </PhotoItem>
                    ))}
                  </PhotoPreview>
                </div>
              )}
            </PhotoUploadSection>

            <ModalActions>
              <Button type="button" onClick={() => setIsModalOpen(false)}>
                Отмена
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? <LoadingSpinner /> : (editingProduct ? 'Сохранить' : 'Создать')}
              </Button>
            </ModalActions>
          </form>
        </ModalContent>
      </Modal>
    </ProductsContainer>
  );
};

export { AdminProducts };
export default AdminProducts;
