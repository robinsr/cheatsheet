import React from 'react';
import styled, { css } from 'styled-components';


const InputFocusedStyled = () => css`
  border-color: ${props => props.theme.accentColor}; 
  box-shadow: 0 0 0 0.1rem ${props => props.theme.inputs.focus.boxShadow};
`;

const InputStyled = styled.div.attrs(props => ({
    className: 'form-input',
    textTheme: props.theme.inputs.text
}))`
  background-color: ${props => props.textTheme.bg} !important;
  color: ${props => props.textTheme.text};
  border: ${props => props.textTheme.border};
  
  ::placeholder {
    color: ${props => props.textTheme.placeholder};
  }
  
  &:focus {
    ${InputFocusedStyled()};
  }
`;

const SelectStyled = styled(InputStyled)`
  background: #fff url(data:image/svg+xml;charset=utf8,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%204%205%27%3E%3Cpath%20fill=%27%23667189%27%20d=%27M2%200L0%202h4zm0%205L0%203h4z%27/%3E%3C/svg%3E) no-repeat right 0.35rem center/0.4rem 0.5rem;
`;

export const TextInput = React.forwardRef(({ ...rest }, ref) => {
    return <InputStyled as={'input'} type={'text'} {...rest} ref={ref}/>
});

export const Select = React.forwardRef(({ children, ...rest }, ref) => {
    return (
        <InputStyled as={'select'} {...rest} ref={ref}>
            {children}
        </InputStyled>
    );
});
