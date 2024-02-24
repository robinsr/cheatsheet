import { types } from 'mobx-state-tree';
import { getLogger } from 'utils';
import { MobxShortcut } from 'store/types/Shortcut';

const log = getLogger('EditItemStore', 'DEBUG');


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


export const MobxEditableShortcutItem = types
.model('MobxEditableShortcutItem', {
    id: types.identifier,
    label: types.maybeNull(types.string),
    command: types.maybeNull(MobxShortcut),
    commandDefault: types.maybeNull(MobxShortcut),
    enableSecondary: types.maybeNull(types.boolean),
    secondary: types.maybeNull(MobxShortcut),
    secondaryDefault: types.maybeNull(MobxShortcut),
    categoryId: types.string
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
    changeCategory(categoryId) {
        self.categoryId = categoryId;
    },
    updateEnableSecondary(val) {
        self.enableSecondary = val;

        if (val === false) {
            self.secondary = null;
        }
    }
}));

