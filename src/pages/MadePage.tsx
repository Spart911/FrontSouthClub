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
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
`;

const Title = styled.h1`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 3rem;
  color: #000;
  margin-bottom: 40px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Section = styled.section`
  margin-bottom: 80px;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 2rem;
  color: #000;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Text = styled.p`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.2rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  margin: 40px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 75%;
  overflow: hidden;
  border-radius: 8px;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin: 40px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProcessItem = styled.div`
  background: #f8f8f8;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
`;

const ProcessNumber = styled.div`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 2rem;
  color: rgb(0, 133, 91);
  margin-bottom: 20px;
`;

const ProcessTitle = styled.h3`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.5rem;
  color: #000;
  margin-bottom: 15px;
`;

const ProcessText = styled.p`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
`;

const MadePage: React.FC = () => {
  return (
    <PageWrapper>
      <TopBar />
      <Container>
        <Title>Наше производство</Title>

        <Section>
          <SectionTitle>Ручная работа</SectionTitle>
          <Text>
            Каждая лампа LUMNI создается вручную в нашей мастерской в Ростове-на-Дону. 
            Мы используем только качественные материалы и современные технологии, 
            сочетая их с традиционными методами ручного производства.
          </Text>
          <ImageGrid>
            <ImageContainer>
              <Image src="/main_images/4.webp" alt="Мастерская LUMNI" />
            </ImageContainer>
            <ImageContainer>
              <Image src="/main_images/5.webp" alt="Процесс создания" />
            </ImageContainer>
          </ImageGrid>
        </Section>

        <Section>
          <SectionTitle>Процесс создания</SectionTitle>
          <ProcessGrid>
            <ProcessItem>
              <ProcessNumber>01</ProcessNumber>
              <ProcessTitle>Дизайн</ProcessTitle>
              <ProcessText>
                Каждая модель начинается с эскиза и 3D-моделирования. 
                Мы тщательно прорабатываем каждую деталь, чтобы создать 
                идеальный баланс формы и функциональности.
              </ProcessText>
            </ProcessItem>
            <ProcessItem>
              <ProcessNumber>02</ProcessNumber>
              <ProcessTitle>Производство</ProcessTitle>
              <ProcessText>
                Используя современное оборудование и ручной труд, 
                мы создаем каждую деталь с особой точностью. 
                Каждый элемент проходит тщательный контроль качества.
              </ProcessText>
            </ProcessItem>
            <ProcessItem>
              <ProcessNumber>03</ProcessNumber>
              <ProcessTitle>Сборка</ProcessTitle>
              <ProcessText>
                Финальная сборка происходит вручную. 
                Мы проверяем каждую лампу перед отправкой, 
                чтобы убедиться в её безупречном качестве.
              </ProcessText>
            </ProcessItem>
          </ProcessGrid>
        </Section>

        <Section>
          <SectionTitle>Материалы</SectionTitle>
          <Text>
            Мы используем современные технологии 3D-печати для создания уникальных форм и конструкций. 
            Для каждой модели лампы мы индивидуально подбираем материалы, учитывая их прочность, 
            долговечность и эстетические качества. Это позволяет нам создавать изделия, 
            которые идеально соответствуют дизайну и функциональным требованиям.
          </Text>
          <ImageGrid>
            <ImageContainer>
              <Image src="/main_images/6.webp" alt="Материалы" />
            </ImageContainer>
            <ImageContainer>
              <Image src="/main_images/7.webp" alt="Процесс обработки" />
            </ImageContainer>
          </ImageGrid>
        </Section>

        <Section>
          <SectionTitle>Гарантия качества</SectionTitle>
          <Text>
            Каждая лампа LUMNI проходит многоступенчатый контроль качества. 
            Мы гарантируем долговечность и надежность наших изделий, 
            а также предоставляем гарантию на все компоненты.
          </Text>
        </Section>
      </Container>
    </PageWrapper>
  );
};

export default MadePage; 