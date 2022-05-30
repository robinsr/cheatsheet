import './Modal.scss';
import { darken } from 'polished';
import PropTypes from 'prop-types';

import React from 'react';
import classnames from 'classnames';
import { Button } from 'components/inputs';
import { createGlobalStyle } from 'styled-components';

const ModalOverrides = createGlobalStyle`
  .modal-container {
    background-color: ${p => p.theme.modal.bg} !important;
    max-height: 101vh !important;
      
    .modal-header, .modal-content {
      a, p, .h1, .h2, .h3, .h4, .h5, .h6 {
        color: ${p => p.theme.modal.text} !important;
      }
    }
  }
  
  #blur-target {
    filter: ${p => p.active ? 'blur(2px) brightness(0.5)' : 'unset'};
  }
  
  .modal-body {
    overflow-x: hidden;
    
    &::-webkit-scrollbar {
      width: 0.3rem;
    }
 
    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }
 
    &::-webkit-scrollbar-thumb {
      background-color: ${p => darken(0.1, p.theme.modal.bg)};
      outline: 1px solid ${p => darken(0.2, p.theme.modal.bg)};
      border-radius: 0.15rem;
    }
  }
`;

const Modal = ({
    type='small',
    active=false,
    name, title,
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

Modal.propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.oneOfType([ PropTypes.string, PropTypes.element ]).isRequired,
    content: PropTypes.element.isRequired,
    onClose: PropTypes.func.isRequired,
    type: PropTypes.oneOf([ 'full', 'regular', 'small' ]),
    active: PropTypes.bool,
    footer: PropTypes.element,
    closeButton: PropTypes.bool,
    closeButtonText: PropTypes.string
}

export default Modal;
