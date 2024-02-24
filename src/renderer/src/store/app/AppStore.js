import { flow, getEnv, getSnapshot, resolveIdentifier, types } from 'mobx-state-tree';
import { newUuid, getLogger } from 'utils';

import MobxAppItem from './AppItem';
import MobxCategoryItem from './CategoryItem';
import MobxShortcutItem from './ShortcutItem';
import MobxCollection from 'store/types/Collection';

const log = getLogger('AppStore');


/**
 * View methods for AppStore
 * @class IAppStoreViews
 * @param {IAppStore} self
 * @returns {object}
 * @constructor
 */
const AppStoreViews = (self) =>  ({
    getByWindowName(name) {
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
    findItem(id) {
        return self.allItems.find(i => i.id === id) || null;
    },
    isItem(id) {
        return self.findItem(id) !== null;
    },
    isEmpty() {
        return this.appList
            .map(a => a.isEmpty)
            .reduce((p, c) => p && c, true);
    },
    get topItem() {
        return self.selectedApp?.allItems[0];
    },
    get bottomItem() {
        return self.selectedApp.allItems[self.selectedApp.allItems.length - 1];
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
    load: flow(function* loadApps() {
        log.info('Fetching AppStore...');
        try {
            let result = yield getEnv(self).cheatsheetAPI.apps.get();
            log.info('Fetched AppStore', result);
            self.appList = result.appList;
            self.selectedApp = self.appList[0];
        } catch (err) {
            log.error(err);
        }
    }),
    save: flow(function* saveApps() {
        log.info('Saving AppStore')
        try {
            const result = yield getEnv(self).cheatsheetAPI.apps.save(getSnapshot(self));
            log.info('AppStore saved', result);
        } catch (err) {
            log.error('AppStore save failed', err);
            log.error(err);
        }
    }),
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
        let isActive = self.selectedApp.id === id;
        let isEdit = self.editApp.id === id;

        if (isEdit) {
            self.clearEditApp();
        }

        if (isActive) {
            self.selectedApp = self.appList.find(a => a.id !== id);
        }

        self.appList.splice(self.index(id), 1);
    },
    setActiveApp(appId) {
        if (typeof appId === 'string') {
            self.selectedApp = self.get(appId);
        } else if (typeof appId === 'number') {
            self.selectedApp = self.appList[appId];
        } else {
            self.selectedApp = self.appList[0];
        }
    },
    clearSelectedApp() {
        self.selectedApp = null;
    },
    setEditApp(appId) {
        self.editApp = self.get(appId);
    },
    clearEditApp() {
        self.editApp = null;
    },

    removeItem(itemId) {
        if (itemId) {
            log.debug('addItem, found cursor:', itemId)

            /** @type {IShortcutItem} */
            let result = resolveIdentifier(MobxShortcutItem, self, itemId)

            if (result) {
                log.debug('Resolved cursor:', result)
                result.category.removeItem(result.id);
            }
        } else {
            log.debug('addItem, no cursor');
        }
    }
})


/**
 * @typedef { object } IAppStoreProps
 * @property {IAppItemProps[]} appList
 * @property {IAppItemProps} selectedApp
 * @property {IAppItemProps} editApp
 * @property {IShortcutItem[]} allItems
 * @property {IShortcutItem} topItem
 * @property {boolean} isEmpty
 */
const MobxAppStore = types
    .compose(MobxCollection(MobxAppItem, { propName: 'appList' }),
        types
            .model('MobxAppStore', {
                selectedApp: types.maybeNull(types.reference(MobxAppItem)),
                editApp: types.maybeNull(types.reference(MobxAppItem)),
        })
        .views(AppStoreViews)
        .actions(AppStoreActions)
    ).named('AppStore');

MobxAppStore.__defaults = {
    appList: [],
    selectedApp: null,
    editApp: null
}

export default MobxAppStore;


/**
 * @typedef { CollectionStore<IAppItem>, IAppStoreProps, IAppStoreViews, IAppStoreActions } IAppStore
 */

