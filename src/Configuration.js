import NullDriver from './NullDriver';
import RouteConfiguration from './RouteConfiguration';

/**
 * SimpleReactRouter application configuration. This is a executable configuration which
 * hydrates a the json config.
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
 */
export default class Configuration {
    /**
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
    constructor(mountpath, config) {
        this.mountpath = mountpath;
        this.actionConfigs = this.config.actionConfigs; // original config

        this.nullDriver = new NullDriver();
        this.appConfig = this.instantiateDrivers(config, this.nullDriver);
        this.routes = this.configureRoutes(config, mountpath);

        this.rootReducer = this.initRootReducer(this.actionConfigs, this.nullDriver);
        this.enhancers = this.initEnhancers(history, this.actionConfigs);
    }

    /**
     * INITIALIISATION FUNCTIONS
     */

    instantiateDrivers(config, defaultDriverInstance) {
        config.actionConfigs.forEach(action => {
            action.driver=action.driver?action.driver():defaultDriverInstance;
        });
        return config;
    }

    configureRoutes(config, mountpath) {
        // filter out in-page actions
        const routeConfigs = config.actionConfigs.filter(actionConfig => {
            return actionConfig.route;
        });
        // configure mountpath and path variables (:variable_name)
        const routes = routesConfigs.map(actionConfig => {
            return new RouteConfigureRoute(mountpath, actionConfig);
        });
        // add default error handler
        routes.push(this.errorRoute(mountpath));
        return routes;
    }

    // TODO convert to class
    initRootReducer(actionConfigs, defaultDriverInstance) {
        const reducerActions = actionConfigs.filter(action => action.driver.reducer);
        const defaultDriver = defaultDriverInstance;
        return function(state, action) {
            var matchingConfig = reducerActions.find(config => config.driver.type===action.type);
            matchingConfig = matchingConfig?matchingConfig.driver:defaultDriver;
            return matchingConfig.reducer(state, action);
        }
    }

    initEnhancers(actionConfigs) {
        return actionConfigs
            .filter(action => action.driver.middleware)
            .map(action => action.driver.middleware());
    }
}