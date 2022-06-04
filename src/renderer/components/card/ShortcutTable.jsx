import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import { Checkbox } from 'components/inputs'
import { FlexItem, PointerItem } from 'components/theme';
import { TableRow, TableContainer, TableHeaderRow } from 'components/theme/elements/Table';
import Link from 'components/cursor/Link';
import useCursor from 'hooks/useCursor';
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

    function onRightClick(e) {
        if (e.nativeEvent.which === 3) {
            e.nativeEvent.shiftKey ? onMoveUp(id) : onMoveDown(id);
        }
    }

    let cls = classnames({ 'active': matches });

    return (
        <Link path={`#${item.path}/edit/field=edit-form-label`} disabled={editing}>
            <ShortcutItemRow className={cls} onAuxClick={onRightClick}>
                <FlexItem grow>
                    <Checkbox
                        label={label}
                        showCheckbox={editing}
                        checked={selected}
                        onChange={e => editing && select(e.target.checked)}/>
                </FlexItem>
                <FlexItem>
                    <Link path={`#${item.path}/edit/field=capture-box-primary`} disabled={editing}>
                        <ShortcutKey item={item} command={command} capture={false} />
                    </Link>
                    {secondary
                        ? <React.Fragment>
                            <strong> + </strong>
                            <Link path={`#${item.path}/edit/field=capture-box-secondary`} disabled={editing}>
                                <ShortcutKey item={item} command={secondary} capture={false} />
                            </Link>
                          </React.Fragment>
                        : null}
                </FlexItem>
            </ShortcutItemRow>
        </Link>
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
