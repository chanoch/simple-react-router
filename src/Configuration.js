

export default class Configuration {
    constructor(mountpath, config, history) {
        this.mountpath = mountpath;

        this.initConfig = this.initConfig.bind(this);
        this.rootReducer = this.rootReducer.bind(this);
        this.initNullDriver = this.initNullDriver.bind(this);

        this.config = this.initConfig(mountpath, config);
        this.routes = this.config.routes;

        this.enhancers = this.initEnhancers(config, history);


        this.nullDriver = this.initNullDriver();
        this.initialDriver = this.initInitialDriver();
    }

    rootReducer() {
        return function(state, action) {
            var matchingConfig = this.config.routes.find(
                routeConfig => routeConfig.driver.type===action.type);
            matchingConfig = matchingConfig||this.nullDriver;
            return matchingConfig.driver.reducer(state, action);
        }
    }

    initConfig(mountpath, config) {
        var config = this.instantiateDrivers(config);
        config = this.configureMountpath(config, mountpath);
        return config;
    }

    instantiateDrivers(config) {
        config.routes = config.routes.map(routeConfig => {
            routeConfig.driver = routeConfig.driver();
            return routeConfig;
        });
        return config;
    }

    configureMountpath(config, mountpath) {
        config.routes.map(routeConfig => {
            routeConfig.path = mountpath + routeConfig.path;
        });
        return config;
    }

    initEnhancers(config, history) {
        return config.routes.map(routeConfig => 
            routeConfig.driver.middleware(routeConfig.driver.path, history)
        );
    }

    initInitialDriver(config) {
        return this.config.routes.find(routeConfig => routeConfig.initial)||this.nullDriver;
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