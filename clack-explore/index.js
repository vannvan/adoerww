"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var p = require("@clack/prompts");
var promises_1 = require("node:timers/promises");
var picocolors_1 = require("picocolors");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var project, s, nextSteps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.clear();
                    p.intro("".concat(picocolors_1.default.bgCyan(picocolors_1.default.black(' create-app '))));
                    return [4 /*yield*/, p.group({
                            path: function () {
                                return p.text({
                                    message: 'Where should we create your project?',
                                    placeholder: './sparkling-solid',
                                    validate: function (value) {
                                        if (!value)
                                            return 'Please enter a path.';
                                        if (value[0] !== '.')
                                            return 'Please enter a relative path.';
                                    },
                                });
                            },
                            password: function () {
                                return p.password({
                                    message: 'Provide a password',
                                    validate: function (value) {
                                        if (!value)
                                            return 'Please enter a password.';
                                        if (value.length < 5)
                                            return 'Password should have at least 5 characters.';
                                    },
                                });
                            },
                            type: function (_a) {
                                var results = _a.results;
                                return p.select({
                                    message: "Pick a project type within \"".concat(results.path, "\""),
                                    initialValue: 'ts',
                                    options: [
                                        { value: 'ts', label: 'TypeScript' },
                                        { value: 'js', label: 'JavaScript' },
                                        { value: 'coffee', label: 'CoffeeScript', hint: 'oh no' },
                                    ],
                                });
                            },
                            tools: function () {
                                return p.multiselect({
                                    message: 'Select additional tools.',
                                    initialValues: ['prettier', 'eslint'],
                                    options: [
                                        { value: 'prettier', label: 'Prettier', hint: 'recommended' },
                                        { value: 'eslint', label: 'ESLint', hint: 'recommended' },
                                        { value: 'stylelint', label: 'Stylelint' },
                                        { value: 'gh-action', label: 'GitHub Action' },
                                    ],
                                });
                            },
                            install: function () {
                                return p.confirm({
                                    message: 'Install dependencies?',
                                    initialValue: false,
                                });
                            },
                        }, {
                            onCancel: function () {
                                p.cancel('Operation cancelled.');
                                process.exit(0);
                            },
                        })];
                case 1:
                    project = _a.sent();
                    if (!project.install) return [3 /*break*/, 3];
                    s = p.spinner();
                    s.start('Installing via pnpm');
                    return [4 /*yield*/, (0, promises_1.setTimeout)(5000)];
                case 2:
                    _a.sent();
                    s.stop('Installed via pnpm');
                    _a.label = 3;
                case 3:
                    nextSteps = "cd ".concat(project.path, "        \n").concat(project.install ? '' : 'pnpm install\n', "pnpm dev");
                    p.note(nextSteps, 'Next steps.');
                    p.outro("Problems? ".concat(picocolors_1.default.underline(picocolors_1.default.cyan('https://example.com/issues'))));
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
