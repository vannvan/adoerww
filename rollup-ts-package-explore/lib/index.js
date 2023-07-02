(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.tools = {}));
}(this, (function (exports) { 'use strict';

	/** @format */
	console.log('hello world');
	var genKey = function () { return Math.random(); };

	exports.genKey = genKey;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
