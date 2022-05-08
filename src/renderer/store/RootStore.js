import 'regenerator-runtime/runtime';
import { debounce as _debounce } from 'lodash';
import Optional from 'optional-js';
import {  types,  flow,  getEnv,  getSnapshot,  resolveIdentifier } from 'mobx-state-tree';
import { gate, getLogger } from 'utils';
import MobxSettingsStore from './ui/SettingsStore.js';
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

    listenToWindowChange() {
        let api = getEnv(self).cheatsheetAPI;

        api.subscribe('app:window-change', gate(hasWindowChanged, (e, data) => {
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
 * @property {ISettingsStore} ui
 * @property {EditStore} edit
 * @property {IAppStore} apps
 * @property {ImageModalStore} imageModal
 * @property {SearchStore} search
 * @property {StateStore} state
 * @property {string} cursor
 */
const MobxStore = types
    .model('MobxStore', {
        ui: MobxSettingsStore,
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
    ui: MobxSettingsStore.__defaults,
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

    let thisApp = window.cheatsheetAPI.config.get('name');

    if ([ thisApp ].concat(ui.ignoreApps).includes(windowName)) {
        return;
    }

    let app = apps.window(windowName);

    if (app) {
        state.clearUnknownAppName();
        apps.setActiveApp(app.id);
    } else {
        state.setUnknownAppName(windowName);
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

