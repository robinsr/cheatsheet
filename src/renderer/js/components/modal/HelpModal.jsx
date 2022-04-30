import React from 'react';
import {observer} from "mobx-react-lite";
import Modal from "components/modal/Modal";
import {useMst} from "context/Store";


const HelpModal = observer(() => {
    const { cursor, setCursor } = useMst();

    if (cursor !== 'HELP') {
        return null;
    }

    return (
        <Modal
            type={'modal-sm'}
            name="help-modal"
            title={'Help'}
            active={true}
            onClose={() => setCursor(null)}
            content={
                 <div className="content">
                    <div className="">
                        <div className="p-centered">
                            <h4>Keys</h4>

                            <ul>
                                <li><kbd>Up</kbd>,<kbd>Down</kbd> Navigate Shortcut lists</li>
                                <li><kbd>Left</kbd>,<kbd>Right</kbd> Navigate Apps</li>
                                <li><kbd>/</kbd> Search</li>
                                <li><kbd>E</kbd> Edit highlighted shortcut</li>
                                <li><kbd>Cmd</kbd>+<kbd>N</kbd> New Shortcut</li>
                            </ul>

                        </div>
                    </div>
                </div>
            }/>

    );
});

export default HelpModal