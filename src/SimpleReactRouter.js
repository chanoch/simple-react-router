import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';

import StoreCreator from './StoreCreator';
import Configuration from './Configuration';

/**
 * A react router for simple SPAs.
 * 
 * A history instance (@see https://www.npmjs.com/package/history) owned by this component
 * listens for application transitions (new URL path) and dispatches the related redux
 * actions from a mapping of paths to components which represent a page in the application,
 * given in the SPAs configuration.
 * 
 * Enhancers should be configured to match against the redux state changes which call the 
 * backend or other services and update the state accordingly. 
 * 
 * TODO review docs
 * TODO declassify
 * 
     * The router class constructor accepts a redux root reducer which maps states to the
     * reducers which will update the state. An javascript object representing the initial
     * state of the application.
     * 
     * It accepts a set of middleware which will process any side-effect causing operations
     * on the back of routes which have been invoked.
     * 
     * The last parameter is the full set of routes that should be supported by the router
     * 
     * TODO document this
 */
export default function SimpleReactRouter(mountpath, configuration) {
    const { initialState } = configuration;
    const history = createHistory();
    const config = new Configuration(mountpath, configuration, history);
    
    const store = StoreCreator(
        config.rootReducer,
        initialState,
        config.enhancers
    );

    const renderComponentByLocation = render(history, config.routes, store);

    renderComponentByLocation(history.location);
    history.listen(renderComponentByLocation); // render on location changes
}

/*
* When a page transition has been affected (new location), the router asks
* React to render the new page component. 
* 
* @param {any} component - the top level component to render in the HTML
*/
async function renderPage(page) {
    ReactDOM.render(page, document.getElementById('root'));
}

/**
 * Render the new 'page' given by the route. 
 * 
 * In order for this to work, each path or location in the application need to have
 * the root component for it defined. The page component will be passed the store
 * in the props to extract rendering data. 
 * 
 * 'page' here refers to the fact that
 * the user will perceive the new application state as a new URL and associated
 * HTML page in a traditional server-side HTML application.
 * 
 * const routes = [
 *      { path: '/menuplanner/', action: (store) => <MenuPlanner store={store} /> },
 *      { path: '/menuplanner/selectmenu.html', action: (store) => <ChooseRecipes  store={store}/> },
 * ];
 * 
 * export default routes;
 * 
 * 
 */
function render(history, routes, store) {
    return function(location) {
        resolve(location, routes)
        .then(config => {
             renderPage(config.page(store, history), routes);
             const actionParams = config.matchRoute(location.pathname).params;
             config.driverInstance.dispatchAction(store.dispatch, actionParams);
        })
        .catch(error =>
            resolve({location, error}, routes)
                .then(errorConfig => renderPage(errorConfig.page(store, history)))); 
    }
}

/**
 * Resolve the component to render based on the pathname given as the parameter's
 * property. 
 * 
 * If the location cannot be resolved then throw an error. The resolver will resolve
 * the component configured against /error to render an error page
 * 
 * @param {Object} context - an object containing a pathname to resove or an error 
 * 
 * TODO replace this error approach
 */
async function resolve(context, routes) {
    const uri = context.error ? '/error' : context.pathname;
    return routes.find(route => route.matchRoute(uri));
}
