import {createStore, applyMiddleware} from 'redux';

/**
 * Null state reducer which creates a new state based on applying an action
 * to the old state.
 * 
 * This reducer defaults to returning the existing state (with no side-effects)
 * 
 * @param {Array} state - the old state 
 * @param {Object} action - an action that the reducer can act on
 * @returns {Array} state - the new state 
 */
function nullReducer(state, action) {return state};

/**
 * Implementation of a redux store creator which substitutes null implementations of 
 * the root reducer, initial state, and any redux effect causing enhancers so that
 * it is safe to create without providing implementations and undefined values for the
 * arguments
 */
export default function createReduxStore(rootReducer, initialState, enhancers) {
    const state = initialState || [];
    const reducer = rootReducer || nullReducer;
    const middleware = enhancers || [];

    return createStore(reducer, state, applyMiddleware(...middleware));
}

