import './Modal.scss';

import React from 'react';
import classnames from 'classnames';
import { Button } from 'components/inputs';
import { createGlobalStyle } from 'styled-components';

const ModalOverrides = createGlobalStyle`
  .modal-overlay {
    background-color: ${props => props.theme.blur} !important;
  }
  
  .modal-container {
    background-color: ${props => props.theme.menus.bg} !important;
      
    .modal-header, .modal-content {
      a, p, .h1, .h2, .h3, .h4, .h5, .h6 {
        color: ${props => props.theme.menus.text} !important;
      }
    }
  }
  
  #blur-target {
    filter: ${props => props.active ? 'blur(2px)' : 'unset'};
  }
`;

const Modal = ({
    type='small',
    active=false,
    name, title,
    keyscope='APP',
    content,
    footer,
    onClose,
    closeButton=true,
    closeButtonText='Close'
}) => {

    let cns = classnames('modal', name, {
        'modal-lg': type === 'full',
        'modal-sm': type === 'small',
        'active': active
    });


    return (
        <React.Fragment>
            <div className={cns}>
                <a className="modal-overlay"
                   aria-label="Close"
                   onClick={onClose}></a>
                <div className="modal-container">
                    <div className="modal-header">
                        <a className="btn btn-clear float-right"
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
                                {closeButton &&
                                    <Button onClick={onClose}>{closeButtonText}</Button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalOverrides active={active}/>
        </React.Fragment>
    );
}

export default Modal;
