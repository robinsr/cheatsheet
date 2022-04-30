import { getParent, getType, types } from 'mobx-state-tree';
import { MobxShortcutItem, } from "context/models/ShortcutItem";
import { MobxAppItem, MobxCategoryItem } from "context/models/AppStore";

const EDIT = '__edit__';

export const MobxEditableShortcutItem = types
    .model('MobxEditableShortcutItem', {
        id: types.identifier,
        label: types.maybeNull(types.string),
        command: types.maybeNull(types.string),
        category: types.maybeNull(types.reference(MobxCategoryItem))
    })
    .actions(self => ({
        updateLabel(val) {
            self.label = val;
        },
        updateCommand(val) {
            self.command = val;
        },
        changeCategory(category) {
            self.category = category;
        },
    }))

export const MobxEditItemStore = types
    .model('MobxEditItemStore', {
        editItem: types.maybeNull(MobxEditableShortcutItem),
        categoryOptions: types.array(types.reference(MobxCategoryItem))
    })
    .actions(self => {
        let targetItem;

        return {
            setEditItem(target) {
                let root = getParent(self);

                if (typeof target === 'string') {
                    target = root.apps.find(target);
                }

                if (!target) {
                    throw new Error('Cannot edit item:', target);
                }

                if (!target.app) {
                    throw new Error('Cannot create item outside of app context', target);
                }

                let targetApp = root.apps.item(target.app.id);

                if (!targetApp) {
                    throw new Error('Cannot create item outside of app context', target);
                }

                self.categoryOptions = targetApp.itemGroups;

                let editItem = {
                    id: target.id + EDIT,
                    label: target.label,
                    command: target.command,
                    category: target.category
                };

                self.editItem = MobxEditableShortcutItem.create(editItem);

                // store reference in volatile state
                targetItem = target;
            },
            saveEditItem() {
                let root = getParent(self);

                if (!targetItem) {
                    throw new Error('Target item was lost before save');
                }

                let { label, command, category } = self.editItem;

                targetItem.update('label', label);
                targetItem.update('command', command);

                if (category !== targetItem.category) {
                    targetItem = targetItem.category.removeItem(targetItem.id);
                    category.acceptItem(targetItem);
                }

                self.clearEditItem();
            },
            clearEditItem() {
                self.editItem = null;
                self.categoryOptions = [];
                targetItem = null;
            }
        }
    });