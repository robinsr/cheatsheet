import { isEmpty } from 'lodash';
import { getParent, types } from 'mobx-state-tree';
import MobxCategoryItem from 'store/app/CategoryItem';

const EDIT = '__edit__';

const MobxEditableShortcutItem = types
    .model('MobxEditableShortcutItem', {
        id: types.identifier,
        label: types.maybeNull(types.string),
        command: types.maybeNull(types.string),
        commandDefault: types.maybeNull(types.string),
        enableSecondary: types.maybeNull(types.boolean),
        secondary: types.maybeNull(types.string),
        secondaryDefault: types.maybeNull(types.string),
        category: types.maybeNull(types.reference(MobxCategoryItem))
    })
    .actions(self => ({
        updateLabel(val) {
            self.label = val;
        },
        updateCommand(val) {
            self.command = val;
        },
        updateSecondary(val) {
            self.secondary = val;
        },
        changeCategory(category) {
            self.category = category;
        },
        updateEnableSecondary(val) {
            self.enableSecondary = val;

            if (val === false) {
                self.secondary = null;
            }
        }
    }))

const MobxEditItemStore = types
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
                    throw new Error('Cannot create item outside of app store', target);
                }

                let targetApp = root.apps.item(target.app.id);

                if (!targetApp) {
                    throw new Error('Cannot create item outside of app store', target);
                }

                self.categoryOptions = targetApp.itemGroups;

                let editItem = {
                    id: target.id + EDIT,
                    label: target.label,
                    command: target.command,
                    commandDefault: target.command,
                    secondary: target.secondary,
                    secondaryDefault: target.secondary,
                    enableSecondary: !isEmpty(target.secondary),
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

                let { label, command, secondary, category } = self.editItem;

                targetItem.update('label', label);
                targetItem.update('command', command);
                targetItem.update('secondary', secondary);

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

export default MobxEditItemStore;
