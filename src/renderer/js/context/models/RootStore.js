import 'regenerator-runtime/runtime';
import { debounce as _debounce } from 'lodash';
import Optional from 'optional-js';
import { types, flow, getEnv, getSnapshot, onSnapshot, resolveIdentifier } from "mobx-state-tree";
import { UIStore } from "context/models/UIStore.js";
import { MobxAppList } from "context/models/AppStore";
import { MobxEditItemStore } from "context/models/EditItemStore.js";
import { MobxImageModal } from "context/models/ImageModal.js";
import { MobxShortcutItem } from "context/models/ShortcutItem";
import { gate } from 'utils/uuid';
import { getDebugLogger } from "utils/logger";

const SELF_KEY = '__self__';

const logger = getDebugLogger('RootStore')

const MobxStore = types
    .model('MobxStore', {
        ui: UIStore,
        edit: MobxEditItemStore,
        apps: MobxAppList,
        imageModal: MobxImageModal,
        isLoading: types.boolean,
        isSaving: types.boolean,
        cursor: types.maybeNull(types.string)
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
            logger('Fetching data...');
            try {
                let initialData = yield getEnv(self).api.getInitialData();
                Object.assign(self, initialData);
            } catch (err) {
                console.error(err);
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
                logger('resolved item:', val)
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
    logger('Handling window change', windowName);
    ui.setActiveWindow(windowName);

    let ignoreApps = [].concat(apps.ignoreApps).concat([ SELF_KEY, thisApp ]);


    if (ignoreApps.includes(windowName)|| !ui.activeFollow) {
        return;
    }

    let app = apps.findByWindowName(windowName);

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
