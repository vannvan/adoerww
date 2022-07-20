"use strict";
/*
 * @Author: Cookie
 * @Date: 2020-07-29 21:23:05
 * @LastEditors: Cookie
 * @LastEditTime: 2021-07-25 21:32:44
 * @Description: gitLab 项目模块 api
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedBranches = exports.deleteProtectedBranches = exports.createProjects = exports.getProjectByUser = exports.getProject = exports.getProjectList = void 0;
var http_1 = require("@/util/http");
/**
 * @author: Cookie
 * @description: 获取工程列表
 */
var getProjectList = function (_a) {
    var pageSize = _a.pageSize, pageNum = _a.pageNum, access_token = _a.access_token;
    return __awaiter(void 0, void 0, void 0, function () {
        var projectList;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, http_1.methodV({
                        url: "/projects",
                        method: "GET",
                        query: {
                            per_page: pageSize,
                            page: pageNum,
                            access_token: access_token
                        },
                    })];
                case 1:
                    projectList = (_b.sent()).data;
                    return [2 /*return*/, { projectList: projectList }];
            }
        });
    });
};
exports.getProjectList = getProjectList;
/**
 * @author: Cookie
 * @description: 获取用户所属工程
 */
var getProjectByUser = function (_a) {
    var pageSize = _a.pageSize, pageNum = _a.pageNum, access_token = _a.access_token, userId = _a.userId;
    return __awaiter(void 0, void 0, void 0, function () {
        var projectList;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, http_1.methodV({
                        url: "/users/" + userId + "/projects",
                        method: "GET",
                        query: {
                            per_page: pageSize,
                            page: pageNum,
                            access_token: access_token
                        },
                    })];
                case 1:
                    projectList = (_b.sent()).data;
                    return [2 /*return*/, { projectList: projectList }];
            }
        });
    });
};
exports.getProjectByUser = getProjectByUser;
/**
* @author: Cookie
* @description: 获取工程
*/
var getProject = function (_a) {
    var id = _a.id, access_token = _a.access_token;
    return __awaiter(void 0, void 0, void 0, function () {
        var project;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, http_1.methodV({
                        url: "/projects/" + id,
                        method: "GET",
                        query: { access_token: access_token }
                    })];
                case 1:
                    project = (_b.sent()).data;
                    return [2 /*return*/, project];
            }
        });
    });
};
exports.getProject = getProject;
/**
 * @author: Cookie
 * @description: 创建 gitLab 工程
 */
var createProjects = function (_a) {
    var gitParams = _a.gitParams;
    return __awaiter(void 0, void 0, void 0, function () {
        var data;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, http_1.methodV({
                        url: "/projects",
                        method: "POST",
                        params: __assign({}, gitParams),
                    })];
                case 1:
                    data = (_b.sent()).data;
                    return [2 /*return*/, data];
            }
        });
    });
};
exports.createProjects = createProjects;
/**
 * @author: Cookie
 * @description: 删除 gitLab 工程保护分支
 */
var deleteProtectedBranches = function (projectId) { return __awaiter(void 0, void 0, void 0, function () {
    var url, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "/projects/" + projectId + "/protected_branches/master";
                return [4 /*yield*/, http_1.methodV({
                        url: url,
                        method: "DELETE",
                    })];
            case 1:
                data = (_a.sent()).data;
                return [2 /*return*/, data];
        }
    });
}); };
exports.deleteProtectedBranches = deleteProtectedBranches;
/**
 * @author: Cookie
 * @description: 设置 gitLab 工程保护分支
 */
var protectedBranches = function (projectId) { return __awaiter(void 0, void 0, void 0, function () {
    var url, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "/projects/" + projectId + "/protected_branches";
                return [4 /*yield*/, http_1.methodV({
                        url: url,
                        method: "POST",
                        params: {
                            name: "master",
                            push_access_level: 0,
                            merge_access_level: 40,
                        },
                    })];
            case 1:
                data = (_a.sent()).data;
                return [2 /*return*/, data];
        }
    });
}); };
exports.protectedBranches = protectedBranches;
