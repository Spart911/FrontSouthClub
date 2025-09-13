import React from 'react';
import styled, { keyframes } from 'styled-components';

const TEXT = 'SOUTH • 761 • FREEDOM • RND • NIGHT';

const scrollX = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-20%); }
`;

const TapeWrapper = styled.section`
  width: 100%;
  background: white;
  overflow: hidden;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
`;

const Track = styled.div`
  display: flex;
  align-items: center;
  gap: 48px;
  padding: 14px 24px;
  width: max-content;
  animation: ${scrollX} 28s linear infinite;

  @media (max-width: 768px) {
    gap: 28px;
    padding: 10px 16px;
  }
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px;
  font-family: 'HeatherGreen', 'Helvetica', sans-serif;
  font-size: 1.7rem;  
  font-weight: 1700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #000;
  white-space: nowrap;


  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const RunningTape: React.FC = () => {
  const repeats = Array.from({ length: 10 }, () => TEXT); // больше повторов = плавнее

  return (
    <TapeWrapper>
      <Track>
        {repeats.map((txt, idx) => (
          <Pill key={idx}>{txt}</Pill>
        ))}
        {repeats.map((txt, idx) => (
          <Pill key={`hidden-${idx}`} aria-hidden="true">{txt}</Pill>
        ))}
      </Track>
    </TapeWrapper>
  );
};
