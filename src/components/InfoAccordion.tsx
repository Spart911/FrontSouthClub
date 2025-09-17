import React, { useState } from 'react';
import styled from 'styled-components';

const SectionWrapper = styled.section`
  padding: 40px 20px;
  background: #ffffff;
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
  width: 43%;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  @media (max-width: 769px) {
    width: 80%;
  }
`;

const AccordionContainer = styled.div`
  overflow: hidden;
`;

const AccordionItem = styled.div<{ $isOpen: boolean }>`
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const AccordionHeader = styled.button<{ $isOpen: boolean }>`
  width: 100%;
  padding: 20px;
  background:  #ffffff;
  border: none;
  outline: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 2rem;
  font-weight: ${props => props.$isOpen ? '900' : '700'};
  color: #000;
  
  &:focus {
    outline: none;
    border: none;
    box-shadow: none;
  }
  
  &:active {
    outline: none;
    border: none;
    box-shadow: none;
  }
  
  @media (max-width: 768px) {
    padding: 15px;
    font-size: 1.8rem;
  }
`;

const AccordionTitle = styled.span`
  text-align: left;
  font-size: 2.8rem;
`;

const AccordionIcon = styled.span<{ $isOpen: boolean }>`
  font-size: 2rem;
  font-weight: 400;
  font-family: Arial, sans-serif;
  color: #000;
  transition: all 0.3s ease;
  transform: ${props => props.$isOpen ? 'rotate(45deg)' : 'rotate(0deg)'};
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  line-height: 1;
  text-align: center;
  
  ${AccordionHeader}:hover & {
    background: #f0f0f0;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    width: 45px;
    height: 45px;
  }
`;

const AccordionContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${props => props.$isOpen ? '1500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  background: #ffffff;
`;

const AccordionText = styled.div`
  padding: 20px;
  font-family: 'Helvetica', sans-serif;
  font-size: 1.6rem;
  line-height: 1.6;
  color: #333;
  
  @media (max-width: 768px) {
    padding: 15px;
    font-size: 1.4rem;
  }
`;

interface AccordionData {
  id: string;
  title: string;
  content: string;
}

const accordionData: AccordionData[] = [
  {
    id: 'contacts',
    title: 'Контакты',
    content: `📞 Телефон: +7 (903) 404-43-01
📧 Email: southclub@mail.ru
📍 Адрес: Россия, обл. Ростовская, г. Ростов-на-Дону
🕒 Время работы: Пн-Пт 9:00-18:00

Свяжитесь с нами любым удобным способом. Мы всегда готовы помочь и ответить на ваши вопросы.`
  },
  {
    id: 'delivery',
    title: 'Доставка',
    content: `🚚 Сроки доставки: Доставка осуществляется на следующий день после оформления заказа.
💰 Стоимость доставки: 299 ₽
📍 Доставка осуществляется на данный момент только в Ростове-на-Дону.

Доставка осуществляется курьерской службой или почтой России. Точные сроки зависят от вашего региона.`
  },
  {
    id: 'return',
    title: 'Возврат',
    content: `🔄 Возврат в течение 14 дней
✅ Возврат товара надлежащего качества
❌ Возврат товара ненадлежащего качества
📋 Необходимые документы: чек, паспорт

Условия возврата соответствуют требованиям законодательства РФ. Подробности уточняйте у наших менеджеров.`
  }
//   ,
//   {
//     id: 'partnership',
//     title: 'Партнерство',
//     content: `🤝 Мы открыты к сотрудничеству
// 💼 Оптовые поставки
// 🏪 Франшиза
// 📈 Маркетинговые программы

// Если вы заинтересованы в сотрудничестве, свяжитесь с нами для обсуждения деталей. Мы предлагаем выгодные условия для партнеров.`
//   }
];

export const InfoAccordion: React.FC = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const closeBlock = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <SectionWrapper>
      <Title>ИНФОРМАЦИЯ</Title>
      <Container>
        <AccordionContainer>
          {accordionData.map((item) => (
            <AccordionItem key={item.id} $isOpen={openItems.includes(item.id)}>
              <AccordionHeader 
                onClick={() => toggleItem(item.id)}
                $isOpen={openItems.includes(item.id)}
              >
                <AccordionTitle>{item.title}</AccordionTitle>
                <AccordionIcon $isOpen={openItems.includes(item.id)}>
                  {'+'}
                </AccordionIcon>
              </AccordionHeader>
              <AccordionContent $isOpen={openItems.includes(item.id)}>
                <AccordionText>
                  {item.content.split('\n').map((line, index) => (
                    <div key={index}>
                      {line}
                      {index < item.content.split('\n').length - 1 && <br />}
                    </div>
                  ))}
                </AccordionText>
              </AccordionContent>
            </AccordionItem>
          ))}
        </AccordionContainer>
      </Container>
    </SectionWrapper>
  );
};
