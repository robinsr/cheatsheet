import Dialog from 'components/modal/Dialog';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useMst } from 'store';
import { PropResponse } from 'store/types/Proposition';

const UserPrompt = observer(() => {
    let { state } = useMst();

    if (!state.userPrompt) {
        return null;
    }

    let { statement, answer } = state.userPrompt;

    return (
        <Dialog
            message={statement}
            onCancel={() => answer(PropResponse.cancel())}
            onConfirm={() => answer(PropResponse.confirm())}/>
    );
});

export default UserPrompt;