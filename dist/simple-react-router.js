(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("simple-react-router", [], factory);
	else if(typeof exports === 'object')
		exports["simple-react-router"] = factory();
	else
		root["simple-react-router"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/SimpleReactRouter.js":
/*!**********************************!*\
  !*** ./src/SimpleReactRouter.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed: SyntaxError: Unexpected token, expected , (53:32)\n\n\u001b[0m \u001b[90m 51 | \u001b[39m        \u001b[36mthis\u001b[39m\u001b[33m.\u001b[39mrender \u001b[33m=\u001b[39m \u001b[36mthis\u001b[39m\u001b[33m.\u001b[39mrender\u001b[33m.\u001b[39mbind(\u001b[36mthis\u001b[39m)\u001b[33m;\u001b[39m\n \u001b[90m 52 | \u001b[39m\n\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 53 | \u001b[39m        \u001b[36mthis\u001b[39m\u001b[33m.\u001b[39mrender(\u001b[33m--\u001b[39mcomponent which matches location\u001b[33m--\u001b[39m)\n \u001b[90m    | \u001b[39m                                \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\n \u001b[90m 54 | \u001b[39m\n \u001b[90m 55 | \u001b[39m        \u001b[90m// listen for state changes, invoking render on updates\u001b[39m\n \u001b[90m 56 | \u001b[39m        \u001b[36mthis\u001b[39m\u001b[33m.\u001b[39mhistory\u001b[33m.\u001b[39mlisten(\u001b[36mthis\u001b[39m\u001b[33m.\u001b[39mrender)\u001b[33m;\u001b[39m\u001b[0m\n");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SimpleReactRouter = __webpack_require__(/*! ./SimpleReactRouter */ "./src/SimpleReactRouter.js");

var _SimpleReactRouter2 = _interopRequireDefault(_SimpleReactRouter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _SimpleReactRouter2.default;

/***/ })

/******/ });
});
//# sourceMappingURL=simple-react-router.js.map