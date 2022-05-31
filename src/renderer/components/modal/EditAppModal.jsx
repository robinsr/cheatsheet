import { clone } from 'mobx-state-tree';
import React, { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { HiOutlineTrash } from 'react-icons/hi';
import { useMst } from 'store';
import { Button, CursorFocusableInput } from 'components/inputs';
import { MobxEditAppItem } from 'store/app/AppItem';
import { EDIT_APP } from 'utils/paths';
import useHistory from '../../hooks/useHistory';
import useParams from '../../hooks/useParams';
import Modal from './Modal';
import Dialog from 'components/modal/Dialog';
import KeyScope from 'components/providers/KeyScope';
import { getLogger } from 'utils';

const log = getLogger('JSX/EditAppModal');

const EditAppModal = observer(() => {
    let { apps } = useMst();
    const { back } = useHistory();
    const [ matches, { appIndex } ] = useParams(EDIT_APP);
    const [ willDelete, setWillDelete ] = useState(false);

    const [ app, editApp ] = useMemo(() => {
        if (!matches) {
            return [ null ]
        }

        let original = apps.at(appIndex);
        let { name, windowName, id } = original;

        let copy = Object.assign({}, { name, windowName }, {
            id: 'EDIT-' + id
        });

        let editApp = MobxEditAppItem.create(copy)

        return [ original, editApp ];
    }, [ matches ]);

    const deleteApp = () => {
        setWillDelete(false);
        log.error('Deleting app', app.id);
        apps.removeApp(app.id);
    }

    const save = () => {
        [ 'name', 'windowName' ].forEach(field => {
            app.update(field, editApp[field]);
        });

        back();
    }

    const onAction = (evt) => {
      if (evt.action === 'EDIT_APP:SAVE_EDIT_APP') {
          save();
      }
    }

    if (!editApp) {
        return null;
    }

    let { name, windowName, update } = editApp;

    return (
        <KeyScope scope={'EDIT_APP'} prevScope={'APP'} onAction={onAction}>
             <Modal
                type="small"
                name="edit-app-modal"
                title={'Edit ' + app.name}
                active={true}
                onClose={back}
                closeButton={false}
                content={
                     <div className="content">
                         <div className="form-group">
                             <label className="form-label">App name:</label>
                             <CursorFocusableInput pattern="#field=name"
                                 type="text"
                                 placeholder="Shortcut name"
                                 value={name}
                                 onChange={e => update('name', e.target.value)}
                                 tabIndex="0"
                             />
                         </div>
                         <div className="form-group">
                             <label className="form-label">Window name:</label>
                             <CursorFocusableInput pattern="#field=window"
                                 type="text"
                                 placeholder="Window name"
                                 value={windowName}
                                 onChange={e => update('windowName', e.target.value)}
                                 tabIndex="0"
                             />
                         </div>
                         {willDelete &&
                            <Dialog message={`Delete ${name}?`}
                                    onCancel={() => setWillDelete(false)}
                                    onConfirm={deleteApp}
                            />
                         }
                     </div>
                }
                footer={
                    <div>
                        <Button danger left svg onClick={() => setWillDelete(true)}>
                            <HiOutlineTrash/>
                        </Button>
                        <Button primary type="button" className="mx-1" onClick={save}>Done</Button>
                    </div>
                }/>
        </KeyScope>
    );
});

export default EditAppModal
