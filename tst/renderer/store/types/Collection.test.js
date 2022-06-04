import { getPath, resolvePath, types } from 'mobx-state-tree';
import MobxCollection from 'store/types/Collection';
import { fail } from 'jest/'


const getTestItems = () => ([
    { id: '123', name: 'Alpha' },
    { id: '456', name: 'Beta' },
    { id: '789', name: 'Gamma' }
]);

const TestContainerType = types.model({
    containerProp: types.optional(types.string, 'container')
})
.actions(self => ({
    combineAllNames() {
        return self.items.map(i => i.name).join('-')
    }
}))

const TestItemType = types
.model({
    id: types.identifier,
    name: types.string
})
.actions(self => ({
    isEmptyAction() { return true; }
}))
.named('TestItemType');

const TestItemTypeCollection = MobxCollection(TestItemType)

const TestComposeType = types.compose(TestContainerType, TestItemTypeCollection).named('TestComposeType');

const testInstanceName = 'I am "testInstance"';
let testInstance;

describe('Store', () => {
    describe('MobxCollection', () => {
        beforeEach(() => {
            testInstance = TestComposeType.create({
                items: getTestItems(),
                containerProp: testInstanceName
            })
        })

        describe('Usage', () => {
            describe('ItemType', () => {
                it('creates a composed type with a collection using the supplied item type', () => {
                    let snap = testInstance.toJSON();
                    expect(snap).toHaveProperty('containerProp', testInstanceName);
                    expect(snap).toHaveProperty('items');
                    expect(snap.items).toHaveLength(3);
                })

                it('exposes collection to methods from other type in composed', () => {
                    expect(testInstance.combineAllNames()).toEqual('Alpha-Beta-Gamma');
                })

                it('throws when non MST item type passed', () => {
                    expect(() => {
                        MobxCollection('Not a model');
                    }).toThrowError('')
                })
            })

            describe('config propName', () => {
                let CustomNamedItemCollection = types
                    .compose(TestContainerType, MobxCollection(TestItemType, {
                        propName: 'units'
                    }))
                    .named('CustomName');

                let customNameInstance = CustomNamedItemCollection.create({
                    units: getTestItems()
                })

                it('allows naming of the items property', () => {
                    expect(customNameInstance).toHaveProperty('units');
                    expect(customNameInstance.units).toHaveLength(3);
                    expect(customNameInstance.get('123')).toHaveProperty('name', 'Alpha');

                })

                it('items property is reflected in mst JSON path', () => {
                    expect(getPath(customNameInstance.units[0])).toEqual('/units/0');
                })
            })

            describe('config orElseNext, orElsePrev', () => {
                let CustomCollection = types
                    .compose(TestContainerType, MobxCollection(TestItemType, {
                        propName: 'units',
                        orElseNext: () => 'ParentNext',
                        orElsePrev: () => 'ParentPrev'
                    }))
                    .named('CustomName');

                let customInstance = CustomCollection.create({
                    units: getTestItems()
                })

                it('uses supplier when next is called on last item', () => {
                    expect(customInstance.next('789')).toEqual('ParentNext')
                })

                it('uses supplier when prev is called on first item', () => {
                    expect(customInstance.prev('123')).toEqual('ParentPrev')
                })
            })

            describe('override methods', () => {
                let ContainerWithOverride = types.model({}).actions(self => ({
                    find() {
                        return 'Override find method'
                    }
                }))

                let OverrideMethodsType = types
                    // Order is important
                    .compose(MobxCollection(TestItemType), ContainerWithOverride)
                    .named('CustomName');

                let overrideInstance = OverrideMethodsType.create({
                    items: getTestItems()
                })

                it('allows for collections methods to be overridden', () => {
                    expect(overrideInstance.find()).toEqual('Override find method');
                })
            })

            describe('resolvePath', () => {
                it('collection items can be found with resolvePath', () => {
                    let item = resolvePath(testInstance, '/items/0');

                    expect(item).toBeDefined();
                    expect(item.id).toEqual('123');
                    expect(item.name).toEqual('Alpha');
                })
            })

        })

        describe('.get([id])', () => {
            it('finds items by ID', () => {
                expect(testInstance.get('123')).toHaveProperty('name', 'Alpha');
                expect(testInstance.get('456')).toHaveProperty('name', 'Beta');
                expect(testInstance.get('789')).toHaveProperty('name', 'Gamma');
            })

            it('throws on not found', () => {
                expect(() => {
                    testInstance.get('911');
                }).toThrowError('Item \'911\' not found in items');
            })
        })

        describe('.get([path], "path")', () => {
            it('find items by path', () => {
                expect(testInstance.get('/items/0', 'path')).toHaveProperty('name', 'Alpha');
                expect(testInstance.get('/items/1', 'path')).toHaveProperty('name', 'Beta');
                expect(testInstance.get('/items/2', 'path')).toHaveProperty('name', 'Gamma');
            })

            it('throws on not found', () => {
                expect(() => {
                    testInstance.get('/items/999');
                }).toThrowError('Item \'/items/999\' not found in items');
            })
        })

        describe('.find([attr], [value])', () => {
            it('returns an item by dynamic property name', () => {
                expect(testInstance.find('name', 'Alpha')).toHaveProperty('id', '123')
                expect(testInstance.find('name', 'Beta')).toHaveProperty('id', '456')
                expect(testInstance.find('name', 'Gamma')).toHaveProperty('id', '789')
            })

             it('throws on not found', () => {
                expect(() => {
                    testInstance.find('name', 'Scooby');
                }).toThrowError('Item matching name=Scooby not found in items');
            })
        })

        describe('.at([index])', () => {
            it('gets the model at the specified index', () => {
                expect(testInstance.at(0)).toHaveProperty('name', 'Alpha');
                expect(testInstance.at(1)).toHaveProperty('name', 'Beta');
                expect(testInstance.at(2)).toHaveProperty('name', 'Gamma');
            })

            it('returns undefined on invalid input', () => {
                expect(testInstance.at(null)).toBeNull();
                expect(testInstance.at(undefined)).toBeNull();
                expect(testInstance.at('')).toBeNull();
                expect(testInstance.at(9999)).toBeNull();
            })
        })

        describe('.findIndex([id])', () => {
            it('returns the index of an item with matching id', () => {
                expect(testInstance.findIndex('123')).toEqual(0);
                expect(testInstance.findIndex('456')).toEqual(1);
                expect(testInstance.findIndex('789')).toEqual(2);
            })
        })

        describe('.indexOf([item])', () => {
            it('returns the index value of an item', () => {
                // in practice the item will have been retrieved
                // through other methods (not calling _items array)
                expect(testInstance.indexOf(testInstance._items[0])).toEqual(0);
                expect(testInstance.indexOf(testInstance._items[1])).toEqual(1);
                expect(testInstance.indexOf(testInstance._items[2])).toEqual(2);
            })

            it('type-checks the input', () => {
                expect(() => {
                    testInstance.indexOf({ scooby: 'doo' })
                }).toThrowError()
            })

            it('throws on not found', () => {
                expect(() => {
                    let testItem = TestItemType.create({ name: 'Scooby', id: 'doo' });
                    let result = testInstance.indexOf(testItem);
                    throw new Error(`Found index ${result}`);
                }).toThrowError('Item with id \'doo\' not found in items')
            })
        })

        describe('.first', () => {
            it('returns the first item in collection', () => {
                expect(testInstance.first).toHaveProperty('name', 'Alpha');
            })
        })

        describe('.last', () => {
            it('returns the last item in collection', () => {
                expect(testInstance.last).toHaveProperty('name', 'Gamma');

                testInstance.add({
                    name: 'Delta',
                })

                expect(testInstance.last).toHaveProperty('name', 'Delta');
            })
        })

        describe('.isEmpty', () => {
            it('returns false when collection has items', () => {
                expect(testInstance.isEmpty).toBe(false);
            })

            it('returns true when collection has no items', () => {
                let EmptyItemCollection = types
                    .compose(TestContainerType, MobxCollection(TestItemType))
                    .named('Empty');

                let emptyInstance = EmptyItemCollection.create({ units: [] });

                expect(emptyInstance.isEmpty).toBe(true);

                emptyInstance.add({ name: 'Alpha' })

                expect(emptyInstance.isEmpty).toBe(false);
            })
        })

        describe('.next()', () => {
            it('finds an item by id and returns the next item', () => {
                let item = testInstance.next('456');

                expect(item).toBeDefined();
                expect(item.id).toEqual('789');
            })

            it('find an item by path and returns next item', () => {
                let item = testInstance.next('/items/1', 'path');

                expect(item).toBeDefined();
                expect(item.id).toEqual('789');
            })

            it ('loops back to the first item at end of collection', () => {
                let item = testInstance.next('789');

                expect(item).toBeDefined();
                expect(item.id).toEqual('123');
            })
        })

        describe('.prev()', () => {
            it('finds an item by id and returns the previous item', () => {
                let item = testInstance.prev('456');

                expect(item).toBeDefined();
                expect(item.id).toEqual('123');
            })

             it('find an item by path and returns previous item', () => {
                let item = testInstance.prev('/items/1', 'path');

                expect(item).toBeDefined();
                expect(item.id).toEqual('123');
            })

            it ('loops back to the first item at end of collection', () => {
                let item = testInstance.prev('123');

                expect(item).toBeDefined();
                expect(item.id).toEqual('789');
            })
        })

        describe('.add([item])', () => {
            it('adds an instance of item type to the collection', () => {
                expect(testInstance.items).toHaveLength(3);

                testInstance.add(TestItemType.create({
                    id: 'abc', name: 'Delta'
                }));

                expect(testInstance.items).toHaveLength(4);
                expect(testInstance.items[3]).toHaveProperty('id', 'abc');
                expect(testInstance.items[3]).toHaveProperty('name', 'Delta');
            })

            it('adds an object of correct shape to the collection', () => {
                expect(testInstance.items).toHaveLength(3);

                testInstance.add({
                    id: 'abc', name: 'Delta'
                })

                expect(testInstance.items).toHaveLength(4);
                expect(testInstance.items[3]).toHaveProperty('id', 'abc');
                expect(testInstance.items[3]).toHaveProperty('name', 'Delta');
            })

            it('throw when item doesnt match item type model', () => {
                expect(() => {
                    testInstance.add({
                        animal: 'dog'
                    })
                }).toThrowError()
            })

            it('adds an object with extra keys', () => {
                testInstance.add({
                    name: 'Scooby',
                    animal: 'dog'
                })

                expect(testInstance.items).toHaveLength(4);
                expect(testInstance.items[3]).toHaveProperty('name', 'Scooby');
            })

            it('adds an identifier if missing', () => {
                expect(testInstance.items).toHaveLength(3);

                testInstance.add({
                    name: 'Delta'
                })

                expect(testInstance.items).toHaveLength(4);
                expect(testInstance.items[3]).toHaveProperty('name', 'Delta');
                expect(testInstance.items[3]).toHaveProperty('id');
                expect(testInstance.items[3].id).toMatch(/^[\d\w]{8}$/);
            })

            it('returns added object', () => {
                expect(testInstance.items).toHaveLength(3);

                let newItem = testInstance.add({
                    name: 'Delta'
                })

                expect(newItem).toHaveProperty('id');
                expect(newItem.id).toMatch(/^[\d\w]{8}$/);
            })
        })
    })
})
