import React, { useState } from 'react';
import { observer } from "mobx-react-lite";
import { useMst } from "store";
import SlidingPane from "react-sliding-pane";

const BottomDrawer = observer(() => {
    let { apps, state, ui } = useMst();

    const [ isOpen, setIsOpen ] = useState(true);

    if (!state.unknownApp) {
        return null;
    }

    let { unknownApp } = state;


    function onIgnore() {
        ui.addIgnoreApp(unknownApp);
        state.clearUnknownAppName();
    }

    function onYesResponse() {
        apps.addNewApp(unknownApp, unknownApp);
        state.clearUnknownAppName();
    }

    return (
        <SlidingPane
            className="cheat-sliding-pane-panel__bottom"
            overlayClassName="cheat-sliding-pane-overlay__bottom"
            isOpen={isOpen}
            from="bottom"
            width="100%"
            onRequestClose={onIgnore}>
            <div>
                <p>Add shortcuts for {unknownApp}?</p>
                <div>
                    <button className={"btn btn-success"} onClick={onYesResponse}>Yes</button>
                    <button className={"btn btn-error"} onClick={onIgnore}>Ignore</button>
                </div>
            </div>
        </SlidingPane>
    );
});

export default BottomDrawer;
