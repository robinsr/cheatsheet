import { isEmpty } from 'lodash';
import { isMatch } from 'matcher';
import { addMiddleware, detach, getParent, getRoot, getSnapshot, resolvePath, types, unprotect } from 'mobx-state-tree';
import { getLogger } from 'utils';
import HistoryTransition from 'store/types/Transition';
import MobxCategoryItem from 'store/app/CategoryItem';
import { MobxShortcut } from 'store/types/Shortcut';

const log = getLogger('EditItemStore');

const EDIT = '__edit__';

/**
 * @typedef {object} EditableShortcutItem
 * @property id {string}
 * @property label {string}
 * @property command {string}
 * @property commandDefault {string}
 * @property enableSecondary {string}
 * @property secondary {string}
 * @property secondaryDefault {string}
 * @property category {string}
 */


const MobxEditableShortcutItem = types
.model('MobxEditableShortcutItem', {
    id: types.identifier,
    label: types.maybeNull(types.string),
    command: types.maybeNull(MobxShortcut),
    commandDefault: types.maybeNull(MobxShortcut),
    enableSecondary: types.maybeNull(types.boolean),
    secondary: types.maybeNull(MobxShortcut),
    secondaryDefault: types.maybeNull(MobxShortcut),
    category: types.maybeNull(types.reference(MobxCategoryItem))
})
.views(self => ({
    get originalId() {
        return self.id.replace(EDIT, '');
    }
}))
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
}));

const NavToEditItem = HistoryTransition.create({
    from: '*',
    to: ''
})


/**
 * @class EditItemStoreActions
 * @constructor
 * @param {IEditStore} self
 */
const EditItemStoreActions = self => {
    /** @type {IShortcutItem} */
    let targetItem;

    const afterCreate = () => {
        console.log('Creating middleware in EditItemStore');

        /** @type {IRootStore} **/
        const root = getRoot(self);

        addMiddleware(root.history, (call, next, abort) => {
            if (call.name === 'push' && isMatch(call.args[0], '#/*/items/*/edit*')) {
                let item = resolvePath(root, root.history.hash.replace('#', ''));

                if (item) {
                    self.setEditItem(item);
                } else {
                    return abort('No matching item found to edit');
                }
            }

            next(call);
        })
    }

    const setEditItem = target => {
        /** @type {IRootStore} */
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

        let targetApp = root.apps.get(target.app.id);

        if (!targetApp) {
            throw new Error('Cannot create item outside of app store', target);
        }

        self.categoryOptions = targetApp.itemGroups;

        let command = isEmpty(target.command) ? '' : getSnapshot(target.command);
        let secondary = isEmpty(target.secondary) ? '' : getSnapshot(target.secondary);

        self.editItem = MobxEditableShortcutItem.create({
            id: target.id + EDIT,
            label: target.label,
            category: target.category,
            command: MobxShortcut.create(command),
            commandDefault: MobxShortcut.create(command),
            secondary: MobxShortcut.create(secondary),
            secondaryDefault: MobxShortcut.create(secondary),
            enableSecondary: !isEmpty(secondary)
        });

        // store reference in volatile state
        targetItem = target;

        return self.editItem;
    };

    const saveEditItem = () => {
        if (!targetItem) {
            throw new Error('Target item was lost before save');
        }

        log.debug('Saving item', self.editItem);

        let { label, category, command, secondary, enableSecondary } = self.editItem;

        targetItem.update('label', label);
        targetItem.update('command', detach(command));

        if (enableSecondary) {
            targetItem.update('secondary', detach(secondary));
        } else {
            targetItem.update('secondary', null);
        }

        if (category !== targetItem.category) {
            let transferItem = targetItem.category.removeItem(targetItem.id);
            category.acceptItem(transferItem);
        }

        clearEditItem();
    };

    const clearEditItem = () => {
        self.editItem = null;
        self.categoryOptions = [];
        targetItem = null;
    };

    return { afterCreate, setEditItem, saveEditItem, clearEditItem };
}


/**
 * @typedef {object} EditStoreProps
 * @property {EditableShortcutItem} editItem
 * @property {ICategoryItem[]} categoryItems
 */

const MobxEditItemStore = types
    .model('MobxEditItemStore', {
        editItem: types.maybeNull(MobxEditableShortcutItem),
        categoryOptions: types.array(types.reference(MobxCategoryItem))
    })
    .actions(EditItemStoreActions);

MobxEditItemStore.__defaults = {
    editItem: null,
    categoryOptions: []
};

export default MobxEditItemStore;

/**
 * @typedef {EditStoreProps, EditItemStoreActions} IEditStore
 */
