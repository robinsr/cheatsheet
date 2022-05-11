import 'react-sliding-pane/dist/react-sliding-pane.css';

import './SidePane.scss';
import { Transition } from 'components/theme';

import React from 'react';
import SlidingPane from 'react-sliding-pane';
import { createGlobalStyle } from 'styled-components';
import AppMenu from './AppMenu.jsx';
import OptionsForm from './OptionsForm.jsx';

const SlidingPaneStyles = createGlobalStyle`
  .slide-pane__content {
    ${Transition()};
    background-color: ${props => props.theme.menus.bg};
    color: ${props => props.theme.menus.text};
  } 
`;

const SidePane = ({
    isOpen, onClose
}) => {

    return (
        <React.Fragment>
            <SlidingPane
                className="cheat-sliding-pane-panel"
                overlayClassName="cheat-sliding-pane-overlay"
                isOpen={isOpen}
                from="left"
                width="300px"
                onRequestClose={onClose}>
                <React.Fragment>
                    <AppMenu onSelect={onClose} />
                    <OptionsForm closeContainer={onClose} />
                </React.Fragment>
            </SlidingPane>
            <SlidingPaneStyles/>
        </React.Fragment>
    );
};

export default SidePane;
