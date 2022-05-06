import { resolveIdentifier, types } from 'mobx-state-tree';
import { newUuid, getDebugLogger } from 'utils';
import Optional from 'optional-js';

import MobxAppItem from './AppItem';
import MobxCategoryItem from './CategoryItem';
import MobxShortcutItem from './ShortcutItem';

const log = getDebugLogger('AppStore');


/**
 * View methods for AppStore
 * @class IAppStoreViews
 * @param {IAppStore} self
 * @returns {object}
 * @constructor
 */
const AppStoreViews = (self) =>  ({
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

    isItem(id) {
        return self.find(id) !== null;
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
});

/**
 * Actions for AppStore
 * @class IAppStoreActions
 * @param {IAppStore} self
 * @constructor
 */
const AppStoreActions = (self) => ({
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
    /**
     * @param {number|string} appId - appId string or number index
     */
    setActiveApp(appId) {
        if (typeof appId === 'string') self.selectedApp = self.item(appId);
        if (typeof appId === 'number') self.selectedApp = self.appList[appId];
        else self.selectedApp = self.appList[0];
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
    addItem(itemId, label) {
        if (itemId) {
            log('addItem, found cursor:', itemId)
            let result = resolveIdentifier(MobxShortcutItem, self, itemId)

            if (result) {
                log('Resolved cursor:', result)
                return result.category.addItem(label);
            }


        } else {
            log('addItem, no cursor');
        }
    },
    removeItem(itemId) {
        if (itemId) {
            log('addItem, found cursor:', itemId)

            /** @type {IShortcutItem} */
            let result = resolveIdentifier(MobxShortcutItem, self, itemId)

            if (result) {
                log('Resolved cursor:', result)
                result.category.removeItem(result.id);
            }
        } else {
            log('addItem, no cursor');
        }
    }
})


/**
 * @typedef { object } IAppStoreProps
 * @property {IAppItemProps[]} appList
 * @property {IAppItemProps} selectedApp
 * @property {IAppItemProps} editApp
 * @property {string} unknownApp
 * @property {string[]} ignoreApps
 * @property {IShortcutItem[]} allItems
 * @property {IShortcutItem} topItem
 * @property {boolean} isEmpty
 */
const MobxAppStore = types
    .model('MobxAppStore', {
        appList: types.array(MobxAppItem),
        selectedApp: types.maybeNull(types.reference(MobxAppItem)),
        editApp: types.maybeNull(types.reference(MobxAppItem)),
        unknownApp: types.maybeNull(types.string),
        ignoreApps: types.array(types.string)
    })
    .views(AppStoreViews)
    .actions(AppStoreActions)

MobxAppStore.__defaults = {
    appList: [],
    selectedApp: null,
    editApp: null,
    unknownApp: null,
    ignoreApps: []
}

export default MobxAppStore;


/**
 * @typedef { IAppStoreProps, IAppStoreViews, IAppStoreActions } IAppStore
 */

