import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { buildFileUrl, apiService } from '../services/api';
import type { OrderCreate, OrderItem, OrderCreateResponse } from '../services/api';
import { cartService } from '../services/cartService';
import { useConsent } from '../hooks/useConsent';

// YooKassa types
declare global {
  interface Window {
    YooMoneyCheckoutWidget: any;
  }
}

interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image?: string;
  photo?: {
    file_path: string;
    priority: number;
  };
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const Header = styled.div`
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e0e0e0;
`;

const Title = styled.h2`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 2.4rem;
  font-weight: 700;
  color: #000;
  margin: 0;
  text-align: center;
  letter-spacing: 0.1em;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background: none;
   padding: 50px;
  border: none;
  font-size: 3.3rem;
  cursor: pointer;
  color:rgb(0, 0, 0);
  width: 2px;
  height: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #000;
  }
`;

const CartItems = styled.div`
  padding: 16px 24px;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  flex-wrap: wrap;
  gap: 12px;
  position: relative;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const ItemImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 500px) {
    width: 100%;
    margin-bottom: 8px;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-right: 16px;
  
  @media (max-width: 500px) {
    margin-right: 0;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
  
  @media (max-width: 500px) {
    width: 100%;
    margin-bottom: 8px;
    text-align: center;
  }
`;

const ItemName = styled.div`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.6rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 4px;
  letter-spacing: 0.05em;
`;

const ItemSize = styled.div`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.4rem;
  color: #666;
  letter-spacing: 0.05em;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  margin: 0 16px;
  
  @media (max-width: 500px) {
    margin: 0;
    justify-content: center;
    width: 100%;
  }
`;

const QuantityButton = styled.button`
    
    padding: 5px;
  width: 32px;
  height: 32px;
  border: 1px solid rgb(0, 0, 0);
  background: white;
  color: #000;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-family: Arial, sans-serif;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const Quantity = styled.span`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.6rem;
  margin: 0 12px;
  min-width: 24px;
  text-align: center;
  letter-spacing: 0.05em;
`;

const ItemPrice = styled.div`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.6rem;
  font-weight: 600;
  color: #000;
  margin-right: 16px;
  letter-spacing: 0.05em;
  
  @media (max-width: 500px) {
    margin-right: 0;
    text-align: center;
    width: 100%;
  }
`;

const RemoveButton = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid #e0e0e0;
  background: white;
  color: #666;
  padding: 5px;
  font-size: 1.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-family: Arial, sans-serif;
  justify-content: center;
  border-radius: 50%;
  line-height: 0.8;
  
  @media (max-width: 500px) {
    position: absolute;
    top: 16px;
    right: 0;
  }
  
  &:hover {
    background: #f5f5f5;
    color: #000;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #e0e0e0;
  margin: 16px 24px;
`;

const CartTotal = styled.div`
  padding: 16px 24px;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #000;
  text-align: center;
  letter-spacing: 0.05em;
`;

const FormSection = styled.div`
  padding: 16px 24px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.4rem;
  color: #000;
  margin-bottom: 8px;
  font-weight: 600;
  letter-spacing: 0.05em;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.4rem;
  letter-spacing: 0.05em;
  
  &:focus {
    outline: none;
    border-color: #1e3ea8;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.4rem;
  background: white;
  letter-spacing: 0.05em;
  
  &:focus {
    outline: none;
    border-color: #1e3ea8;
  }
`;

const DeliveryInfo = styled.div`
  padding: 16px 24px;
  background: #f8f9fa;
  margin: 16px 24px;
  text-align: center;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.4rem;
  color: #666;
  letter-spacing: 0.05em;
`;

const FinalTotal = styled.div`
  padding: 16px 24px;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #000;
  text-align: center;
  border-top: 1px solid #e0e0e0;
  letter-spacing: 0.05em;
`;

