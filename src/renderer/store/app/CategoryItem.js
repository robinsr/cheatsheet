import { detach, getParent, getType, types } from 'mobx-state-tree';
import { getLogger, newUuid, increment, decrement } from 'utils';
import MobxShortcutItem from './ShortcutItem';
import Optional from 'optional-js';

const log = getLogger('Store/CategoryItem');

const MobxCategoryItem = types
    .model({
        id: types.identifier,
        name: types.string,
        items: types.array(MobxShortcutItem)
    })
    .views(self => ({
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
        }
    }))
    .actions(self => ({
        updateName(name) {
            self.name = name
        },
        addItem() {
            self.items.push(MobxShortcutItem.create({
                id: newUuid(), label: 'New Shortcut', command: 'Space'
            }));
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

            let tmp1 = detach(item1);
            let tmp2 = detach(item2);

            self.items.splice(i1, 0, tmp2);
            self.items.splice(i2, 0, tmp1);
        }
    }))

export default MobxCategoryItem;