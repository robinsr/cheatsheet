import 'react-sliding-pane/dist/react-sliding-pane.css';
import './SidePane.scss';

import React from 'react';
import { observer } from 'mobx-react-lite';
import SlidingPane from 'react-sliding-pane';
import AppMenu from './AppMenu';
import OptionsForm from './OptionsForm';

import { useMst } from 'context/Store';

const SidePane = observer(({
    isOpen, onClose
}) => {
    let { apps } = useMst();

    return (
        <SlidingPane
            className="cheat-sliding-pane-panel"
            overlayClassName="cheat-sliding-pane-overlay"
            isOpen={isOpen}
            from="left"
            width="300px"
            onRequestClose={onClose}>
            <AppMenu onSelect={onClose} />
            <OptionsForm />
        </SlidingPane>
    );
});

export default SidePane;
