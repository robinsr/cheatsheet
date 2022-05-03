import { types } from 'mobx-state-tree';

/**
 * Cursor is essentially a router.
 *
 * /:layout-type/[:layout-focus]/window-type/
 *
 */

const PATH = '/app/:appId/item/:itemId#target';
const TARGET = '#:window/element';

const CursorStore = types.model('cursor', {
    current: types.optional(types.string, '')
})
.views(self => ({
    get path() {

    },

    get target() {

    },
    get window() {

    },
    get
}))
.actions(self => ({
    setCursor(val) {

    },
    setTarget(val) {

    },
    clearTarget() {

    },
    setWindow() {

    },
    clearWindow() {

    }
}))