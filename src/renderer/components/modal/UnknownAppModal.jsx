import KeyScope from 'components/providers/KeyScope';
import React from 'react';
import { observer } from "mobx-react-lite";
import { useMst } from "store";
import Modal from 'components/modal/Modal';
import { Button } from 'components/inputs';

const UnknownAppModal = observer(() => {
    let { apps, state, ui } = useMst();

    if (!state.unknownApp) {
        return null;
    }

    let { unknownApp } = state;

    const onIgnore = () => {
        ui.addIgnoreApp(unknownApp);
        state.clearUnknownAppName();
    }

    const onYesResponse = () => {
        apps.addNewApp(unknownApp, unknownApp);
        state.clearUnknownAppName();
    }

    const onLater = () => {
        state.clearUnknownAppName();
    }

    return (
        <KeyScope scope={'NEW_APP'} prevScope={'APP'}>
            <Modal
                type="small"
                name="unknown-app-modal"
                title={<span>New app?</span>}
                active={unknownApp !== null}
                onClose={onLater}
                content={
                    <div>
                        <p>Add shortcuts for {unknownApp}?</p>
                        <Button className="my-2" full success onClick={onYesResponse}>Yes (y)</Button>
                        <Button className="my-2" full danger onClick={onIgnore}>Add to ignore list (n)</Button>
                    </div>
                }
                closeButtonText={'Maybe later... (esc)'}
            />
        </KeyScope>
    );
});

export default UnknownAppModal;
