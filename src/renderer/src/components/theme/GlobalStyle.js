import { Transition } from 'components/theme/elements';
import { createGlobalStyle } from 'styled-components';

const { vibrancy, window: dimensions } = window.cheatsheetAPI.config.getAll()

const GlobalStyle = createGlobalStyle`
  html, body, #app {
    height: 100%;
    min-width: ${dimensions.minWidth}px;
  }
  
  html {
    background: ${p => p.theme.base.bg};
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
