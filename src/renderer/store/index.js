import { debounce as _debounce } from 'lodash';
import { createContext, useContext } from 'react';
import { onAction, onPatch, onSnapshot } from 'mobx-state-tree';
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


Promise.all([ rootStore.apps.load(), rootStore.ui.load() ])
    .then(() => {
        setTimeout(() => {
            rootStore.state.loading(false);
            window.cheatsheetAPI.emit('app:loaded')
            rootStore.listenToWindowChange();
            enableFileSync();
        }, 750);
    });


const enableFileSync = () => {
    onSnapshot(rootStore.apps, _debounce((snapshot) => {
        rootStore.apps.save();
    }, 750));

    onSnapshot(rootStore.ui, snapshot => {
        rootStore.ui.save();
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
