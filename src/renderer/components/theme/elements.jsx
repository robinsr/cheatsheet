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

export const FlexRow = styled.div`
  ${SpaceBetweenItem()}
`;

export const FlexGrow = () => css`
    flex-grow: 1;
`;

export const FlexItem = styled.div`
  ${props => props.grow ? FlexGrow() : `flex-grow: 0;`}
`;