import { types } from 'mobx-state-tree';

/**
 * @typedef {object} StateStore
 * @property {boolean} isLoading
 * @property {boolean} isSaving
 * @property {?string} activeWindow
 * @property {?string} keyScope
 */

const MobxStateStore = types
.model({
    isLoading: types.optional(types.boolean, true),
    isSaving: types.optional(types.boolean, false),
    activeWindow: types.maybeNull(types.string),
    keyScope: types.maybeNull(types.string)
})
.actions(self => ({
    /**
     * Sets active window
     * @name StateStore#setActiveWindow
     * @param {string} name
     */
    setActiveWindow(name) {
        self.activeWindow = name;
    },
    /**
     * @name StateStore#setKeyScope
     * @param {string} val
     */
    setKeyScope(val) {
        self.keyScope = val;
    },
    /**
     * @name StateStore#loading
     * @param {boolean} val
     */
    loading(val) {
        this.isLoading = val;
    },
    /**
     * @name StateStore#saving
     * @param {boolean} val
     */
    saving(val) {
        this.isSaving = val;
    }
}));

MobxStateStore.__defaults = {
    isLoading: true,
    isSaving: false,
    activeWindow: window.cheatsheetAPI.configVal('app.name'),
    keyScope: null
}

export default MobxStateStore;
