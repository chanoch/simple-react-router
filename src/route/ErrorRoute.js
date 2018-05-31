import RouteConfiguration from "./RouteConfiguration";
import NullDriver from "../NullDriver";

/**
 * The default route which loads the error component into the page to identify 404s and
 * 500s
 */
export default function ErrorRoute(mountpath) {
    const page = function(store) {
        <p>Error</p>
        // const error = new Error(`Route not found`);
        // error.status = 404;
        // throw error;                        
    }
    const driverInstance = new NullDriver();
    return {
        route: mountpath + "/error",
        driver: NullDriver,
        driverInstance,
        matchRoute(uri) {
            let actionConfig = {route: "/error", driverInstance, page};
            return new RouteConfiguration(mountpath, actionConfig);
        }
    }
}