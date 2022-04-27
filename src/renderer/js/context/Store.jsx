import { createContext, useContext } from 'react';
import { onSnapshot } from 'mobx-state-tree';
import MobxStore from "context/models/RootStore";

export { Themes } from './models/UIStore'

let initialState = MobxStore.create({
    ui: {
        theme: 'dark',
        activeWindow: 'Cheat',
        activeFollow: true
    },
    items: {
        itemList: [],
        editItem: null // todo; get from electron window api
    },
    apps: {
        appList: [],
        selectedApp: null
    },
    imageModal: {
        data: null,
        showModal: false
    }
});

const data = localStorage.getItem("rootState");
if (data) {
    const json = JSON.parse(data);
    if (MobxStore.is(json)) {
        initialState = MobxStore.create(json);
    }
}

export const rootStore = initialState;

onSnapshot(rootStore, (snapshot) => {
    if (snapshot.items.editItem == null) {
        console.log("Snapshot (saving): ", snapshot)
        localStorage.setItem("rootState", JSON.stringify(snapshot));
    } else {
        console.log("Snapshot: ", snapshot);
    }

});

export const AppContext = createContext();
export const Provider = AppContext.Provider;

export function useMst() {
    const store = useContext(AppContext);
    if (store === null) {
        throw new Error("Store cannot be null, please add a context provider");
    }
    return store;
}

if (rootStore.isEmpty()) {
    rootStore.fetch();
}

window.keymap_api.handleStateChange((e, value) => {
    console.log(value)

    if (value[0] === 'change') {
        let appName = value[1].windowName;

        rootStore.ui.setActiveWindow(appName);

        let app = rootStore.apps.findByWindowName(appName);

        if (app && rootStore.ui.activeFollow) {
            rootStore.apps.setActiveApp(app.id);
        }
    }
})
