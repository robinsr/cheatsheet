import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import classnames from 'classnames';

import { useMst } from 'store';
import ShortcutKey from './ShortcutKey.jsx';
import { Checkbox } from 'components/inputs'
import { FlexItem, PointerItem, SpaceBetweenItem } from 'components/theme';


const ShortcutTableContainer = styled.div`
  color: ${props => props.theme.card.text};
  
  :last-child div {
    border-bottom: none;
  }
`;

const BaseRow = styled.div`
  ${SpaceBetweenItem()};
  padding: 0.2rem 0.2rem;
  border-bottom: .05rem solid ${props => props.theme.card.border};
`;

const ShortcutItemRow = styled(BaseRow)`
  label {
    ${PointerItem()}
  }
  
  &:hover, &.active {
    color: ${props => props.theme.cursor.color};
    background-color: ${props => props.theme.cursor.bg};
  }
`;

const ShortcutTableHeader = styled(BaseRow)`
  font-weight: bold;
  border-bottom-width: .1rem;
`;

const ShortcutTableRow = observer(({
    item, editing, onMoveUp, onMoveDown
}) => {
    let { edit, cursor, setCursor } = useMst();
    let { id, label, command, secondary, selected, select, deselect } = item;

    function onRightClick(e) {
        if (e.nativeEvent.which === 3) {
            e.nativeEvent.shiftKey ? onMoveUp(id) : onMoveDown(id);
        }
    }

    function onClick(e, target) {
        if (editing) return;
        e.stopPropagation();

        if (target === 'label') {
            setCursor('edit-form-label');
        }
        else if (target === 'key1') {
            setCursor('capture-box');
        }
         else if (target === 'key2') {
            setCursor('capture-box-2');
        }

        edit.setEditItem(item);
    }

    let cls = classnames({ 'active': id === cursor });

    return (
        <ShortcutItemRow className={cls}
            onClick={(e) => onClick(e, 'label')}
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
                <ShortcutKey item={item} command={command} capture={false} onClick={(e) => onClick(e, 'key1')} />
                {secondary
                    ? <React.Fragment>
                        <strong> + </strong>
                        <ShortcutKey item={item} command={secondary} capture={false} onClick={(e) => onClick(e, 'key2')} />
                      </React.Fragment>
                    : null}
            </FlexItem>
        </ShortcutItemRow>
    )
});

const ShortcutTable = observer(({ group, editing }) => {
    return (
        <ShortcutTableContainer>
            <ShortcutTableHeader>
                <FlexItem grow>Name</FlexItem>
                <FlexItem>Shortcut</FlexItem>
            </ShortcutTableHeader>
            {group.items.map(item => (
                <ShortcutTableRow item={item}
                     key={'table_item_' + item.id}
                     editing={editing}
                     onMoveUp={() => group.moveItemUp(item.id)}
                     onMoveDown={() => group.moveItemDown(item.id)}
                     onDelete={() => group.removeItem(item.id)}
                />
            ))}
        </ShortcutTableContainer>
    )
});

export default ShortcutTable
