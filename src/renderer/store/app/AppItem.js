import { getPath, types } from 'mobx-state-tree';
import { pick as _pick } from 'lodash';
import { newUuid } from 'utils'
import MobxCategoryItem from './CategoryItem';
import MobxCollection from 'store/types/Collection';

/**
 * Defines actions for AppStore
 * @class IAppItemViews
 * @param {IAppItem} self
 * @constructor
 * @implements CollectionStore.<ICategoryItem>
 */
const AppItemViews = self => ({
    query(term) {
        return self.allItems.filter(i => i.label.toLowerCase().includes(term)) || []
    },
    get itemGroups() {
        return self.categories.map(c => c.id);
    },
    get isEmpty() {
        return self.categories
            .map(c => c.items.length)
            .reduce((prev, cur) => prev + cur, 0) === 0;
    },
    get allItems() {
        return self.categories
            .map(c => c.items)
            .flatMap(x => x);
    },
    get topItem() {
        return self.allItems[0];
    },
    get bottomItem() {
        return self.allItems[self.allItems.length - 1];
    },
    get path() {
        return getPath(self);
    }
});

/**
 * Defines actions for AppStore
 * @class IAppItemActions
 * @param {IAppItem} self
 * @constructor
 */
const AppItemActions = self => ({
    update(attr, value) {
        self[attr] = value;
    },
    addCategory(name='New Category') {
        let newCategory = MobxCategoryItem.create({
            id: newUuid(), name
        });
        self.categories.unshift(newCategory);
        return newCategory;
    },
    removeCategory(id) {
        self.categories = self.categories.filter(i => i.id !== id);
    }
})


/**
 * @typedef {object} IAppItemProps
 * @property {string} id
 * @property {string} name
 * @property {ICategoryItem[]} categories
 * @property {string} windowName
 */
const MobxAppItem = types
    .model({
        id: types.identifier,
        name: types.string,
        categories: types.array(MobxCategoryItem),
        windowName: types.maybeNull(types.string)
    })
    .views(AppItemViews)
    .actions(AppItemActions)

export default types.compose(MobxCollection(MobxCategoryItem, { propName: 'categories' }), MobxAppItem).named('MobxAppItem')

/**
 * @typedef { IAppItemProps, IAppItemActions, IAppItemViews } IAppItem
 */


export const MobxEditAppItem = MobxAppItem.extend(self => {
    let { name, windowName } = self;

    return {
        views: {
            get defaultName() {
                return name;
            },
            get defaultWindow() {
                return windowName;
            }
        }
    }
})