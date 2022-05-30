import { css } from 'styled-components';

export const HideControl = () => css`
  clip: rect(0,0,0,0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  position: absolute;
  width: 1px;
`;

export const PointerItem = () => css`
  cursor: pointer;
`;



export const Transition = () => css`
    transition: background 0.8s, color 0.8s, border 0.8s;
`;

export const SpaceBetweenItem = () => css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
