import { types } from 'mobx-state-tree';
import { pick as _pick } from 'lodash';
import { newUuid, decrement, increment } from 'utils'
import Optional from 'optional-js';

import MobxCategoryItem from './CategoryItem';

const MobxAppItem = types
    .model('MobxAppItem', {
        id: types.identifier,
        name: types.string,
        categories: types.array(MobxCategoryItem),
        windowName: types.maybeNull(types.string)
    })
    .views(self => ({
        item(id) {
            if (!id) throw new Error('No ID supplied');

            return Optional.ofNullable(self.categories.find(i => i.id === id))
                .orElseThrow(() => new Error(`Item '${id}' not found in category ${self.name}`));
        },
        index(id) {
            if (!id) throw new Error('No ID supplied');

            return Optional.ofNullable(self.categories.findIndex(i => i.id === id))
                .orElseThrow(() => new Error(`Item '${id}' not found in category ${self.name}`));
        },
        at(i) {
            return self.categories[i];
        },
        get first() {
            return self.categories[0]
        },
        get last() {
            return self.categories[self.categories.length - 1]
        },
        next(id) {
            return Optional.of(id)
                .map(self.index).map(increment).map(self.at)
                .orElse(self.first);
        },
        prev(id) {
            return Optional.of(id)
                .map(self.index).map(decrement).map(self.at)
                .orElse(self.last);
        },
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
        }
    }))
    .actions(self => ({
        update(attrs) {
            let safeAttributes = _pick(attrs, ['name', 'windowName'])
            self = Object.assign(self, safeAttributes);
        },
        addCategory(name='New Category') {
            self.categories.unshift(MobxCategoryItem.create({
                id: newUuid(), name
            }))
        },
        removeCategory(id) {
            self.categories = self.categories.filter(i => i.id !== id);
        }
    }))

export default MobxAppItem;
