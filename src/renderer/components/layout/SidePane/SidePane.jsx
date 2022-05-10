import 'react-sliding-pane/dist/react-sliding-pane.css';
import './SidePane.scss';

import React from 'react';
import SlidingPane from 'react-sliding-pane';
import AppMenu from './AppMenu.jsx';
import OptionsForm from './OptionsForm.jsx';


const SidePane = ({
    isOpen, onClose
}) => {

    return (
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
    );
};

export default SidePane;
