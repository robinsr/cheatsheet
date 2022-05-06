import { debounce as _debounce } from 'lodash';
import { createContext, useContext } from 'react';
import { onAction, onPatch, onSnapshot } from 'mobx-state-tree';
import { getLogger } from 'utils';
import MobxStore from "./RootStore.js";

const log = getLogger('Store');
const api = window.cheatsheetAPI;

let initialState = MobxStore.create(MobxStore.__defaults, { api });
export const rootStore = initialState;

rootStore.getInitialData().then(() => log.info('data:loaded'));

rootStore.listenToWindowChange();

onAction(rootStore, action => getLogger('Store/action').debug(action))
onPatch(rootStore, patch => getLogger('Store/patch').debug(patch))
onSnapshot(rootStore, (snapshot) => getLogger('Store/snapshot').debug(snapshot));

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

export { Themes } from './ui/UIStore';

const saveData = (snapshot) => {
    if (rootStore.state.isLoading) {
        return;
    }

    if (rootStore.edit.editItem !== null) {
        return;
    }

    log.info('saving snapshot', snapshot);

    rootStore.state.saving(true);
    api.onSnapshot(snapshot)
        .then(data => log.info('saved', data))
        .then(msg => rootStore.state.saving(false))
        .catch(err => {
            log.error(err);
        });
};


onSnapshot(rootStore.apps, _debounce((snapshot) => {
    saveData({ apps: snapshot });
}, 750));

onSnapshot(rootStore.ui, snapshot => {
    saveData({ ui: snapshot });
});
