import { SpaceBetweenItem } from 'components/theme';
import styled from 'styled-components';

/*
 * Flex layout "Table"
 */

export const TableContainer = styled.div`
  color: ${props => props.theme.card.text};
  
  :last-child div {
    border-bottom: none;
  }
`;

export const TableRow = styled.div`
  ${SpaceBetweenItem()};
  padding: 0.2rem 0.2rem;
  border-bottom: .05rem solid ${props => props.theme.card.border};
`;


export const TableHeaderRow = styled(TableRow)`
  font-weight: bold;
  border-bottom-width: .1rem;
`;