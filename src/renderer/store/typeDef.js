/**
 * @interface CollectionStore
 * @description Reusable methods for items in a mobx collection
 * @template T
 * @property {function(id: string): T} item - Looks-up an item by ID
 * @property {function(id: string): number} index - Looks up an item by ID and returns its index position
 * @property {function(index: number): T} at - Returns the element at specified index
 * @property {function(): T} first - Returns the first element
 * @property {function(): T} last - Returns the last element
 * @property {function(id: string): T} next - Returns the next element in the collection
 * @property {function(id: string): T} prev - Returns the prev element in the collection
 */