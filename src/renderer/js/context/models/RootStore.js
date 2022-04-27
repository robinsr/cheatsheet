import {types, destroy, getSnapshot} from "mobx-state-tree";
import { UIStore } from "context/models/UIStore.js";
import { MobxAppList } from "context/models/AppStore";
import { MobxShortcutItemList } from "context/models/ShortcutItemList.js";
import { MobxImageModal } from "context/models/ImageModal.js";

const MobxStore = types
    .model('MobxStore', {
        ui: UIStore,
        items: MobxShortcutItemList,
        apps: MobxAppList,
        imageModal: MobxImageModal
    })
    .actions(self => ({
        isEmpty() {
            return self.items.isEmpty();
        },
        fetch() {
            console.log('Fetching data from electron');
            window.keymap_api.getInitialData().then(self.load)
        },
        load(data) {
            console.log(data);
            self.apps = data.apps;
            self.items = data.items;
        },
        addApp() {
            self.apps.addNewApp();
        },
        removeApp(appId) {
            self.items.removeByApp(appId);

            let app = self.apps.find(i => i.id === appId);

            destroy(app); // Todo: necessary?

            self.apps = self.apps.filter(i => i.id !== appId);
        },
        removeCategory(appId, groupId) {
            self.items.removeItemsByCategory(groupId);

            let app = self.apps.find(i => i.id === appId);
            app.removeCategory(groupId);
        },
        backup() {
            return getSnapshot(self);
        }
    }))

export default MobxStore;
