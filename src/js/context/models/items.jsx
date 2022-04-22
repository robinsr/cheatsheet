import { types } from 'mobx-state-tree';
import { uniq as _uniq } from 'lodash';
import short from 'short-uuid';

const uuid = short();


export const MobxItem = types
    .model('MobxItem', {
        id: types.identifier,
        app: types.string,
        category: types.string,
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

        function updateCommand(newCommand) {
            self.command = newCommand; // todo; validate
        }

        function updateName(newName) {
            self.label = newName;
        }

        // todo: can this be a 'view'?
        function getDataImage() {
            return new Promise((res, rej) => {
                render(ref.current).then(imageData => resolve(imageData));
            });
        }

        return { setRef, updateCommand, updateName, getDataImage }
    });


export const MobxEditItem = types.maybeNull(
    types.reference(MobxItem, {
        get(id) {
            return parent.items.find(i => i.id === id) || null;
        },
        set(mobxItem) {
            return mobxItem.id;
        }
    }));


export const MobxItemList = types
    .model('MobxItemList', {
        itemList: types.array(MobxItem),
        editItem: MobxEditItem
    })
    .actions(self => ({
        setEditItem(id) {
            self.editItem = id;
        },
        clearEditItem() {
            self.editItem = undefined;
        },
        addItem(app, category) {
            self.itemList.push({ id: uuid.new(), app, category, label: 'New Shortcut', command: 'Space' });
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