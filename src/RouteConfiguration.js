import toRegex from 'path-to-regexp';

export default function RouteConfiguration(mountpath, actionConfig) {
    if(!actionConfig) { 
        throw new Error('ActionConfig is null or undefined - please check your configuration');
    }
    const route = setRoute(mountpath, actionConfig.path);
    const driverInstance = actionConfig.driverInstance;

    const keys = []; // the list of path params (e.g. /mountpath/action-path/:param?param2=:param2)
    const pattern = toRegex(route, keys);
    const page = actionConfig.page;

    return {
        route,
        page,
        driverInstance,
        matchRoute(uri) {
            const pathMatched = pattern.exec(uri);
            return pathMatched&&new RouteMatch(pathMatched, keys);
        }
    }
}

/**
 * A route match instance which parses for URL params based on the specific location
 * passed into it. 
 * 
 * @param {RegExpExecArray} pathMatch - an array of tokens based on the regexp execution 
 * @param {*} keys - the list of parameter keys (:param) to extract from the URI
 */
export function RouteMatch(pathMatch, theKeys) {
    const match = pathMatch;
    const keys = theKeys;
    const params = {};

    // TODO js this
    for (let i = 1; pathMatch && i < pathMatch.length; i++) {
        params[keys[i-1].name] =
        pathMatch[i] !== undefined ? pathMatch[i] : undefined;
    }

    return {
        match,
        keys,
        params,
    }
}

function setRoute(mountpath, actionConfigRoute) {
    // make sure that mountpath has a leading slash and no training slash

    var root=mountpath?mountpath:""; // if mountpath is null, set to mount on root of site
    root=root.match(/^\/.*/)?root:`/${root}`; //' add leading slash if missing
    root=root.match(/^.*\/$/)?root.substring(0,root.length-1):root; // chop off trailing slash
    root=root.length>1?root:""; // if root is just slash then mountpath is empty (load on root of site)
    var path=actionConfigRoute?actionConfigRoute:""; // if route is null, load to root of site
    path=path.match(/^\/.*/)?path:`/${path}`; // add leading slash to path if missing
    return `${root}${path}`; // mount application
}