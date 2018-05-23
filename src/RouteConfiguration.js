import toRegex from 'path-to-regexp';

export default class RouteConfiguration {
    constructor(mountpath, actionConfig) {
        if(!actionConfig) { 
            throw new Error('ActionConfig is null or undefined - please check your configuration');
        }
        this.route = this.setRoute(mountpath, actionConfig.route);

        this.keys = []; // the list of path params (e.g. /mountpath/action-path/:param?param2=:param2)
        this.pattern = toRegex(this.route, this.keys);

        this.matchRoute = this.matchRoute.bind(this);
    }

    setRoute(mountpath, actionConfigRoute) {
        // make sure that mountpath has a leading slash and no training slash

        var root=mountpath?mountpath:""; // if mountpath is null, set to mount on root of site
        root=root.match(/^\/.*/)?root:`/${root}`; //' add leading slash if missing
        root=root.match(/^.*\/$/)?root.substring(0,root.length-1):root; // chop off trailing slash
        root=root.length>1?root:""; // if root is just slash then mountpath is empty (load on root of site)
        var path=actionConfigRoute?actionConfigRoute:""; // if route is null, load to root of site
        path=path.match(/^\/.*/)?path:`/${path}`; // add leading slash to path if missing
        return `${root}${path}`; // mount application
    }

    matchRoute(uri) {
        const pathMatched = this.pattern.exec(uri);
        return pathMatched&&new RouteMatch(pathMatched, this.keys, this.driver);
    }
}

export class RouteMatch {
    /**
     * An route match instance which parses for URL params based on the specific location
     * passed into it. 
     * 
     * @param {RegExpExecArray} pathMatch - an array of tokens based on the regexp execution 
     * @param {*} keys - the list of parameter keys (:param) to extract from the URI
     * @param {*} driverInstance - the driver which will load the required data
     */
    constructor(pathMatch, keys, driverInstance) {
        this.pathMatch = pathMatch;
        this.keys = keys;
        this.driver = driverInstance;
        this.params = {};

        this.parseParams = this.parseParams.bind(this);
        this.pathMatch && this.parseParams();
    }

    // TODO js this
    parseParams() {
        const match = this.pathMatch;
        for (let i = 1; i < match.length; i++) {
            this.params[this.keys[i-1].name] =
            match[i] !== undefined ? match[i] : undefined;
        }
    }
}