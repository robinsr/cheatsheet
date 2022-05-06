import 'regenerator-runtime/runtime';
import { debounce as _debounce } from 'lodash';
import Optional from 'optional-js';
import {  types,  flow,  getEnv,  getSnapshot,  resolveIdentifier } from 'mobx-state-tree';
import { gate, getLogger } from 'utils';
import UIStore from './ui/UIStore';
import MobxSearchStore from './ui/SearchStore';
import MobxStateStore from './ui/StateStore.js';
import MobxAppStore from './app/AppStore.js';
import MobxEditItemStore from './edit/EditItemStore';
import MobxImageModalStore from './export/ImageStore';
import MobxShortcutItem from './app/ShortcutItem';

const log = getLogger('RootStore');

/**
 * @class IRootStoreViews
 * @param {IRootStore} self
 * @constructor
 */
const RootStoreViews = self => ({
    get isEmpty() {
        return self.apps.isEmpty;
    }
})

/**
 * @class IRootStoreActions
 * @param {IRootStore} self
 * @constructor
 */
const RootStoreActions = self => ({
    getInitialData: flow(function* getInitialData() {
        log.info('Fetching data...');
        try {
            let initialData = yield getEnv(self).api.getInitialData();
            log.info('Fetched data:', initialData);
            Object.assign(self, initialData);
            self.apps.setActiveApp(0);
        } catch (err) {
            log.error(err);
        }
        setTimeout(() => self.state.loading(false), 1200);
    }),
    listenToWindowChange() {
        let api = getEnv(self).api;

        api.handleWindow(gate(hasWindowChanged, (e, data) => {
            handleWindowChange(data.windowName, self, api);
        }));
    },
    removeApp(appId) {
        self.apps.removeApp(appId);
    },
    removeCategory(appId, groupId) {
        self.apps.item(appId).removeCategory(groupId);
    },
    backup() {
        return getSnapshot(self);
    },
    setCursor: _debounce(val => self._setCursor(val), 10),
    _setCursor(val) {
        self.cursor = val;
    },
    getCursor() {
        return Optional.ofNullable(self.cursor);
    },
    resolveCursor(val) {
        // Currently only looks up shortcutitems, but can be
        // extended to check for other model types
        try {
            let item = resolveIdentifier(MobxShortcutItem, self, val);
            log.debug('resolved item:', val)
            return item
        } catch (e) {
            return null;
        }
    },
    cursorDown() {
        self.cursor = Optional.ofNullable(self.cursor)
            .map(val => self.resolveCursor(val))
            .map(item => item.next?.id)
            .orElse(self.apps.topItem.id);
    },
    cursorUp() {
        self.cursor = Optional.ofNullable(self.cursor)
            .map(self.resolveCursor)
            .map(item => item.prev?.id)
            .orElse(self.apps.topItem.id);
    }
})

/**
 * @typedef {object} IRootStoreProps
 * @property {UIStore} ui
 * @property {EditStore} edit
 * @property {IAppStore} apps
 * @property {ImageModalStore} imageModal
 * @property {SearchStore} search
 * @property {StateStore} state
 * @property {string} cursor
 */
const MobxStore = types
    .model('MobxStore', {
        ui: UIStore,
        edit: MobxEditItemStore,
        apps: MobxAppStore,
        imageModal: MobxImageModalStore,
        search: MobxSearchStore,
        state: MobxStateStore,
        cursor: types.maybeNull(types.string),
    })
    .views(RootStoreViews)
    .actions(RootStoreActions);

MobxStore.__defaults = {
    ui: UIStore.__defaults,
    edit: MobxEditItemStore.__defaults,
    apps: MobxAppStore.__defaults,
    imageModal: MobxImageModalStore.__defaults,
    search: MobxSearchStore.__defaults,
    state: MobxStateStore.__defaults,
    cursor: 'SEARCH',
}

function handleWindowChange(windowName, { apps, ui, state }) {
    log.debug('Handling window change', windowName);
    state.setActiveWindow(windowName);

    if (!ui.activeFollow) {
        return;
    }

    let thisApp = window.cheatsheetAPI.configVal('name');

    if ([ thisApp ].concat(apps.ignoreApps).includes(windowName)) {
        return;
    }

    let app = apps.window(windowName);

    if (app) {
        apps.clearUnknownAppName();
        apps.setActiveApp(app.id);
    } else {
        apps.setUnknownAppName(windowName);
    }
}

const hasWindowChanged = (memo, args) => {
    if (args[1].windowName !== memo) {
        return [ true, args[1].windowName ];
    } else {
        return [ false, null ]
    }
}

export default MobxStore;

/**
 * @typedef { IRootStoreProps, IRootStoreViews, IRootStoreActions } IRootStore
 */

