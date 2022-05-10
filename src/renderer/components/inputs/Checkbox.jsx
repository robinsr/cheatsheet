import React from 'react';
import styled from 'styled-components';

const MovingLabel = styled.label`
  margin-top: 0;
  margin-bottom: 0;
  transition: transform 0.25s;
  transform: ${props => props.showCheckbox ? 'translateX(0)' : 'translateX(-24px)'};
`

MovingLabel.defaultProps = {
    showCheckbox: true
}

const InputContainer = styled.div`
  overflow: hidden;
`

const Checkbox = ({ label, ...rest }) => {
    return (
        <InputContainer className="form-group">
            <MovingLabel className="form-checkbox" {...rest}>
                <input type="checkbox" {...rest} />
                <i className="form-icon"></i> {label}
            </MovingLabel>
        </InputContainer>
    );
}

export default Checkbox;
