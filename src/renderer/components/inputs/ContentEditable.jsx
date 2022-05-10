import React from 'react';
import classnames from 'classnames';
import styled from 'styled-components';

const EditableDiv = styled.div`
  &:focus-visible {
    outline: none;
  }
  
  &[contenteditable=true] {
    background-color: ${props => props.theme.base.bg};
    
    span {
        text-decoration: dotted underline ${props => props.theme.base.text};
        text-underline-position: under;
        cursor: pointer;
    }
  }
`

const ContentEditable = ({ editable, defaultValue, editValue, onChange, className, ...rest }) => {
    const cns = classnames(className, {
        'editing': editable
    })

    return (
        <EditableDiv contentEditable={editable}
             onBlur={e => onChange(e.target.innerText)}
             suppressContentEditableWarning={true}
             className={cns}
             {...rest}>
            <span>{editable ? editValue : defaultValue}</span>
        </EditableDiv>
    )
}

export default ContentEditable;
