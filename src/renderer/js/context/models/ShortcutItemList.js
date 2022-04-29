import {applySnapshot, clone, detach, getSnapshot, protect, types, unprotect} from 'mobx-state-tree';
import { uniq as _uniq, pick as _pick } from 'lodash';

import { MobxShortcutItem } from "context/models/ShortcutItem";
import { newUuid } from "utils/uuid";

const EDIT = '__edit__';

export const MobxShortcutItemList = types
    .model('MobxItemList', {
        itemList: types.array(MobxShortcutItem),
        editItem: types.maybeNull(MobxShortcutItem)
    })
    .actions(self => ({
        setEditItem(id) {
            if (!id) {
                throw new Error('Cannot edit item with no ID')
            } else {
                let target = self.itemList.find(i => i.id === id);
                self.editItem = MobxShortcutItem.create(Object.assign(
                    { id: id + EDIT }, _pick(target, [ 'app', 'label', 'category', 'command' ])
                ))
            }
        },
        clearEditItem() {
            self.itemList = self.itemList.filter(i => i.id !== self.editItem.id); 
            self.editItem = null; // TODO: destroy() ?
        },
        saveEditItem() {
            let id = self.editItem.id.replace(EDIT, '');
            let target = self.itemList.find(i => i.id === id);

            Object.assign(target, _pick(self.editItem, [ 'label', 'category', 'command' ]))

            self.editItem = null;
        },
        addItem(app, category) {
            self.itemList.push({ id: newUuid(), app, category, label: 'New Shortcut', command: 'Space' });
        },
        removeItem(id) {
            let item = self.itemList.find(i => i.id === id);
            self.itemList.splice(self.itemList.indexOf(item), 1);
        },
        removeItemsByCategory(id) {
            self.itemList = self.itemList.filter(i => i.category.id !== id);
        },

        getNext(id) {
            let a = self.itemList;
            let t = a.find(i => i.id === id);
            let f = a.filter(i => i.category.id === t.category.id);
            let t0 = f[f.indexOf(t) + 1];

            return t0 || null;
        },

        getPrev(id) {
            let a = self.itemList;
            let t = a.find(i => i.id === id);
            let f = a.filter(i => i.category.id === t.category.id);
            let t0 = f[f.indexOf(t) - 1];

            return t0 || null;
        },

        swapProperties(id1, id2) {
            let t1 = self.itemList.find(i => i.id === id1);
            let t2 = self.itemList.find(i => i.id === id2);
            let tmp = _pick(t1, [ 'label', 'category', 'command' ])
            Object.assign(t1, _pick(t2, [ 'label', 'category', 'command' ]) )
            Object.assign(t2, tmp);
        },

        moveItemUp(id) {
            let prev = self.getPrev(id);

            if (prev) {
                self.swapProperties(id, prev.id);
            }
        },
        moveItemDown(id) {
            let next = self.getNext(id);

            if (next) {
                self.swapProperties(id, next.id);
            }
        }
    }))
    .views(self => ({
        isEmpty() {
            return self.itemList.length === 0;
        },
        get itemGroups() {
            return _uniq(self.itemList.map(i => i.category)); 
        },
        getItems(appId, groupId) {
            return self.itemList.filter(i => i.app.id === appId && i.category.id === groupId)
        },
        getItemsByGroup(id) {
            return self.itemList.filter(i => i.category === id) || null
        },
        find(query) {
            if (['', ' '].includes(query)) {
                return []
            } else {
                return self.itemList.filter(i => i.label.toLowerCase().includes(query)).slice(0, 5) || []
            }
        }
    }))