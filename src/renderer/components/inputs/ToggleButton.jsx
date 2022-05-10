import React, { useState } from 'react';

const ToggleButton = ({ unPopped, popped, onPop, onUnPop, ...rest }) => {

    const [ checked, setChecked ] = useState(false);



    const unCheckedButton = React.cloneElement(unPopped, { onClick: () => {
        setChecked(true);
        onPop();
    }, ...rest });

    const checkedButton = React.cloneElement(popped, { onClick: () => {
        setChecked(false);
        onUnPop();
    }, ...rest });

    return checked ? checkedButton : unCheckedButton;
}

export default ToggleButton;
