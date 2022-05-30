import { FlexGrow, FlexRow, PointerItem, SpaceBetweenItem, Transition } from 'components/theme';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useMst } from 'store';
import { CardMenu, MenuItem } from 'components/card/CardMenu';
import { Button, ButtonLink, ContentEditable, ToggleButton } from 'components/inputs';
import { ShowHideElement } from 'utils';
import { renderPNG, renderSVG } from 'utils/canvas_renderer';
import ShortcutTable from './ShortcutTable';

const CardContainer = styled.div`
  border: 0;
  box-shadow: 0 0.25rem 1rem rgba(48, 55, 66, 0.15);
  break-inside: avoid;
  margin-bottom: 0.8rem;
`

const Card = styled.div`
  ${Transition()};
  
  background-color: ${props => props.theme.card.body};
  color: ${props => props.theme.card.text};
  border: 0.05rem solid ${props => props.theme.card.head};
  border-radius: 0.1rem;
  display: flex;
  flex-direction: column;
`;

const CardHeader = styled.div`
  ${SpaceBetweenItem()}
  ${Transition()};
  
  padding: 0.8rem;
  background-color: ${props => props.theme.card.head};
`;

const CardTitle = styled.div`
  ${FlexGrow()}
`;

const AddItemButton = styled.div`
  ${PointerItem()}
  width: 100%;
  text-align: center;
  
  a {
    display: block;
    font-size: 1.2rem;
  }
`;

/**
 * @function
 * @param {{group:ICategoryItem, app:IAppItem}} props
 * @returns {JSX.Element}
 */
const ShortcutCard = ({ group, app }) => {
    let { items, imageModal, removeCategory, state } = useMst();

    let cardRef = useRef(null);
    let menuRef = useRef(null);
    let addItemRef = useRef(null);

    let [ edit, setEdit ] = useState(false);
    let [ editGroupName, setEditGroupName ] = useState(group.name);

    const onDoneEdit = () => {
        if (editGroupName !== group) group.updateName(editGroupName);

        if (group.numSelected > 0) {
            let msg = `Remove ${group.numSelected} items from ${group.name}?`

            state.setPromptValueAndWait(msg).then(answer => {
                if (answer.isConfirm()) {
                    group.removeSelected();
                } else {
                    group.unselectItems();
                }
            })
            .finally(() => setEdit(false));
        } else {
            setEdit(false);
        }
    }

    const deleteCategory = () => {
        state.setPromptValueAndWait(`Delete ${group.name}?`)
            .then(answer => {
                if (answer.isConfirm()) {
                   removeCategory(app.id, group.id);
                } else {
                    setEdit(false);
                }
            })
    }

    const render = type => {
        if (type === 'SVG') return renderSVG(cardRef.current);
        if (type === 'PNG') return renderPNG(cardRef.current);
        return Promise.reject('Image type must be SVG on PNG')
    }

    const exportImage = type => {
        let e = new ShowHideElement([ menuRef.current, addItemRef.current ]);
        render(type)
            .then(imageData => {
                imageData.filename = `cheatsheet-${app.name}-${group.name}`;
                imageModal.setImageData(imageData);
            })
            .catch(e.show)
            .finally(e.show)
    }

    const exportMD = () => { /* todo */ }

    return (
        <CardContainer key={'shortcut-card-' + group.id} ref={cardRef}>
            <Card className="card">
                <CardHeader>
                    <CardTitle onDoubleClick={() => setEdit(true)}>
                        <ContentEditable className="card-title h5"
                                         editable={edit}
                                         defaultValue={group.name}
                                         editValue={editGroupName}
                                         onChange={setEditGroupName}
                                         onEnter={onDoneEdit}/>
                    </CardTitle>
                    <FlexRow className="dropdown" ref={menuRef}>
                        <ToggleButton className="mx-1" tabIndex={-1}
                                      checked={edit}
                                      unPopped={<Button small primary icon="edit" />}
                                      popped={<Button small success icon="check" />}
                                      onPop={() => setEdit(true)}
                                      onUnPop={() => onDoneEdit()}
                        />
                        {edit ?
                             <Button small danger icon="delete" onClick={deleteCategory}tabIndex={-1}/>
                            : <React.Fragment>
                                <Button small primary icon="download" className="dropdown-toggle"tabIndex={-1}/>
                                <CardMenu>
                                    <MenuItem name="PNG" icon="photo" onCLick={() => exportImage('PNG')}/>
                                    <MenuItem name="SVG" icon="resize-horiz" onCLick={() => exportImage('SVG')}/>
                                    <MenuItem name="MD" icon="bookmark" onCLick={() => exportMD()}/>
                                </CardMenu>
                            </React.Fragment>
                          }
                    </FlexRow>
                </CardHeader>
                <div className="card-body">
                    <ShortcutTable group={group} editing={edit}/>
                    <AddItemButton ref={addItemRef}>
                        <ButtonLink onClick={() => group.addItem()}>+</ButtonLink>
                    </AddItemButton>
                </div>
            </Card>
        </CardContainer>
    );
}

export default observer(ShortcutCard);

/*
{edit ? <input type="text" value={editGroupName} onChange={e => setEditGroupName(e.target.value)} /> : group.name}
 */