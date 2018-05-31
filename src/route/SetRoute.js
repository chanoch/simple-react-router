/**
 * Set a route's path by prefixing the path with a mount path.
 * 
 * For example, if the blog is mounted on /clearblog and the 
 * path is /post/ then the route's path is /clearblog/post/
 * 
 * @param {string} mountpath -  the root of the blog
 * @param {string} actionConfigRoute - the route's path
 */
export default function setRoute(mountpath, actionConfigRoute) {
    const root = setRoot(mountpath);

    var path=actionConfigRoute?actionConfigRoute:""; // if route is null, load to root of site
    path=path.match(/^\/.*/)?path:`/${path}`; // add leading slash to path if missing
    return `${root}${path}`; // mount application
}

// make sure that mountpath has a leading slash and no training slash
function setRoot(mountpath) {

    // mount to root if not mountpath
    let root=mountpath?mountpath:"";
    // add leading slash if needed
    root=root.match(/^\/.*/)?root:`/${root}`;
    // chop off trailing slash
    root=root.match(/^.*\/$/)?root.substring(0,root.length-1):root; 
    // if root is just slash then mountpath is empty (load on root of site)
    root=root.length>1?root:"";
    return root;
}