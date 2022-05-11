import React, { useEffect, useState } from 'react';

const ToggleButton = ({ unPopped, popped, onPop, onUnPop, checked=false, ...rest }) => {

    const [ poppedState, setPoppedState ] = useState(checked);

    useEffect(() => {
        setPoppedState(checked);
    }, [checked])

    const unCheckedButton = React.cloneElement(unPopped, { onClick: () => {
        setPoppedState(true);
        onPop();
    }, ...rest });

    const checkedButton = React.cloneElement(popped, { onClick: () => {
        setPoppedState(false);
        onUnPop();
    }, ...rest });

    return poppedState ? checkedButton : unCheckedButton;
}

export default ToggleButton;
