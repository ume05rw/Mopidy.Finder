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
define("Views/HeaderBars/HeaderBar", ["require", "exports", "Views/Bases/ViewBase", "vue-class-component"], function (require, exports, ViewBase_1, vue_class_component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeaderBar = /** @class */ (function (_super) {
        __extends(HeaderBar, _super);
        function HeaderBar() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.contentTitle = 'Finder';
            return _this;
        }
        HeaderBar = __decorate([
            vue_class_component_1.default({
                template: "<nav class=\"main-header navbar navbar-expand navbar-white navbar-light border-bottom\">\n    <ul class=\"navbar-nav\">\n        <li class=\"nav-item\">\n            <a class=\"nav-link\" data-widget=\"pushmenu\" href=\"#\">\n                <i class=\"fa fa-bars\" />\n            </a>\n        </li>\n        <li class=\"nav-item\">\n            <h3>{{ contentTitle }}</h3>\n        </li>\n    </ul>\n    <ul class=\"navbar-nav ml-auto\">\n        <li class=\"nav-item\">\n            <button type=\"button\" class=\"btn btn-default btn-sm\">\n                <i class=\"fa fa-backward\" />\n            </button>\n        </li>\n        <li class=\"nav-item\">\n            <button type=\"button\" class=\"btn btn-default btn-sm\">\n                <i class=\"fa fa-play\" />\n            </button>\n        </li>\n        <li class=\"nav-item\">\n            <button type=\"button\" class=\"btn btn-default btn-sm\">\n                <i class=\"fa fa-forward\" />\n            </button>\n        </li>\n    </ul>\n</nav>"
            })
        ], HeaderBar);
        return HeaderBar;
    }(ViewBase_1.default));
    exports.default = HeaderBar;
});
define("Views/Sidebars/Sidebar", ["require", "exports", "Views/Bases/ViewBase", "vue-class-component"], function (require, exports, ViewBase_2, vue_class_component_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Sidebar = /** @class */ (function (_super) {
        __extends(Sidebar, _super);
        function Sidebar() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Sidebar = __decorate([
            vue_class_component_2.default({
                template: "<aside class=\"main-sidebar sidebar-dark-primary\">\n    <ul class=\"nav nav-pills nav-sidebar flex-column\" data-widget=\"treeview\">\n        <li class=\"nav-item has-treeview\">\n            <a href=\"#\" class=\"nav-link\">\n                <i class=\"nav-icon fa fa-dashboard\" />\n                <p>\n                    Main\n                    <i class=\"fa fa-angle-left right\" />\n                </p>\n            </a>\n            <ul class=\"nav nav-treeview\">\n                <li class=\"nav-item\">\n                    <a href=\"#\" class=\"nav-link\">\n                        <i class=\"fa fa-circle-o nav-icon\" />\n                        <p>Finder</p>\n                    </a>\n                </li>\n                <li class=\"nav-item\">\n                    <a href=\"#\" class=\"nav-link\">\n                        <i class=\"fa fa-circle-o nav-icon\" />\n                        <p>Playlists</p>\n                    </a>\n                </li>\n            </ul>\n        </li>\n        <li class=\"nav-item has-treeview\">\n            <a href=\"#\" class=\"nav-link\">\n                <i class=\"nav-icon fa fa-dashboard\" />\n                <p>\n                    Settings\n                    <i class=\"fa fa-angle-left right\" />\n                </p>\n            </a>\n            <ul class=\"nav nav-treeview\">\n                <li class=\"nav-item\">\n                    <a href=\"#\" class=\"nav-link\">\n                        <i class=\"fa fa-circle-o nav-icon\" />\n                        <p>Server</p>\n                    </a>\n                </li>\n                <li class=\"nav-item\">\n                    <a href=\"#\" class=\"nav-link\">\n                        <i class=\"fa fa-circle-o nav-icon\" />\n                        <p>Refresh</p>\n                    </a>\n                </li>\n            </ul>\n        </li>\n    </ul>\n</aside>"
            })
        ], Sidebar);
        return Sidebar;
    }(ViewBase_2.default));
    exports.default = Sidebar;
});
define("Models/Bases/ISelectionItem", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Models/Relations/GenreArtist", ["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenreArtist = /** @class */ (function () {
        function GenreArtist() {
        }
        GenreArtist.Create = function (entity) {
            var result = new GenreArtist();
            result.GenreId = entity.GenreId;
            result.ArtistId = entity.ArtistId;
            return result;
        };
        GenreArtist.CreateArray = function (entities) {
            var result = [];
            _.each(entities, function (entity) {
                result.push(GenreArtist.Create(entity));
            });
            return result;
        };
        return GenreArtist;
    }());
    exports.default = GenreArtist;
});
define("Models/Relations/GenreAlbum", ["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenreAlbum = /** @class */ (function () {
        function GenreAlbum() {
        }
        GenreAlbum.Create = function (entity) {
            var result = new GenreAlbum();
            result.GenreId = entity.GenreId;
            result.AlbumId = entity.AlbumId;
            return result;
        };
        GenreAlbum.CreateArray = function (entities) {
            var result = [];
            _.each(entities, function (entity) {
                result.push(GenreAlbum.Create(entity));
            });
            return result;
        };
        return GenreAlbum;
    }());
    exports.default = GenreAlbum;
});
define("Models/Genres/Genre", ["require", "exports", "lodash", "Models/Relations/GenreArtist", "Models/Relations/GenreAlbum"], function (require, exports, _, GenreArtist_1, GenreAlbum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Genre = /** @class */ (function () {
        function Genre() {
        }
        Genre.Create = function (entity) {
            var result = new Genre();
            result.Id = entity.Id;
            result.Name = entity.Name;
            result.LowerName = entity.LowerName;
            result.Uri = entity.Uri;
            result.GenreArtists = GenreArtist_1.default.CreateArray(entity.GenreArtists);
            result.GenreAlbums = GenreAlbum_1.default.CreateArray(entity.GenreAlbums);
            return result;
        };
        Genre.CreateArray = function (entities) {
            var result = [];
            _.each(entities, function (entity) {
                result.push(Genre.Create(entity));
            });
            return result;
        };
        return Genre;
    }());
    exports.default = Genre;
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
define("Models/Genres/GenreStore", ["require", "exports", "Models/Bases/StoreBase", "Models/Genres/Genre"], function (require, exports, StoreBase_1, Genre_1) {
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
                                ? Genre_1.default.CreateArray(result.Result)
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
define("Views/Events/ListEvents", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Events = {
        SelectionChanged: 'SelectionChanged',
        Refreshed: 'Refreshed',
        ListAppended: 'ListAppended'
    };
});
define("Views/Shared/SelectionItem", ["require", "exports", "vue-class-component", "vue-property-decorator", "Views/Bases/ViewBase", "Views/Events/ListEvents"], function (require, exports, vue_class_component_3, vue_property_decorator_1, ViewBase_3, ListEvents_1) {
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
            this.$emit(ListEvents_1.Events.SelectionChanged, {
                entity: this.entity,
                selected: this.selected
            });
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
            vue_class_component_3.default({
                template: "<li class=\"nav-item\"\n                   ref=\"Li\" >\n    <a href=\"javascript:void(0)\" class=\"d-inline-block w-100 text-nowrap text-truncate\"\n       @click=\"OnClick\" >\n        {{ entity.Name }}\n    </a>\n</li>"
            })
        ], SelectionItem);
        return SelectionItem;
    }(ViewBase_3.default));
    exports.default = SelectionItem;
});
define("Views/Finders/Lists/GenreList", ["require", "exports", "vue-class-component", "Models/Genres/GenreStore", "Views/Bases/ViewBase", "Views/Shared/SelectionItem", "Views/Events/ListEvents"], function (require, exports, vue_class_component_4, GenreStore_1, ViewBase_4, SelectionItem_2, ListEvents_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenreList = /** @class */ (function (_super) {
        __extends(GenreList, _super);
        function GenreList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.store = new GenreStore_1.default();
            _this.entities = [];
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
                            return [4 /*yield*/, this.store.GetList()];
                        case 2:
                            _a.entities = (_b.sent())
                                .toArray();
                            this.$emit(ListEvents_2.Events.ListAppended, {
                                entities: this.entities
                            });
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        GenreList.prototype.OnClickRefresh = function () {
            this.Refresh();
            this.$emit(ListEvents_2.Events.Refreshed);
        };
        GenreList.prototype.OnSelectionChanged = function (args) {
            this.$emit(ListEvents_2.Events.SelectionChanged, args);
        };
        GenreList.prototype.Refresh = function () {
            this.entities = [];
            this.Initialize();
        };
        GenreList = __decorate([
            vue_class_component_4.default({
                template: "<div class=\"col-md-3 h-100\">\n    <div class=\"card h-100\">\n        <div class=\"card-header with-border bg-green\">\n            <h3 class=\"card-title\">Genres</h3>\n            <div class=\"card-tools\">\n                <button type=\"button\"\n                        class=\"btn btn-tool\"\n                        @click=\"OnClickRefresh\" >\n                    <i class=\"fa fa-repeat\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"card-body list-scrollable\">\n            <ul class=\"nav nav-pills h-100 d-flex flex-column flex-nowrap\">\n            <template v-for=\"entity in entities\">\n                <selection-item\n                    ref=\"Items\"\n                    v-bind:entity=\"entity\"\n                    @SelectionChanged=\"OnSelectionChanged\" />\n            </template>\n            </ul>\n        </div>\n    </div>\n</div>",
                components: {
                    'selection-item': SelectionItem_2.default
                }
            })
        ], GenreList);
        return GenreList;
    }(ViewBase_4.default));
    exports.default = GenreList;
});
define("Models/Relations/ArtistAlbum", ["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArtistAlbum = /** @class */ (function () {
        function ArtistAlbum() {
        }
        ArtistAlbum.Create = function (entity) {
            var result = new ArtistAlbum();
            result.ArtistId = entity.ArtistId;
            result.AlbumId = entity.AlbumId;
            return result;
        };
        ArtistAlbum.CreateArray = function (entities) {
            var result = [];
            _.each(entities, function (entity) {
                result.push(ArtistAlbum.Create(entity));
            });
            return result;
        };
        return ArtistAlbum;
    }());
    exports.default = ArtistAlbum;
});
define("Models/Artists/Artist", ["require", "exports", "lodash", "Models/Relations/ArtistAlbum", "Models/Relations/GenreArtist"], function (require, exports, _, ArtistAlbum_1, GenreArtist_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Artist = /** @class */ (function () {
        function Artist() {
        }
        Artist.Create = function (entity) {
            var result = new Artist();
            result.Id = entity.Id;
            result.Name = entity.Name;
            result.LowerName = entity.LowerName;
            result.Uri = entity.Uri;
            result.ImageUri = entity.ImageUri;
            result.ArtistAlbums = ArtistAlbum_1.default.CreateArray(entity.ArtistAlbums);
            result.GenreArtists = GenreArtist_2.default.CreateArray(entity.GenreArtists);
            return result;
        };
        Artist.CreateArray = function (entities) {
            var result = [];
            _.each(entities, function (entity) {
                result.push(Artist.Create(entity));
            });
            return result;
        };
        return Artist;
    }());
    exports.default = Artist;
});
define("Models/Artists/ArtistStore", ["require", "exports", "Models/Bases/StoreBase", "Models/Artists/Artist"], function (require, exports, StoreBase_2, Artist_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArtistStore = /** @class */ (function (_super) {
        __extends(ArtistStore, _super);
        function ArtistStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ArtistStore.prototype.GetList = function (genreIds, page) {
            return __awaiter(this, void 0, void 0, function () {
                var response, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryGet('Artist/GetPagenatedList', {
                                genreIds: genreIds,
                                page: page
                            })];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded) {
                                console.error(response.Errors);
                                throw new Error('Unexpected Error on ApiQuery');
                            }
                            result = response.Result;
                            result.ResultList = Artist_1.default.CreateArray(result.ResultList);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        return ArtistStore;
    }(StoreBase_2.default));
    exports.default = ArtistStore;
});
define("Views/Finders/Lists/ArtistList", ["require", "exports", "lodash", "vue", "vue-class-component", "vue-infinite-loading", "Views/Events/ListEvents", "Models/Artists/ArtistStore", "Views/Bases/ViewBase", "Views/Shared/SelectionItem"], function (require, exports, _, vue_2, vue_class_component_5, vue_infinite_loading_1, ListEvents_3, ArtistStore_1, ViewBase_5, SelectionItem_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    vue_2.default.use(vue_infinite_loading_1.default);
    var ArtistList = /** @class */ (function (_super) {
        __extends(ArtistList, _super);
        function ArtistList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.store = new ArtistStore_1.default();
            _this.page = 1;
            _this.genreIds = [];
            _this.entities = [];
            return _this;
        }
        Object.defineProperty(ArtistList.prototype, "InfiniteLoading", {
            get: function () {
                return this.$refs.InfiniteLoading;
            },
            enumerable: true,
            configurable: true
        });
        ArtistList.prototype.OnInfinite = function ($state) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.store.GetList(this.genreIds, this.page)];
                        case 1:
                            result = _a.sent();
                            if (0 < result.ResultList.length)
                                this.entities = this.entities.concat(result.ResultList);
                            if (this.entities.length < result.TotalLength) {
                                $state.loaded();
                                this.page++;
                            }
                            else {
                                $state.complete();
                            }
                            if (0 < result.ResultList.length) {
                                this.$emit(ListEvents_3.Events.ListAppended, {
                                    entities: result.ResultList
                                });
                            }
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        ArtistList.prototype.OnClickRefresh = function () {
            this.Refresh();
            this.$emit(ListEvents_3.Events.Refreshed);
        };
        ArtistList.prototype.OnSelectionChanged = function (args) {
            this.$emit(ListEvents_3.Events.SelectionChanged, args);
        };
        ArtistList.prototype.Refresh = function () {
            var _this = this;
            this.page = 1;
            this.entities = [];
            this.$nextTick(function () {
                _this.InfiniteLoading.stateChanger.reset();
                _this.InfiniteLoading.attemptLoad();
            });
        };
        ArtistList.prototype.HasGenre = function (genreId) {
            return (0 <= _.indexOf(this.genreIds, genreId));
        };
        ArtistList.prototype.AddFilterGenreId = function (genreId) {
            if (!this.HasGenre(genreId)) {
                this.genreIds.push(genreId);
                this.Refresh();
            }
        };
        ArtistList.prototype.RemoveFilterGenreId = function (genreId) {
            if (this.HasGenre(genreId)) {
                _.pull(this.genreIds, genreId);
                this.Refresh();
            }
        };
        ArtistList.prototype.RemoveAllFilters = function () {
            if (0 < this.genreIds.length) {
                this.genreIds = [];
                this.Refresh();
            }
        };
        ArtistList = __decorate([
            vue_class_component_5.default({
                template: "<div class=\"col-md-3 h-100\">\n    <div class=\"card h-100\">\n        <div class=\"card-header with-border bg-info\">\n            <h3 class=\"card-title\">Artists</h3>\n            <div class=\"card-tools\">\n                <button type=\"button\"\n                        class=\"btn btn-tool\"\n                        @click=\"OnClickRefresh\" >\n                    <i class=\"fa fa-repeat\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"card-body list-scrollable\">\n            <ul class=\"nav nav-pills h-100 d-flex flex-column flex-nowrap\">\n                <template v-for=\"entity in entities\">\n                <selection-item\n                    ref=\"Items\"\n                    v-bind:entity=\"entity\"\n                    @SelectionChanged=\"OnSelectionChanged\" />\n                </template>\n                <infinite-loading @infinite=\"OnInfinite\" ref=\"InfiniteLoading\"></infinite-loading>\n            </ul>\n        </div>\n    </div>\n</div>",
                components: {
                    'selection-item': SelectionItem_3.default
                }
            })
        ], ArtistList);
        return ArtistList;
    }(ViewBase_5.default));
    exports.default = ArtistList;
});
define("Models/Albums/Album", ["require", "exports", "lodash", "Models/Relations/ArtistAlbum", "Models/Relations/GenreAlbum"], function (require, exports, _, ArtistAlbum_2, GenreAlbum_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Album = /** @class */ (function () {
        function Album() {
        }
        Album.Create = function (entity) {
            var result = new Album();
            result.Id = entity.Id;
            result.Name = entity.Name;
            result.LowerName = entity.LowerName;
            result.Uri = entity.Uri;
            result.Year = entity.Year;
            result.ImageUri = entity.ImageUri;
            result.ArtistAlbums = ArtistAlbum_2.default.CreateArray(entity.ArtistAlbums);
            result.GenreAlbums = GenreAlbum_2.default.CreateArray(entity.GenreAlbums);
            return result;
        };
        Album.CreateArray = function (entities) {
            var result = [];
            _.each(entities, function (entity) {
                result.push(Album.Create(entity));
            });
            return result;
        };
        Album.prototype.GetImageFullUri = function () {
            return location.protocol + "//" + location.host + this.ImageUri;
        };
        return Album;
    }());
    exports.default = Album;
});
define("Models/Tracks/Track", ["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Track = /** @class */ (function () {
        function Track() {
        }
        Track.Create = function (entity) {
            var result = new Track();
            result.Id = entity.Id;
            result.Name = entity.Name;
            result.LowerName = entity.LowerName;
            result.Uri = entity.Uri;
            result.TlId = entity.TlId;
            result.DiscNo = entity.DiscNo;
            result.TrackNo = entity.TrackNo;
            result.Date = entity.Date;
            result.Comment = entity.Comment;
            result.Length = entity.Length;
            result.BitRate = entity.BitRate;
            result.LastModified = entity.LastModified;
            // JSONがアホほどでかくなるのでやめる
            //result.Genre = Genre.Create(entity.Genre);
            //result.Album = Album.Create(entity.Album);
            //result.Artists = Artist.CreateArray(entity.Artists);
            //result.Composers = Artist.CreateArray(entity.Composers);
            //result.Performaers = Artist.CreateArray(entity.Performaers);
            return result;
        };
        Track.CreateArray = function (entities) {
            var result = [];
            _.each(entities, function (entity) {
                result.push(Track.Create(entity));
            });
            return result;
        };
        Track.prototype.GetTimeString = function () {
            console.log('Track.TimeString: Length = ' + this.Length);
            if (!this.Length) {
                return '';
            }
            var minute = Math.floor(this.Length / 60000);
            var second = Math.floor((this.Length % 60000) / 1000);
            var minuteStr = ('00' + minute.toString()).slice(-2);
            var secondStr = ('00' + second.toString()).slice(-2);
            return minuteStr + ':' + secondStr;
        };
        return Track;
    }());
    exports.default = Track;
});
define("Models/AlbumTracks/AlbumTracks", ["require", "exports", "lodash", "Models/Albums/Album", "Models/Artists/Artist", "Models/Tracks/Track"], function (require, exports, _, Album_1, Artist_2, Track_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AlbumTracks = /** @class */ (function () {
        function AlbumTracks() {
        }
        AlbumTracks.Create = function (entity) {
            var result = new AlbumTracks();
            result.Album = Album_1.default.Create(entity.Album);
            result.Artists = Artist_2.default.CreateArray(entity.Artists);
            result.Tracks = Track_1.default.CreateArray(entity.Tracks);
            return result;
        };
        AlbumTracks.CreateArray = function (entities) {
            var result = [];
            _.each(entities, function (entity) {
                result.push(AlbumTracks.Create(entity));
            });
            return result;
        };
        Object.defineProperty(AlbumTracks.prototype, "Id", {
            get: function () {
                return this.Album.Id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AlbumTracks.prototype, "Name", {
            get: function () {
                return this.Album.Name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AlbumTracks.prototype, "LowerName", {
            get: function () {
                return this.Album.LowerName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AlbumTracks.prototype, "Uri", {
            get: function () {
                return this.Album.Uri;
            },
            enumerable: true,
            configurable: true
        });
        AlbumTracks.prototype.GetArtistName = function () {
            if (this.Artists.length <= 0)
                return '';
            if (this.Artists.length === 1)
                return this.Artists[0].Name;
            return this.Artists[0].Name + ' and more...';
        };
        return AlbumTracks;
    }());
    exports.default = AlbumTracks;
});
define("Models/AlbumTracks/AlbumTracksStore", ["require", "exports", "Models/Bases/StoreBase", "Models/AlbumTracks/AlbumTracks"], function (require, exports, StoreBase_3, AlbumTracks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AlbumTracksStore = /** @class */ (function (_super) {
        __extends(AlbumTracksStore, _super);
        function AlbumTracksStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AlbumTracksStore.prototype.GetList = function (genreIds, artistIds, page) {
            return __awaiter(this, void 0, void 0, function () {
                var response, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryGet('AlbumTracks/GetPagenatedList', {
                                genreIds: genreIds,
                                artistIds: artistIds,
                                page: page
                            })];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded) {
                                console.error(response.Errors);
                                throw new Error('Unexpected Error on ApiQuery');
                            }
                            result = response.Result;
                            result.ResultList = AlbumTracks_1.default.CreateArray(result.ResultList);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        return AlbumTracksStore;
    }(StoreBase_3.default));
    exports.default = AlbumTracksStore;
});
define("Views/Finders/Lists/SelectionAlbumTracks", ["require", "exports", "vue-class-component", "vue-property-decorator", "Views/Bases/ViewBase", "Models/AlbumTracks/AlbumTracks"], function (require, exports, vue_class_component_6, vue_property_decorator_2, ViewBase_6, AlbumTracks_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SelectionAlbumTracks = /** @class */ (function (_super) {
        __extends(SelectionAlbumTracks, _super);
        function SelectionAlbumTracks() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SelectionAlbumTracks.prototype.OnClickAlbumPlay = function () {
        };
        SelectionAlbumTracks.prototype.OnClickTrack = function () {
        };
        __decorate([
            vue_property_decorator_2.Prop(),
            __metadata("design:type", AlbumTracks_2.default)
        ], SelectionAlbumTracks.prototype, "entity", void 0);
        SelectionAlbumTracks = __decorate([
            vue_class_component_6.default({
                template: "<li class=\"nav-item w-100\"\n                   ref=\"Li\" >\n    <div class=\"card w-100\">\n        <div class=\"card-header with-border bg-secondary\">\n            <h3 class=\"card-title text-nowrap text-truncate\">\n                {{ entity.GetArtistName() }} {{ (entity.Album.Year) ? '(' + entity.Album.Year + ')' : '' }} : {{ entity.Album.Name }}\n            </h3>\n            <div class=\"card-tools\">\n                <button type=\"button\"\n                        class=\"btn btn-tool\"\n                        @click=\"OnClickAlbumPlay\" >\n                    <i class=\"fa fa-play\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"card-body row\">\n            <div class=\"col-md-4\">\n                <img class=\"albumart\" v-bind:src=\"entity.Album.GetImageFullUri()\" />\n            </div>\n            <div class=\"col-md-8\">\n                <table class=\"table table-sm table-hover tracks\">\n                    <tbody>\n                        <template v-for=\"track in entity.Tracks\">\n                        <tr @click=\"OnClickTrack\">\n                            <td class=\"tracknum\">{{ track.TrackNo }}</td>\n                            <td class=\"trackname text-truncate\">{{ track.Name }}</td>\n                            <td class=\"tracklength\">{{ track.GetTimeString() }}</td>\n                        </tr>\n                        </template>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n    </div>\n</li>"
            })
        ], SelectionAlbumTracks);
        return SelectionAlbumTracks;
    }(ViewBase_6.default));
    exports.default = SelectionAlbumTracks;
});
define("Views/Finders/Lists/AlbumList", ["require", "exports", "lodash", "vue", "vue-class-component", "vue-infinite-loading", "Models/AlbumTracks/AlbumTracksStore", "Views/Bases/ViewBase", "Views/Events/ListEvents", "Views/Finders/Lists/SelectionAlbumTracks"], function (require, exports, _, vue_3, vue_class_component_7, vue_infinite_loading_2, AlbumTracksStore_1, ViewBase_7, ListEvents_4, SelectionAlbumTracks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    vue_3.default.use(vue_infinite_loading_2.default);
    var AlbumList = /** @class */ (function (_super) {
        __extends(AlbumList, _super);
        function AlbumList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.page = 1;
            _this.genreIds = [];
            _this.artistIds = [];
            _this.store = new AlbumTracksStore_1.default();
            _this.entities = [];
            return _this;
        }
        Object.defineProperty(AlbumList.prototype, "InfiniteLoading", {
            get: function () {
                return this.$refs.InfiniteLoading;
            },
            enumerable: true,
            configurable: true
        });
        AlbumList.prototype.OnInfinite = function ($state) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.store.GetList(this.genreIds, this.artistIds, this.page)];
                        case 1:
                            result = _a.sent();
                            if (0 < result.ResultList.length)
                                this.entities = this.entities.concat(result.ResultList);
                            if (this.entities.length < result.TotalLength) {
                                $state.loaded();
                                this.page++;
                            }
                            else {
                                $state.complete();
                            }
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        AlbumList.prototype.OnClickRefresh = function () {
            this.Refresh();
            this.$emit(ListEvents_4.Events.Refreshed);
        };
        AlbumList.prototype.OnClickItem = function () {
        };
        AlbumList.prototype.Refresh = function () {
            var _this = this;
            this.page = 1;
            this.entities = [];
            this.$nextTick(function () {
                _this.InfiniteLoading.stateChanger.reset();
                _this.InfiniteLoading.attemptLoad();
            });
        };
        AlbumList.prototype.HasGenre = function (genreId) {
            return (0 <= _.indexOf(this.genreIds, genreId));
        };
        AlbumList.prototype.HasArtist = function (artistId) {
            return (0 <= _.indexOf(this.artistIds, artistId));
        };
        AlbumList.prototype.AddFilterGenreId = function (genreId) {
            if (!this.HasGenre(genreId)) {
                this.genreIds.push(genreId);
                this.Refresh();
            }
        };
        AlbumList.prototype.RemoveFilterGenreId = function (genreId) {
            if (this.HasGenre(genreId)) {
                _.pull(this.genreIds, genreId);
                this.Refresh();
            }
        };
        AlbumList.prototype.RemoveFilterAllGenres = function () {
            if (0 < this.genreIds.length) {
                this.genreIds = [];
                this.Refresh();
            }
        };
        AlbumList.prototype.AddFilterArtistId = function (artistId) {
            if (!this.HasArtist(artistId)) {
                this.artistIds.push(artistId);
                this.Refresh();
            }
        };
        AlbumList.prototype.RemoveFilterArtistId = function (artistId) {
            if (this.HasArtist(artistId)) {
                _.pull(this.artistIds, artistId);
                this.Refresh();
            }
        };
        AlbumList.prototype.RemoveFilterAllArtists = function () {
            if (0 < this.artistIds.length) {
                this.artistIds = [];
                this.Refresh();
            }
        };
        AlbumList.prototype.RemoveAllFilters = function () {
            if (0 < this.genreIds.length || 0 < this.artistIds.length) {
                this.genreIds = [];
                this.artistIds = [];
                this.Refresh();
            }
        };
        AlbumList = __decorate([
            vue_class_component_7.default({
                template: "<div class=\"col-md-6 h-100\">\n    <div class=\"card h-100\">\n        <div class=\"card-header with-border bg-secondary\">\n            <h3 class=\"card-title\">Albums</h3>\n            <div class=\"card-tools\">\n                <button type=\"button\"\n                        class=\"btn btn-tool\"\n                        @click=\"OnClickRefresh\" >\n                    <i class=\"fa fa-repeat\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"card-body list-scrollable\">\n            <ul class=\"nav nav-pills h-100 d-flex flex-column flex-nowrap\">\n                <template v-for=\"entity in entities\">\n                    <selection-album-tracks\n                        ref=\"AlbumTracks\"\n                        v-bind:entity=\"entity\"\n                        @click=\"OnClickItem\" />\n                </template>\n                <infinite-loading @infinite=\"OnInfinite\" ref=\"InfiniteLoading\"></infinite-loading>\n            </ul>\n        </div>\n    </div>\n</div>",
                components: {
                    'selection-album-tracks': SelectionAlbumTracks_1.default
                }
            })
        ], AlbumList);
        return AlbumList;
    }(ViewBase_7.default));
    exports.default = AlbumList;
});
define("Views/Finders/Finder", ["require", "exports", "Views/Bases/ViewBase", "vue-class-component", "Views/Finders/Lists/GenreList", "Views/Finders/Lists/ArtistList", "Views/Finders/Lists/AlbumList", "Libraries"], function (require, exports, ViewBase_8, vue_class_component_8, GenreList_1, ArtistList_1, AlbumList_1, Libraries_2) {
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
        Object.defineProperty(Finder.prototype, "ArtistList", {
            get: function () {
                return this.$refs.ArtistList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Finder.prototype, "AlbumList", {
            get: function () {
                return this.$refs.AlbumList;
            },
            enumerable: true,
            configurable: true
        });
        Finder.prototype.OnGenreSelectionChanged = function (args) {
            console.log('Finder.OnGenreSelectionChanged');
            console.log(args);
            if (args.selected) {
                this.ArtistList.AddFilterGenreId(args.entity.Id);
                this.AlbumList.RemoveAllFilters();
                this.AlbumList.AddFilterGenreId(args.entity.Id);
            }
            else {
                this.ArtistList.RemoveFilterGenreId(args.entity.Id);
                this.AlbumList.RemoveAllFilters();
            }
        };
        Finder.prototype.OnGenreRefreshed = function () {
            this.ArtistList.RemoveAllFilters();
            this.AlbumList.RemoveAllFilters();
        };
        Finder.prototype.OnArtistSelectionChanged = function (args) {
            if (args.selected) {
                this.AlbumList.AddFilterArtistId(args.entity.Id);
            }
            else {
                this.AlbumList.RemoveFilterArtistId(args.entity.Id);
            }
        };
        Finder.prototype.OnArtistRefreshed = function () {
            this.AlbumList.RemoveFilterAllArtists();
        };
        Finder.prototype.OnAlbumListAppended = function (args) {
            var albumIds = Libraries_2.default.Enumerable.from(args.entities)
                .select(function (e) { return e.Id; })
                .toArray();
        };
        Finder.prototype.OnAlbumSelectionChanged = function (args) {
            console.log('Finder.OnAlbumSelectionChanged');
            console.log(args);
        };
        Finder.prototype.OnAlbumRefreshed = function () {
        };
        Finder.prototype.OnTrackSelectionChanged = function (args) {
            console.log('Finder.OnTrackSelectionChanged');
            console.log(args);
        };
        Finder.prototype.OnTrackRefreshed = function () {
        };
        Finder = __decorate([
            vue_class_component_8.default({
                template: "<section class=\"content h-100\">\n    <div class=\"row\">\n        <genre-list\n            ref=\"GenreList\"\n            @SelectionChanged=\"OnGenreSelectionChanged\"\n            @Refreshed=\"OnGenreRefreshed\" />\n        <artist-list\n            ref=\"ArtistList\"\n            @SelectionChanged=\"OnArtistSelectionChanged\"\n            @Refreshed=\"OnArtistRefreshed\" />\n        <album-list\n            ref=\"AlbumList\" />\n    </div>\n</section>",
                components: {
                    'genre-list': GenreList_1.default,
                    'artist-list': ArtistList_1.default,
                    'album-list': AlbumList_1.default
                }
            })
        ], Finder);
        return Finder;
    }(ViewBase_8.default));
    exports.default = Finder;
});
define("Views/RootView", ["require", "exports", "Views/Bases/ViewBase", "Views/HeaderBars/HeaderBar", "Views/Sidebars/Sidebar", "Views/Finders/Finder"], function (require, exports, ViewBase_9, HeaderBar_1, Sidebar_1, Finder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RootView = /** @class */ (function (_super) {
        __extends(RootView, _super);
        function RootView() {
            return _super.call(this, {
                template: "<div class=\"wrapper\" style=\"height: 100%; min-height: 100%;\">\n    <header-bar ref=\"HeaderBar\" />\n    <sidebar ref=\"Sidebar\" />\n    <div class=\"content-wrapper h-100\">\n        <finder ref=\"Finder\" />\n    </div>\n</div>",
                components: {
                    'header-bar': HeaderBar_1.default,
                    'sidebar': Sidebar_1.default,
                    'finder': Finder_1.default
                }
            }) || this;
        }
        return RootView;
    }(ViewBase_9.default));
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
define("Main", ["require", "exports", "Controllers/RootContoller", "Libraries", "animate.css/animate.css", "font-awesome/css/font-awesome.css", "admin-lte/dist/css/adminlte.css", "admin-lte/dist/js/adminlte.js", "../css/site.css"], function (require, exports, RootContoller_1, Libraries_3) {
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
                Libraries_3.default.es6Promise.polyfill();
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
define("Models/Albums/AlbumStore", ["require", "exports", "Models/Bases/StoreBase", "Models/Albums/Album"], function (require, exports, StoreBase_4, Album_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AlbumStore = /** @class */ (function (_super) {
        __extends(AlbumStore, _super);
        function AlbumStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AlbumStore.prototype.GetList = function (genreIds, artistIds, page) {
            return __awaiter(this, void 0, void 0, function () {
                var response, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryGet('Album/GetPagenatedList', {
                                genreIds: genreIds,
                                artistIds: artistIds,
                                page: page
                            })];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded) {
                                console.error(response.Errors);
                                throw new Error('Unexpected Error on ApiQuery');
                            }
                            result = response.Result;
                            result.ResultList = Album_2.default.CreateArray(result.ResultList);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        return AlbumStore;
    }(StoreBase_4.default));
    exports.default = AlbumStore;
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
define("Views/Finders/Lists/AlbumList.backup", ["require", "exports", "lodash", "vue", "vue-class-component", "vue-infinite-loading", "Views/Events/ListEvents", "Models/Albums/AlbumStore", "Views/Bases/ViewBase", "Views/Shared/SelectionItem"], function (require, exports, _, vue_4, vue_class_component_9, vue_infinite_loading_3, ListEvents_5, AlbumStore_1, ViewBase_10, SelectionItem_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    vue_4.default.use(vue_infinite_loading_3.default);
    var AlbumList = /** @class */ (function (_super) {
        __extends(AlbumList, _super);
        function AlbumList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.store = new AlbumStore_1.default();
            _this.page = 1;
            _this.genreIds = [];
            _this.artistIds = [];
            _this.entities = [];
            return _this;
        }
        Object.defineProperty(AlbumList.prototype, "InfiniteLoading", {
            get: function () {
                return this.$refs.InfiniteLoading;
            },
            enumerable: true,
            configurable: true
        });
        AlbumList.prototype.OnInfinite = function ($state) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.store.GetList(this.genreIds, this.artistIds, this.page)];
                        case 1:
                            result = _a.sent();
                            if (0 < result.ResultList.length)
                                this.entities = this.entities.concat(result.ResultList);
                            if (this.entities.length < result.TotalLength) {
                                $state.loaded();
                                this.page++;
                            }
                            else {
                                $state.complete();
                            }
                            if (0 < result.ResultList.length) {
                                this.$emit(ListEvents_5.Events.ListAppended, {
                                    entities: result.ResultList
                                });
                            }
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        AlbumList.prototype.OnClickRefresh = function () {
            this.Refresh();
            this.$emit(ListEvents_5.Events.Refreshed);
        };
        AlbumList.prototype.OnSelectionChanged = function (args) {
            this.$emit(ListEvents_5.Events.SelectionChanged, args);
        };
        AlbumList.prototype.Refresh = function () {
            var _this = this;
            this.page = 1;
            this.entities = [];
            this.$nextTick(function () {
                _this.InfiniteLoading.stateChanger.reset();
                _this.InfiniteLoading.attemptLoad();
            });
        };
        AlbumList.prototype.HasGenre = function (genreId) {
            return (0 <= _.indexOf(this.genreIds, genreId));
        };
        AlbumList.prototype.HasArtist = function (artistId) {
            return (0 <= _.indexOf(this.artistIds, artistId));
        };
        AlbumList.prototype.AddFilterGenreId = function (genreId) {
            if (!this.HasGenre(genreId)) {
                this.genreIds.push(genreId);
                this.Refresh();
            }
        };
        AlbumList.prototype.RemoveFilterGenreId = function (genreId) {
            if (this.HasGenre(genreId)) {
                _.pull(this.genreIds, genreId);
                this.Refresh();
            }
        };
        AlbumList.prototype.RemoveFilterAllGenres = function () {
            if (0 < this.genreIds.length) {
                this.genreIds = [];
                this.Refresh();
            }
        };
        AlbumList.prototype.AddFilterArtistId = function (artistId) {
            if (!this.HasArtist(artistId)) {
                this.artistIds.push(artistId);
                this.Refresh();
            }
        };
        AlbumList.prototype.RemoveFilterArtistId = function (artistId) {
            if (this.HasArtist(artistId)) {
                _.pull(this.artistIds, artistId);
                this.Refresh();
            }
        };
        AlbumList.prototype.RemoveFilterAllArtists = function () {
            if (0 < this.artistIds.length) {
                this.artistIds = [];
                this.Refresh();
            }
        };
        AlbumList.prototype.RemoveAllFilters = function () {
            if (0 < this.genreIds.length || 0 < this.artistIds.length) {
                this.genreIds = [];
                this.artistIds = [];
                this.Refresh();
            }
        };
        AlbumList = __decorate([
            vue_class_component_9.default({
                template: "<div class=\"col-md-2 h-100\">\n    <div class=\"card h-100\">\n        <div class=\"card-header with-border bg-warning\">\n            <h3 class=\"card-title\">Albums</h3>\n            <div class=\"card-tools\">\n                <button type=\"button\"\n                        class=\"btn btn-tool\"\n                        @click=\"OnClickRefresh\" >\n                    <i class=\"fa fa-repeat\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"card-body list-scrollable\">\n            <ul class=\"nav nav-pills h-100 d-flex flex-column flex-nowrap\">\n                <template v-for=\"entity in entities\">\n                    <selection-item\n                        ref=\"Items\"\n                        v-bind:entity=\"entity\"\n                        @SelectionChanged=\"OnSelectionChanged\" />\n                </template>\n                <infinite-loading @infinite=\"OnInfinite\" ref=\"InfiniteLoading\"></infinite-loading>\n            </ul>\n        </div>\n    </div>\n</div>",
                components: {
                    'selection-item': SelectionItem_4.default
                }
            })
        ], AlbumList);
        return AlbumList;
    }(ViewBase_10.default));
    exports.default = AlbumList;
});
define("Views/Finders/Lists/TrackList.backup", ["require", "exports", "vue", "vue-class-component", "vue-infinite-loading", "Models/AlbumTracks/AlbumTracksStore", "Views/Bases/ViewBase", "Views/Events/ListEvents", "Views/Finders/Lists/SelectionAlbumTracks"], function (require, exports, vue_5, vue_class_component_10, vue_infinite_loading_4, AlbumTracksStore_2, ViewBase_11, ListEvents_6, SelectionAlbumTracks_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    vue_5.default.use(vue_infinite_loading_4.default);
    var TrackList = /** @class */ (function (_super) {
        __extends(TrackList, _super);
        function TrackList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.PageLength = 6;
            _this.page = 1;
            _this.albumIds = [];
            _this.store = new AlbumTracksStore_2.default();
            _this.entities = [];
            return _this;
        }
        Object.defineProperty(TrackList.prototype, "InfiniteLoading", {
            get: function () {
                return this.$refs.InfiniteLoading;
            },
            enumerable: true,
            configurable: true
        });
        // AlbumTracksStore.GetList()の引数変更に伴い、コメントアウト
        //public async OnInfinite($state: StateChanger): Promise<boolean> {
        //    var targetAlbumIds = Libraries.Enumerable.from(this.albumIds)
        //        .skip((this.page - 1) * this.PageLength)
        //        .take(this.PageLength)
        //        .toArray();
        //    if (0 < targetAlbumIds.length) {
        //        var result = await this.store.GetList(targetAlbumIds);
        //        if (0 < result.length)
        //            this.entities = this.entities.concat(result);
        //        $state.loaded();
        //        this.page++;
        //        if (0 < result.length) {
        //            this.$emit(Events.ListAppended, {
        //                entities: result
        //            } as IListAppendedArgs);
        //        }
        //    } else {
        //        $state.complete();
        //    }
        //    return true;
        //}
        TrackList.prototype.Refresh = function () {
            var _this = this;
            this.page = 1;
            this.entities = [];
            this.$nextTick(function () {
                _this.InfiniteLoading.stateChanger.reset();
                _this.InfiniteLoading.attemptLoad();
            });
        };
        TrackList.prototype.OnClickRefresh = function () {
            this.Refresh();
            this.$emit(ListEvents_6.Events.Refreshed);
        };
        TrackList.prototype.OnClickItem = function () {
        };
        TrackList.prototype.ClearAlbumIds = function () {
            this.albumIds = [];
            this.Refresh();
        };
        TrackList.prototype.AppendAlbumIds = function (albumIds) {
            this.albumIds = this.albumIds.concat(albumIds);
            this.InfiniteLoading.stateChanger.reset();
            this.InfiniteLoading.attemptLoad();
        };
        TrackList = __decorate([
            vue_class_component_10.default({
                template: "<div class=\"col-md-6 h-100\">\n    <div class=\"card h-100\">\n        <div class=\"card-header with-border bg-secondary\">\n            <h3 class=\"card-title\">Tracks</h3>\n            <div class=\"card-tools\">\n                <button type=\"button\"\n                        class=\"btn btn-tool\"\n                        @click=\"OnClickRefresh\" >\n                    <i class=\"fa fa-repeat\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"card-body list-scrollable\">\n            <ul class=\"nav nav-pills h-100 d-flex flex-column flex-nowrap\">\n                <template v-for=\"entity in entities\">\n                    <selection-album-tracks\n                        ref=\"AlbumTracks\"\n                        v-bind:entity=\"entity\"\n                        @click=\"OnClickItem\" />\n                </template>\n                <infinite-loading @infinite=\"OnInfinite\" ref=\"InfiniteLoading\"></infinite-loading>\n            </ul>\n        </div>\n    </div>\n</div>",
                components: {
                    'selection-album-tracks': SelectionAlbumTracks_2.default
                }
            })
        ], TrackList);
        return TrackList;
    }(ViewBase_11.default));
    exports.default = TrackList;
});
//# sourceMappingURL=tsout.js.map