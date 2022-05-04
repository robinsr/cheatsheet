import './Modal.scss';

import React from 'react';
import classnames from 'classnames';

const Modal = ({
    type='small',
    active=false,
    name, title,
    keyscope='APP',
    content,
    footer,
    onClose,

}) => {

    let cns = classnames('modal', name, {
        'modal-lg': type === 'full',
        'modal-sm': type === 'small',
        'active': active
    });


    return (
        <div className={cns}>
            <a
               className="modal-overlay"
               aria-label="Close"
               onClick={onClose}></a>
            <div className="modal-container">
                <div className="modal-header">
                    <a
                       className="btn btn-clear float-right"
                       aria-label="Close"
                       onClick={onClose}></a>
                    <div className="modal-title h5">{title}</div>
                </div>
                <div className="modal-body">
                    {content}
                </div>
                <div className="modal-footer">
                    <div className="docs-demo columns">
                        <div className="column col-12">
                            {footer}
                            <button
                                className="btn btn-default"
                                onClick={onClose}>
                                    Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
