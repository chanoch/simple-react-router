

/**
 * The default route which loads the error component into the page to identify 404s and
 * 500s
 * 
 * TODO implement the default component. 
 * 
 * TODO Do I need to throw an error? Does that allow some kind of configuration at the app 
 * level for specific users? 
 */
export default class ErrorRoute {
    constructor(mountpath) {
        this.route = mountpath + "/error";
        this.page = this.page.bind(this);
    }

    page(store) {
        const error = new Error(`Route not found`);
        error.status = 404;
        throw error;                        
    }
}