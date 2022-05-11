import React from 'react';
import styled from 'styled-components';

const isEnabled = window.cheatsheetAPI.config.get('debug');

const DebugWrap = styled.small.attrs(props => ({
    display: isEnabled ? 'inline-block' : 'none'
}))``

export const Debugger = ({ obj }) => (
    <DebugWrap>
        <pre>{JSON.stringify(obj, null, 4)}</pre>
    </DebugWrap>
);