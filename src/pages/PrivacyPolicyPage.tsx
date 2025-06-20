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

const List = styled.ul`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
  padding-left: 20px;
`;

const ListItem = styled.li`
  margin-bottom: 10px;
`;

const PrivacyPolicyPage: React.FC = () => {
  return (
    <PageWrapper>
      <TopBar />
      <Container>
        <Title>Политика конфиденциальности</Title>
        
        <Section>
          <Text>
            Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных Кравцова Михаила Михайловича (далее – Оператор).
          </Text>
        </Section>

        <Section>
          <SectionTitle>1. Общие положения</SectionTitle>
          <Text>
            1.1. Оператор ставит своей важнейшей целью и условием осуществления своей деятельности соблюдение прав и свобод человека и гражданина при обработке его персональных данных.
          </Text>
          <Text>
            1.2. Настоящая политика Оператора в отношении обработки персональных данных применяется ко всей информации, которую Оператор может получить о посетителях веб-сайта.
          </Text>
        </Section>

        <Section>
          <SectionTitle>2. Основные понятия</SectionTitle>
          <List>
            <ListItem>Автоматизированная обработка персональных данных – обработка персональных данных с помощью средств вычислительной техники.</ListItem>
            <ListItem>Блокирование персональных данных – временное прекращение обработки персональных данных.</ListItem>
            <ListItem>Веб-сайт – совокупность графических и информационных материалов, а также программ для ЭВМ и баз данных, обеспечивающих их доступность в сети интернет.</ListItem>
            <ListItem>Информационная система персональных данных — совокупность содержащихся в базах данных персональных данных, и обеспечивающих их обработку информационных технологий и технических средств.</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>3. Обработка персональных данных</SectionTitle>
          <Text>
            3.1. Оператор обрабатывает персональные данные на законной и справедливой основе для выполнения возложенных на Оператора функций, полномочий и обязанностей.
          </Text>
          <Text>
            3.2. Оператор получает персональные данные непосредственно у субъектов персональных данных.
          </Text>
          <Text>
            3.3. Оператор обрабатывает персональные данные автоматизированным и неавтоматизированным способами, с использованием средств вычислительной техники и без использования таких средств.
          </Text>
        </Section>

        <Section>
          <SectionTitle>4. Цели обработки персональных данных</SectionTitle>
          <List>
            <ListItem>Обработка заказов и доставка товаров</ListItem>
            <ListItem>Предоставление доступа к сервисам и информации</ListItem>
            <ListItem>Улучшение качества обслуживания</ListItem>
            <ListItem>Информирование о статусе заказа</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>5. Правовые основания обработки персональных данных</SectionTitle>
          <Text>
            Оператор обрабатывает персональные данные на основании:
          </Text>
          <List>
            <ListItem>Федерального закона «О персональных данных» №152-ФЗ</ListItem>
            <ListItem>Уставных документов Оператора</ListItem>
            <ListItem>Договоров, заключаемых между Оператором и субъектом персональных данных</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>6. Порядок и условия обработки персональных данных</SectionTitle>
          <Text>
            Безопасность персональных данных, которые обрабатываются Оператором, обеспечивается путем реализации правовых, организационных и технических мер.
          </Text>
        </Section>

        <Section>
          <SectionTitle>7. Права субъектов персональных данных</SectionTitle>
          <List>
            <ListItem>Получать информацию, касающуюся обработки его персональных данных</ListItem>
            <ListItem>Требовать уточнения своих персональных данных</ListItem>
            <ListItem>Требовать уничтожения своих персональных данных</ListItem>
            <ListItem>Выдвигать условие предварительного согласия при обработке персональных данных</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>8. Заключительные положения</SectionTitle>
          <Text>
            Пользователь может получить любые разъяснения по интересующим вопросам, касающимся обработки его персональных данных, обратившись к Оператору с помощью электронной почты.
          </Text>
          <Text>
            В данном документе будут отражены любые изменения политики обработки персональных данных Оператором. Политика действует бессрочно до замены ее новой версией.
          </Text>
        </Section>
      </Container>
    </PageWrapper>
  );
};

export default PrivacyPolicyPage; 