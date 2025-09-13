import React, { useState } from 'react';
import styled from 'styled-components';

const LogoWrapper = styled.div`
  width: 100%;
  display: flex;
  pointer-events: none;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: white;
  min-height: 200px;
  
  @media (max-width: 768px) {
    min-height: 150px;
  }
`;

const LogoImage = styled.img<{ $loaded: boolean; $fetchpriority?: string }>`
  display: block;
  margin-top: 5vh;
  width: 50vh;
  height: auto;
  max-width: 100vw;
  max-height: 50vh;
  opacity: ${props => props.$loaded ? 1 : 0};
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    margin-top: 0;
    width: 35vh;
    max-width: 70vw;
    max-height: 40vh;
  }
`;

const LoadingText = styled.div`
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 2rem;
  color: #666;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const Logo: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <LogoWrapper>
      {!isLoaded && <LoadingText>SOUTH CLUB</LoadingText>}
      <LogoImage 
        src={'/images/production/logo_SC.png'} 
        alt="SOUTH CLUB Logo" 
        loading="eager"
        $fetchpriority="high"
        decoding="async"
        $loaded={isLoaded}
        onLoad={() => setIsLoaded(true)}
      />
    </LogoWrapper>
  );
};


