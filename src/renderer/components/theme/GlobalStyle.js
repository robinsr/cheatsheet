import { Transition } from 'components/theme/elements';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body, #app {
    height: 100%;
  }
  
  body {
    ${Transition()};
    
    background-color: ${props => props.theme.base.bg};
    color: ${props => props.theme.base.text};
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
  
  .slide-pane__content {
    ${Transition()};
    background-color: ${props => props.theme.menus.bg};
    color: ${props => props.theme.menus.text};
  } 
  
  .form-input, 
  .modal-container,
  .modal-container .modal-header,
  select {
    ${Transition()};
    color: ${props => props.theme.textBase};
  }

  .modal-overlay {
    background-color: ${props => props.theme.modalOverlay};
  }
`

export default GlobalStyle;