import { detach, getParent, getPath, types } from 'mobx-state-tree';
import { getLogger, newUuid } from 'utils';
import ShortcutItem from './ShortcutItem';
import MobxShortcutItem from './ShortcutItem';
import MobxCollection from 'store/types/Collection';

const log = getLogger('Store/CategoryItem');

/**
 * @class CategoryItemViews
 * @implements CollectionStore.<IShortcutItem>
 * @param {ICategoryItem} self
 * @constructor
 */
export const CategoryItemViews = (self) => ({
    get path() {
        return getPath(self);
    },
    /**
     * @type {number} - number of items selected (for deletion)
     */
    get numSelected() {
        return self.items.filter(i => i.selected).length;
    }
});

/**
 * @class CategoryItemActions
 * @constructor
 * @param {ICategoryItem} self
 */
export const CategoryItemActions = (self) => ({
    updateName(name) {
        self.name = name
    },
    addItem(label='New Shortcut', afterItem) {
        let id = newUuid();
        let index = self.items.length;
        let newItem = MobxShortcutItem.create({
            id, label, command: ''
        });

        if (afterItem) {
            index = self.index(afterItem)
        }

        self.items.splice(index, 0, newItem)

        return newItem;
    },
    removeItem(id) {
        // self.items.splice(self.index(id), 1);
        return detach(self.items[self.index(id)]);
    },
    removeSelected() {
       self.items = self.items.filter(i => !i.selected);
    },
    unselectItems() {
        self.items.filter(i => i.selected).forEach(i => i.select(false));
    },
    acceptItem(item) {
        self.items.push(item);
    },
    moveItemDown(id) {
        if (!id) return null;
        let next = self.next(id);

        if (next) {
            self.swapItems(self.get(id), next);
        }
    },
    moveItemUp(id) {
        if (!id) return null;
        let prev = self.prev(id);

        if (prev) {
            self.swapItems(self.get(id), prev)
        }
    },
    swapItems(item1, item2) {
        if (item1.id === item2.id) {
            return;
        }

        let i1 = self.index(item1.id);
        let i2 = self.index(item2.id);

        if (item1.category === item2.category) {
            let tmp1 = detach(item1);
            let tmp2 = detach(item2);

            self.items.splice(i1, 0, tmp2);
            self.items.splice(i2, 0, tmp1);
        } else {
            // TODO; swap items between categories?
            // let tItem = item1.category === self ? item1 : item2
        }
    }
});

const collectionConfig = {
    orElseNext: (self) => getParent(self, 2).next(self.id).first,
    orElsePrev: (self) => getParent(self, 2).prev(self.id).last
}

/**
 * @typedef {object} ICategoryItemProps
 * @property {string} id
 * @property {string} name
 * @property {IShortcutItem[]} items
 */
const MobxCategoryItem = types
    .model({
        id: types.identifier,
        name: types.string
    })
    .views(CategoryItemViews)
    .actions(CategoryItemActions)

export default types.compose(MobxCollection(ShortcutItem, collectionConfig), MobxCategoryItem).named('CategoryItem');

/**
 * @typedef  {ICategoryItemProps, CategoryItemActions, CategoryItemViews } ICategoryItem
 */
