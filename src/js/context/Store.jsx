import { createContext, useContext } from 'react';
import { types, onSnapshot } from 'mobx-state-tree';


import { Themes, UI } from './models/ui';
import { MobxItemList, MobxAppGroup } from './models/items';

export { Themes } from './models/ui';

const MobxPNGImageData = types
    .model({
        dataUrl: types.string,
        width: types.number,
        height: types.number
    })

const MobxPNG = types
    .model({
        imageData: types.maybeNull(MobxPNGImageData),
        showModal: types.boolean
    })
    .actions(self => ({
        setImageData(data) {
            self.imageData = data;
            self.showModal = true;
        },

        closeModal() {
            self.showModal = false;
        }
    }))


const MobxStore = types
    .model({
        ui: UI,
        items: MobxItemList,
        apps: types.array(MobxAppGroup),
        png: MobxPNG
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
    png: {
        imageData: null,
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
