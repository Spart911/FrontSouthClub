import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext';
import { QRCodeSVG } from 'qrcode.react';
import emailjs from '@emailjs/browser';
import { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } from '../config/telegram';
import { ConfirmModal } from '../components/ConfirmModal';

const PageWrapper = styled.div`
  background: white;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: visible;
`;

const TopBar = styled.div`
  background: black;
  height: 80px;
  width: 100%;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 20px 10px;
    gap: 70px;
    overflow: visible;
  }
`;

const MainContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;

  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 0;
    box-shadow: none;
    overflow: visible;
    min-height: 550px;
  }
`;

const Sidebar = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
`;

const Step = styled.div<{ $isActive: boolean }>`
  display: ${props => props.$isActive ? 'block' : 'none'};
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const StepNumber = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgb(0, 133, 91);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-buch), "Helvetica", sans-serif;
`;

const StepTitle = styled.h2`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.5rem;
  margin: 0;
  color: #000;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  color: #666;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: rgb(0, 133, 91);
  }
`;

const ErrorMessage = styled.p`
  color: #ff0000;
  font-size: 0.9rem;
  margin: 0;
`;

const Button = styled.button`
  padding: 15px;
  background: rgb(0, 133, 91);
  color: white;
  border: none;
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background: rgb(3, 161, 111);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const TimeSlot = styled.div<{ $isSelected: boolean }>`
  padding: 12px;
  border: 1px solid ${props => props.$isSelected ? 'rgb(0, 133, 91)' : '#E5E5E5'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-family: var(--font-buch), "Helvetica", sans-serif;
  color: ${props => props.$isSelected ? 'white' : 'white'};
  background-color: ${props => props.$isSelected ? 'rgb(0, 133, 91)' : '#000'};
  text-align: center;

  &:hover {
    background-color: rgb(0, 133, 91);
    color: white;
  }
`;

const TimeSlotsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
`;

const OrderSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SummaryTitle = styled.h3`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.2rem;
  color: #000;
  margin: 0;
`;

const SummaryItem = styled.div`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  color: #000;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const SummaryItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  background-color: #f5f5f5;
`;

const SummaryItemContent = styled.div`
  flex: 1;
`;

const SummaryItemName = styled.p`
  margin: 0 0 5px 0;
  font-size: 1rem;
`;

const SummaryItemPrice = styled.p`
  margin: 0;
  font-size: 1rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: var(--font-buch), "Helvetica", sans-serif;
`;

const SummaryLabel = styled.span`
  color: #666;
`;

const SummaryValue = styled.span`
  color: #000;
  font-weight: bold;
`;

const AddressFields = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AddressSuggestions = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #E5E5E5;
  border-radius: 4px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SuggestionItem = styled.div`
  padding: 10px;
  cursor: pointer;
  font-family: var(--font-buch), "Helvetica", sans-serif;
  color: #000;

  &:hover {
    background: #f5f5f5;
  }
`;

const AddressInputWrapper = styled.div`
  position: relative;
`;

const LoadingMessage = styled.div`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  color: #666;
  text-align: center;
`;

const ErrorContainer = styled.div`
  color: #ff0000;
  margin: 10px 0;
  padding: 10px;
  background: #fff5f5;
  border-radius: 4px;
`;

const PaymentWrapper = styled.div`
  margin-top: 20px;
  width: 100%;
  position: relative;
`;

const PaymentContainer = styled.div`
  width: 100%;
  min-height: 600px;
  position: relative;

  @media (max-width: 768px) {
    min-height: 800px;
    
    iframe {
      width: 100% !important;
      height: 600px !important;
      min-height: 800px !important;
      max-width: 100vw !important;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
`;

const sendOrderNotification = async (orderData: any) => {
  try {
    await emailjs.send(
      'YOUR_SERVICE_ID', // Замените на ваш Service ID
      'YOUR_TEMPLATE_ID', // Замените на ваш Template ID
      {
        to_email: orderData.email,
        order_details: `
          Заказ от ${orderData.timestamp}
          
          Товары:
          ${orderData.items.map((item: any) => 
            `${item.name} - ${item.quantity} шт.`
          ).join('\n')}
          
          Адрес доставки:
          ${orderData.address}
          
          Сумма заказа: ${orderData.total} руб.
          
          Спасибо за заказ! Мы свяжемся с вами в ближайшее время.
        `,
      },
      'YOUR_USER_ID' // Замените на ваш User ID
    );
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

const sendTelegramNotification = async (orderData: any) => {
  try {
    const message = `
🛍 Новый заказ!

📅 Дата: ${orderData.timestamp}

📧 Email: ${orderData.email}
📱 Телефон: ${orderData.phone}

📍 Адрес доставки:
${orderData.address}

🛒 Товары:
${orderData.items.map((item: any) => 
  `• ${item.name} - ${item.quantity} шт.
Цвет: ${item.color}
Цена: ${item.price} ₽`
).join('\n')}

💰 Сумма заказа: ${orderData.total} руб.

⏰ Время доставки: ${orderData.deliveryTime}
    `.trim();

    console.log('Отправка уведомления в Telegram...');
    console.log('Данные заказа:', orderData);

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    console.log('Ответ от Telegram API:', data);

    if (!response.ok) {
      throw new Error(`Failed to send Telegram notification: ${data.description}`);
    }
  } catch (error) {
    console.error('Ошибка отправки уведомления в Telegram:', error);
  }
};

const formatPhoneNumber = (value: string) => {
  // Убираем все нецифровые символы
  const numbers = value.replace(/\D/g, '');
  
  // Если номер начинается с 7 или 8, заменяем на +7
  let formattedNumber = numbers;
  if (numbers.startsWith('7') || numbers.startsWith('8')) {
    formattedNumber = '7' + numbers.slice(1);
  }
  
  // Форматируем номер в виде +7 (XXX) XXX-XX-XX
  let result = '';
  if (formattedNumber.length > 0) {
    result = '+7';
    if (formattedNumber.length > 1) {
      result += ' (' + formattedNumber.slice(1, 4);
      if (formattedNumber.length > 4) {
        result += ') ' + formattedNumber.slice(4, 7);
        if (formattedNumber.length > 7) {
          result += '-' + formattedNumber.slice(7, 9);
          if (formattedNumber.length > 9) {
            result += '-' + formattedNumber.slice(9, 11);
          }
        }
      }
    }
  }

  // Если пользователь вводит последнюю цифру, добавляем её без форматирования
  if (value.endsWith('-') && formattedNumber.length === 10) {
    result = result.slice(0, -1) + formattedNumber.slice(9, 10);
  }
  
  return result;
};

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { getCart, clearCart } = useCart();
  const cartItems = getCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [apartment, setApartment] = useState('');
  const [addressError, setAddressError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const paymentContainerRef = useRef<HTMLDivElement>(null);

  const timeSlots = [
    '11:00-13:00',
    '13:00-16:00',
    '17:00-20:00'
  ];

  // Получаем минимальную дату доставки в формате YYYY-MM-DD
  const getMinDeliveryDate = () => {
    const date = new Date();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    date.setDate(date.getDate() + 7 + (totalItems - 1));
    
    // Форматируем дату в YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Получаем максимальную дату доставки (например, через 3 месяца)
  const getMaxDeliveryDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    
    // Форматируем дату в YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formattedNumber = formatPhoneNumber(input);
    
    // Сохраняем позицию курсора
    const cursorPosition = e.target.selectionStart || 0;
    const oldLength = phone.length;
    const newLength = formattedNumber.length;
    
    setPhone(formattedNumber);
    
    // Восстанавливаем позицию курсора после обновления DOM
    setTimeout(() => {
      const input = document.querySelector('input[type="tel"]') as HTMLInputElement;
      if (input) {
        const newPosition = cursorPosition + (newLength - oldLength);
        input.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
    
    // Валидация номера
    const numbers = formattedNumber.replace(/\D/g, '');
    if (numbers.length === 11) {
      setPhoneError('');
    } else if (formattedNumber.length > 0) {
      setPhoneError('Введите корректный номер телефона');
    } else {
      setPhoneError('');
    }
  };

  const validatePhone = (phone: string) => {
    // Проверяем только количество цифр (должно быть 11, включая +7)
    const numbers = phone.replace(/\D/g, '');
    return numbers.length === 11;
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError('Пожалуйста, введите корректный email');
      return;
    }
    if (!validatePhone(phone)) {
      setPhoneError('Пожалуйста, введите корректный номер телефона');
      return;
    }
    setEmailError('');
    setPhoneError('');
    setCurrentStep(2);
  };

  const validateAddress = () => {
    if (!street || !house) {
      setAddressError('Пожалуйста, заполните адрес доставки');
      return false;
    }
    setAddressError('');
    return true;
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
      
      script.onload = () => {
        console.log('YooKassa script loaded');
        resolve();
      };
      
      script.onerror = () => {
        console.error('Failed to load YooKassa script');
        reject(new Error('Не удалось загрузить виджет оплаты'));
      };

      document.body.appendChild(script);
    });
  };

  // Эффект для прокрутки вверх при переходе на страницу оплаты
  useEffect(() => {
    if (currentStep === 3) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [currentStep]);

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAddress()) {
      return;
    }
    
    if (!selectedDate) {
      setAddressError('Пожалуйста, выберите дату доставки');
      return;
    }
    if (!selectedTimeSlot) {
      setAddressError('Пожалуйста, выберите время доставки');
      return;
    }
    
    setAddressError('');
    setCurrentStep(3);
    setPaymentError(null);

    try {
      await loadYooKassaScript();

      const orderData = {
        email,
        phone,
        address: `${street}, ${house}${apartment ? `, кв. ${apartment}` : ''}`,
        delivery_time: `${selectedDate} ${selectedTimeSlot}`,
        order_time: new Date().toISOString(),
        items: cartItems.map(item => ({
          name: item.product.name,
          quantity: item.quantity
        })),
        total_amount: total
      };

      const response = await fetch('https://fastapi-yookassa.onrender.com/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Ошибка создания заказа');
      }

      const result = await response.json();
      
      // Очищаем контейнер перед инициализацией
      const paymentContainer = document.getElementById('payment-form');
      if (paymentContainer) {
        paymentContainer.innerHTML = '';
      }

      // Инициализируем виджет
      const checkout = new window.YooMoneyCheckoutWidget({
        confirmation_token: result.confirmation_token,
        return_url: `${window.location.origin}/success?delivery_time=${encodeURIComponent(orderData.delivery_time)}&address=${encodeURIComponent(orderData.address)}&total_amount=${orderData.total_amount}`,
        error_callback: function(error: any) {
          console.error('Ошибка виджета оплаты:', error);
          setPaymentError('Произошла ошибка при оплате. Пожалуйста, попробуйте позже.');
        }
      });

      await checkout.render('payment-form');
      
    } catch (error) {
      console.error('Ошибка:', error);
      setPaymentError('Произошла ошибка при создании заказа. Пожалуйста, попробуйте позже.');
    }
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      // Проверяем, что выбранная дата не меньше минимальной
      const selectedDate = new Date(value);
      const minDate = new Date(getMinDeliveryDate());
      
      if (selectedDate < minDate) {
        setSelectedDate(getMinDeliveryDate());
        setAddressError('Пожалуйста, выберите дату не ранее ' + minDate.toLocaleDateString('ru-RU'));
      } else {
        setSelectedDate(value);
        setAddressError('');
      }
    } else {
      setSelectedDate('');
    }
    setSelectedTimeSlot(''); // Сбрасываем выбранное время при смене даты
  };

  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shipping = subtotal < 10 ? 0 : 500;
  const total = subtotal + shipping;

  useEffect(() => {
    const handleNavigationAttempt = (event: CustomEvent<{ path: string }>) => {
      setPendingNavigation(event.detail.path);
      setShowConfirmModal(true);
    };

    window.addEventListener('navigationAttempt', handleNavigationAttempt as EventListener);

    return () => {
      window.removeEventListener('navigationAttempt', handleNavigationAttempt as EventListener);
    };
  }, []);

  const handleConfirmNavigation = () => {
    setShowConfirmModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
  };

  const handleCancelNavigation = () => {
    setShowConfirmModal(false);
    setPendingNavigation(null);
  };

  return (
    <PageWrapper>
      <TopBar />
      <Container>
        <MainContent>
          <Step $isActive={currentStep === 1}>
            <StepHeader>
              <StepNumber>1</StepNumber>
              <StepTitle>Контактная информация</StepTitle>
            </StepHeader>
            <Form onSubmit={handleEmailSubmit}>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Для получения квитанций и обновлений заказов"
                />
                {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Телефон</Label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="+7 (___) ___-__-__"
                  maxLength={18}
                  inputMode="numeric"
                />
                {phoneError && <ErrorMessage>{phoneError}</ErrorMessage>}
              </FormGroup>
              <Button type="submit">Продолжить</Button>
            </Form>
          </Step>

          <Step $isActive={currentStep === 2}>
            <StepHeader>
              <StepNumber>2</StepNumber>
              <StepTitle>Доставка</StepTitle>
            </StepHeader>
            <Form onSubmit={handleAddressSubmit}>
              <FormGroup>
                <Label>Адрес доставки</Label>
                <AddressFields>
                  <Input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Улица"
                  />
                  <Input
                    type="text"
                    value={house}
                    onChange={(e) => setHouse(e.target.value)}
                    placeholder="Дом"
                  />
                  <Input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Квартира (необязательно)"
                  />
                </AddressFields>
                {addressError && <ErrorMessage>{addressError}</ErrorMessage>}
              </FormGroup>
              <FormGroup>
                <Label>Дата доставки</Label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  min={getMinDeliveryDate()}
                  max={getMaxDeliveryDate()}
                  required
                  pattern="\d{4}-\d{2}-\d{2}"
                  inputMode="none"
                />
              </FormGroup>
              {selectedDate && (
                <FormGroup>
                  <Label>Время доставки</Label>
                  <TimeSlotsContainer>
                    {timeSlots.map((timeSlot) => (
                      <TimeSlot
                        key={timeSlot}
                        $isSelected={selectedTimeSlot === timeSlot}
                        onClick={() => handleTimeSlotSelect(timeSlot)}
                      >
                        {timeSlot}
                      </TimeSlot>
                    ))}
                  </TimeSlotsContainer>
                </FormGroup>
              )}
              <Button 
                type="submit"
                disabled={!selectedDate || !selectedTimeSlot}
              >
                Продолжить
              </Button>
            </Form>
          </Step>

          <Step $isActive={currentStep === 3}>
            <StepHeader>
              <StepNumber>3</StepNumber>
              <StepTitle>Оплата</StepTitle>
            </StepHeader>
            {paymentError ? (
              <ErrorContainer>
                {paymentError}
                <Button onClick={() => setCurrentStep(2)}>Вернуться к доставке</Button>
              </ErrorContainer>
            ) : (
              <PaymentWrapper>
                <PaymentContainer ref={paymentContainerRef} id="payment-form">
                  <LoadingMessage>Загрузка формы оплаты...</LoadingMessage>
                </PaymentContainer>
              </PaymentWrapper>
            )}
          </Step>
        </MainContent>

        <Sidebar>
          <OrderSummary>
            <SummaryTitle>Краткие сведения</SummaryTitle>
            {cartItems.map((item) => {
              const selectedColor = item.product.colors[item.selectedColor];
              const imageUrl = selectedColor?.mainImage || '/placeholder.png';
              
              return (
                <SummaryItem key={`${item.product.id}-${item.selectedColor}`}>
                  <SummaryItemImage 
                    src={imageUrl}
                    alt={item.product.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.png';
                    }}
                  />
                  <SummaryItemContent>
                    <SummaryItemName>{item.product.name}</SummaryItemName>
                    <SummaryItemPrice>{item.product.price.toLocaleString()} ₽ × {item.quantity}</SummaryItemPrice>
                  </SummaryItemContent>
                </SummaryItem>
              );
            })}
            <SummaryRow>
              <SummaryLabel>Промежуточный итог</SummaryLabel>
              <SummaryValue>{subtotal.toLocaleString()} ₽</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Доставка</SummaryLabel>
              <SummaryValue>{shipping.toLocaleString()} ₽</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Итого</SummaryLabel>
              <SummaryValue>{total.toLocaleString()} ₽</SummaryValue>
            </SummaryRow>
          </OrderSummary>
        </Sidebar>
      </Container>
      
      <ConfirmModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
      />
    </PageWrapper>
  );
};

export default CheckoutPage; 