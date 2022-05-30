import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import { Checkbox } from 'components/inputs'
import { FlexItem, PointerItem } from 'components/theme';
import { TableRow, TableContainer, TableHeaderRow } from 'components/theme/elements/Table';
import { EDIT_ITEM, ITEM } from 'utils/paths';
import useCursor from '../../hooks/useCursor';
import useHistory from '../../hooks/useHistory';
import ShortcutKey from './ShortcutKey.jsx';


const ShortcutItemRow = styled(TableRow)`
  label {
    ${PointerItem()}
  }
  
  &:hover, &.active {
    color: ${props => props.theme.cursor.color};
    background-color: ${props => props.theme.cursor.bg};
  }
`;

const ShortcutTableRow = observer(({
    item, editing, onMoveUp, onMoveDown
}) => {
    let { id, label, command, secondary, selected, select } = item;

    const { matches } = useCursor('#' + item.path);
    const { push, back } = useHistory();

    function onRightClick(e) {
        if (e.nativeEvent.which === 3) {
            e.nativeEvent.shiftKey ? onMoveUp(id) : onMoveDown(id);
        }
    }

    function onClick(e, fieldName) {
        if (editing) return;
        e.stopPropagation();
        push(EDIT_ITEM.link({ itemId: id, field: fieldName }));
    }

    let cls = classnames({ 'active': matches });

    return (
        <ShortcutItemRow className={cls}
            onClick={(e) => onClick(e, 'edit-form-label')}
            onAuxClick={onRightClick}
            >
            <FlexItem grow>
                <Checkbox
                    label={label}
                    showCheckbox={editing}
                    checked={selected}
                    onChange={e => editing && select(e.target.checked)}/>
            </FlexItem>
            <FlexItem>
                <ShortcutKey item={item} command={command} capture={false} onClick={(e) => onClick(e, 'capture-box-primary')} />
                {secondary
                    ? <React.Fragment>
                        <strong> + </strong>
                        <ShortcutKey item={item} command={secondary} capture={false} onClick={(e) => onClick(e, 'capture-box-secondary')} />
                      </React.Fragment>
                    : null}
            </FlexItem>
        </ShortcutItemRow>
    )
});

const ShortcutTable = observer(({ group, editing }) => {
    return (
        <TableContainer>
            <TableHeaderRow>
                <FlexItem grow>Name</FlexItem>
                <FlexItem>Shortcut</FlexItem>
            </TableHeaderRow>
            {group.items.map(item => (
                <ShortcutTableRow item={item}
                     key={'table_item_' + item.id}
                     editing={editing}
                     onMoveUp={() => group.moveItemUp(item.id)}
                     onMoveDown={() => group.moveItemDown(item.id)}
                     onDelete={() => group.removeItem(item.id)}
                />
            ))}
        </TableContainer>
    )
});

export default ShortcutTable
