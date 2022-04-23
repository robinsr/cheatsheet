import { types, getSnapshot } from 'mobx-state-tree';
import { observable } from 'mobx';
import { uniq as _uniq, pick as _pick } from 'lodash';
import short from 'short-uuid';

const uuid = short();

const EDIT = '__edit__';


export const MobxItem = types
    .model('MobxItem', {
        id: types.identifier,
        app: types.string,
        category: types.maybeNull(types.string),
        label: types.maybeNull(types.string),
        command: types.maybeNull(types.string)
    })
    .views(self => {
        return {
            get markdown() {
                return `|${self.label}|${self.command}|`; // todo; complete md string
            }
        }
    })
    .actions(self => {
        let ref = null; // will store a reference to dom ref for data/image purposes

        function setRef(reactRef) {
            ref = reactRef;
        }

        function update(attr, value) {
            self[attr] = value;
        }

        // todo: can this be a 'view'?
        function getDataImage() {
            return new Promise((res, rej) => {
                render(ref.current).then(imageData => resolve(imageData));
            });
        }

        return { setRef, update, getDataImage }
    });


export const MobxEditItem = types.maybeNull(
    types.reference(MobxItem, {
        get(id, parent) {
            return parent.itemList.find(i => i.id === id) || null;
        },
        set(mobxItem) {
            return mobxItem.id;
        }
    }));


export const MobxItemList = types
    .model('MobxItemList', {
        itemList: types.array(MobxItem),
        editItem: types.maybeNull(MobxItem)
    })
    .actions(self => ({
        setEditItem(id) {
            if (!id) {
                throw new Error('Cannot edit item with no ID')
            } else {
                let target = self.itemList.find(i => i.id === id);
                self.editItem = MobxItem.create(Object.assign(
                    { id: id + EDIT }, _pick(target, [ 'app', 'label', 'category', 'command' ])
                ))
            }
        },
        clearEditItem() {
            self.itemList = self.itemList.filter(i => i.id !== self.editItem.id); 
            self.editItem = null;
        },
        saveEditItem() {
            let id = self.editItem.id.replace(EDIT, '');
            let target = self.itemList.find(i => i.id === id);

            Object.assign(target, _pick(self.editItem, [ 'label', 'category', 'command' ]))

            self.editItem = null;
        },
        addItem(app, category) {
            self.itemList.push({ id: uuid.new(), app, category, label: 'New Shortcut', command: 'Space' });
        },
        removeItem(id) {
            self.itemList = self.itemList.filter(i => i.id !== id);
        }
    }))
    .views(self => ({
        get itemGroups() {
            return _uniq(self.itemList.map(i => i.category)); 
        },
        getItemsByGroup(group) {
            return self.itemList.filter(i => i.category == group) || null
        }
    }))