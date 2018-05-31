import toRegex from 'path-to-regexp';
import invariant from 'invariant';

import setRoute from './SetRoute';

export default function routeConfiguration(mountpath, actionConfig) {
    invariant(mountpath, 'Mountpath must be provided');

    invariant(actionConfig, 'ActionConfig is null or undefined - please check your configuration');
    const route = setRoute(mountpath, actionConfig.path);

    const keys = []; // the list of path params (e.g. /mountpath/action-path/:param?param2=:param2)
    const pattern = toRegex(route, keys);
    const parseKeys = routeMatcher(keys);

    return {
        name: actionConfig.name,
        route,
        page: actionConfig.page,
        driverInstance: actionConfig.driverInstance,
        matchRoute(uri) {
            const pathMatched = pattern.exec(uri);
            return pathMatched&&parseKeys(pathMatched);
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
function routeMatcher(keys) {
    return match => {
        const parseParams = paramsParser(keys);
        if(match) {
            const params = parseParams(match);
            return {
                match,
                keys,
                params,
            }
        }
    }
}

function paramsParser(keys) {
    return match => {
        const params = {};
        keys.forEach((key, index) => {
            params[key.name] = match[index+1];
        });
        return params;
    }
}