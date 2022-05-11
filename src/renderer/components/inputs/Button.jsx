import React from 'react';
import styled from 'styled-components';
import { intersection as _inter, noop as _noop } from 'lodash';

const sizeVariants = {
    default: {
        fontSize: '0.8rem',
        height: '1.8rem',
        padding: '0.25rem 0.4rem'
    },
    small: {
        fontSize: '0.7rem',
        height: '1.4rem',
        padding: '0.05rem 0.3rem'
    },
    large: {
        fontSize: '0.9rem',
        height: '2rem',
        padding: '0.35rem 0.6rem'
    },
    icon: {
        fontSize: '1.2rem',
        height: '1.8rem',
        padding: '0.25rem 0.4rem'
    },
    svg: {
        fontSize: '1.1rem',
        height: '1.8rem',
        padding: '0.25rem 0.4rem'
    }
}

const variantUtil = (props, opts, defaults) => {
    let match = _inter(Object.keys(props), opts);
    match = match.filter(m => props[m] === true);
    return match.length > 0 ? match[0] : defaults;
}

const getSizeVar = props => variantUtil(props, ['small', 'large', 'icon', 'svg'], 'default');
const getColorVar = props => variantUtil(props, ['primary', 'success', 'danger'], 'default');

const BaseButton = styled.button.attrs(props => ({
    size: sizeVariants[getSizeVar(props)],
    variant: getColorVar(props),
    theme: props.theme.buttons
}))`
    appearance: none;
    background: #fff;
    border-radius: ${props => props.circle ? '50%;' : '0.1rem'};
    cursor: pointer;
    display: inline-block;
    float: ${props => props.left ? 'left' : 'unset'};
    font-size: ${props => props.size.fontSize};
    height: ${props => props.size.height};
    line-height: 1.2rem;
    outline: none;
    padding: ${props => props.size.padding};
    text-align: center;
    text-decoration: none;
    transition: background 0.2s, border 0.2s, box-shadow 0.2s, color 0.2s;
    user-select: none;
    vertical-align: middle;
    white-space: nowrap;
    width: ${props => props.full ? '100%' : 'unset'};
 
    /* color variants */
    background: ${props => props.theme.bg[props.variant]};
    border: 0.05rem solid ${props => props.theme.border[props.variant]};
    color: ${props => props.theme.text[props.variant]};
  
    &:hover {
        background-color: ${props => props.theme.hover[props.variant]};
    }
`;

BaseButton.defaultProps = {
    size: sizeVariants.default,
    circle: false,
    full: false
}

export const Button = ({ icon, children, ...rest }) => {
    if (!icon) {
        return <BaseButton {...rest}>{children}</BaseButton>;
    } else {
        return (
            <BaseButton {...rest}>
                <i className={'icon icon-' + icon}></i>
            </BaseButton>
        );
    }
}

// TODO; get btn-link to work with styled-component
export const ButtonLink = ({ className, children, ...rest }) => {
    return (
        <a className={[className, 'btn btn-link'].join(' ')} {...rest}>{children}</a>
    )
}
