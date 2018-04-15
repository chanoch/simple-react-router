# simple-react-router
Implementation of a simple react router

This is an implementation of Konstantin Tarkus's alternative to react router from [You might not need React Router](https://medium.freecodecamp.org/you-might-not-need-react-router-38673620f3d "Konstantin Tarkus's article on an alternative to react router")

In Konstantin's system, an array of routes together with the root level 'page' component that will render the root to the router. This array is used with the history component to integrate with the browser's navigation and redux to support navigation through the application.

To create an application using simple-react-router:

1. Define the routes and the top level component that will be rendered for each route. 
2. Define your reducers and the initial state
3. Define any middlware - components which load data and apply operations to mutate the state
4. Create your initial route, defining the entry point for the application
5. Instantiate the router, passing it the above
6. You can optionally dispatch a state on loading of application data from the server

## 0. Setting up your application
The Single Page Application's (SPA's) HTML page is a standard react page which contains the following div to mount the application to:

```javascript
        <div id="root"></div>
```
The HTML page must also include an import for javascript for your application. I use webpack to bundle my JS and dependencies but I import the files statically into the page - can't remember why.

The reducers, redux middlware, and action creators are all standard redux mechanisms so you will need to define those.

```javascript
// Each page component is imported
import MyComponent from './MyComponentPage';

import React from 'react';

// The link between routes or paths in the application are provided in the path property for
// each object in the routes array.
const routes = [
    { path: '/menuplanner/', action: (store) => <MenuPlanner store={store} /> },
    { path: '/menuplanner/selectmenu.html', action: (store) => <ChooseRecipes  store={store}/> },
];

export default routes;
```

## TODOs
1. Change the application to include a container type top level component to allow alternative mount points and passing in configuration?