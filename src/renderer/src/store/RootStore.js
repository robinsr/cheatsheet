import 'regenerator-runtime/runtime';
import { debounce as _debounce } from 'lodash';
import Optional from 'optional-js';
import { types, getEnv, getSnapshot, resolveIdentifier } from 'mobx-state-tree';
import MobxAppItem from 'store/app/AppItem';
import { MobxHistoryStore } from 'store/ui/HistoryStore.js';
import { gate, getLogger } from 'utils';
import { HOME, ITEM, APP } from 'utils/paths';
import MobxSettingsStore from './ui/SettingsStore';
import MobxSearchStore from './ui/SearchStore';
import MobxStateStore from './ui/StateStore';
import MobxAppStore from './app/AppStore';
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
        return self.apps.isEmpty();
    },

    get cursor() {
        return self.history.cursor;
    }
});

/**
 * @class IRootStoreActions
 * @param {IRootStore} self
 * @constructor
 */
const RootStoreActions = self => ({

    listenToWindowChange() {
        let api = getEnv(self).cheatsheetAPI;

        api.subscribe('app:window-change', gate(hasWindowChanged, (e, data) => {
            handleWindowChange(data.windowName, self);
        }));
    },
    removeApp(appId) {
        self.apps.removeApp(appId);
    },
    removeCategory(appId, groupId) {
        self.apps.get(appId).removeCategory(groupId);
    },
    backup() {
        let json = self.toJSON();
        console.log(json);
        return json;
    },
    setCursor: _debounce(val => self._setCursor(val), 10),
    _setCursor(val) {
        self.history.push(val);
    },
    resolveCursor() {
        let { path, hash } = self.history;

        try {
            if (ITEM.match(hash)) {
                let [ match, itemId ] = ITEM.match(hash);
                log.debug('resolved cursor to ITEM', itemId);
                return resolveIdentifier(MobxShortcutItem, self, itemId);
            } else if (APP.match(path)) {
                let { appId } = APP.match(path);
                log.debug('Resolved cursor to APP', appId);
                return resolveIdentifier(MobxAppItem, self, appId);
            } else {
                log.error('Could not resolve cursor:', self.cursor);
            }
        } catch (e) {
            return null;
        }
    },
    cursorDown() {
        let next = Optional.ofNullable(self.resolveCursor())
            .map(item => item.next?.path)
            .orElseGet(() => {
                if (self.apps.topItem) {
                    return self.apps.topItem.path;
                } else {
                    window.cheatsheetAPI.systemBeep();
                    return self.cursor;
                }
            });

        self.history.push(next);
    },
    cursorUp() {
        let next = Optional.ofNullable(self.cursor)
            .map(self.resolveCursor)
            .map(item => item.prev?.path)
            .orElseGet(() => {
                if (self.apps.topItem) {
                    return self.apps.topItem.path;
                } else {
                    window.cheatsheetAPI.systemBeep();
                    return self.cursor;
                }
            });

        self.history.push(next);
    }
})

/**
 * @typedef {object} IRootStoreProps
 * @property {ISettingsStore} settings
 * @property {IAppStore} apps
 * @property {ImageModalStore} imageModal
 * @property {SearchStore} search
 * @property {StateStore} state
 * @property {IHistoryStore} history
 */
const MobxStore = types
    .model('MobxStore', {
        settings: MobxSettingsStore,
        apps: MobxAppStore,
        imageModal: MobxImageModalStore,
        search: MobxSearchStore,
        state: MobxStateStore,
        history: MobxHistoryStore,
    })
    .views(RootStoreViews)
    .actions(RootStoreActions);

MobxStore.__defaults = {
    settings: MobxSettingsStore.__defaults,
    apps: MobxAppStore.__defaults,
    imageModal: MobxImageModalStore.__defaults,
    search: MobxSearchStore.__defaults,
    state: MobxStateStore.__defaults,
    history: MobxHistoryStore.__defaults,
}

const windowLog = getLogger('WindowChange', 'DEBUG');

function handleWindowChange(windowName, { apps, settings, state }) {
    windowLog.debug('Handling window change', windowName);
    state.setActiveWindow(windowName);

    if (!settings.activeFollow) {
        return;
    }

    let thisApp = window.cheatsheetAPI.config.get('name');

    if ([ thisApp ].concat(settings.ignoreApps).includes(windowName)) {
        return;
    }

    let app = apps.getByWindowName(windowName);

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

