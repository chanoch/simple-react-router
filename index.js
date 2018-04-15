import ReactDOM from 'react-dom';
import toRegex from 'path-to-regexp';
import createHistory from 'history/createBrowserHistory';
import {createStore, applyMiddleware} from 'redux';

/**
 * A light-weight router for simple SPAs which avoids using elements to implement
 * routers. It uses redux to dispatch actions that result in a state change.
 * 
 * A history instance (@see https://www.npmjs.com/package/history) owned by this component
 * listens for application transitions (new URL path) and dispatches the related redux
 * actions from a mapping of paths to root components given in the constructor.
 * 
 * In order to maintain the reducers clean, enhancers can be provided to the application
 * router which modify the state and query the backend for side-effect causing operations
 * like CRUD operations on data sources. 
 */
export class SimpleReactRouter {

    /**
     * The router class constructor accepts a redux root reducer which maps states to the
     * reducers which will update the state. An javascript object representing the initial
     * state of the application.
     * 
     * It accepts a set of middleware which will process any side-effect causing operations
     * on the back of routes which have been invoked.
     * 
     * The last parameter is the full set of routes that should be supported by the router
     * 
     * @param {reducer} rootReducer - a react redux reducer
     * @param {*} initialState - an initial redux store representing the start state
     * @param {*} enhancers - a set of redux middleware
     * @param {*} routes - the set of routes for the applicationn
     */
    constructor(rootReducer, initialState, enhancers, routes) {
        this.history = createHistory();
        this.routes = routes;
        this.store = createStore(rootReducer, initialState, applyMiddleware(...enhancers));

        // bind the object's methods to this
        this.matchURI = this.matchURI.bind(this);
        this.resolve = this.resolve.bind(this);
        this.renderComponent = this.renderComponent.bind(this);
        this.dispatch = this.dispatch.bind(this);
        this.render = this.render.bind(this);

        // render the initial application location
        this.render(history.location);

        // listen for state changes, invoking render on updates
        history.listen(this.render);
    }

    /**
     * Attempt to match the given URI against the path given in the first parameter.
     * 
     * This method uses regular expressions to attempt a match
     * 
     * @param {String} path - the path to match again URI
     * @param {*} uri - the URI for the next location to search for
     * @returns an object with matches or undefined if not matched
     */
    matchURI(path, uri) {
        const keys = [];
        const pattern = toRegex(path, keys); // TODO: Use caching
        const match = pattern.exec(uri);
        if (!match) return null;
        const params = Object.create(null);
        for (let i = 1; i < match.length; i++) {
            params[keys[i-1].name] =
            match[i] !== undefined ? match[i] : undefined;
        }
        return params;
    }

    /**
     * Resolve the component to render based on the pathname given as the parameter's
     * property. If the error property is not undefined, then resolve the error location.
     * 
     * If the pathname cannot be resolved to a component, then throw an error.
     * 
     * @param {Object} context - an object containing a pathname to resove or an error 
     */
    async resolve(context) {
        for (const route of this.routes) {
            const uri = context.error ? '/error' : context.pathname;
            const params = this.matchURI(route.path, uri);
            if (!params) continue;
            const result = await route.action(this.store);
            if (result) return result;
        }
        const error = new Error(`Route ${context.error} not found`);
        error.status = 404;
        throw error;
    }

    /*
     * Render is called when history detects a route 
     * transition. If the route cannot be found then the error component will
     * be rendered.
     * 
     * @param {any} component - the top level component to render in the HTML
     */
    renderComponent(component) {
        ReactDOM.render(component, document.getElementById('root'));
    }

    /**
     * Since the router owns the redux state, dispatch actions should be routed via
     * this component.
     * 
     * An action is an object containing a text type and supporting data required to
     * process the action. 
     * 
     * An action is generally created by an action creator which takes the following
     * form: 
     * 
     * export function archiveMenu(key) {
     *     return {
     *         type: ARCHIVE_MENU,
     *         menu: {key},
     *         archivedAt: Date.now()
     *     }
     * }
     * 
     * @param {Action} action - a component containing the type of action and any 
     * data required to process the action
     */
    dispatch(action) {
        this.store.dispatch(action);
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
     * @param {String} location - 
     */
    render(location) {
        this.resolve(location)
            .then(this.renderComponent)
            .catch(error =>
                this.resolve({location, error})
                    .then(this.renderComponent));
    }
}
