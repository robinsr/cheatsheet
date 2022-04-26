import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Card, CardHeader, CardTitle, CardBody } from 'spectre-react';

import { renderPNG, renderSVG } from 'utils/canvas_renderer';
import { ShowHideElement } from 'utils/dom';
import { useMst } from 'context/Store.jsx';

import ShortcutTable from './ShortcutTable.jsx';


const ShortcutCard = observer(({ group, app }) => {
    let { items, imageModal } = useMst();

    let cardRef = useRef(null);
    let menuRef = useRef(null);
    let addItemRef = useRef(null);

    let [ edit, setEdit ] = useState(false);
    let [ editGroupName, setEditGroupName ] = useState(group.name);

    let tableItems = items.getItems(app.id, group.id);

    useEffect(editing => {
        if (editing) {
            return;
        }

        if (editGroupName != group) {
            group.updateName(editGroupName);
        }
    }, [edit]);

    function render(type) {
        if (type == 'SVG') {
            return renderSVG(cardRef.current);
        } else if (type == 'PNG') {
            return renderPNG(cardRef.current);
        } else {
            return Promise.reject('Image type must be SVG on PNG')
        }
    }

    function exportImage(type) {
        let e = new ShowHideElement([
            menuRef.current, addItemRef.current
        ]);
        e.hide();

        render(type)
            .then(imageData => {
                e.show();

                imageData.filename = `cheatsheet-${app.name}-${group.name}`;
                imageModal.setImageData(imageData);
            })
            .catch(e.show())
    }

    function exportMD() {
        // todo
    }

    return (
        <div className="shortcut-card" key={'shortcut-card-' + group.id} ref={cardRef}>
            <Card>
                <CardHeader>
                    <div className="dropdown float-right" ref={menuRef}>
                        <Button 
                            className="mx-1"
                            primary={!edit}
                            success={edit}
                            small={true}
                            onClick={() => setEdit(!edit)}>
                                {edit
                                    ? <i className="icon icon-check"></i>
                                    : <i className="icon icon-edit"></i>}
                        </Button>
                        <Button className="dropdown-toggle" primary={true} small={true}>
                            <i className="icon icon-download"></i>
                        </Button>
                        <ul className="menu export-menu">
                            <li className="menu-item">
                                <a onClick={() => exportImage('PNG')}>
                                    <i className="icon icon-photo"></i>
                                    <span className="mx-1">PNG</span>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a onClick={() => exportImage('SVG')}>
                                    <i className="icon icon-resize-horiz"></i>
                                    <span className="mx-1">SVG</span>
                                </a>
                            </li>
                            <li className="menu-item">
                                <a onClick={() => exportMD()}>
                                    <i className="icon icon-bookmark"></i>
                                    <span className="mx-1">MD</span>
                                </a>
                            </li>
                      </ul>
                    </div>
                    <CardTitle className="h5">
                        {edit ? <input type="text" value={editGroupName} onChange={e => setEditGroupName(e.target.value)} /> : group.name}
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <ShortcutTable items={tableItems} editing={edit}/>
                    <div className="row-new-cmd text-center" ref={addItemRef}>
                        <a onClick={() => items.addItem(app, group)} className="btn btn-link">+</a>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
});

export default ShortcutCard;