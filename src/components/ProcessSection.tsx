import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ProcessContainer = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const ProcessImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/Process.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const ContentBlock = styled.div`
  position: absolute;
  top: 50%;
  left: 70%;
  transform: translate(-50%, -50%);
  color: white;
  text-align: left;
  max-width:800px;
`;

const Subtitle = styled.p`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 1.2rem;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  margin-bottom: 1rem;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const Title = styled.h2`
  font-family: var(--font-buch), "Helvetica", sans-serif;
  font-size: 3rem;
  margin-bottom: 2rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const LearnMoreButton = styled.button`
  background: white;
  color: black;
  border: none;
  padding: 12px 24px;
  font-family: var(--font-buch), "Helvetica", sans-serif;
  cursor: pointer;
  transition: opacity 0.3s;
  font-size: 1rem;

  &:hover {
    opacity: 0.8;
  }
`;

export const ProcessSection: React.FC = () => {
  const navigate = useNavigate();

  const handleLearnMoreClick = () => {
    navigate('/made');
  };

  return (
    <ProcessContainer>
      <ProcessImage />
      <ContentBlock>
        <Subtitle>Новое будущее для дизайна</Subtitle>
        <Title>Производство уникальных ламп на 3D-принтерах с точностью и инновациями</Title>
        <LearnMoreButton onClick={handleLearnMoreClick}>Узнать больше</LearnMoreButton>
      </ContentBlock>
    </ProcessContainer>
  );
}; 