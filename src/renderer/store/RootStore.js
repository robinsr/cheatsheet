import 'regenerator-runtime/runtime';
import { debounce as _debounce } from 'lodash';
import Optional from 'optional-js';
import {  types,  flow,  getEnv,  getSnapshot,  resolveIdentifier } from 'mobx-state-tree';
import { gate, getLogger } from 'utils';
import UIStore from './ui/UIStore.js';
import MobxAppStore from './app/AppStore.js';
import MobxEditItemStore from './edit/EditItemStore.js';
import MobxImageModalStore from './export/ImageStore.js';
import MobxShortcutItem from './app/ShortcutItem.js';

const SELF_KEY = '__self__';

const log = getLogger('RootStore');

const MobxStore = types
    .model('MobxStore', {
        ui: UIStore,
        edit: MobxEditItemStore,
        apps: MobxAppStore,
        imageModal: MobxImageModalStore,
        isLoading: types.optional(types.boolean, true),
        isSaving: types.boolean,
        cursor: types.maybeNull(types.string),
        keyScope: types.maybeNull(types.string)
    })
    .views(self => ({
        get isEmpty() {
            return self.apps.isEmpty;
        }
    }))
    .actions(self => ({
        setLoading(val) {
            self.isLoading = val;
        },
        setSaving(val) {
            self.isSaving = val;
        },
        getInitialData: flow(function* getInitialData() {
            log.info('Fetching data...');
            try {
                let initialData = yield getEnv(self).api.getInitialData();
                log.info('Fetched data:', initialData);
                Object.assign(self, initialData);
            } catch (err) {
                log.error(err);
            }
            setTimeout(self.isLoaded, 1200);
        }),
        listenToWindowChange() {
            let api = getEnv(self).api;

            api.handleWindow(gate(hasWindowChanged, (e, data) => {
                handleWindowChange(data.windowName, self, api);
            }));
        },
        isLoaded() {
            self.isLoading = false;
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
        setKeyScope(val) {
            self.keyScope = val;
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
    }));


function handleWindowChange(windowName, { apps, ui }, { thisApp }) {
    log.debug('Handling window change', windowName);
    ui.setActiveWindow(windowName);

    let ignoreApps = [].concat(apps.ignoreApps).concat([ SELF_KEY, thisApp ]);


    if (ignoreApps.includes(windowName)|| !ui.activeFollow) {
        return;
    }

    let app = apps.window(windowName);

    if (app) {
        apps.clearUnknownAppName();
        apps.setActiveApp(app.id);
    } else {
        apps.setUnknownAppName(windowName)
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

