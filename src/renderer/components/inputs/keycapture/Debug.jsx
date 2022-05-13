import React from 'react';
import styled from 'styled-components';

const isEnabled = window.cheatsheetAPI.config.get('debug');

const DebugWrap = styled.small`
    display: inline-block;
`;

export const Debugger = ({ obj }) => {
    if (isEnabled) {
        return (
            <DebugWrap>
                <pre>{JSON.stringify(obj, null, 4)}</pre>
            </DebugWrap>
        );
    } else {
        return null;
    }
}