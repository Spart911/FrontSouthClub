import React from 'react';
import styled from 'styled-components';

const SectionWrapper = styled.section`
  padding: 40px 20px;
  background: #ffffff;
  scroll-margin-top: 50px;
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
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 80px;
`;

const Block = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const TextContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: right;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const BlockReversed = styled(Block)`
  flex-direction: row-reverse;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
  
  ${TextContent} {
    text-align: left;
    
    @media (max-width: 768px) {
      text-align: center;
    }
  }
`;

const ImageContainer = styled.div`
  pointer-events: none;
  flex: 0 0 45vw;
  height: 45vw;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    flex: 0 0 70vw;
    height: 70vw;
    width: 70vw;
    max-width: 70vw;
  }
`;

const ImageWrapper = styled.div`
  width: 40vw;
  height: 40vw;
  overflow: hidden;
  z-index: 1;
  position: absolute;   /* внутри родителя */
    top: 50%;             /* вниз на половину */
    left: 50%;            /* вправо на половину */
    transform: translate(-50%, -50%); /* сместить обратно в центр */
  
  @media (max-width: 768px) {
    width: 65vw;
    height: 65vw;
  }
`;

const BlueRectangleLeft = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 30vw;
  height: 30vw;
  background: #1e3ea8;
  z-index: 0;
  
  @media (max-width: 768px) {
    width: 50vw;
    height: 50vw;
  }
`;

const BlueRectangleRight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 30vw;
  height: 30vw;
  background: #1e3ea8;
  z-index: 0;
  
  @media (max-width: 768px) {
    width: 50vw;
    height: 50vw;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BlockTitle = styled.h3`
  font-size: 3rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 900;
  color: #1e3ea8;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
    text-align: center;
  }
`;

const BlockText = styled.p`
  font-size: 2rem;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-weight: 900;
  color: #000;
  line-height: 1.6;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
    text-align: center;
  }
`;

export const CommunitySection: React.FC = () => {
  return (
    <SectionWrapper id="community">
      <Title>КОМЬЮНИТИ</Title>
      <Container>
        <Block>
          <ImageContainer>
            <ImageWrapper>
              <Image src="/images/production/1.webp" alt="Комьюнити" />
            </ImageWrapper>
            <BlueRectangleLeft />
          </ImageContainer>
          <TextContent>
            <BlockTitle>НАШЕ СООБЩЕСТВО</BlockTitle>
            <BlockText>
              Присоединяйтесь к нашему растущему сообществу единомышленников. 
              Здесь вы найдете людей, которые разделяют ваши интересы и ценности. 
              Мы создаем пространство для общения, обмена идеями и вдохновения.
            </BlockText>
          </TextContent>
        </Block>
        
        <BlockReversed>
          <ImageContainer>
            <ImageWrapper>
              <Image src="/images/production/2.webp" alt="Вдохновение" />
            </ImageWrapper>
            <BlueRectangleRight />
          </ImageContainer>
          <TextContent>
            <BlockTitle>ВДОХНОВЕНИЕ И ТВОРЧЕСТВО</BlockTitle>
            <BlockText>
              Наше сообщество - это источник вдохновения и творчества. 
              Мы поддерживаем друг друга в достижении целей и реализации идей. 
              Вместе мы создаем что-то особенное и уникальное.
            </BlockText>
          </TextContent>
        </BlockReversed>
      </Container>
    </SectionWrapper>
  );
};
