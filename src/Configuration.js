

export default class Configuration {
    constructor(mountpath, config, history) {
        this.mountpath = mountpath;

        config = this.instantiateDrivers(config);
        this.config = this.configureMountpath(config, mountpath);

        this.actionConfigs = this.config.actionConfigs;
        this.routes = this.initRoutes(config);

        this.nullDriver = this.initNullDriver();
        this.rootReducer = this.initRootReducer();
        this.enhancers = this.initEnhancers(history);
        console.log(this.enhancers);
        this.initialDriver = this.initInitialDriver();
    }

    /**
     * INITIALIISATION FUNCTIONS
     */

    instantiateDrivers(config) {
        config.actionConfigs.forEach(action => {
            action.driver = action.driver();
        });
        return config;
    }

    configureMountpath(config, mountpath) {
        config.actionConfigs.forEach(action => {
            action.route&& (action.route = mountpath + action.route);
        });
        return config;
    }

    initRoutes(config) {
        var routes = config.actionConfigs.filter(actionConfig => {
            return actionConfig.route;
        });
        return routes;
    }

    initRootReducer() {
        const reducerActions = this.actionConfigs.filter(action => action.driver.reducer);
        const nullDriver = this.nullDriver;
        return function(state, action) {
            var matchingConfig = reducerActions.find(config => config.driver.type===action.type);
            matchingConfig = matchingConfig?matchingConfig.driver:nullDriver;
            return matchingConfig.reducer(state, action);
        }
    }

    initEnhancers(history) {
        return this.config.actionConfigs
            .filter(action => action.driver.middleware)
            .map(action => action.driver.middleware(action.path, history));
    }

    initInitialDriver() {
        const initialRoute = this.config.actionConfigs.find((actionConfig) => actionConfig.initial);
        return initialRoute?initialRoute.driver:this.nullDriver;
    }

    initNullDriver() {
        return {
            reducer(state, action) {
                return state;
            },
            dispatchAction(dispatch) {
                return;
            }
        }
    }
}