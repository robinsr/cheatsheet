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
        unknownApp: types.maybeNull(types.string),
        ignoreApps: types.array(types.string)
    })
    .views(self => ({
        getById(id) {
            return self.appList.find(app => app.id === id) || null;
        }
    }))
    .actions(self => ({
        addNewApp(name='New App', windowName='') {
            let newApp = MobxAppItem.create({
                id: newUuid(), name, windowName
            });

            self.appList.unshift(newApp);
            self.selectedApp = newApp;

            return newApp;
        },
        removeApp(id) {
            let app = self.getById(id);
            self.appList.splice(self.appList.indexOf(app), 1);
        },
        setActiveApp(appId) {
            self.selectedApp = self.getById(appId);
        },
        clearSelectedApp() {
            self.selectedApp = null;
        },
        setEditApp(appId) {
            self.editApp = self.getById(appId);
        },
        clearEditApp() {
            self.editApp = null;
        },
        findByWindowName(windowName) {
            return self.appList.find(a => a.windowName === windowName) || null;
        },
        setUnknownAppName(appName) {
            self.unknownApp = appName
        },
        clearUnknownAppName() {
            self.unknownApp = null;
        },
        ignoreApp(appName) {
            self.ignoreApps.unshift(appName);
        }
    }))