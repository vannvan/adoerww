"use strict";
/*
 * @Author: Cookie
 * @LastEditors: Cookie
 * @LastEditTime: 2021-07-25 21:28:29
 * @Description: request 模块
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.methodV = exports.gitPost = void 0;
var file_1 = require("@/util/file");
var util_1 = require("@/util");
var request_1 = __importDefault(require("request"));
var defaultConfig = file_1.loadFile(util_1.getDirPath('../config/default.config.json')); // 读取本地配置
var GIT_URL = defaultConfig.GIT_URL;
var qs = require("qs");
/**
 * @author: Cookie
 * @description: 不带 version 的 api 请求
 */
var gitPost = function (_a) {
    var url = _a.url, _b = _a.params, params = _b === void 0 ? {} : _b, _c = _a.query, query = _c === void 0 ? {} : _c;
    return __awaiter(void 0, void 0, void 0, function () {
        var sendUrl;
        return __generator(this, function (_d) {
            sendUrl = "" + GIT_URL + url + "?" + qs.stringify(query);
            try {
                return [2 /*return*/, new Promise(function (resolve) {
                        request_1.default({
                            url: url,
                            method: "POST",
                            json: true,
                            headers: {
                                "content-type": "application/json",
                            },
                            body: JSON.stringify(params)
                        }, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var data = body.data, code = body.code;
                                resolve({ data: data, code: code });
                            }
                        });
                    })];
            }
            catch (error) {
                throw (error);
            }
            return [2 /*return*/];
        });
    });
};
exports.gitPost = gitPost;
/**
 * @author: Cookie
 * @description: 带 version 的通用 api 请求
 */
var methodV = function (_a) {
    var url = _a.url, method = _a.method, _b = _a.params, params = _b === void 0 ? {} : _b, _c = _a.query, query = _c === void 0 ? {} : _c;
    return __awaiter(void 0, void 0, void 0, function () {
        var sendUrl;
        return __generator(this, function (_d) {
            sendUrl = GIT_URL + "/api/v4" + url;
            if (query) {
                sendUrl = sendUrl + "?" + qs.stringify(query);
            }
            try {
                return [2 /*return*/, new Promise(function (resolve) {
                        request_1.default({
                            url: url,
                            method: method,
                            json: true,
                            headers: {
                                "content-type": "application/json",
                            },
                            body: JSON.stringify(params)
                        }, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var data = body.data, code = body.code;
                                resolve({ data: data, code: code });
                            }
                        });
                    })];
            }
            catch (error) {
                throw (error);
            }
            return [2 /*return*/];
        });
    });
};
exports.methodV = methodV;
