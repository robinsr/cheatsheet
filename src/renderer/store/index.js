import { createContext, useContext } from 'react';
import { getPath, getPathParts, onAction, onPatch, onSnapshot, walk } from 'mobx-state-tree';
import { debounce as _debounce } from 'lodash';
import { getLogger } from 'utils';
import MobxStore from "./RootStore.js";

const log = getLogger('Store');
const cheatsheetAPI = window.cheatsheetAPI;


let initialState = MobxStore.create(MobxStore.__defaults, { cheatsheetAPI });
/** @type {IRootStore} */
export const rootStore = initialState;

onAction(rootStore, action => getLogger('Store/action').debug(action))
onPatch(rootStore, patch => getLogger('Store/patch').debug(patch))
onSnapshot(rootStore, (snapshot) => getLogger('Store/snapshot').debug(snapshot));


Promise.all([ rootStore.apps.load(), rootStore.settings.load() ])
    .then(() => {
        setTimeout(() => {
            rootStore.state.loading(false);
            window.cheatsheetAPI.emit('app:loaded');
            rootStore.listenToWindowChange();
            enableFileSync();

            try {
                let indexItem = rootStore.apps.topItem
                let indexJsonPath = getPathParts(indexItem);
                let indexIdPath = indexItem.path;
                console.log(indexJsonPath);
            } catch (e) {
                console.error(e);
            }
            rootStore.history.push(getPath(rootStore.apps.appList[0]))
        }, 750);
    });


const enableFileSync = () => {
    onSnapshot(rootStore.apps, _debounce((snapshot) => {
        rootStore.apps.save();
    }, 750));

    onSnapshot(rootStore.settings, snapshot => {
        rootStore.settings.save();
    });
}


export const AppContext = createContext();
export const Provider = AppContext.Provider;

/**
 * Returns the root store as react context
 * @return {IRootStore}
 */
export function useMst() {
    const store = useContext(AppContext);
    if (store === null) {
        throw new Error("Store cannot be null, please add a store provider");
    }
    return store;
}

window.addEventListener('unload', e => {
    window.cheatsheetAPI.emit('app:reloading');
});

window.rootStore = rootStore;
