/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/inject.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/inject.js":
/*!***********************!*\
  !*** ./src/inject.js ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_chrome_client_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/chrome-client.js */ "./src/lib/chrome-client.js");
// console.log(' ====>>> ', $)
 // console.log('注入页面inject')
// var iframe = document.createElement('iframe')
// iframe.width = 400
// iframe.height = 800
// iframe.src = getURL('home.html')
// iframe.style.cssText = 'position: fixed;right: 0;top: 0;'

var rightFixed = document.createElement('div');
rightFixed.style.cssText = 'width:400px;height:100vh;position:fixed;top:0;right:0;background:#fff;z-index:999';
document.body.appendChild(rightFixed);

var sendMessageToBackground = function sendMessageToBackground(action, options, callback) {
  chrome.runtime.sendMessage('', {
    sign: 'signShope',
    action: action,
    data: options
  }, callback);
}; //这里为接收background参数的回调函数


var getHtmlEnd = function getHtmlEnd(data) {
  console.log(data);
};

sendMessageToBackground('getHtml', {
  key: 'aaaa'
}, getHtmlEnd);

/***/ }),

/***/ "./src/lib/chrome-client.js":
/*!**********************************!*\
  !*** ./src/lib/chrome-client.js ***!
  \**********************************/
/*! exports provided: getURL, getInContext, request, sendRequest, getExtension, lStorage, setlStorage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getURL", function() { return getURL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getInContext", function() { return getInContext; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "request", function() { return request; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sendRequest", function() { return sendRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getExtension", function() { return getExtension; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lStorage", function() { return lStorage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setlStorage", function() { return setlStorage; });
// chrome.extension(getURL , inIncognitoContext , lastError , onRequest , sendRequest)
function getURL(url) {
  if (!url) return;
  return chrome.extension.getURL(url);
}
function getInContext() {
  return chrome.extension.inIncognitoContext;
}
function request() {
  return chrome.extension.onRequest;
}
function sendRequest() {
  return chrome.extension.sendRequest;
}
function getExtension() {
  return chrome.extension;
}
function lStorage() {
  return chrome.storage;
}
function setlStorage(key, v) {}

/***/ })

/******/ });