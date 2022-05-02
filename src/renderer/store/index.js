import { debounce as _debounce } from 'lodash';
import { createContext, useContext } from 'react';
import { onAction, onPatch, onSnapshot } from 'mobx-state-tree';
import { getLogger } from 'utils';
import MobxStore from "./RootStore.js";

const log = getLogger('Store');

const api = window.cheatsheetAPI;
const initialData = {
    ui: {
        theme: 'dark',
        activeWindow: 'Cheat',
        activeFollow: true
    },
    edit: {
        item: null // todo; get from electron window api
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
    isLoading: true,
    isSaving: false,
    cursor: '/items/itemList/0'
};
const env = { api };

let initialState = MobxStore.create(initialData, env);

export const rootStore = initialState;

rootStore.getInitialData().then(() => log.info('data:loaded'));

rootStore.listenToWindowChange();

onAction(rootStore, action => getLogger('Store/action').debug(action))
onPatch(rootStore, patch => getLogger('Store/patch').debug(patch))
onSnapshot(rootStore, (snapshot) => getLogger('Store/snapshot').debug(snapshot));

export const AppContext = createContext();
export const Provider = AppContext.Provider;

export function useMst() {
    const store = useContext(AppContext);
    if (store === null) {
        throw new Error("Store cannot be null, please add a store provider");
    }
    return store;
}

export { Themes } from './ui/UIStore';

onSnapshot(rootStore, _debounce((snapshot) => {
    if (rootStore.isLoading) {
        return;
    }

    if (rootStore.edit.editItem !== null) {
        return;
    }

    log.info('saving snapshot', snapshot);
    rootStore.setSaving(true);
    api.onSnapshot(snapshot)
        .then(data => log.info('saved', data))
        // .then(msg => rootStore.setSaving(false))
        .catch(err => {
            log.error(err);
        });
}, 750));

