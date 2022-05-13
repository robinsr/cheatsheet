import short from 'short-uuid';

const uuid = short();

export const newUuid = () => {
    return uuid.new();
}

/**
 * Returns a function similar to debounce or throttle, but will
 * only invoke func when a predicate returns true
 * @param predicate - test to determine argument difference and return new memo value
 * @param func - function to gate
 * @returns {(function(...[*]): void)|*}
 */
export function gate(predicate, func) {
    let memo;

    return function (...args) {
        let [ result, store ] = predicate(memo, args);

        if (result) {
            memo = store;
            func.call(this, ...args);
        }
    }
}

export const increment = (val) => val + 1;
export const decrement = (val) => val - 1;

export * from './logger';
export * from './dom';
export * from './canvas_renderer';
