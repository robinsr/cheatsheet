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

rootStore.apps.load().then(() => log.info('apps:loaded'));
rootStore.ui.load().then(() => log.info('settings:loaded'));

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

export { Themes } from './ui/SettingsStore.js';

const saveData = async (snapshot) => {
    if (rootStore.state.isLoading) {
        return;
    }

    if (rootStore.edit.editItem !== null) {
        return;
    }

    log.info('Saving apps', snapshot);

    rootStore.state.saving(true);
    try {
        const result = window.cheatsheetAPI.apps.save(snapshot);
        log.info('Save success', result);
    } catch (err) {
        log.error('Save failed', err);
    } finally {
        rootStore.state.saving(false);
    }
};


onSnapshot(rootStore.apps, _debounce((snapshot) => {
    rootStore.apps.save();
}, 750));

onSnapshot(rootStore.ui, snapshot => {
    rootStore.ui.save();
});
