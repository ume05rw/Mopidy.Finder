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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
define("Models/Bases/StoreBase", ["require", "exports", "axios", "qs"], function (require, exports, axios_1, qs) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StoreBase = /** @class */ (function () {
        function StoreBase() {
        }
        // Axios+qsによるURIパラメータ生成
        // https://blog.ryou103.com/post/axios-send-object-query/
        StoreBase.ParamsSerializer = function (params) {
            return qs.stringify(params);
        };
        StoreBase.prototype.GetAll = function () {
            return this.Entities.toArray();
        };
        StoreBase.prototype.ApiGet = function (url, params) {
            if (params === void 0) { params = null; }
            return __awaiter(this, void 0, void 0, function () {
                var result, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, StoreBase.XhrInstance.get(url, {
                                    params: params,
                                    paramsSerializer: StoreBase.ParamsSerializer
                                })];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result.data];
                        case 2:
                            e_1 = _a.sent();
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        StoreBase.prototype.JsonRpcCall = function (request) {
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
                            return [4 /*yield*/, StoreBase.XhrInstance.post('JsonRpc', request)];
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
        StoreBase.prototype.JsonRpcQuery = function (method, params) {
            if (params === void 0) { params = null; }
            var request = this.GetRequest(method, params);
            request.id = StoreBase.IdCounter;
            StoreBase.IdCounter++;
            return this.JsonRpcCall(request);
        };
        StoreBase.prototype.JsonRpcNotice = function (method, params) {
            if (params === void 0) { params = null; }
            var request = this.GetRequest(method, params);
            this.JsonRpcCall(request);
        };
        StoreBase.XhrInstance = axios_1.default.create({
            //// APIの基底URLが存在するとき
            baseURL: 'http://localhost:8080/',
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
define("Models/Relations/ArtistAlbum", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArtistAlbum = /** @class */ (function () {
        function ArtistAlbum() {
        }
        return ArtistAlbum;
    }());
    exports.default = ArtistAlbum;
});
define("Models/Relations/GenreArtist", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenreArtist = /** @class */ (function () {
        function GenreArtist() {
        }
        return GenreArtist;
    }());
    exports.default = GenreArtist;
});
define("Models/Artists/Artist", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Artist = /** @class */ (function () {
        function Artist() {
        }
        return Artist;
    }());
    exports.default = Artist;
});
define("Models/Artists/ArtistStore", ["require", "exports", "Libraries", "Models/Bases/StoreBase"], function (require, exports, Libraries_1, StoreBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArtistStore = /** @class */ (function (_super) {
        __extends(ArtistStore, _super);
        function ArtistStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ArtistStore.prototype.Init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var entities;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ApiGet('Artist/GetList')];
                        case 1:
                            entities = _a.sent();
                            this.Entities = Libraries_1.default.Enumerable.from(entities);
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        return ArtistStore;
    }(StoreBase_1.default));
    exports.default = ArtistStore;
});
define("Models/Relations/GenreAlbum", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenreAlbum = /** @class */ (function () {
        function GenreAlbum() {
        }
        return GenreAlbum;
    }());
    exports.default = GenreAlbum;
});
define("Models/Genres/Genre", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Genre = /** @class */ (function () {
        function Genre() {
        }
        return Genre;
    }());
    exports.default = Genre;
});
define("Models/Genres/GenreStore", ["require", "exports", "Libraries", "Models/Bases/StoreBase"], function (require, exports, Libraries_2, StoreBase_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenreStore = /** @class */ (function (_super) {
        __extends(GenreStore, _super);
        function GenreStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GenreStore.prototype.Init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var entities;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ApiGet('Genre/GetList')];
                        case 1:
                            entities = _a.sent();
                            this.Entities = Libraries_2.default.Enumerable.from(entities);
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        return GenreStore;
    }(StoreBase_2.default));
    exports.default = GenreStore;
});
define("Models/Albums/Album", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Album = /** @class */ (function () {
        function Album() {
        }
        return Album;
    }());
    exports.default = Album;
});
define("Models/Albums/AlbumStore", ["require", "exports", "Libraries", "Models/Bases/StoreBase"], function (require, exports, Libraries_3, StoreBase_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AlbumStore = /** @class */ (function (_super) {
        __extends(AlbumStore, _super);
        function AlbumStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AlbumStore.prototype.Init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var entities;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ApiGet('Album/GetList')];
                        case 1:
                            entities = _a.sent();
                            this.Entities = Libraries_3.default.Enumerable.from(entities);
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        return AlbumStore;
    }(StoreBase_3.default));
    exports.default = AlbumStore;
});
define("Views/Bases/ViewBase", ["require", "exports", "vue"], function (require, exports, vue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ViewBase = /** @class */ (function (_super) {
        __extends(ViewBase, _super);
        function ViewBase(options) {
            return _super.call(this, options) || this;
        }
        return ViewBase;
    }(vue_1.default));
    exports.default = ViewBase;
});
define("Views/Sidebars/Sidebar", ["require", "exports", "Views/Bases/ViewBase", "vue-class-component"], function (require, exports, ViewBase_1, vue_class_component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Sidebar = /** @class */ (function (_super) {
        __extends(Sidebar, _super);
        function Sidebar() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Sidebar = __decorate([
            vue_class_component_1.default({
                template: "<aside class=\"main-sidebar\">\n    <ul class=\"sidebar-menu tree\" data-widget=\"tree\">\n        <li class=\"active treeview\">\n            <a href=\"#\">\n                <i class=\"fa fa-dashboard\" />\n                <span>Main</span>\n                <span class=\"pull-right-container\">\n                    <i class=\"fa fa-angle-left pull-right\" />\n                </span>\n            </a>\n            <ul>\n                <li>\n                    <a href=\"#\">\n                        <i class=\"fa fa-circle-o\" />Finder\n                    </a>\n                </li>\n                <li>\n                    <a href=\"#\">\n                        <i class=\"fa fa-circle-o\" />Playlists\n                    </a>\n                </li>\n            </ul>\n        </li>\n        <li class=\"treeview\">\n            <a href=\"#\">\n                <i class=\"fa fa-dashboard\" />\n                <span>Settings</span>\n                <span class=\"pull-right-container\">\n                    <i class=\"fa fa-angle-left pull-right\" />\n                </span>\n            </a>\n            <ul>\n                <li>\n                    <a href=\"#\">\n                        <i class=\"fa fa-circle-o\" />Server\n                    </a>\n                </li>\n                <li>\n                    <a href=\"#\">\n                        <i class=\"fa fa-circle-o\" />Refresh\n                    </a>\n                </li>\n            </ul>\n        </li>\n    </ul>\n</aside>"
            })
        ], Sidebar);
        return Sidebar;
    }(ViewBase_1.default));
    exports.default = Sidebar;
});
define("Views/Finders/Finder", ["require", "exports", "Views/Bases/ViewBase", "vue-class-component"], function (require, exports, ViewBase_2, vue_class_component_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Finder = /** @class */ (function (_super) {
        __extends(Finder, _super);
        function Finder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Finder = __decorate([
            vue_class_component_2.default({
                template: "<section class=\"content\">\n</section>"
            })
        ], Finder);
        return Finder;
    }(ViewBase_2.default));
    exports.default = Finder;
});
define("Views/RootView", ["require", "exports", "Views/Bases/ViewBase", "Views/Sidebars/Sidebar", "Views/Finders/Finder"], function (require, exports, ViewBase_3, Sidebar_1, Finder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RootView = /** @class */ (function (_super) {
        __extends(RootView, _super);
        function RootView() {
            return _super.call(this, {
                template: "<div class=\"wrapper\" style=\"height: auto; min-height: 100%;\">\n    <sidebar ref=\"Sidebar\" />\n    <div class=\"content-wrapper\" style=\"height: 100%\">\n        <section class=\"content-header\">\n            <h1 ref=\"ContentTitle\"></h1>\n        </section>\n        <finder ref=\"Finder\" />\n    </div>\n</div>",
                components: {
                    'sidebar': Sidebar_1.default,
                    'finder': Finder_1.default
                }
            }) || this;
        }
        return RootView;
    }(ViewBase_3.default));
    exports.default = RootView;
});
define("Controllers/MainController", ["require", "exports", "Views/RootView"], function (require, exports, RootView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RootContoller = /** @class */ (function () {
        function RootContoller() {
        }
        RootContoller.prototype.Init = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this._view = new RootView_1.default();
                    this._view.$mount('#root');
                    return [2 /*return*/, true];
                });
            });
        };
        return RootContoller;
    }());
    exports.default = RootContoller;
});
define("Main", ["require", "exports", "Libraries", "Models/Artists/ArtistStore", "Models/Genres/GenreStore", "Models/Albums/AlbumStore", "Controllers/MainController", "../css/site.css", "animate.css/animate.css", "font-awesome/css/font-awesome.css", "vue2-admin-lte/src/lib/css", "vue2-admin-lte/src/lib/script"], function (require, exports, Libraries_4, ArtistStore_1, GenreStore_1, AlbumStore_1, MainController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Main = /** @class */ (function () {
        function Main() {
        }
        Main.prototype.Init = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log('TS Start');
                            this.PolyfillPromise();
                            return [4 /*yield*/, this.InitStores()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.InitControllers()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Main.prototype.PolyfillPromise = function () {
            try {
                Libraries_4.default.es6Promise.polyfill();
                //console.log('Promise Polyfill OK.');
            }
            catch (ex) {
                throw new Error('Promise Poliyfill Error!');
            }
        };
        Main.prototype.InitStores = function () {
            return __awaiter(this, void 0, void 0, function () {
                var artists, genres, albums, promises;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            artists = new ArtistStore_1.default();
                            genres = new GenreStore_1.default();
                            albums = new AlbumStore_1.default();
                            promises = [];
                            promises.push(albums.Init());
                            promises.push(artists.Init());
                            promises.push(genres.Init());
                            return [4 /*yield*/, Promise.all(promises)];
                        case 1:
                            _a.sent();
                            console.log('Artists:');
                            console.log(artists.GetAll());
                            console.log('Genres:');
                            console.log(genres.GetAll());
                            console.log('Albums;');
                            console.log(albums.GetAll());
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Main.prototype.InitControllers = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this._rootController = new MainController_1.default();
                            return [4 /*yield*/, this._rootController.Init()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        return Main;
    }());
    var main = (new Main()).Init();
});
define("Models/Mopidies/Ref", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Ref = /** @class */ (function () {
        function Ref() {
        }
        return Ref;
    }());
    exports.default = Ref;
});
define("Models/Mopidies/Methods/Library", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Library = /** @class */ (function () {
        function Library() {
        }
        Library.Search = 'core.library.search';
        Library.Browse = 'core.library.browse';
        return Library;
    }());
    exports.default = Library;
});
//# sourceMappingURL=tsout.js.map