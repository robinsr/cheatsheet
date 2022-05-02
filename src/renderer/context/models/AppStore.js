import { detach, getParent, getType, resolveIdentifier, types } from 'mobx-state-tree';
import { pick as _pick } from 'lodash';
import { newUuid } from 'utils';
import { getDebugLogger } from "utils/logger.js";
import { MobxShortcutItem } from './ShortcutItem';
import Optional from 'optional-js';

const log = getDebugLogger('AppStore');

const increment = (val) => val + 1;
const decrement = (val) => val - 1;

export const MobxCategoryItem = types
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


export const MobxAppItem = types
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

export const MobxAppList = types
    .model('MobxAppList', {
        appList: types.array(MobxAppItem),
        selectedApp: types.maybeNull(types.reference(MobxAppItem)),
        editApp: types.maybeNull(types.reference(MobxAppItem)),
        unknownApp: types.maybeNull(types.string),
        ignoreApps: types.array(types.string)
    })
    .views(self => ({
        item(id) {
            return Optional.ofNullable(self.appList.find(a => a.id === id))
                .orElseThrow(() => new Error(`App '${id}' not found`));
        },
        index(id) {
            return Optional.ofNullable(self.appList.findIndex(a => a.id === id))
                .orElseThrow(() => new Error(`App '${id}' not found`));
        },
        window(name) {
            return self.appList.find(a => a.windowName === name) || null;
        },
        query(term) {
            if (['', ' '].includes(term)) {
                return [];
            }

            return self.appList.map(a => a.query(term))
                .flatMap(x => x)
                .slice(0, 6);
        },
        find(id) {
            return self.allItems.find(i => i.id === id) || null;
        },
        get first() {
            return self.appList[0]
        },
        get last() {
            return self.appList[self.appList.length - 1]
        },
        get isEmpty() {
            return this.appList
                .map(a => a.isEmpty)
                .reduce((p, c) => p && c, true);
        },
        get topItem() {
            return self.selectedApp.allItems[0];
        },
        get allItems() {
            return self.appList
                .map(a => a.allItems)
                .flatMap(x => x);
        }
    }))
    .actions(self => ({
        addNewApp(name='New App', windowName='') {
            let newApp = MobxAppItem.create({
                id: newUuid(), name, windowName, categories: [
                    MobxCategoryItem.create({
                        id: newUuid(), name: 'New App (1)', items: []
                    })
                ]
            });

            self.appList.unshift(newApp);
            self.selectedApp = newApp;

            return newApp;
        },
        removeApp(id) {
            self.appList.splice(self.index(id), 1);
        },
        setActiveApp(appId) {
            self.selectedApp = self.item(appId);
        },
        clearSelectedApp() {
            self.selectedApp = null;
        },
        setEditApp(appId) {
            self.editApp = self.item(appId);
        },
        clearEditApp() {
            self.editApp = null;
        },
        setUnknownAppName(appName) {
            self.unknownApp = appName
        },
        clearUnknownAppName() {
            self.unknownApp = null;
        },
        addIgnoreApp(appName) {
            self.ignoreApps.unshift(appName);
        },
        nextApp() {
            let current = self.index(self.selectedApp.id);

            if (self.appList[current + 1]) {
                self.selectedApp = self.appList[current + 1];
            } else {
                self.selectedApp = self.first;
            }
        },
        prevApp() {
            let current = self.index(self.selectedApp.id);

            if (self.appList[current - 1]) {
                self.selectedApp = self.appList[current - 1];
            } else {
                self.selectedApp = self.last;
            }
        },
        addItem(cursor) {
            if (cursor) {
                log('addItem, found cursor:', cursor)
                let result = resolveIdentifier(MobxShortcutItem, self, cursor)

                if (result) {
                    log('Resolved cursor:', result)
                    result.category.addItem();
                    return;
                }


            } else {
                log('addItem, no cursor');
            }
        }
    }))

