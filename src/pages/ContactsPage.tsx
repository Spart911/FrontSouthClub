import React from 'react';
import styled from 'styled-components';

const PageWrapper = styled.div`
  background: white;
  min-height: 100vh;
`;

const TopBar = styled.div`
  background: black;
  height: 80px;
  width: 100%;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 20px;
`;

const Title = styled.h1`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 2rem;
  color: #000;
  margin-bottom: 30px;
`;

const Section = styled.section`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.5rem;
  color: #000;
  margin-bottom: 20px;
`;

const Text = styled.p`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
`;

const ContactInfo = styled.div`
  background: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const ContactItem = styled.div`
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ContactLabel = styled.span`
  font-weight: bold;
  color: #000;
  margin-right: 10px;
`;

const ContactsPage: React.FC = () => {
  return (
    <PageWrapper>
      <TopBar />
      <Container>
        <Title>Контакты</Title>
        
        <Section>
          <SectionTitle>Реквизиты</SectionTitle>
          <ContactInfo>
            <ContactItem>
              <ContactLabel>ФИО:</ContactLabel>
              <Text>Кравцов Михаил Михайлович</Text>
            </ContactItem>
            <ContactItem>
              <ContactLabel>ИНН:</ContactLabel>
              <Text>7707083893</Text>
            </ContactItem>
            <ContactItem>
              <ContactLabel>ОГРНИП:</ContactLabel>
              <Text>1027700132195</Text>
            </ContactItem>
            <ContactItem>
              <ContactLabel>ОКПО:</ContactLabel>
              <Text>02753761</Text>
            </ContactItem>
          </ContactInfo>
        </Section>

        <Section>
          <SectionTitle>Банковские реквизиты</SectionTitle>
          <ContactInfo>
            <ContactItem>
              <ContactLabel>Банк:</ContactLabel>
              <Text>ЮГО-ЗАПАДНЫЙ БАНК ПАО СБЕРБАНК</Text>
            </ContactItem>
            <ContactItem>
              <ContactLabel>БИК:</ContactLabel>
              <Text>046015602</Text>
            </ContactItem>
            <ContactItem>
              <ContactLabel>Корр. счет:</ContactLabel>
              <Text>30101810600000000602</Text>
            </ContactItem>
            <ContactItem>
              <ContactLabel>Расчетный счет:</ContactLabel>
              <Text>40802810070000000000</Text>
            </ContactItem>
          </ContactInfo>
        </Section>

        <Section>
          <SectionTitle>Контактная информация</SectionTitle>
          <ContactInfo>
            <ContactItem>
              <ContactLabel>Адрес:</ContactLabel>
              <Text>г. Ростов-на-Дону</Text>
            </ContactItem>
            <ContactItem>
              <ContactLabel>Email:</ContactLabel>
              <Text>lumni@example.com</Text>
            </ContactItem>
            <ContactItem>
              <ContactLabel>Телефон:</ContactLabel>
              <Text>+7 (951) 842-92-36</Text>
            </ContactItem>
          </ContactInfo>
        </Section>

        <Section>
          <SectionTitle>Режим работы</SectionTitle>
          <ContactInfo>
            <ContactItem>
              <ContactLabel>Пн-Пт:</ContactLabel>
              <Text>10:00 - 19:00</Text>
            </ContactItem>
            <ContactItem>
              <ContactLabel>Сб-Вс:</ContactLabel>
              <Text>Выходной</Text>
            </ContactItem>
          </ContactInfo>
        </Section>
      </Container>
    </PageWrapper>
  );
};

export default ContactsPage; 