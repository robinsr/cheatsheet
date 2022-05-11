import { getParent, getPath, types } from 'mobx-state-tree';
import { omit as _omit } from 'lodash';

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

    get link() {
        return `/apps/${self.app.id}/category/${self.category.id}/item/${self.id}`;
    },

    get markdown() {
        return `|${self.label}|${self.command}|`; // todo; complete md string
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
        getDataImage: () => {
            // TODO: fix this
            //return new Promise((resolve, rej) => {
                //render(ref.current).then(imageData => resolve(imageData));
            //});
        },
        beforeDestroy: () => {
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
        command: types.maybeNull(types.string),
        secondary: types.maybeNull(types.string),
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
