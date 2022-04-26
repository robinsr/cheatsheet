import { createContext, useContext } from 'react';
import { types, onSnapshot } from 'mobx-state-tree';

import { Themes, UI } from './models/ui';
import { MobxItemList, MobxAppGroup } from './models/items';
import { MobxImageModal } from './models/image';
export { Themes } from './models/ui';


const MobxStore = types
    .model('MobxStore', {
        ui: UI,
        items: MobxItemList,
        apps: types.array(MobxAppGroup),
        imageModal: MobxImageModal
    })
    .actions(self => ({
        fetch() {
            window.keymap_api.getInitialData().then(self.load)
        },
        load(data) {
            console.log(data);
            self.items.itemList = data.items.itemList;
            self.apps = data.apps;
        }
    }))
    

let initialState = MobxStore.create({
    ui: {
        theme: 'dark'
    },
    items: {
        itemList: [],
        editItem: null // todo; get from electron window api
    },
    apps: [],
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

if (rootStore.items.itemList.length == 0) {
    rootStore.fetch();
}
