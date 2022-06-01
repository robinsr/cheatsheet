import React from 'react';
import { useMst } from 'store';
import { Button } from 'components/inputs';
import Modal from 'components/modal/Modal';
import { observer } from 'mobx-react-lite';


const ErrorAlert = observer(({error, resetErrorBoundary}) => {

    const { history, state } = useMst();

    const tryReset = () => {
        resetErrorBoundary();
    }

    return (
        <Modal
            name={'crash-modal'}
            type={'full'}
            title={'Opps, it broke...'}
            onClose={tryReset}
            closeButton={false}
            active={true}
            content={
                <div className={'modal-content'}>
                    <pre>{error.stack}</pre>
                    <p>State:</p>
                    <pre>{JSON.stringify(state.toJSON(), null, 4)}</pre>
                    <p>History:</p>
                    <pre>{JSON.stringify(history.toJSON(), null, 4)}</pre>
                    <p>Sorry I made a garbage app...</p>
                </div>
            }
            footer={
                <Button large danger onClick={tryReset}>Reset app</Button>
            }
        />
    );
});

export default ErrorAlert;
