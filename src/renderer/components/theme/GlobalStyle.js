import { Transition } from 'components/theme/elements';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body, #app {
    height: 100%;
    min-width: 20rem;
  }
  
  body {
    ${Transition()};
    
    background-color: ${props => props.theme.base.bg};
    color: ${props => props.theme.base.text};
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
  
  .form-input, 
  .modal-container,
  .modal-container .modal-header,
  select {
    ${Transition()};
    color: ${props => props.theme.textBase};
  }
`

export default GlobalStyle;