import React from 'react';
import styled from 'styled-components';

const PageWrapper = styled.div`
  background: white;
  min-height: 100vh;
  padding: 40px 20px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const Title = styled.h1`
margin-top: 80px;
  font-size: 4rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 900;
  text-align: center;
  margin-bottom: 40px;
  color: #000;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 2.4rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 700;
  margin-bottom: 20px;
  color: #000;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Text = styled.p`
  font-size: 1.6rem;
  font-family: 'Helvetica', sans-serif;
  line-height: 1.6;
  margin-bottom: 16px;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const List = styled.ul`
  font-size: 1.6rem;
  font-family: 'Helvetica', sans-serif;
  line-height: 1.6;
  margin-bottom: 16px;
  color: #333;
  padding-left: 20px;
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

const ListItem = styled.li`
  margin-bottom: 8px;
`;

const TermsPage: React.FC = () => {
  return (
    <PageWrapper>
      <Container>
        <Title>ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ</Title>
        
        <Section>
          <SectionTitle>1. ОБЩИЕ ПОЛОЖЕНИЯ</SectionTitle>
          <Text>
            Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения 
            между интернет-магазином SOUTH CLUB (далее — «Продавец») и пользователями сайта 
            (далее — «Пользователи»).
          </Text>
          <Text>
            Использование сайта означает полное и безоговорочное принятие Пользователем 
            всех условий настоящего Соглашения.
          </Text>
        </Section>

        <Section>
          <SectionTitle>2. ПРЕДМЕТ СОГЛАШЕНИЯ</SectionTitle>
          <Text>
            Предметом настоящего Соглашения является предоставление Пользователю доступа к 
            информационным ресурсам сайта и услугам интернет-магазина.
          </Text>
          <Text>
            Сайт предоставляет Пользователю доступ к информации о товарах, возможность 
            оформления заказов и получения консультаций.
          </Text>
        </Section>

        <Section>
          <SectionTitle>3. ПРАВА И ОБЯЗАННОСТИ ПОЛЬЗОВАТЕЛЯ</SectionTitle>
          <Text>Пользователь имеет право:</Text>
          <List>
            <ListItem>Получать информацию о товарах и услугах</ListItem>
            <ListItem>Оформлять заказы на товары</ListItem>
            <ListItem>Получать консультации по вопросам работы сайта</ListItem>
            <ListItem>Обращаться в службу поддержки</ListItem>
          </List>
          <Text>Пользователь обязуется:</Text>
          <List>
            <ListItem>Предоставлять достоверную информацию при оформлении заказов</ListItem>
            <ListItem>Соблюдать условия настоящего Соглашения</ListItem>
            <ListItem>Не использовать сайт для незаконной деятельности</ListItem>
            <ListItem>Не нарушать работу сайта и его компонентов</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>4. ПРАВА И ОБЯЗАННОСТИ ПРОДАВЦА</SectionTitle>
          <Text>Продавец обязуется:</Text>
          <List>
            <ListItem>Предоставлять доступ к сайту и его функциям</ListItem>
            <ListItem>Обеспечивать безопасность персональных данных Пользователей</ListItem>
            <ListItem>Обрабатывать заказы в установленные сроки</ListItem>
            <ListItem>Предоставлять качественную продукцию</ListItem>
          </List>
          <Text>Продавец имеет право:</Text>
          <List>
            <ListItem>Изменять условия Соглашения</ListItem>
            <ListItem>Ограничивать доступ к сайту при нарушении условий</ListItem>
            <ListItem>Собирать и обрабатывать персональные данные</ListItem>
            <ListItem>Отказывать в обслуживании при нарушении правил</ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>5. ПОРЯДОК РАБОТЫ С САЙТОМ</SectionTitle>
          <Text>
            Для оформления заказа Пользователь должен заполнить форму заказа, указав 
            необходимые данные и выбрав товары.
          </Text>
          <Text>
            После оформления заказа Продавец связывается с Пользователем для подтверждения 
            заказа и уточнения деталей.
          </Text>
          <Text>
            Оплата заказа производится в соответствии с выбранным способом оплаты.
          </Text>
        </Section>

        <Section>
          <SectionTitle>6. ОТВЕТСТВЕННОСТЬ СТОРОН</SectionTitle>
          <Text>
            За нарушение условий настоящего Соглашения стороны несут ответственность 
            в соответствии с действующим законодательством Российской Федерации.
          </Text>
          <Text>
            Продавец не несет ответственности за ущерб, причиненный Пользователю в результате 
            неправильного использования сайта.
          </Text>
        </Section>

        <Section>
          <SectionTitle>7. ИНТЕЛЛЕКТУАЛЬНАЯ СОБСТВЕННОСТЬ</SectionTitle>
          <Text>
            Все материалы, размещенные на сайте, включая тексты, изображения, дизайн, 
            являются объектами интеллектуальной собственности Продавца.
          </Text>
          <Text>
            Использование материалов сайта без разрешения Продавца запрещено.
          </Text>
        </Section>

        <Section>
          <SectionTitle>8. КОНФИДЕНЦИАЛЬНОСТЬ</SectionTitle>
          <Text>
            Продавец обязуется не разглашать персональные данные Пользователей третьим лицам, 
            за исключением случаев, предусмотренных законодательством.
          </Text>
          <Text>
            Обработка персональных данных осуществляется в соответствии с Политикой 
            конфиденциальности.
          </Text>
        </Section>

        <Section>
          <SectionTitle>9. РАЗРЕШЕНИЕ СПОРОВ</SectionTitle>
          <Text>
            Все споры, возникающие из настоящего Соглашения, разрешаются путем переговоров 
            между сторонами.
          </Text>
          <Text>
            В случае невозможности разрешения спора путем переговоров, спор подлежит 
            рассмотрению в судебном порядке.
          </Text>
        </Section>

        <Section>
          <SectionTitle>10. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ</SectionTitle>
          <Text>
            Настоящее Соглашение вступает в силу с момента его размещения на сайте и 
            действует бессрочно.
          </Text>
          <Text>
            Продавец оставляет за собой право изменять условия Соглашения. Изменения 
            вступают в силу с момента их размещения на сайте.
          </Text>
          <Text>
            Продолжение использования сайта после внесения изменений означает согласие 
            Пользователя с новыми условиями.
          </Text>
        </Section>

        <Section>
          <SectionTitle>11. КОНТАКТНАЯ ИНФОРМАЦИЯ</SectionTitle>
          <Text>
            По всем вопросам, связанным с работой сайта и настоящим Соглашением, 
            вы можете обращаться:
          </Text>
          <Text>
            <strong>Email:</strong> southclub@mail.ru<br />
            <strong>Телефон:</strong> +7 (903) 404-43-01<br />
            <strong>Адрес:</strong> Россия, обл. Ростовская,  г. Ростов-на-Дону
          </Text>
        </Section>

        <Section>
          <Text>
            <strong>Дата вступления в силу:</strong> 1 января 2025 года
          </Text>
        </Section>
      </Container>
    </PageWrapper>
  );
};

export default TermsPage; 