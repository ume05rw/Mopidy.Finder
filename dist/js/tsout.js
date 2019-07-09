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
define("Libraries", ["require", "exports", "linq", "jquery", "responsive-toolkit/dist/bootstrap-toolkit", "vue-slider-component"], function (require, exports, Enumerable, jQuery, ResponsiveBootstrapToolkit, VueSlider) {
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
        jQuery: ((jQuery.default)
            ? jQuery.default
            : jQuery),
        $: ((jQuery.default)
            ? jQuery.default
            : jQuery),
        ResponsiveBootstrapToolkit: ((ResponsiveBootstrapToolkit.default)
            ? ResponsiveBootstrapToolkit.default
            : ResponsiveBootstrapToolkit),
        VueSlider: VueSlider,
    };
    // ResponsiveBootstrapToolkitをbootstrap4に対応させる
    // https://github.com/maciej-gurban/responsive-bootstrap-toolkit/issues/52
    ResponsiveBootstrapToolkit.use('bs4', {
        'xs': Libraries.$('<div class="d-xs-block d-sm-none d-md-none d-lg-none d-xl-none"></div>'),
        'sm': Libraries.$('<div class="d-none d-sm-block d-md-none d-lg-none d-xl-none"></div>'),
        'md': Libraries.$('<div class="d-none d-md-block d-sm-none d-lg-none d-xl-none"></div>'),
        'lg': Libraries.$('<div class="d-none d-lg-block d-sm-none d-md-none d-xl-none"></div>'),
        'xl': Libraries.$('<div class="d-none d-xl-block d-sm-none d-md-none d-lg-none"></div>')
    });
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
define("Views/Sidebars/Sidebar", ["require", "exports", "Views/Bases/ViewBase", "vue-class-component", "Libraries"], function (require, exports, ViewBase_2, vue_class_component_2, Libraries_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Sidebar = /** @class */ (function (_super) {
        __extends(Sidebar, _super);
        function Sidebar() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.volume = 100;
            return _this;
        }
        Sidebar = __decorate([
            vue_class_component_2.default({
                template: "<aside class=\"main-sidebar sidebar-dark-primary elevation-4\">\n    <div class=\"brand-link navbar-secondary\">\n        <span class=\"brand-text font-weight-light\">Music Front</span>\n    </div>\n    <div class=\"sidebar\">\n        <nav class=\"mt-2\">\n            <ul class=\"nav nav-pills nav-sidebar flex-column\" role=\"tablist\">\n                <li class=\"nav-item\">\n                    <a  class=\"nav-link active\"\n                        href=\"#tab-finder\"\n                        role=\"tab\"\n                        aria-controls=\"tab-finder\"\n                        aria-selected=\"true\">\n                        <i class=\"fa fa-search nav-icon\" />\n                        <p>Finder</p>\n                    </a>\n                </li>\n                <li class=\"nav-item\">\n                    <a  class=\"nav-link\"\n                        href=\"#tab-playlists\"\n                        role=\"tab\"\n                        aria-controls=\"tab-playlists\"\n                        aria-selected=\"false\">\n                        <i class=\"fa fa-bookmark nav-icon\" />\n                        <p>Playlists</p>\n                    </a>\n                </li>\n                <li class=\"nav-item\">\n                    <a  class=\"nav-link\"\n                        href=\"#tab-settings\"\n                        role=\"tab\"\n                        aria-controls=\"tab-settings\"\n                        aria-selected=\"false\">\n                        <i class=\"fa fa-server nav-icon\" />\n                        <p>Server</p>\n                    </a>\n                </li>\n            </ul>\n        </nav>\n        <div class=\"row mt-2\">\n            <div class=\"col-12\">\n                <vue-slider v-model=\"volume\"></vue-slider>\n            </div>\n        </div>\n    </div>\n</aside>",
                components: {
                    'vue-slider': Libraries_1.default.VueSlider
                }
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
define("Views/Events/FinderEvents", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Events = {
        SelectionChanged: 'SelectionChanged',
        Refreshed: 'Refreshed',
        TrackSelected: 'TrackSelected'
    };
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
define("Models/Albums/Album", ["require", "exports", "lodash", "Models/Relations/ArtistAlbum", "Models/Relations/GenreAlbum"], function (require, exports, _, ArtistAlbum_1, GenreAlbum_1) {
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
            result.ArtistAlbums = ArtistAlbum_1.default.CreateArray(entity.ArtistAlbums);
            result.GenreAlbums = GenreAlbum_1.default.CreateArray(entity.GenreAlbums);
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
define("Models/Artists/Artist", ["require", "exports", "lodash", "Models/Relations/ArtistAlbum", "Models/Relations/GenreArtist"], function (require, exports, _, ArtistAlbum_2, GenreArtist_1) {
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
            result.ArtistAlbums = ArtistAlbum_2.default.CreateArray(entity.ArtistAlbums);
            result.GenreArtists = GenreArtist_1.default.CreateArray(entity.GenreArtists);
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
define("Models/AlbumTracks/AlbumTracks", ["require", "exports", "lodash", "Models/Albums/Album", "Models/Artists/Artist", "Models/Tracks/Track"], function (require, exports, _, Album_1, Artist_1, Track_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AlbumTracks = /** @class */ (function () {
        function AlbumTracks() {
        }
        AlbumTracks.Create = function (entity) {
            var result = new AlbumTracks();
            result.Album = Album_1.default.Create(entity.Album);
            result.Artists = Artist_1.default.CreateArray(entity.Artists);
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
define("Models/Bases/StoreBase", ["require", "exports", "Libraries", "Models/Bases/XhrQueryableBase"], function (require, exports, Libraries_2, XhrQueryableBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StoreBase = /** @class */ (function (_super) {
        __extends(StoreBase, _super);
        function StoreBase() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.Enumerable = Libraries_2.default.Enumerable;
            return _this;
        }
        return StoreBase;
    }(XhrQueryableBase_1.default));
    exports.default = StoreBase;
});
define("Models/AlbumTracks/AlbumTracksStore", ["require", "exports", "Models/Bases/StoreBase", "Models/AlbumTracks/AlbumTracks"], function (require, exports, StoreBase_1, AlbumTracks_1) {
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
                                GenreIds: genreIds,
                                ArtistIds: artistIds,
                                Page: page
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
        AlbumTracksStore.prototype.PlayAlbumByTrack = function (track) {
            return __awaiter(this, void 0, void 0, function () {
                var response, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryPost('Player/PlayAlbumByTrack', track)];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded) {
                                console.error(response.Errors);
                                throw new Error('Unexpected Error on ApiQuery');
                            }
                            result = AlbumTracks_1.default.Create(response.Result);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        AlbumTracksStore.prototype.PlayAlbumByTlId = function (tlId) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryPost('Player/PlayAlbumByTlId', tlId)];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded) {
                                console.error(response.Errors);
                                throw new Error('Unexpected Error on ApiQuery');
                            }
                            return [2 /*return*/, response.Result];
                    }
                });
            });
        };
        AlbumTracksStore.prototype.ClearList = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryPost('Player/ClearList')];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded) {
                                console.error(response.Errors);
                                throw new Error('Unexpected Error on ApiQuery');
                            }
                            return [2 /*return*/, response.Result];
                    }
                });
            });
        };
        return AlbumTracksStore;
    }(StoreBase_1.default));
    exports.default = AlbumTracksStore;
});
define("Views/Finders/Lists/SelectionAlbumTracks", ["require", "exports", "vue-class-component", "vue-property-decorator", "Views/Bases/ViewBase", "Models/AlbumTracks/AlbumTracks", "Libraries", "Views/Events/FinderEvents"], function (require, exports, vue_class_component_3, vue_property_decorator_1, ViewBase_3, AlbumTracks_2, Libraries_3, FinderEvents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SelectionAlbumTracks = /** @class */ (function (_super) {
        __extends(SelectionAlbumTracks, _super);
        function SelectionAlbumTracks() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SelectionAlbumTracks.prototype.OnClickAlbumPlay = function () {
            var tracks = Libraries_3.default.Enumerable.from(this.entity.Tracks);
            var firstTrack = tracks.first(function (e) { return e.TrackNo === tracks.min(function (e2) { return e2.TrackNo; }); });
            this.$emit(FinderEvents_1.Events.TrackSelected, {
                AlbumId: this.entity.Album.Id,
                TrackId: firstTrack.Id
            });
        };
        SelectionAlbumTracks.prototype.OnClickTrack = function (args) {
            var tr = args.target.parentElement;
            var trackId = parseInt(tr.getAttribute('data-trackid'), 10);
            this.$emit(FinderEvents_1.Events.TrackSelected, {
                AlbumId: this.entity.Album.Id,
                TrackId: trackId
            });
        };
        __decorate([
            vue_property_decorator_1.Prop(),
            __metadata("design:type", AlbumTracks_2.default)
        ], SelectionAlbumTracks.prototype, "entity", void 0);
        SelectionAlbumTracks = __decorate([
            vue_class_component_3.default({
                template: "<li class=\"nav-item w-100\"\n                   ref=\"Li\" >\n    <div class=\"card w-100\">\n        <div class=\"card-header with-border bg-secondary\">\n            <h3 class=\"card-title text-nowrap text-truncate\">\n                {{ entity.GetArtistName() }} {{ (entity.Album.Year) ? '(' + entity.Album.Year + ')' : '' }} : {{ entity.Album.Name }}\n            </h3>\n            <div class=\"card-tools\">\n                <button type=\"button\"\n                        class=\"btn btn-tool\"\n                        @click=\"OnClickAlbumPlay\" >\n                    <i class=\"fa fa-play\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"card-body row\">\n            <div class=\"col-md-4\">\n                <img class=\"albumart\" v-bind:src=\"entity.Album.GetImageFullUri()\" />\n            </div>\n            <div class=\"col-md-8\">\n                <table class=\"table table-sm table-hover tracks\">\n                    <tbody>\n                        <template v-for=\"track in entity.Tracks\">\n                        <tr @click=\"OnClickTrack\"\n                            v-bind:data-trackid=\"track.Id\">\n                            <td class=\"tracknum\">{{ track.TrackNo }}</td>\n                            <td class=\"trackname text-truncate\">{{ track.Name }}</td>\n                            <td class=\"tracklength\">{{ track.GetTimeString() }}</td>\n                        </tr>\n                        </template>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n    </div>\n</li>"
            })
        ], SelectionAlbumTracks);
        return SelectionAlbumTracks;
    }(ViewBase_3.default));
    exports.default = SelectionAlbumTracks;
});
define("Views/Finders/Lists/AlbumList", ["require", "exports", "lodash", "vue", "vue-class-component", "vue-infinite-loading", "Models/AlbumTracks/AlbumTracksStore", "Views/Bases/ViewBase", "Views/Events/FinderEvents", "Views/Finders/Lists/SelectionAlbumTracks", "Libraries"], function (require, exports, _, vue_2, vue_class_component_4, vue_infinite_loading_1, AlbumTracksStore_1, ViewBase_4, FinderEvents_2, SelectionAlbumTracks_1, Libraries_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    vue_2.default.use(vue_infinite_loading_1.default);
    var AlbumList = /** @class */ (function (_super) {
        __extends(AlbumList, _super);
        function AlbumList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isEntitiesRefreshed = false;
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
            this.$emit(FinderEvents_2.Events.Refreshed);
        };
        AlbumList.prototype.OnTrackSelected = function (args) {
            return __awaiter(this, void 0, void 0, function () {
                var albumTracks, tracks, track, isAllTracksRegistered, result, resultAtls, updatedTracks;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.isEntitiesRefreshed) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.store.ClearList()];
                        case 1:
                            _a.sent();
                            _.each(this.entities, function (entity) {
                                _.each(entity.Tracks, function (track) {
                                    track.TlId = null;
                                });
                            });
                            this.isEntitiesRefreshed = false;
                            _a.label = 2;
                        case 2:
                            albumTracks = Libraries_4.default.Enumerable.from(this.entities)
                                .firstOrDefault(function (e) { return e.Album.Id === args.AlbumId; });
                            if (!albumTracks) {
                                console.error('AlbumTracks Not Found: AlbumId=' + args.AlbumId);
                                return [2 /*return*/, false];
                            }
                            tracks = Libraries_4.default.Enumerable.from(albumTracks.Tracks);
                            track = tracks.firstOrDefault(function (e) { return e.Id === args.TrackId; });
                            if (!track) {
                                console.error('Track Not Found: TrackId=' + args.TrackId);
                                return [2 /*return*/, false];
                            }
                            isAllTracksRegistered = tracks.all(function (e) { return e.TlId !== null; });
                            if (!isAllTracksRegistered) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.store.PlayAlbumByTlId(track.TlId)];
                        case 3:
                            result = _a.sent();
                            return [2 /*return*/, result];
                        case 4: return [4 /*yield*/, this.store.PlayAlbumByTrack(track)];
                        case 5:
                            resultAtls = _a.sent();
                            updatedTracks = Libraries_4.default.Enumerable.from(resultAtls.Tracks);
                            _.each(albumTracks.Tracks, function (track) {
                                track.TlId = updatedTracks.firstOrDefault(function (e) { return e.Id == track.Id; }).TlId;
                            });
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        AlbumList.prototype.Refresh = function () {
            var _this = this;
            this.page = 1;
            this.entities = [];
            this.isEntitiesRefreshed = true;
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
            vue_class_component_4.default({
                template: "<div class=\"col-md-6\">\n    <div class=\"card\">\n        <div class=\"card-header with-border bg-secondary\">\n            <h3 class=\"card-title\">Albums</h3>\n            <div class=\"card-tools\">\n                <button type=\"button\"\n                        class=\"btn btn-tool\"\n                        @click=\"OnClickRefresh\" >\n                    <i class=\"fa fa-repeat\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"card-body list-scrollable\">\n            <ul class=\"nav nav-pills h-100 d-flex flex-column flex-nowrap\">\n                <template v-for=\"entity in entities\">\n                    <selection-album-tracks\n                        ref=\"AlbumTracks\"\n                        v-bind:entity=\"entity\"\n                        @TrackSelected=\"OnTrackSelected\" />\n                </template>\n                <infinite-loading @infinite=\"OnInfinite\" ref=\"InfiniteLoading\"></infinite-loading>\n            </ul>\n        </div>\n    </div>\n</div>",
                components: {
                    'selection-album-tracks': SelectionAlbumTracks_1.default
                }
            })
        ], AlbumList);
        return AlbumList;
    }(ViewBase_4.default));
    exports.default = AlbumList;
});
define("Models/Artists/ArtistStore", ["require", "exports", "Models/Bases/StoreBase", "Models/Artists/Artist"], function (require, exports, StoreBase_2, Artist_2) {
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
                                GenreIds: genreIds,
                                Page: page
                            })];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded) {
                                console.error(response.Errors);
                                throw new Error('Unexpected Error on ApiQuery');
                            }
                            result = response.Result;
                            result.ResultList = Artist_2.default.CreateArray(result.ResultList);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        return ArtistStore;
    }(StoreBase_2.default));
    exports.default = ArtistStore;
});
define("Views/Events/AdminLteEvents", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WidgetEvents = {
        Expanded: 'expanded.lte.widget',
        Collapsed: 'collapsed.lte.widget',
        Maximized: 'maximized.lte.widget',
        Minimized: 'minimized.lte.widget',
        Removed: 'removed.lte.widget'
    };
});
define("Views/Shared/SelectionItem", ["require", "exports", "vue-class-component", "vue-property-decorator", "Views/Bases/ViewBase", "Views/Events/FinderEvents"], function (require, exports, vue_class_component_5, vue_property_decorator_2, ViewBase_5, FinderEvents_3) {
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
            this.$emit(FinderEvents_3.Events.SelectionChanged, {
                Entity: this.entity,
                Selected: this.selected
            });
        };
        SelectionItem.prototype.IsSelected = function () {
            return this.selected;
        };
        var SelectionItem_1;
        SelectionItem.SelectedColor = 'bg-gray';
        __decorate([
            vue_property_decorator_2.Prop(),
            __metadata("design:type", Object)
        ], SelectionItem.prototype, "entity", void 0);
        SelectionItem = SelectionItem_1 = __decorate([
            vue_class_component_5.default({
                template: "<li class=\"nav-item\"\n                   ref=\"Li\" >\n    <a href=\"javascript:void(0)\" class=\"d-inline-block w-100 text-nowrap text-truncate\"\n       @click=\"OnClick\" >\n        {{ entity.Name }}\n    </a>\n</li>"
            })
        ], SelectionItem);
        return SelectionItem;
    }(ViewBase_5.default));
    exports.default = SelectionItem;
});
define("Views/Finders/Lists/ArtistList", ["require", "exports", "admin-lte/dist/js/adminlte.js", "lodash", "vue", "vue-class-component", "vue-infinite-loading", "Libraries", "Models/Artists/ArtistStore", "Views/Bases/ViewBase", "Views/Events/AdminLteEvents", "Views/Events/FinderEvents", "Views/Shared/SelectionItem"], function (require, exports, AdminLte, _, vue_3, vue_class_component_6, vue_infinite_loading_2, Libraries_5, ArtistStore_1, ViewBase_6, AdminLteEvents_1, FinderEvents_4, SelectionItem_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    vue_3.default.use(vue_infinite_loading_2.default);
    var ArtistList = /** @class */ (function (_super) {
        __extends(ArtistList, _super);
        function ArtistList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.store = new ArtistStore_1.default();
            _this.page = 1;
            _this.genreIds = [];
            _this.entities = [];
            _this.viewport = Libraries_5.default.ResponsiveBootstrapToolkit;
            _this.isExpanded = true;
            return _this;
        }
        Object.defineProperty(ArtistList.prototype, "InfiniteLoading", {
            get: function () {
                return this.$refs.InfiniteLoading;
            },
            enumerable: true,
            configurable: true
        });
        ArtistList.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var button;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.Initialize.call(this)];
                        case 1:
                            _a.sent();
                            button = Libraries_5.default.$(this.$refs.ButtonCollaple);
                            this.boxWidget = new AdminLte.Widget(button);
                            button.on(AdminLteEvents_1.WidgetEvents.Collapsed, function () {
                                _this.isExpanded = false;
                            });
                            button.on(AdminLteEvents_1.WidgetEvents.Expanded, function () {
                                _this.isExpanded = true;
                            });
                            Libraries_5.default.$(window).resize(this.viewport.changed(function () {
                                _this.ToggleListByViewport();
                            }));
                            _.delay(function () {
                                _this.ToggleListByViewport();
                            }, 1000);
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        ArtistList.prototype.OnCollapleClick = function () {
            this.boxWidget.toggle();
        };
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
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        ArtistList.prototype.OnClickRefresh = function () {
            this.Refresh();
            this.$emit(FinderEvents_4.Events.Refreshed);
        };
        ArtistList.prototype.OnSelectionChanged = function (args) {
            this.$emit(FinderEvents_4.Events.SelectionChanged, args);
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
        ArtistList.prototype.ToggleListByViewport = function () {
            if (this.viewport.is('<=sm') && this.isExpanded) {
                this.boxWidget.collapse();
            }
            else if (this.viewport.is('>sm') && !this.isExpanded) {
                this.boxWidget.expand();
            }
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
            vue_class_component_6.default({
                template: "<div class=\"col-md-3\">\n    <div id=\"artistList\" class=\"card\">\n        <div class=\"card-header with-border bg-info\">\n            <h3 class=\"card-title\">Artists</h3>\n            <div class=\"card-tools\">\n                <button\n                    class=\"btn btn-tool d-inline d-md-none collapse\"\n                    ref=\"ButtonCollaple\"\n                    @click=\"OnCollapleClick\" >\n                    <i class=\"fa fa-minus\" />\n                </button>\n                <button type=\"button\"\n                        class=\"btn btn-tool\"\n                        @click=\"OnClickRefresh\" >\n                    <i class=\"fa fa-repeat\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"card-body list-scrollable\">\n            <ul class=\"nav nav-pills h-100 d-flex flex-column flex-nowrap\">\n                <template v-for=\"entity in entities\">\n                <selection-item\n                    ref=\"Items\"\n                    v-bind:entity=\"entity\"\n                    @SelectionChanged=\"OnSelectionChanged\" />\n                </template>\n                <infinite-loading @infinite=\"OnInfinite\" ref=\"InfiniteLoading\"></infinite-loading>\n            </ul>\n        </div>\n    </div>\n</div>",
                components: {
                    'selection-item': SelectionItem_2.default
                }
            })
        ], ArtistList);
        return ArtistList;
    }(ViewBase_6.default));
    exports.default = ArtistList;
});
define("Models/Genres/Genre", ["require", "exports", "lodash", "Models/Relations/GenreArtist", "Models/Relations/GenreAlbum"], function (require, exports, _, GenreArtist_2, GenreAlbum_2) {
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
            result.GenreArtists = GenreArtist_2.default.CreateArray(entity.GenreArtists);
            result.GenreAlbums = GenreAlbum_2.default.CreateArray(entity.GenreAlbums);
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
define("Models/Genres/GenreStore", ["require", "exports", "Models/Bases/StoreBase", "Models/Genres/Genre"], function (require, exports, StoreBase_3, Genre_1) {
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
    }(StoreBase_3.default));
    exports.default = GenreStore;
});
define("Views/Finders/Lists/GenreList", ["require", "exports", "admin-lte/dist/js/adminlte.js", "lodash", "vue-class-component", "Libraries", "Models/Genres/GenreStore", "Views/Bases/ViewBase", "Views/Events/AdminLteEvents", "Views/Events/FinderEvents", "Views/Shared/SelectionItem"], function (require, exports, AdminLte, _, vue_class_component_7, Libraries_6, GenreStore_1, ViewBase_7, AdminLteEvents_2, FinderEvents_5, SelectionItem_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenreList = /** @class */ (function (_super) {
        __extends(GenreList, _super);
        function GenreList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.store = new GenreStore_1.default();
            _this.entities = [];
            _this.viewport = Libraries_6.default.ResponsiveBootstrapToolkit;
            _this.isExpanded = true;
            return _this;
        }
        GenreList.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var button;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.Initialize.call(this)];
                        case 1:
                            _a.sent();
                            button = Libraries_6.default.$(this.$refs.ButtonCollaple);
                            this.boxWidget = new AdminLte.Widget(button);
                            button.on(AdminLteEvents_2.WidgetEvents.Collapsed, function () {
                                _this.isExpanded = false;
                            });
                            button.on(AdminLteEvents_2.WidgetEvents.Expanded, function () {
                                _this.isExpanded = true;
                            });
                            Libraries_6.default.$(window).resize(this.viewport.changed(function () {
                                _this.ToggleListByViewport();
                            }));
                            _.delay(function () {
                                _this.ToggleListByViewport();
                            }, 1000);
                            this.Refresh();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        GenreList.prototype.OnCollapleClick = function () {
            this.boxWidget.toggle();
        };
        GenreList.prototype.OnClickRefresh = function () {
            this.Refresh();
            this.$emit(FinderEvents_5.Events.Refreshed);
        };
        GenreList.prototype.OnSelectionChanged = function (args) {
            this.$emit(FinderEvents_5.Events.SelectionChanged, args);
        };
        GenreList.prototype.Refresh = function () {
            var _this = this;
            this.entities = [];
            this.store.GetList()
                .then(function (en) {
                _this.entities = en.toArray();
            });
        };
        GenreList.prototype.ToggleListByViewport = function () {
            if (this.viewport.is('<=sm') && this.isExpanded) {
                this.boxWidget.collapse();
            }
            else if (this.viewport.is('>sm') && !this.isExpanded) {
                this.boxWidget.expand();
            }
        };
        GenreList = __decorate([
            vue_class_component_7.default({
                template: "<div class=\"col-md-3\">\n    <div class=\"card\">\n        <div class=\"card-header with-border bg-green\">\n            <h3 class=\"card-title\">Genres</h3>\n            <div class=\"card-tools\">\n                <button\n                    class=\"btn btn-tool d-inline d-md-none collapse\"\n                    ref=\"ButtonCollaple\"\n                    @click=\"OnCollapleClick\" >\n                    <i class=\"fa fa-minus\" />\n                </button>\n                <button type=\"button\"\n                        class=\"btn btn-tool\"\n                        @click=\"OnClickRefresh\" >\n                    <i class=\"fa fa-repeat\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"card-body list-scrollable\">\n            <ul class=\"nav nav-pills h-100 d-flex flex-column flex-nowrap\">\n            <template v-for=\"entity in entities\">\n                <selection-item\n                    ref=\"Items\"\n                    v-bind:entity=\"entity\"\n                    @SelectionChanged=\"OnSelectionChanged\" />\n            </template>\n            </ul>\n        </div>\n    </div>\n</div>",
                components: {
                    'selection-item': SelectionItem_3.default
                }
            })
        ], GenreList);
        return GenreList;
    }(ViewBase_7.default));
    exports.default = GenreList;
});
define("Views/Finders/Finder", ["require", "exports", "vue-class-component", "Views/Bases/ViewBase", "Views/Finders/Lists/AlbumList", "Views/Finders/Lists/ArtistList", "Views/Finders/Lists/GenreList"], function (require, exports, vue_class_component_8, ViewBase_8, AlbumList_1, ArtistList_1, GenreList_1) {
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
            if (args.Selected) {
                this.ArtistList.AddFilterGenreId(args.Entity.Id);
                this.AlbumList.RemoveAllFilters();
                this.AlbumList.AddFilterGenreId(args.Entity.Id);
            }
            else {
                this.ArtistList.RemoveFilterGenreId(args.Entity.Id);
                this.AlbumList.RemoveAllFilters();
            }
        };
        Finder.prototype.OnGenreRefreshed = function () {
            this.ArtistList.RemoveAllFilters();
            this.AlbumList.RemoveAllFilters();
        };
        Finder.prototype.OnArtistSelectionChanged = function (args) {
            if (args.Selected) {
                this.AlbumList.AddFilterArtistId(args.Entity.Id);
            }
            else {
                this.AlbumList.RemoveFilterArtistId(args.Entity.Id);
            }
        };
        Finder.prototype.OnArtistRefreshed = function () {
            this.AlbumList.RemoveFilterAllArtists();
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
                template: "<section class=\"content h-100 tab-pane fade show active\"\n                        id=\"tab-finder\"\n                        role=\"tabpanel\"\n                        aria-labelledby=\"finder-tab\">\n    <div class=\"row\">\n        <genre-list\n            ref=\"GenreList\"\n            @SelectionChanged=\"OnGenreSelectionChanged\"\n            @Refreshed=\"OnGenreRefreshed\" />\n        <artist-list\n            ref=\"ArtistList\"\n            @SelectionChanged=\"OnArtistSelectionChanged\"\n            @Refreshed=\"OnArtistRefreshed\" />\n        <album-list\n            ref=\"AlbumList\" />\n    </div>\n</section>",
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
define("Views/Playlists/Playlists", ["require", "exports", "vue-class-component", "Views/Bases/ViewBase"], function (require, exports, vue_class_component_9, ViewBase_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Playlists = /** @class */ (function (_super) {
        __extends(Playlists, _super);
        function Playlists() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Playlists = __decorate([
            vue_class_component_9.default({
                template: "<section class=\"content h-100 tab-pane fade\"\n                        id=\"tab-playlists\"\n                        role=\"tabpanel\"\n                        aria-labelledby=\"playlists-tab\">\n</section>",
                components: {}
            })
        ], Playlists);
        return Playlists;
    }(ViewBase_9.default));
    exports.default = Playlists;
});
define("Views/Settings/Settings", ["require", "exports", "vue-class-component", "Views/Bases/ViewBase"], function (require, exports, vue_class_component_10, ViewBase_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Settings = /** @class */ (function (_super) {
        __extends(Settings, _super);
        function Settings() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Settings = __decorate([
            vue_class_component_10.default({
                template: "<section class=\"content h-100 tab-pane fade\"\n                        id=\"tab-settings\"\n                        role=\"tabpanel\"\n                        aria-labelledby=\"settings-tab\">\n</section>",
                components: {}
            })
        ], Settings);
        return Settings;
    }(ViewBase_10.default));
    exports.default = Settings;
});
define("Views/RootView", ["require", "exports", "Views/Bases/ViewBase", "Views/HeaderBars/HeaderBar", "Views/Sidebars/Sidebar", "Views/Finders/Finder", "Views/Playlists/Playlists", "Views/Settings/Settings"], function (require, exports, ViewBase_11, HeaderBar_1, Sidebar_1, Finder_1, Playlists_1, Settings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RootView = /** @class */ (function (_super) {
        __extends(RootView, _super);
        function RootView() {
            return _super.call(this, {
                template: "<div class=\"wrapper\" style=\"height: 100%; min-height: 100%;\">\n    <header-bar ref=\"HeaderBar\" />\n    <sidebar ref=\"Sidebar\" />\n    <div class=\"content-wrapper h-100 pt-3 tab-content\">\n        <finder ref=\"Finder\" />\n        <playlists ref=\"Playlists\" />\n        <settings ref=\"Settings\" />\n    </div>\n</div>",
                components: {
                    'header-bar': HeaderBar_1.default,
                    'sidebar': Sidebar_1.default,
                    'finder': Finder_1.default,
                    'playlists': Playlists_1.default,
                    'settings': Settings_1.default
                }
            }) || this;
        }
        return RootView;
    }(ViewBase_11.default));
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
define("Main", ["require", "exports", "Controllers/RootContoller", "animate.css/animate.css", "font-awesome/css/font-awesome.css", "admin-lte/dist/css/adminlte.css", "vue-slider-component/theme/antd.css", "../css/site.css", "admin-lte/dist/js/adminlte.js"], function (require, exports, RootContoller_1) {
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
                            this._rootController = new RootContoller_1.default();
                            return [4 /*yield*/, this._rootController.Init()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, this];
                    }
                });
            });
        };
        return Main;
    }());
    var main = (new Main()).Init();
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
//# sourceMappingURL=tsout.js.map