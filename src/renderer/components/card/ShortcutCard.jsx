import './ShortcutCard.scss';

import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { renderPNG, renderSVG } from 'utils/canvas_renderer.js';
import { ShowHideElement } from 'utils/dom.js';
import { useMst } from 'store';

import ShortcutTable from './ShortcutTable.jsx';


const ShortcutCard = observer(({ 
    group, app
}) => {
    let { items, imageModal, removeCategory } = useMst();

    let cardRef = useRef(null);
    let menuRef = useRef(null);
    let addItemRef = useRef(null);

    let [ edit, setEdit ] = useState(false);
    let [ editGroupName, setEditGroupName ] = useState(group.name);

    useEffect(editing => {
        if (editing) {
            return;
        }

        if (editGroupName !== group) {
            group.updateName(editGroupName);
        }
    }, [edit]);

    function render(type) {
        if (type === 'SVG') {
            return renderSVG(cardRef.current);
        } else if (type === 'PNG') {
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

    function deleteCategory() {
        removeCategory(app.id, group.id);
    }

    function exportMD() {
        // todo
    }

    return (
        <div className="shortcut-card" key={'shortcut-card-' + group.id} ref={cardRef}>
            <div className="card">
                <div className="card-header">
                    <div className="dropdown float-right" ref={menuRef}>
                        <button
                            className={'btn btn-sm mx-1 ' + (edit ? 'btn-success' : 'btn-primary')}
                            onClick={() => setEdit(!edit)}
                            tabIndex={-1}>
                                {edit
                                    ? <i className="icon icon-check"></i>
                                    : <i className="icon icon-edit"></i>}
                        </button>
                        {edit ?
                             <button
                                className="btn btn-error btn-sm"
                                onClick={deleteCategory}
                                tabIndex={-1}>
                                <i className="icon icon-delete"></i>
                            </button>
                            : <span>
                                <button
                                    className="btn btn-primary btn-sm dropdown-toggle"
                                    tabIndex={-1}>
                                    <i className="icon icon-download"></i>
                                </button>
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
                            </span>
                          }
                    </div>
                    <div className="card-title h5">
                        {edit ? <input type="text" value={editGroupName} onChange={e => setEditGroupName(e.target.value)} /> : group.name}
                    </div>
                </div>
                <div className="card-body">
                    <ShortcutTable group={group} editing={edit}/>
                    <div className="row-new-cmd text-center" ref={addItemRef}>
                        <a onClick={() => group.addItem()} className="btn btn-link">+</a>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ShortcutCard;
