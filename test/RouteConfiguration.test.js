import RouteConfiguration, { RouteMatch } from '../src/RouteConfiguration'; 
import toRegex from 'path-to-regexp';

const path = 'https://myserver/mountpath/some-path/';
const paramPath = 'https://myserver/mountpath/some-path/:id';
const paramsPath = 'https://myserver/mountpath/some-path/:id/:second_param';

test('Test RouteMatch against uri without params is matched', () => {
    const uri = 'https://myserver/mountpath/some-path/';

    const pattern = toRegex(path, []);
    const pathMatch = pattern.exec(uri);
    const route = new RouteMatch(pathMatch, [], null);
    expect(route).toHaveProperty('pathMatch');
});

test('Test RouteMatch with non-matching uri has falsy (null) pathMatch', () => {
    const uri = 'https://myserver/mountpath/some-pith/';

    const pattern = toRegex(path, []);
    const pathMatch = pattern.exec(uri);
    const route = new RouteMatch(pathMatch, [], null);
    expect(route.pathMatch).toBeFalsy();
});

test('Test RouteMatch with one param uri - finds the param', () => {
    const uri = 'https://myserver/mountpath/some-path/2';
    const keys = [];
    const pattern = toRegex(paramPath, keys);
    const pathMatch = pattern.exec(uri);
    const route = new RouteMatch(pathMatch, keys, null);
    expect(route.params['id']).toEqual('2');
});

test('Test RouteMatch with two params uri', () => {
    const uri = 'https://myserver/mountpath/some-path/2/my-blog-name';
    const keys = [];
    const pattern = toRegex(paramsPath, keys);
    const pathMatch = pattern.exec(uri);
    const route = new RouteMatch(pathMatch, keys, null);
    expect(route.params['id']).toEqual('2');
    expect(route.params['second_param']).toEqual('my-blog-name');
});

test('Test uri with two params - trailing slash - finds both params', () => {
    const uri = 'https://myserver/mountpath/some-path/2/my-blog-name/';
    const keys = [];
    const pattern = toRegex(paramsPath, keys);
    const pathMatch = pattern.exec(uri);
    const route = new RouteMatch(pathMatch, keys, null);
    expect(route.params['id']).toEqual('2');
    expect(route.params['second_param']).toEqual('my-blog-name');
});

test('Test uri with two params - trailing slash + extra - fails to parse params', () => {
    const uri = 'https://myserver/mountpath/some-path/2/my-blog-name/some-irrelevance';
    const keys = [];
    const pattern = toRegex(paramsPath, keys);
    const pathMatch = pattern.exec(uri);
    const route = new RouteMatch(pathMatch, keys, null);
    expect(route.params['id']).toBeFalsy;
    expect(route.params['second_param']).toBeFalsy;
});

test('Test uri with missing param - does not resolve the param', () => {
    const uri = 'https://myserver/mountpath/some-path/';
    const keys = [];
    const pattern = toRegex(paramPath, keys);
    const pathMatch = pattern.exec(uri);
    const route = new RouteMatch(pathMatch, keys, null);
    expect(route.params['second_param']).toBeFalsy;
});


test('Test RouteConfiguraton constructor - null mountpath = ', () => {
    const route = new RouteConfiguration(null, {route:'blahblah'});
    expect(route.route).toEqual('/blahblah');
});
test('Test RouteConfiguraton constructor - empty mountpath = ', () => {
    const route = new RouteConfiguration("", {route:'blahblah'});
    expect(route.route).toEqual('/blahblah');
});
test('Test RouteConfiguraton constructor - null actionConfig.route = ', () => {
    const route = new RouteConfiguration("", {route:null});
    expect(route.route).toEqual('/');        
});
test('Test RouteConfiguraton constructor - null actionConfig = ', (done) => {
    try {
        const route = new RouteConfiguration(null, null);
        done.fail('Null action config should throw an error - action configs should have a path and a page or a driver or all three');
    } catch(e) {
        done();
    }    
});
test('Test RouteConfiguraton constructor - empty actionConfig = ', () => {
    const route = new RouteConfiguration(null, {});
    expect(route.route).toEqual('/');        
});
test('Test RouteConfiguraton constructor - no trailing slash mountpath =', () => {
    const route = new RouteConfiguration('mountpath', {route:'blahblah'});
    expect(route.route).toEqual(
        expect.stringMatching(/^\/mountpath\/blahblah/)
    )
});
test('Test RouteConfiguraton constructor - trailing slash mountpath =', () => {
    const route = new RouteConfiguration("mountpath/", {route:'/blahblah'});
    expect(route.route).toEqual(
        expect.stringMatching(/^\/mountpath\/blahblah/)
    )
});
test('Test RouteConfiguraton constructor - slash mountpath = ', () => {
    const route = new RouteConfiguration("/", {route:'/blahblah'});
    expect(route.route).toEqual(
        expect.stringMatching(/^\/blahblah/)
    )
});
    
test('Test RouteConfiguration.matchRoute() with matching uri', () => {
    const route = new RouteConfiguration("/", {route:'/blahblah'});
    const match = route.matchRoute('/blahblah');
    expect(match).toBeTruthy; // returns an object
    expect(match.params).toBeFalsy; // empty params
    expect(match.pathMatch).toBeTruthy; // non-empty pathMatch
});

test('Test RouteConfiguration.matchRoute() with non-matching uri', () => {
    const route = new RouteConfiguration("/", {route:'/blahblah'});
    const match = route.matchRoute('/blahblah1');
    expect(match).toBeNull; 
});

test('Test RouteConfiguration.matchRoute() with matching uri - plus params', () => {
    const route = new RouteConfiguration("/", {route:'/blahblah/:hi'});
    const match = route.matchRoute('/blahblah/1');
    expect(match).toBeTruthy;
    expect(+match.params['hi']).toEqual(1);
});

test('Test duplicate routeConfig - raises warning');