const PayButton = styled.button`
  width: calc(100% - 48px);
  padding: 16px;
  background: #1e3ea8;
  color: white;
  border: none;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.8rem;
  font-weight: 600;
  cursor: pointer;
  margin: 16px 24px 24px;
  letter-spacing: 0.05em;
  
  &:hover {
    background: #152a7a;
  }
`;

const EmptyCart = styled.div`
  padding: 40px 24px;
  text-align: center;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.6rem;
  color: #666;
  letter-spacing: 0.05em;
`;


export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { hasConsent, requestConsent } = useConsent();
  const [consentState, setConsentState] = useState(hasConsent);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    house: '',
    apartment: '',
    deliveryDate: '',
    deliveryTime: ''
  });

  const getDeliveryDateTime = () => {
    if (!formData.deliveryDate || !formData.deliveryTime) return '';

    const [startHour, endHour] = formData.deliveryTime.split('-');
    const start = parseInt(startHour, 10);
    const end = parseInt(endHour, 10);

    if (isNaN(start) || isNaN(end)) return '';

    const middleHour = Math.floor((start + end) / 2);
    const hourStr = String(middleHour).padStart(2, '0');

    return `${formData.deliveryDate}T${hourStr}:00:00`;
  };

  const [showTimeOptions, setShowTimeOptions] = useState(false);

  // Sync consent state
  useEffect(() => {
    setConsentState(hasConsent);
  }, [hasConsent]);

  // Listen for consent changes
  useEffect(() => {
    const handleConsentChange = () => {
      const consent = localStorage.getItem('data_processing_consent') === 'true';
      setConsentState(consent);
    };

    window.addEventListener('storage', handleConsentChange);
    window.addEventListener('consentChanged', handleConsentChange);

    return () => {
      window.removeEventListener('storage', handleConsentChange);
      window.removeEventListener('consentChanged', handleConsentChange);
    };
  }, []);

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const loadCartItems = () => {
      setCartItems(cartService.getCartItems());
    };

    if (isOpen) {
      loadCartItems();
    }
  }, [isOpen]);

  // Phone number formatting function (same as in FeedbackSection)
  const formatPhoneNumber = (value: string) => {
    // Убираем все нецифровые символы
    const numbers = value.replace(/\D/g, '');
    
    // Если номер начинается с 7 или 8, заменяем на +7
    let formattedNumber = numbers;
    if (numbers.startsWith('8')) {
      formattedNumber = '7' + numbers.slice(1);
    } else if (numbers.startsWith('7')) {
      formattedNumber = numbers;
    } else if (numbers.length > 0 && !numbers.startsWith('7')) {
      formattedNumber = '7' + numbers;
    }
    
    // Форматируем номер: +7 (XXX) XXX-XX-XX
    if (formattedNumber.length >= 1) {
      let result = '+7';
      if (formattedNumber.length > 1) {
        result += ' (' + formattedNumber.slice(1, 4);
      }
      if (formattedNumber.length >= 5) {
        result += ') ' + formattedNumber.slice(4, 7);
      }
      if (formattedNumber.length >= 8) {
        result += '-' + formattedNumber.slice(7, 9);
      }
      if (formattedNumber.length >= 10) {
        result += '-' + formattedNumber.slice(9, 11);
      }
      return result;
    }
    
    return '+7';
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formattedNumber = formatPhoneNumber(input);
    
    // Сохраняем позицию курсора
    const cursorPosition = e.target.selectionStart || 0;
    const oldLength = formData.phone.length;
    const newLength = formattedNumber.length;
    
    setFormData(prev => ({
      ...prev,
      phone: formattedNumber.replace(/\D/g, '').slice(0, 11)
    }));
    
    // Восстанавливаем позицию курсора после обновления DOM
    setTimeout(() => {
      const input = document.querySelector('input[name="phone"]') as HTMLInputElement;
      if (input) {
        const newPosition = cursorPosition + (newLength - oldLength);
        input.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  const validatePhone = (phone: string) => {
    // Проверяем только количество цифр (должно быть 11, включая +7)
    const numbers = phone.replace(/\D/g, '');
    return numbers.length === 11;
  };

  const deliveryCost = 299;
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + deliveryCost;

  const updateQuantity = (id: string, size: string, change: number) => {
    const item = cartItems.find(item => item.id === id && item.size === size);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      cartService.updateQuantity(id, size, newQuantity);
      setCartItems(cartService.getCartItems());
    }
  };

  const removeItem = (id: string, size: string) => {
    cartService.removeFromCart(id, size);
    setCartItems(cartService.getCartItems());
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phone') {
      // Обработка номера телефона вынесена в отдельную функцию
      return;
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
      
      if (field === 'deliveryDate') {
        setShowTimeOptions(true);
        setFormData(prev => ({ ...prev, deliveryTime: '' }));
      }
    }
  };

  const loadYooKassaScript = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.YooMoneyCheckoutWidget) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://yookassa.ru/checkout-widget/v1/checkout-widget.js';
      script.async = true;
      script.defer = true; // Добавляем defer для дополнительной защиты от блокировки

      script.onload = () => {
        console.log('YooKassa script loaded');
        resolve();
      };

      script.onerror = () => {
        console.error('Failed to load YooKassa script');
        reject(new Error('Не удалось загрузить виджет оплаты'));
      };

      document.head.appendChild(script); // Добавляем в head вместо body
    });
  };

  const handlePay = async () => {
    // Проверка согласия на обработку персональных данных
    if (!consentState) {
      alert('Для оформления заказа необходимо согласие на обработку персональных данных');
      requestConsent();
      return;
    }

    // Валидация обязательных полей
    if (!formData.fullName.trim()) {
      alert('Введите ФИО');
      return;
    }
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      alert('Введите корректный email');
      return;
    }
    
    if (!formData.phone.trim() || !validatePhone(formatPhoneNumber(formData.phone))) {
      alert('Введите корректный номер телефона');
      return;
    }
    
    if (!formData.street.trim()) {
      alert('Введите улицу');
      return;
    }
    
    if (!formData.house.trim()) {
      alert('Введите номер дома');
      return;
    }
    
    if (!formData.deliveryDate) {
      alert('Выберите дату доставки');
      return;
    }
    
    if (!formData.deliveryTime) {
      alert('Выберите время доставки');
      return;
    }

    try {
      await loadYooKassaScript();

      // Преобразуем товары корзины в формат API
      const orderItems: OrderItem[] = cartItems.map(item => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        size: parseInt(item.size) || 0, // Преобразуем размер в число
        price: item.price
      }));

      // Создаем заказ через новый API
      const orderData: OrderCreate = {
        customer_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.street}, ${formData.house}${formData.apartment ? `, кв. ${formData.apartment}` : ''}`,
        delivery_time: getDeliveryDateTime(),
        items: orderItems,
        total_amount: total
      };

      // Отладка: проверим что отправляем в API
      console.log('Order data to send:', orderData);

      const orderResponse = await apiService.createOrder(orderData);

      // Отладка: проверим что вернул API
      console.log('Order response:', orderResponse);

      // Получаем полные данные заказа
      const order = await apiService.getOrder(orderResponse.order_id);

      console.log('Full order data:', order);
      console.log('Order number:', order.order_number);
      console.log('Order id from response:', orderResponse.order_id);
      console.log('Confirmation token:', orderResponse.confirmation_token);

      // Создаем объект с данными для оплаты
      const paymentData = {
        ...order,
        confirmation_token: orderResponse.confirmation_token
      };

      // Создаем модальное окно оплаты вместо нового окна браузера
      const paymentModal = document.createElement('div');
      paymentModal.id = 'payment-modal';
      paymentModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
      `;

      const paymentContent = document.createElement('div');
      paymentContent.style.cssText = `
        background: white;
        border-radius: 10px;
        padding: 30px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      `;

      const closeButton = document.createElement('button');
      closeButton.innerHTML = '×';
      closeButton.style.cssText = `
        position: absolute;
        top: 15px;
        right: 20px;
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #666;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
      `;
      closeButton.onmouseover = () => closeButton.style.backgroundColor = '#f0f0f0';
      closeButton.onmouseout = () => closeButton.style.backgroundColor = 'transparent';
      closeButton.onclick = () => {
        document.body.removeChild(paymentModal);
      };

      const header = document.createElement('div');
      header.style.cssText = `
        text-align: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
      `;

      // Проверяем наличие номера заказа (может быть order_number или number)
      const orderNumber = order.order_number || (order as any).number || orderResponse.order_id;
      const orderNumberText = orderNumber ? `<p style="margin: 5px 0; color: #666;">Номер заказа: <strong>${orderNumber}</strong></p>` : '';

      header.innerHTML = `
        <h2 style="margin: 0 0 10px 0; color: #333; font-size: 24px;">Оплата заказа</h2>
        ${orderNumberText}
        <p style="margin: 5px 0; color: #666;">Сумма к оплате: <strong>${total} RUB</strong></p>
      `;

      const paymentForm = document.createElement('div');
      paymentForm.id = 'payment-form';
      paymentForm.style.cssText = `
        min-height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-size: 16px;
      `;

      paymentContent.appendChild(closeButton);
      paymentContent.appendChild(header);
      paymentContent.appendChild(paymentForm);
      paymentModal.appendChild(paymentContent);
      document.body.appendChild(paymentModal);

      // Закрытие модального окна по клику вне контента
      paymentModal.onclick = (e) => {
        if (e.target === paymentModal) {
          document.body.removeChild(paymentModal);
        }
      };

      // Закрытие по клавише Escape
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          document.body.removeChild(paymentModal);
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);

      // Показываем сообщение загрузки
      paymentForm.innerHTML = 'Загрузка формы оплаты...';

      // Загружаем скрипт YooKassa и инициализируем виджет
      const loadPaymentWidget = async () => {
        try {
          // Проверяем, загружен ли уже скрипт
          if (!window.YooMoneyCheckoutWidget) {
            await new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = 'https://yookassa.ru/checkout-widget/v1/checkout-widget.js';
              script.async = true;
              script.defer = true;
              script.onload = resolve;
              script.onerror = reject;
              document.head.appendChild(script);
            });
          }

          // Ждем небольшую паузу для инициализации
          await new Promise(resolve => setTimeout(resolve, 100));

          // Проверяем наличие confirmation_token
          if (!orderResponse.confirmation_token) {
            throw new Error('Отсутствует токен подтверждения оплаты');
          }

          const checkout = new window.YooMoneyCheckoutWidget({
            confirmation_token: orderResponse.confirmation_token,
            return_url: `${window.location.origin}/success?order_id=${order.id}&order_number=${order.order_number}`,
            error_callback: function(error) {
              console.error('Ошибка виджета оплаты:', error);
              paymentForm.innerHTML = '<div style="color: #d32f2f; background: #ffebee; padding: 20px; border-radius: 5px; text-align: center; border: 1px solid #ffcdd2;">Произошла ошибка при оплате. Пожалуйста, попробуйте позже или обратитесь в поддержку.</div>';
            }
          });

          checkout.render('payment-form');
        } catch (error) {
          console.error('Ошибка инициализации оплаты:', error);
          paymentForm.innerHTML = '<div style="color: #d32f2f; background: #ffebee; padding: 20px; border-radius: 5px; text-align: center; border: 1px solid #ffcdd2;">Ошибка загрузки формы оплаты. Пожалуйста, обновите страницу и попробуйте снова.</div>';
        }
      };

      loadPaymentWidget();

      // Очищаем корзину после успешного создания заказа
      cartService.clearCart();
      setCartItems([]);

      // Закрываем корзину после открытия окна оплаты
      onClose();
      
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Произошла ошибка при создании заказа. Пожалуйста, попробуйте позже.');
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Ваш Заказ</Title>
          
        </Header>
        <CloseButton onClick={onClose}>×</CloseButton>

        {cartItems.length === 0 ? (
          <EmptyCart>Корзина пуста</EmptyCart>
        ) : (
          <>
            <CartItems>
              {cartItems.map((item) => (
                <CartItem key={`${item.id}-${item.size}`}>
                  <ItemImageContainer>
                    {(item.photo?.file_path || item.image) && (
                      <ItemImage 
                        src={item.photo?.file_path ? buildFileUrl(item.photo.file_path) : item.image} 
                        alt={item.name} 
                      />
                    )}
                  </ItemImageContainer>
                  <ItemInfo>
                    <ItemName>{item.name}</ItemName>
                    <ItemSize>Размер: {item.size}</ItemSize>
                  </ItemInfo>
                  <QuantityControls>
                    <QuantityButton onClick={() => updateQuantity(item.id, item.size, -1)}>
                      -
                    </QuantityButton>
                    <Quantity>{item.quantity}</Quantity>
                    <QuantityButton onClick={() => updateQuantity(item.id, item.size, 1)}>
                      +
                    </QuantityButton>
                  </QuantityControls>
                  <ItemPrice>{item.price * item.quantity} RUB</ItemPrice>
                  <RemoveButton onClick={() => removeItem(item.id, item.size)}>
                    ×
                  </RemoveButton>
                </CartItem>
              ))}
            </CartItems>

            <Divider />
            <CartTotal>Сумма корзины: {subtotal} RUB</CartTotal>

            <FormSection>
              <FormGroup>
                <Label>ФИО</Label>
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Введите ваше ФИО"
                />
              </FormGroup>

              <FormGroup>
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@email.com"
                />
              </FormGroup>

              <FormGroup>
                <Label>Телефон</Label>
                <Input
                  type="tel"
                  name="phone"
                  value={formatPhoneNumber(formData.phone)}
                  onChange={handlePhoneChange}
                  placeholder="+7 (___) ___-__-__"
                  maxLength={18}
                  inputMode="numeric"
                />
              </FormGroup>

              <FormGroup>
                <Label>Улица</Label>
                <Input
                  type="text"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  placeholder="Название улицы"
                />
              </FormGroup>

              <div style={{ display: 'flex', gap: '12px' }}>
                <FormGroup style={{ flex: 1 }}>
                  <Label>Дом</Label>
                  <Input
                    type="text"
                    value={formData.house}
                    onChange={(e) => handleInputChange('house', e.target.value)}
                    placeholder="1"
                  />
                </FormGroup>
                <FormGroup style={{ flex: 1 }}>
                  <Label>Квартира</Label>
                  <Input
                    type="text"
                    value={formData.apartment}
                    onChange={(e) => handleInputChange('apartment', e.target.value)}
                    placeholder="1"
                  />
                </FormGroup>
              </div>

              <FormGroup>
                <Label>Дата доставки</Label>
                <Input
                  type="date"
                  value={formData.deliveryDate}
                  min={getTomorrowDate()}
                  onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                />
              </FormGroup>

              {showTimeOptions && (
                <FormGroup>
                  <Label>Время доставки</Label>
                  <Select
                    value={formData.deliveryTime}
                    onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                  >
                    <option value="">Выберите время</option>
                    <option value="11-13">11:00 - 13:00</option>
                    <option value="13-16">13:00 - 16:00</option>
                    <option value="17-20">17:00 - 20:00</option>
                  </Select>
                </FormGroup>
              )}
            </FormSection>

            <DeliveryInfo>
              Доставка: {deliveryCost} RUB
            </DeliveryInfo>

            <FinalTotal>
              Итого: {total} RUB
            </FinalTotal>

            <PayButton onClick={handlePay}>
            Оплатить Заказ
            </PayButton>
          </>
        )}
      </ModalContent>
    </Overlay>
  );
};
