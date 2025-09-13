import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { apiService, type SliderPhoto, buildFileUrl } from '../services/api';

const SliderContainer = styled.div`
  h2 {
    color: #1e3ea8;
    margin-bottom: 20px;
    font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  }
`;

const SliderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const SliderCard = styled.div`
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const SliderImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 15px;
`;

const SliderName = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2rem;
`;

const SliderOrder = styled.p`
  margin: 0 0 15px 0;
  color: #1e3ea8;
  font-weight: bold;
`;

const SliderActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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

const UploadButton = styled(Button)`
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

// ---

// ---

// ---

// ---

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

const FileInput = styled.input`
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

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

// Управление порядком перенесено в модальное окно

const AdminSlider: React.FC = () => {
  const [photos, setPhotos] = useState<SliderPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<SliderPhoto | null>(null);
  const [formData, setFormData] = useState({ name: '', order_number: 0 });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setLoading(true);
        const response = await apiService.getSliderPhotos();
        setPhotos(response.photos.sort((a, b) => a.order_number - b.order_number));
      } catch (err) {
        setError('Ошибка загрузки фотографий слайдера');
        console.error('Error loading slider photos:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPhotos();
  }, []);

  if (loading) {
    return (
      <SliderContainer>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <LoadingSpinner />
          <p>Загрузка фотографий слайдера...</p>
        </div>
      </SliderContainer>
    );
  }

  return (
    <SliderContainer>
      <h2>Управление слайдером</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <UploadButton onClick={() => {
        setEditingPhoto(null);
        setFormData({ name: '', order_number: 0 });
        setSelectedFile(null);
        setIsModalOpen(true);
      }}>
        + Загрузить фотографию
      </UploadButton>

      <SliderGrid>
        {photos.map((photo, idx) => (
          <SliderCard key={`${photo.id || 'no-id'}-${photo.file_path}-${photo.order_number}-${idx}`}>
            <SliderImage 
              src={buildFileUrl(photo.file_path)}
              alt={photo.name || `Слайд ${idx + 1}`}
            />
            {photo.name && <SliderName>{photo.name}</SliderName>}
            <SliderOrder>Порядок: {photo.order_number}</SliderOrder>
            <SliderActions>
                <Button type="button" onClick={async () => {
                  if (idx === 0) return;
                  if (!photo.id) return;
                  try {
                    const targetIdx = idx - 1;
                    const other = photos[targetIdx];
                    if (!other.id) return;
                    // Меняем order_number у текущего и соседнего через PUT /slider/{id}
                    const [updatedCurr, updatedOther] = await Promise.all([
                      apiService.updateSliderPhoto(photo.id!, { order_number: other.order_number, name: photo.name }),
                      apiService.updateSliderPhoto(other.id!, { order_number: photo.order_number, name: other.name }),
                    ]);
                    // Обновляем список с данными бэка и сортируем
                    setPhotos(prev => {
                      return prev
                        .map(p => p.id === updatedCurr.id ? updatedCurr : p)
                        .map(p => p.id === updatedOther.id ? updatedOther : p)
                        .sort((a, b) => a.order_number - b.order_number);
                    });
                  } catch (err) {
                    setError('Ошибка изменения порядка');
                    console.error('Error updating photo order (up):', err);
                  }
                }}>
                  ↑ Вверх
                </Button>
                <Button type="button" onClick={async () => {
                  if (idx === photos.length - 1) return;
                  if (!photo.id) return;
                  try {
                    const targetIdx = idx + 1;
                    const other = photos[targetIdx];
                    if (!other.id) return;
                    const [updatedCurr, updatedOther] = await Promise.all([
                      apiService.updateSliderPhoto(photo.id!, { order_number: other.order_number, name: photo.name }),
                      apiService.updateSliderPhoto(other.id!, { order_number: photo.order_number, name: other.name }),
                    ]);
                    setPhotos(prev => {
                      return prev
                        .map(p => p.id === updatedCurr.id ? updatedCurr : p)
                        .map(p => p.id === updatedOther.id ? updatedOther : p)
                        .sort((a, b) => a.order_number - b.order_number);
                    });
                  } catch (err) {
                    setError('Ошибка изменения порядка');
                    console.error('Error updating photo order (down):', err);
                  }
                }}>
                  ↓ Вниз
                </Button>
                <Button type="button" variant="danger" onClick={async () => {
                  if (!photo.id) return;
                  if (!window.confirm('Вы уверены, что хотите удалить эту фотографию?')) return;
                  try {
                    await apiService.deleteSliderPhoto(photo.id!);
                    // После удаления бек перенумеровывает order_number — актуализируем список
                    const refreshed = await apiService.getSliderPhotos();
                    setPhotos(refreshed.photos.sort((a, b) => a.order_number - b.order_number));
                  } catch (err) {
                    setError('Ошибка удаления фотографии');
                    console.error('Error deleting slider photo:', err);
                  }
                }}>
                  Удалить
                </Button>
            </SliderActions>
          </SliderCard>
        ))}
      </SliderGrid>

      <Modal $isOpen={isModalOpen}>
        <ModalContent>
          <ModalHeader>
            <h3>{editingPhoto ? 'Редактировать фотографию' : 'Загрузить фотографию'}</h3>
            <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
          </ModalHeader>

          <form onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            setError('');
            try {
              if (editingPhoto && editingPhoto.id) {
                const updated = await apiService.updateSliderPhoto(editingPhoto.id, formData);
                setPhotos(prev => prev.map(p => (p.id === updated.id ? updated : p)));
              } else {
                if (!selectedFile) {
                  setError('Пожалуйста, выберите файл');
                  setSubmitting(false);
                  return;
                }
                const nextOrder = photos.length; // новый в конец
                const created = await apiService.uploadSliderPhoto(selectedFile, { name: selectedFile.name, order_number: nextOrder });
                // Используем данные с бэкенда (name, order_number, id, file_path)
                setPhotos(prev => [...prev, created].sort((a, b) => a.order_number - b.order_number));
              }
              setIsModalOpen(false);
            } catch (err) {
              setError('Ошибка сохранения фотографии');
              console.error('Error saving slider photo:', err);
            } finally {
              setSubmitting(false);
            }
          }}>
            {!editingPhoto && (
              <FormGroup>
                <Label>Файл *</Label>
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  required={!editingPhoto}
                />
              </FormGroup>
            )}

            {/* При создании название не вводим, оно берется из имени файла; при редактировании можно менять */}
            {editingPhoto && (
              <FormGroup>
                <Label>Название</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </FormGroup>
            )}

            {editingPhoto && (
              <FormGroup>
                <Label>Порядковый номер</Label>
                <Input
                  type="number"
                  value={formData.order_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, order_number: parseInt(e.target.value) || 0 }))}
                  min="0"
                />
              </FormGroup>
            )}

            <ModalActions>
              <Button type="button" onClick={() => setIsModalOpen(false)}>
                Отмена
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? <LoadingSpinner /> : (editingPhoto ? 'Сохранить' : 'Загрузить')}
              </Button>
            </ModalActions>
          </form>
        </ModalContent>
      </Modal>
    </SliderContainer>
  );
};

export { AdminSlider };
export default AdminSlider;
