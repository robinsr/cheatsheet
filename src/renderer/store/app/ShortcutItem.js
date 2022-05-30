import { getParent, getPath, types } from 'mobx-state-tree';
import { omit as _omit } from 'lodash';
import { MobxShortcut } from 'store/types/Shortcut';
import { ITEM, EDIT_ITEM } from 'utils/paths';

/**
 * @class IShortcutItemViews
 * @param {IShortcutItem} self
 * @constructor
 */
const ShortcutItemViews = self => ({
    /**
     * @name ShortcutItemActions.app
     * @returns {IAppStore}
     */
    get app() {
        return getParent(self, 4);
    },
    /**
     * @name ShortcutItemActions.category
     * @returns {ICategoryItem}
     */
    get category() {
        return getParent(self, 2)
        // return category;
    },
    get next() {
        return self.category.next(self.id);
    },
    get prev() {
        return self.category.prev(self.id);
    },

    link(target) {
        return ITEM.link(self.app.id, self.id);
    },

    get path() {
        // let path = self.app.path;
        // let hash = ITEM.link({ itemId: self.id });

        // return path + hash;
        return getPath(self);
    },

    editLink(field) {
        // let path = self.app.path;
        // let hash = EDIT_ITEM.link({ field, itemId: self.id });

        return getPath(self) + '/edit' + (field ? `/field=${field}` : '');
    },

    get markdown() {
        return `|${self.label}|${self.command}|`; // todo; complete md string
    },

    getIndex() {
        return self.category.index(self.id);
    }
});

/**
 * @class IShortcutItemActions
 * @param {IShortcutItem} self
 * @constructor
 */
const ShortcutItemActions = self => {
    let ref = null; // will store a reference to dom ref for data/image purposes

    return {
        /**
         * @memberOf IShortcutItem
         * @name IShortcutItemActions#setRef
         * @param reactRef
         */
        setRef: (reactRef) => {
            ref = reactRef;
        },
        /**
         * @memberOf IShortcutItem
         * @name IShortcutItemActions#update
         * @param {string} attr - attribute name
         * @param {string} value - value to set
         */
        update: (attr, value) => {
            self[attr] = value;
        },
        beforeDestroy() {
            console.log('I am being destroyed! ', self.label, self.id)
        },
        select(bool) {
            self.selected = bool;
        }
    }
};

/**
 * @typedef {object} IShortcutItemProps
 * @property {string} id
 * @property {string} label
 * @property {string} command
 * @property {string} secondary
 * @property {ICategoryItem} category
 * @property {IAppItem} app
 * @property {string} link
 */
const BaseMobxShortcutItem = types
    .model('MobxShortcutItem', {
        id: types.identifier,
        label: types.maybeNull(types.string),
        command: types.maybeNull(MobxShortcut),
        secondary: types.maybeNull(MobxShortcut),
        selected: types.optional(types.boolean, false)
    })
    .views(ShortcutItemViews)
    .actions(ShortcutItemActions);

const MobxShortcutItem = types.snapshotProcessor(BaseMobxShortcutItem, {
        preProcessor(savedSnapshot) {
            return savedSnapshot;
        },
        postProcessor(snapshot) {
            return _omit(snapshot, ['selected']);
        }
})

export default MobxShortcutItem;

/**
 * @typedef { IShortcutItemProps, IShortcutItemViews, IShortcutItemActions } IShortcutItem
 */
