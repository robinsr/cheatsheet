import { Transition } from 'components/theme/elements';
import { createGlobalStyle } from 'styled-components';

const vibrancy = window.cheatsheetAPI.config.get('vibrancy');

const GlobalStyle = createGlobalStyle`
  html, body, #app {
    height: 100%;
    min-width: 20rem;
  }
  
  body {
    ${Transition()};
    
    background-color: ${p => vibrancy ? 'transparent' : p.theme.base.bg};
    color: ${p => p.theme.base.text};
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export default GlobalStyle;
