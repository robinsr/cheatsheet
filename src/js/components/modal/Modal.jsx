import React from 'react';
import classnames from 'classnames';


const Modal = (props) => {

    let cns = classnames(
        'modal',
        props.type || 'modal-lg', 
        props.active ? 'active' : '',
        props.name
    )

    return (
        <div className={cns}>
            <a href="#close" className="modal-overlay" aria-label="Close" onClick={props.onClose}></a>
            <div className="modal-container">
                <div className="modal-header">
                    <a href="#close" className="btn btn-clear float-right" aria-label="Close" onClick={props.onClose}></a>
                    <div className="modal-title h5">{props.title}</div>
                </div>
                <div className="modal-body">
                    {props.content}
                </div>
                <div className="modal-footer">
                    <div className="docs-demo columns">
                        <div className="column col-12">
                            {props.footer}
                            <button className="btn btn-default" onClick={props.onClose}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
