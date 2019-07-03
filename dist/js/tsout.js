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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
define("Views/Bases/ViewBase", ["require", "exports", "vue", "lodash"], function (require, exports, vue_1, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ViewBase = /** @class */ (function (_super) {
        __extends(ViewBase, _super);
        function ViewBase(options) {
            var _this = _super.call(this, options) || this;
            _this.initialized = false;
            return _this;
        }
        ViewBase.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var promises;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.initialized)
                                return [2 /*return*/, true];
                            promises = [];
                            _.each(this.$children, function (view) {
                                if (view instanceof ViewBase)
                                    promises.push(view.Initialize());
                            });
                            return [4 /*yield*/, Promise.all(promises)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
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
define("Models/Bases/XhrQueryableBase", ["require", "exports", "axios", "qs"], function (require, exports, axios_1, qs) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var XhrQueryableBase = /** @class */ (function () {
        function XhrQueryableBase() {
        }
        // Axios+qsによるURIパラメータ生成
        // https://blog.ryou103.com/post/axios-send-object-query/
        XhrQueryableBase.ParamsSerializer = function (params) {
            return qs.stringify(params);
        };
        XhrQueryableBase.prototype.ParseResponse = function (data) {
            if (!data)
                return {
                    Succeeded: false,
                    Errors: [{
                            Message: 'Unexpected Error'
                        }]
                };
            return ((typeof data == 'object') && data.hasOwnProperty('Succeeded'))
                // dataが定型応答のとき
                ? data
                // dataが定型応答のとき
                : {
                    Succeeded: true,
                    Result: data
                };
        };
        XhrQueryableBase.prototype.QueryGet = function (url, params) {
            if (params === void 0) { params = null; }
            return __awaiter(this, void 0, void 0, function () {
                var response, ex_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, XhrQueryableBase.XhrInstance.get(url, {
                                    params: params,
                                    paramsSerializer: XhrQueryableBase.ParamsSerializer
                                })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, this.ParseResponse(response.data)];
                        case 2:
                            ex_1 = _a.sent();
                            console.error("QueryGet.Error: url=" + url);
                            if (params) {
                                console.error('params:');
                                console.error(params);
                            }
                            console.error(ex_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        XhrQueryableBase.prototype.QueryPost = function (url, params) {
            if (params === void 0) { params = null; }
            return __awaiter(this, void 0, void 0, function () {
                var response, ex_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, XhrQueryableBase.XhrInstance.post(url, params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, this.ParseResponse(response.data)];
                        case 2:
                            ex_2 = _a.sent();
                            console.error("QueryPost.Error: url=" + url);
                            if (params) {
                                console.error('params:');
                                console.error(params);
                            }
                            console.error(ex_2);
                            return [2 /*return*/, this.ParseResponse(null)];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        XhrQueryableBase.prototype.QueryPut = function (url, params) {
            if (params === void 0) { params = null; }
            return __awaiter(this, void 0, void 0, function () {
                var response, ex_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, XhrQueryableBase.XhrInstance.put(url, params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, this.ParseResponse(response.data)];
                        case 2:
                            ex_3 = _a.sent();
                            console.error("QueryPut.Error: url=" + url);
                            if (params) {
                                console.error('params:');
                                console.error(params);
                            }
                            console.error(ex_3);
                            return [2 /*return*/, this.ParseResponse(null)];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        XhrQueryableBase.prototype.QueryDelete = function (url, params) {
            if (params === void 0) { params = null; }
            return __awaiter(this, void 0, void 0, function () {
                var response, ex_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, XhrQueryableBase.XhrInstance.delete(url, params)];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, this.ParseResponse(response.data)];
                        case 2:
                            ex_4 = _a.sent();
                            console.error("QueryDelete.Error: url=" + url);
                            if (params) {
                                console.error('params:');
                                console.error(params);
                            }
                            console.error(ex_4);
                            return [2 /*return*/, this.ParseResponse(null)];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        XhrQueryableBase.XhrInstance = axios_1.default.create({
            //// APIの基底URLが存在するとき
            baseURL: 'http://localhost:8080/',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            responseType: 'json'
        });
        return XhrQueryableBase;
    }());
    exports.default = XhrQueryableBase;
});
define("Models/Bases/StoreBase", ["require", "exports", "Libraries", "Models/Bases/XhrQueryableBase"], function (require, exports, Libraries_1, XhrQueryableBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StoreBase = /** @class */ (function (_super) {
        __extends(StoreBase, _super);
        function StoreBase() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.Enumerable = Libraries_1.default.Enumerable;
            return _this;
        }
        return StoreBase;
    }(XhrQueryableBase_1.default));
    exports.default = StoreBase;
});
define("Models/Bases/ISelectionItem", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
define("Models/Genres/GenreStore", ["require", "exports", "Models/Bases/StoreBase"], function (require, exports, StoreBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenreStore = /** @class */ (function (_super) {
        __extends(GenreStore, _super);
        function GenreStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GenreStore.prototype.GetList = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, entities;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryGet('Genre/GetList')];
                        case 1:
                            result = _a.sent();
                            entities = (result.Succeeded)
                                ? result.Result
                                : [];
                            return [2 /*return*/, this.Enumerable.from(entities)];
                    }
                });
            });
        };
        return GenreStore;
    }(StoreBase_1.default));
    exports.default = GenreStore;
});
define("Views/Shared/SelectionItem", ["require", "exports", "vue-class-component", "vue-property-decorator", "Views/Bases/ViewBase"], function (require, exports, vue_class_component_2, vue_property_decorator_1, ViewBase_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SelectionItem = /** @class */ (function (_super) {
        __extends(SelectionItem, _super);
        function SelectionItem() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.selected = false;
            return _this;
        }
        SelectionItem_1 = SelectionItem;
        Object.defineProperty(SelectionItem.prototype, "Li", {
            get: function () {
                return this.$refs.Li;
            },
            enumerable: true,
            configurable: true
        });
        SelectionItem.prototype.OnClick = function () {
            if (this.selected) {
                if (this.Li.classList.contains(SelectionItem_1.SelectedColor))
                    this.Li.classList.remove(SelectionItem_1.SelectedColor);
                this.selected = false;
            }
            else {
                if (!this.Li.classList.contains(SelectionItem_1.SelectedColor))
                    this.Li.classList.add(SelectionItem_1.SelectedColor);
                this.selected = true;
            }
        };
        SelectionItem.prototype.IsSelected = function () {
            return this.selected;
        };
        var SelectionItem_1;
        SelectionItem.SelectedColor = 'bg-gray';
        __decorate([
            vue_property_decorator_1.Prop(),
            __metadata("design:type", Object)
        ], SelectionItem.prototype, "entity", void 0);
        SelectionItem = SelectionItem_1 = __decorate([
            vue_class_component_2.default({
                template: "<li  class=\"\"\n                    ref=\"Li\" >\n    <a  href=\"javascript:void(0)\"\n        @click=\"OnClick\" >\n        {{ entity.Name }}\n    </a>\n</li>"
            })
        ], SelectionItem);
        return SelectionItem;
    }(ViewBase_2.default));
    exports.default = SelectionItem;
});
define("Views/Finders/GenreList", ["require", "exports", "Views/Bases/ViewBase", "vue-class-component", "Models/Genres/GenreStore", "Views/Shared/SelectionItem"], function (require, exports, ViewBase_3, vue_class_component_3, GenreStore_1, SelectionItem_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenreList = /** @class */ (function (_super) {
        __extends(GenreList, _super);
        function GenreList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.genreStore = new GenreStore_1.default();
            _this.genres = [];
            return _this;
        }
        GenreList.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, _super.prototype.Initialize.call(this)];
                        case 1:
                            _b.sent();
                            _a = this;
                            return [4 /*yield*/, this.genreStore.GetList()];
                        case 2:
                            _a.genres = (_b.sent())
                                .orderBy(function (e) { return e.Name; })
                                .toArray();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        GenreList.prototype.OnClickRemove = function () {
        };
        GenreList = __decorate([
            vue_class_component_3.default({
                template: "<div class=\"col-md-3\">\n    <div class=\"box box-solid\">\n        <div class=\"box-header with-border bg-green\">\n            <h3 class=\"box-title\">Genre</h3>\n            <div class=\"box-tools pull-right\">\n                <button type=\"button\"\n                        class=\"btn btn-box-tool\"\n                        @click=\"OnClickRemove\" >\n                    <i class=\"fa fa-remove\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"box-footer no-padding\">\n            <ul class=\"nav nav-stacked\">\n            <template v-for=\"genre in genres\">\n                <selection-item\n                    ref=\"Items\"\n                    v-bind:entity=\"genre\"\n                    @click=\"OnClickItem\" />\n            </template>\n            </ul>\n        </div>\n    </div>\n</div>",
                components: {
                    'selection-item': SelectionItem_2.default
                }
            })
        ], GenreList);
        return GenreList;
    }(ViewBase_3.default));
    exports.default = GenreList;
});
define("Views/Finders/Finder", ["require", "exports", "Views/Bases/ViewBase", "vue-class-component", "Views/Finders/GenreList"], function (require, exports, ViewBase_4, vue_class_component_4, GenreList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Finder = /** @class */ (function (_super) {
        __extends(Finder, _super);
        function Finder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Finder.prototype, "GenreList", {
            get: function () {
                return this.$refs.GenreList;
            },
            enumerable: true,
            configurable: true
        });
        Finder = __decorate([
            vue_class_component_4.default({
                template: "<section class=\"content\">\n    <div class=\"row\">\n        <genre-list ref=\"GenreList\" />\n    </div>\n</section>",
                components: {
                    'genre-list': GenreList_1.default
                }
            })
        ], Finder);
        return Finder;
    }(ViewBase_4.default));
    exports.default = Finder;
});
define("Views/RootView", ["require", "exports", "Views/Bases/ViewBase", "Views/Sidebars/Sidebar", "Views/Finders/Finder"], function (require, exports, ViewBase_5, Sidebar_1, Finder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RootView = /** @class */ (function (_super) {
        __extends(RootView, _super);
        function RootView() {
            var _this = _super.call(this, {
                template: "<div class=\"wrapper\" style=\"height: auto; min-height: 100%;\">\n    <sidebar ref=\"Sidebar\" />\n    <div class=\"content-wrapper\" style=\"height: 100%\">\n        <section class=\"content-header\">\n            <h1 ref=\"ContentTitle\">{{ contentTitleString }}</h1>\n        </section>\n        <finder ref=\"Finder\" />\n    </div>\n</div>",
                components: {
                    'sidebar': Sidebar_1.default,
                    'finder': Finder_1.default
                }
            }) || this;
            _this.contentTitleString = 'Finder';
            return _this;
        }
        return RootView;
    }(ViewBase_5.default));
    exports.default = RootView;
});
define("Controllers/RootContoller", ["require", "exports", "Views/RootView"], function (require, exports, RootView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RootContoller = /** @class */ (function () {
        function RootContoller() {
        }
        RootContoller.prototype.Init = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this._view = new RootView_1.default();
                            this._view.$mount('#root');
                            return [4 /*yield*/, this._view.Initialize()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        return RootContoller;
    }());
    exports.default = RootContoller;
});
define("Main", ["require", "exports", "Controllers/RootContoller", "Libraries", "animate.css/animate.css", "font-awesome/css/font-awesome.css", "admin-lte/dist/css/adminlte.css", "admin-lte/dist/js/adminlte.js", "../css/site.css"], function (require, exports, RootContoller_1, Libraries_2) {
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
                            return [4 /*yield*/, this.InitControllers()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this];
                    }
                });
            });
        };
        Main.prototype.PolyfillPromise = function () {
            try {
                Libraries_2.default.es6Promise.polyfill();
                //console.log('Promise Polyfill OK.');
            }
            catch (ex) {
                throw new Error('Promise Poliyfill Error!');
            }
        };
        Main.prototype.InitControllers = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this._rootController = new RootContoller_1.default();
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
define("Models/Albums/AlbumStore", ["require", "exports", "Models/Bases/StoreBase"], function (require, exports, StoreBase_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AlbumStore = /** @class */ (function (_super) {
        __extends(AlbumStore, _super);
        function AlbumStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AlbumStore.prototype.GetList = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result, entities;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryGet('Album/GetList')];
                        case 1:
                            result = _a.sent();
                            entities = (result.Succeeded)
                                ? result.Result
                                : [];
                            return [2 /*return*/, this.Enumerable.from(entities)];
                    }
                });
            });
        };
        AlbumStore.prototype.GetListByArtist = function (artist) {
            return __awaiter(this, void 0, void 0, function () {
                var result, entities;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryGet('Album/GetListByArtistId', {
                                artistId: artist.Id
                            })];
                        case 1:
                            result = _a.sent();
                            entities = (result.Succeeded)
                                ? result.Result
                                : [];
                            return [2 /*return*/, this.Enumerable.from(entities)];
                    }
                });
            });
        };
        AlbumStore.prototype.GetListByGenre = function (genre) {
            return __awaiter(this, void 0, void 0, function () {
                var result, entities;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryGet('Album/GetListByGenreId', {
                                genreId: genre.Id
                            })];
                        case 1:
                            result = _a.sent();
                            entities = (result.Succeeded)
                                ? result.Result
                                : [];
                            return [2 /*return*/, this.Enumerable.from(entities)];
                    }
                });
            });
        };
        return AlbumStore;
    }(StoreBase_2.default));
    exports.default = AlbumStore;
});
define("Models/Artists/ArtistStore", ["require", "exports", "Models/Bases/StoreBase"], function (require, exports, StoreBase_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArtistStore = /** @class */ (function (_super) {
        __extends(ArtistStore, _super);
        function ArtistStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ArtistStore.prototype.GetList = function (genre) {
            if (genre === void 0) { genre = null; }
            return __awaiter(this, void 0, void 0, function () {
                var result, _a, entities;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(!genre)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.QueryGet('Artist/GetList')];
                        case 1:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.QueryGet('Artist/GetListByGenreId', {
                                genreId: genre.Id
                            })];
                        case 3:
                            _a = _b.sent();
                            _b.label = 4;
                        case 4:
                            result = _a;
                            entities = (result.Succeeded)
                                ? result.Result
                                : [];
                            return [2 /*return*/, this.Enumerable.from(entities)];
                    }
                });
            });
        };
        return ArtistStore;
    }(StoreBase_3.default));
    exports.default = ArtistStore;
});
define("Models/Bases/JsonRpcQueryableBase", ["require", "exports", "Models/Bases/XhrQueryableBase"], function (require, exports, XhrQueryableBase_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JsonRpcQueryableBase = /** @class */ (function (_super) {
        __extends(JsonRpcQueryableBase, _super);
        function JsonRpcQueryableBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        JsonRpcQueryableBase.prototype.QueryJsonRpc = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var response, result, ex_5, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            params.jsonrpc = '2.0';
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, XhrQueryableBase_2.default.XhrInstance.post(JsonRpcQueryableBase.Url, params)];
                        case 2:
                            response = _a.sent();
                            result = response.data;
                            if (result.error) {
                                console.error("JsonRpcError: method=" + params.method);
                                console.error(result);
                            }
                            return [2 /*return*/, result];
                        case 3:
                            ex_5 = _a.sent();
                            error = {
                                error: "Network Error: " + ex_5
                            };
                            if (params.id)
                                error.id = params.id;
                            console.error("JsonRpcError: method=" + params.method);
                            console.error(error);
                            return [2 /*return*/, error];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ;
        JsonRpcQueryableBase.prototype.JsonRpcRequest = function (method, params) {
            if (params === void 0) { params = null; }
            return __awaiter(this, void 0, void 0, function () {
                var query, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            query = {
                                method: method,
                                id: JsonRpcQueryableBase.IdCounter
                            };
                            if (params)
                                query.params = params;
                            JsonRpcQueryableBase.IdCounter++;
                            return [4 /*yield*/, this.QueryJsonRpc(query)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        JsonRpcQueryableBase.prototype.JsonRpcNotice = function (method, params) {
            if (params === void 0) { params = null; }
            return __awaiter(this, void 0, void 0, function () {
                var query, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            query = {
                                method: method
                            };
                            if (params)
                                query.params = params;
                            return [4 /*yield*/, this.QueryJsonRpc(query)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, !(result.error)];
                    }
                });
            });
        };
        JsonRpcQueryableBase.Url = 'JsonRpc';
        JsonRpcQueryableBase.IdCounter = 1;
        return JsonRpcQueryableBase;
    }(XhrQueryableBase_2.default));
    exports.default = JsonRpcQueryableBase;
});
define("Models/Tracks/Track", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Track = /** @class */ (function () {
        function Track() {
        }
        Object.defineProperty(Track.prototype, "Id", {
            get: function () {
                return this.TlId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Track.prototype, "LowerName", {
            get: function () {
                return this.Name.toLowerCase();
            },
            enumerable: true,
            configurable: true
        });
        return Track;
    }());
    exports.default = Track;
});
define("Models/Tracks/TrackStore", ["require", "exports", "Models/Bases/StoreBase"], function (require, exports, StoreBase_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TrackStore = /** @class */ (function (_super) {
        __extends(TrackStore, _super);
        function TrackStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TrackStore.prototype.GetListByAlbum = function (album) {
            return __awaiter(this, void 0, void 0, function () {
                var result, entities;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryGet('Track/GetTracksByAlbumId', {
                                albumId: album.Id
                            })];
                        case 1:
                            result = _a.sent();
                            entities = (result.Succeeded)
                                ? result.Result
                                : [];
                            return [2 /*return*/, this.Enumerable.from(entities)];
                    }
                });
            });
        };
        return TrackStore;
    }(StoreBase_4.default));
    exports.default = TrackStore;
});
//# sourceMappingURL=tsout.js.map