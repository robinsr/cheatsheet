import React from 'react';
import Modal from './Modal';
import KeyScope from 'components/providers/KeyScope';

const btnStyle = {
    width: '100%',
    marginTop: '0.5rem'
};

const Dialog = ({
    title,
    keyscope='APP',
    content,
    onCancel,
    onConfirm
}) => {
    return (
        <KeyScope scope={keyscope}>
             <Modal
                type="small"
                name="dialog-window"
                title={''}
                active={true}
                onClose={onCancel}
                closeButton={false}
                content={
                     <div className="content text-center">
                         <span className={'h5 my-2'}>{title}</span>
                         <div className="container">
                            <div className="columns">
                                <div className="column col-6">
                                    <button
                                        className={'btn btn-lg btn-error'}
                                        style={btnStyle}
                                        onClick={onConfirm}>Confirm</button>

                                </div>
                                <div className="column col-6">
                                    <button
                                        className={'btn btn-lg btn-default'}
                                        style={btnStyle}
                                        onClick={onCancel}>Cancel</button>
                                </div>
                            </div>
                         </div>
                     </div>
                }
                footer={''}/>
        </KeyScope>
    );
}

export default Dialog
