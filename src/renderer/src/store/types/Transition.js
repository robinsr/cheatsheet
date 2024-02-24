import { types } from 'mobx-state-tree';


const HistoryTransitionActions = self => {
    return {
        beforeEnter() {

        }
    }
}


const HistoryTransition = types.model({
    from: types.string,
    to: types.string
})
    .actions(HistoryTransitionActions)

export default HistoryTransition;
