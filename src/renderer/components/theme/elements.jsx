import { lighten } from 'polished';
import styled, { css } from 'styled-components';
import { columnBreakpoints } from './themes'

export const ColumnContainer = styled.div`
  column-count: 3;
  margin-top: 3.2rem;
  
  @media (max-width: ${columnBreakpoints[ 2 ]}) {
    column-count: 2;
    margin-top: 1.6rem;
  }
  
  @media (max-width: ${columnBreakpoints[ 1 ]}) {
    column-count: 1;
    margin-top: 0.8rem;
  }
`;

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

export const FlexRow = styled.div.attrs(props => ({
  gap: props.gap || 0
}))`
  ${SpaceBetweenItem()}
  
  gap: ${props => props.gap};
`;

export const FlexGrow = () => css`
    flex-grow: 1;
`;

export const FlexItem = styled.div`
  ${props => props.grow ? FlexGrow() : `flex-grow: 0;`}
`;

export const FloatingButton = styled.div.attrs(props => ({
  width: 40
}))`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${props => props.theme.accent};
  width: ${props => props.width}px;
  height: ${props => props.width}px;
  border-radius: ${props => props.width / 2}px;
  font-size: 1.1rem;
  transition: background-color 0.3s;
  
  &:hover {
    background: ${props => lighten(0.04, props.theme.accent)};
  }
  
  svg {
    fill: ${props => props.theme.base.bg};
    transition: fill 0.3s;
    
    &&:hover {
      fill: ${props => props.theme.base.text};
    }
  }
`;


export const AppFlexContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    margin: 0 8px;
    user-select: none;
`;