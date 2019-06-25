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
define("Models/Stores/StoreBase", ["require", "exports", "axios"], function (require, exports, axios_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StoreBase = /** @class */ (function () {
        function StoreBase() {
        }
        StoreBase.prototype.GetAll = function () {
            return this.Entities.toArray();
        };
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
define("Definitions/ApiMethods", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ApiMethods = /** @class */ (function () {
        function ApiMethods() {
        }
        ApiMethods.LibrarySearch = 'core.library.search';
        ApiMethods.LibraryBrowse = 'core.library.browse';
        return ApiMethods;
    }());
    exports.default = ApiMethods;
});
define("Models/Entities/MopidyRef", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MopidyRef = /** @class */ (function () {
        function MopidyRef() {
        }
        return MopidyRef;
    }());
    exports.default = MopidyRef;
});
define("Models/Entities/Artist", ["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Artist = /** @class */ (function () {
        function Artist(name, uri) {
            if (!name || name === '')
                throw new Error('name is required.');
            if (!uri || uri === '')
                throw new Error('uri is required.');
            this._id = _.uniqueId('artist_');
            this._name = name;
            this._uri = uri;
        }
        Object.defineProperty(Artist.prototype, "Id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Artist.prototype, "Name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Artist.prototype, "Uri", {
            get: function () {
                return this._uri;
            },
            enumerable: true,
            configurable: true
        });
        return Artist;
    }());
    exports.default = Artist;
});
define("Models/Stores/ArtistStore", ["require", "exports", "lodash", "Libraries", "Models/Stores/StoreBase", "Definitions/ApiMethods", "Models/Entities/Artist"], function (require, exports, _, Libraries_1, StoreBase_1, ApiMethods_1, Artist_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArtistStore = /** @class */ (function (_super) {
        __extends(ArtistStore, _super);
        function ArtistStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ArtistStore.prototype.Init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var entities, result, refs, promises;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            entities = [];
                            return [4 /*yield*/, this.Query(ApiMethods_1.default.LibraryBrowse, {
                                    uri: 'local:directory?type=artist'
                                })];
                        case 1:
                            result = _a.sent();
                            refs = result.result;
                            promises = [];
                            _.each(refs, function (ref) { return __awaiter(_this, void 0, void 0, function () {
                                var artist;
                                return __generator(this, function (_a) {
                                    artist = new Artist_1.default(ref.name, ref.uri);
                                    entities.push(artist);
                                    return [2 /*return*/];
                                });
                            }); });
                            return [4 /*yield*/, Promise.all(promises)];
                        case 2:
                            _a.sent();
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
define("Models/Entities/Genre", ["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Genre = /** @class */ (function () {
        function Genre(name, uri) {
            if (!name || name === '')
                throw new Error('name is required.');
            if (!uri || uri === '')
                throw new Error('uri is required.');
            this._id = _.uniqueId('genre_');
            this._name = name;
            this._uri = uri;
        }
        Object.defineProperty(Genre.prototype, "Id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Genre.prototype, "Name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Genre.prototype, "Uri", {
            get: function () {
                return this._uri;
            },
            enumerable: true,
            configurable: true
        });
        return Genre;
    }());
    exports.default = Genre;
});
define("Models/Stores/GenreStore", ["require", "exports", "lodash", "Libraries", "Models/Stores/StoreBase", "Definitions/ApiMethods", "Models/Entities/Genre"], function (require, exports, _, Libraries_2, StoreBase_2, ApiMethods_2, Genre_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenreStore = /** @class */ (function (_super) {
        __extends(GenreStore, _super);
        function GenreStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GenreStore.prototype.Init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var entities, result, refs;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            entities = [];
                            return [4 /*yield*/, this.Query(ApiMethods_2.default.LibraryBrowse, {
                                    uri: 'local:directory?type=genre'
                                })];
                        case 1:
                            result = _a.sent();
                            refs = result.result;
                            _.each(refs, function (ref) { return __awaiter(_this, void 0, void 0, function () {
                                var genre;
                                return __generator(this, function (_a) {
                                    genre = new Genre_1.default(ref.name, ref.uri);
                                    entities.push(genre);
                                    return [2 /*return*/];
                                });
                            }); });
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
define("Models/Entities/Album", ["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Album = /** @class */ (function () {
        function Album(name, uri) {
            if (!name || name === '')
                throw new Error('name is required.');
            if (!uri || uri === '')
                throw new Error('uri is required.');
            this._id = _.uniqueId('album_');
            this._name = name;
            this._uri = uri;
            this._artistIds = [];
            this._genreIds = [];
        }
        Object.defineProperty(Album.prototype, "Id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Album.prototype, "Name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Album.prototype, "Uri", {
            get: function () {
                return this._uri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Album.prototype, "ArtistIds", {
            get: function () {
                return this._artistIds;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Album.prototype, "GenreIds", {
            get: function () {
                return this._genreIds;
            },
            enumerable: true,
            configurable: true
        });
        Album.prototype.SetArtistId = function (artistId) {
            if (!_.has(this._artistIds, artistId))
                this._artistIds.push(artistId);
        };
        Album.prototype.SetGenreId = function (genreId) {
            if (!_.has(this._genreIds, genreId))
                this._genreIds.push(genreId);
        };
        return Album;
    }());
    exports.default = Album;
});
define("Models/Stores/AlbumStore", ["require", "exports", "lodash", "Libraries", "Models/Stores/StoreBase", "Definitions/ApiMethods", "Models/Entities/Album"], function (require, exports, _, Libraries_3, StoreBase_3, ApiMethods_3, Album_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AlbumStore = /** @class */ (function (_super) {
        __extends(AlbumStore, _super);
        function AlbumStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AlbumStore.prototype.Init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var entities, params, result, refs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            entities = [];
                            params = {
                                uri: 'local:directory?type=album'
                            };
                            return [4 /*yield*/, this.Query(ApiMethods_3.default.LibraryBrowse, params)];
                        case 1:
                            result = _a.sent();
                            refs = result.result;
                            _.each(refs, function (ref) {
                                entities.push(new Album_1.default(ref.name, ref.uri));
                            });
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
define("Models/Entities/ArtistAlbum", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArtistAlbum = /** @class */ (function () {
        function ArtistAlbum(artistId, albumId) {
            this._artistId = artistId;
            this._albumId = albumId;
        }
        Object.defineProperty(ArtistAlbum.prototype, "ArtistId", {
            get: function () {
                return this._artistId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ArtistAlbum.prototype, "AlbumId", {
            get: function () {
                return this._albumId;
            },
            enumerable: true,
            configurable: true
        });
        return ArtistAlbum;
    }());
    exports.default = ArtistAlbum;
});
define("Models/Stores/ArtistAlbumStore", ["require", "exports", "lodash", "Libraries", "Models/Stores/StoreBase", "Definitions/ApiMethods", "Models/Entities/ArtistAlbum"], function (require, exports, _, Libraries_4, StoreBase_4, ApiMethods_4, ArtistAlbum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArtistAlbumStore = /** @class */ (function (_super) {
        __extends(ArtistAlbumStore, _super);
        function ArtistAlbumStore() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._rawEntities = [];
            _this._artistBelongs = {};
            _this._albumBelongs = {};
            return _this;
        }
        ArtistAlbumStore.prototype.Init = function (artists, albums) {
            return __awaiter(this, void 0, void 0, function () {
                var promises, artistArray;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            promises = [];
                            artistArray = artists.GetAll();
                            _.each(artistArray, function (artist) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    promises.push(this.InitArtistAlbums(artist, albums));
                                    return [2 /*return*/];
                                });
                            }); });
                            return [4 /*yield*/, Promise.all(promises)];
                        case 1:
                            _a.sent();
                            this.Entities = Libraries_4.default.Enumerable.from(this._rawEntities);
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        ArtistAlbumStore.prototype.InitArtistAlbums = function (artist, albums) {
            return __awaiter(this, void 0, void 0, function () {
                var result, refs;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.Query(ApiMethods_4.default.LibraryBrowse, {
                                uri: artist.Uri
                            })];
                        case 1:
                            result = _a.sent();
                            refs = result.result;
                            _.each(refs, function (ref) {
                                var album = albums
                                    .Entities
                                    .firstOrDefault(function (e) { return e.Uri === ref.uri; });
                                if (album) {
                                    _this._rawEntities.push(new ArtistAlbum_1.default(artist.Id, album.Id));
                                    if (!_this._artistBelongs[artist.Id])
                                        _this._artistBelongs[artist.Id] = [];
                                    if (!_this._albumBelongs[album.Id])
                                        _this._albumBelongs[album.Id] = [];
                                    if (!_.has(_this._artistBelongs[artist.Id], album.Id))
                                        _this._artistBelongs[artist.Id].push(album.Id);
                                    if (!_.has(_this._albumBelongs[album.Id], artist.Id))
                                        _this._albumBelongs[album.Id].push(artist.Id);
                                }
                            });
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        return ArtistAlbumStore;
    }(StoreBase_4.default));
    exports.default = ArtistAlbumStore;
});
define("Models/Entities/GenreAlbum", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenreAlbum = /** @class */ (function () {
        function GenreAlbum(genreId, albumId) {
            this._genreId = genreId;
            this._albumId = albumId;
        }
        Object.defineProperty(GenreAlbum.prototype, "GenreId", {
            get: function () {
                return this._genreId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GenreAlbum.prototype, "AlbumId", {
            get: function () {
                return this._albumId;
            },
            enumerable: true,
            configurable: true
        });
        return GenreAlbum;
    }());
    exports.default = GenreAlbum;
});
define("Models/Stores/GenreAlbumStore", ["require", "exports", "lodash", "Libraries", "Models/Stores/StoreBase", "Definitions/ApiMethods", "Models/Entities/GenreAlbum"], function (require, exports, _, Libraries_5, StoreBase_5, ApiMethods_5, GenreAlbum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenreAlbumStore = /** @class */ (function (_super) {
        __extends(GenreAlbumStore, _super);
        function GenreAlbumStore() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._rawEntities = [];
            _this._genreBelongs = {};
            _this._albumBelongs = {};
            return _this;
        }
        GenreAlbumStore.prototype.Init = function (genres, albums) {
            return __awaiter(this, void 0, void 0, function () {
                var promises, genreArray;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            promises = [];
                            genreArray = genres.GetAll();
                            _.each(genreArray, function (genre) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    promises.push(this.InitGenreAlbums(genre, albums));
                                    return [2 /*return*/];
                                });
                            }); });
                            return [4 /*yield*/, Promise.all(promises)];
                        case 1:
                            _a.sent();
                            this.Entities = Libraries_5.default.Enumerable.from(this._rawEntities);
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        GenreAlbumStore.prototype.InitGenreAlbums = function (genre, albums) {
            return __awaiter(this, void 0, void 0, function () {
                var result, refs;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.Query(ApiMethods_5.default.LibraryBrowse, {
                                uri: genre.Uri
                            })];
                        case 1:
                            result = _a.sent();
                            refs = result.result;
                            _.each(refs, function (ref) {
                                var refQuery = ref.uri.split('?')[1];
                                var params = refQuery.split('&');
                                var albumUri = null;
                                for (var i = 0; i < params.length; i++) {
                                    if (params[i].indexOf('album=') === 0) {
                                        albumUri = params[i].split('=')[1];
                                        break;
                                    }
                                }
                                if (albumUri) {
                                    var album = albums
                                        .Entities
                                        .firstOrDefault(function (e) { return e.Uri === albumUri; });
                                    if (album) {
                                        _this._rawEntities.push(new GenreAlbum_1.default(genre.Id, album.Id));
                                        if (!_this._genreBelongs[genre.Id])
                                            _this._genreBelongs[genre.Id] = [];
                                        if (!_this._albumBelongs[album.Id])
                                            _this._albumBelongs[album.Id] = [];
                                        if (!_.has(_this._genreBelongs[genre.Id], album.Id))
                                            _this._genreBelongs[genre.Id].push(album.Id);
                                        if (!_.has(_this._albumBelongs[album.Id], genre.Id))
                                            _this._albumBelongs[album.Id].push(genre.Id);
                                    }
                                }
                            });
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        return GenreAlbumStore;
    }(StoreBase_5.default));
    exports.default = GenreAlbumStore;
});
define("Main", ["require", "exports", "Libraries", "Models/Stores/ArtistStore", "Models/Stores/GenreStore", "Models/Stores/AlbumStore", "Models/Stores/ArtistAlbumStore", "Models/Stores/GenreAlbumStore", "../css/site.css"], function (require, exports, Libraries_6, ArtistStore_1, GenreStore_1, AlbumStore_1, ArtistAlbumStore_1, GenreAlbumStore_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Main = /** @class */ (function () {
        function Main() {
        }
        Main.prototype.Init = function () {
            console.log('TS Start');
            this.PolyfillPromise();
            this.InitStores();
        };
        Main.prototype.PolyfillPromise = function () {
            try {
                Libraries_6.default.es6Promise.polyfill();
                //console.log('Promise Polyfill OK.');
            }
            catch (ex) {
                throw new Error('Promise Poliyfill Error!');
            }
        };
        Main.prototype.InitStores = function () {
            return __awaiter(this, void 0, void 0, function () {
                var artists, genres, albums, artistAlbums, genreAlbums, promises;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            artists = new ArtistStore_1.default();
                            genres = new GenreStore_1.default();
                            albums = new AlbumStore_1.default();
                            artistAlbums = new ArtistAlbumStore_1.default();
                            genreAlbums = new GenreAlbumStore_1.default();
                            promises = [];
                            promises.push(albums.Init());
                            promises.push(artists.Init());
                            promises.push(genres.Init());
                            return [4 /*yield*/, Promise.all(promises)];
                        case 1:
                            _a.sent();
                            promises = [];
                            promises.push(artistAlbums.Init(artists, albums));
                            promises.push(genreAlbums.Init(genres, albums));
                            return [4 /*yield*/, Promise.all(promises)];
                        case 2:
                            _a.sent();
                            console.log('Artists:');
                            console.log(artists.GetAll());
                            console.log('Genres:');
                            console.log(genres.GetAll());
                            console.log('Albums;');
                            console.log(albums.GetAll());
                            console.log('ArtistAlbums:');
                            console.log(artistAlbums.GetAll());
                            console.log('GenreAlbums;');
                            console.log(genreAlbums.GetAll());
                            return [2 /*return*/];
                    }
                });
            });
        };
        return Main;
    }());
    var main = (new Main()).Init();
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
define("Models/Stores/SongStore", ["require", "exports", "Models/Stores/StoreBase"], function (require, exports, StoreBase_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SongStore = /** @class */ (function (_super) {
        __extends(SongStore, _super);
        function SongStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return SongStore;
    }(StoreBase_6.default));
    exports.default = SongStore;
});
//# sourceMappingURL=tsout.js.map