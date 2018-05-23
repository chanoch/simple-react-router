
/**
 * A NullDriver is an implementation which has no affect on state and does not dispatch an 
 * action based on a URL change. 
 * 
 * This driver can be used as a default driver when a URL/Location change does not resolve to
 * a known action. No action will be dispatched and the state will be unchanged.
 * 
 * The resulting page will be loaded on the assumption the state is pre-populated with the required
 * data or no data is required by the page.
 */
export default class NullDriver {
    /**
     * Update the state according to the unrecognised action. 
     * 
     * This is an empty implementation, unrecognised actions don't affect application state 
     * 
     * @param {Object} state - the current application state
     * @param {any} action - this action is ignored since it hasn't matched another driver 
     */
    reducer(state, action) {
        return state;
    }

    dispatchAction(dispatch) {
        return;
    }
}