var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("Libraries", ["require", "exports", "linq", "es6-promise"], function (require, exports, Enumerable, es6Promise) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * VS開発時のステップデバッグ環境を維持するため、開発環境ではAMD形式で
     * ライブラリをexportしている。
     * AMD形式では、単一名かつdefault-export無しのライブラリがexport出来ないため、
     * 強制的にdefault-exportしている。
     * プロダクションビルドでは書いた通りで動くため、その差分を吸収するためのロジック。
     */
    var Libraries = {
        // linq.jsのバージョンは3.1.1に固定する。最新版の型定義がes5に対応しなくなったため。
        Enumerable: ((Enumerable.default)
            ? Enumerable.default
            : Enumerable),
        es6Promise: ((es6Promise.default)
            ? es6Promise.default
            : es6Promise),
    };
    exports.default = Libraries;
});
define("Models/Entities/Song", ["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Song = /** @class */ (function () {
        function Song(id, name) {
            //if (!id || id === '')
            //    throw new Error('id is required.');
            if (!name || name === '')
                throw new Error('name is required.');
            this._id = (!id || id === '')
                ? _.uniqueId('user_')
                : id;
            this._name = name;
            var a = 1;
        }
        Object.defineProperty(Song.prototype, "Id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Song.prototype, "Name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        return Song;
    }());
    exports.default = Song;
});
define("Models/Stores/StoreBase", ["require", "exports", "axios"], function (require, exports, axios_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StoreBase = /** @class */ (function () {
        function StoreBase() {
        }
        StoreBase.prototype.Call = function (request) {
            var _this = this;
            return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                var result, ex_1, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            request.jsonrpc = '2.0';
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, StoreBase.XhrInstance.post(null, request)];
                        case 2:
                            result = _a.sent();
                            resolve(result.data);
                            return [3 /*break*/, 4];
                        case 3:
                            ex_1 = _a.sent();
                            error = {
                                id: request.id,
                                error: "Network Error: " + ex_1
                            };
                            resolve(error);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
        };
        ;
        StoreBase.prototype.GetRequest = function (method, params) {
            if (params === void 0) { params = null; }
            var request = {
                method: method
            };
            if (params)
                request.params = params;
            return request;
        };
        StoreBase.prototype.Query = function (method, params) {
            if (params === void 0) { params = null; }
            var request = this.GetRequest(method, params);
            request.id = StoreBase.IdCounter;
            StoreBase.IdCounter++;
            return this.Call(request);
        };
        StoreBase.prototype.Notice = function (method, params) {
            if (params === void 0) { params = null; }
            var request = this.GetRequest(method, params);
            this.Call(request);
        };
        StoreBase.XhrInstance = axios_1.default.create({
            //// APIの基底URLが存在するとき
            baseURL: 'http://localhost:8080/JsonRpc/',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            responseType: 'json'
        });
        StoreBase.IdCounter = 1;
        return StoreBase;
    }());
    exports.default = StoreBase;
});
define("Models/Stores/SongStore", ["require", "exports", "Models/Stores/StoreBase"], function (require, exports, StoreBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SongStore = /** @class */ (function (_super) {
        __extends(SongStore, _super);
        function SongStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // : IEnumerable<Song>
        SongStore.prototype.GetAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                var songs, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            songs = [];
                            return [4 /*yield*/, this.Query(SongStore.ApiMethodSearch)];
                        case 1:
                            result = _a.sent();
                            console.log('Query Result:');
                            console.log(result);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        SongStore.ApiMethodSearch = 'core.library.search';
        return SongStore;
    }(StoreBase_1.default));
    exports.default = SongStore;
});
define("Main", ["require", "exports", "Models/Entities/Song", "Models/Stores/SongStore", "Libraries", "../css/site.css"], function (require, exports, Song_1, SongStore_1, Libraries_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    try {
        Libraries_1.default.es6Promise.polyfill();
        //console.log('Promise Polyfill OK.');
    }
    catch (ex) {
        throw new Error('Promise Poliyfill Error!');
    }
    try {
        //console.log('TS Start');
        var song1 = new Song_1.default('01', 'new york, new york');
        var song2 = new Song_1.default(null, 'stranger in the night');
        var store = new SongStore_1.default();
        var result = store.GetAll().then(function (res) {
            console.log('result ok?');
            console.log(res);
        });
        //console.log(song1);
        //console.log(song2);
        //const En = Libraries.Enumerable;
    }
    catch (ex) {
        //console.log(ex);
    }
});
//# sourceMappingURL=tsout.js.map