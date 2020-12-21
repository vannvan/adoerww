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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/background.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/background.js":
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_chrome__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/chrome */ "./src/lib/chrome.js");

Object(_lib_chrome__WEBPACK_IMPORTED_MODULE_0__["contextMenu"])({
  title: '请使用度娘搜索',
  showSelect: true,
  onclick: function onclick() {
    console.log('heiheihei');
  }
});
console.log('背景脚本');

/***/ }),

/***/ "./src/lib/chrome.js":
/*!***************************!*\
  !*** ./src/lib/chrome.js ***!
  \***************************/
/*! exports provided: contextMenu, insertCss, exceScript, getCurrent, getTabId, getTabId2, getItem, setItem */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "contextMenu", function() { return contextMenu; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "insertCss", function() { return insertCss; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exceScript", function() { return exceScript; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrent", function() { return getCurrent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTabId", function() { return getTabId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTabId2", function() { return getTabId2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getItem", function() { return getItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setItem", function() { return setItem; });
// const chrome = {}
var contextMenus = {}; // 右键菜单

function contextMenu(config) {
  config = config || {};
  contextMenus.title = config.showSelect ? config.title + ': %s' : config.title;
  config.showSelect ? contextMenus.contexts = ['selection'] : null;
  contextMenus.onclick = config.onclick;
  return chrome.contextMenus.create(contextMenus);
} // 插入Css

function insertCss(tabId, link) {
  if (!chrome.tab) {
    console.log(' Sorry, maybe you didn\'t declare tab permission');
    return;
  }

  chrome.tab.insertCss(tabId, {
    file: link.match(/\/?(\w+\.?-?\w+\.css)$/)[1]
  });
} // 插入js

function exceScript(tabId, linkOrCode) {
  if (!chrome.tab) {
    console.log(' Sorry, maybe you didn\'t declare tab permission');
    return;
  }

  chrome.tab.exceScript(tabId, linkOrCode.match(/\.js$/) ? {
    file: linkOrCode.match(/\/?(\w+\.?-?\w+\.js$)/)[1]
  } : {
    code: linkOrCode
  });
} // 获取当前窗口的ID

function getCurrent(callback) {
  if (typeof callback != 'function') return;
  chrome.windows.getCurrent(function (currentWindow) {
    callback && callback(currentWindow.id);
  });
} // 获取当前tabID

function getTabId(callback) {
  if (typeof callback != 'function') return;
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    callback && callback(tabs.length ? tabs[0].id : null);
  });
} // 获取当前tabID2

function getTabId2(callback) {
  if (typeof callback != 'function') return;
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({
      active: true,
      windowId: currentWindow.id
    }, function (tabs) {
      if (callback) callback(tabs.length ? tabs[0].id : null);
    });
  });
} //storage

function getItem(values, callback) {
  if (!chrome.storage) {
    console.log('Sorry, maybe you dont have storage permission');
    return;
  }

  chrome.storage.sync.get(values, function (items) {
    callback && callback(items);
  });
} // storage 保存数据

function setItem(values, callback) {
  chrome.storage.sync.set(values, function () {
    typeof callback == 'function' && callback(values);
  });
}

/***/ })

/******/ });