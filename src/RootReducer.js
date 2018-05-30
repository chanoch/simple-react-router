import invariant from 'invariant';
/**
 * Standard React reducer for state for the react router. It uses the route configuration 
 * to try and resolve correct reducer for the given redux action. 
 * 
 * If a matching reducer for the given  action cannot be found, it will return the default
 * driver's reducer. (This will usually return the state unchanged)
 */
export default function RootReducer(actionConfigs, defaultDriverInstance) {
    invariant(actionConfigs, 'ActionConfigs must contain an array of actions');
    invariant(defaultDriverInstance, 'A non-null default driver must be provided.');
    
    const reducerActions = actionConfigs.filter(action => action.driverInstance.reducer);
    const defaultDriver = defaultDriverInstance;

    return function(state, action) {
        var matchingConfig = reducerActions.find(config => config.driverInstance.type===action.type);
        matchingConfig = matchingConfig?matchingConfig.driverInstance:defaultDriver;
        return matchingConfig.reducer(state, action);
    }
}