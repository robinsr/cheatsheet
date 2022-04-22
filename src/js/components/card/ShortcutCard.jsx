import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Card, CardHeader, CardTitle, CardBody } from 'spectre-react';

import render from 'utils/canvas_renderer';
import { ShowHideElement } from 'utils/dom';
import { useMst } from 'context/Store';

import ShortcutTable from './ShortcutTable';


const ShortcutCard = observer(({ group }) => {
    let { items, png } = useMst();

    let cardRef = useRef(null);
    let menuRef = useRef(null);
    let addItemRef = useRef(null);

    let [ edit, setEdit ] = useState(false);
    let [ editGroupName, setEditGroupName ] = useState(group);

    useEffect(editing => {
        if (editing) {
            return;
        }

        if (editGroupName != group) {
            console.log(editGroupName, group)
        }
    }, [edit]);

    function exportPNG() {
        let e = new ShowHideElement([
            menuRef.current, addItemRef.current
        ]);
        e.hide();

        render(cardRef.current)
            .then(imageData => {
                e.show();
                png.setImageData(imageData);
            })
            .catch(e.show())
    }

    function exportMD() {
        // todo
    }

    return (
        <div className="shortcut-card" key={'shortcut-card-' + group} ref={cardRef}>
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
                                <a onClick={() => exportPNG()}>PNG</a>
                            </li>
                            <li className="menu-item">
                                <a onClick={() => exportMD()}>Markdown</a>
                            </li>
                      </ul>
                    </div>
                    <CardTitle className="h5">
                        {edit ? <input type="text" value={editGroupName} onChange={e => setEditGroupName(e.target.value)} /> : group}
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <ShortcutTable items={items.getItemsByGroup(group)} editing={edit}/>
                    <div className="row-new-cmd text-center" ref={addItemRef}>
                        <a onClick={() => items.addItem('quiver', group)} className="btn btn-link">+</a>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
});

export default ShortcutCard;
