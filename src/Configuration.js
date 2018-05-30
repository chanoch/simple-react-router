import invariant from 'invariant';

import NullDriver from './NullDriver';
import RootReducer from './RootReducer';
import RouteConfiguration from './RouteConfiguration';
import ErrorRoute from './ErrorRoute';
/**
 * SimpleReactRouter application configuration. This is a executable configuration which
 * hydrates a json config.
 * 
 * An example configuration is shown below:
 * 
 * var config = {
 *    initialState: {
 *      posts: [],
 *      post: []
 *    },
 *    actionConfigs: [{
 *        route: "/",
 *        driver: ListPostsAction, 
 *        page: (store) => <ListPostsPage store={store} />
 *    },{
 *        driver: ReceivePostsAction
 *    },{
 *        route: "/post/:post_id",
 *        driver: ViewPostAction,
 *        page: (store) => <ViewPostPage store={store} />
 *    },{
 *        driver: ReceivePostAction
 *    },{
 *        route: "/error",
 *        page: (store) => <Http404Page store={store} />
 *    }]
 * };
 * 
 * The initial state is optional, an empty object will be instantiated if not provided. This simply
 * allows pages to naivly access state objects before the state is loaded. 
 * 
 * It is probably safer to error check for the existence of state before attempting to access it 
 * but I would recommend it as a way to document the structure of your state for later reference.    
 * 
 * The action configs array represents a series of app routes - URL paths which map to react
 * components to be rendered in the root. The path is given by the route property. Actions which
 * are dispatched to make in-page updates do not have a path and so the browser address and the
 * navigation history are not updated.
 * 
 * A driver is of type {@see Driver} which provides dispatches actions, provides middleware to 
 * mutate the state, and reduces the state according to its action. 
 * 
 * If a driver is not provided, a {@see NullDriver} will be has no affect on the application 
 * except to change the browser location (or URL). The associated page component against the 
 * configuration will be rendered. 
 * 
 * The {@prop page} property represents the react component which should be rendered for the 
 * route. It receives a store prop which contains the application state for the page to use
 * in rendering. 

     * Instantiate the configuration:
     * 
     * - Prepend the mountpath to the application paths.
     * - Instantiate the configuration Drivers {@see Driver}
     * - Configure the application routes including path variables (more below)
     * - Configure redux middleware that will load and update application data
     * 
     * @param {string} mountpath - the part of the path on which the application is mounted. 
     * By default this value is '/clearblog'. It is possible to mount with a null, undefined or /
     * mountpath 
     * @param {*} config - the route and action configuration. See class docs
  */
export default function Configuration(mountpath, config, history) {
    const actionConfigs = config.actionConfigs; // original config

    const appConfig = instantiateDrivers(config, new NullDriver());
    const routes = configureRoutes(appConfig, mountpath);

    const initialState = config.initialState;
    initialState.routes = configureRoutesInState(routes);
    
    const rootReducer = new RootReducer(actionConfigs, new NullDriver());
    const enhancers = initEnhancers(routes);

    return {
        appConfig,
        routes,
        initialState,
        rootReducer,
        enhancers,
    }
}

/**
 * INITIALISATION FUNCTIONS
 */

function configureRoutesInState(routes) {
    const routesByName = {};
    routes.forEach(route => {
        routesByName[route.name] = route.route;
    });
    return routesByName;
}

/**
 * Instantiate the driver for each configuration. If no driver has been specified,
 * this will provide the config with a default driver.
 * 
 * The default driver is usually a null driver - which has no impact.
 * 
 * TODO - immutable.js?
 */
function instantiateDrivers(config, defaultDriverInstance) {
    config.actionConfigs.forEach(action => {
            action.driverInstance=action.driver?action.driver():defaultDriverInstance;
    });
    return config;
}

/**
    // filter out in-page actions
    // configure mountpath and path variables (:variable_name)
    // add default error handler
 * 
 * @param {*} config 
 * @param {*} mountpath 
 */
function configureRoutes(config, mountpath) {

    var routes = config.actionConfigs
        .filter(actionConfig => actionConfig.path) // find configs with a uri defined
        .map(actionConfig => new RouteConfiguration(mountpath, actionConfig)); // hydrate
    const errorRoute = new ErrorRoute()
    routes.push(new ErrorRoute(mountpath)); // TODO add default error route
        return routes;
}

/**
 * Get a list of action configurations which have a middleware defined and
 * return an array of those redux state enhancers functions
 * 
 * @param {ActionConfig} actionConfigs 
 */
function initEnhancers(routes) {
    invariant(routes.filter(actionConfig => !actionConfig.driverInstance).length===0, 'Routes must have instantiated drivers')
    return routes
        .filter(actionConfig => actionConfig.driverInstance.middleware)
        .map(actionConfig => actionConfig.driverInstance.middleware());
}
