import 'regenerator-runtime/runtime';
import { types, flow, getEnv, getSnapshot } from "mobx-state-tree";
import { UIStore } from "context/models/UIStore.js";
import { MobxAppList } from "context/models/AppStore";
import { MobxShortcutItemList } from "context/models/ShortcutItemList.js";
import { MobxImageModal } from "context/models/ImageModal.js";

const MobxStore = types
    .model('MobxStore', {
        ui: UIStore,
        items: MobxShortcutItemList,
        apps: MobxAppList,
        imageModal: MobxImageModal,
        isLoading: types.boolean
    })
    .actions(self => ({
        getInitialData: flow(function* getInitialData() {
            console.log('Fetching data...');
            try {
                let initialData = yield getEnv(self).api.getInitialData();
                Object.assign(self, initialData);
            } catch (err) {
                console.error(err);
            }
            setTimeout(self.isLoaded, 1200);
        }),
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
        }
    }))

export default MobxStore;
