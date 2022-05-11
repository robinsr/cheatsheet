import React from 'react';
import styled from 'styled-components';


const MovingLabel = styled.label`
  margin-top: 0;
  margin-bottom: 0;
  transition: transform 0.25s;
  transform: ${props => props.showCheckbox ? 'translateX(0)' : 'translateX(-24px)'};
  
  input:checked ~ span {
    text-decoration: line-through;
    text-decoration-thickness: 0.1rem;
    text-decoration-color: ${props => props.theme.accent};
  }
`

MovingLabel.defaultProps = {
    showCheckbox: true
}

const InputContainer = styled.div`
  overflow: hidden;
`

const Checkbox = ({ label, showCheckbox, ...rest }) => {
    return (
        <InputContainer className="form-group">
            <MovingLabel className="form-checkbox" showCheckbox={showCheckbox}>
                <input type="checkbox" {...rest} />
                <i className="form-icon"></i><span>{label}</span>
            </MovingLabel>
        </InputContainer>
    );
}

export default Checkbox;
