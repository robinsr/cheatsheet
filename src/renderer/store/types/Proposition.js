import { types } from 'mobx-state-tree';
import { getLogger } from 'utils';

const log = getLogger('Store');

/**
 * @typedef {object} IProposition
 * @property {string} statement - user prompt
 * @property {Promise<PropResponse>} - promise
 * @property {PromiseState} - state
 */

const PropositionModel = {
    statement: types.string
};

/** @enum */
export const Answer = {
    CONFIRM: 'yes', CANCEL: 'no'
};


export class PropResponse {
    constructor(answer) {
        this.answer = answer;
    }

    static confirm() {
        return new PropResponse(Answer.CONFIRM);
    }

    static cancel() {
        return new PropResponse(Answer.CANCEL);
    }

    isConfirm() {
        return this.answer === Answer.CONFIRM
    }

    isCancel() {
        return this.answer === Answer.CANCEL
    }
}

/** @enum */
export const PromiseState = {
    PENDING: 'pending',
    RESOLVED: 'resolved',
    REJECTED: 'rejected'
}

/**
 * @class IPropositionActions
 * @constructor
 * @param {IProposition} self
 */
const PropositionActions = self => {
    let _affirm, _cancel;
    /** @type {Promise<PropResponse>} */
    let promise = new Promise((resolve, reject) => { _affirm = resolve; _cancel = reject; });
    /** @type {PromiseState} */
    let state = PromiseState.PENDING;

    return {
        getPromise() {
            return promise;
        },
        getState() {
            return state;
        },

        /** @param {PropResponse} answer */
        answer(answer) {
            _affirm(answer);
            state = PromiseState.RESOLVED;
        },

        /** @param {*} err */
        reject(err) {
            _cancel(err);
            state = PromiseState.REJECTED;
        },

        /** @private */
        beforeDestroy: () => {
            promise = undefined;
            log.debug('PromiseType destroyed', self.statement);
        },
    }
}

export const Proposition = types.model(PropositionModel).actions(PropositionActions);


console.log(Proposition)