import { debounce as _debounce } from 'lodash';
import { createContext, useContext } from 'react';
import {onAction, onPatch, onSnapshot} from 'mobx-state-tree';
import { getDebugLogger } from 'utils/logger';
import MobxStore from "context/models/RootStore";
import Logger from "js-logger";

const logger = getDebugLogger('Store');

const api = window.cheatsheetAPI;
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
    isLoading: true,
    isSaving: false,
    cursor: '/items/itemList/0'
};
const env = { api };

let initialState = MobxStore.create(initialData, env);

export const rootStore = initialState;

rootStore.getInitialData().then(() => logger('data:loaded'));

rootStore.listenToWindowChange();

onAction(rootStore, action => Logger.get('Store/action').debug(action))
onPatch(rootStore, patch => Logger.get('Store/patch').debug(patch))
onSnapshot(rootStore, (snapshot) => Logger.get('Store/snapshot').debug(snapshot));

export const AppContext = createContext();
export const Provider = AppContext.Provider;

export function useMst() {
    const store = useContext(AppContext);
    if (store === null) {
        throw new Error("Store cannot be null, please add a context provider");
    }
    return store;
}

export { Themes } from './models/UIStore';

onSnapshot(rootStore, _debounce((snapshot) => {
    if (rootStore.isLoading) {
        return;
    }

    if (rootStore.items.editItem !== null) {
        return;
    }

    logger('saving snapshot', snapshot);
    rootStore.setSaving(true);
    api.onSnapshot(snapshot)
        .then(data => logger('saved', data))
        // .then(msg => rootStore.setSaving(false))
        .catch(console.error);
}, 750));

