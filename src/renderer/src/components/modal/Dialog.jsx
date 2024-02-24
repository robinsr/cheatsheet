import { FlexItem, FlexRow } from 'components/theme';
import React from 'react';
import { Button } from 'components/inputs';
import Modal from './Modal';
import KeyScope from 'components/providers/KeyScope';

const btnStyle = {
    width: '100%',
    marginTop: '0.5rem'
};

const Dialog = ({
    title = "Are you sure?",
    message,
    keyscope='APP',
    onCancel,
    onConfirm
}) => {
    return (
        <KeyScope scope={keyscope}>
             <Modal
                type="small"
                name="dialog-window"
                title={title}
                active={true}
                onClose={onCancel}
                closeButton={false}
                content={
                     <div className="content text-center">
                         <p className={'my-2'}>{message}</p>
                         <FlexRow gap={'1rem'}>
                             <FlexItem>
                                    <Button large danger style={btnStyle} onClick={onConfirm}>Confirm</Button>
                             </FlexItem>
                             <FlexItem>
                                    <Button large style={btnStyle} onClick={onCancel}>Cancel</Button>
                             </FlexItem>
                         </FlexRow>
                     </div>
                }
                footer={''}/>
        </KeyScope>
    );
}

export default Dialog
