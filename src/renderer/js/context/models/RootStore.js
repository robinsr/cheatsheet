import 'regenerator-runtime/runtime';
import { debounce as _debounce } from 'lodash';
import { types, flow, getEnv, getSnapshot, onSnapshot } from "mobx-state-tree";
import { UIStore } from "context/models/UIStore.js";
import { MobxAppList } from "context/models/AppStore";
import { MobxShortcutItemList } from "context/models/ShortcutItemList.js";
import { MobxImageModal } from "context/models/ImageModal.js";
import { gate } from 'utils/uuid';
import { getDebugLogger } from "utils/logger";

const SELF_KEY = '__self__';

const logger = getDebugLogger('RootStore')

const MobxStore = types
    .model('MobxStore', {
        ui: UIStore,
        items: MobxShortcutItemList,
        apps: MobxAppList,
        imageModal: MobxImageModal,
        isLoading: types.boolean,
        isSaving: types.boolean,
        cursor: types.maybeNull(types.string)
    })
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
            self.items.removeByApp(appId);
            self.apps.removeApp(appId);
        },
        removeCategory(appId, groupId) {
            self.items.removeItemsByCategory(groupId);

            self.apps.getById(appId).removeCategory(groupId);
        },
        backup() {
            return getSnapshot(self);
        },
        isEmpty() {
            return self.items.isEmpty();
        },
        setCursor(val) {
            self.cursor = val;
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
