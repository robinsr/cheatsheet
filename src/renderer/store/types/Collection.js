import { curry, isNumber, toInteger } from 'lodash';
import { getPath, isModelType, typecheck, types } from 'mobx-state-tree';
import Optional from 'optional-js';
import { decrement, increment, newUuid } from 'utils';


/**
 * @typedef CollectionStore
 * @description Generic collection (array of MST models), to be used in Compose with another MST model
 * @template T
 * @property {function(id: string): T} get - Looks-up an item by ID
 * @property {function(id: string): number} index - Looks up an item by ID and returns its index position
 * @property {function(index: number): T} at - Returns the element at specified index
 * @property {function(): T} first - Returns the first element
 * @property {function(): T} last - Returns the last element
 * @property {function(id: string): T} next - Returns the next element in the collection
 * @property {function(id: string): T} prev - Returns the prev element in the collection
 */


const isTest = process.env.NODE_ENV === 'test';
const COLLECTION_SYM = Symbol('MobxCollectionType');

/**
 *
 * @param self
 * @param keyType
 * @template T
 * @return {function(T):number}
 */
const getItemRetriever = (self, keyType) => {
    switch (keyType) {
        case 'id':
            return (id) => self._items.find(i => i.id === id);
        case 'path':
            return (path) => self._items.find(i => getPath(i) === path);
        case 'index':
            return (i) => self._items[i];
    }
}

const getIndexRetriever = () => {

}

const toNumber = (i) => {
    let parsed = parseInt(i);
    return isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}

/**
 * Collection Model
 * @param itemType - the MST model type to use in colleciton
 * @param propName - name of inner array. Can be accessed in unions
 * @constructor
 */
const MobxCollectionModel = (itemType, { propName }) => {
    return types.model({
        [ propName ]: types.array(itemType),
        active: types.maybeNull(types.string)
    })
}

const MobxCollectionViews = (itemType, { propName, orElseNext, orElsePrev }) => self => ({
    get(key, keyType = 'id') {
        return Optional.ofNullable(getItemRetriever(self, keyType)(key))
            .orElseThrow(() => new Error(`Item '${key}' not found in ${propName}`));
    },
    find(attr, value) {
        return Optional.ofNullable(self._items.find(i => i[attr] === value))
            .orElseThrow(() => new Error(`Item matching ${attr}=${value} not found in ${propName}`))
    },
    findIndex(id) {
        return Optional.ofNullable(self._items.findIndex(i => i.id === id))
            .orElseThrow(() => new Error(`Item '${id}' not found in ${propName}`));
    },
    indexOf(item) {
        typecheck(itemType, item);
        return Optional.ofNullable(item)
            .map(item => self._items.indexOf(item))
            .filter(i => i !== -1)
            .orElseThrow(() => new Error(`Item with id '${item.id}' not found in ${propName}`));
    },
    at(i) {
        return toNumber(i) < self._items.length ? self._items[i] : null;
    },
    get first() {
        return self[propName][0]
    },
    get last() {
        return self[propName][self[propName].length - 1]
    },
    next(key, keyType = 'id') {
        return Optional.of(key)
            .map(getItemRetriever(self, keyType))
            .map(self.indexOf).map(increment).map(self.at)
            .orElseGet(() => orElseNext(self));
    },
    prev(key, keyType = 'id') {
        return Optional.of(key)
            .map(getItemRetriever(self, keyType))
            .map(self.indexOf).map(decrement).map(self.at)
            .orElseGet(() => orElsePrev(self));
    },

    get isEmpty() {
        return self[propName].length === 0;
    },

    /**
     * Returns raw collection
     * @return {T[]}
     * @private
     */
    get _items() {
        return self[propName];
    }
});

const MobxCollectionActions = (itemType, { propName }) => self => ({
    add(item = {}) {
        if (!item.id) {
            item.id = newUuid();
        }

        try {
            typecheck(itemType, item);
            self[propName].push(item);
        } catch (e) {
            throw new Error(e.message);
        }

        return item;
    }
})

const config = {
    propName: 'items',
    orElseNext: (self) => self.first,
    orElsePrev: (self) => self.last
}

const MobxCollection = (itemType, opts) => {
    isModelType(itemType);

    let options = Object.assign({}, config, opts);
    let { propName } = options;


    let name = `${itemType.name || 'AnonymousModel'}Collection`;

    let collection = MobxCollectionModel(itemType, options)
        .views(MobxCollectionViews(itemType, options))
        .actions(MobxCollectionActions(itemType, options))
        .named(name);

    Object.defineProperty(collection, COLLECTION_SYM, {
        value: itemType.name || 'AnonymousModel',
        writable: false,
        enumerable: isTest
    });

    return collection;
}

export default MobxCollection;
