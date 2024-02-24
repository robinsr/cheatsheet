import React, { useRef } from 'react';
import classnames from 'classnames';
import styled from 'styled-components';
import { isEnterKey } from 'utils';

const EditableDiv = styled.div`
  &:focus-visible {
    outline: none;
  }
  
  &[contenteditable=true] {
    background-color: ${props => props.theme.base.bg};

    span {
      text-decoration: dotted underline ${props => props.theme.base.text};
      text-underline-position: under;
    }
  }

  span {
    cursor: pointer;
  }
`

const ContentEditable = ({ editable, defaultValue, editValue, onChange, onEnter, className, ...rest }) => {
    const ref = useRef();

    const onKeyInput = (e) => {
        if (isEnterKey(e)) {
            e.preventDefault();
            onEnter();
        }
    }

    const cns = classnames(className, {
        'editing': editable
    });

    return (
        <EditableDiv contentEditable={editable}
                     onKeyDown={onKeyInput}
                     onBlur={e => onChange(e.target.innerText)}
                     suppressContentEditableWarning={true}
                     className={cns}
                     ref={ref}
                     {...rest}>
            <span>{editable ? editValue : defaultValue}</span>
        </EditableDiv>
    )
}

export default ContentEditable;
