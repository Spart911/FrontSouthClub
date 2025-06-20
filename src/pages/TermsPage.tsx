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

const TermsPage: React.FC = () => {
  return (
    <PageWrapper>
      <TopBar />
      <Container>
        <Title>Пользовательское соглашение</Title>
        
        <Section>
          <Text>
            Настоящее Пользовательское соглашение регулирует отношения между Кравцовым Михаилом Михайловичем (далее – Продавец) и любым лицом (далее – Покупатель), возникающие при использовании интернет-ресурса.
          </Text>
        </Section>

        <Section>
          <SectionTitle>1. Общие положения</SectionTitle>
          <Text>
            1.1. Настоящее Соглашение является публичной офертой в соответствии со ст. 437 Гражданского кодекса Российской Федерации.
          </Text>
          <Text>
            1.2. Акцептом настоящей оферты является осуществление Покупателем полной или частичной оплаты Товара.
          </Text>
        </Section>

        <Section>
          <SectionTitle>2. Предмет соглашения</SectionTitle>
          <Text>
            2.1. Продавец обязуется передать в собственность Покупателю товар, а Покупатель обязуется принять и оплатить товар на условиях настоящего Соглашения.
          </Text>
        </Section>

        <Section>
          <SectionTitle>3. Порядок оформления заказа</SectionTitle>
          <List>
            <ListItem>Покупатель выбирает товар из ассортимента, представленного на сайте</ListItem>
            <ListItem>Покупатель указывает адрес доставки и контактные данные</ListItem>
            <ListItem>Покупатель выбирает удобное время доставки</ListItem>
            <ListItem>Покупатель оплачивает заказ одним из доступных способов</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>4. Доставка</SectionTitle>
          <Text>
            4.1. Доставка осуществляется только в пределах города Ростов-на-Дону.
          </Text>
          <Text>
            4.2. Стоимость доставки составляет 500 рублей.
          </Text>
          <Text>
            4.3. Доставка осуществляется в течение 7-14 дней с момента оформления заказа.
          </Text>
        </Section>

        <Section>
          <SectionTitle>5. Оплата</SectionTitle>
          <Text>
            5.1. Оплата производится путем перечисления денежных средств на расчетный счет Продавца.
          </Text>
          <Text>
            5.2. Способы оплаты:
          </Text>
          <List>
            <ListItem>Банковский перевод</ListItem>
            <ListItem>Оплата по QR-коду</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>6. Возврат товара</SectionTitle>
          <Text>
            6.1. Покупатель вправе отказаться от товара в течение 7 дней с момента получения.
          </Text>
          <Text>
            6.2. Возврат товара надлежащего качества возможен при сохранении его товарного вида и потребительских свойств.
          </Text>
        </Section>

        <Section>
          <SectionTitle>7. Ответственность сторон</SectionTitle>
          <Text>
            7.1. За нарушение условий настоящего Соглашения стороны несут ответственность в соответствии с действующим законодательством Российской Федерации.
          </Text>
        </Section>

        <Section>
          <SectionTitle>8. Заключительные положения</SectionTitle>
          <Text>
            8.1. Настоящее Соглашение вступает в силу с момента его акцепта Покупателем и действует до полного исполнения обязательств сторонами.
          </Text>
          <Text>
            8.2. Все споры, возникающие из настоящего Соглашения, разрешаются путем переговоров, а при невозможности достижения согласия – в судебном порядке.
          </Text>
        </Section>
      </Container>
    </PageWrapper>
  );
};

export default TermsPage; 