import { curry, isNumber, toInteger } from 'lodash';
import { isModelType, typecheck, types } from 'mobx-state-tree';
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

const getItemRetriever = (self, keyType) => {
    switch (keyType) {
        case 'path':
            return curry(self.find)('path'); // todo, this wont work
        case 'index':
            return self.index;
        default:
            return self.get;
    }
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
const MobxCollectionModel = (itemType, propName='items') => {
    return types.model({
        [ propName ]: types.array(itemType),
        active: types.maybeNull(types.string)
    })
}

const MobxCollectionViews = ({ propName, orElseNext, orElsePrev }) => self => ({
    get(id) {
        return Optional.ofNullable(self[propName].find(i => i.id === id))
            .orElseThrow(() => new Error(`Item '${id}' not found in ${propName}`));
    },
    find(attr, value) {
        return Optional.ofNullable(self[propName].find(i => i[attr] === value))
            .orElseThrow(() => new Error(`Item matching ${attr}=${value} not found in ${propName}`))
    },
    index(id) {
        return Optional.ofNullable(self[propName].findIndex(i => i.id === id))
            .orElseThrow(() => new Error(`Item '${id}' not found in category ${self.name}`));
    },
    at(i) {
        return toNumber(i) < self[propName].length ? self[propName][i] : null;
    },
    get first() {
        return self[propName][0]
    },
    get last() {
        return self[propName][self[propName].length - 1]
    },
    /**
     *
     * @param {string|number} key
     * @param {('')} [keyType=id]
     * @return {unknown}
     */
    next(id, keyType = 'id') {
        let getter = getItemRetriever(self, 'id'); // TODO get next item by path (eg "/items/1")

        return Optional.of(id)
            .map(self.index).map(increment).map(self.at)
            .orElseGet(() => orElseNext(self));
    },
    prev(id) {
        return Optional.of(id)
            .map(self.index).map(decrement).map(self.at)
            .orElseGet(() => orElsePrev(self));
    },

    get isEmpty() {
        return self[propName].length === 0;
    }
});

const MobxCollectionActions = (itemType, propName) => self => ({
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

    let collection = MobxCollectionModel(itemType, propName)
        .views(MobxCollectionViews(options))
        .actions(MobxCollectionActions(itemType, propName))
        .named(name);

    Object.defineProperty(collection, COLLECTION_SYM, {
        value: itemType.name || 'AnonymousModel',
        writable: false,
        enumerable: isTest
    });

    console.log(collection);

    return collection;
}

export default MobxCollection;
