import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { apiService } from '../services/api';
import { useConsent } from '../hooks/useConsent';

const SectionWrapper = styled.section`
  padding: 40px 20px;
  background: #ffffff;
  scroll-margin-top: 30px;
`;

const Title = styled.h2`
  font-size: 5rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 900;
  text-align: center;
  margin-bottom: 32px;
  color: rgb(0, 0, 0);
`;

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  width: 100%;
`;

const FormGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
`;

const Label = styled.label`
  font-size: 2.8rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 700;
  color: #000;
  min-width: 15vw;
  text-align: left;
  
  @media (max-width: 768px) {
    min-width: auto;
    text-align: center;
    font-size: 2.4rem;
  }
`;

const Input = styled.input`
  padding: 16px 20px;
  border: 3px solid #1e3ea8;
  border-radius: 8px;
  font-size: 2rem;
  letter-spacing: 2px;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  background: #fff;
  color: #000;
  width: 100%;

  
  
  &:focus {
    outline: none;
    border-color: #1e3ea8;
    box-shadow: 0 0 0 2px rgba(30, 62, 168, 0.2);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const TextArea = styled.textarea`
  padding: 16px 20px;
  border: 3px solid #1e3ea8;
  border-radius: 8px;
  font-size: 2rem;
  letter-spacing: 2px;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  background: #fff;
  color: #000;
  min-height: 120px;
  resize: vertical;
  width: 100%;

  
  &:focus {
    outline: none;
    border-color: #1e3ea8;
    box-shadow: 0 0 0 2px rgba(30, 62, 168, 0.2);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const SubmitButton = styled.button`
  padding: 16px 32px;
  background: #1e3ea8;
  color: #fff;
  border: none;
  border-radius: 0;
  font-size: 2.2rem;
  width:50%;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #152a7a;
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const FeedbackSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { hasConsent, requestConsent } = useConsent();
  const [consentState, setConsentState] = useState(hasConsent);

  // Слушаем изменения согласия в реальном времени
  useEffect(() => {
    const handleConsentChange = (event: CustomEvent) => {
      setConsentState(event.detail.hasConsent);
    };

    window.addEventListener('consentChanged', handleConsentChange as EventListener);
    
    return () => {
      window.removeEventListener('consentChanged', handleConsentChange as EventListener);
    };
  }, []);

  // Обновляем локальное состояние при изменении hasConsent из хука
  useEffect(() => {
    setConsentState(hasConsent);
  }, [hasConsent]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Обработка номера телефона вынесена в отдельную функцию
      return;
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validatePhone = (phone: string) => {
    // Проверяем только количество цифр (должно быть 11, включая +7)
    const numbers = phone.replace(/\D/g, '');
    return numbers.length === 11;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверка согласия на обработку персональных данных
    if (!consentState) {
      alert('Для отправки сообщения необходимо согласие на обработку персональных данных');
      requestConsent();
      return;
    }
    
    // Валидация email
    if (!formData.email || !formData.email.includes('@')) {
      alert('Введите корректный email');
      return;
    }
    
    // Валидация номера телефона (обязательное поле)
    if (!formData.phone || !validatePhone(formatPhoneNumber(formData.phone))) {
      alert('Введите корректный номер телефона');
      return;
    }
    
    // Валидация длины сообщения
    if (!formData.message || formData.message.trim().length < 10) {
      alert('Сообщение должно содержать не менее 10 символов');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await apiService.sendFeedback({
        name: formData.name,
        email: formData.email,
        phone: formData.phone ? formatPhoneNumber(formData.phone) : undefined,
        message: formData.message
      });
      
      setFormData({ name: '', email: '', phone: '', message: '' });
      alert('Сообщение отправлено!');
    } catch (err) {
      console.error('Error sending feedback:', err);
      alert('Ошибка отправки сообщения. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionWrapper id="feedback">
      <Title>ОБРАТНАЯ СВЯЗЬ</Title>
      <Container>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">ФИО</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Введите ваше полное имя"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Введите ваш email"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="phone">Номер телефона</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formatPhoneNumber(formData.phone)}
              onChange={handlePhoneChange}
              placeholder="+7 (___) ___-__-__"
              maxLength={18}
              inputMode="numeric"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="message">Сообщение</Label>
            <TextArea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Введите ваше сообщение"
              required
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Отправка...' : 'ОТПРАВИТЬ'}
          </SubmitButton>
        </Form>
      </Container>
    </SectionWrapper>
  );
};
