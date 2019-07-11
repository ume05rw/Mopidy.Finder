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
define("EventableBase", ["require", "exports", "lodash"], function (require, exports, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventReference = /** @class */ (function () {
        function EventReference() {
        }
        return EventReference;
    }());
    exports.EventReference = EventReference;
    /**
     * イベント機能実装の抽象クラス
     */
    var EventableBase = /** @class */ (function () {
        function EventableBase() {
            this.eventHandlers = [];
        }
        EventableBase.prototype.AddEventListener = function (name, handler, bindTarget) {
            var eRef = new EventReference();
            eRef.Name = name;
            eRef.Handler = handler;
            // デフォルトでthisバインド、をやめる。
            eRef.BindTarget = bindTarget;
            //eRef.BindTarget = (!bindTarget)
            //    ? this
            //    : bindTarget;
            this.eventHandlers.push(eRef);
        };
        EventableBase.prototype.RemoveEventListener = function (name, handler) {
            var _this = this;
            if (handler) {
                // handlerが指定されているとき
                var key_1 = -1;
                var eRef = _.find(this.eventHandlers, function (er, idx) {
                    key_1 = idx;
                    // ※注意※
                    // 関数は継承関係のプロトタイプ参照都合で同一オブジェクトになりやすい。
                    // Mittでも同じ実装だった...。
                    return (er.Name === name
                        && er.Handler === handler);
                });
                if (key_1 >= 0) {
                    this.eventHandlers.splice(key_1, 1);
                    eRef.Handler = null;
                    eRef.Name = null;
                }
            }
            else {
                // handlerが指定されないとき
                var eRefs_1 = [];
                _.each(this.eventHandlers, function (er) {
                    if (er.Name === name)
                        eRefs_1.push(er);
                });
                _.each(eRefs_1, function (eRef) {
                    var idx = _this.eventHandlers.indexOf(eRef);
                    _this.eventHandlers.splice(idx, 1);
                    eRef.Handler = null;
                    eRef.Name = null;
                });
            }
        };
        EventableBase.prototype.DispatchEvent = function (name, params) {
            if (params === void 0) { params = null; }
            _.each(this.eventHandlers, function (er) {
                if (er.Name === name) {
                    try {
                        // デフォルトでthisバインド、をやめる。
                        //// thisをバインドして実行。そのままだとEventReferenceがthisになる。
                        //er.Handler.bind(er.BindTarget)(params);
                        (er.BindTarget)
                            ? er.Handler.bind(er.BindTarget)(params)
                            : er.Handler(params);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            });
        };
        EventableBase.prototype.Dispose = function () {
            var _this = this;
            _.each(this.eventHandlers, function (eRef, index) {
                eRef.Handler = null;
                eRef.Name = null;
                delete _this.eventHandlers[index];
            });
            this.eventHandlers = null;
            this.AddEventListener = null;
            this.RemoveEventListener = null;
            this.DispatchEvent = null;
        };
        return EventableBase;
    }());
    exports.default = EventableBase;
});
define("Libraries", ["require", "exports", "jquery", "responsive-toolkit/dist/bootstrap-toolkit", "linq", "mopidy", "animate.css/animate.css", "font-awesome/css/font-awesome.css", "admin-lte/dist/css/adminlte.css", "admin-lte/plugins/ion-rangeslider/css/ion.rangeSlider.css", "../css/site.css", "admin-lte/dist/js/adminlte", "admin-lte/plugins/bootstrap/js/bootstrap", "admin-lte/plugins/ion-rangeslider/js/ion.rangeSlider"], function (require, exports, jQuery, ResponsiveBootstrapToolkit, Enumerable, Mopidy) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * VS開発時のステップデバッグ環境を維持するため、開発環境ではAMD形式で
     * ライブラリをexportしている。
     * AMD形式では、単一名かつdefault-export無しのライブラリがexport出来ないため、
     * 強制的にdefault-exportしている。
     * プロダクションビルドでは書いた通りで動くため、その差分を吸収するためのロジック。
     */
    var Libraries = /** @class */ (function () {
        function Libraries() {
        }
        Libraries.Initialize = function () {
            // ResponsiveBootstrapToolkitをbootstrap4に対応させる
            // https://github.com/maciej-gurban/responsive-bootstrap-toolkit/issues/52
            Libraries.ResponsiveBootstrapToolkit.use('bs4', {
                'xs': Libraries.$('<div class="d-xs-block d-sm-none d-md-none d-lg-none d-xl-none"></div>'),
                'sm': Libraries.$('<div class="d-none d-sm-block d-md-none d-lg-none d-xl-none"></div>'),
                'md': Libraries.$('<div class="d-none d-md-block d-sm-none d-lg-none d-xl-none"></div>'),
                'lg': Libraries.$('<div class="d-none d-lg-block d-sm-none d-md-none d-xl-none"></div>'),
                'xl': Libraries.$('<div class="d-none d-xl-block d-sm-none d-md-none d-lg-none"></div>')
            });
        };
        /**
         * linq.js
         * ※バージョンは3.1.1に固定する。最新版の型定義がes5に対応しなくなったため。
         */
        Libraries.Enumerable = ((Enumerable.default)
            ? Enumerable.default
            : Enumerable);
        /**
         * JQuery: Admin-LTE, Bootsrapが依存している。
         */
        Libraries.jQuery = ((jQuery.default)
            ? jQuery.default
            : jQuery);
        Libraries.$ = Libraries.jQuery;
        /**
         * Bootstrap Toolkit
         * 画面サイズ切替判定で使用
         */
        Libraries.ResponsiveBootstrapToolkit = ((ResponsiveBootstrapToolkit.default)
            ? ResponsiveBootstrapToolkit.default
            : ResponsiveBootstrapToolkit);
        /**
         * Mopidy
         */
        Libraries.Mopidy = ((Mopidy.default)
            ? Mopidy.default
            : Mopidy);
        return Libraries;
    }());
    exports.default = Libraries;
    ;
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
            _this.title = 'Finder';
            return _this;
        }
        HeaderBar.prototype.SetTitle = function (title) {
            this.title = title;
        };
        HeaderBar = __decorate([
            vue_class_component_1.default({
                template: "<nav class=\"main-header navbar navbar-expand border-bottom\">\n    <ul class=\"navbar-nav\">\n        <li class=\"nav-item\">\n            <a class=\"nav-link\" data-widget=\"pushmenu\" href=\"#\">\n                <i class=\"fa fa-bars\" />\n            </a>\n        </li>\n        <li class=\"nav-item\">\n            <h3>{{ title }}</h3>\n        </li>\n    </ul>\n</nav>"
            })
        ], HeaderBar);
        return HeaderBar;
    }(ViewBase_1.default));
    exports.default = HeaderBar;
});
define("Models/Bases/XhrQueryableBase", ["require", "exports", "axios", "qs", "EventableBase"], function (require, exports, axios_1, qs, EventableBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var XhrQueryableBase = /** @class */ (function (_super) {
        __extends(XhrQueryableBase, _super);
        function XhrQueryableBase() {
            return _super !== null && _super.apply(this, arguments) || this;
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
    }(EventableBase_1.default));
    exports.default = XhrQueryableBase;
});
define("Models/Bases/JsonRpcQueryableBase", ["require", "exports", "Models/Bases/XhrQueryableBase"], function (require, exports, XhrQueryableBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JsonRpcQueryableBase = /** @class */ (function (_super) {
        __extends(JsonRpcQueryableBase, _super);
        function JsonRpcQueryableBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        JsonRpcQueryableBase.prototype.QueryJsonRpc = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var a, response, result, ex_5, error;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            params.jsonrpc = '2.0';
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            a = 1;
                            return [4 /*yield*/, XhrQueryableBase_1.default.XhrInstance.post(JsonRpcQueryableBase.Url, params)];
                        case 2:
                            response = _a.sent();
                            result = response.data;
                            if (result && result.error) {
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
                            return [2 /*return*/, (!result || (result && !result.error))];
                    }
                });
            });
        };
        JsonRpcQueryableBase.Url = 'JsonRpc';
        JsonRpcQueryableBase.IdCounter = 1;
        return JsonRpcQueryableBase;
    }(XhrQueryableBase_1.default));
    exports.default = JsonRpcQueryableBase;
});
define("Models/Mopidies/IArtist", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Models/Mopidies/IAlbum", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Models/Mopidies/ITrack", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Models/Mopidies/ITlTrack", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Models/Mopidies/Player", ["require", "exports", "Models/Bases/JsonRpcQueryableBase"], function (require, exports, JsonRpcQueryableBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlayerEvents = {
        TrackChanged: 'TrackChanged',
        PlayerStateChanged: 'PlayerStateChanged',
        ProgressChanged: 'ProgressChanged',
        VolumeChanged: 'VolumeChanged'
    };
    var PlayerState;
    (function (PlayerState) {
        PlayerState["Playing"] = "playing";
        PlayerState["Stopped"] = "stopped";
        PlayerState["Paused"] = "paused";
    })(PlayerState = exports.PlayerState || (exports.PlayerState = {}));
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        function Player() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._playerState = PlayerState.Paused;
            _this._tlId = null;
            _this._isPlaying = false;
            _this._trackName = '';
            _this._trackLength = 0;
            _this._trackProgress = 0;
            _this._artistName = '';
            _this._year = null;
            _this._imageUri = null;
            _this._volume = 0;
            _this._backupValues = {
                TlId: null,
                PlayerState: PlayerState.Paused,
                IsPlaying: false,
                TrackName: '',
                TrackLength: 0,
                TrackProgress: 0,
                ArtistName: '',
                ImageUri: null,
                Year: 0,
                Volume: 0
            };
            return _this;
        }
        Object.defineProperty(Player.prototype, "TlId", {
            get: function () {
                return this._tlId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "PlayerState", {
            get: function () {
                return this._playerState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "IsPlaying", {
            get: function () {
                return this._isPlaying;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "TrackName", {
            get: function () {
                return this._trackName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "TrackLength", {
            get: function () {
                return this._trackLength;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "TrackProgress", {
            get: function () {
                return this._trackProgress;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "ArtistName", {
            get: function () {
                return this._artistName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "ImageUri", {
            get: function () {
                return this._imageUri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "Year", {
            get: function () {
                return this._year;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "Volume", {
            get: function () {
                return this._volume;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "ImageFullUri", {
            get: function () {
                return location.protocol + "//" + location.host + this._imageUri;
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.StartPolling = function () {
            var _this = this;
            this._timer = setInterval(function () {
                _this.Polling();
            }, Player.PollingMsec);
        };
        Player.prototype.Polling = function () {
            return __awaiter(this, void 0, void 0, function () {
                var resState, resTrack, tlTrack, track, resImages, images, resTs, resVol;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.SetBackupValues();
                            return [4 /*yield*/, this.JsonRpcRequest(Player.Methods.GetState)];
                        case 1:
                            resState = _a.sent();
                            if (resState.result) {
                                this._playerState = resState.result;
                                this._isPlaying = (this._playerState === PlayerState.Playing);
                            }
                            return [4 /*yield*/, this.JsonRpcRequest(Player.Methods.GetCurrentTlTrack)];
                        case 2:
                            resTrack = _a.sent();
                            if (!resTrack.result) return [3 /*break*/, 6];
                            tlTrack = resTrack.result;
                            track = tlTrack.track;
                            if (!(this._tlId !== tlTrack.tlid)) return [3 /*break*/, 5];
                            // 一旦初期化
                            this._tlId = tlTrack.tlid;
                            this._trackName = track.name;
                            this._trackLength = 0;
                            this._trackProgress = 0;
                            this._artistName = '--';
                            this._year = null;
                            this._imageUri = null;
                            if (track.artists && 0 < track.artists.length) {
                                this._artistName = (track.artists.length === 1)
                                    ? track.artists[0].name
                                    : track.artists[0].name + ' and more...';
                            }
                            else {
                                this._artistName = '';
                            }
                            if (track.date && 4 <= track.date.length) {
                                this._year = (4 < track.date.length)
                                    ? parseInt(track.date.substring(0, 4), 10)
                                    : parseInt(track.date, 10);
                            }
                            this._trackLength = (track.length)
                                ? track.length
                                : 0;
                            if (!track.album) return [3 /*break*/, 5];
                            if (!(track.album.images && 0 < track.album.images.length)) return [3 /*break*/, 3];
                            this._imageUri = track.album.images[0];
                            return [3 /*break*/, 5];
                        case 3:
                            if (!track.album.uri) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.JsonRpcRequest(Player.Methods.GetImages, {
                                    uris: [track.album.uri]
                                })];
                        case 4:
                            resImages = _a.sent();
                            if (resImages.result) {
                                images = resImages.result[track.album.uri];
                                if (images && 0 < images.length) {
                                    this._imageUri = images[0];
                                }
                            }
                            _a.label = 5;
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            this._tlId = null;
                            this._trackName = '--';
                            this._trackLength = 0;
                            this._trackProgress = 0;
                            this._artistName = '--';
                            this._year = null;
                            this._imageUri = null;
                            _a.label = 7;
                        case 7: return [4 /*yield*/, this.JsonRpcRequest(Player.Methods.GetTimePosition)];
                        case 8:
                            resTs = _a.sent();
                            this._trackProgress = (resTs.result)
                                ? parseInt(resTs.result, 10)
                                : 0;
                            return [4 /*yield*/, this.JsonRpcRequest(Player.Methods.GetVolume)];
                        case 9:
                            resVol = _a.sent();
                            if (resVol.result)
                                this._volume = resVol.result;
                            this.DetectChanges();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Player.prototype.SetBackupValues = function () {
            this._backupValues = {
                TlId: this.TlId,
                PlayerState: this.PlayerState,
                IsPlaying: this.IsPlaying,
                TrackName: this.TrackName,
                TrackLength: this.TrackLength,
                TrackProgress: this.TrackProgress,
                ArtistName: this.ArtistName,
                ImageUri: this.ImageUri,
                Year: this.Year,
                Volume: this.Volume
            };
        };
        Player.prototype.DetectChanges = function () {
            if (this._backupValues.TlId !== this.TlId)
                this.DispatchEvent(exports.PlayerEvents.TrackChanged);
            if (this._backupValues.PlayerState !== this.PlayerState)
                this.DispatchEvent(exports.PlayerEvents.PlayerStateChanged);
            if (this._backupValues.TrackProgress !== this.TrackProgress)
                this.DispatchEvent(exports.PlayerEvents.ProgressChanged);
            if (this._backupValues.Volume !== this.Volume)
                this.DispatchEvent(exports.PlayerEvents.VolumeChanged);
        };
        Player.prototype.Play = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this._playerState === PlayerState.Playing)
                                return [2 /*return*/, true];
                            if (!this._tlId)
                                return [2 /*return*/, false];
                            if (!(this._playerState === PlayerState.Paused)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.JsonRpcNotice(Player.Methods.Resume)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2:
                            if (!(this._playerState === PlayerState.Stopped)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.JsonRpcNotice(Player.Methods.Play, {
                                    tlid: this._tlId
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/, true];
                    }
                });
            });
        };
        Player.prototype.Pause = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this._playerState !== PlayerState.Playing)
                                return [2 /*return*/, true];
                            return [4 /*yield*/, this.JsonRpcNotice(Player.Methods.Pause)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Player.prototype.Next = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcNotice(Player.Methods.Next)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Player.prototype.Previous = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcNotice(Player.Methods.Previous)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Player.prototype.Seek = function (timePosition) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcNotice(Player.Methods.Seek, {
                                time_position: timePosition
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Player.prototype.SetVolume = function (volume) {
            return __awaiter(this, void 0, void 0, function () {
                var resSucceeded;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcRequest(Player.Methods.SetVolume, {
                                volume: volume
                            })];
                        case 1:
                            resSucceeded = _a.sent();
                            return [2 /*return*/, resSucceeded.result];
                    }
                });
            });
        };
        Player.prototype.Dispose = function () {
            clearInterval(this._timer);
        };
        Player.PollingMsec = 2000;
        Player.Methods = {
            GetState: 'core.playback.get_state',
            GetCurrentTlTrack: 'core.playback.get_current_tl_track',
            GetTimePosition: 'core.playback.get_time_position',
            GetImages: 'core.library.get_images',
            Play: 'core.playback.play',
            Resume: 'core.playback.resume',
            Pause: 'core.playback.pause',
            Stop: 'core.playback.stop',
            Next: 'core.playback.next',
            Previous: 'core.playback.previous',
            Seek: 'core.playback.seek',
            GetRandom: 'core.tracklist.get_random',
            SetRandom: 'core.tracklist.set_random',
            GetVolume: 'core.mixer.get_volume',
            SetVolume: 'core.mixer.set_volume'
        };
        return Player;
    }(JsonRpcQueryableBase_1.default));
    exports.default = Player;
});
define("Views/Sidebars/PlayerPanel", ["require", "exports", "vue-class-component", "Libraries", "Models/Mopidies/Player", "Views/Bases/ViewBase"], function (require, exports, vue_class_component_2, Libraries_1, Player_1, ViewBase_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlayerPanel = /** @class */ (function (_super) {
        __extends(PlayerPanel, _super);
        function PlayerPanel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.player = new Player_1.default();
            return _this;
        }
        PlayerPanel.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.Initialize.call(this)];
                        case 1:
                            _a.sent();
                            this.volumeSlider = Libraries_1.default.$(this.$refs.Slider).ionRangeSlider({
                                onChange: function (data) {
                                    // スライダーの値変更都度イベント
                                    //console.log(data);
                                },
                                onFinish: function (data) {
                                    // スライダー操作完了時のイベント
                                    _this.player.SetVolume(data.from);
                                }
                            });
                            this.volumeData = this.volumeSlider.data('ionRangeSlider');
                            this.player.AddEventListener(Player_1.PlayerEvents.VolumeChanged, function () {
                                _this.volumeData.update({
                                    from: _this.player.Volume
                                });
                            });
                            this.player.StartPolling();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        PlayerPanel.prototype.GetPlayPauseIconClass = function () {
            return (this.player.PlayerState === Player_1.PlayerState.Playing)
                ? 'fa fa-pause'
                : 'fa fa-play';
        };
        PlayerPanel.prototype.OnClickVolumeMin = function () {
            this.volumeData.update({
                from: 0
            });
        };
        PlayerPanel.prototype.OnClickVolumeMax = function () {
            this.volumeData.update({
                from: 100
            });
        };
        PlayerPanel.prototype.OnClickPrevious = function () {
            this.player.Previous();
        };
        PlayerPanel.prototype.OnClickPlayPause = function () {
            if (this.player.PlayerState === Player_1.PlayerState.Playing) {
                this.player.Pause();
            }
            else {
                this.player.Play();
            }
        };
        PlayerPanel.prototype.OnClickNext = function () {
            this.player.Next();
        };
        PlayerPanel = __decorate([
            vue_class_component_2.default({
                template: "<div class=\"card siderbar-control\">\n    <div class=\"card-body\">\n        <img v-bind:src=\"player.ImageFullUri\" class=\"albumart\" />\n        <h6 class=\"card-title\">{{ player.TrackName }}</h6>\n        <span>{{ player.ArtistName }}{{ (player.Year) ? '(' + player.Year + ')' : '' }}</span>\n        <div class=\"player-box btn-group btn-group-sm w-100 mt-2\" role=\"group\">\n            <button type=\"button\"\n                class=\"btn btn-secondary\"\n                @click=\"OnClickPrevious\">\n                <i class=\"fa fa-fast-backward\" />\n            </button>\n            <button type=\"button\"\n                class=\"btn btn-secondary\"\n                @click=\"OnClickPlayPause\">\n                <i v-bind:class=\"GetPlayPauseIconClass()\" ref=\"PlayPauseIcon\"/>\n            </button>\n            <button type=\"button\"\n                class=\"btn btn-secondary\"\n                @click=\"OnClickNext\">\n                <i class=\"fa fa-fast-forward\" />\n            </button>\n        </div>\n        <div class=\"row volume-box w-100 mt-2\">\n            <div class=\"col-1 volume-button volume-min\">\n                <a @click=\"OnClickVolumeMin\">\n                    <i class=\"fa fa-volume-off\" />\n                </a>\n            </div>\n            <div class=\"col-10\">\n                <input type=\"text\"\n                    data-type=\"single\"\n                    data-min=\"0\"\n                    data-max=\"100\"\n                    data-from=\"100\"\n                    data-grid=\"true\"\n                    data-hide-min-max=\"true\"\n                    ref=\"Slider\" />\n            </div>\n            <div class=\"col-1 volume-button volume-max\">\n                <a @click=\"OnClickVolumeMax\">\n                    <i class=\"fa fa-volume-up\" />\n                </a>\n            </div>\n        </div>\n    </div>\n</div>"
            })
        ], PlayerPanel);
        return PlayerPanel;
    }(ViewBase_2.default));
    exports.default = PlayerPanel;
});
define("Views/Sidebars/Sidebar", ["require", "exports", "Views/Bases/ViewBase", "vue-class-component", "Views/Sidebars/PlayerPanel"], function (require, exports, ViewBase_3, vue_class_component_3, PlayerPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SidebarEvents = {
        ContentChanged: 'ContentChanged'
    };
    var Sidebar = /** @class */ (function (_super) {
        __extends(Sidebar, _super);
        function Sidebar() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Sidebar.prototype.OnClickFinder = function () {
            this.$emit(exports.SidebarEvents.ContentChanged, {
                Name: 'Finder'
            });
        };
        Sidebar.prototype.OnClickPlaylists = function () {
            this.$emit(exports.SidebarEvents.ContentChanged, {
                Name: 'Playlists'
            });
        };
        Sidebar.prototype.OnClickSettings = function () {
            this.$emit(exports.SidebarEvents.ContentChanged, {
                Name: 'Settings'
            });
        };
        Sidebar = __decorate([
            vue_class_component_3.default({
                template: "<aside class=\"main-sidebar sidebar-dark-primary elevation-4\">\n    <div class=\"brand-link navbar-secondary\">\n        <span class=\"brand-text font-weight-light\">Mopidy Finder</span>\n    </div>\n    <div class=\"sidebar\">\n        <nav class=\"mt-2\">\n            <ul class=\"nav nav-pills nav-sidebar flex-column\" role=\"tablist\">\n                <li class=\"nav-item\">\n                    <a  class=\"nav-link active\"\n                        href=\"#tab-finder\"\n                        role=\"tab\"\n                        data-toggle=\"tab\"\n                        aria-controls=\"tab-finder\"\n                        aria-selected=\"true\"\n                        @click=\"OnClickFinder\" >\n                        <i class=\"fa fa-search nav-icon\" />\n                        <p>Finder</p>\n                    </a>\n                </li>\n                <li class=\"nav-item\">\n                    <a  class=\"nav-link\"\n                        href=\"#tab-playlists\"\n                        role=\"tab\"\n                        data-toggle=\"tab\"\n                        aria-controls=\"tab-playlists\"\n                        aria-selected=\"false\"\n                        @click=\"OnClickPlaylists\" >\n                        <i class=\"fa fa-bookmark nav-icon\" />\n                        <p>Playlists</p>\n                    </a>\n                </li>\n                <li class=\"nav-item\">\n                    <a  class=\"nav-link\"\n                        href=\"#tab-settings\"\n                        role=\"tab\"\n                        data-toggle=\"tab\"\n                        aria-controls=\"tab-settings\"\n                        aria-selected=\"false\"\n                        @click=\"OnClickSettings\" >\n                        <i class=\"fa fa-cog nav-icon\" />\n                        <p>Settings</p>\n                    </a>\n                </li>\n            </ul>\n        </nav>\n        <div class=\"row mt-2\">\n            <div class=\"col-12\">\n                <player-panel ref=\"PlayerPanel\" />\n            </div>\n        </div>\n    </div>\n</aside>",
                components: {
                    'player-panel': PlayerPanel_1.default
                }
            })
        ], Sidebar);
        return Sidebar;
    }(ViewBase_3.default));
    exports.default = Sidebar;
});
define("Views/Shared/SelectionEvents", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SelectionEvents = {
        ListUpdated: 'ListUpdated',
        SelectionChanged: 'SelectionChanged',
        Refreshed: 'Refreshed',
    };
    exports.default = SelectionEvents;
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
define("Models/Albums/Album", ["require", "exports", "Models/Relations/ArtistAlbum", "Models/Relations/GenreAlbum"], function (require, exports, ArtistAlbum_1, GenreAlbum_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Album = /** @class */ (function () {
        function Album() {
        }
        Album.Create = function (entity) {
            if (!entity)
                return null;
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
        Album.CreateByMopidy = function (entity) {
            if (!entity)
                return null;
            var result = new Album();
            result.Id = null;
            result.Name = entity.name;
            result.LowerName = (entity.name)
                ? entity.name.toLowerCase()
                : null;
            result.Uri = entity.uri;
            result.Year = (entity.date && 4 <= entity.date.length)
                ? (4 < entity.date.length)
                    ? parseInt(entity.date.substr(0, 4), 10)
                    : parseInt(entity.date)
                : null;
            result.ImageUri = (entity.images && entity.images[0])
                ? entity.images[0]
                : null;
            result.ArtistAlbums = [];
            result.GenreAlbums = [];
            return result;
        };
        Album.CreateArray = function (entities) {
            var result = [];
            if (!entities)
                return result;
            for (var i = 0; i < entities.length; i++) {
                var entity = Album.Create(entities[i]);
                if (entity)
                    result.push(entity);
            }
            return result;
        };
        Album.CreateArrayByMopidy = function (entities) {
            var result = [];
            if (!entities)
                return result;
            for (var i = 0; i < entities.length; i++) {
                var entity = Album.CreateByMopidy(entities[i]);
                if (entity)
                    result.push(entity);
            }
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
define("Models/Artists/Artist", ["require", "exports", "Models/Relations/ArtistAlbum", "Models/Relations/GenreArtist"], function (require, exports, ArtistAlbum_2, GenreArtist_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Artist = /** @class */ (function () {
        function Artist() {
        }
        Artist.Create = function (entity) {
            if (!entity)
                return null;
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
        Artist.CreateByMopidy = function (entity) {
            if (!entity)
                return null;
            var result = new Artist();
            result.Id = null;
            result.Name = entity.name;
            result.LowerName = (entity.name)
                ? entity.name.toLowerCase()
                : null;
            result.Uri = entity.uri;
            result.ImageUri = null;
            result.ArtistAlbums = [];
            result.GenreArtists = [];
            return result;
        };
        Artist.CreateArray = function (entities) {
            var result = [];
            if (!entities)
                return result;
            for (var i = 0; i < entities.length; i++) {
                var entity = Artist.Create(entities[i]);
                if (entity)
                    result.push(entity);
            }
            return result;
        };
        Artist.CreateArrayByMopidy = function (entities) {
            var result = [];
            if (!entities)
                return result;
            for (var i = 0; i < entities.length; i++) {
                var entity = Artist.CreateByMopidy(entities[i]);
                if (entity)
                    result.push(entity);
            }
            return result;
        };
        return Artist;
    }());
    exports.default = Artist;
});
define("Models/Tracks/Track", ["require", "exports", "Models/Albums/Album", "Models/Artists/Artist"], function (require, exports, Album_1, Artist_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Track = /** @class */ (function () {
        function Track() {
        }
        Track.Create = function (entity) {
            if (!entity)
                return null;
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
            result.Album = Album_1.default.Create(entity.Album);
            result.Artists = Artist_1.default.CreateArray(entity.Artists);
            // JSONがアホほどでかくなるのでやめる
            //result.Genre = Genre.Create(entity.Genre);
            //result.Composers = Artist.CreateArray(entity.Composers);
            //result.Performers = Artist.CreateArray(entity.Performers);
            return result;
        };
        Track.CreateByMopidy = function (entity) {
            if (!entity)
                return null;
            var result = new Track();
            result.Id = null;
            result.Name = entity.name;
            result.LowerName = (entity.name)
                ? entity.name.toLowerCase()
                : null;
            result.Uri = entity.uri;
            result.TlId = null;
            result.DiscNo = entity.disc_no;
            result.TrackNo = entity.track_no;
            result.Date = entity.date;
            result.Comment = entity.comment;
            result.Length = entity.length;
            result.BitRate = entity.bitrate;
            result.LastModified = entity.last_modified;
            result.Album = Album_1.default.CreateByMopidy(entity.album);
            result.Artists = Artist_1.default.CreateArrayByMopidy(entity.artists);
            // JSONがアホほどでかくなるのでやめる
            //result.Genre = Genre.Create(entity.Genre);
            //result.Composers = Artist.CreateArray(entity.Composers);
            //result.Performers = Artist.CreateArray(entity.Performers);
            return result;
        };
        Track.CreateArray = function (entities) {
            var result = [];
            if (!entities)
                return result;
            for (var i = 0; i < entities.length; i++) {
                var entity = Track.Create(entities[i]);
                if (entity)
                    result.push(entity);
            }
            return result;
        };
        Track.CreateArrayByMopidy = function (entities) {
            var result = [];
            if (!entities)
                return result;
            for (var i = 0; i < entities.length; i++) {
                var entity = Track.CreateByMopidy(entities[i]);
                if (entity)
                    result.push(entity);
            }
            return result;
        };
        //public Genre: Genre;
        //public Composers: Artist[];
        //public Performers: Artist[];
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
        Track.prototype.GetYear = function () {
            if (!this.Date || this.Date.length < 4)
                return null;
            return (4 < this.Date.length)
                ? parseInt(this.Date.substr(0, 4), 10)
                : parseInt(this.Date, 10);
        };
        Track.prototype.GetFormattedYearString = function () {
            var year = this.GetYear();
            return (!year)
                ? ''
                : '(' + year.toString() + ')';
        };
        Track.prototype.GetAlbumName = function () {
            return (this.Album && this.Album.Name)
                ? this.Album.Name
                : '';
        };
        Track.prototype.GetFormattedArtistName = function () {
            return (!this.Artists || this.Artists.length <= 0)
                ? '--'
                : (this.Artists.length === 1)
                    ? this.Artists[0].Name
                    : (this.Artists[0].Name + ' and more...');
        };
        return Track;
    }());
    exports.default = Track;
});
define("Models/AlbumTracks/AlbumTracks", ["require", "exports", "Models/Albums/Album", "Models/Artists/Artist", "Models/Tracks/Track"], function (require, exports, Album_2, Artist_2, Track_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AlbumTracks = /** @class */ (function () {
        function AlbumTracks() {
        }
        AlbumTracks.Create = function (entity) {
            if (!entity)
                return null;
            var result = new AlbumTracks();
            result.Album = Album_2.default.Create(entity.Album);
            result.Artists = Artist_2.default.CreateArray(entity.Artists);
            result.Tracks = Track_1.default.CreateArray(entity.Tracks);
            return result;
        };
        AlbumTracks.CreateArray = function (entities) {
            var result = [];
            if (!entities)
                return result;
            for (var i = 0; i < entities.length; i++) {
                var entity = AlbumTracks.Create(entities[i]);
                if (entity)
                    result.push(entity);
            }
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
define("Models/Bases/StoreBase", ["require", "exports", "Libraries", "Models/Bases/XhrQueryableBase"], function (require, exports, Libraries_2, XhrQueryableBase_2) {
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
    }(XhrQueryableBase_2.default));
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
define("Views/Shared/SelectionList", ["require", "exports", "admin-lte/dist/js/adminlte", "lodash", "Libraries", "Views/Bases/ViewBase", "Views/Events/AdminLteEvents", "Views/Shared/SelectionEvents"], function (require, exports, AdminLte, _, Libraries_3, ViewBase_4, AdminLteEvents_1, SelectionEvents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SelectionList = /** @class */ (function (_super) {
        __extends(SelectionList, _super);
        function SelectionList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isAutoCollapse = true;
            _this.page = 1;
            _this.viewport = Libraries_3.default.ResponsiveBootstrapToolkit;
            _this.isCollapsed = false;
            return _this;
        }
        Object.defineProperty(SelectionList.prototype, "Page", {
            get: function () {
                return this.page;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionList.prototype, "InfiniteLoading", {
            get: function () {
                return (this.$refs.InfiniteLoading)
                    ? this.$refs.InfiniteLoading
                    : null;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionList.prototype, "ButtonCollaplse", {
            get: function () {
                return (this.$refs.ButtonCollaplse)
                    ? this.$refs.ButtonCollaplse
                    : null;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * サブクラス上でsuper.Initialize()呼び出し前に isAutoCollapse をセットしておくこと。
         */
        SelectionList.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var button;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.Initialize.call(this)];
                        case 1:
                            _a.sent();
                            if (this.isAutoCollapse) {
                                button = Libraries_3.default.$(this.ButtonCollaplse);
                                this.boxWidget = new AdminLte.Widget(button);
                                button.on(AdminLteEvents_1.WidgetEvents.Collapsed, function () {
                                    _this.isCollapsed = true;
                                });
                                button.on(AdminLteEvents_1.WidgetEvents.Expanded, function () {
                                    _this.isCollapsed = false;
                                });
                                Libraries_3.default.$(window).resize(this.viewport.changed(function () {
                                    _this.ToggleListByViewport();
                                }));
                                _.delay(function () {
                                    _this.ToggleListByViewport();
                                }, 1000);
                            }
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        SelectionList.prototype.OnInfinite = function ($state) {
            return __awaiter(this, void 0, void 0, function () {
                var result, isUpdated, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.GetPagenatedList()];
                        case 1:
                            result = _a.sent();
                            isUpdated = false;
                            if (0 < result.ResultList.length) {
                                this.entities = this.entities.concat(result.ResultList);
                                isUpdated = true;
                            }
                            if (this.entities.length < result.TotalLength) {
                                $state.loaded();
                                this.page++;
                            }
                            else {
                                $state.complete();
                            }
                            if (isUpdated) {
                                this.$emit(SelectionEvents_1.default.ListUpdated, {
                                    Entities: this.entities
                                });
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            console.error(e_1);
                            console.error(this);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/, true];
                    }
                });
            });
        };
        SelectionList.prototype.OnCollapseClick = function () {
            this.boxWidget.toggle();
        };
        SelectionList.prototype.OnClickRefresh = function () {
            this.Refresh();
            this.$emit(SelectionEvents_1.default.Refreshed);
        };
        SelectionList.prototype.OnSelectionChanged = function (args) {
            this.$emit(SelectionEvents_1.default.SelectionChanged, args);
        };
        SelectionList.prototype.Refresh = function () {
            var _this = this;
            this.page = 1;
            this.entities = [];
            this.$nextTick(function () {
                _this.InfiniteLoading.stateChanger.reset();
                _this.InfiniteLoading.attemptLoad();
            });
        };
        SelectionList.prototype.ToggleListByViewport = function () {
            if (!this.isAutoCollapse)
                return;
            if (this.viewport.is('<=sm') && !this.isCollapsed) {
                this.boxWidget.collapse();
            }
            else if (this.viewport.is('>sm') && this.isCollapsed) {
                this.boxWidget.expand();
            }
        };
        return SelectionList;
    }(ViewBase_4.default));
    exports.default = SelectionList;
});
define("Views/Finders/Selections/SelectionAlbumTracks", ["require", "exports", "vue-class-component", "vue-property-decorator", "Views/Bases/ViewBase", "Models/AlbumTracks/AlbumTracks", "Libraries"], function (require, exports, vue_class_component_4, vue_property_decorator_1, ViewBase_5, AlbumTracks_2, Libraries_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectionAlbumEvents = {
        AlbumTracksSelected: 'AlbumTracksSelected'
    };
    var SelectionAlbumTracks = /** @class */ (function (_super) {
        __extends(SelectionAlbumTracks, _super);
        function SelectionAlbumTracks() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SelectionAlbumTracks.prototype.OnClickAlbumPlay = function () {
            var tracks = Libraries_4.default.Enumerable.from(this.entity.Tracks);
            var track = tracks.first(function (e) { return e.TrackNo === tracks.min(function (e2) { return e2.TrackNo; }); });
            this.$emit(exports.SelectionAlbumEvents.AlbumTracksSelected, {
                Entity: this.entity,
                Track: track
            });
        };
        SelectionAlbumTracks.prototype.OnClickTrack = function (args) {
            var tr = args.target.parentElement;
            var trackId = parseInt(tr.getAttribute('data-trackid'), 10);
            var tracks = Libraries_4.default.Enumerable.from(this.entity.Tracks);
            var track = tracks.first(function (e) { return e.Id === trackId; });
            this.$emit(exports.SelectionAlbumEvents.AlbumTracksSelected, {
                Entity: this.entity,
                Track: track
            });
        };
        __decorate([
            vue_property_decorator_1.Prop(),
            __metadata("design:type", AlbumTracks_2.default)
        ], SelectionAlbumTracks.prototype, "entity", void 0);
        SelectionAlbumTracks = __decorate([
            vue_class_component_4.default({
                template: "<li class=\"nav-item w-100\"\n                   ref=\"Li\" >\n    <div class=\"card w-100\">\n        <div class=\"card-header with-border bg-secondary\">\n            <h3 class=\"card-title text-nowrap text-truncate\">\n                {{ entity.GetArtistName() }} {{ (entity.Album.Year) ? '(' + entity.Album.Year + ')' : '' }} : {{ entity.Album.Name }}\n            </h3>\n            <div class=\"card-tools\">\n                <button type=\"button\"\n                        class=\"btn btn-tool\"\n                        @click=\"OnClickAlbumPlay\" >\n                    <i class=\"fa fa-play\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"card-body row\">\n            <div class=\"col-md-4\">\n                <img class=\"albumart\" v-bind:src=\"entity.Album.GetImageFullUri()\" />\n            </div>\n            <div class=\"col-md-8\">\n                <table class=\"table table-sm table-hover tracks\">\n                    <tbody>\n                        <template v-for=\"track in entity.Tracks\">\n                        <tr @click=\"OnClickTrack\"\n                            v-bind:data-trackid=\"track.Id\">\n                            <td class=\"tracknum\">{{ track.TrackNo }}</td>\n                            <td class=\"trackname text-truncate\">{{ track.Name }}</td>\n                            <td class=\"tracklength\">{{ track.GetTimeString() }}</td>\n                        </tr>\n                        </template>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n    </div>\n</li>"
            })
        ], SelectionAlbumTracks);
        return SelectionAlbumTracks;
    }(ViewBase_5.default));
    exports.default = SelectionAlbumTracks;
});
define("Views/Finders/Lists/AlbumList", ["require", "exports", "lodash", "vue-class-component", "vue-infinite-loading", "Libraries", "Models/AlbumTracks/AlbumTracksStore", "Views/Shared/SelectionList", "Views/Finders/Selections/SelectionAlbumTracks"], function (require, exports, _, vue_class_component_5, vue_infinite_loading_1, Libraries_5, AlbumTracksStore_1, SelectionList_1, SelectionAlbumTracks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AlbumList = /** @class */ (function (_super) {
        __extends(AlbumList, _super);
        function AlbumList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.store = new AlbumTracksStore_1.default();
            _this.entities = [];
            _this.isEntitiesRefreshed = false;
            _this.genreIds = [];
            _this.artistIds = [];
            return _this;
        }
        AlbumList.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.isAutoCollapse = false;
                            return [4 /*yield*/, _super.prototype.Initialize.call(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        /**
         * Vueのイベントハンドラは、実装クラス側にハンドラが無い場合に
         * superクラスの同名メソッドが実行されるが、superクラス上のthisが
         * バインドされずにnullになってしまう。
         * 必ず実装クラス側でハンドルしてsuperクラスに渡すようにする。
         */
        AlbumList.prototype.OnInfinite = function ($state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, _super.prototype.OnInfinite.call(this, $state)];
                });
            });
        };
        AlbumList.prototype.OnClickRefresh = function () {
            _super.prototype.OnClickRefresh.call(this);
        };
        AlbumList.prototype.GetPagenatedList = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.store.GetList(this.genreIds, this.artistIds, this.Page)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        AlbumList.prototype.OnAlbumTracksSelected = function (args) {
            return __awaiter(this, void 0, void 0, function () {
                var albumTracks, track, isAllTracksRegistered, result, resultAtls, updatedTracks;
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
                            albumTracks = args.Entity;
                            if (!albumTracks) {
                                console.error('AlbumTracks Not Found - AlbumTrack;');
                                console.error(args.Entity);
                                return [2 /*return*/, false];
                            }
                            track = args.Track;
                            if (!track) {
                                console.error('Track Not Found - Track:');
                                console.error(args.Track);
                                return [2 /*return*/, false];
                            }
                            isAllTracksRegistered = Libraries_5.default.Enumerable.from(albumTracks.Tracks)
                                .all(function (e) { return e.TlId !== null; });
                            if (!isAllTracksRegistered) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.store.PlayAlbumByTlId(track.TlId)];
                        case 3:
                            result = _a.sent();
                            return [2 /*return*/, result];
                        case 4: return [4 /*yield*/, this.store.PlayAlbumByTrack(track)];
                        case 5:
                            resultAtls = _a.sent();
                            updatedTracks = Libraries_5.default.Enumerable.from(resultAtls.Tracks);
                            _.each(albumTracks.Tracks, function (track) {
                                track.TlId = updatedTracks.firstOrDefault(function (e) { return e.Id == track.Id; }).TlId;
                            });
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        AlbumList.prototype.Refresh = function () {
            _super.prototype.Refresh.call(this);
            this.isEntitiesRefreshed = true;
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
            vue_class_component_5.default({
                template: "<div class=\"col-md-6\">\n    <div class=\"card\">\n        <div class=\"card-header with-border bg-secondary\">\n            <h3 class=\"card-title\">Albums</h3>\n            <div class=\"card-tools\">\n                <button type=\"button\"\n                        class=\"btn btn-tool\"\n                        @click=\"OnClickRefresh\" >\n                    <i class=\"fa fa-repeat\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"card-body list-scrollable\">\n            <ul class=\"nav nav-pills h-100 d-flex flex-column flex-nowrap\">\n                <template v-for=\"entity in entities\">\n                    <selection-album-tracks\n                        ref=\"AlbumTracks\"\n                        v-bind:entity=\"entity\"\n                        @AlbumTracksSelected=\"OnAlbumTracksSelected\" />\n                </template>\n                <infinite-loading\n                    @infinite=\"OnInfinite\"\n                    ref=\"InfiniteLoading\" />\n            </ul>\n        </div>\n    </div>\n</div>",
                components: {
                    'selection-album-tracks': SelectionAlbumTracks_1.default,
                    'infinite-loading': vue_infinite_loading_1.default
                }
            })
        ], AlbumList);
        return AlbumList;
    }(SelectionList_1.default));
    exports.default = AlbumList;
});
define("Models/Artists/ArtistStore", ["require", "exports", "Models/Bases/StoreBase", "Models/Artists/Artist"], function (require, exports, StoreBase_2, Artist_3) {
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
                            result.ResultList = Artist_3.default.CreateArray(result.ResultList);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        return ArtistStore;
    }(StoreBase_2.default));
    exports.default = ArtistStore;
});
define("Views/Shared/SelectionItem", ["require", "exports", "vue-class-component", "vue-property-decorator", "Views/Bases/ViewBase"], function (require, exports, vue_class_component_6, vue_property_decorator_2, ViewBase_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectionItemEvents = {
        SelectionChanged: 'SelectionChanged'
    };
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
            this.selected = !this.selected;
            this.SetClassBySelection();
            this.$emit(exports.SelectionItemEvents.SelectionChanged, {
                Entity: this.entity,
                Selected: this.selected
            });
        };
        SelectionItem.prototype.SetClassBySelection = function () {
            if (this.selected) {
                if (!this.Li.classList.contains(SelectionItem_1.SelectedColor))
                    this.Li.classList.add(SelectionItem_1.SelectedColor);
            }
            else {
                if (this.Li.classList.contains(SelectionItem_1.SelectedColor))
                    this.Li.classList.remove(SelectionItem_1.SelectedColor);
            }
        };
        SelectionItem.prototype.GetSelected = function () {
            return this.selected;
        };
        SelectionItem.prototype.GetEntity = function () {
            return this.entity;
        };
        SelectionItem.prototype.SetSelected = function (selected) {
            this.selected = selected;
            this.SetClassBySelection();
        };
        var SelectionItem_1;
        SelectionItem.SelectedColor = 'bg-gray';
        __decorate([
            vue_property_decorator_2.Prop(),
            __metadata("design:type", Object)
        ], SelectionItem.prototype, "entity", void 0);
        SelectionItem = SelectionItem_1 = __decorate([
            vue_class_component_6.default({
                template: "<li class=\"nav-item\"\n                   ref=\"Li\" >\n    <a href=\"javascript:void(0)\" class=\"d-inline-block w-100 text-nowrap text-truncate\"\n       @click=\"OnClick\" >\n        {{ entity.Name }}\n    </a>\n</li>"
            })
        ], SelectionItem);
        return SelectionItem;
    }(ViewBase_6.default));
    exports.default = SelectionItem;
});
define("Views/Finders/Lists/ArtistList", ["require", "exports", "lodash", "vue-class-component", "vue-infinite-loading", "Models/Artists/ArtistStore", "Views/Shared/SelectionItem", "Views/Shared/SelectionList"], function (require, exports, _, vue_class_component_7, vue_infinite_loading_2, ArtistStore_1, SelectionItem_2, SelectionList_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArtistList = /** @class */ (function (_super) {
        __extends(ArtistList, _super);
        function ArtistList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.store = new ArtistStore_1.default();
            _this.entities = [];
            _this.genreIds = [];
            return _this;
        }
        ArtistList.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.isAutoCollapse = true;
                            return [4 /*yield*/, _super.prototype.Initialize.call(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        /**
         * Vueのイベントハンドラは、実装クラス側にハンドラが無い場合に
         * superクラスの同名メソッドが実行されるが、superクラス上のthisが
         * バインドされずにnullになってしまう。
         * 必ず実装クラス側でハンドルしてsuperクラスに渡すようにする。
         */
        ArtistList.prototype.OnInfinite = function ($state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, _super.prototype.OnInfinite.call(this, $state)];
                });
            });
        };
        ArtistList.prototype.OnCollapseClick = function () {
            _super.prototype.OnCollapseClick.call(this);
        };
        ArtistList.prototype.OnClickRefresh = function () {
            _super.prototype.OnClickRefresh.call(this);
        };
        ArtistList.prototype.OnSelectionChanged = function (args) {
            _super.prototype.OnSelectionChanged.call(this, args);
        };
        ArtistList.prototype.GetPagenatedList = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.store.GetList(this.genreIds, this.Page)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
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
            vue_class_component_7.default({
                template: "<div class=\"col-md-3\">\n    <div class=\"card\">\n        <div class=\"card-header with-border bg-info\">\n            <h3 class=\"card-title\">Artists</h3>\n            <div class=\"card-tools\">\n                <button\n                    class=\"btn btn-tool d-inline d-md-none collapse\"\n                    ref=\"ButtonCollaplse\"\n                    @click=\"OnCollapseClick\" >\n                    <i class=\"fa fa-minus\" />\n                </button>\n                <button type=\"button\"\n                        class=\"btn btn-tool\"\n                        @click=\"OnClickRefresh\" >\n                    <i class=\"fa fa-repeat\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"card-body list-scrollable\">\n            <ul class=\"nav nav-pills h-100 d-flex flex-column flex-nowrap\">\n                <template v-for=\"entity in entities\">\n                <selection-item\n                    ref=\"Items\"\n                    v-bind:entity=\"entity\"\n                    @SelectionChanged=\"OnSelectionChanged\" />\n                </template>\n                <infinite-loading\n                    @infinite=\"OnInfinite\"\n                    ref=\"InfiniteLoading\" />\n            </ul>\n        </div>\n    </div>\n</div>",
                components: {
                    'selection-item': SelectionItem_2.default,
                    'infinite-loading': vue_infinite_loading_2.default
                }
            })
        ], ArtistList);
        return ArtistList;
    }(SelectionList_2.default));
    exports.default = ArtistList;
});
define("Models/Genres/Genre", ["require", "exports", "Models/Relations/GenreAlbum", "Models/Relations/GenreArtist"], function (require, exports, GenreAlbum_2, GenreArtist_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Genre = /** @class */ (function () {
        function Genre() {
        }
        Genre.Create = function (entity) {
            if (!entity)
                return null;
            var result = new Genre();
            if (entity) {
                result.Id = entity.Id;
                result.Name = entity.Name;
                result.LowerName = entity.LowerName;
                result.Uri = entity.Uri;
                result.GenreArtists = GenreArtist_2.default.CreateArray(entity.GenreArtists);
                result.GenreAlbums = GenreAlbum_2.default.CreateArray(entity.GenreAlbums);
            }
            return result;
        };
        Genre.CreateArray = function (entities) {
            var result = [];
            if (!entities)
                return result;
            for (var i = 0; i < entities.length; i++) {
                var entity = Genre.Create(entities[i]);
                if (entity)
                    result.push(entity);
            }
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
        GenreStore.prototype.GetList = function (page) {
            return __awaiter(this, void 0, void 0, function () {
                var response, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryGet('Genre/GetPagenatedList', {
                                Page: page
                            })];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded) {
                                console.error(response.Errors);
                                throw new Error('Unexpected Error on ApiQuery');
                            }
                            result = response.Result;
                            result.ResultList = Genre_1.default.CreateArray(result.ResultList);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        return GenreStore;
    }(StoreBase_3.default));
    exports.default = GenreStore;
});
define("Views/Finders/Lists/GenreList", ["require", "exports", "vue-class-component", "vue-infinite-loading", "Models/Genres/GenreStore", "Views/Shared/SelectionItem", "Views/Shared/SelectionList"], function (require, exports, vue_class_component_8, vue_infinite_loading_3, GenreStore_1, SelectionItem_3, SelectionList_3) {
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
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.isAutoCollapse = true;
                            return [4 /*yield*/, _super.prototype.Initialize.call(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        /**
         * Vueのイベントハンドラは、実装クラス側にハンドラが無い場合に
         * superクラスの同名メソッドが実行されるが、superクラス上のthisが
         * バインドされずにnullになってしまう。
         * 必ず実装クラス側でハンドルしてsuperクラスに渡すようにする。
         */
        GenreList.prototype.OnInfinite = function ($state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, _super.prototype.OnInfinite.call(this, $state)];
                });
            });
        };
        GenreList.prototype.OnCollapseClick = function () {
            _super.prototype.OnCollapseClick.call(this);
        };
        GenreList.prototype.OnClickRefresh = function () {
            _super.prototype.OnClickRefresh.call(this);
        };
        GenreList.prototype.OnSelectionChanged = function (args) {
            _super.prototype.OnSelectionChanged.call(this, args);
        };
        GenreList.prototype.GetPagenatedList = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.store.GetList(this.Page)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        GenreList = __decorate([
            vue_class_component_8.default({
                template: "<div class=\"col-md-3\">\n    <div class=\"card\">\n        <div class=\"card-header with-border bg-green\">\n            <h3 class=\"card-title\">Genres</h3>\n            <div class=\"card-tools\">\n                <button\n                    class=\"btn btn-tool d-inline d-md-none collapse\"\n                    ref=\"ButtonCollaplse\"\n                    @click=\"OnCollapseClick\" >\n                    <i class=\"fa fa-minus\" />\n                </button>\n                <button type=\"button\"\n                        class=\"btn btn-tool\"\n                        @click=\"OnClickRefresh\" >\n                    <i class=\"fa fa-repeat\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"card-body list-scrollable\">\n            <ul class=\"nav nav-pills h-100 d-flex flex-column flex-nowrap\">\n                <template v-for=\"entity in entities\">\n                    <selection-item\n                        ref=\"Items\"\n                        v-bind:entity=\"entity\"\n                        @SelectionChanged=\"OnSelectionChanged\" />\n                </template>\n                <infinite-loading\n                    @infinite=\"OnInfinite\"\n                    ref=\"InfiniteLoading\" />\n            </ul>\n        </div>\n    </div>\n</div>",
                components: {
                    'selection-item': SelectionItem_3.default,
                    'infinite-loading': vue_infinite_loading_3.default
                }
            })
        ], GenreList);
        return GenreList;
    }(SelectionList_3.default));
    exports.default = GenreList;
});
define("Views/Finders/Finder", ["require", "exports", "vue-class-component", "Views/Bases/ViewBase", "Views/Finders/Lists/AlbumList", "Views/Finders/Lists/ArtistList", "Views/Finders/Lists/GenreList"], function (require, exports, vue_class_component_9, ViewBase_7, AlbumList_1, ArtistList_1, GenreList_1) {
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
        Finder = __decorate([
            vue_class_component_9.default({
                template: "<section class=\"content h-100 tab-pane fade show active\"\n                        id=\"tab-finder\"\n                        role=\"tabpanel\"\n                        aria-labelledby=\"finder-tab\">\n    <div class=\"row\">\n        <genre-list\n            ref=\"GenreList\"\n            @SelectionChanged=\"OnGenreSelectionChanged\"\n            @Refreshed=\"OnGenreRefreshed\" />\n        <artist-list\n            ref=\"ArtistList\"\n            @SelectionChanged=\"OnArtistSelectionChanged\"\n            @Refreshed=\"OnArtistRefreshed\" />\n        <album-list\n            ref=\"AlbumList\" />\n    </div>\n</section>",
                components: {
                    'genre-list': GenreList_1.default,
                    'artist-list': ArtistList_1.default,
                    'album-list': AlbumList_1.default
                }
            })
        ], Finder);
        return Finder;
    }(ViewBase_7.default));
    exports.default = Finder;
});
define("Models/Mopidies/IRef", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Models/Playlists/Playlist", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Playlist = /** @class */ (function () {
        function Playlist() {
        }
        Playlist.Create = function (entity) {
            if (!entity)
                return null;
            var result = new Playlist();
            result.Name = entity.Name;
            result.Uri = entity.Uri;
            result.MopidyTracks = entity.MopidyTracks;
            result.Tracks = entity.Tracks;
            return result;
        };
        Playlist.CreateArray = function (entities) {
            var result = [];
            if (!entities)
                return result;
            for (var i = 0; i < entities.length; i++) {
                var entity = Playlist.Create(entities[i]);
                if (entity)
                    result.push(entity);
            }
            return result;
        };
        Playlist.CreateByRef = function (entity) {
            if (!entity)
                return null;
            var result = new Playlist();
            result.Name = entity.name;
            result.Uri = entity.uri;
            result.Tracks = [];
            result.MopidyTracks = [];
            return result;
        };
        Playlist.CreateArrayByRefs = function (entities) {
            var result = [];
            for (var i = 0; i < entities.length; i++) {
                var entity = Playlist.CreateByRef(entities[i]);
                if (entity)
                    result.push(entity);
            }
            return result;
        };
        return Playlist;
    }());
    exports.default = Playlist;
});
define("Models/Mopidies/IPlaylist", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Models/Playlists/PlaylistStore", ["require", "exports", "Libraries", "Models/Bases/JsonRpcQueryableBase", "Models/Playlists/Playlist"], function (require, exports, Libraries_6, JsonRpcQueryableBase_2, Playlist_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlaylistStore = /** @class */ (function (_super) {
        __extends(PlaylistStore, _super);
        function PlaylistStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PlaylistStore.prototype.GetPlaylists = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, refs, ordered, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcRequest(PlaylistStore.Methods.AsList)];
                        case 1:
                            response = _a.sent();
                            refs = response.result;
                            ordered = Libraries_6.default.Enumerable.from(refs)
                                .orderBy(function (e) { return e.name; })
                                .toArray();
                            result = Playlist_1.default.CreateArrayByRefs(ordered);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        PlaylistStore.prototype.GetTracksByPlaylist = function (playlist) {
            return __awaiter(this, void 0, void 0, function () {
                var response, mpPlaylist, trackUris, response2, pairList, tracks, i, track, completedTrack;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcRequest(PlaylistStore.Methods.PlaylistLookup, {
                                uri: playlist.Uri
                            })];
                        case 1:
                            response = _a.sent();
                            mpPlaylist = response.result;
                            trackUris = Libraries_6.default.Enumerable.from(mpPlaylist.tracks)
                                .select(function (e) { return e.uri; })
                                .toArray();
                            return [4 /*yield*/, this.JsonRpcRequest(PlaylistStore.Methods.LibraryLookup, {
                                    uris: trackUris
                                })];
                        case 2:
                            response2 = _a.sent();
                            pairList = response2.result;
                            tracks = [];
                            for (i = 0; i < mpPlaylist.tracks.length; i++) {
                                track = mpPlaylist.tracks[i];
                                if (!pairList[track.uri])
                                    continue;
                                completedTrack = pairList[track.uri][0];
                                if (completedTrack)
                                    tracks.push(completedTrack);
                            }
                            return [2 /*return*/, tracks];
                    }
                });
            });
        };
        PlaylistStore.prototype.GetImageUri = function (uri) {
            return __awaiter(this, void 0, void 0, function () {
                var resImages, images;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcRequest(PlaylistStore.Methods.GetImages, {
                                uris: [uri]
                            })];
                        case 1:
                            resImages = _a.sent();
                            if (resImages.result) {
                                images = resImages.result[uri];
                                if (images && 0 < images.length)
                                    return [2 /*return*/, images[0]];
                            }
                            return [2 /*return*/, null];
                    }
                });
            });
        };
        PlaylistStore.prototype.ClearList = function () {
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
        PlaylistStore.Methods = {
            AsList: 'core.playlists.as_list',
            PlaylistLookup: 'core.playlists.lookup',
            LibraryLookup: 'core.library.lookup',
            GetImages: 'core.library.get_images',
        };
        return PlaylistStore;
    }(JsonRpcQueryableBase_2.default));
    exports.default = PlaylistStore;
});
define("Views/Playlists/Lists/PlaylistList", ["require", "exports", "lodash", "vue-class-component", "Models/Playlists/PlaylistStore", "Views/Shared/SelectionItem", "Views/Shared/SelectionList"], function (require, exports, _, vue_class_component_10, PlaylistStore_1, SelectionItem_4, SelectionList_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlaylistList = /** @class */ (function (_super) {
        __extends(PlaylistList, _super);
        function PlaylistList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.store = new PlaylistStore_1.default();
            _this.entities = [];
            return _this;
        }
        Object.defineProperty(PlaylistList.prototype, "Items", {
            get: function () {
                return this.$refs.Items;
            },
            enumerable: true,
            configurable: true
        });
        PlaylistList.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.isAutoCollapse = true;
                            return [4 /*yield*/, _super.prototype.Initialize.call(this)];
                        case 1:
                            _b.sent();
                            _a = this;
                            return [4 /*yield*/, this.store.GetPlaylists()];
                        case 2:
                            _a.entities = _b.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        /**
         * Vueのイベントハンドラは、実装クラス側にハンドラが無い場合に
         * superクラスの同名メソッドが実行されるが、superクラス上のthisが
         * バインドされずにnullになってしまう。
         * 必ず実装クラス側でハンドルしてsuperクラスに渡すようにする。
         */
        PlaylistList.prototype.OnCollapseClick = function () {
            _super.prototype.OnCollapseClick.call(this);
        };
        PlaylistList.prototype.OnSelectionChanged = function (args) {
            _.each(this.Items, function (si) {
                if (si.GetEntity() !== args.Entity && si.GetSelected()) {
                    si.SetSelected(false);
                }
            });
            _super.prototype.OnSelectionChanged.call(this, args);
        };
        PlaylistList.prototype.GetPagenatedList = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, null];
                });
            });
        };
        PlaylistList = __decorate([
            vue_class_component_10.default({
                template: "<div class=\"col-md-3\">\n    <div class=\"card\">\n        <div class=\"card-header with-border bg-info\">\n            <h3 class=\"card-title\">Playlists</h3>\n            <div class=\"card-tools\">\n                <button\n                    class=\"btn btn-tool d-inline d-md-none collapse\"\n                    ref=\"ButtonCollaplse\"\n                    @click=\"OnCollapseClick\" >\n                    <i class=\"fa fa-minus\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"card-body list-scrollable\">\n            <ul class=\"nav nav-pills h-100 d-flex flex-column flex-nowrap\">\n                <template v-for=\"entity in entities\">\n                <selection-item\n                    ref=\"Items\"\n                    v-bind:entity=\"entity\"\n                    @SelectionChanged=\"OnSelectionChanged\" />\n                </template>\n            </ul>\n        </div>\n    </div>\n</div>",
                components: {
                    'selection-item': SelectionItem_4.default
                }
            })
        ], PlaylistList);
        return PlaylistList;
    }(SelectionList_4.default));
    exports.default = PlaylistList;
});
define("Views/Playlists/Selections/SelectionTrack", ["require", "exports", "vue-class-component", "vue-property-decorator", "Models/Tracks/Track", "Views/Bases/ViewBase", "Views/Shared/SelectionEvents"], function (require, exports, vue_class_component_11, vue_property_decorator_3, Track_2, ViewBase_8, SelectionEvents_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SelectionTrack = /** @class */ (function (_super) {
        __extends(SelectionTrack, _super);
        function SelectionTrack() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SelectionTrack.prototype.OnClick = function () {
            this.$emit(SelectionEvents_2.default.SelectionChanged, {
                Selected: true,
                Entity: this.entity
            });
        };
        __decorate([
            vue_property_decorator_3.Prop(),
            __metadata("design:type", Track_2.default)
        ], SelectionTrack.prototype, "entity", void 0);
        SelectionTrack = __decorate([
            vue_class_component_11.default({
                template: "<li class=\"item w-100\"\n                    ref=\"Li\" >\n    <a href=\"javascript:void(0)\" class=\"w-100\"\n        @click=\"OnClick\">\n        <div class=\"product-img\">\n            <img v-bind:src=\"((entity.Album) ? entity.Album.GetImageFullUri() : '')\" alt=\"ALbum Image\">\n        </div>\n        <div class=\"product-info\">\n            <span class=\"product-title\">\n                {{ entity.Name }}\n                <span class=\"pull-right\">{{ entity.GetTimeString() }}</span>\n            </span>\n            <span class=\"product-description\">\n                {{ entity.GetAlbumName() }} {{ entity.GetFormattedYearString() }} {{ ' : ' + entity.GetFormattedArtistName() }}\n            </span>\n        </div>\n    </a>\n</li>"
            })
        ], SelectionTrack);
        return SelectionTrack;
    }(ViewBase_8.default));
    exports.default = SelectionTrack;
});
define("Views/Playlists/Lists/TrackList", ["require", "exports", "vue-class-component", "Models/Playlists/PlaylistStore", "Models/Tracks/Track", "Views/Shared/SelectionList", "Views/Playlists/Selections/SelectionTrack"], function (require, exports, vue_class_component_12, PlaylistStore_2, Track_3, SelectionList_5, SelectionTrack_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TrackList = /** @class */ (function (_super) {
        __extends(TrackList, _super);
        function TrackList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.store = new PlaylistStore_2.default();
            _this.entities = [];
            _this.playlist = null;
            return _this;
        }
        TrackList.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.isAutoCollapse = false;
                            return [4 /*yield*/, _super.prototype.Initialize.call(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        TrackList.prototype.SetPlaylist = function (playlist) {
            return __awaiter(this, void 0, void 0, function () {
                var mpTracks;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!playlist) {
                                this.playlist = null;
                                this.entities = [];
                                return [2 /*return*/, false];
                            }
                            this.playlist = playlist;
                            if (!(!this.playlist.MopidyTracks || this.playlist.MopidyTracks.length <= 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.store.GetTracksByPlaylist(this.playlist)];
                        case 1:
                            mpTracks = _a.sent();
                            this.playlist.MopidyTracks = mpTracks;
                            this.playlist.Tracks = Track_3.default.CreateArrayByMopidy(mpTracks);
                            _a.label = 2;
                        case 2:
                            this.entities = this.playlist.Tracks;
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        /**
         * Vueのイベントハンドラは、実装クラス側にハンドラが無い場合に
         * superクラスの同名メソッドが実行されるが、superクラス上のthisが
         * バインドされずにnullになってしまう。
         * 必ず実装クラス側でハンドルしてsuperクラスに渡すようにする。
         */
        TrackList.prototype.OnSelectionChanged = function (args) {
            _super.prototype.OnSelectionChanged.call(this, args);
        };
        TrackList.prototype.GetPagenatedList = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, null];
                });
            });
        };
        TrackList = __decorate([
            vue_class_component_12.default({
                template: "<div class=\"col-md-9\">\n    <div class=\"card\">\n        <div class=\"card-header with-border bg-secondary\">\n            <h3 class=\"card-title\">Tracks</h3>\n        </div>\n        <div class=\"card-body list-scrollable\">\n            <ul class=\"products-list product-list-in-box\">\n                <template v-for=\"entity in entities\">\n                <selection-track\n                    ref=\"Items\"\n                    v-bind:entity=\"entity\"\n                    @SelectionChanged=\"OnSelectionChanged\" />\n                </template>\n            </ul>\n        </div>\n    </div>\n</div>",
                components: {
                    'selection-track': SelectionTrack_1.default
                }
            })
        ], TrackList);
        return TrackList;
    }(SelectionList_5.default));
    exports.default = TrackList;
});
define("Views/Playlists/Playlists", ["require", "exports", "vue-class-component", "Views/Bases/ViewBase", "Views/Playlists/Lists/PlaylistList", "Views/Playlists/Lists/TrackList"], function (require, exports, vue_class_component_13, ViewBase_9, PlaylistList_1, TrackList_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Playlists = /** @class */ (function (_super) {
        __extends(Playlists, _super);
        function Playlists() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Playlists.prototype, "PlaylistList", {
            get: function () {
                return this.$refs.PlaylistList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Playlists.prototype, "TrackList", {
            get: function () {
                return this.$refs.TrackList;
            },
            enumerable: true,
            configurable: true
        });
        Playlists.prototype.OnPlaylistsSelectionChanged = function (args) {
            if (args.Selected) {
                this.TrackList.SetPlaylist(args.Entity);
            }
            else {
                this.TrackList.SetPlaylist(null);
            }
        };
        Playlists = __decorate([
            vue_class_component_13.default({
                template: "<section class=\"content h-100 tab-pane fade\"\n                        id=\"tab-playlists\"\n                        role=\"tabpanel\"\n                        aria-labelledby=\"playlists-tab\">\n    <div class=\"row\">\n        <playlist-list\n            ref=\"PlaylistList\"\n            @SelectionChanged=\"OnPlaylistsSelectionChanged\" />\n        <track-list\n            ref=\"TrackList\" />\n    </div>\n</section>",
                components: {
                    'playlist-list': PlaylistList_1.default,
                    'track-list': TrackList_1.default
                }
            })
        ], Playlists);
        return Playlists;
    }(ViewBase_9.default));
    exports.default = Playlists;
});
define("Views/Settings/Settings", ["require", "exports", "vue-class-component", "Views/Bases/ViewBase"], function (require, exports, vue_class_component_14, ViewBase_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Settings = /** @class */ (function (_super) {
        __extends(Settings, _super);
        function Settings() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Settings = __decorate([
            vue_class_component_14.default({
                template: "<section class=\"content h-100 tab-pane fade\"\n                        id=\"tab-settings\"\n                        role=\"tabpanel\"\n                        aria-labelledby=\"settings-tab\">\n</section>",
                components: {}
            })
        ], Settings);
        return Settings;
    }(ViewBase_10.default));
    exports.default = Settings;
});
define("Views/RootView", ["require", "exports", "Views/Bases/ViewBase", "vue-class-component", "Views/HeaderBars/HeaderBar", "Views/Sidebars/Sidebar", "Views/Finders/Finder", "Views/Playlists/Playlists", "Views/Settings/Settings"], function (require, exports, ViewBase_11, vue_class_component_15, HeaderBar_1, Sidebar_1, Finder_1, Playlists_1, Settings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RootView = /** @class */ (function (_super) {
        __extends(RootView, _super);
        function RootView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(RootView.prototype, "HeaderBar", {
            get: function () {
                return this.$refs.HeaderBar;
            },
            enumerable: true,
            configurable: true
        });
        RootView.prototype.OnContentChanged = function (args) {
            this.HeaderBar.SetTitle(args.Name);
        };
        RootView = __decorate([
            vue_class_component_15.default({
                template: "<div class=\"wrapper\" style=\"height: 100%; min-height: 100%;\">\n    <header-bar ref=\"HeaderBar\" />\n    <sidebar\n        @ContentChanged=\"OnContentChanged\"\n        ref=\"Sidebar\" />\n    <div class=\"content-wrapper h-100 pt-3 tab-content\">\n        <finder ref=\"Finder\" />\n        <playlists ref=\"Playlists\" />\n        <settings ref=\"Settings\" />\n    </div>\n</div>",
                components: {
                    'header-bar': HeaderBar_1.default,
                    'sidebar': Sidebar_1.default,
                    'finder': Finder_1.default,
                    'playlists': Playlists_1.default,
                    'settings': Settings_1.default
                }
            })
        ], RootView);
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
define("Main", ["require", "exports", "Libraries", "Controllers/RootContoller"], function (require, exports, Libraries_7, RootContoller_1) {
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
                            Libraries_7.default.Initialize();
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
//# sourceMappingURL=tsout.js.map