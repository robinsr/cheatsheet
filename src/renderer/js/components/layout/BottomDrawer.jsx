import React, { useState } from 'react';
import { observer } from "mobx-react-lite";
import { useMst } from "context/Store";
import SlidingPane from "react-sliding-pane";

const BottomDrawer = observer(() => {
    let { apps } = useMst();

    const [ isOpen, setIsOpen ] = useState(true);

    if (!apps.unknownApp) {
        return null;
    }

    let { unknownApp } = apps;

    function onClose() {
        apps.ignoreApp(unknownApp);
        apps.clearUnknownAppName();
    }

    function onYesResponse() {
        let app = apps.addNewApp(unknownApp, unknownApp);
        app.addCategory();

        apps.clearUnknownAppName();
    }

    return (
        <SlidingPane
            className="cheat-sliding-pane-panel__bottom"
            overlayClassName="cheat-sliding-pane-overlay__bottom"
            isOpen={isOpen}
            from="bottom"
            width="100%"
            onRequestClose={onClose}>
            <div>
                <p>Add shortcuts for {unknownApp}?</p>
                <div>
                    <button className={"btn btn-success"} onClick={onYesResponse}>Yes</button>
                    <button className={"btn btn-error"} onClick={onClose}>Ignore</button>
                </div>
            </div>
        </SlidingPane>
    );
});

export default BottomDrawer;
