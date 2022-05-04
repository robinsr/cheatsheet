import { detach, getParent, getPath, getType, types } from 'mobx-state-tree';
import { getLogger, newUuid, increment, decrement } from 'utils';
import MobxShortcutItem from './ShortcutItem';
import Optional from 'optional-js';

const log = getLogger('Store/CategoryItem');

export const CategoryItemViews = (self) => ({
    item(id) {
        if (!id) throw new Error('No ID supplied');

        return Optional.ofNullable(self.items.find(i => i.id === id))
            .orElseThrow(() => new Error(`Item '${id}' not found in category ${self.name}`));
    },
    index(id) {
        if (!id) throw new Error('No ID supplied');

        return Optional.ofNullable(self.items.findIndex(i => i.id === id))
            .orElseThrow(() => new Error(`Item '${id}' not found in category ${self.name}`));
    },
    at(i) {
        return self.items[i];
    },
    next(id) {
        return Optional.of(id)
            .map(self.index).map(increment).map(self.at)
            .orElseGet(() => getParent(self, 2).next(self.id).first);
    },
    prev(id) {
        return Optional.of(id)
            .map(self.index).map(decrement).map(self.at)
            .orElseGet(() => getParent(self, 2).prev(self.id).last);
    },
    get first() {
        return self.items[0];
    },
    get last() {
        return self.items[self.items.length - 1];
    },
    get path() {
        return getPath(self);
    }
})

export const CategoryItemActions = (self) => ({
    updateName(name) {
        self.name = name
    },
    addItem(label) {
        let id = newUuid();
        self.items.push(MobxShortcutItem.create({
            id, label: label || 'New Shortcut', command: ''
        }));
        return id;
    },
    removeItem(id) {
        // self.items.splice(self.index(id), 1);
        return detach(self.items[self.index(id)]);
    },
    acceptItem(item) {
        if (getType(item) === MobxShortcutItem) {
            self.items.push(item);
        } else {
            throw new Error(`Cannot accept type ${getType(item)}`);
        }
    },
    moveItemDown(id) {
        if (!id) return null;
        let next = self.next(id);

        if (next) {
            self.swapItems(self.item(id), next);
        }
    },
    moveItemUp(id) {
        if (!id) return null;
        let prev = self.prev(id);

        if (prev) {
            self.swapItems(self.item(id), prev)
        }
    },
    swapItems(item1, item2) {
        let i1 = self.index(item1.id);
        let i2 = self.index(item2.id);

        if (item1.category === item2.category) {
            let tmp1 = detach(item1);
            let tmp2 = detach(item2);

            self.items.splice(i1, 0, tmp2);
            self.items.splice(i2, 0, tmp1);
        } else {
            // TODO; swap items between categories?
            let tItem = item1.category === self ? item1 : item2
        }
    }
});

const MobxCategoryItem = types
    .model({
        id: types.identifier,
        name: types.string,
        items: types.array(MobxShortcutItem)
    })
    .views(CategoryItemViews)
    .actions(CategoryItemActions)

export default MobxCategoryItem;