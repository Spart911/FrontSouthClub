import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* Global resets without font declarations to avoid double-loading */
  *, *::before, *::after { box-sizing: border-box; }
`;