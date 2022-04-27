import { types } from "mobx-state-tree";
import { pick as _pick } from 'lodash';
import { MobxNamedItem } from "context/models/constructs";
import { newUuid } from "utils/uuid";

export const MobxCategoryItem = MobxNamedItem
    .named('MobxCategoryItem')

export const MobxAppItem = types
    .model('MobxAppItem', {
        id: types.identifier,
        name: types.string,
        categories: types.array(MobxCategoryItem),
        windowName: types.maybeNull(types.string)
    })
    .actions(self => ({
        update(attrs) {
            let safeAttributes = _pick(attrs, ['name', 'windowName'])
            self = Object.assign(self, safeAttributes);
        },
        addCategory(name='New Category') {
            self.categories.unshift(MobxCategoryItem.create({
                id: newUuid(), name
            }))
        },
        removeCategory(id) {
            self.categories = self.categories.filter(i => i.id !== id);
        }
    }))

export const MobxAppList = types
    .model('MobxAppList', {
        appList: types.array(MobxAppItem),
        selectedApp: types.maybeNull(types.reference(MobxAppItem)),
        editApp: types.maybeNull(types.reference(MobxAppItem)),
    })
    .actions(self => ({
        addNewApp() {
            self.appList.unshift(MobxAppItem.create({
                id: newUuid(), name: 'New App'
            }));
        },
        removeApp(id) {
            self.appList = self.appList.filter(a => a.id !== id);
        },
        setActiveApp(appId) {
            self.selectedApp = self.appList.find(a => a.id === appId);
        },
        clearSelectedApp() {
            self.selectedApp = null;
        },
        setEditApp(appId) {
            self.editApp = self.appList.find(a => a.id === appId);
        },
        clearEditApp() {
            self.editApp = null;
        },
        findByWindowName(windowName) {
            return self.appList.find(a => a.windowName === windowName) || null;
        }
    }))