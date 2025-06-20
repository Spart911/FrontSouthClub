import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: white;
  position: relative;
  overflow: hidden;
`;

const BlackBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background-color: black;
  z-index: 0;
  pointer-events: none;
`;

const ContentWrapper = styled.div`
  margin-top: 80px;
  padding: 4rem 8vw;
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    padding: 2rem 18px;
  }
`;

const Title = styled.h1`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 3rem;
  margin-bottom: 2rem;
  color: #000;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const TextBlock = styled.div`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.2rem;
  line-height: 1.6;
  color: #000;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const AboutPage: React.FC = () => {
  return (
    <PageContainer>
      <BlackBar />
      <ContentWrapper>
        <Title>О нас</Title>
        <TextBlock>
          LUMNI - это бренд, созданный с любовью к дизайну и качеству. Мы специализируемся на создании уникальных настольных ламп, которые сочетают в себе функциональность, эстетику и инновационные решения.
        </TextBlock>
        <TextBlock>
          Наша миссия - создавать осветительные приборы, которые не просто освещают пространство, но и становятся его неотъемлемой частью, добавляя характер и стиль в любой интерьер.
        </TextBlock>
        <TextBlock>
          Каждая лампа LUMNI создается с вниманием к деталям и использованием только качественных материалов. Мы гордимся тем, что наши изделия производятся в России, поддерживая местное производство и традиции.
        </TextBlock>
        <TextBlock>
          Мы верим, что хороший дизайн должен быть доступен каждому, поэтому стремимся создавать продукты, которые будут радовать своих владельцев долгие годы.
        </TextBlock>
      </ContentWrapper>
    </PageContainer>
  );
}; 