# simple-react-router
Implementation of a simple react router

This is an implementation of Konstantin Tarkus's alternative to react router from [You might not need React Router](https://medium.freecodecamp.org/you-might-not-need-react-router-38673620f3d "Konstantin Tarkus's article on an alternative to react router")

In Konstantin's system, an array of routes together with the root level 'page' component that will render the root to the router. This array is used with the history component to integrate with the browser's navigation and redux to support navigation through the application.

To create an application using simple-react-router:

## Without redux configuration

```javascript
import HomePage from './HomePage';

const routes = [
    { path: '/', action: () => <HomePage /> },
    { path: '/index.html', action: () => <HomePage /> },
];

import {SimpleReactRouter} from '@chanoch/simple-react-router';
const router = new SimpleReactRouter(routes); 
```

## With redux configuration

1. Define the routes 
2. Define reducers and initial state
3. Define middleware 
4. Create your initial route
5. Instantiate the router
6. Load async server data

You can optionally dispatch a state on loading of application data from the server

## 0. Setting up your application
The Single Page Application's (SPA's) HTML page is a standard react page which contains the following div to mount the application to:

```javascript
        <div id="root"></div>
```
The HTML page must also include an import for javascript for your application. I use webpack to bundle my JS and dependencies but I import the files statically into the page - can't remember why. There is a webpack mechanism for injecting the scripts into the page at the end of each page.

The reducers, redux middlware, and action creators are all standard redux mechanisms so you will need to define those according to the redux standards.

## 1. Define your routes

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

## 2. Define reducers and initial state
A redux reducer modifies the state according to the state change which just occurred. It shouldn't have side-effects.

```javascript

export function createMealPlanReducer(state, action) {
    return {
        ...state,
        mealPlan: action.mealPlan,
        action: CREATE_MEAL_PLAN
    }
}
```


## 3. Define middleware
The middlware will be injected with the state and the history object. This means that middlware
can both mutate the state and navigate.

## 4. Create initial route
## 5. Instantiate the router
## 6. Load async data and dispatch a state change


## TODOs
1. Change the application to include a container type top level component to allow alternative mount points and passing in configuration?
2. Link to redux tutorial
3. Link to webpack tut on setting up a simple project
4. Testing

## Change Log
* 0.1 to 0.2 - implemented smart defaulting to null implementations for state, middleware, and reducer, Moved routes parameter which defines valid navigation to front of list to make those related to redux optional.