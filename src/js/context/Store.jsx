import { createContext, useContext } from 'react';
import { types, onSnapshot } from 'mobx-state-tree';


import { Themes, UI } from './models/ui';
import { MobxItemList } from './models/items';

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
        png: MobxPNG
    })
    .actions(self => ({
        fetch() {
            window.keymap_api.getInitialData().then(self.load)
        },
        load(data) {
            console.log(data);
            self.items.itemList = data;
        }
    }))
    

let initialstate = MobxStore.create({
    ui: {
        theme: 'dark'
    },
    items: {
        itemList: [],
        editItem: null // todo; get from electron window api
    },
    png: {
        imageData: null,
        showModal: false
    }
});

export const rootStore = initialstate;

onSnapshot(rootStore, (snapshot) => {
    console.log("Snapshot: ", snapshot);
    localStorage.setItem("rootState", JSON.stringify(snapshot));
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

rootStore.fetch();
