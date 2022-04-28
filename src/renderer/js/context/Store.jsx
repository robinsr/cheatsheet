import { debounce as _debounce } from 'lodash';
import { createContext, useContext } from 'react';
import { onPatch, onSnapshot } from 'mobx-state-tree';
import MobxStore from "context/models/RootStore";

export { Themes } from './models/UIStore';

const initialData = {
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
        selectedApp: null,
        editApp: null,
        unknownApp: null,
        ignoreApps: []
    },
    imageModal: {
        data: null,
        showModal: false
    },
    isLoading: true
};

const env = {
    api: window.cheatsheetAPI
}

let initialState = MobxStore.create(initialData, env);

export const rootStore = initialState;

rootStore.getInitialData().then((data) => {
    console.log('Loaded', data)
})

onSnapshot(rootStore, (snapshot) => {
    console.log("Snapshot: ", snapshot);
});

onSnapshot(rootStore, _debounce((snapshot) => {
    if (snapshot.isLoading) {
        return;
    }

    if (snapshot.items.editItem !== null) {
        return;
    }

    console.log("Snapshot (saving): ", snapshot)
    window.cheatsheetAPI.onSnapshot(snapshot);
}, 750));

export const AppContext = createContext();
export const Provider = AppContext.Provider;

export function useMst() {
    const store = useContext(AppContext);
    if (store === null) {
        throw new Error("Store cannot be null, please add a context provider");
    }
    return store;
}

// if (rootStore.isEmpty()) {
//     rootStore.getInitialData();
// }

window.cheatsheetAPI.handleStateChange((e, value) => {
    let ignoreApps = [
        '__self__', window.cheatsheetAPI.appName
    ].concat(rootStore.apps.ignoreApps);

    if (value[0] === 'change') {
        let appName = value[1].windowName;

        rootStore.ui.setActiveWindow(appName);

        let app = rootStore.apps.findByWindowName(appName);

        if (rootStore.ui.activeFollow) {
            if (app) {
                rootStore.apps.clearUnknownAppName();
                rootStore.apps.setActiveApp(app.id);
                return;
            }

            if (!ignoreApps.includes(appName)) {
                rootStore.apps.setUnknownAppName(appName)
            }
        }
    }
})
