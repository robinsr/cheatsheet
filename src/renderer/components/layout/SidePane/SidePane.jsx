import 'react-sliding-pane/dist/react-sliding-pane.css';

import './SidePane.scss';
import { Transition } from 'components/theme';

import React from 'react';
import SlidingPane from 'react-sliding-pane';
import { createGlobalStyle } from 'styled-components';
import useHistory from '../../../hooks/useHistory';
import useParams from '../../../hooks/useParams';
import AppMenu from './AppMenu';
import OptionsForm from './OptionsForm';
import { SIDEBAR } from 'utils/paths';

const SlidingPaneStyles = createGlobalStyle`
  .slide-pane__content {
    ${Transition()};
    background-color: ${props => props.theme.menus.bg};
    color: ${props => props.theme.menus.text};
  } 
`;

const SidePane = () => {
    const { back } = useHistory();
    const [ matches ] = useParams(SIDEBAR);

    return (
        <React.Fragment>
            <SlidingPane
                className="cheat-sliding-pane-panel"
                overlayClassName="cheat-sliding-pane-overlay"
                isOpen={matches}
                from="left"
                width="300px"
                onRequestClose={() => back()}>
                <React.Fragment>
                    <AppMenu />
                    <OptionsForm />
                </React.Fragment>
            </SlidingPane>
            <SlidingPaneStyles/>
        </React.Fragment>
    );
};

export default SidePane;
