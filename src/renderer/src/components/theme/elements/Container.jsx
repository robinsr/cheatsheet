import { columnBreakpoints, SpaceBetweenItem } from 'components/theme';
import styled, { css } from 'styled-components';

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

export const AppFlexContainer = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    margin: 0 8px;
    user-select: none;
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