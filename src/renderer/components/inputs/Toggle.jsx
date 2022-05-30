import { HideControl, Transition } from 'components/theme';
import React  from 'react';
import styled from 'styled-components';
import { transparentize } from 'polished';

const ControlLabel = styled.label`
  cursor: pointer;
  display: block;
  line-height: 1.2rem;
  margin: 0.2rem 0;
  min-height: 1.4rem;
  padding: 0.1rem 0.4rem 0.1rem 2rem;
  position: relative;
  
  &:hover {
    color: ${props => props.theme.accent};
  }
    
  &[disabled] {
    filter: grayscale(.9) opacity(0.4);
    cursor: default;
  }
  
  input {
    ${HideControl()}
    
    :checked + i {
      background: ${props => props.theme.accent};
      border-color: ${props => props.theme.accent};
      
      ::before {
        left: 14px;
      }
    }
    
    :focus + i {
      border-color: ${props => props.theme.accent};
      //box-shadow: 0 0 0 0.1rem rgb(87 85 217 / 20%);
      box-shadow: 0 0 0 0.1rem ${props => transparentize(.80, props.theme.accent)};
    }
  }
`;

const SwitchControl = styled.i`
  ${Transition()};
  
  background-clip: padding-box;
  background: ${props => props.theme.inputs.toggle.bg};
  border-radius: 0.45rem;
  border: 0.05rem solid ${props => props.theme.inputs.toggle.bg};
  cursor: pointer;
  display: inline-block;
  height: 0.9rem;
  left: 0;
  position: absolute;
  top: 0.25rem;
  transition: background 0.2s, border 0.2s, box-shadow 0.2s, color 0.2s;
  width: 1.6rem;
  
  &::before {
    background: ${props => props.theme.base.bg};
    border-radius: 50%;
    content: "";
    display: block;
    height: 0.8rem;
    left: 0;
    position: absolute;
    top: 0;
    transition: background .8s, border .8s, box-shadow .2s, color .8s, left .8s;
    width: 0.8rem;
  }
`;


const Toggle = ({ name, label, checked, disabled=false, keyScope, onChange, tabIndex = -1, reveal }) => {

    return (
        <div className="form-group">
            <ControlLabel disabled={disabled}>
                <input type="checkbox"
                       tabIndex={tabIndex}
                       name={name}
                       checked={checked}
                       onChange={(e) => onChange(e.target.checked)}
                       data-keyscope={keyScope}
                       disabled={disabled}
                       />
                    <SwitchControl/> {label}
            </ControlLabel>
            {checked && reveal}
        </div>
    );
}

export default Toggle;
