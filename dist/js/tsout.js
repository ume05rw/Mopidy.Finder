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
                        console.error(e); // eslint-disable-line
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
define("Libraries", ["require", "exports", "jquery", "responsive-toolkit/dist/bootstrap-toolkit", "admin-lte/dist/js/adminlte", "linq", "mopidy", "admin-lte/plugins/sweetalert2/sweetalert2", "vue", "animate.css/animate.css", "font-awesome/css/font-awesome.css", "../css/adminlte.css", "admin-lte/plugins/ion-rangeslider/css/ion.rangeSlider.css", "admin-lte/plugins/sweetalert2/sweetalert2.css", "../css/bootstrap4-neon-glow.css", "../css/site.css", "admin-lte/plugins/bootstrap/js/bootstrap.bundle", "admin-lte/plugins/ion-rangeslider/js/ion.rangeSlider", "jquery-slimscroll"], function (require, exports, jQuery, ResponsiveBootstrapToolkit, AdminLte, Enumerable, Mopidy, sweetalert2_1, vue_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // SweetAlert2 は個別読み込みOK.
    //import Swal from 'admin-lte/plugins/sweetalert2/sweetalert2';
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
        /* eslint-enable @typescript-eslint/indent */
        Libraries.GetElement = function (arg) {
            return (arg instanceof vue_1.default)
                ? arg.$el
                : arg;
        };
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
        Libraries.JQueryEventBinds = {
            On: function (element, eventName, handler) {
                var elem = Libraries.GetElement(element);
                Libraries.$(elem).on(eventName, handler);
            },
            Off: function (element, eventName, handler) {
                var elem = Libraries.GetElement(element);
                Libraries.$(elem).off(eventName, handler);
            },
            OffAll: function (element, eventName) {
                var elem = Libraries.GetElement(element);
                Libraries.$(elem).off(eventName);
            }
        };
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
        /**
         * Hammer
         */
        Libraries.Hammer = ((Hammer.default)
            ? Hammer.default
            : Hammer);
        /**
         * AdminLTE
         */
        Libraries.AdminLte = AdminLte;
        /**
         * SlimScroll (on JQuery)
         */
        /* eslint-disable @typescript-eslint/indent */
        Libraries.SlimScroll = function (element, opstions) {
            Libraries.$(element).slimScroll(opstions);
        };
        /* eslint-enable @typescript-eslint/indent */
        /**
         * Popper (on JQuery)
         */
        /* eslint-disable @typescript-eslint/indent */
        Libraries.SetTooltip = function (element, message) {
            Libraries.$(element).tooltip({
                placement: 'top',
                title: message,
                trigger: 'hover',
                delay: {
                    show: 1000,
                    hide: 100
                }
            });
        };
        /* eslint-enable @typescript-eslint/indent */
        /**
         * SweetAlert2 - Toast
         *
         * type: 'success' | 'error' | 'warning' | 'info' | 'question'
         * ex) Toast.fire({ type: 'success', title: 'any message here.' });
         */
        Libraries.Toast = sweetalert2_1.default.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
        /* eslint-disable @typescript-eslint/indent */
        Libraries.InnerShowToast = function (toastType, message) {
            Libraries.Toast.fire({
                type: toastType,
                title: message
            });
        };
        /**
         * SweerAlert2のToast表示メソッド
         * 型定義が冗長なのはなんとかならんのか
         */
        Libraries.ShowToast = {
            Success: function (message) { return Libraries.InnerShowToast('success', message); },
            Info: function (message) { return Libraries.InnerShowToast('info', message); },
            Question: function (message) { return Libraries.InnerShowToast('question', message); },
            Warning: function (message) { return Libraries.InnerShowToast('warning', message); },
            Error: function (message) { return Libraries.InnerShowToast('error', message); }
        };
        Libraries.Modal = {
            Show: function (arg) {
                var elem = Libraries.GetElement(arg);
                Libraries.$(elem).modal('show');
            },
            Hide: function (arg) {
                var elem = Libraries.GetElement(arg);
                Libraries.$(elem).modal('hide');
            }
        };
        return Libraries;
    }());
    exports.default = Libraries;
});
define("Views/Bases/ViewBase", ["require", "exports", "lodash", "vue"], function (require, exports, _, vue_2) {
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
                return __generator(this, function (_a) {
                    if (this.initialized)
                        return [2 /*return*/, true];
                    _.each(this.$children, function (view) {
                        if (view instanceof ViewBase) {
                            try {
                                view.Initialize();
                            }
                            catch (e) {
                                console.error('Initialize Error');
                                console.error(e);
                            }
                        }
                    });
                    this.initialized = true;
                    return [2 /*return*/, true];
                });
            });
        };
        ViewBase.prototype.GetIsInitialized = function () {
            return this.initialized;
        };
        return ViewBase;
    }(vue_2.default));
    exports.default = ViewBase;
});
define("Models/Mopidies/IArtist", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Models/Relations/ArtistAlbum", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArtistAlbum = /** @class */ (function () {
        function ArtistAlbum() {
            this.ArtistId = null;
            this.AlbumId = null;
        }
        ArtistAlbum.Create = function (entity) {
            if (!entity)
                return null;
            var result = new ArtistAlbum();
            result.ArtistId = entity.ArtistId || null;
            result.AlbumId = entity.AlbumId || null;
            return result;
        };
        ArtistAlbum.CreateArray = function (entities) {
            var result = [];
            if (!entities)
                return result;
            for (var i = 0; i < entities.length; i++) {
                var entity = ArtistAlbum.Create(entities[i]);
                if (entity)
                    result.push(entity);
            }
            return result;
        };
        return ArtistAlbum;
    }());
    exports.default = ArtistAlbum;
});
define("Models/Relations/GenreArtist", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenreArtist = /** @class */ (function () {
        function GenreArtist() {
            this.GenreId = null;
            this.ArtistId = null;
        }
        GenreArtist.Create = function (entity) {
            if (!entity)
                return null;
            var result = new GenreArtist();
            result.GenreId = entity.GenreId || null;
            result.ArtistId = entity.ArtistId || null;
            return result;
        };
        GenreArtist.CreateArray = function (entities) {
            var result = [];
            if (!entities)
                return result;
            for (var i = 0; i < entities.length; i++) {
                var entity = GenreArtist.Create(entities[i]);
                if (entity)
                    result.push(entity);
            }
            return result;
        };
        return GenreArtist;
    }());
    exports.default = GenreArtist;
});
define("Models/Artists/Artist", ["require", "exports", "Models/Relations/ArtistAlbum", "Models/Relations/GenreArtist"], function (require, exports, ArtistAlbum_1, GenreArtist_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Artist = /** @class */ (function () {
        function Artist() {
            this.Id = null;
            this.Name = null;
            this.LowerName = null;
            this.Uri = null;
            this.ImageUri = null;
            this.ArtistAlbums = [];
            this.GenreArtists = [];
        }
        Artist.Create = function (entity) {
            if (!entity)
                return null;
            var result = new Artist();
            result.Id = entity.Id || null;
            result.Name = entity.Name || null;
            result.LowerName = entity.LowerName || null;
            result.Uri = entity.Uri || null;
            result.ImageUri = entity.ImageUri || null;
            result.ArtistAlbums = ArtistAlbum_1.default.CreateArray(entity.ArtistAlbums);
            result.GenreArtists = GenreArtist_1.default.CreateArray(entity.GenreArtists);
            return result;
        };
        Artist.CreateFromMopidy = function (entity) {
            if (!entity)
                return null;
            var result = new Artist();
            result.Id = null;
            result.Name = entity.name || null;
            result.LowerName = (entity.name)
                ? entity.name.toLowerCase()
                : null;
            result.Uri = entity.uri || null;
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
        Artist.CreateArrayFromMopidy = function (entities) {
            var result = [];
            if (!entities)
                return result;
            for (var i = 0; i < entities.length; i++) {
                var entity = Artist.CreateFromMopidy(entities[i]);
                if (entity)
                    result.push(entity);
            }
            return result;
        };
        return Artist;
    }());
    exports.default = Artist;
});
define("Models/Relations/GenreAlbum", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenreAlbum = /** @class */ (function () {
        function GenreAlbum() {
            this.GenreId = null;
            this.AlbumId = null;
        }
        GenreAlbum.Create = function (entity) {
            if (!entity)
                return null;
            var result = new GenreAlbum();
            result.GenreId = entity.GenreId || null;
            result.AlbumId = entity.AlbumId || null;
            return result;
        };
        GenreAlbum.CreateArray = function (entities) {
            var result = [];
            if (!entities)
                return result;
            for (var i = 0; i < entities.length; i++) {
                var entity = GenreAlbum.Create(entities[i]);
                if (entity)
                    result.push(entity);
            }
            return result;
        };
        return GenreAlbum;
    }());
    exports.default = GenreAlbum;
});
define("Models/Genres/Genre", ["require", "exports", "Models/Relations/GenreAlbum", "Models/Relations/GenreArtist"], function (require, exports, GenreAlbum_1, GenreArtist_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Genre = /** @class */ (function () {
        function Genre() {
            this.Id = null;
            this.Name = null;
            this.LowerName = null;
            this.Uri = null;
            this.GenreArtists = [];
            this.GenreAlbums = [];
        }
        Genre.Create = function (entity) {
            if (!entity)
                return null;
            var result = new Genre();
            if (entity) {
                result.Id = entity.Id || null;
                result.Name = entity.Name || null;
                result.LowerName = entity.LowerName || null;
                result.Uri = entity.Uri || null;
                result.GenreArtists = GenreArtist_2.default.CreateArray(entity.GenreArtists);
                result.GenreAlbums = GenreAlbum_1.default.CreateArray(entity.GenreAlbums);
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
define("Utils/Exception", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Exception = /** @class */ (function () {
        function Exception() {
        }
        Exception.Throw = function (message, data) {
            throw new Error(Exception.CreateDump(message, data));
        };
        //public static Dump(message: string, data?: any): void {
        //    console.error(Exception.CreateDump(message, data)); // eslint-disable-line
        //}
        Exception.CreateDump = function (message, data) {
            if (!message)
                message = 'Unexpexted Error';
            return JSON.stringify({
                Message: message,
                Data: data
            });
        };
        return Exception;
    }());
    exports.default = Exception;
});
define("Utils/Dump", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Dump = /** @class */ (function () {
        function Dump() {
        }
        Dump.Log = function (message, value) {
            var time = Dump.GetTimestamp();
            console.log("[" + time.TimeStamp + "]:: " + message); // eslint-disable-line
            if (value)
                console.log(Dump.GetDumpString(value)); // eslint-disable-line
        };
        Dump.Warning = function (message, value) {
            var time = Dump.GetTimestamp();
            console.warn("[" + time.TimeStamp + "]:: " + message); // eslint-disable-line
            if (value)
                console.log(Dump.GetDumpString(value)); // eslint-disable-line
        };
        Dump.Error = function (message, value) {
            var dumpString = Dump.GetDumpString(value);
            var time = Dump.GetTimestamp();
            console.error("[" + time.TimeStamp + "]:: " + message); // eslint-disable-line
            if (value)
                console.log(Dump.GetDumpString(value)); // eslint-disable-line
        };
        Dump.GetDumpString = function (value) {
            var type = typeof value;
            return (type === 'object' || type === 'function' || type === 'symbol')
                ? JSON.stringify(value, null, 4)
                : ('' + value);
        };
        Dump.GetTimestamp = function () {
            var now = new Date();
            return {
                Time: now,
                TimeStamp: ('0' + now.getHours()).slice(-2) + ":" + ('0' + now.getMinutes()).slice(-2) + ":" + ('0' + now.getSeconds()).slice(-2) + "." + ('000' + now.getMilliseconds()).substr(-3)
            };
        };
        return Dump;
    }());
    exports.default = Dump;
});
define("Utils/Delay", ["require", "exports", "Utils/Exception", "Utils/Dump"], function (require, exports, Exception_1, Dump_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DelayedOnceExecuter = /** @class */ (function () {
        function DelayedOnceExecuter(callback, delay, timeout, isMonitor) {
            var _this = this;
            if (delay === void 0) { delay = 100; }
            if (timeout === void 0) { timeout = -1; }
            if (isMonitor === void 0) { isMonitor = false; }
            this.Name = '';
            this._callback = callback;
            this._delay = delay;
            this._timeout = timeout;
            this._startTime = null;
            this._timer = null;
            this._isActive = false;
            this._suppressCount = 0;
            this._timeoutExecStartTime = null;
            if (isMonitor) {
                setInterval(function () {
                    if (!_this._isActive)
                        return;
                    if (_this._startTime || _this._timeoutExecStartTime) {
                        var now = new Date();
                        var elapsed = (_this._timeoutExecStartTime)
                            ? now.getTime() - _this._timeoutExecStartTime.getTime()
                            : now.getTime() - _this._startTime.getTime();
                        if (DelayedOnceExecuter.DelayThreshold < elapsed) {
                            // Delay閾値より長い時間の間、一度も実行されていない。
                            // 無限ループの可能性がある。
                            Dump_1.default.Warning('＊＊＊無限ループの可能性があります＊＊＊', _this.Name + ": \u7D4C\u904E\u6642\u9593(msec) = " + elapsed);
                        }
                    }
                    if (DelayedOnceExecuter.SuppressThreshold < _this._suppressCount) {
                        // Suppress閾値より多くの回数分、実行が抑制されている。
                        // 呼び出し回数が多すぎる可能性がある。
                        Dump_1.default.Warning('＊＊＊呼び出し回数が多すぎます＊＊＊', _this.Name + ": \u6291\u5236\u56DE\u6570 = " + _this._suppressCount);
                    }
                }, DelayedOnceExecuter.MonitorInterval);
            }
        }
        Object.defineProperty(DelayedOnceExecuter.prototype, "Delay", {
            get: function () {
                return this._delay;
            },
            set: function (value) {
                this._delay = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DelayedOnceExecuter.prototype, "Timeout", {
            get: function () {
                return this._timeout;
            },
            set: function (value) {
                this._timeout = value;
            },
            enumerable: true,
            configurable: true
        });
        DelayedOnceExecuter.prototype.Exec = function (args) {
            var _this = this;
            this._isActive = true;
            if (this._timer === null) {
                // これから開始するとき
                this._startTime = new Date();
                this._suppressCount = 0;
            }
            else {
                // 既に開始中のとき
                clearInterval(this._timer);
                this._timer = null;
                this._suppressCount++;
            }
            var now = new Date();
            var elapsed = (now.getTime() - this._startTime.getTime());
            if (0 < this._timeout && elapsed > this._timeout) {
                // タイムアウト実行が連続するときの、最初の開始時間を保持しておく。
                if (this._timeoutExecStartTime === null)
                    this._timeoutExecStartTime = this._startTime;
                this.InnerExec(args);
            }
            else {
                this._timer = setTimeout(function () {
                    _this._timeoutExecStartTime = null;
                    _this.InnerExec(args);
                }, this._delay);
            }
        };
        DelayedOnceExecuter.prototype.InnerExec = function (args) {
            try {
                this._callback(args);
            }
            catch (ex) {
                Dump_1.default.Error('Callback FAILED!!', ex);
            }
            if (this._timer) {
                clearInterval(this._timer);
                this._timer = null;
            }
            this._startTime = null;
            this._suppressCount = 0;
            this._isActive = false;
        };
        DelayedOnceExecuter.MonitorInterval = 10000;
        DelayedOnceExecuter.DelayThreshold = 3000;
        DelayedOnceExecuter.SuppressThreshold = 100;
        return DelayedOnceExecuter;
    }());
    exports.DelayedOnceExecuter = DelayedOnceExecuter;
    var Delay = /** @class */ (function () {
        function Delay() {
        }
        Delay.Wait = function (msec) {
            return new Promise(function (resolve) {
                window.setTimeout(function () {
                    try {
                        resolve(true);
                    }
                    catch (ex) {
                        Exception_1.default.Throw('Delay Exception.', ex);
                    }
                }, msec);
            });
        };
        Delay.DelayedOnce = function (callback, delay, timeout, isMonitor) {
            if (delay === void 0) { delay = 100; }
            if (timeout === void 0) { timeout = -1; }
            if (isMonitor === void 0) { isMonitor = false; }
            return new DelayedOnceExecuter(callback, delay, timeout, isMonitor);
        };
        return Delay;
    }());
    exports.default = Delay;
});
define("Views/Bases/TabBase", ["require", "exports", "Views/Bases/ViewBase"], function (require, exports, ViewBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TabEvents = {
        Show: 'Show',
        Shown: 'Shown',
        Hide: 'Hide',
        Hidden: 'Hidden',
    };
    var TabBase = /** @class */ (function (_super) {
        __extends(TabBase, _super);
        function TabBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TabBase.prototype.OnShow = function () {
        };
        TabBase.prototype.OnShown = function () {
        };
        TabBase.prototype.OnHide = function () {
        };
        TabBase.prototype.OnHidden = function () {
        };
        return TabBase;
    }(ViewBase_1.default));
    exports.default = TabBase;
});
define("Views/Bases/IContent", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Contents;
    (function (Contents) {
        Contents["Finder"] = "Finder";
        Contents["Playlists"] = "Playlists";
        Contents["Settings"] = "Settings";
    })(Contents = exports.Contents || (exports.Contents = {}));
});
define("Views/Bases/IContentDetail", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ContentDetails;
    (function (ContentDetails) {
        ContentDetails[ContentDetails["Genres"] = 0] = "Genres";
        ContentDetails[ContentDetails["Artists"] = 1] = "Artists";
        ContentDetails[ContentDetails["AlbumTracks"] = 2] = "AlbumTracks";
        ContentDetails[ContentDetails["Playlists"] = 3] = "Playlists";
        ContentDetails[ContentDetails["PlaylistTracks"] = 4] = "PlaylistTracks";
        ContentDetails[ContentDetails["SetMopidy"] = 5] = "SetMopidy";
        ContentDetails[ContentDetails["Database"] = 6] = "Database";
        ContentDetails[ContentDetails["ScanProgress"] = 7] = "ScanProgress";
    })(ContentDetails = exports.ContentDetails || (exports.ContentDetails = {}));
});
define("Views/Bases/ContentBase", ["require", "exports", "Views/Bases/TabBase"], function (require, exports, TabBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ContentBase = /** @class */ (function (_super) {
        __extends(ContentBase, _super);
        function ContentBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ContentBase.prototype.SetDetailToFulscreen = function () {
            for (var i = 0; i < this.details.length; i++) {
                var detail = this.details[i];
                (i === 0)
                    ? detail.Show()
                    : detail.Hide();
            }
        };
        ContentBase.prototype.SetDetailToColumn = function () {
            for (var i = 0; i < this.details.length; i++) {
                var detail = this.details[i];
                detail.Show();
            }
        };
        ContentBase.prototype.HideAllDetails = function () {
            for (var i = 0; i < this.details.length; i++) {
                var detail = this.details[i];
                detail.Hide();
            }
        };
        return ContentBase;
    }(TabBase_1.default));
    exports.default = ContentBase;
});
define("Views/Shared/SelectionItem", ["require", "exports", "vue-class-component", "vue-property-decorator", "Views/Bases/ViewBase"], function (require, exports, vue_class_component_1, vue_property_decorator_1, ViewBase_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectionItemEvents = {
        SelectionOrdered: 'SelectionOrdered',
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
            var orderedArgs = {
                Entity: this.entity,
                Selected: !this.selected,
                Permitted: true
            };
            this.$emit(exports.SelectionItemEvents.SelectionOrdered, orderedArgs);
            if (orderedArgs.Permitted !== true)
                return;
            this.SetSelected(!this.selected);
        };
        SelectionItem.prototype.SetSelected = function (selected) {
            this.selected = selected;
            this.SetClassBySelection();
            var changedArgs = {
                Entity: this.entity,
                Selected: this.selected
            };
            this.$emit(exports.SelectionItemEvents.SelectionChanged, changedArgs);
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
        var SelectionItem_1;
        SelectionItem.SelectedColor = 'selected';
        __decorate([
            vue_property_decorator_1.Prop(),
            __metadata("design:type", Object)
        ], SelectionItem.prototype, "entity", void 0);
        SelectionItem = SelectionItem_1 = __decorate([
            vue_class_component_1.default({
                template: "<li class=\"nav-item\"\n                   ref=\"Li\" >\n    <span class=\"d-block w-100 text-nowrap text-truncate\"\n       @click=\"OnClick\" >\n        {{ (entity.Name == ' ') ? '[blank]' : entity.Name }}\n    </span>\n</li>"
            })
        ], SelectionItem);
        return SelectionItem;
    }(ViewBase_2.default));
    exports.default = SelectionItem;
});
define("Models/Mopidies/IAlbum", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Models/Albums/Album", ["require", "exports", "Models/Relations/ArtistAlbum", "Models/Relations/GenreAlbum"], function (require, exports, ArtistAlbum_2, GenreAlbum_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Album = /** @class */ (function () {
        function Album() {
            this.Id = null;
            this.Name = null;
            this.LowerName = null;
            this.Uri = null;
            this.Year = null;
            this.ImageUri = null;
            this.ArtistAlbums = [];
            this.GenreAlbums = [];
        }
        Object.defineProperty(Album, "DefaultImage", {
            /**
             * テストドライバー上ではlocationが存在しない。
             */
            get: function () {
                return (!location)
                    ? 'http://localhost:6680/img/nullImage.jpg'
                    : location.protocol + "//" + location.host + "/img/nullImage.jpg";
            },
            enumerable: true,
            configurable: true
        });
        Album.Create = function (entity) {
            if (!entity)
                return null;
            var result = new Album();
            result.Id = entity.Id || null;
            result.Name = entity.Name || null;
            result.LowerName = entity.LowerName || null;
            result.Uri = entity.Uri || null;
            result.Year = entity.Year || null;
            result.ImageUri = entity.ImageUri || null;
            result.ArtistAlbums = ArtistAlbum_2.default.CreateArray(entity.ArtistAlbums);
            result.GenreAlbums = GenreAlbum_2.default.CreateArray(entity.GenreAlbums);
            return result;
        };
        Album.CreateFromMopidy = function (entity) {
            if (!entity)
                return null;
            var result = new Album();
            result.Id = null;
            result.Name = entity.name || null;
            result.LowerName = (entity.name)
                ? entity.name.toLowerCase()
                : null;
            result.Uri = entity.uri || null;
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
        Album.CreateArrayFromMopidy = function (entities) {
            var result = [];
            if (!entities)
                return result;
            for (var i = 0; i < entities.length; i++) {
                var entity = Album.CreateFromMopidy(entities[i]);
                if (entity)
                    result.push(entity);
            }
            return result;
        };
        Album.prototype.GetImageFullUri = function () {
            return (!this.ImageUri || this.ImageUri == '')
                ? Album.DefaultImage
                : location.protocol + "//" + location.host + this.ImageUri;
        };
        return Album;
    }());
    exports.default = Album;
});
define("Models/Mopidies/ITrack", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Models/Tracks/Track", ["require", "exports", "Utils/Dump", "Models/Albums/Album", "Models/Artists/Artist"], function (require, exports, Dump_2, Album_1, Artist_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Track = /** @class */ (function () {
        function Track() {
            this.Id = null;
            this.Name = null;
            this.LowerName = null;
            this.Uri = null;
            this.TlId = null;
            this.DiscNo = null;
            this.TrackNo = null;
            this.Date = null;
            this.Comment = null;
            this.Length = null;
            this.BitRate = null;
            this.LastModified = null;
            this.Album = null;
            this.Artists = [];
        }
        Track.Create = function (entity) {
            if (!entity)
                return null;
            var result = new Track();
            result.Id = entity.Id || null;
            result.Name = entity.Name || null;
            result.LowerName = entity.LowerName || null;
            result.Uri = entity.Uri || null;
            result.TlId = entity.TlId || null;
            result.DiscNo = entity.DiscNo || null;
            result.TrackNo = entity.TrackNo || null;
            result.Date = entity.Date || null;
            result.Comment = entity.Comment || null;
            result.Length = entity.Length || null;
            result.BitRate = entity.BitRate || null;
            result.LastModified = entity.LastModified || null;
            result.Album = Album_1.default.Create(entity.Album);
            result.Artists = Artist_1.default.CreateArray(entity.Artists);
            // JSONがアホほどでかくなるのでやめる
            //result.Genre = Genre.Create(entity.Genre);
            //result.Composers = Artist.CreateArray(entity.Composers);
            //result.Performers = Artist.CreateArray(entity.Performers);
            return result;
        };
        Track.CreateFromMopidy = function (entity) {
            if (!entity)
                return null;
            var result = new Track();
            result.Id = null;
            result.Name = entity.name || null;
            result.LowerName = (entity.name)
                ? entity.name.toLowerCase()
                : null;
            result.Uri = entity.uri || null;
            result.TlId = null;
            result.DiscNo = entity.disc_no || null;
            result.TrackNo = entity.track_no || null;
            result.Date = entity.date || null;
            result.Comment = entity.comment || null;
            result.Length = entity.length || null;
            result.BitRate = entity.bitrate || null;
            result.LastModified = entity.last_modified || null;
            result.Album = Album_1.default.CreateFromMopidy(entity.album);
            result.Artists = Artist_1.default.CreateArrayFromMopidy(entity.artists);
            // JSONがアホほどでかくなるのでやめる
            //result.Genre = Genre.Create(entity.Genre);
            //result.Composers = Artist.CreateArray(entity.Composers);
            //result.Performers = Artist.CreateArray(entity.Performers);
            return result;
        };
        Track.EnsureTrackByMopidy = function (entity, mopidyTrack) {
            if (!entity)
                Dump_2.default.Error('argument entity null');
            if (!mopidyTrack)
                Dump_2.default.Error('argument mopidyTrack null');
            entity.Id = null;
            entity.Name = mopidyTrack.name || null;
            entity.LowerName = (mopidyTrack.name)
                ? mopidyTrack.name.toLowerCase()
                : null;
            entity.Uri = mopidyTrack.uri || null;
            entity.TlId = null;
            entity.DiscNo = mopidyTrack.disc_no || null;
            entity.TrackNo = mopidyTrack.track_no || null;
            entity.Date = mopidyTrack.date || null;
            entity.Comment = mopidyTrack.comment || null;
            entity.Length = mopidyTrack.length || null;
            entity.BitRate = mopidyTrack.bitrate || null;
            entity.LastModified = mopidyTrack.last_modified || null;
            entity.Album = Album_1.default.CreateFromMopidy(mopidyTrack.album);
            entity.Artists = Artist_1.default.CreateArrayFromMopidy(mopidyTrack.artists);
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
        Track.CreateArrayFromMopidy = function (entities) {
            var result = [];
            if (!entities)
                return result;
            for (var i = 0; i < entities.length; i++) {
                var entity = Track.CreateFromMopidy(entities[i]);
                if (entity)
                    result.push(entity);
            }
            return result;
        };
        //public Genre: Genre;
        //public Composers: Artist[];
        //public Performers: Artist[];
        Track.prototype.GetTimeString = function () {
            if (!this.Length)
                return '--:--';
            var minute = Math.floor(this.Length / 60000);
            var second = Math.floor((this.Length % 60000) / 1000);
            var minuteStr = ('00' + minute.toString()).slice(-2);
            var secondStr = ('00' + second.toString()).slice(-2);
            return minuteStr + ':' + secondStr;
        };
        /**
         * ※Uri以外のプロパティが取得出来ないトラックがある。
         */
        Track.prototype.GetDisplayName = function () {
            if (this.Name && this.Name !== '')
                return this.Name;
            var uriParts = this.Uri.split('/');
            if (uriParts.length <= 0)
                return '--';
            return uriParts[uriParts.length - 1];
        };
        Track.prototype.GetYear = function () {
            if (!this.Date || this.Date.length < 1)
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
                : '--';
        };
        Track.prototype.GetFormattedArtistsName = function () {
            return (!this.Artists || this.Artists.length <= 0)
                ? '--'
                : (this.Artists.length === 1)
                    ? this.Artists[0].Name
                    : (this.Artists[0].Name + ' and more...');
        };
        Track.prototype.GetAlbumImageFullUri = function () {
            return (!this.Album)
                ? Album_1.default.DefaultImage
                : this.Album.GetImageFullUri();
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
            this.Album = null;
            this.Artists = [];
            this.Tracks = [];
        }
        AlbumTracks.Create = function (entity) {
            if (!entity)
                return null;
            var result = new AlbumTracks();
            result.Album = Album_2.default.Create(entity.Album);
            result.Artists = Artist_2.default.CreateArray(entity.Artists);
            result.Tracks = Track_1.default.CreateArray(entity.Tracks);
            for (var i = 0; i < result.Tracks.length; i++) {
                var track = result.Tracks[i];
                track.Album = result.Album;
                track.Artists = result.Artists;
            }
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
        Object.defineProperty(XhrQueryableBase, "Protocol", {
            get: function () {
                return (location)
                    ? location.protocol
                    : 'http:';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XhrQueryableBase, "HostName", {
            get: function () {
                return (location)
                    ? location.hostname
                    : 'localhost';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(XhrQueryableBase, "Port", {
            get: function () {
                return (location)
                    ? location.port
                    : '8080';
            },
            enumerable: true,
            configurable: true
        });
        XhrQueryableBase.prototype.ParseResponse = function (data) {
            if (!data) {
                var error = {
                    Message: 'Unexpected Error'
                };
                var result = {
                    Succeeded: false,
                    Errors: [error]
                };
                return result;
            }
            if ((typeof data == 'object') && data.hasOwnProperty('Succeeded')) {
                // dataが定型応答のとき
                var result = data;
                if (!result.Succeeded) {
                    console.error('Network Error:'); // eslint-disable-line
                    console.error(result.Errors); // eslint-disable-line
                }
                return data;
            }
            else {
                // dataが定型応答のとき
                var result = {
                    Succeeded: true,
                    Result: data
                };
                return result;
            }
        };
        XhrQueryableBase.prototype.CreateErrorResponse = function (error) {
            var formattedError = {
                Succeeded: false,
                Errors: error,
            };
            var result = {
                status: 406,
                statusText: 'Network Error',
                config: null,
                headers: null,
                data: formattedError
            };
            return result;
        };
        XhrQueryableBase.prototype.QueryGet = function (url, params) {
            if (params === void 0) { params = null; }
            return __awaiter(this, void 0, void 0, function () {
                var config, response;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            config = {
                                params: params,
                                paramsSerializer: XhrQueryableBase.ParamsSerializer
                            };
                            return [4 /*yield*/, XhrQueryableBase.XhrInstance.get(url, config)
                                    .catch(function (e) {
                                    return _this.CreateErrorResponse(e);
                                })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, this.ParseResponse(response.data)];
                    }
                });
            });
        };
        XhrQueryableBase.prototype.QueryPost = function (url, params) {
            if (params === void 0) { params = null; }
            return __awaiter(this, void 0, void 0, function () {
                var response;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, XhrQueryableBase.XhrInstance.post(url, params)
                                .catch(function (e) {
                                return _this.CreateErrorResponse(e);
                            })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, this.ParseResponse(response.data)];
                    }
                });
            });
        };
        XhrQueryableBase.prototype.QueryPut = function (url, params) {
            if (params === void 0) { params = null; }
            return __awaiter(this, void 0, void 0, function () {
                var response;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, XhrQueryableBase.XhrInstance.put(url, params)
                                .catch(function (e) {
                                return _this.CreateErrorResponse(e);
                            })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, this.ParseResponse(response.data)];
                    }
                });
            });
        };
        XhrQueryableBase.prototype.QueryDelete = function (url, params) {
            if (params === void 0) { params = null; }
            return __awaiter(this, void 0, void 0, function () {
                var response;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, XhrQueryableBase.XhrInstance.delete(url, params)
                                .catch(function (e) {
                                return _this.CreateErrorResponse(e);
                            })];
                        case 1:
                            response = _a.sent();
                            return [2 /*return*/, this.ParseResponse(response.data)];
                    }
                });
            });
        };
        XhrQueryableBase.XhrInstance = axios_1.default.create({
            //// APIの基底URLが存在するとき
            baseURL: XhrQueryableBase.Protocol + "//" + XhrQueryableBase.HostName + ":" + XhrQueryableBase.Port + "/",
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
define("Models/AlbumTracks/AlbumTracksStore", ["require", "exports", "Models/Bases/StoreBase", "Models/AlbumTracks/AlbumTracks", "Utils/Exception"], function (require, exports, StoreBase_1, AlbumTracks_1, Exception_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AlbumTracksStore = /** @class */ (function (_super) {
        __extends(AlbumTracksStore, _super);
        function AlbumTracksStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AlbumTracksStore.prototype.GetList = function (args) {
            return __awaiter(this, void 0, void 0, function () {
                var response, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryGet('AlbumTracks/GetPagenatedList', args)];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded)
                                Exception_2.default.Throw('Unexpected Error on ApiQuery', response.Errors);
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
                        case 0: return [4 /*yield*/, this.QueryPost('Player/PlayAlbumByTrackId', track.Id)];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded)
                                Exception_2.default.Throw('Unexpected Error on ApiQuery', response.Errors);
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
                            if (!response.Succeeded)
                                Exception_2.default.Throw('Unexpected Error on ApiQuery', response.Errors);
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
                            if (!response.Succeeded)
                                Exception_2.default.Throw('Unexpected Error on ApiQuery', response.Errors);
                            return [2 /*return*/, response.Result];
                    }
                });
            });
        };
        return AlbumTracksStore;
    }(StoreBase_1.default));
    exports.default = AlbumTracksStore;
});
define("Models/Mopidies/IRef", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Models/Mopidies/IPlaylist", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Models/Playlists/Playlist", ["require", "exports", "Models/Tracks/Track"], function (require, exports, Track_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Playlist = /** @class */ (function () {
        function Playlist() {
            this.Name = null;
            this.Uri = null;
            this.Tracks = [];
        }
        Playlist.CreateFromRef = function (entity) {
            if (!entity)
                return null;
            var result = new Playlist();
            result.Name = entity.name || null;
            result.Uri = entity.uri || null;
            result.Tracks = [];
            return result;
        };
        Playlist.CreateFromMopidy = function (entity) {
            if (!entity)
                return null;
            var result = new Playlist();
            result.Name = entity.name || null;
            result.Uri = entity.uri || null;
            result.Tracks = Track_2.default.CreateArrayFromMopidy(entity.tracks);
            return result;
        };
        Playlist.CreateArrayFromRefs = function (entities) {
            var result = [];
            for (var i = 0; i < entities.length; i++) {
                var entity = Playlist.CreateFromRef(entities[i]);
                if (entity)
                    result.push(entity);
            }
            return result;
        };
        Playlist.MinNameLength = 1;
        Playlist.MaxNameLength = 40;
        return Playlist;
    }());
    exports.default = Playlist;
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
                var response, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            params.jsonrpc = '2.0';
                            return [4 /*yield*/, XhrQueryableBase_2.default.XhrInstance.post(JsonRpcQueryableBase.Url, params)
                                    .catch(function (e) {
                                    var resultData = {
                                        jsonrpc: '2.0',
                                        error: e
                                    };
                                    if (params.id)
                                        resultData.id = params.id;
                                    var result = {
                                        status: 406,
                                        statusText: 'Network Error',
                                        config: null,
                                        headers: null,
                                        data: resultData
                                    };
                                    return result;
                                })];
                        case 1:
                            response = _a.sent();
                            result = response.data;
                            if (params.id && !result) {
                                // id付きにも拘らず、応答が無いとき
                                console.error("JsonRpcError: method=" + params.method); // eslint-disable-line
                                console.error('returns null'); // eslint-disable-line
                            }
                            if (result && result.error) {
                                // 応答にerrorが含まれるとき
                                console.error("JsonRpcError: method=" + params.method); // eslint-disable-line
                                console.error(result); // eslint-disable-line
                            }
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        JsonRpcQueryableBase.prototype.JsonRpcRequest = function (method, params) {
            if (params === void 0) { params = null; }
            return __awaiter(this, void 0, void 0, function () {
                var query, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            query = {
                                jsonrpc: '2.0',
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
                                jsonrpc: '2.0',
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
    }(XhrQueryableBase_2.default));
    exports.default = JsonRpcQueryableBase;
});
define("Models/Mopidies/ITlTrack", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Models/Tracks/TrackStore", ["require", "exports", "Libraries", "Utils/Dump", "Models/Bases/JsonRpcQueryableBase", "Models/Tracks/Track"], function (require, exports, Libraries_2, Dump_3, JsonRpcQueryableBase_1, Track_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TrackStore = /** @class */ (function (_super) {
        __extends(TrackStore, _super);
        function TrackStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TrackStore.prototype.EnsureTracks = function (tracks) {
            return __awaiter(this, void 0, void 0, function () {
                var trackUris, response, pairList, i, track, uri, pairedTrackArray, mpTrack;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            trackUris = Libraries_2.default.Enumerable.from(tracks)
                                .where(function (e) { return (!e.Name
                                || !e.Length); })
                                .select(function (e) { return e.Uri; })
                                .toArray();
                            return [4 /*yield*/, this.JsonRpcRequest(TrackStore.Methods.LibraryLookup, {
                                    uris: trackUris
                                })];
                        case 1:
                            response = _a.sent();
                            pairList = response.result;
                            for (i = 0; i < tracks.length; i++) {
                                track = tracks[i];
                                uri = track.Uri;
                                pairedTrackArray = pairList[uri];
                                if (track.Name && track.Length)
                                    continue;
                                if ((!track.Name || !track.Length)
                                    && (!pairedTrackArray || pairedTrackArray.length <= 0)) {
                                    Dump_3.default.Error('TrackStore.EnsureTracks: Track Details Not Found', { track: track, pairedTrackArray: pairedTrackArray });
                                    continue;
                                }
                                mpTrack = pairList[uri][0];
                                Track_3.default.EnsureTrackByMopidy(track, mpTrack);
                            }
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        TrackStore.Methods = {
            LibraryLookup: 'core.library.lookup',
        };
        return TrackStore;
    }(JsonRpcQueryableBase_1.default));
    exports.default = TrackStore;
});
define("Models/Playlists/PlaylistStore", ["require", "exports", "Libraries", "Utils/Exception", "Models/Bases/JsonRpcQueryableBase", "Models/Tracks/Track", "Models/Tracks/TrackStore", "Models/Playlists/Playlist"], function (require, exports, Libraries_3, Exception_3, JsonRpcQueryableBase_2, Track_4, TrackStore_1, Playlist_1) {
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
                        case 0: return [4 /*yield*/, this.JsonRpcRequest(PlaylistStore.Methods.PlaylistAsList)];
                        case 1:
                            response = _a.sent();
                            refs = response.result;
                            ordered = Libraries_3.default.Enumerable.from(refs)
                                .orderBy(function (e) { return e.name; })
                                .toArray();
                            result = Playlist_1.default.CreateArrayFromRefs(ordered);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        PlaylistStore.prototype.SetPlaylistTracks = function (playlist) {
            return __awaiter(this, void 0, void 0, function () {
                var response, mpPlaylist, tracks, trackStore;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcRequest(PlaylistStore.Methods.PlaylistLookup, {
                                uri: playlist.Uri
                            })];
                        case 1:
                            response = _a.sent();
                            mpPlaylist = response.result;
                            tracks = (mpPlaylist.tracks && 0 <= mpPlaylist.tracks.length)
                                ? Track_4.default.CreateArrayFromMopidy(mpPlaylist.tracks)
                                : [];
                            if (tracks.length <= 0) {
                                playlist.Tracks = [];
                                return [2 /*return*/, true];
                            }
                            trackStore = new TrackStore_1.default();
                            return [4 /*yield*/, trackStore.EnsureTracks(tracks)];
                        case 2:
                            _a.sent();
                            // 未Ensure状態のtracksをplaylist.TracksにセットするとVueが描画してしまうため、
                            // Ensure後にセットする。
                            playlist.Tracks = tracks;
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        PlaylistStore.prototype.GetImageUri = function (uri) {
            return __awaiter(this, void 0, void 0, function () {
                var resImages, images;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcRequest(PlaylistStore.Methods.LibraryGetImages, {
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
        PlaylistStore.prototype.PlayPlaylist = function (playlist, track) {
            return __awaiter(this, void 0, void 0, function () {
                var resClear, uris, resAdd, tlTracks, tlDictionary, i, tr;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcRequest(PlaylistStore.Methods.TracklistClearList)];
                        case 1:
                            resClear = _a.sent();
                            if (resClear.error)
                                throw new Error(resClear.error);
                            uris = Libraries_3.default.Enumerable.from(playlist.Tracks)
                                .select(function (e) { return e.Uri; })
                                .toArray();
                            return [4 /*yield*/, this.JsonRpcRequest(PlaylistStore.Methods.TracklistAdd, {
                                    uris: uris
                                })];
                        case 2:
                            resAdd = _a.sent();
                            if (resAdd.error)
                                Exception_3.default.Throw('PlaylistStore.PlayPlaylist: Play Failed.', resAdd.error);
                            tlTracks = resAdd.result;
                            tlDictionary = Libraries_3.default.Enumerable.from(tlTracks)
                                .toDictionary(function (e) { return e.track.uri; }, function (e2) { return e2.tlid; });
                            for (i = 0; i < playlist.Tracks.length; i++) {
                                tr = playlist.Tracks[i];
                                tr.TlId = (tlDictionary.contains(tr.Uri))
                                    ? tlDictionary.get(tr.Uri)
                                    : null;
                            }
                            if (track.TlId === null)
                                Exception_3.default.Throw("track: " + track.Name + " not assigned TlId");
                            return [4 /*yield*/, this.PlayByTlId(track.TlId)];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        PlaylistStore.prototype.PlayByTlId = function (tlId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcNotice(PlaylistStore.Methods.PlaybackPlay, {
                                tlid: tlId
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        PlaylistStore.prototype.AddPlaylist = function (name) {
            return __awaiter(this, void 0, void 0, function () {
                var response, mpPlaylist, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcRequest(PlaylistStore.Methods.PlaylistCreate, {
                                name: name
                            })];
                        case 1:
                            response = _a.sent();
                            if (response && response.error) {
                                Exception_3.default.Throw('PlaylistStore.AddPlaylist: Playlist Create Failed.', response.error);
                            }
                            mpPlaylist = response.result;
                            result = Playlist_1.default.CreateFromMopidy(mpPlaylist);
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        PlaylistStore.prototype.AddPlaylistByAlbumTracks = function (albumTracks) {
            return __awaiter(this, void 0, void 0, function () {
                var name, playlist, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            name = albumTracks.GetArtistName() + " - " + albumTracks.Album.Name;
                            return [4 /*yield*/, this.AddPlaylist(name)];
                        case 1:
                            playlist = _a.sent();
                            if (!playlist) {
                                Exception_3.default.Throw('PlaylistStore.AddPlaylistByAlbumTracks: Playlist Create Failed');
                            }
                            playlist.Tracks = albumTracks.Tracks;
                            return [4 /*yield*/, this.UpdatePlayllist(playlist)];
                        case 2:
                            response = _a.sent();
                            if (response !== true) {
                                Exception_3.default.Throw('PlaylistStore.AddPlaylistByAlbumTracks: Track Update Failed.');
                            }
                            return [2 /*return*/, playlist];
                    }
                });
            });
        };
        PlaylistStore.prototype.AppendTracks = function (playlist, newTracks) {
            return __awaiter(this, void 0, void 0, function () {
                var resLookup, mpPlaylist, i, resUpdate;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcRequest(PlaylistStore.Methods.PlaylistLookup, {
                                uri: playlist.Uri
                            })];
                        case 1:
                            resLookup = _a.sent();
                            mpPlaylist = resLookup.result;
                            // Createしたてでトラック未登録のプレイリストのとき、
                            // tracksプロパティが存在しない。
                            playlist.Tracks = (mpPlaylist.tracks && 0 <= mpPlaylist.tracks.length)
                                ? Track_4.default.CreateArrayFromMopidy(mpPlaylist.tracks)
                                : [];
                            for (i = 0; i < newTracks.length; i++)
                                playlist.Tracks.push(newTracks[i]);
                            resUpdate = this.UpdatePlayllist(playlist);
                            return [2 /*return*/, resUpdate];
                    }
                });
            });
        };
        PlaylistStore.prototype.UpdatePlayllist = function (playlist) {
            return __awaiter(this, void 0, void 0, function () {
                var tracks, i, track, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tracks = [];
                            for (i = 0; i < playlist.Tracks.length; i++) {
                                track = playlist.Tracks[i];
                                tracks.push({
                                    __model__: 'Track',
                                    uri: track.Uri
                                });
                            }
                            return [4 /*yield*/, this.JsonRpcRequest(PlaylistStore.Methods.PlaylistSave, {
                                    playlist: {
                                        __model__: 'Playlist',
                                        tracks: tracks,
                                        uri: playlist.Uri,
                                        name: playlist.Name
                                    }
                                })];
                        case 1:
                            response = _a.sent();
                            if (response && response.error) {
                                Exception_3.default.Throw('PlaylistStore.UpdatePlayllist: Track Update Failed.', response.error);
                            }
                            return [2 /*return*/, (response.result !== null)];
                    }
                });
            });
        };
        PlaylistStore.prototype.DeletePlaylist = function (playlist) {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcRequest(PlaylistStore.Methods.PlaylistDelete, {
                                uri: playlist.Uri
                            })];
                        case 1:
                            response = _a.sent();
                            if (response && response.error) {
                                Exception_3.default.Throw('PlaylistStore.DeletePlaylist: Delete Failed.', response.error);
                            }
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        PlaylistStore.Methods = {
            PlaylistAsList: 'core.playlists.as_list',
            PlaylistLookup: 'core.playlists.lookup',
            PlaylistCreate: 'core.playlists.create',
            PlaylistSave: 'core.playlists.save',
            PlaylistDelete: 'core.playlists.delete',
            LibraryGetImages: 'core.library.get_images',
            TracklistClearList: 'core.tracklist.clear',
            TracklistAdd: 'core.tracklist.add',
            TracklistGetTlTracks: 'core.tracklist.get_tl_tracks',
            PlaybackPlay: 'core.playback.play'
        };
        return PlaylistStore;
    }(JsonRpcQueryableBase_2.default));
    exports.default = PlaylistStore;
});
define("Utils/Animate", ["require", "exports", "lodash", "Utils/Dump"], function (require, exports, _, Dump_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Speed;
    (function (Speed) {
        Speed["Slower"] = "slower";
        Speed["Slow"] = "slow";
        Speed["Normal"] = "";
        Speed["Fast"] = "fast";
        Speed["Faster"] = "faster";
    })(Speed = exports.Speed || (exports.Speed = {}));
    var Animation;
    (function (Animation) {
        Animation["Bounce"] = "bounce";
        Animation["BounceIn"] = "bounceIn";
        Animation["BounceInDown"] = "bounceInDown";
        Animation["BounceInLeft"] = "bounceInLeft";
        Animation["BounceInRight"] = "bounceInRight";
        Animation["BounceInUp"] = "bounceInUp";
        Animation["BounceOut"] = "bounceOut";
        Animation["BounceOutDown"] = "bounceOutDown";
        Animation["BounceOutLeft"] = "bounceOutLeft";
        Animation["BounceOutRight"] = "bounceOutRight";
        Animation["BounceOutUp"] = "bounceOutUp";
        Animation["FadeIn"] = "fadeIn";
        Animation["FadeInDown"] = "fadeInDown";
        Animation["FadeInDownBig"] = "fadeInDownBig";
        Animation["FadeInLeft"] = "fadeInLeft";
        Animation["FadeInLeftBig"] = "fadeInLeftBig";
        Animation["FadeInRight"] = "fadeInRight";
        Animation["FadeInRightBig"] = "fadeInRightBig";
        Animation["FadeInUp"] = "fadeInUp";
        Animation["FadeInUpBig"] = "fadeInUpBig";
        Animation["FadeOut"] = "fadeOut";
        Animation["FadeOutDown"] = "fadeOutDown";
        Animation["FadeOutDownBig"] = "fadeOutDownBig";
        Animation["FadeOutLeft"] = "fadeOutLeft";
        Animation["FadeOutLeftBig"] = "fadeOutLeftBig";
        Animation["FadeOutRight"] = "fadeOutRight";
        Animation["FadeOutRightBig"] = "fadeOutRightBig";
        Animation["FadeOutUp"] = "fadeOutUp";
        Animation["FadeOutUpBig"] = "fadeOutUpBig";
        Animation["Flash"] = "flash";
        Animation["FlipInX"] = "flipInX";
        Animation["FlipInY"] = "flipInY";
        Animation["FlipOutX"] = "flipOutX";
        Animation["FlipOutY"] = "flipOutY";
        Animation["HeadShake"] = "headShake";
        Animation["HeartBeat"] = "heartBeat";
        Animation["Hinge"] = "hinge";
        Animation["JackInTheBox"] = "jackInTheBox";
        Animation["Jello"] = "jello";
        Animation["LightSpeedIn"] = "lightSpeedIn";
        Animation["LightSpeedOut"] = "lightSpeedOut";
        Animation["Pulse"] = "pulse";
        Animation["RollIn"] = "rollIn";
        Animation["RollOut"] = "rollOut";
        Animation["RotateIn"] = "rotateIn";
        Animation["RotateInDownLeft"] = "rotateInDownLeft";
        Animation["RotateInDownRight"] = "rotateInDownRight";
        Animation["RotateInUpLeft"] = "rotateInUpLeft";
        Animation["RotateInUpRight"] = "rotateInUpRight";
        Animation["RotateOut"] = "rotateOut";
        Animation["RotateOutDownLeft"] = "rotateOutDownLeft";
        Animation["RotateOutDownRight"] = "rotateOutDownRight";
        Animation["RotateOutUpLeft"] = "rotateOutUpLeft";
        Animation["RotateOutUpRight"] = "rotateOutUpRight";
        Animation["RubberBand"] = "rubberBand";
        Animation["Shake"] = "shake";
        Animation["SlideInDown"] = "slideInDown";
        Animation["SlideInLeft"] = "slideInLeft";
        Animation["SlideInRight"] = "slideInRight";
        Animation["SlideInUp"] = "slideInUp";
        Animation["SlideOutDown"] = "slideOutDown";
        Animation["SlideOutLeft"] = "slideOutLeft";
        Animation["SlideOutRight"] = "slideOutRight";
        Animation["SlideOutUp"] = "slideOutUp";
        Animation["Swing"] = "swing";
        Animation["Tada"] = "tada";
        Animation["Wobble"] = "wobble";
        Animation["ZoomIn"] = "zoomIn";
        Animation["ZoomInDown"] = "zoomInDown";
        Animation["ZoomInLeft"] = "zoomInLeft";
        Animation["ZoomInRight"] = "zoomInRight";
        Animation["ZoomInUp"] = "zoomInUp";
        Animation["ZoomOut"] = "zoomOut";
        Animation["ZoomOutDown"] = "zoomOutDown";
        Animation["ZoomOutLeft"] = "zoomOutLeft";
        Animation["ZoomOutRight"] = "zoomOutRight";
        Animation["ZoomOutUp"] = "zoomOutUp";
    })(Animation = exports.Animation || (exports.Animation = {}));
    var ToHideAnimations = {
        'bounceOut': true,
        'bounceOutDown': true,
        'bounceOutLeft': true,
        'bounceOutRight': true,
        'bounceOutUp': true,
        'fadeOut': true,
        'fadeOutDown': true,
        'fadeOutDownBig': true,
        'fadeOutLeft': true,
        'fadeOutLeftBig': true,
        'fadeOutRight': true,
        'fadeOutRightBig': true,
        'fadeOutUp': true,
        'fadeOutUpBig': true,
        'flipOutX': true,
        'flipOutY': true,
        'hinge': true,
        'lightSpeedOut': true,
        'rollOut': true,
        'rotateOut': true,
        'rotateOutDownLeft': true,
        'rotateOutDownRight': true,
        'rotateOutUpLeft': true,
        'rotateOutUpRight': true,
        'slideOutDown': true,
        'slideOutLeft': true,
        'slideOutRight': true,
        'slideOutUp': true,
        'zoomOut': true,
        'zoomOutDown': true,
        'zoomOutLeft': true,
        'zoomOutRight': true,
        'zoomOutUp': true,
    };
    var Animate = /** @class */ (function () {
        function Animate(elem) {
            this.HiddenClassName = 'd-none';
            this._isHidingAnimation = false;
            this._resolver = null;
            this._elem = null;
            this._classes = null;
            this._elem = elem;
            this._classes = this._elem.classList;
            this.OnAnimationEnd = this.OnAnimationEnd.bind(this);
        }
        Animate.ClearAnimation = function (elem) {
            var classes = elem.classList;
            if (!classes.contains(Animate.ClassAnimated))
                classes.remove(Animate.ClassAnimated);
            _.each(_.toPairs(Speed), function (vals) {
                var className = vals[1];
                if (className === '')
                    return;
                if (classes.contains(className))
                    classes.remove(className);
            });
            _.each(_.toPairs(Animation), function (vals) {
                var className = vals[1];
                if (classes.contains(className))
                    classes.remove(className);
            });
        };
        Animate.Exec = function (elem, animation, speed) {
            if (speed === void 0) { speed = Speed.Normal; }
            return __awaiter(this, void 0, void 0, function () {
                var anim;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            anim = new Animate(elem);
                            return [4 /*yield*/, anim.Execute(animation, speed)];
                        case 1:
                            _a.sent();
                            anim.Dispose();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Animate.GetClassString = function (animation, speed) {
            if (speed === void 0) { speed = Speed.Normal; }
            var result = " " + Animate.ClassAnimated + " " + animation.toString() + " "
                + ((speed === Speed.Normal)
                    ? ''
                    : speed.toString() + " ");
            return result;
        };
        Animate.IsHideAnimation = function (animation) {
            return (ToHideAnimations[animation.toString()]);
        };
        Animate.prototype.Execute = function (animation, speed) {
            var _this = this;
            if (speed === void 0) { speed = Speed.Normal; }
            return new Promise(function (resolve) {
                _this._resolver = resolve;
                _this._elem.addEventListener(Animate.AnimationEndEvent, _this.OnAnimationEnd);
                // 同じ内容のアニメーションが既に設定済みか否か
                var needsDefer = (_this._classes.contains(Animate.ClassAnimated)
                    && _this._classes.contains(animation.toString()));
                Animate.ClearAnimation(_this._elem);
                (needsDefer)
                    //既にアニメーションセット済みのとき: 一度クリアしたあとで遅延実行
                    ? _.defer(function () {
                        _this.InnerExecute(animation, speed);
                    })
                    // プレーン状態のとき: 即時アニメーション実行
                    : _this.InnerExecute(animation, speed);
            });
        };
        Animate.prototype.InnerExecute = function (animation, speed) {
            var _this = this;
            if (speed === void 0) { speed = Speed.Normal; }
            this._isHidingAnimation = Animate.IsHideAnimation(animation);
            if (!this.GetIsVisible())
                this.ShowNow();
            this._classes.add(Animate.ClassAnimated);
            this._classes.add(animation.toString());
            if (speed !== Speed.Normal)
                this._classes.add(speed.toString());
            // animationendイベントタイムアウト: 100ms加算。
            var endTime = -1;
            switch (speed) {
                case Speed.Slower:
                    endTime = 3100;
                    break;
                case Speed.Slow:
                    endTime = 2100;
                    break;
                case Speed.Normal:
                    endTime = 1100;
                    break;
                case Speed.Fast:
                    endTime = 900;
                    break;
                case Speed.Faster:
                    endTime = 600;
                    break;
            }
            setTimeout(function () {
                if (_this._resolver)
                    _this.Resolve(false);
            }, endTime);
        };
        Animate.prototype.OnAnimationEnd = function () {
            this.Resolve(true);
            return this;
        };
        Animate.prototype.Resolve = function (result) {
            if (this._isHidingAnimation === true && this.GetIsVisible())
                this.HideNow();
            this._isHidingAnimation = false;
            if (this._resolver) {
                try {
                    this._resolver(result);
                }
                catch (ex) {
                    Dump_4.default.Error('Animated.Resolve: Unexpected Error on Resolve', ex);
                }
            }
            this._resolver = null;
        };
        Animate.prototype.Clear = function () {
            Animate.ClearAnimation(this._elem);
            return this;
        };
        Animate.prototype.GetIsVisible = function () {
            if ((this.HiddenClassName)
                && 0 < this.HiddenClassName.length) {
                return !this._classes.contains(this.HiddenClassName);
            }
            return true;
        };
        Animate.prototype.HideNow = function () {
            if ((this.HiddenClassName)
                && 0 < this.HiddenClassName.length
                && !this._classes.contains(this.HiddenClassName)) {
                this._classes.add(this.HiddenClassName);
            }
            return this;
        };
        Animate.prototype.ShowNow = function () {
            if ((this.HiddenClassName)
                && 0 < this.HiddenClassName.length
                && this._classes.contains(this.HiddenClassName)) {
                this._classes.remove(this.HiddenClassName);
            }
            return this;
        };
        Animate.prototype.Dispose = function () {
            Animate.ClearAnimation(this._elem);
            try {
                this._elem.removeEventListener(Animate.AnimationEndEvent, this.OnAnimationEnd);
            }
            catch (e) {
                // 握りつぶす。
            }
            if (this._resolver)
                this._resolver(false);
            this._resolver = null;
            this._elem = null;
            this._classes = null;
        };
        Animate.ClassAnimated = 'animated';
        Animate.AnimationEndEvent = 'animationend';
        return Animate;
    }());
    exports.default = Animate;
});
define("Views/Bases/AnimatedBase", ["require", "exports", "Utils/Animate", "Utils/Exception", "Views/Bases/ViewBase", "Utils/Animate"], function (require, exports, Animate_1, Exception_4, ViewBase_3, Animate_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Animation = Animate_2.Animation;
    exports.Speed = Animate_2.Speed;
    var AnimatedBase = /** @class */ (function (_super) {
        __extends(AnimatedBase, _super);
        function AnimatedBase() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.Speed = Animate_1.Speed.Faster;
            _this.ClassHide = 'd-none';
            return _this;
        }
        Object.defineProperty(AnimatedBase.prototype, "Element", {
            get: function () {
                return this.$el;
            },
            enumerable: true,
            configurable: true
        });
        AnimatedBase.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    _super.prototype.Initialize.call(this);
                    if (!this.AnimationIn || Animate_1.default.IsHideAnimation(this.AnimationIn))
                        Exception_4.default.Throw('Invalid In-Animation', this.AnimationIn);
                    if (!this.AnimationOut || !Animate_1.default.IsHideAnimation(this.AnimationOut))
                        Exception_4.default.Throw('Invalid Out-Animation', this.AnimationOut);
                    this.animate = new Animate_1.default(this.$el);
                    return [2 /*return*/, true];
                });
            });
        };
        AnimatedBase.prototype.ClearAllClasses = function () {
            Animate_1.default.ClearAnimation(this.Element);
        };
        AnimatedBase.prototype.ShowNow = function () {
            this.ClearAllClasses();
            if (this.$el.classList.contains(this.ClassHide))
                this.$el.classList.remove(this.ClassHide);
        };
        AnimatedBase.prototype.Show = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.$el.classList.contains(this.ClassHide))
                                this.$el.classList.remove(this.ClassHide);
                            return [4 /*yield*/, this.animate.Execute(this.AnimationIn, this.Speed)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        AnimatedBase.prototype.HideNow = function () {
            this.ClearAllClasses();
            this.$el.classList.add(this.ClassHide);
        };
        AnimatedBase.prototype.Hide = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.$el.classList.contains(this.ClassHide))
                                this.$el.classList.remove(this.ClassHide);
                            return [4 /*yield*/, this.animate.Execute(this.AnimationOut, this.Speed)];
                        case 1:
                            _a.sent();
                            this.$el.classList.add(this.ClassHide);
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        AnimatedBase.prototype.GetIsVisible = function () {
            return !this.Element.classList.contains(this.ClassHide);
        };
        return AnimatedBase;
    }(ViewBase_3.default));
    exports.default = AnimatedBase;
});
define("Views/Shared/SlideupButton", ["require", "exports", "vue-class-component", "vue-property-decorator", "Libraries", "Views/Bases/AnimatedBase"], function (require, exports, vue_class_component_2, vue_property_decorator_2, Libraries_4, AnimatedBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SlideupButtonEvents = {
        Clicked: 'Clicked'
    };
    var SlideupButtom = /** @class */ (function (_super) {
        __extends(SlideupButtom, _super);
        function SlideupButtom() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.AnimationIn = AnimatedBase_1.Animation.FadeInUp;
            _this.AnimationOut = AnimatedBase_1.Animation.FadeOutDown;
            return _this;
        }
        SlideupButtom.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    _super.prototype.Initialize.call(this);
                    if (this.hideOnInit === true)
                        this.HideNow();
                    if (this.tooltip && 0 < this.tooltip.length)
                        Libraries_4.default.SetTooltip(this.$el, this.tooltip);
                    return [2 /*return*/, true];
                });
            });
        };
        SlideupButtom.prototype.OnClick = function () {
            this.$emit(exports.SlideupButtonEvents.Clicked);
        };
        __decorate([
            vue_property_decorator_2.Prop(),
            __metadata("design:type", Boolean)
        ], SlideupButtom.prototype, "hideOnInit", void 0);
        __decorate([
            vue_property_decorator_2.Prop(),
            __metadata("design:type", String)
        ], SlideupButtom.prototype, "iconClass", void 0);
        __decorate([
            vue_property_decorator_2.Prop(),
            __metadata("design:type", String)
        ], SlideupButtom.prototype, "tooltip", void 0);
        SlideupButtom = __decorate([
            vue_class_component_2.default({
                template: "<button\n    class=\"btn btn-tool\"\n    @click=\"OnClick\">\n        <i v-bind:class=\"iconClass\" />\n</button>"
            })
        ], SlideupButtom);
        return SlideupButtom;
    }(AnimatedBase_1.default));
    exports.default = SlideupButtom;
});
define("Views/Shared/Filterboxes/SearchInput", ["require", "exports", "vue-class-component", "vue-property-decorator", "Views/Bases/AnimatedBase"], function (require, exports, vue_class_component_3, vue_property_decorator_3, AnimatedBase_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SearchInputEvents = {
        Input: 'Input',
        Blur: 'Blur'
    };
    var SearchInput = /** @class */ (function (_super) {
        __extends(SearchInput, _super);
        function SearchInput() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.AnimationIn = AnimatedBase_2.Animation.FadeInUp;
            _this.AnimationOut = AnimatedBase_2.Animation.FadeOutDown;
            return _this;
        }
        SearchInput.prototype.OnInput = function () {
            this.$emit(exports.SearchInputEvents.Input);
        };
        SearchInput.prototype.OnBlur = function () {
            this.$emit(exports.SearchInputEvents.Blur);
        };
        SearchInput.prototype.Clear = function () {
            this.$el.value = '';
        };
        SearchInput.prototype.Focus = function () {
            this.$el.focus();
        };
        SearchInput.prototype.GetValue = function () {
            return this.$el.value;
        };
        __decorate([
            vue_property_decorator_3.Prop(),
            __metadata("design:type", String)
        ], SearchInput.prototype, "placeHolder", void 0);
        SearchInput = __decorate([
            vue_class_component_3.default({
                template: "<input class=\"form-control form-control-navbar form-control-sm text-filter d-none\"\n        type=\"search\"\n        maxlength=\"20\"\n        v-bind:placeholder=\"placeHolder\"\n        v-bind:aria-label=\"placeHolder\"\n        @input=\"OnInput\"\n        @blur=\"OnBlur\">\n</input>"
            })
        ], SearchInput);
        return SearchInput;
    }(AnimatedBase_2.default));
    exports.default = SearchInput;
});
define("Views/Shared/Filterboxes/Filterbox", ["require", "exports", "vue-class-component", "vue-property-decorator", "Utils/Delay", "Views/Bases/ViewBase", "Views/Shared/SlideupButton", "Views/Shared/Filterboxes/SearchInput"], function (require, exports, vue_class_component_4, vue_property_decorator_4, Delay_1, ViewBase_4, SlideupButton_1, SearchInput_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FilterboxEvents = {
        TextUpdated: 'TextUpdated',
        AnimationEnd: 'animationend'
    };
    var Filterbox = /** @class */ (function (_super) {
        __extends(Filterbox, _super);
        function Filterbox() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(Filterbox.prototype, "SearchInput", {
            get: function () {
                return this.$refs.SearchInput;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Filterbox.prototype, "SearchButton", {
            get: function () {
                return this.$refs.SearchButton;
            },
            enumerable: true,
            configurable: true
        });
        Filterbox.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    _super.prototype.Initialize.call(this);
                    this.lazyUpdater = Delay_1.default.DelayedOnce(function () {
                        _this.$emit(exports.FilterboxEvents.TextUpdated);
                    }, 800);
                    return [2 /*return*/, true];
                });
            });
        };
        Filterbox.prototype.OnClick = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.SwitchToInput()];
                });
            });
        };
        Filterbox.prototype.OnInput = function () {
            this.lazyUpdater.Exec();
        };
        Filterbox.prototype.OnBlur = function () {
            var value = this.SearchInput.GetValue();
            if (!value || value.length <= 0)
                this.SwitchToButton();
        };
        Filterbox.prototype.SwitchToInput = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.SearchButton.Hide()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.SearchInput.Show()];
                        case 2:
                            _a.sent();
                            this.SearchInput.Focus();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Filterbox.prototype.SwitchToButton = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.SearchInput.Hide()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.SearchButton.Show()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Filterbox.prototype.GetText = function () {
            return this.SearchInput.GetValue();
        };
        Filterbox.prototype.Clear = function () {
            this.SearchInput.Clear();
            this.$emit(exports.FilterboxEvents.TextUpdated);
        };
        Filterbox.prototype.GetIsVisible = function () {
            return (this.SearchButton.GetIsVisible() || this.SearchInput.GetIsVisible());
        };
        Filterbox.prototype.Show = function () {
            return __awaiter(this, void 0, void 0, function () {
                var promises;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            promises = [];
                            if (this.SearchInput.GetIsVisible())
                                this.SearchInput.HideNow();
                            if (!this.SearchButton.GetIsVisible())
                                promises.push(this.SearchButton.Show());
                            return [4 /*yield*/, Promise.all(promises)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Filterbox.prototype.Hide = function () {
            return __awaiter(this, void 0, void 0, function () {
                var promises;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            promises = [];
                            if (this.SearchButton.GetIsVisible())
                                promises.push(this.SearchButton.Hide());
                            if (this.SearchInput.GetIsVisible())
                                promises.push(this.SearchInput.Hide());
                            return [4 /*yield*/, Promise.all(promises)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        __decorate([
            vue_property_decorator_4.Prop(),
            __metadata("design:type", String)
        ], Filterbox.prototype, "placeHolder", void 0);
        Filterbox = __decorate([
            vue_class_component_4.default({
                template: "<div class=\"form-inline\">\n    <search-input\n        v-bind:placeholder=\"placeHolder\"\n        v-bind:aria-label=\"placeHolder\"\n        ref=\"SearchInput\"\n        @Input=\"OnInput\"\n        @Blur=\"OnBlur\"/>\n    <slideup-button\n        v-bind:hideOnInit=\"false\"\n        iconClass=\"fa fa-search\"\n        tooltip=\"Filter\"\n        ref=\"SearchButton\"\n        @Clicked=\"OnClick\" />\n</div>",
                components: {
                    'search-input': SearchInput_1.default,
                    'slideup-button': SlideupButton_1.default
                }
            })
        ], Filterbox);
        return Filterbox;
    }(ViewBase_4.default));
    exports.default = Filterbox;
});
define("Views/Bases/ContentDetailBase", ["require", "exports", "Views/Bases/ViewBase"], function (require, exports, ViewBase_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ContentDetailBase = /** @class */ (function (_super) {
        __extends(ContentDetailBase, _super);
        function ContentDetailBase() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ContentDetailBase.prototype.Show = function () {
            if (this.$el.classList.contains(ContentDetailBase.DisplayNone))
                this.$el.classList.remove(ContentDetailBase.DisplayNone);
        };
        ContentDetailBase.prototype.Hide = function () {
            if (!this.$el.classList.contains(ContentDetailBase.DisplayNone))
                this.$el.classList.add(ContentDetailBase.DisplayNone);
        };
        ContentDetailBase.DisplayNone = 'd-none';
        return ContentDetailBase;
    }(ViewBase_5.default));
    exports.default = ContentDetailBase;
});
define("Views/Bases/SelectionListBase", ["require", "exports", "lodash", "Libraries", "Utils/Exception", "Views/Bases/ContentDetailBase", "Views/Shared/SelectionItem"], function (require, exports, _, Libraries_5, Exception_5, ContentDetailBase_1, SelectionItem_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectionEvents = {
        ListUpdated: 'ListUpdated',
        SelectionOrdered: SelectionItem_2.SelectionItemEvents.SelectionOrdered,
        SelectionChanged: SelectionItem_2.SelectionItemEvents.SelectionChanged,
        Refreshed: 'Refreshed',
    };
    var SelectionListBase = /** @class */ (function (_super) {
        __extends(SelectionListBase, _super);
        function SelectionListBase() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.page = 1;
            _this.viewport = Libraries_5.default.ResponsiveBootstrapToolkit;
            return _this;
        }
        Object.defineProperty(SelectionListBase.prototype, "Page", {
            get: function () {
                return this.page;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionListBase.prototype, "InfiniteLoading", {
            get: function () {
                return (this.$refs.InfiniteLoading)
                    ? this.$refs.InfiniteLoading
                    : null;
            },
            enumerable: true,
            configurable: true
        });
        SelectionListBase.prototype.OnInfinite = function ($state) {
            return __awaiter(this, void 0, void 0, function () {
                var result, isUpdated, args, e_1;
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
                                args = {
                                    Entities: this.entities
                                };
                                this.$emit(exports.SelectionEvents.ListUpdated, args);
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _a.sent();
                            Exception_5.default.Throw(null, e_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/, true];
                    }
                });
            });
        };
        SelectionListBase.prototype.OnClickRefresh = function () {
            this.Refresh();
            this.$emit(exports.SelectionEvents.Refreshed);
        };
        SelectionListBase.prototype.OnSelectionOrdered = function (args) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.$emit(exports.SelectionEvents.SelectionOrdered, args);
                    return [2 /*return*/, args.Permitted];
                });
            });
        };
        SelectionListBase.prototype.OnSelectionChanged = function (args) {
            var _this = this;
            _.delay(function () {
                _this.$emit(exports.SelectionEvents.SelectionChanged, args);
            }, 300);
        };
        SelectionListBase.prototype.Refresh = function () {
            var _this = this;
            this.page = 1;
            this.entities = [];
            this.$nextTick(function () {
                _this.InfiniteLoading.stateChanger.reset();
                _this.InfiniteLoading.attemptLoad();
            });
        };
        return SelectionListBase;
    }(ContentDetailBase_1.default));
    exports.default = SelectionListBase;
});
define("Views/Events/BootstrapEvents", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ModalEvents = {
        Show: 'show.bs.modal',
        Shown: 'shown.bs.modal',
        Hide: 'hide.bs.modal',
        Hidden: 'hidden.bs.modal'
    };
    exports.TabEvents = {
        Show: 'show.bs.tab',
        Shown: 'shown.bs.tab',
        Hide: 'hide.bs.tab',
        Hidden: 'hidden.bs.tab'
    };
    exports.DropdownEvents = {
        Show: 'show.bs.dropdown',
        Shown: 'shown.bs.dropdown',
        Hide: 'hide.bs.dropdown',
        Hidden: 'hidden.bs.dropdown'
    };
});
define("Views/Finders/Lists/Albums/SelectionAlbumTracks", ["require", "exports", "vue-class-component", "vue-property-decorator", "Libraries", "Models/AlbumTracks/AlbumTracks", "Utils/Exception", "Views/Bases/ViewBase", "Views/Events/BootstrapEvents"], function (require, exports, vue_class_component_5, vue_property_decorator_5, Libraries_6, AlbumTracks_2, Exception_6, ViewBase_6, BootstrapEvents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectionAlbumTracksEvents = {
        PlayOrdered: 'PlayOrdered',
        CreatePlaylistOrdered: 'CreatePlaylistOrdered',
        AddToPlaylistOrdered: 'AddToPlaylistOrdered'
    };
    var SelectionAlbumTracks = /** @class */ (function (_super) {
        __extends(SelectionAlbumTracks, _super);
        function SelectionAlbumTracks() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            // 描画はこちらを使う。
            _this.innerPlaylists = [];
            return _this;
        }
        Object.defineProperty(SelectionAlbumTracks.prototype, "AlbumPlayButton", {
            get: function () {
                return this.$refs.AlbumPlayButton;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionAlbumTracks.prototype, "HeaderPlaylistButton", {
            get: function () {
                return this.$refs.HeaderPlaylistButton;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionAlbumTracks.prototype, "HeaderDropDownInnerDiv", {
            get: function () {
                return this.$refs.HeaderDropDownInnerDiv;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionAlbumTracks.prototype, "RowPlaylistButtons", {
            get: function () {
                return this.$refs.RowPlaylistButtons;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionAlbumTracks.prototype, "RowDropdownWrappers", {
            get: function () {
                return this.$refs.RowDropdownWrappers;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SelectionAlbumTracks.prototype, "RowDropdownInnerDiv", {
            get: function () {
                return this.$refs.RowDropdownInnerDiv;
            },
            enumerable: true,
            configurable: true
        });
        SelectionAlbumTracks.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var i, elem, i, elem;
                var _this = this;
                return __generator(this, function (_a) {
                    if (this.GetIsInitialized())
                        return [2 /*return*/];
                    _super.prototype.Initialize.call(this);
                    this.innerPlaylists = this.playlists;
                    Libraries_6.default.SetTooltip(this.AlbumPlayButton, 'Play Album');
                    Libraries_6.default.SetTooltip(this.HeaderPlaylistButton, 'To Playlist');
                    Libraries_6.default.SlimScroll(this.HeaderDropDownInnerDiv);
                    for (i = 0; i < this.RowPlaylistButtons.length; i++) {
                        elem = this.RowPlaylistButtons[i];
                        Libraries_6.default.SetTooltip(elem, 'To Playlist');
                    }
                    // SlimScrollをインスタンシエイト後にdomTreeから削除し、参照を保持しておく。
                    Libraries_6.default.SlimScroll(this.RowDropdownInnerDiv);
                    this.rowDropdownContent = this.RowDropdownInnerDiv.parentElement;
                    this.rowDropdownContent.parentElement.removeChild(this.rowDropdownContent);
                    for (i = 0; i < this.RowDropdownWrappers.length; i++) {
                        elem = this.RowDropdownWrappers[i];
                        // トラックごとのプレイリストボタン操作で、SlimScrollDivをappend/removeする。
                        Libraries_6.default.JQueryEventBinds.On(elem, BootstrapEvents_1.DropdownEvents.Show, function (ev) {
                            var wrapper = ev.currentTarget;
                            var outer = wrapper.querySelector('div.dropdown-menu');
                            outer.appendChild(_this.rowDropdownContent);
                        });
                        Libraries_6.default.JQueryEventBinds.On(elem, BootstrapEvents_1.DropdownEvents.Hide, function (ev) {
                            // 行選択イベントよりHideイベントの方が遅いため、DomTreeを辿った
                            // トラックID取得には支障が無い。
                            //console.log('hide event handled.');
                            var wrapper = ev.currentTarget;
                            var outer = wrapper.querySelector('div.dropdown-menu');
                            outer.removeChild(_this.rowDropdownContent);
                        });
                    }
                    return [2 /*return*/, true];
                });
            });
        };
        SelectionAlbumTracks.prototype.SetPlaylists = function (playlists) {
            this.innerPlaylists = playlists;
        };
        SelectionAlbumTracks.prototype.GetPlaylists = function () {
            return this.innerPlaylists;
        };
        SelectionAlbumTracks.prototype.OnHeaderPlayClicked = function () {
            var tracks = Libraries_6.default.Enumerable.from(this.entity.Tracks);
            var track = tracks
                .first(function (e) { return e.TrackNo === tracks.min(function (e2) { return e2.TrackNo; }); });
            var args = {
                Entity: this.entity,
                Track: track,
                Selected: true
            };
            this.$emit(exports.SelectionAlbumTracksEvents.PlayOrdered, args);
        };
        SelectionAlbumTracks.prototype.OnHeaderNewPlaylistClicked = function () {
            var args = {
                AlbumTracks: this.entity
            };
            this.$emit(exports.SelectionAlbumTracksEvents.CreatePlaylistOrdered, args);
        };
        SelectionAlbumTracks.prototype.OnHeaderPlaylistClicked = function (ev) {
            var uri = ev.target.getAttribute('data-uri');
            var playlist = Libraries_6.default.Enumerable.from(this.innerPlaylists)
                .firstOrDefault(function (e) { return e.Uri === uri; });
            if (!playlist)
                Exception_6.default.Throw('SelectionAlbumTrack.OnHeaderPlaylistClicked: Uri not found.', uri);
            var args = {
                Playlist: playlist,
                Tracks: this.entity.Tracks
            };
            this.$emit(exports.SelectionAlbumTracksEvents.AddToPlaylistOrdered, args);
        };
        SelectionAlbumTracks.prototype.OnRowClicked = function (args) {
            var tr = args.currentTarget.parentElement;
            var trackIdString = tr.getAttribute('data-trackid');
            if (!trackIdString || trackIdString === '')
                Exception_6.default.Throw('SelectionAlbumTrack.OnRowClicked: Track-Id not found.');
            var trackId = parseInt(trackIdString, 10);
            var tracks = Libraries_6.default.Enumerable.from(this.entity.Tracks);
            var track = tracks.firstOrDefault(function (e) { return e.Id === trackId; });
            if (!track)
                Exception_6.default.Throw('SelectionAlbumTrack.OnRowClicked: Track entity not found.');
            var orderedArgs = {
                Entity: this.entity,
                Track: track,
                Selected: true
            };
            this.$emit(exports.SelectionAlbumTracksEvents.PlayOrdered, orderedArgs);
        };
        SelectionAlbumTracks.prototype.OnRowPlaylistClicked = function (ev) {
            console.log('row playlist selected');
            var elem = ev.currentTarget;
            var uri = elem.getAttribute('data-uri');
            var playlist = Libraries_6.default.Enumerable.from(this.innerPlaylists)
                .firstOrDefault(function (e) { return e.Uri === uri; });
            if (!playlist)
                Exception_6.default.Throw('SelectionAlbumTrack.OnRowPlaylistClicked: Uri not found.', uri);
            var trackIdString = Libraries_6.default.$(elem).parents('tr.track-row').attr('data-trackid');
            if (!trackIdString || trackIdString === '')
                Exception_6.default.Throw('SelectionAlbumTrack.OnRowPlaylistClicked: Track-Id not found.');
            var trackId = parseInt(trackIdString, 10);
            var track = Libraries_6.default.Enumerable.from(this.entity.Tracks)
                .firstOrDefault(function (e) { return e.Id === trackId; });
            if (!track)
                Exception_6.default.Throw('SelectionAlbumTrack.OnRowPlaylistClicked: Track not found.', uri);
            var args = {
                Playlist: playlist,
                Tracks: [track]
            };
            this.$emit(exports.SelectionAlbumTracksEvents.AddToPlaylistOrdered, args);
        };
        __decorate([
            vue_property_decorator_5.Prop(),
            __metadata("design:type", AlbumTracks_2.default)
        ], SelectionAlbumTracks.prototype, "entity", void 0);
        __decorate([
            vue_property_decorator_5.Prop() // 初期値受け渡しのみに使用。
            ,
            __metadata("design:type", Array)
        ], SelectionAlbumTracks.prototype, "playlists", void 0);
        SelectionAlbumTracks = __decorate([
            vue_class_component_5.default({
                template: "<li class=\"nav-item albumtrack w-100\"\n                   ref=\"Li\" >\n    <div class=\"card\">\n        <div class=\"card-header with-border bg-warning\">\n            <h3 class=\"card-title text-nowrap text-truncate\">\n                {{ entity.GetArtistName() }} {{ (entity.Album.Year) ? '(' + entity.Album.Year + ')' : '' }} : {{ entity.Album.Name }}\n            </h3>\n            <div class=\"card-tools\">\n                <button type=\"button\"\n                    class=\"btn btn-tool\"\n                    ref=\"AlbumPlayButton\"\n                    @click=\"OnHeaderPlayClicked\" >\n                    <i class=\"fa fa-play\" />\n                </button>\n                <div class=\"dropdown\">\n                    <button type=\"button\"\n                        class=\"btn btn-tool dropdown-toggle\"\n                        data-toggle=\"dropdown\"\n                        data-offset=\"-160px, 0\"\n                        ref=\"HeaderPlaylistButton\">\n                        <i class=\"fa fa-bookmark\" />\n                    </button>\n                    <div class=\"dropdown-menu header-dropdown\">\n                        <div class=\"inner\" ref=\"HeaderDropDownInnerDiv\">\n                            <a class=\"dropdown-item\"\n                                href=\"javascript:void(0)\"\n                                @click=\"OnHeaderNewPlaylistClicked\">New Playlist</a>\n                            <div class=\"dropdown-divider\"></div>\n                            <template v-for=\"playlist in innerPlaylists\">\n                            <a class=\"dropdown-item text-truncate\"\n                                href=\"javascript:void(0)\"\n                                v-bind:data-uri=\"playlist.Uri\"\n                                @click=\"OnHeaderPlaylistClicked\">{{ playlist.Name }}</a>\n                            </template>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div class=\"card-body row\">\n            <div class=\"col-md-4\">\n                <img class=\"albumart\" v-bind:src=\"entity.Album.GetImageFullUri()\" />\n            </div>\n            <div class=\"col-md-8\">\n                <table class=\"table table-sm table-hover tracks\">\n                    <tbody>\n                        <template v-for=\"track in entity.Tracks\">\n                        <tr class=\"track-row\"\n                            v-bind:data-trackid=\"track.Id\">\n                            <td class=\"tracknum\"\n                                @click=\"OnRowClicked\">{{ track.TrackNo }}</td>\n                            <td class=\"trackname text-truncate\"\n                                @click=\"OnRowClicked\">{{ track.Name }}</td>\n                            <td class=\"tracklength\"\n                                @click=\"OnRowClicked\">{{ track.GetTimeString() }}</td>\n                            <td class=\"trackoperation\">\n                                <div class=\"dropdown\"\n                                    ref=\"RowDropdownWrappers\">\n                                    <button type=\"button\"\n                                        class=\"btn btn-tool dropdown-toggle\"\n                                        data-toggle=\"dropdown\"\n                                        data-offset=\"-160px, 0\"\n                                        ref=\"RowPlaylistButtons\">\n                                        <i class=\"fa fa-bookmark\" />\n                                    </button>\n                                    <div class=\"dropdown-menu row-dropdown\">\n                                    </div>\n                                </div>\n                            </td>\n                        </tr>\n                        </template>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n    </div>\n    <div class=\"d-none\">\n        <div class=\"inner\" ref=\"RowDropdownInnerDiv\">\n            <template v-for=\"playlist in innerPlaylists\">\n            <a class=\"dropdown-item text-truncate\"\n                href=\"javascript:void(0)\"\n                v-bind:data-uri=\"playlist.Uri\"\n                @click=\"OnRowPlaylistClicked\">{{ playlist.Name }}</a>\n            </template>\n        </div>\n    </div>\n</li>"
            })
        ], SelectionAlbumTracks);
        return SelectionAlbumTracks;
    }(ViewBase_6.default));
    exports.default = SelectionAlbumTracks;
});
define("Views/Finders/Lists/Albums/AlbumList", ["require", "exports", "lodash", "vue-class-component", "vue-infinite-loading", "Libraries", "Models/AlbumTracks/AlbumTracksStore", "Models/Playlists/PlaylistStore", "Utils/Delay", "Utils/Exception", "Views/Shared/Filterboxes/Filterbox", "Views/Bases/SelectionListBase", "Views/Finders/Lists/Albums/SelectionAlbumTracks", "Utils/Dump"], function (require, exports, _, vue_class_component_6, vue_infinite_loading_1, Libraries_7, AlbumTracksStore_1, PlaylistStore_1, Delay_2, Exception_7, Filterbox_1, SelectionListBase_1, SelectionAlbumTracks_1, Dump_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AlbumListEvents = {
        PlaylistUpdated: 'PlaylistUpdated'
    };
    var AlbumList = /** @class */ (function (_super) {
        __extends(AlbumList, _super);
        function AlbumList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.tabId = 'subtab-albumtracks';
            _this.linkId = 'nav-albumtracks';
            _this.store = new AlbumTracksStore_1.default();
            _this.entities = [];
            _this.isEntitiesRefreshed = false;
            _this.genreIds = [];
            _this.artistIds = [];
            _this.playlists = [];
            return _this;
            // #endregion
        }
        Object.defineProperty(AlbumList.prototype, "Filterbox", {
            get: function () {
                return this.$refs.Filterbox;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AlbumList.prototype, "Items", {
            get: function () {
                return this.$refs.Items;
            },
            enumerable: true,
            configurable: true
        });
        AlbumList.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            Dump_5.default.Log('Finder.AlbumList.Initialize: Start.');
                            _super.prototype.Initialize.call(this);
                            // ※$onの中ではプロパティ定義が参照出来ないらしい。
                            // ※ハンドラメソッドをthisバインドしてもダメだった。
                            // ※やむなく、$refsを直接キャストする。
                            this.$on(SelectionListBase_1.SelectionEvents.ListUpdated, function () { return __awaiter(_this, void 0, void 0, function () {
                                var items, i, item;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, Delay_2.default.Wait(500)];
                                        case 1:
                                            _a.sent();
                                            items = this.$refs.Items;
                                            for (i = 0; i < items.length; i++) {
                                                item = items[i];
                                                if (!item.GetIsInitialized())
                                                    item.Initialize();
                                                if (item.GetPlaylists() !== this.playlists)
                                                    item.SetPlaylists(this.playlists);
                                            }
                                            return [2 /*return*/, true];
                                    }
                                });
                            }); });
                            return [4 /*yield*/, this.InitPlaylistList()];
                        case 1:
                            _a.sent();
                            Dump_5.default.Log('Finder.AlbumList.Initialize: End.');
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        /**
         * 非表示時にInfiniteLoadingが反応しない現象への対策。
         */
        AlbumList.prototype.LoadIfEmpty = function () {
            if (!this.entities || this.entities.length <= 0)
                this.Refresh();
        };
        AlbumList.prototype.ForceRefresh = function () {
            this.genreIds = [];
            this.artistIds = [];
            this.entities = [];
            this.Refresh();
        };
        AlbumList.prototype.InitPlaylistList = function () {
            return __awaiter(this, void 0, void 0, function () {
                var store, _a, i;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            store = new PlaylistStore_1.default();
                            _a = this;
                            return [4 /*yield*/, store.GetPlaylists()];
                        case 1:
                            _a.playlists = _b.sent();
                            if (!this.Items)
                                return [2 /*return*/, true];
                            for (i = 0; i < this.Items.length; i++)
                                this.Items[i].SetPlaylists(this.playlists);
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        AlbumList.prototype.OnPlayOrdered = function (args) {
            return __awaiter(this, void 0, void 0, function () {
                var albumTracks, track, isAllTracksRegistered, result, resultAtls, updatedTracks_1;
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
                            if (!albumTracks)
                                Exception_7.default.Throw('AlbumTracks Not Found', args);
                            track = args.Track;
                            if (!track)
                                Exception_7.default.Throw('Track Not Found', args);
                            isAllTracksRegistered = Libraries_7.default.Enumerable.from(albumTracks.Tracks)
                                .all(function (e) { return e.TlId !== null; });
                            if (!isAllTracksRegistered) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.store.PlayAlbumByTlId(track.TlId)];
                        case 3:
                            result = _a.sent();
                            (result)
                                ? Libraries_7.default.ShowToast.Success("Track [ " + track.Name + " ] Started!")
                                : Libraries_7.default.ShowToast.Error('Track Play Order Failed...');
                            return [2 /*return*/, result];
                        case 4: return [4 /*yield*/, this.store.PlayAlbumByTrack(track)];
                        case 5:
                            resultAtls = _a.sent();
                            if (!resultAtls) {
                                Libraries_7.default.ShowToast.Error('Track Play Order Failed...');
                                return [2 /*return*/, false];
                            }
                            updatedTracks_1 = Libraries_7.default.Enumerable.from(resultAtls.Tracks);
                            _.each(albumTracks.Tracks, function (track) {
                                track.TlId = updatedTracks_1.firstOrDefault(function (e) { return e.Id == track.Id; }).TlId;
                            });
                            Libraries_7.default.ShowToast.Success("Track [ " + track.Name + " ] Started!");
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        AlbumList.prototype.OnCreatePlaylistOrdered = function (args) {
            return __awaiter(this, void 0, void 0, function () {
                var store, newPlaylist;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            store = new PlaylistStore_1.default();
                            return [4 /*yield*/, store.AddPlaylistByAlbumTracks(args.AlbumTracks)];
                        case 1:
                            newPlaylist = _a.sent();
                            if (!newPlaylist) {
                                Libraries_7.default.ShowToast.Error('Playlist Create Failed...');
                                return [2 /*return*/, false];
                            }
                            this.$emit(exports.AlbumListEvents.PlaylistUpdated);
                            this.InitPlaylistList();
                            Libraries_7.default.ShowToast.Success("New Playlist [ " + newPlaylist.Name + " ] Created!");
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        AlbumList.prototype.OnAddToPlaylistOrdered = function (args) {
            return __awaiter(this, void 0, void 0, function () {
                var store, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            store = new PlaylistStore_1.default();
                            return [4 /*yield*/, store.AppendTracks(args.Playlist, args.Tracks)];
                        case 1:
                            result = _a.sent();
                            if (result === true) {
                                this.$emit(exports.AlbumListEvents.PlaylistUpdated);
                                this.InitPlaylistList();
                                Libraries_7.default.ShowToast.Success("Add " + args.Tracks.length + " Track(s) to [ " + args.Playlist.Name + " ]");
                            }
                            else {
                                Libraries_7.default.ShowToast.Error('Playlist Update Failed...');
                            }
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        AlbumList.prototype.Refresh = function () {
            _super.prototype.Refresh.call(this);
            this.isEntitiesRefreshed = true;
        };
        // #region "InfiniteLoading"
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
        AlbumList.prototype.GetPagenatedList = function () {
            return __awaiter(this, void 0, void 0, function () {
                var args;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            args = {
                                GenreIds: this.genreIds,
                                ArtistIds: this.artistIds,
                                FilterText: this.Filterbox.GetText(),
                                Page: this.Page
                            };
                            return [4 /*yield*/, this.store.GetList(args)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        // #endregion
        // #region "Filters"
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
            vue_class_component_6.default({
                template: "<div class=\"col-md-6\">\n    <div class=\"card\">\n        <div class=\"card-header with-border bg-warning\">\n            <h3 class=\"card-title\">\n                <i class=\"fa fa-music\" />\n                Album Tracks\n            </h3>\n            <div class=\"card-tools form-row\">\n                <filter-textbox\n                    v-bind:placeHolder=\"'Album?'\"\n                    ref=\"Filterbox\"\n                    @TextUpdated=\"Refresh()\"/>\n            </div>\n        </div>\n        <div class=\"card-body listbox\">\n            <div class=\"outer-scrollbox\">\n                <div class=\"inner-scrollbox album-list\">\n                    <ul class=\"nav nav-pills h-100 d-flex flex-column flex-nowrap\">\n                        <template v-for=\"entity in entities\">\n                            <selection-album-tracks\n                                v-bind:playlists=\"playlists\"\n                                ref=\"Items\"\n                                v-bind:entity=\"entity\"\n                                @PlayOrdered=\"OnPlayOrdered\"\n                                @CreatePlaylistOrdered=\"OnCreatePlaylistOrdered\"\n                                @AddToPlaylistOrdered=\"OnAddToPlaylistOrdered\" />\n                        </template>\n                        <infinite-loading\n                            @infinite=\"OnInfinite\"\n                            force-use-infinite-wrapper=\".inner-scrollbox.album-list\"\n                            ref=\"InfiniteLoading\" />\n                    </ul>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>",
                components: {
                    'filter-textbox': Filterbox_1.default,
                    'selection-album-tracks': SelectionAlbumTracks_1.default,
                    'infinite-loading': vue_infinite_loading_1.default
                }
            })
        ], AlbumList);
        return AlbumList;
    }(SelectionListBase_1.default));
    exports.default = AlbumList;
});
define("Models/Artists/ArtistStore", ["require", "exports", "Models/Bases/StoreBase", "Models/Artists/Artist", "Utils/Exception"], function (require, exports, StoreBase_2, Artist_3, Exception_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArtistStore = /** @class */ (function (_super) {
        __extends(ArtistStore, _super);
        function ArtistStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ArtistStore.prototype.Exists = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryGet('Artist/Exists')];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded)
                                Exception_8.default.Throw('Unexpected Error on ApiQuery', response.Errors);
                            return [2 /*return*/, response.Result];
                    }
                });
            });
        };
        ArtistStore.prototype.GetList = function (args) {
            return __awaiter(this, void 0, void 0, function () {
                var response, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryGet('Artist/GetPagenatedList', args)];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded)
                                Exception_8.default.Throw('Unexpected Error on ApiQuery', response.Errors);
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
define("Views/Finders/Lists/ArtistList", ["require", "exports", "lodash", "vue-class-component", "vue-infinite-loading", "Libraries", "Models/Artists/ArtistStore", "Views/Bases/SelectionListBase", "Views/Shared/Filterboxes/Filterbox", "Views/Shared/SelectionItem"], function (require, exports, _, vue_class_component_7, vue_infinite_loading_2, Libraries_8, ArtistStore_1, SelectionListBase_2, Filterbox_2, SelectionItem_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ArtistList = /** @class */ (function (_super) {
        __extends(ArtistList, _super);
        function ArtistList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.tabId = 'subtab-artists';
            _this.linkId = 'nav-artists';
            _this.store = new ArtistStore_1.default();
            _this.entities = [];
            _this.genreIds = [];
            return _this;
            // #endregion
        }
        Object.defineProperty(ArtistList.prototype, "Filterbox", {
            get: function () {
                return this.$refs.Filterbox;
            },
            enumerable: true,
            configurable: true
        });
        ArtistList.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    _super.prototype.Initialize.call(this);
                    Libraries_8.default.SetTooltip(this.$refs.RefreshButton, 'Refresh');
                    Libraries_8.default.SetTooltip(this.$refs.ButtonCollaplse, 'Shrink/Expand');
                    return [2 /*return*/, true];
                });
            });
        };
        /**
         * 非表示時にInfiniteLoadingが反応しない現象への対策。
         */
        ArtistList.prototype.LoadIfEmpty = function () {
            if (!this.entities || this.entities.length <= 0)
                this.Refresh();
        };
        ArtistList.prototype.ForceRefresh = function () {
            this.genreIds = [];
            this.entities = [];
            this.Refresh();
        };
        // #region "InfiniteLoading"
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
        ArtistList.prototype.OnClickRefresh = function () {
            _super.prototype.OnClickRefresh.call(this);
        };
        ArtistList.prototype.OnSelectionChanged = function (args) {
            _super.prototype.OnSelectionChanged.call(this, args);
        };
        ArtistList.prototype.GetPagenatedList = function () {
            return __awaiter(this, void 0, void 0, function () {
                var args;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            args = {
                                GenreIds: this.genreIds,
                                FilterText: this.Filterbox.GetText(),
                                Page: this.Page
                            };
                            return [4 /*yield*/, this.store.GetList(args)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        // #endregion
        // #region "Filters"
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
                template: "<div class=\"col-md-3\">\n    <div class=\"card plain-list\">\n        <div class=\"card-header with-border bg-warning\">\n            <h3 class=\"card-title\">\n                <i class=\"fa fa-users\" />\n                Artists\n            </h3>\n            <div class=\"card-tools form-row\">\n                <filter-textbox\n                    v-bind:placeHolder=\"'Artist?'\"\n                    ref=\"Filterbox\"\n                    @TextUpdated=\"Refresh()\"/>\n                </button>\n                <button type=\"button\"\n                    class=\"btn btn-tool\"\n                    ref=\"RefreshButton\"\n                    @click=\"OnClickRefresh\" >\n                    <i class=\"fa fa-repeat\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"card-body listbox\">\n            <div class=\"outer-scrollbox\">\n                <div class=\"inner-scrollbox artist-list\"\n                    ref=\"CardInnerBody\">\n                    <ul class=\"nav nav-pills h-100 d-flex flex-column flex-nowrap\">\n                        <template v-for=\"entity in entities\">\n                        <selection-item\n                            ref=\"Items\"\n                            v-bind:entity=\"entity\"\n                            @SelectionChanged=\"OnSelectionChanged\" />\n                        </template>\n                        <infinite-loading\n                            @infinite=\"OnInfinite\"\n                            force-use-infinite-wrapper=\".inner-scrollbox.artist-list\"\n                            ref=\"InfiniteLoading\" />\n                    </ul>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>",
                components: {
                    'filter-textbox': Filterbox_2.default,
                    'selection-item': SelectionItem_3.default,
                    'infinite-loading': vue_infinite_loading_2.default
                }
            })
        ], ArtistList);
        return ArtistList;
    }(SelectionListBase_2.default));
    exports.default = ArtistList;
});
define("Models/Genres/GenreStore", ["require", "exports", "Models/Bases/StoreBase", "Models/Genres/Genre", "Utils/Exception"], function (require, exports, StoreBase_3, Genre_1, Exception_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenreStore = /** @class */ (function (_super) {
        __extends(GenreStore, _super);
        function GenreStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GenreStore.prototype.Exists = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryGet('Genre/Exists')];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded)
                                Exception_9.default.Throw('Unexpected Error on ApiQuery', response.Errors);
                            return [2 /*return*/, response.Result];
                    }
                });
            });
        };
        GenreStore.prototype.GetList = function (args) {
            return __awaiter(this, void 0, void 0, function () {
                var response, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryGet('Genre/GetPagenatedList', args)];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded)
                                Exception_9.default.Throw('Unexpected Error on ApiQuery', response.Errors);
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
define("Views/Finders/Lists/GenreList", ["require", "exports", "vue-class-component", "vue-infinite-loading", "Libraries", "Models/Genres/GenreStore", "Views/Bases/SelectionListBase", "Views/Shared/Filterboxes/Filterbox", "Views/Shared/SelectionItem"], function (require, exports, vue_class_component_8, vue_infinite_loading_3, Libraries_9, GenreStore_1, SelectionListBase_3, Filterbox_3, SelectionItem_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GenreList = /** @class */ (function (_super) {
        __extends(GenreList, _super);
        function GenreList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.tabId = 'subtab-genres';
            _this.linkId = 'nav-genres';
            _this.store = new GenreStore_1.default();
            _this.entities = [];
            return _this;
            // #endregion
        }
        Object.defineProperty(GenreList.prototype, "Filterbox", {
            get: function () {
                return this.$refs.Filterbox;
            },
            enumerable: true,
            configurable: true
        });
        GenreList.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    _super.prototype.Initialize.call(this);
                    //// 利便性的にどうなのか、悩む。
                    //Libraries.SlimScroll(this.CardInnerBody, {
                    //    height: 'calc(100vh - 200px)',
                    //    wheelStep: 60
                    //});
                    Libraries_9.default.SetTooltip(this.$refs.RefreshButton, 'Refresh');
                    Libraries_9.default.SetTooltip(this.$refs.ButtonCollaplse, 'Shrink/Expand');
                    return [2 /*return*/, true];
                });
            });
        };
        /**
         * 非表示時にInfiniteLoadingが反応しない現象への対策。
         */
        GenreList.prototype.LoadIfEmpty = function () {
            if (!this.entities || this.entities.length <= 0)
                this.Refresh();
        };
        GenreList.prototype.ForceRefresh = function () {
            this.entities = [];
            this.Refresh();
        };
        // #region "InfiniteLoading"
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
        GenreList.prototype.OnClickRefresh = function () {
            _super.prototype.OnClickRefresh.call(this);
        };
        GenreList.prototype.OnSelectionChanged = function (args) {
            _super.prototype.OnSelectionChanged.call(this, args);
        };
        GenreList.prototype.GetPagenatedList = function () {
            return __awaiter(this, void 0, void 0, function () {
                var args;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            args = {
                                FilterText: this.Filterbox.GetText(),
                                Page: this.Page
                            };
                            return [4 /*yield*/, this.store.GetList(args)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        GenreList = __decorate([
            vue_class_component_8.default({
                template: "<div class=\"col-md-3\">\n    <div class=\"card plain-list\">\n        <div class=\"card-header with-border bg-warning\">\n            <h3 class=\"card-title\">\n                <i class=\"fa fa-tags\" />\n                Genres\n            </h3>\n            <div class=\"card-tools form-row\">\n                <filter-textbox\n                    v-bind:placeHolder=\"'Genre?'\"\n                    ref=\"Filterbox\"\n                    @TextUpdated=\"Refresh()\"/>\n                <button type=\"button\"\n                    class=\"btn btn-tool\"\n                    ref=\"RefreshButton\"\n                    @click=\"OnClickRefresh\" >\n                    <i class=\"fa fa-repeat\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"card-body listbox\">\n            <div class=\"outer-scrollbox\">\n                <div class=\"inner-scrollbox genre-list\">\n                    <ul class=\"nav nav-pills h-100 d-flex flex-column flex-nowrap\">\n                        <template v-for=\"entity in entities\">\n                            <selection-item\n                                ref=\"Items\"\n                                v-bind:entity=\"entity\"\n                                @SelectionChanged=\"OnSelectionChanged\" />\n                        </template>\n                        <infinite-loading\n                            @infinite=\"OnInfinite\"\n                            force-use-infinite-wrapper=\".inner-scrollbox.genre-list\"\n                            ref=\"InfiniteLoading\" />\n                    </ul>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>",
                components: {
                    'filter-textbox': Filterbox_3.default,
                    'selection-item': SelectionItem_4.default,
                    'infinite-loading': vue_infinite_loading_3.default
                }
            })
        ], GenreList);
        return GenreList;
    }(SelectionListBase_3.default));
    exports.default = GenreList;
});
define("Views/Finders/Finder", ["require", "exports", "vue-class-component", "Utils/Delay", "Utils/Exception", "Views/Bases/IContentDetail", "Views/Bases/ContentBase", "Views/Finders/Lists/Albums/AlbumList", "Views/Finders/Lists/ArtistList", "Views/Finders/Lists/GenreList", "Utils/Dump", "lodash"], function (require, exports, vue_class_component_9, Delay_3, Exception_10, IContentDetail_1, ContentBase_1, AlbumList_1, ArtistList_1, GenreList_1, Dump_6, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FinderEvents = _.extend({}, AlbumList_1.AlbumListEvents);
    var Finder = /** @class */ (function (_super) {
        __extends(Finder, _super);
        function Finder() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            // #region "IContentView"
            _this.details = [];
            return _this;
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
        Finder.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    Dump_6.default.Log('Finder.Initialize: Start.');
                    _super.prototype.Initialize.call(this);
                    this.details.push(this.GenreList);
                    this.details.push(this.ArtistList);
                    this.details.push(this.AlbumList);
                    Dump_6.default.Log('Finder.Initialize: End.');
                    return [2 /*return*/, true];
                });
            });
        };
        Finder.prototype.GetIsPermitLeave = function () {
            return true;
        };
        Finder.prototype.InitContent = function () {
            var _this = this;
            this.AlbumList.InitPlaylistList();
            Delay_3.default.Wait(800)
                .then(function () {
                _this.GenreList.LoadIfEmpty();
                _this.ArtistList.LoadIfEmpty();
                _this.AlbumList.LoadIfEmpty();
            });
        };
        Finder.prototype.ShowContentDetail = function (args) {
            switch (args.Detail) {
                case IContentDetail_1.ContentDetails.Genres:
                    this.HideAllDetails();
                    this.GenreList.Show();
                    this.GenreList.LoadIfEmpty();
                    break;
                case IContentDetail_1.ContentDetails.Artists:
                    this.HideAllDetails();
                    this.ArtistList.Show();
                    this.ArtistList.LoadIfEmpty();
                    break;
                case IContentDetail_1.ContentDetails.AlbumTracks:
                    this.HideAllDetails();
                    this.AlbumList.Show();
                    this.AlbumList.LoadIfEmpty();
                    break;
                default:
                    Exception_10.default.Throw('Unexpected ContentDetail');
            }
        };
        // #endregion
        Finder.prototype.OnPlaylistUpdated = function () {
            this.$emit(exports.FinderEvents.PlaylistUpdated);
        };
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
        Finder.prototype.ForceRefresh = function () {
            this.GenreList.ForceRefresh();
            this.ArtistList.ForceRefresh();
            this.AlbumList.ForceRefresh();
        };
        Finder.prototype.RefreshPlaylist = function () {
            this.AlbumList.InitPlaylistList();
        };
        Finder = __decorate([
            vue_class_component_9.default({
                template: "<section class=\"content h-100 tab-pane fade\"\n                        id=\"tab-finder\"\n                        role=\"tabpanel\"\n                        aria-labelledby=\"nav-finder\">\n    <div class=\"row\">\n        <genre-list\n            ref=\"GenreList\"\n            @SelectionChanged=\"OnGenreSelectionChanged\"\n            @Refreshed=\"OnGenreRefreshed\" />\n        <artist-list\n            ref=\"ArtistList\"\n            @SelectionChanged=\"OnArtistSelectionChanged\"\n            @Refreshed=\"OnArtistRefreshed\" />\n        <album-list\n            ref=\"AlbumList\"\n            @PlaylistUpdated=\"OnPlaylistUpdated\"/>\n    </div>\n</section>",
                components: {
                    'genre-list': GenreList_1.default,
                    'artist-list': ArtistList_1.default,
                    'album-list': AlbumList_1.default
                }
            })
        ], Finder);
        return Finder;
    }(ContentBase_1.default));
    exports.default = Finder;
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
    exports.PushMenuEvents = {
        Collapsed: 'collapsed.lte.pushmenu',
        Shown: 'shown.lte.pushmenu'
    };
});
define("Views/HeaderBars/HeaderBar", ["require", "exports", "vue-class-component", "Views/Bases/ViewBase", "Views/Bases/IContent", "Utils/Exception", "Libraries", "Views/Bases/IContentDetail", "Views/Events/AdminLteEvents"], function (require, exports, vue_class_component_10, ViewBase_7, IContent_1, Exception_11, Libraries_10, IContentDetail_2, AdminLteEvents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HeaderBarEvents = {
        DetailOrdered: 'DetailOrdered',
        SideBarShown: 'SideBarShown',
        SideBarCollapsed: 'SideBarCollapsed'
    };
    var HeaderBar = /** @class */ (function (_super) {
        __extends(HeaderBar, _super);
        function HeaderBar() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.title = 'Mopidy.Finder';
            _this.currentContent = null;
            _this.displayNone = 'd-none';
            _this.active = 'active';
            _this.allButtons = [];
            _this.finderButtons = [];
            _this.playlistsButtons = [];
            _this.settingsButtons = [];
            return _this;
        }
        Object.defineProperty(HeaderBar.prototype, "MainMenuButton", {
            get: function () {
                return this.$refs.MainMenuButton;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderBar.prototype, "MenuGenres", {
            get: function () {
                return this.$refs.MenuGenres;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderBar.prototype, "MenuArtists", {
            get: function () {
                return this.$refs.MenuArtists;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderBar.prototype, "MenuAlbumTracks", {
            get: function () {
                return this.$refs.MenuAlbumTracks;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderBar.prototype, "MenuPlaylists", {
            get: function () {
                return this.$refs.MenuPlaylists;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderBar.prototype, "MenuPlaylistTracks", {
            get: function () {
                return this.$refs.MenuPlaylistTracks;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderBar.prototype, "MenuMopidy", {
            get: function () {
                return this.$refs.MenuMopidy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderBar.prototype, "MenuDb", {
            get: function () {
                return this.$refs.MenuDb;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(HeaderBar.prototype, "MenuScanProgress", {
            get: function () {
                return this.$refs.MenuScanProgress;
            },
            enumerable: true,
            configurable: true
        });
        HeaderBar.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    _super.prototype.Initialize.call(this);
                    this.allButtons.push(this.MenuGenres);
                    this.allButtons.push(this.MenuArtists);
                    this.allButtons.push(this.MenuAlbumTracks);
                    this.allButtons.push(this.MenuPlaylists);
                    this.allButtons.push(this.MenuPlaylistTracks);
                    this.allButtons.push(this.MenuMopidy);
                    this.allButtons.push(this.MenuDb);
                    this.allButtons.push(this.MenuScanProgress);
                    this.finderButtons.push(this.MenuGenres);
                    this.finderButtons.push(this.MenuArtists);
                    this.finderButtons.push(this.MenuAlbumTracks);
                    this.playlistsButtons.push(this.MenuPlaylists);
                    this.playlistsButtons.push(this.MenuPlaylistTracks);
                    this.settingsButtons.push(this.MenuMopidy);
                    this.settingsButtons.push(this.MenuDb);
                    this.settingsButtons.push(this.MenuScanProgress);
                    Libraries_10.default.SetTooltip(this.MenuGenres, 'Genres');
                    Libraries_10.default.SetTooltip(this.MenuArtists, 'Artists');
                    Libraries_10.default.SetTooltip(this.MenuAlbumTracks, 'Album Tracks');
                    Libraries_10.default.SetTooltip(this.MenuPlaylists, 'Playlists');
                    Libraries_10.default.SetTooltip(this.MenuPlaylistTracks, 'Playlist Tracks');
                    Libraries_10.default.SetTooltip(this.MenuMopidy, 'Set Mopidy');
                    Libraries_10.default.SetTooltip(this.MenuDb, 'Database');
                    Libraries_10.default.SetTooltip(this.MenuScanProgress, 'Scan Progress');
                    this.AllButtonToHide();
                    this.jqMainManuButton = Libraries_10.default.$(this.MainMenuButton);
                    this.mainMenuButton = new Libraries_10.default.AdminLte.PushMenu(this.jqMainManuButton);
                    this.jqMainManuButton.on(AdminLteEvents_1.PushMenuEvents.Shown, function () {
                        _this.$emit(exports.HeaderBarEvents.SideBarShown);
                    });
                    this.jqMainManuButton.on(AdminLteEvents_1.PushMenuEvents.Collapsed, function () {
                        _this.$emit(exports.HeaderBarEvents.SideBarCollapsed);
                    });
                    return [2 /*return*/, true];
                });
            });
        };
        HeaderBar.prototype.AllButtonToHide = function () {
            for (var i = 0; i < this.allButtons.length; i++)
                if (!this.allButtons[i].classList.contains(this.displayNone))
                    this.allButtons[i].classList.add(this.displayNone);
        };
        HeaderBar.prototype.SetButtonActive = function (activeButton, buttonGroup) {
            for (var i = 0; i < buttonGroup.length; i++) {
                var btn = buttonGroup[i];
                if (activeButton === btn)
                    continue;
                var link = btn.children.item(0);
                if (link.classList.contains(this.active))
                    link.classList.remove(this.active);
            }
            var activeLink = activeButton.children.item(0);
            if (!activeLink.classList.contains(this.active))
                activeLink.classList.add(this.active);
        };
        HeaderBar.prototype.SetHeader = function (args) {
            this.currentContent = args.Content;
            this.title = args.Content.toString();
            this.AllButtonToHide();
            switch (this.currentContent) {
                case IContent_1.Contents.Finder:
                    this.MenuGenres.classList.remove(this.displayNone);
                    this.MenuArtists.classList.remove(this.displayNone);
                    this.MenuAlbumTracks.classList.remove(this.displayNone);
                    break;
                case IContent_1.Contents.Playlists:
                    this.MenuPlaylists.classList.remove(this.displayNone);
                    this.MenuPlaylistTracks.classList.remove(this.displayNone);
                    break;
                case IContent_1.Contents.Settings:
                    this.MenuMopidy.classList.remove(this.displayNone);
                    this.MenuDb.classList.remove(this.displayNone);
                    this.MenuScanProgress.classList.remove(this.displayNone);
                    break;
                default:
                    Exception_11.default.Throw('Unexpected Page.', args);
            }
        };
        HeaderBar.prototype.OnGenresClicked = function () {
            var args = {
                Content: IContent_1.Contents.Finder,
                Detail: IContentDetail_2.ContentDetails.Genres
            };
            this.$emit(exports.HeaderBarEvents.DetailOrdered, args);
            this.SetButtonActive(this.MenuGenres, this.finderButtons);
        };
        HeaderBar.prototype.OnArtistsClicked = function () {
            var args = {
                Content: IContent_1.Contents.Finder,
                Detail: IContentDetail_2.ContentDetails.Artists
            };
            this.$emit(exports.HeaderBarEvents.DetailOrdered, args);
            this.SetButtonActive(this.MenuArtists, this.finderButtons);
        };
        HeaderBar.prototype.OnAlbumTracksClicked = function () {
            var args = {
                Content: IContent_1.Contents.Finder,
                Detail: IContentDetail_2.ContentDetails.AlbumTracks
            };
            this.$emit(exports.HeaderBarEvents.DetailOrdered, args);
            this.SetButtonActive(this.MenuAlbumTracks, this.finderButtons);
        };
        HeaderBar.prototype.OnPlaylistsClicked = function () {
            var args = {
                Content: IContent_1.Contents.Playlists,
                Detail: IContentDetail_2.ContentDetails.Playlists
            };
            this.$emit(exports.HeaderBarEvents.DetailOrdered, args);
            this.SetButtonActive(this.MenuPlaylists, this.playlistsButtons);
        };
        HeaderBar.prototype.OnPlaylistTracksClicked = function () {
            var args = {
                Content: IContent_1.Contents.Playlists,
                Detail: IContentDetail_2.ContentDetails.PlaylistTracks
            };
            this.$emit(exports.HeaderBarEvents.DetailOrdered, args);
            this.SetButtonActive(this.MenuPlaylistTracks, this.playlistsButtons);
        };
        HeaderBar.prototype.OnMopidyClicked = function () {
            var args = {
                Content: IContent_1.Contents.Settings,
                Detail: IContentDetail_2.ContentDetails.SetMopidy
            };
            this.$emit(exports.HeaderBarEvents.DetailOrdered, args);
            this.SetButtonActive(this.MenuMopidy, this.settingsButtons);
        };
        HeaderBar.prototype.OnDbClicked = function () {
            var args = {
                Content: IContent_1.Contents.Settings,
                Detail: IContentDetail_2.ContentDetails.Database
            };
            this.$emit(exports.HeaderBarEvents.DetailOrdered, args);
            this.SetButtonActive(this.MenuDb, this.settingsButtons);
        };
        HeaderBar.prototype.OnScanProgressClicked = function () {
            var args = {
                Content: IContent_1.Contents.Settings,
                Detail: IContentDetail_2.ContentDetails.ScanProgress
            };
            this.$emit(exports.HeaderBarEvents.DetailOrdered, args);
            this.SetButtonActive(this.MenuScanProgress, this.settingsButtons);
        };
        HeaderBar.prototype.GetIsSideBarVisible = function () {
            return this.mainMenuButton.isShown();
        };
        HeaderBar.prototype.SetSideBarOpen = function () {
            if (!this.mainMenuButton.isShown())
                this.mainMenuButton.show();
        };
        HeaderBar.prototype.SetSideBarClose = function () {
            if (this.mainMenuButton.isShown())
                this.mainMenuButton.collapse();
        };
        HeaderBar = __decorate([
            vue_class_component_10.default({
                template: "<nav class=\"main-header navbar navbar-expand border-bottom\">\n    <ul class=\"navbar-nav\">\n        <li class=\"nav-item\">\n            <a class=\"nav-link\"\n                data-widget=\"pushmenu\"\n                href=\"javascript:void(0)\"\n                ref=\"MainMenuButton\" >\n                <i class=\"fa fa-bars\" />\n            </a>\n        </li>\n        <li class=\"nav-item\">\n            <h3>{{ title }}</h3>\n        </li>\n    </ul>\n    <ul class=\"navbar-nav ml-auto nav-pills\">\n        <li class=\"nav-item d-md-none\"\n            ref=\"MenuGenres\">\n            <a class=\"nav-link active\"\n                @click=\"OnGenresClicked\" >\n                <i class=\"fa fa-tags\" />\n            </a>\n        </li>\n        <li class=\"nav-item d-md-none\"\n            ref=\"MenuArtists\">\n            <a class=\"nav-link\"\n                @click=\"OnArtistsClicked\" >\n                <i class=\"fa fa-users\" />\n            </a>\n        </li>\n        <li class=\"nav-item d-md-none\"\n            ref=\"MenuAlbumTracks\">\n            <a class=\"nav-link\"\n                @click=\"OnAlbumTracksClicked\" >\n                <i class=\"fa fa-music\" />\n            </a>\n        </li>\n        <li class=\"nav-item d-md-none\"\n            ref=\"MenuPlaylists\">\n            <a class=\"nav-link active\"\n                @click=\"OnPlaylistsClicked\" >\n                <i class=\"fa fa-list-ul\" />\n            </a>\n        </li>\n        <li class=\"nav-item d-md-none\"\n            ref=\"MenuPlaylistTracks\">\n            <a class=\"nav-link\"\n                @click=\"OnPlaylistTracksClicked\" >\n                <i class=\"fa fa-music\" />\n            </a>\n        </li>\n\n        <li class=\"nav-item d-md-none\"\n            ref=\"MenuMopidy\">\n            <a class=\"nav-link active\"\n                @click=\"OnMopidyClicked\" >\n                <i class=\"fa fa-wifi\" />\n            </a>\n        </li>\n        <li class=\"nav-item d-md-none\"\n            ref=\"MenuDb\">\n            <a class=\"nav-link\"\n                @click=\"OnDbClicked\" >\n                <i class=\"fa fa-database\" />\n            </a>\n        </li>\n        <li class=\"nav-item d-md-none\"\n            ref=\"MenuScanProgress\">\n            <a class=\"nav-link\"\n                @click=\"OnScanProgressClicked\" >\n                <i class=\"fa fa-rocket\" />\n            </a>\n        </li>\n    </ul>\n</nav>"
            })
        ], HeaderBar);
        return HeaderBar;
    }(ViewBase_7.default));
    exports.default = HeaderBar;
});
define("Views/Playlists/Lists/Playlists/AddModal", ["require", "exports", "vue-class-component", "Libraries", "Models/Playlists/Playlist", "Views/Bases/ViewBase", "Views/Events/BootstrapEvents"], function (require, exports, vue_class_component_11, Libraries_11, Playlist_2, ViewBase_8, BootstrapEvents_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AddModalEvents = {
        AddOrdered: 'AddOrdered'
    };
    var AddModal = /** @class */ (function (_super) {
        __extends(AddModal, _super);
        function AddModal() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.errorMessage = '';
            return _this;
        }
        Object.defineProperty(AddModal.prototype, "DivValidatable", {
            get: function () {
                return this.$refs.DivValidatable;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AddModal.prototype, "TextName", {
            get: function () {
                return this.$refs.TextName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AddModal.prototype, "LabelInvalid", {
            get: function () {
                return this.$refs.LabelInvalid;
            },
            enumerable: true,
            configurable: true
        });
        AddModal.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    _super.prototype.Initialize.call(this);
                    Libraries_11.default.$(this.$el).on(BootstrapEvents_2.ModalEvents.Shown, function () {
                        _this.TextName.focus();
                    });
                    return [2 /*return*/, true];
                });
            });
        };
        AddModal.prototype.OnClickAdd = function () {
            var valid = this.Validate();
            if (!valid) {
                this.DivValidatable.classList.add('was-validated');
                return;
            }
            this.$emit(exports.AddModalEvents.AddOrdered);
        };
        AddModal.prototype.Validate = function () {
            if (!this.TextName.value
                || this.TextName.value.length < Playlist_2.default.MinNameLength) {
                this.errorMessage = 'Name required.';
                return false;
            }
            if (Playlist_2.default.MaxNameLength < this.TextName.value.length) {
                this.errorMessage = 'Name too long.';
                return false;
            }
            return true;
        };
        AddModal.prototype.Show = function () {
            if (this.DivValidatable.classList.contains('was-validated'))
                this.DivValidatable.classList.remove('was-validated');
            this.errorMessage = '';
            this.TextName.value = '';
            Libraries_11.default.Modal.Show(this);
        };
        AddModal.prototype.Hide = function () {
            Libraries_11.default.Modal.Hide(this);
        };
        AddModal.prototype.GetName = function () {
            return this.TextName.value;
        };
        AddModal = __decorate([
            vue_class_component_11.default({
                template: "<div class=\"modal fade\"\n    style=\"display: none;\"\n    aria-hidden=\"true\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content bg-info\">\n            <div class=\"modal-header\">\n                <h4 class=\"modal-title\">New Playlist</h4>\n                <button type=\"button\"\n                    class=\"close\"\n                    data-dismiss=\"modal\"\n                    aria-label=\"Close\">\n                    <span aria-hidden=\"true\">\u00D7</span>\n                </button>\n            </div>\n            <div class=\"modal-body needs-validation\"\n                novalidate\n                ref=\"DivValidatable\" >\n                <div class=\"form-group\">\n                    <label for=\"new-playlist-name\">Playlist Name</label>\n                    <div class=\"input-group\">\n                        <input type=\"text\"\n                            maxlength=\"40\"\n                            id=\"new-playlist-name\"\n                            class=\"form-control\"\n                            required\n                            placeholder=\"Name\"\n                            autocomplete=\"off\"\n                            ref=\"TextName\"/>\n                        <div class=\"invalid-feedback text-white\"\n                            ref=\"LabelInvalid\"><strong>{{ errorMessage }}</strong></div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"modal-footer justify-content-end\">\n                <button type=\"button\"\n                    class=\"btn btn-outline-light float-right\"\n                    @click=\"OnClickAdd\">Add</button>\n            </div>\n        </div>\n    </div>\n</div>"
            })
        ], AddModal);
        return AddModal;
    }(ViewBase_8.default));
    exports.default = AddModal;
});
define("Views/Playlists/Lists/Playlists/PlaylistList", ["require", "exports", "lodash", "vue-class-component", "vue-infinite-loading", "Libraries", "Models/Playlists/PlaylistStore", "Views/Shared/Filterboxes/Filterbox", "Views/Shared/SelectionItem", "Views/Bases/SelectionListBase", "Views/Playlists/Lists/Playlists/AddModal", "Utils/Delay"], function (require, exports, _, vue_class_component_12, vue_infinite_loading_4, Libraries_12, PlaylistStore_2, Filterbox_4, SelectionItem_5, SelectionListBase_4, AddModal_1, Delay_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlaylistListEvents = {
        AnimationEnd: 'animationend',
        PlaylistCreated: 'PlaylistCreated'
    };
    var PlaylistList = /** @class */ (function (_super) {
        __extends(PlaylistList, _super);
        function PlaylistList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.tabId = 'subtab-playlists';
            _this.linkId = 'nav-playlists';
            _this.store = new PlaylistStore_2.default();
            _this.entities = [];
            _this.allEntities = [];
            return _this;
        }
        PlaylistList_1 = PlaylistList;
        Object.defineProperty(PlaylistList.prototype, "Filterbox", {
            get: function () {
                return this.$refs.Filterbox;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlaylistList.prototype, "Items", {
            get: function () {
                return this.$refs.Items;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlaylistList.prototype, "AddModal", {
            get: function () {
                return this.$refs.AddModal;
            },
            enumerable: true,
            configurable: true
        });
        PlaylistList.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    _super.prototype.Initialize.call(this);
                    Libraries_12.default.SetTooltip(this.$refs.ButtonAdd, 'Add Playlist');
                    Libraries_12.default.SetTooltip(this.$refs.ButtonCollaplse, 'Shrink/Expand');
                    this.RefreshPlaylist();
                    return [2 /*return*/, true];
                });
            });
        };
        // #region "InfiniteLoading"
        /**
         * Vueのイベントハンドラは、実装クラス側にハンドラが無い場合に
         * superクラスの同名メソッドが実行されるが、superクラス上のthisが
         * バインドされずにnullになってしまう。
         * 必ず実装クラス側でハンドルしてsuperクラスに渡すようにする。
         */
        PlaylistList.prototype.OnInfinite = function ($state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, _super.prototype.OnInfinite.call(this, $state)];
                });
            });
        };
        PlaylistList.prototype.OnSelectionOrdered = function (args) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, _super.prototype.OnSelectionOrdered.call(this, args)];
                });
            });
        };
        PlaylistList.prototype.OnSelectionChanged = function (args) {
            if (args.Selected === true) {
                _.each(this.Items, function (si) {
                    if (si.GetEntity() !== args.Entity && si.GetSelected()) {
                        si.SetSelected(false);
                    }
                });
            }
            _super.prototype.OnSelectionChanged.call(this, args);
        };
        PlaylistList.prototype.GetPagenatedList = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, entities, filterText, totalLength, pagenated, result;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(!this.allEntities || this.allEntities.length <= 0)) return [3 /*break*/, 2];
                            _a = this;
                            return [4 /*yield*/, this.store.GetPlaylists()];
                        case 1:
                            _a.allEntities = _b.sent();
                            _b.label = 2;
                        case 2:
                            entities = Libraries_12.default.Enumerable.from(this.allEntities);
                            filterText = this.Filterbox.GetText().toLowerCase();
                            if (0 < filterText.length)
                                entities = entities
                                    .where(function (e) { return 0 <= e.Name.toLowerCase().indexOf(filterText); });
                            totalLength = entities.count();
                            pagenated = entities
                                .skip((this.Page - 1) * PlaylistList_1.PageLength)
                                .take(PlaylistList_1.PageLength)
                                .toArray();
                            result = {
                                TotalLength: totalLength,
                                ResultLength: pagenated.length,
                                ResultList: pagenated,
                                ResultPage: this.Page
                            };
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        // #endregion
        PlaylistList.prototype.OnClickAdd = function () {
            this.AddModal.Show();
        };
        PlaylistList.prototype.OnAddOrdered = function () {
            return __awaiter(this, void 0, void 0, function () {
                var name, playlist;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            name = this.AddModal.GetName();
                            return [4 /*yield*/, this.store.AddPlaylist(name)];
                        case 1:
                            playlist = _a.sent();
                            if (!playlist) {
                                this.AddModal.Hide();
                                Libraries_12.default.ShowToast.Error('Playlist Create Failed...');
                                return [2 /*return*/, false];
                            }
                            Libraries_12.default.ShowToast.Success("Playlist [ " + playlist.Name + " ] Created!");
                            this.AddModal.Hide();
                            this.entities = [];
                            this.allEntities = [];
                            this.Refresh();
                            this.$emit(exports.PlaylistListEvents.PlaylistCreated);
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        PlaylistList.prototype.RefreshPlaylist = function () {
            this.entities = [];
            this.allEntities = [];
            this.Refresh();
        };
        /**
         * 非表示時にInfiniteLoadingが反応しない現象への対策。
         */
        PlaylistList.prototype.LoadIfEmpty = function () {
            var _this = this;
            if (!this.entities || this.entities.length <= 0)
                this.RefreshPlaylist();
            Delay_4.default.Wait(800)
                .then(function () {
                var items = Libraries_12.default.Enumerable.from(_this.Items);
                if (items.count() <= 0 || items.any(function (e) { return e.GetSelected() === true; }))
                    return;
                items.first().SetSelected(true);
            });
        };
        var PlaylistList_1;
        PlaylistList.PageLength = 30;
        PlaylistList = PlaylistList_1 = __decorate([
            vue_class_component_12.default({
                template: "<div class=\"col-md-3\">\n    <div class=\"card plain-list\">\n        <div class=\"card-header with-border bg-warning\">\n            <h3 class=\"card-title\">\n                <i class=\"fa fa-list-ul\" />\n                Playlists\n            </h3>\n            <div class=\"card-tools form-row\">\n                <filter-textbox\n                    v-bind:placeHolder=\"'List?'\"\n                    ref=\"Filterbox\"\n                    @TextUpdated=\"Refresh()\"/>\n                <button\n                    class=\"btn btn-tool\"\n                    ref=\"ButtonAdd\"\n                    @click=\"OnClickAdd\" >\n                    <i class=\"fa fa-plus-circle\" />\n                </button>\n            </div>\n        </div>\n        <div class=\"card-body listbox\">\n            <div class=\"outer-scrollbox\">\n                <div class=\"inner-scrollbox playlist-list\">\n                    <ul class=\"nav nav-pills h-100 d-flex flex-column flex-nowrap\">\n                        <template v-for=\"entity in entities\">\n                        <selection-item\n                            ref=\"Items\"\n                            v-bind:entity=\"entity\"\n                            @SelectionOrdered=\"OnSelectionOrdered\"\n                            @SelectionChanged=\"OnSelectionChanged\" />\n                        </template>\n                        <infinite-loading\n                            @infinite=\"OnInfinite\"\n                            force-use-infinite-wrapper=\".inner-scrollbox.playlist-list\"\n                            ref=\"InfiniteLoading\" />\n                    </ul>\n                </div>\n            </div>\n        </div>\n    </div>\n    <add-modal\n        ref=\"AddModal\"\n        @AddOrdered=\"OnAddOrdered\"/>\n</div>",
                components: {
                    'filter-textbox': Filterbox_4.default,
                    'selection-item': SelectionItem_5.default,
                    'infinite-loading': vue_infinite_loading_4.default,
                    'add-modal': AddModal_1.default
                }
            })
        ], PlaylistList);
        return PlaylistList;
    }(SelectionListBase_4.default));
    exports.default = PlaylistList;
});
define("Views/Playlists/Lists/Tracks/SelectionTrack", ["require", "exports", "lodash", "sortablejs/modular/sortable.complete.esm", "vue-class-component", "vue-property-decorator", "Libraries", "Models/Tracks/Track", "Utils/Animate", "Utils/Delay", "Views/Bases/ViewBase", "Views/Bases/SelectionListBase"], function (require, exports, _, sortable_complete_esm_1, vue_class_component_13, vue_property_decorator_6, Libraries_13, Track_5, Animate_3, Delay_5, ViewBase_9, SelectionListBase_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TrackSelectionEvents = _.extend(_.clone(SelectionListBase_5.SelectionEvents), {
        DeleteOrdered: 'DeleteOrdered'
    });
    var SelectionTrack = /** @class */ (function (_super) {
        __extends(SelectionTrack, _super);
        function SelectionTrack() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.selected = false;
            _this.liClasses = SelectionTrack_1.LiClasses;
            _this.isDeleting = false;
            _this.deletingClasses = Animate_3.default.GetClassString(Animate_3.Animation.FadeOutRight, Animate_3.Speed.Faster);
            return _this;
        }
        SelectionTrack_1 = SelectionTrack;
        Object.defineProperty(SelectionTrack.prototype, "Entity", {
            get: function () {
                return this.entity;
            },
            enumerable: true,
            configurable: true
        });
        SelectionTrack.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.GetIsInitialized())
                        Libraries_13.default.SetTooltip(this.$refs.DeleteButton, 'Delete');
                    _super.prototype.Initialize.call(this);
                    return [2 /*return*/, true];
                });
            });
        };
        SelectionTrack.prototype.GetDetailString = function () {
            var albumName = this.entity.GetAlbumName();
            var artistsName = this.entity.GetFormattedArtistsName();
            var year = this.entity.GetFormattedYearString();
            var yearString = (year === '')
                ? ''
                : ' ' + year;
            return "" + albumName + yearString + " : " + artistsName;
        };
        SelectionTrack.prototype.SetLiClasses = function () {
            this.liClasses = SelectionTrack_1.LiClasses
                + ((this.selected)
                    ? 'selected '
                    : '');
            if (this.isDeleting === true)
                this.liClasses += this.deletingClasses;
            this.$forceUpdate();
        };
        SelectionTrack.prototype.OnClickRow = function (ev) {
            var args = {
                Selected: true,
                Entity: this.entity,
                View: this,
                EnableShifKey: ev.shiftKey,
                EnableCtrkey: ev.ctrlKey
            };
            this.$emit(exports.TrackSelectionEvents.SelectionChanged, args);
        };
        SelectionTrack.prototype.OnClickDelete = function (ev) {
            //console.log('SelectionTrack.OnClickDelete');
            var args = {
                Entity: this.entity,
                View: this
            };
            this.$emit(exports.TrackSelectionEvents.DeleteOrdered, args);
            ev.preventDefault();
            ev.stopPropagation();
        };
        SelectionTrack.prototype.DeleteTrack = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            //console.log('SelectionTrack.DeleteTrack');
                            this.isDeleting = true;
                            this.SetLiClasses();
                            return [4 /*yield*/, Delay_5.default.Wait(600)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        SelectionTrack.prototype.GetIsSelected = function () {
            return this.selected;
        };
        SelectionTrack.prototype.Select = function () {
            //console.log('SelectionTrack.Select');
            if (!this.selected) {
                this.selected = true;
                this.SetLiClasses();
            }
        };
        SelectionTrack.prototype.Deselect = function () {
            //console.log('SelectionTrack.Deselect');
            if (this.selected) {
                this.selected = false;
                this.SetLiClasses();
            }
            try {
                // マルチセレクト有効時はSortableに選択解除を通知する必要がある。
                sortable_complete_esm_1.default.utils.deselect(this.$el);
            }
            catch (e) {
                // 握りつぶす。
            }
        };
        SelectionTrack.prototype.Reset = function () {
            //console.log('SelectionTrack.Reset');
            this.isDeleting = false;
            this.selected = false;
            this.SetLiClasses();
            try {
                // マルチセレクト有効時はSortableに選択解除を通知する必要がある。
                sortable_complete_esm_1.default.utils.deselect(this.$el);
            }
            catch (e) {
                // 握りつぶす。
            }
        };
        var SelectionTrack_1;
        SelectionTrack.LiClasses = 'item w-100 playlisttrack-row ';
        __decorate([
            vue_property_decorator_6.Prop(),
            __metadata("design:type", Track_5.default)
        ], SelectionTrack.prototype, "entity", void 0);
        SelectionTrack = SelectionTrack_1 = __decorate([
            vue_class_component_13.default({
                template: "<li v-bind:class=\"liClasses\"\n    v-bind:data-uri=\"entity.Uri\"\n    ref=\"Li\"\n    @click=\"OnClickRow\">\n    <div class=\"product-img ml-2\">\n        <img v-bind:src=\"entity.GetAlbumImageFullUri()\" alt=\"ALbum Image\">\n    </div>\n    <div class=\"product-info\">\n        <span class=\"product-title pl-2\">\n            {{ entity.GetDisplayName() }}\n            <div class=\"btn-group pull-right mr-2 editmode-buttons\">\n                <button\n                    class=\"btn btn-sm btn-outline-light\"\n                    @click=\"OnClickDelete\"\n                    ref=\"DeleteButton\" >\n                    <i class=\"fa fa-trash\" />\n                </button>\n            </div>\n            <span class=\"pull-right length mr-2\">{{ entity.GetTimeString() }}</span>\n        </span>\n        <span class=\"product-description pl-2\">{{ GetDetailString() }}</span>\n    </div>\n</li>"
            })
        ], SelectionTrack);
        return SelectionTrack;
    }(ViewBase_9.default));
    exports.default = SelectionTrack;
});
define("Views/Shared/Dialogs/ConfirmDialog", ["require", "exports", "vue-class-component", "Libraries", "Views/Bases/ViewBase"], function (require, exports, vue_class_component_14, Libraries_14, ViewBase_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConfirmType;
    (function (ConfirmType) {
        ConfirmType["Normal"] = "bg-info";
        ConfirmType["Warning"] = "bg-warning";
        ConfirmType["Danger"] = "bg-danger";
    })(ConfirmType = exports.ConfirmType || (exports.ConfirmType = {}));
    var ConfirmDialog = /** @class */ (function (_super) {
        __extends(ConfirmDialog, _super);
        function ConfirmDialog() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.modalClasses = ConfirmDialog_1.ModalBaseClass + " " + ConfirmType.Normal.toString();
            _this.mainMessage = '';
            _this.detailLines = [];
            _this.resolver = null;
            return _this;
        }
        ConfirmDialog_1 = ConfirmDialog;
        ConfirmDialog.prototype.OnClickOk = function () {
            this.Resolve(true);
        };
        ConfirmDialog.prototype.OnClickCancel = function () {
            this.Resolve(false);
        };
        ConfirmDialog.prototype.Resolve = function (result) {
            if (this.resolver) {
                this.resolver(result);
            }
            this.resolver = null;
            Libraries_14.default.Modal.Hide(this);
        };
        ConfirmDialog.prototype.SetConfirmType = function (confirmType) {
            this.modalClasses = ConfirmDialog_1.ModalBaseClass + " " + confirmType.toString();
        };
        ConfirmDialog.prototype.SetBody = function (mainMessage, detailLines) {
            this.mainMessage = mainMessage;
            if (detailLines && 0 < detailLines.length)
                this.detailLines = detailLines;
            this.$forceUpdate();
        };
        ConfirmDialog.prototype.Confirm = function () {
            var _this = this;
            return new Promise(function (resolve) {
                Libraries_14.default.Modal.Show(_this);
                _this.resolver = resolve;
            });
        };
        var ConfirmDialog_1;
        ConfirmDialog.ModalBaseClass = 'modal-content';
        ConfirmDialog = ConfirmDialog_1 = __decorate([
            vue_class_component_14.default({
                template: "<div class=\"modal fade\"\n    data-backdrop=\"static\"\n    data-keyboard=\"false\"\n    data-focus=\"true\"\n    style=\"display: none;\"\n    aria-hidden=\"true\">\n    <div class=\"modal-dialog\">\n        <div v-bind:class=\"modalClasses\">\n            <div class=\"modal-header\">\n                <h4 class=\"modal-title\">{{ mainMessage }}</h4>\n            </div>\n            <div class=\"modal-body\">\n                <p>\n                <template v-for=\"line in detailLines\">\n                    <span>{{ line }}</span><br/>\n                </template>\n                </p>\n            </div>\n            <div class=\"modal-footer justify-content-between\">\n                <button type=\"button\"\n                    class=\"btn btn-outline-light\"\n                    @click=\"OnClickCancel\">Cancel</button>\n                <button type=\"button\"\n                    class=\"btn btn-outline-light\"\n                    @click=\"OnClickOk\">OK</button>\n            </div>\n        </div>\n    </div>\n</div>"
            })
        ], ConfirmDialog);
        return ConfirmDialog;
    }(ViewBase_10.default));
    exports.default = ConfirmDialog;
});
define("Views/Playlists/Lists/Tracks/UpdateDialog", ["require", "exports", "Views/Shared/Dialogs/ConfirmDialog"], function (require, exports, ConfirmDialog_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UpdateDialog = /** @class */ (function (_super) {
        __extends(UpdateDialog, _super);
        function UpdateDialog() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UpdateDialog.prototype.ConfirmUpdate = function (listUpdate) {
            var message = 'Update Playlist?';
            var confirmType = (0 < listUpdate.RemovedTracks.length)
                ? ConfirmDialog_2.ConfirmType.Warning
                : ConfirmDialog_2.ConfirmType.Normal;
            var details = [];
            if (listUpdate.IsNameChanged)
                details.push("Rename to [ " + listUpdate.NewName + " ]");
            if (0 < listUpdate.RemovedTracks.length) {
                var unit = (listUpdate.RemovedTracks.length === 1)
                    ? 'Track'
                    : 'Tracks';
                details.push("Delete " + listUpdate.RemovedTracks.length + " " + unit + ".");
            }
            if (listUpdate.IsOrderChanged !== false)
                details.push('Change Track Order.');
            details.push('');
            details.push('This operation cannot be reversed.');
            details.push('');
            details.push('Are you sure?');
            this.SetConfirmType(confirmType);
            this.SetBody(message, details);
            return this.Confirm();
        };
        UpdateDialog.prototype.ConfirmRollback = function () {
            this.SetConfirmType(ConfirmDialog_2.ConfirmType.Normal);
            var message = 'Rollback Playlist?';
            var details = [
                'Discard all changes.',
                '',
                'Are you sure?'
            ];
            this.SetBody(message, details);
            return this.Confirm();
        };
        UpdateDialog.prototype.ConfirmDeleteAll = function () {
            this.SetConfirmType(ConfirmDialog_2.ConfirmType.Danger);
            var message = 'Delete Playlist?';
            var details = [
                'Delete all this playlist.',
                'This operation cannot be reversed.',
                '',
                'Are you sure?'
            ];
            this.SetBody(message, details);
            return this.Confirm();
        };
        return UpdateDialog;
    }(ConfirmDialog_2.default));
    exports.default = UpdateDialog;
});
define("Views/Playlists/Lists/Tracks/TrackList", ["require", "exports", "lodash", "sortablejs/modular/sortable.complete.esm", "vue-class-component", "vue-infinite-loading", "Libraries", "Models/Playlists/Playlist", "Models/Playlists/PlaylistStore", "Utils/Animate", "Utils/Delay", "Views/Shared/Filterboxes/Filterbox", "Views/Bases/SelectionListBase", "Views/Shared/SlideupButton", "Views/Playlists/Lists/Tracks/SelectionTrack", "Views/Playlists/Lists/Tracks/UpdateDialog"], function (require, exports, _, sortable_complete_esm_2, vue_class_component_15, vue_infinite_loading_5, Libraries_15, Playlist_3, PlaylistStore_3, Animate_4, Delay_6, Filterbox_5, SelectionListBase_6, SlideupButton_2, SelectionTrack_2, UpdateDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TrackListEvents = {
        PlaylistDeleted: 'PlaylistDeleted',
        PlaylistUpdated: 'PlaylistUpdated'
    };
    var ListMode;
    (function (ListMode) {
        ListMode["Playable"] = "playable";
        ListMode["Editable"] = "editable";
    })(ListMode || (ListMode = {}));
    var TrackList = /** @class */ (function (_super) {
        __extends(TrackList, _super);
        function TrackList() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.tabId = 'subtab-playlisttracks';
            _this.linkId = 'nav-playlisttracks';
            _this.store = new PlaylistStore_3.default();
            _this.entities = [];
            _this.playlist = null;
            _this.removedEntities = [];
            _this.listMode = ListMode.Playable;
            _this.listClasses = TrackList_1.ListBaseClasses + _this.listMode.toString();
            _this.sortable = null;
            return _this;
            // #endregion
        }
        TrackList_1 = TrackList;
        Object.defineProperty(TrackList.prototype, "TitleH3", {
            get: function () {
                return this.$refs.TitleH3;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TrackList.prototype, "TitleInput", {
            get: function () {
                return this.$refs.TitleInput;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TrackList.prototype, "Filterbox", {
            get: function () {
                return this.$refs.Filterbox;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TrackList.prototype, "EditButton", {
            get: function () {
                return this.$refs.EditButton;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TrackList.prototype, "HeaderDeleteButton", {
            get: function () {
                return this.$refs.HeaderDeleteButton;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TrackList.prototype, "UndoButton", {
            get: function () {
                return this.$refs.UndoButton;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TrackList.prototype, "EndEditButton", {
            get: function () {
                return this.$refs.EndEditButton;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TrackList.prototype, "TrackListUl", {
            get: function () {
                return this.$refs.TrackListUl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TrackList.prototype, "Items", {
            get: function () {
                return this.$refs.Items;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TrackList.prototype, "UpdateDialog", {
            get: function () {
                return this.$refs.UpdateDialog;
            },
            enumerable: true,
            configurable: true
        });
        TrackList.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    _super.prototype.Initialize.call(this);
                    // ※$onの中ではプロパティ定義が参照出来ないらしい。
                    // ※ハンドラメソッドをthisバインドしてもダメだった。
                    // ※やむなく、$refsを直接キャストする。
                    this.$on(SelectionListBase_6.SelectionEvents.ListUpdated, function () { return __awaiter(_this, void 0, void 0, function () {
                        var items, i, item;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Delay_6.default.Wait(500)];
                                case 1:
                                    _a.sent();
                                    items = this.$refs.Items;
                                    for (i = 0; i < items.length; i++) {
                                        item = items[i];
                                        if (!item.GetIsInitialized())
                                            item.Initialize();
                                    }
                                    return [2 /*return*/, true];
                            }
                        });
                    }); });
                    this.titleH3Animate = new Animate_4.default(this.TitleH3);
                    this.titleInputAnimate = new Animate_4.default(this.TitleInput);
                    return [2 /*return*/, true];
                });
            });
        };
        TrackList.prototype.GetIsSavedPlaylistChanges = function () {
            if (this.listMode === ListMode.Playable)
                return true;
            return !(this.GetUpdate()).HasUpdate;
        };
        TrackList.prototype.SetPlaylist = function (playlist) {
            return __awaiter(this, void 0, void 0, function () {
                var i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.listMode !== ListMode.Playable)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.GoBackToPlayer()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            this.playlist = (playlist)
                                ? playlist
                                : null;
                            this.entities = [];
                            this.removedEntities = [];
                            if (this.playlist && this.playlist.Tracks) {
                                for (i = 0; i < this.playlist.Tracks.length; i++)
                                    this.playlist.Tracks[i].TlId = null;
                            }
                            this.Refresh();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        /**
         * 非表示時にInfiniteLoadingが反応しない現象への対策。
         */
        TrackList.prototype.LoadIfEmpty = function () {
            if (!this.entities || this.entities.length <= 0)
                this.Refresh();
        };
        // #region "Events"
        TrackList.prototype.OnInputTitle = function () {
            if (this.listMode === ListMode.Playable)
                return;
            this.ShowUndoIfHidden();
        };
        TrackList.prototype.OnClickEdit = function () {
            this.GoIntoEditor();
        };
        TrackList.prototype.OnClickHeaderDelete = function () {
            return __awaiter(this, void 0, void 0, function () {
                var promises, hasRemovedTrack, i, item;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            promises = [];
                            hasRemovedTrack = false;
                            for (i = 0; i < this.Items.length; i++) {
                                item = this.Items[i];
                                if (item.GetIsSelected()) {
                                    promises.push(this.DeleteTrack(item));
                                    hasRemovedTrack = true;
                                }
                            }
                            if (!hasRemovedTrack) return [3 /*break*/, 3];
                            // どれかトラックが削除されたとき
                            return [4 /*yield*/, Promise.all(promises)];
                        case 1:
                            // どれかトラックが削除されたとき
                            _a.sent();
                            return [4 /*yield*/, this.SetSortable()];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 3: 
                        // 削除トラックが無い(=どの行も選択されていない)とき
                        // プレイリスト自体を削除する。
                        return [4 /*yield*/, this.TryDelete()];
                        case 4:
                            // 削除トラックが無い(=どの行も選択されていない)とき
                            // プレイリスト自体を削除する。
                            _a.sent();
                            _a.label = 5;
                        case 5: return [2 /*return*/, true];
                    }
                });
            });
        };
        TrackList.prototype.OnClickUndoButton = function () {
            return __awaiter(this, void 0, void 0, function () {
                var isRollback;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.UpdateDialog.ConfirmRollback()];
                        case 1:
                            isRollback = _a.sent();
                            if (!isRollback) return [3 /*break*/, 3];
                            this.removedEntities = [];
                            return [4 /*yield*/, this.GoBackToPlayer()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, true];
                    }
                });
            });
        };
        TrackList.prototype.OnClickEndEdit = function () {
            this.TryUpdate();
        };
        TrackList.prototype.OnSelectionChanged = function (args) {
            return __awaiter(this, void 0, void 0, function () {
                var isAllTracksRegistered, response, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(this.listMode === ListMode.Playable)) return [3 /*break*/, 5];
                            isAllTracksRegistered = Libraries_15.default.Enumerable.from(this.playlist.Tracks)
                                .all(function (e) { return e.TlId !== null; });
                            if (!(isAllTracksRegistered)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.store.PlayByTlId(args.Entity.TlId)];
                        case 1:
                            _a = _b.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.store.PlayPlaylist(this.playlist, args.Entity)];
                        case 3:
                            _a = _b.sent();
                            _b.label = 4;
                        case 4:
                            response = _a;
                            (response)
                                ? Libraries_15.default.ShowToast.Success("Track [ " + args.Entity.Name + " ] Started!")
                                : Libraries_15.default.ShowToast.Error('Track Order Failed...');
                            return [3 /*break*/, 6];
                        case 5:
                            if (this.listMode === ListMode.Editable) {
                                // 編集モード時
                                (args.View.GetIsSelected())
                                    ? args.View.Deselect()
                                    : args.View.Select();
                            }
                            _b.label = 6;
                        case 6: return [2 /*return*/, true];
                    }
                });
            });
        };
        TrackList.prototype.OnDeleteRowOrdered = function (args) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        //console.log('TrackList.OnDeleteRowOrdered');
                        return [4 /*yield*/, this.DeleteTrack(args.View)];
                        case 1:
                            //console.log('TrackList.OnDeleteRowOrdered');
                            _a.sent();
                            this.SetSortable();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        TrackList.prototype.OnOrderChanged = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Delay_6.default.Wait(500)];
                        case 1:
                            _a.sent();
                            this.ClearSelection();
                            this.ShowUndoIfHidden();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        // #endregion
        // #region "Edit"
        TrackList.prototype.GoIntoEditor = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // タイトル・編集開始ボタン非表示化
                        return [4 /*yield*/, Promise.all([
                                this.Filterbox.Hide(),
                                this.EditButton.Hide(),
                                this.titleH3Animate.Execute(Animate_4.Animation.FadeOutDown, Animate_4.Speed.Faster),
                            ])];
                        case 1:
                            // タイトル・編集開始ボタン非表示化
                            _a.sent();
                            // 内部的モード切替
                            this.TitleInput.value = this.playlist.Name;
                            this.listMode = ListMode.Editable;
                            this.listClasses = TrackList_1.ListBaseClasses + this.listMode.toString();
                            // 編集操作ボタン類の表示化
                            return [4 /*yield*/, Promise.all([
                                    this.titleInputAnimate.Execute(Animate_4.Animation.FadeInUp, Animate_4.Speed.Faster),
                                    this.HeaderDeleteButton.Show(),
                                    this.EndEditButton.Show()
                                ])];
                        case 2:
                            // 編集操作ボタン類の表示化
                            _a.sent();
                            // 編集操作ボタン類表示化後
                            this.$forceUpdate();
                            this.$nextTick(function () {
                                _this.SetSortable();
                            });
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        TrackList.prototype.GoBackToPlayer = function () {
            return __awaiter(this, void 0, void 0, function () {
                var promises;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.ClearSelection();
                            this.DisposeSortable();
                            promises = [
                                this.titleInputAnimate.Execute(Animate_4.Animation.FadeOutDown, Animate_4.Speed.Faster),
                                this.HeaderDeleteButton.Hide(),
                                this.EndEditButton.Hide()
                            ];
                            if (this.UndoButton.GetIsVisible())
                                promises.push(this.UndoButton.Hide());
                            return [4 /*yield*/, Promise.all(promises)];
                        case 1:
                            _a.sent();
                            // 内部的モード切替
                            this.listMode = ListMode.Playable;
                            this.listClasses = TrackList_1.ListBaseClasses + this.listMode.toString();
                            this.TitleInput.value = '';
                            // タイトル・編集開始ボタン表示化
                            return [4 /*yield*/, Promise.all([
                                    this.titleH3Animate.Execute(Animate_4.Animation.FadeInUp, Animate_4.Speed.Faster),
                                    this.EditButton.Show(),
                                    this.Filterbox.Show()
                                ])];
                        case 2:
                            // タイトル・編集開始ボタン表示化
                            _a.sent();
                            // リスト再描画
                            this.Refresh();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        TrackList.prototype.SetSortable = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.DisposeSortable();
                            return [4 /*yield*/, Delay_6.default.Wait(10)];
                        case 1:
                            _a.sent();
                            this.sortable = sortable_complete_esm_2.default.create(this.TrackListUl, {
                                animation: 500,
                                multiDrag: true,
                                selectedClass: 'selected',
                                dataIdAttr: 'data-uri',
                                onEnd: function () {
                                    _this.OnOrderChanged();
                                }
                            });
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        TrackList.prototype.DisposeSortable = function () {
            if (this.sortable !== null) {
                try {
                    this.sortable.destroy();
                }
                catch (ex) {
                    // 握りつぶす。
                }
            }
            this.sortable = null;
        };
        TrackList.prototype.ShowUndoIfHidden = function () {
            if (!this.UndoButton.GetIsVisible())
                this.UndoButton.Show();
        };
        TrackList.prototype.ClearSelection = function () {
            for (var i = 0; i < this.Items.length; i++)
                this.Items[i].Reset();
        };
        TrackList.prototype.DeleteTrack = function (row) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            //console.log('TrackList.DeleteTrack');
                            if (this.listMode === ListMode.Playable)
                                return [2 /*return*/];
                            return [4 /*yield*/, row.DeleteTrack()];
                        case 1:
                            _a.sent();
                            row.$el.parentElement.removeChild(row.$el);
                            _.pull(this.$children, row);
                            _.pull(this.entities, row.Entity);
                            this.removedEntities.push(row.Entity);
                            row.$destroy();
                            this.ShowUndoIfHidden();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        // #endregion
        // #region "Register"
        TrackList.prototype.TryUpdate = function () {
            return __awaiter(this, void 0, void 0, function () {
                var update;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            update = this.GetUpdate();
                            if (!this.Validate(update))
                                return [2 /*return*/, false];
                            if (!update.HasUpdate) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.UpdateDialog.ConfirmUpdate(update)];
                        case 1:
                            if (!((_a.sent()) === true)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.Update(update)];
                        case 2:
                            // 更新許可OK
                            if ((_a.sent()) === true) {
                                Libraries_15.default.ShowToast.Success('Playlist Updated!');
                                this.GoBackToPlayer();
                            }
                            else {
                                Libraries_15.default.ShowToast.Error('Playlist Update Failed...');
                                // そのまま編集モードを維持
                            }
                            return [3 /*break*/, 3];
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            // 何も変更が無いとき
                            // 更新登録せず再生モードへ移行
                            this.GoBackToPlayer();
                            _a.label = 5;
                        case 5: return [2 /*return*/, true];
                    }
                });
            });
        };
        TrackList.prototype.GetUpdate = function () {
            var removedTracks = (this.removedEntities && 0 < this.removedEntities.length)
                ? this.removedEntities
                : [];
            var updatedTracks = this.GetEditedTracks();
            var isOrderChanged = this.GetIsOrderChanged(updatedTracks);
            var isNameChanged = (this.playlist.Name !== this.TitleInput.value);
            var hasUpdate = (isOrderChanged !== false)
                || (0 < removedTracks.length)
                || (isNameChanged !== false);
            var result = {
                HasUpdate: hasUpdate,
                UpdatedTracks: updatedTracks,
                RemovedTracks: removedTracks,
                IsOrderChanged: isOrderChanged,
                IsNameChanged: isNameChanged,
                NewName: (this.playlist.Name !== this.TitleInput.value)
                    ? this.TitleInput.value
                    : null
            };
            return result;
        };
        TrackList.prototype.GetEditedTracks = function () {
            // entitiesをUL要素内の見た目の順序に取得する。
            var result = [];
            var enEntities = Libraries_15.default.Enumerable.from(this.entities);
            var children = this.TrackListUl.querySelectorAll('li');
            var _loop_1 = function (i) {
                var row = children[i];
                var uri = row.getAttribute('data-uri');
                var entity = enEntities.firstOrDefault(function (e) { return e.Uri == uri; });
                if (entity && result.indexOf(entity) <= -1)
                    result.push(entity);
            };
            for (var i = 0; i < children.length; i++) {
                _loop_1(i);
            }
            var enResult = Libraries_15.default.Enumerable.from(result);
            var enRemoved = Libraries_15.default.Enumerable.from(this.removedEntities);
            var _loop_2 = function (i) {
                var track = this_1.playlist.Tracks[i];
                // 表示圏外だったエンティティを追加する。
                if (enResult.all(function (e) { return e.Uri !== track.Uri; })
                    && enRemoved.all(function (e) { return e.Uri !== track.Uri; })) {
                    result.push(track);
                }
            };
            var this_1 = this;
            for (var i = 0; i < this.playlist.Tracks.length; i++) {
                _loop_2(i);
            }
            return result;
        };
        TrackList.prototype.GetIsOrderChanged = function (updatedTracks) {
            var beforeTracks = this.playlist.Tracks;
            var result = false;
            for (var i = 0; i < updatedTracks.length; i++) {
                if (updatedTracks[i] !== beforeTracks[i]) {
                    result = true;
                    break;
                }
            }
            return result;
        };
        TrackList.prototype.Validate = function (update) {
            if (update.IsNameChanged !== false
                && (!update.NewName
                    || update.NewName.length < Playlist_3.default.MinNameLength)) {
                Libraries_15.default.ShowToast.Warning('Name required.');
                this.SetTitleValidationBorder(false);
                this.TitleInput.focus();
                return false;
            }
            if (update.IsNameChanged !== false
                && Playlist_3.default.MaxNameLength < update.NewName.length) {
                Libraries_15.default.ShowToast.Warning('Name too long.');
                this.SetTitleValidationBorder(false);
                this.TitleInput.focus();
                return false;
            }
            this.SetTitleValidationBorder(true);
            return true;
        };
        TrackList.prototype.SetTitleValidationBorder = function (isValid) {
            var classes = this.TitleInput.classList;
            if (isValid === true
                && classes.contains('is-invalid')) {
                classes.remove('is-invalid');
            }
            if (isValid !== true
                && !classes.contains('is-invalid')) {
                classes.add('is-invalid');
            }
        };
        TrackList.prototype.Update = function (update) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // TODO: 保存処理
                            // this.playlist.Tracks も更新されるようにする。
                            if (update.IsNameChanged)
                                this.playlist.Name = update.NewName;
                            if (update.IsOrderChanged || 0 < update.RemovedTracks.length)
                                this.playlist.Tracks = update.UpdatedTracks;
                            return [4 /*yield*/, this.store.UpdatePlayllist(this.playlist)];
                        case 1:
                            result = _a.sent();
                            if (result === true) {
                                this.$emit(exports.TrackListEvents.PlaylistUpdated);
                            }
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        TrackList.prototype.TryDelete = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.UpdateDialog.ConfirmDeleteAll()];
                        case 1:
                            if (!((_a.sent()) === true)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.store.DeletePlaylist(this.playlist)];
                        case 2:
                            result = _a.sent();
                            if (!(result === true)) return [3 /*break*/, 4];
                            Libraries_15.default.ShowToast.Success('Deleted!');
                            this.playlist = null;
                            this.removedEntities = [];
                            this.$emit(exports.TrackListEvents.PlaylistDeleted);
                            return [4 /*yield*/, this.GoBackToPlayer()];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            Libraries_15.default.ShowToast.Error('Delete Failed...');
                            _a.label = 5;
                        case 5: return [2 /*return*/, true];
                    }
                });
            });
        };
        // #endregion
        // #region "InfiniteLoading"
        /**
         * Vueのイベントハンドラは、実装クラス側にハンドラが無い場合に
         * superクラスの同名メソッドが実行されるが、superクラス上のthisが
         * バインドされずにnullになってしまう。
         * 必ず実装クラス側でハンドルしてsuperクラスに渡すようにする。
         */
        TrackList.prototype.OnInfinite = function ($state) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, _super.prototype.OnInfinite.call(this, $state)];
                });
            });
        };
        TrackList.prototype.GetPagenatedList = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result_1, entities, filterText, totalLength, pagenated, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.playlist) {
                                result_1 = {
                                    ResultLength: 0,
                                    TotalLength: 0,
                                    ResultList: [],
                                    ResultPage: 1
                                };
                                return [2 /*return*/, result_1];
                            }
                            if (!(!this.playlist.Tracks || this.playlist.Tracks.length <= 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.store.SetPlaylistTracks(this.playlist)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            entities = Libraries_15.default.Enumerable.from(this.playlist.Tracks);
                            filterText = this.Filterbox.GetText().toLowerCase();
                            if (0 < filterText.length)
                                entities = entities
                                    .where(function (e) { return 0 <= e.LowerName.indexOf(filterText); });
                            totalLength = entities.count();
                            pagenated = entities
                                .skip((this.Page - 1) * TrackList_1.PageLength)
                                .take(TrackList_1.PageLength)
                                .toArray();
                            result = {
                                TotalLength: totalLength,
                                ResultLength: pagenated.length,
                                ResultList: pagenated,
                                ResultPage: this.Page
                            };
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        var TrackList_1;
        TrackList.PageLength = 20;
        TrackList.ListBaseClasses = 'products-list product-list-in-box ';
        TrackList = TrackList_1 = __decorate([
            vue_class_component_15.default({
                template: "<div class=\"col-md-9 playlist-track\">\n    <div class=\"card\">\n        <div class=\"card-header with-border bg-warning\">\n            <h3 class=\"card-title\"\n                ref=\"TitleH3\">\n                <i class=\"fa fa-music\" />\n                Playlist Tracks\n            </h3>\n            <input type=\"text\" class=\"form-control form-control-sm d-none title-input\"\n                maxlength=\"40\"\n                ref=\"TitleInput\"\n                @input=\"OnInputTitle\"/>\n            <div class=\"card-tools form-row\">\n                <filter-textbox\n                    v-bind:placeHolder=\"'Track?'\"\n                    ref=\"Filterbox\"\n                    @TextUpdated=\"Refresh()\" />\n                <slideup-button\n                    v-bind:hideOnInit=\"false\"\n                    iconClass=\"fa fa-pencil\"\n                    tooltip=\"Edit\"\n                    ref=\"EditButton\"\n                    @Clicked=\"OnClickEdit\" />\n                <slideup-button\n                    v-bind:hideOnInit=\"true\"\n                    iconClass=\"fa fa-trash\"\n                    tooltip=\"Delete\"\n                    ref=\"HeaderDeleteButton\"\n                    @Clicked=\"OnClickHeaderDelete\" />\n                <slideup-button\n                    v-bind:hideOnInit=\"true\"\n                    iconClass=\"fa fa-undo\"\n                    tooltip=\"Rollback\"\n                    ref=\"UndoButton\"\n                    @Clicked=\"OnClickUndoButton\" />\n                <slideup-button\n                    v-bind:hideOnInit=\"true\"\n                    iconClass=\"fa fa-check\"\n                    tooltip=\"Update\"\n                    ref=\"EndEditButton\"\n                    @Clicked=\"OnClickEndEdit\" />\n            </div>\n        </div>\n        <div class=\"card-body listbox\">\n            <div class=\"outer-scrollbox\">\n                <div class=\"inner-scrollbox playlisttrack-list\">\n                    <ul v-bind:class=\"listClasses\"\n                        ref=\"TrackListUl\">\n                        <template v-for=\"entity in entities\">\n                        <selection-track\n                            ref=\"Items\"\n                            v-bind:entity=\"entity\"\n                            @SelectionChanged=\"OnSelectionChanged\"\n                            @DeleteOrdered=\"OnDeleteRowOrdered\" />\n                        </template>\n                        <infinite-loading\n                            @infinite=\"OnInfinite\"\n                            force-use-infinite-wrapper=\".inner-scrollbox.playlisttrack-list\"\n                            ref=\"InfiniteLoading\" />\n                    </ul>\n                </div>\n            </div>\n        </div>\n    </div>\n    <update-dialog\n        ref=\"UpdateDialog\" />\n</div>",
                components: {
                    'filter-textbox': Filterbox_5.default,
                    'slideup-button': SlideupButton_2.default,
                    'selection-track': SelectionTrack_2.default,
                    'infinite-loading': vue_infinite_loading_5.default,
                    'update-dialog': UpdateDialog_1.default
                }
            })
        ], TrackList);
        return TrackList;
    }(SelectionListBase_6.default));
    exports.default = TrackList;
});
define("Views/Playlists/Playlists", ["require", "exports", "vue-class-component", "Libraries", "Views/Bases/ContentBase", "Views/Playlists/Lists/Playlists/PlaylistList", "Views/Playlists/Lists/Tracks/TrackList", "Utils/Delay", "Views/Bases/IContentDetail", "Utils/Exception"], function (require, exports, vue_class_component_16, Libraries_16, ContentBase_2, PlaylistList_2, TrackList_2, Delay_7, IContentDetail_3, Exception_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlaylistsEvents = {
        PlaylistsUpdated: 'PlaylistsUpdated'
    };
    var Playlists = /** @class */ (function (_super) {
        __extends(Playlists, _super);
        function Playlists() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            // #region "IContentView"
            _this.details = [];
            return _this;
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
        Playlists.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    _super.prototype.Initialize.call(this);
                    this.details.push(this.PlaylistList);
                    this.details.push(this.TrackList);
                    return [2 /*return*/, true];
                });
            });
        };
        Playlists.prototype.GetIsPermitLeave = function () {
            // プレイリスト画面からの移動可否判定
            var isSaved = this.TrackList.GetIsSavedPlaylistChanges();
            if (!isSaved) {
                Libraries_16.default.ShowToast.Warning('Please complete editing.');
            }
            return isSaved;
        };
        Playlists.prototype.InitContent = function () {
            var _this = this;
            Delay_7.default.Wait(800)
                .then(function () {
                _this.PlaylistList.LoadIfEmpty();
            });
        };
        Playlists.prototype.ShowContentDetail = function (args) {
            switch (args.Detail) {
                case IContentDetail_3.ContentDetails.Playlists:
                    this.HideAllDetails();
                    this.PlaylistList.Show();
                    this.PlaylistList.LoadIfEmpty();
                    break;
                case IContentDetail_3.ContentDetails.PlaylistTracks:
                    this.HideAllDetails();
                    this.TrackList.Show();
                    this.TrackList.LoadIfEmpty();
                    break;
                default:
                    Exception_12.default.Throw('Unexpected ContentDetail');
            }
        };
        // #endregion
        Playlists.prototype.OnPlaylistsSelectionOrdered = function (args) {
            return __awaiter(this, void 0, void 0, function () {
                var isSaved;
                return __generator(this, function (_a) {
                    isSaved = this.TrackList.GetIsSavedPlaylistChanges();
                    args.Permitted = isSaved;
                    if (!isSaved) {
                        Libraries_16.default.ShowToast.Warning('Please complete editing.');
                    }
                    return [2 /*return*/, true];
                });
            });
        };
        Playlists.prototype.OnPlaylistsSelectionChanged = function (args) {
            if (args.Selected) {
                this.TrackList.SetPlaylist(args.Entity);
            }
            else {
                this.TrackList.SetPlaylist(null);
            }
        };
        Playlists.prototype.OnPlaylistCreated = function () {
            this.$emit(exports.PlaylistsEvents.PlaylistsUpdated);
        };
        Playlists.prototype.OnPlaylistDeleted = function () {
            this.PlaylistList.RefreshPlaylist();
            this.$emit(exports.PlaylistsEvents.PlaylistsUpdated);
        };
        Playlists.prototype.OnPlaylistUpdated = function () {
            this.PlaylistList.RefreshPlaylist();
            this.$emit(exports.PlaylistsEvents.PlaylistsUpdated);
        };
        Playlists.prototype.RefreshPlaylist = function () {
            this.PlaylistList.RefreshPlaylist();
        };
        Playlists = __decorate([
            vue_class_component_16.default({
                template: "<section class=\"content h-100 tab-pane fade\"\n    id=\"tab-playlists\"\n    role=\"tabpanel\"\n    aria-labelledby=\"nav-playlists\">\n    <div class=\"row\">\n        <playlist-list\n            ref=\"PlaylistList\"\n            @SelectionOrdered=\"OnPlaylistsSelectionOrdered\"\n            @SelectionChanged=\"OnPlaylistsSelectionChanged\" />\n        <track-list\n            ref=\"TrackList\"\n            @PlaylistDeleted=\"OnPlaylistDeleted\"\n            @PlaylistUpdated=\"OnPlaylistUpdated\" />\n    </div>\n</section>",
                components: {
                    'playlist-list': PlaylistList_2.default,
                    'track-list': TrackList_2.default
                }
            })
        ], Playlists);
        return Playlists;
    }(ContentBase_2.default));
    exports.default = Playlists;
});
define("Models/Settings/Settings", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Settings = /** @class */ (function () {
        function Settings() {
            this._serverAddress = null;
            this._serverPort = null;
            this._isBusy = false;
            this._isMopidyConnectable = false;
        }
        Object.defineProperty(Settings, "Entity", {
            get: function () {
                return Settings._entity;
            },
            enumerable: true,
            configurable: true
        });
        Settings.Apply = function (newSettings) {
            this._entity._serverAddress = newSettings.ServerAddress;
            this._entity._serverPort = newSettings.ServerPort;
        };
        Object.defineProperty(Settings.prototype, "ServerAddress", {
            get: function () {
                return this._serverAddress;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings.prototype, "ServerPort", {
            get: function () {
                return this._serverPort;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings.prototype, "IsBusy", {
            get: function () {
                return this._isBusy;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings.prototype, "IsMopidyConnectable", {
            get: function () {
                return this._isMopidyConnectable;
            },
            enumerable: true,
            configurable: true
        });
        Settings.prototype.SetBusy = function (isBusy) {
            this._isBusy = isBusy;
        };
        Settings.prototype.SetMopidyConnectable = function (isConnectable) {
            this._isMopidyConnectable = isConnectable;
        };
        Settings._entity = new Settings();
        return Settings;
    }());
    exports.default = Settings;
});
define("Models/Albums/AlbumStore", ["require", "exports", "Models/Bases/StoreBase", "Utils/Exception"], function (require, exports, StoreBase_4, Exception_13) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AlbumStore = /** @class */ (function (_super) {
        __extends(AlbumStore, _super);
        function AlbumStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AlbumStore.prototype.Exists = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryGet('Album/Exists')];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded)
                                Exception_13.default.Throw('Unexpected Error on ApiQuery', response.Errors);
                            return [2 /*return*/, response.Result];
                    }
                });
            });
        };
        return AlbumStore;
    }(StoreBase_4.default));
    exports.default = AlbumStore;
});
define("Models/Settings/SettingsStore", ["require", "exports", "Utils/Dump", "Utils/Exception", "Models/Albums/AlbumStore", "Models/Artists/ArtistStore", "Models/Bases/JsonRpcQueryableBase", "Models/Genres/GenreStore", "Models/Settings/Settings"], function (require, exports, Dump_7, Exception_14, AlbumStore_1, ArtistStore_2, JsonRpcQueryableBase_3, GenreStore_2, Settings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SettingsStore = /** @class */ (function (_super) {
        __extends(SettingsStore, _super);
        function SettingsStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(SettingsStore.prototype, "Entity", {
            get: function () {
                return Settings_1.default.Entity;
            },
            enumerable: true,
            configurable: true
        });
        SettingsStore.prototype.Get = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryGet('Settings')];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded)
                                Exception_14.default.Throw('SettingStore.Get: Unexpected Error.', response.Errors);
                            Settings_1.default.Apply(response.Result);
                            return [2 /*return*/, Settings_1.default.Entity];
                    }
                });
            });
        };
        SettingsStore.prototype.Update = function (settings) {
            return __awaiter(this, void 0, void 0, function () {
                var response, updated;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryPost('Settings', settings)];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded) {
                                Dump_7.default.Error('SettingStore.Update: Unexpected Error.', response.Errors);
                                return [2 /*return*/, false];
                            }
                            updated = response.Result;
                            Settings_1.default.Apply(updated);
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        SettingsStore.prototype.TryConnect = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcRequest(SettingsStore.MethodGetState)];
                        case 1:
                            response = _a.sent();
                            if (response.error)
                                Dump_7.default.Error('SettingStore.TryConnect: Unexpected Error.', response.error);
                            Settings_1.default.Entity.SetMopidyConnectable(!(response.error));
                            return [2 /*return*/, Settings_1.default.Entity.IsMopidyConnectable];
                    }
                });
            });
        };
        SettingsStore.prototype.ExistsData = function () {
            var genreStore = new GenreStore_2.default();
            var artistStore = new ArtistStore_2.default();
            var albumStore = new AlbumStore_1.default();
            var existsGenres = false;
            var existsArtists = false;
            var existsAlbums = false;
            var promises = [];
            promises.push(genreStore.Exists().then(function (res) { existsGenres = res; }));
            promises.push(artistStore.Exists().then(function (res) { existsArtists = res; }));
            promises.push(albumStore.Exists().then(function (res) { existsAlbums = res; }));
            // なぜか、Promise.all をawait した後で各bool値を比較しようとすると
            // "常にfalseになるぞ"警告が出る。
            // Promiseをまだきちんと理解してない...？
            return Promise.all(promises)
                .then(function () {
                return (existsGenres === true
                    && existsArtists === true
                    && existsAlbums === true);
            });
        };
        SettingsStore.prototype.GetAlbumScanProgress = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryGet('Settings/AlbumScanProgress')];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded) {
                                Dump_7.default.Error('SettingsStore.GetAlbumScanProgress: Unexpected Error.', response.Errors);
                                return [2 /*return*/, {
                                        TotalAlbumCount: -1,
                                        ScannedAlbumCount: -1
                                    }];
                            }
                            return [2 /*return*/, response.Result];
                    }
                });
            });
        };
        SettingsStore.prototype.DbScanNew = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryPost('Settings/DbScanNew')];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded)
                                Dump_7.default.Error('SettingsStore.DbScanNew: Unexpected Error.', response.Errors);
                            return [2 /*return*/, response.Succeeded];
                    }
                });
            });
        };
        SettingsStore.prototype.DbCleanup = function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.QueryPost('Settings/DbCleanup')];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded)
                                Dump_7.default.Error('SettingsStore.DbCleanup: Unexpected Error.', response.Errors);
                            return [2 /*return*/, response.Succeeded];
                    }
                });
            });
        };
        SettingsStore.prototype.GetDbUpdateProgress = function () {
            return __awaiter(this, void 0, void 0, function () {
                var a, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            a = 1;
                            return [4 /*yield*/, this.QueryGet('Settings/UpdateProgress')];
                        case 1:
                            response = _a.sent();
                            if (!response.Succeeded) {
                                Dump_7.default.Error('SettingsStore.GetDbUpdateProgress: Unexpected Error.', response.Errors);
                                return [2 /*return*/, {
                                        IsRunning: false,
                                        Succeeded: false,
                                        Progress: 0,
                                        Message: 'Unexpected Error'
                                    }];
                            }
                            return [2 /*return*/, response.Result];
                    }
                });
            });
        };
        SettingsStore.MethodGetState = 'core.playback.get_state';
        return SettingsStore;
    }(JsonRpcQueryableBase_3.default));
    exports.default = SettingsStore;
});
define("Views/Shared/Dialogs/ProgressDialog", ["require", "exports", "vue-class-component", "Libraries", "Views/Bases/ViewBase"], function (require, exports, vue_class_component_17, Libraries_17, ViewBase_11) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ProgressDialog = /** @class */ (function (_super) {
        __extends(ProgressDialog, _super);
        function ProgressDialog() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.mainMessage = '';
            _this.currentMessage = '';
            _this.progress = 0;
            return _this;
        }
        Object.defineProperty(ProgressDialog.prototype, "ProgressBar", {
            get: function () {
                return this.$refs.ProgressBar;
            },
            enumerable: true,
            configurable: true
        });
        ProgressDialog.prototype.Show = function (title) {
            this.mainMessage = title;
            this.progress = 0;
            this.currentMessage = '';
            Libraries_17.default.Modal.Show(this);
        };
        ProgressDialog.prototype.SetUpdate = function (progressPercent, message) {
            if (message === void 0) { message = null; }
            this.progress = progressPercent;
            this.ProgressBar.setAttribute('style', "width: " + this.progress + "%;");
            this.ProgressBar.setAttribute('aria-valuenow', this.progress.toString());
            if (message)
                this.currentMessage = message;
        };
        ProgressDialog.prototype.Hide = function () {
            Libraries_17.default.Modal.Hide(this);
        };
        ProgressDialog = __decorate([
            vue_class_component_17.default({
                template: "<div class=\"modal fade\"\n    data-backdrop=\"static\"\n    data-keyboard=\"false\"\n    data-focus=\"true\"\n    style=\"display: none;\"\n    aria-hidden=\"true\">\n    <div class=\"modal-dialog\">\n        <div class=\"modal-content bg-info\">\n            <div class=\"modal-header\">\n                <h4 class=\"modal-title\">{{ mainMessage }}</h4>\n            </div>\n            <div class=\"modal-body\">\n                <div>\n                    <p>{{ currentMessage }}</p>\n                </div>\n                <div>\n                    <div class=\"progress\">\n                        <div class=\"progress-bar bg-success progress-bar-striped\"\n                            role=\"progressbar\"\n                            aria-valuenow=\"0\"\n                            aria-valuemin=\"0\"\n                            aria-valuemax=\"100\"\n                            ref=\"ProgressBar\">\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>"
            })
        ], ProgressDialog);
        return ProgressDialog;
    }(ViewBase_11.default));
    exports.default = ProgressDialog;
});
define("Views/Settings/Blocks/DbBlock", ["require", "exports", "vue-class-component", "Libraries", "Views/Bases/ContentDetailBase", "Views/Shared/Dialogs/ConfirmDialog", "Views/Shared/Dialogs/ProgressDialog"], function (require, exports, vue_class_component_18, Libraries_18, ContentDetailBase_2, ConfirmDialog_3, ProgressDialog_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DbBlock = /** @class */ (function (_super) {
        __extends(DbBlock, _super);
        function DbBlock() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.tabId = 'subtab-db';
            _this.linkId = 'nav-db';
            _this.resolver = null;
            _this.timer = null;
            _this.nowPolling = false;
            _this.disabled = 'disabled';
            return _this;
        }
        Object.defineProperty(DbBlock.prototype, "ScanNewButton", {
            get: function () {
                return this.$refs.ScanNewButton;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DbBlock.prototype, "CleanupButton", {
            get: function () {
                return this.$refs.CleanupButton;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DbBlock.prototype, "ConfirmDialog", {
            get: function () {
                return this.$refs.ConfirmDialog;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DbBlock.prototype, "ProgressDialog", {
            get: function () {
                return this.$refs.ProgressDialog;
            },
            enumerable: true,
            configurable: true
        });
        DbBlock.prototype.SetSettings = function (store, entity) {
            this.store = store;
            this.entity = entity;
        };
        DbBlock.prototype.OnSettingsUpdated = function () {
            return __awaiter(this, void 0, void 0, function () {
                var exists;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.SetButtonsByConnectable();
                            if (!(this.entity.IsMopidyConnectable && this.timer === null)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.store.ExistsData()];
                        case 1:
                            exists = _a.sent();
                            if (!exists) {
                                this.InitialScan();
                            }
                            _a.label = 2;
                        case 2: return [2 /*return*/, true];
                    }
                });
            });
        };
        DbBlock.prototype.SetButtonsByConnectable = function () {
            var scanNewClasses = this.ScanNewButton.classList;
            var cleanupClasses = this.CleanupButton.classList;
            if (this.entity.IsMopidyConnectable === true) {
                if (scanNewClasses.contains(this.disabled))
                    scanNewClasses.remove(this.disabled);
                if (cleanupClasses.contains(this.disabled))
                    cleanupClasses.remove(this.disabled);
            }
            else {
                if (!scanNewClasses.contains(this.disabled))
                    scanNewClasses.add(this.disabled);
                if (!cleanupClasses.contains(this.disabled))
                    cleanupClasses.add(this.disabled);
            }
        };
        DbBlock.prototype.InitialScan = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.entity.IsMopidyConnectable !== true) {
                                Libraries_18.default.ShowToast.Error('Mopidy Not Found...');
                                return [2 /*return*/];
                            }
                            this.ConfirmDialog.SetConfirmType(ConfirmDialog_3.ConfirmType.Normal);
                            this.ConfirmDialog.SetBody('Finder Database Initialize', [
                                'Mopidy found! but Finder-Data is not Initialized.',
                                '',
                                'Let\'s Scan New Albums for Finder Database Now!',
                                '',
                                'This operation may take about 10 minutes or more.',
                                'It is necessary to Finder use.',
                                '',
                                'Are you OK?'
                            ]);
                            return [4 /*yield*/, this.ConfirmDialog.Confirm()];
                        case 1:
                            result = _a.sent();
                            if (!result)
                                return [2 /*return*/];
                            this.TryScanNew();
                            return [2 /*return*/];
                    }
                });
            });
        };
        DbBlock.prototype.OnScanNewButtonClicked = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.entity.IsMopidyConnectable !== true) {
                                Libraries_18.default.ShowToast.Error('Mopidy Not Found...');
                                return [2 /*return*/];
                            }
                            this.ConfirmDialog.SetConfirmType(ConfirmDialog_3.ConfirmType.Warning);
                            this.ConfirmDialog.SetBody('Scan New Albums?', [
                                'Scan New Albums, and Add to Finder Database.',
                                '',
                                '* If you added new albums, You need to scan by mopidy first.',
                                '* ex) # sudo mopidyctl local scan',
                                '',
                                'This operation can take a very long time, ',
                                'depending on the number of songs, or the device it\'s running.',
                                '',
                                'Are you sure?'
                            ]);
                            return [4 /*yield*/, this.ConfirmDialog.Confirm()];
                        case 1:
                            result = _a.sent();
                            if (!result)
                                return [2 /*return*/];
                            this.TryScanNew();
                            return [2 /*return*/];
                    }
                });
            });
        };
        DbBlock.prototype.TryScanNew = function () {
            var _this = this;
            return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.store.DbScanNew()];
                        case 1:
                            result = _a.sent();
                            if (result === true) {
                                this.resolver = resolve;
                                this.ShowProgress('Scannin New Albums...');
                                return [2 /*return*/, true];
                            }
                            else {
                                this.entity.SetBusy(false);
                                Libraries_18.default.ShowToast.Error('Cleanup Order Failed...');
                                return [2 /*return*/, false];
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        DbBlock.prototype.OnCleanupButtonClicked = function () {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.entity.IsMopidyConnectable !== true) {
                                Libraries_18.default.ShowToast.Error('Mopidy Not Found...');
                                return [2 /*return*/];
                            }
                            this.ConfirmDialog.SetConfirmType(ConfirmDialog_3.ConfirmType.Danger);
                            this.ConfirmDialog.SetBody('Cleanup Mopidy.Finder Database?', [
                                'Mopidy.Finder\'s Database is Deleted & Re-Scanned.',
                                '',
                                'This operation can take a very long time, ',
                                'depending on the number of songs, or the device it\'s running.',
                                '',
                                'Are you sure?'
                            ]);
                            return [4 /*yield*/, this.ConfirmDialog.Confirm()];
                        case 1:
                            result = _a.sent();
                            if (!result)
                                return [2 /*return*/];
                            this.TryRefresh();
                            return [2 /*return*/];
                    }
                });
            });
        };
        DbBlock.prototype.TryRefresh = function () {
            var _this = this;
            return new Promise(function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.store.DbCleanup()];
                        case 1:
                            result = _a.sent();
                            if (result === true) {
                                this.resolver = resolve;
                                this.ShowProgress('Cleanuping Database...');
                                return [2 /*return*/, true];
                            }
                            else {
                                Libraries_18.default.ShowToast.Error('Scan Order Failed...');
                                return [2 /*return*/, false];
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        DbBlock.prototype.ShowProgress = function (args) {
            return __awaiter(this, void 0, void 0, function () {
                var title;
                var _this = this;
                return __generator(this, function (_a) {
                    if (this.timer !== null) {
                        Libraries_18.default.ShowToast.Error('Already Processing...');
                        return [2 /*return*/, false];
                    }
                    this.entity.SetBusy(true);
                    title = (typeof args === 'string')
                        ? args
                        : ((args.UpdateType === 'Cleanup')
                            ? 'Cleanuping Database...'
                            : 'Scannin New Albums...');
                    this.ProgressDialog.Show(title);
                    this.timer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var status;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (this.nowPolling)
                                        return [2 /*return*/];
                                    this.nowPolling = true;
                                    return [4 /*yield*/, this.store.GetDbUpdateProgress()];
                                case 1:
                                    status = _a.sent();
                                    this.nowPolling = false;
                                    if (status.IsRunning) {
                                        this.ProgressDialog.SetUpdate(status.Progress, status.Message);
                                        return [2 /*return*/, false];
                                    }
                                    else {
                                        clearInterval(this.timer);
                                        this.timer = null;
                                        this.ProgressDialog.Hide();
                                        this.entity.SetBusy(false);
                                        (status.Succeeded)
                                            ? Libraries_18.default.ShowToast.Success('Database Updated!')
                                            : Libraries_18.default.ShowToast.Error('Update Failed...');
                                        if (this.resolver)
                                            this.resolver(status.Succeeded);
                                        return [2 /*return*/, true];
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); }, 1000);
                    return [2 /*return*/, true];
                });
            });
        };
        DbBlock = __decorate([
            vue_class_component_18.default({
                template: "<div class=\"row\">\n    <div class=\"col-12\">\n        <div class=\"card\">\n            <div class=\"card-header with-border bg-warning\">\n                <h3 class=\"card-title\">\n                    <i class=\"fa fa-database\" />\n                    Refresh Relation Data\n                </h3>\n            </div>\n            <div class=\"card-body\">\n                <div class=\"form-row\">\n                    <div class=\"col-md-3 px-2\">\n                        <p>\n                            Scan New Albums.<br/>\n                            The data in <strong>Mopidy Itself is not affected.</strong>\n                        </p>\n                        <p class=\"d-flex flex-row justify-content-center\">\n                            <button class=\"btn btn-app btn-outline-warning disabled button-database\"\n                                @click=\"OnScanNewButtonClicked\"\n                                ref=\"ScanNewButton\">\n                                <i class=\"fa fa-search-plus\"></i> Scan New\n                            </button>\n                        </p>\n                    </div>\n                    <div class=\"col-md-3 px-2\">\n                        <p>\n                            Delete All and Refresh.<br/>\n                            The data in <strong>Mopidy Itself is not affected.</strong>\n                        </p>\n                        <p class=\"d-flex flex-row justify-content-center\">\n                            <button class=\"btn btn-app btn-outline-warning disabled button-database\"\n                                @click=\"OnCleanupButtonClicked\"\n                                ref=\"CleanupButton\">\n                                <i class=\"fa fa-refresh\"></i> Cleanup\n                            </button>\n                        </p>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <confirm-dialog\n        ref=\"ConfirmDialog\" />\n    <progress-dialog\n        ref=\"ProgressDialog\" />\n</div>",
                components: {
                    'confirm-dialog': ConfirmDialog_3.default,
                    'progress-dialog': ProgressDialog_1.default,
                }
            })
        ], DbBlock);
        return DbBlock;
    }(ContentDetailBase_2.default));
    exports.default = DbBlock;
});
define("Views/Settings/Blocks/MopidyBlock", ["require", "exports", "vue-class-component", "Libraries", "Utils/Delay", "Views/Bases/ContentDetailBase"], function (require, exports, vue_class_component_19, Libraries_19, Delay_8, ContentDetailBase_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MopidyBlockEvents = {
        SettingsUpdated: 'SettingsUpdated'
    };
    var MopidyBlock = /** @class */ (function (_super) {
        __extends(MopidyBlock, _super);
        function MopidyBlock() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.tabId = 'subtab-mopidy';
            _this.linkId = 'nav-mopidy';
            _this.classInvalid = 'is-invalid';
            _this.connectionClasses = {
                True: {
                    Icon: 'fa fa-link',
                    Wrapper: 'connection-icon connectable'
                },
                False: {
                    Icon: 'fa fa-chain-broken',
                    Wrapper: 'connection-icon notconnectable'
                }
            };
            return _this;
        }
        Object.defineProperty(MopidyBlock.prototype, "ServerAddressInput", {
            get: function () {
                return this.$refs.ServerAddressInput;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MopidyBlock.prototype, "ServerPortInput", {
            get: function () {
                return this.$refs.ServerPortInput;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MopidyBlock.prototype, "IconWrapper", {
            get: function () {
                return this.$refs.IconWrapper;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MopidyBlock.prototype, "Icon", {
            get: function () {
                return this.$refs.Icon;
            },
            enumerable: true,
            configurable: true
        });
        MopidyBlock.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    _super.prototype.Initialize.call(this);
                    this.Update = this.Update.bind(this);
                    this.lazyUpdater = Delay_8.default.DelayedOnce(function () {
                        console.log('lazyUpdater Run.');
                        _this.Update();
                    }, 2000);
                    return [2 /*return*/, true];
                });
            });
        };
        MopidyBlock.prototype.SetSettings = function (store, entity) {
            this.store = store;
            this.entity = entity;
            this.ServerAddressInput.value = this.entity.ServerAddress;
            this.ServerPortInput.value = this.entity.ServerPort.toString();
            this.Update();
        };
        MopidyBlock.prototype.OnServerAddressInput = function () {
            this.lazyUpdater.Exec();
        };
        MopidyBlock.prototype.OnServerPortInput = function () {
            this.lazyUpdater.Exec();
        };
        MopidyBlock.prototype.Update = function () {
            return __awaiter(this, void 0, void 0, function () {
                var address, port, update;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.Validate())
                                return [2 /*return*/];
                            address = this.ServerAddressInput.value;
                            port = parseInt(this.ServerPortInput.value, 10);
                            update = {
                                ServerAddress: address,
                                ServerPort: port
                            };
                            return [4 /*yield*/, this.store.Update(update)];
                        case 1:
                            if (!((_a.sent()) !== true)) return [3 /*break*/, 2];
                            Libraries_19.default.ShowToast.Error('Update Failed...');
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.store.TryConnect()];
                        case 3:
                            _a.sent();
                            if (this.entity.IsMopidyConnectable === true) {
                                Libraries_19.default.ShowToast.Success('Mopidy Found!');
                            }
                            else {
                                Libraries_19.default.ShowToast.Error('Mopidy Not Found...');
                            }
                            _a.label = 4;
                        case 4:
                            this.SetConnectionIcon();
                            this.$emit(exports.MopidyBlockEvents.SettingsUpdated);
                            return [2 /*return*/, this.entity.IsMopidyConnectable];
                    }
                });
            });
        };
        MopidyBlock.prototype.Validate = function () {
            var address = this.ServerAddressInput.value;
            var portString = this.ServerPortInput.value;
            var result = true;
            // 一旦エラークラスを削除
            if (this.ServerAddressInput.classList.contains(this.classInvalid))
                this.ServerAddressInput.classList.remove(this.classInvalid);
            if (this.ServerPortInput.classList.contains(this.classInvalid))
                this.ServerPortInput.classList.remove(this.classInvalid);
            if (!address || address.length <= 0) {
                this.ServerAddressInput.classList.add(this.classInvalid);
                if (result === true) {
                    Libraries_19.default.ShowToast.Warning('Address required.');
                    result = false;
                }
            }
            if (255 < address.length) {
                this.ServerAddressInput.classList.add(this.classInvalid);
                if (result === true) {
                    Libraries_19.default.ShowToast.Warning('Address too long.');
                    result = false;
                }
            }
            if (!portString || portString.length <= 0) {
                this.ServerPortInput.classList.add(this.classInvalid);
                if (result === true) {
                    Libraries_19.default.ShowToast.Warning('Port required.');
                    result = false;
                }
            }
            else {
                var port = parseInt(portString, 10);
                if (!port) {
                    this.ServerPortInput.classList.add(this.classInvalid);
                    Libraries_19.default.ShowToast.Warning('Please enter a number.');
                    result = false;
                }
            }
            return result;
        };
        MopidyBlock.prototype.SetConnectionIcon = function () {
            var wrapperClasses = this.IconWrapper.classList;
            var iconClasses = this.Icon.classList;
            if (this.entity.IsMopidyConnectable === true) {
                this.IconWrapper.className = this.connectionClasses.True.Wrapper;
                this.Icon.className = this.connectionClasses.True.Icon;
            }
            else {
                this.IconWrapper.className = this.connectionClasses.False.Wrapper;
                this.Icon.className = this.connectionClasses.False.Icon;
            }
        };
        MopidyBlock = __decorate([
            vue_class_component_19.default({
                template: "<div class=\"row\">\n    <div class=\"col-12\">\n        <div class=\"card\">\n            <div class=\"card-header with-border bg-warning\">\n                <h3 class=\"card-title\">\n                    <i class=\"fa fa-wifi\" />\n                    Set Your Mopidy\n                </h3>\n            </div>\n            <div class=\"card-body\">\n                <div class=\"form-row\">\n                    <div class=\"col-auto\">\n                        <div class=\"input-group\">\n                            <div class=\"input-group-prepend\">\n                                <div class=\"input-group-text\">http://</div>\n                            </div>\n                            <input type=\"text\"\n                                id=\"server_address\"\n                                maxlength=\"255\"\n                                class=\"form-control address\"\n                                placeholder=\"Server Address\"\n                                autocomplete=\"off\"\n                                ref=\"ServerAddressInput\"\n                                @input=\"OnServerAddressInput\" />\n                            <div class=\"input-group-prepend\">\n                                <div class=\"input-group-text\">:</div>\n                            </div>\n                            <input type=\"number\"\n                                maxlength=\"5\"\n                                class=\"form-control port\"\n                                placeholder=\"Port\"\n                                autocomplete=\"off\"\n                                ref=\"ServerPortInput\"\n                                @input=\"OnServerPortInput\" />\n                            <div class=\"input-group-append\">\n                                <div class=\"input-group-text\">/mopidy/</div>\n                            </div>\n                            <span class=\"connection-icon\"\n                                ref=\"IconWrapper\">\n                                <i class=\"\"\n                                    ref=\"Icon\"/>\n                            </span>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>"
            })
        ], MopidyBlock);
        return MopidyBlock;
    }(ContentDetailBase_3.default));
    exports.default = MopidyBlock;
});
define("Views/Settings/Blocks/ScanProgressBlock", ["require", "exports", "vue-class-component", "Views/Bases/ContentDetailBase"], function (require, exports, vue_class_component_20, ContentDetailBase_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ScanProgressBlock = /** @class */ (function (_super) {
        __extends(ScanProgressBlock, _super);
        function ScanProgressBlock() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.tabId = 'subtab-scanprogress';
            _this.linkId = 'nav-scanprogress';
            _this.totalAlbumCount = 0;
            _this.scanedAlbumCount = 0;
            return _this;
        }
        Object.defineProperty(ScanProgressBlock.prototype, "AlbumScanProgressBar", {
            get: function () {
                return this.$refs.AlbumScanProgressBar;
            },
            enumerable: true,
            configurable: true
        });
        ScanProgressBlock.prototype.SetSettings = function (store, entity) {
            this.store = store;
            this.entity = entity;
            this.SetTrackScanProgress();
        };
        ScanProgressBlock.prototype.SetTrackScanProgress = function () {
            return __awaiter(this, void 0, void 0, function () {
                var progress, rate;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.store.GetAlbumScanProgress()];
                        case 1:
                            progress = _a.sent();
                            this.totalAlbumCount = progress.TotalAlbumCount;
                            this.scanedAlbumCount = progress.ScannedAlbumCount;
                            rate = progress.ScannedAlbumCount / progress.TotalAlbumCount * 100;
                            this.AlbumScanProgressBar.setAttribute('style', "width: " + rate + "%;");
                            this.AlbumScanProgressBar.setAttribute('aria-valuenow', rate.toString());
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        ScanProgressBlock = __decorate([
            vue_class_component_20.default({
                template: "<div class=\"row\">\n    <div class=\"col-12\">\n        <div class=\"card\">\n            <div class=\"card-header with-border bg-warning\">\n                <h3 class=\"card-title\">\n                    <i class=\"fa fa-rocket\" />\n                    Album Scan Progress\n                </h3>\n            </div>\n            <div class=\"card-body\">\n                <div class=\"row\">\n                    <div class=\"col-auto\">\n                        <p>\n                            Mopidy.Finder Backend is always Scanning Album-Images and belonging Tracks.<br/>\n                            This action makes the operation response faster.\n                        </p>\n                        <div class=\"progress\">\n                            <div class=\"progress-bar bg-success progress-bar-striped\"\n                                role=\"progressbar\"\n                                aria-valuenow=\"0\"\n                                aria-valuemin=\"0\"\n                                aria-valuemax=\"100\"\n                                ref=\"AlbumScanProgressBar\">\n                            </div>\n                        </div>\n                        <p>\n                            Total: {{ totalAlbumCount }} Albums.<br/>\n                            Scaned: {{ scanedAlbumCount }} Albums competed.<br/>\n                        </p>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>"
            })
        ], ScanProgressBlock);
        return ScanProgressBlock;
    }(ContentDetailBase_4.default));
    exports.default = ScanProgressBlock;
});
define("Views/Settings/Settings", ["require", "exports", "vue-class-component", "Models/Settings/SettingsStore", "Utils/Exception", "Views/Bases/ContentBase", "Views/Bases/IContentDetail", "Views/Settings/Blocks/DbBlock", "Views/Settings/Blocks/MopidyBlock", "Views/Settings/Blocks/ScanProgressBlock", "Libraries"], function (require, exports, vue_class_component_21, SettingsStore_1, Exception_15, ContentBase_3, IContentDetail_4, DbBlock_1, MopidyBlock_1, ScanProgressBlock_1, Libraries_20) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SettingsEvents = {
        ServerFound: 'ServerFound'
    };
    var Settings = /** @class */ (function (_super) {
        __extends(Settings, _super);
        function Settings() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            // #region "IContentView"
            _this.details = [];
            return _this;
        }
        Object.defineProperty(Settings.prototype, "InnerDiv", {
            get: function () {
                return this.$refs.InnerDiv;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings.prototype, "MopidyBlock", {
            get: function () {
                return this.$refs.MopidyBlock;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings.prototype, "DbBlock", {
            get: function () {
                return this.$refs.DbBlock;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings.prototype, "ScanProgressBlock", {
            get: function () {
                return this.$refs.ScanProgressBlock;
            },
            enumerable: true,
            configurable: true
        });
        Settings.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _super.prototype.Initialize.call(this);
                            this.store = new SettingsStore_1.default();
                            _a = this;
                            return [4 /*yield*/, this.store.Get()];
                        case 1:
                            _a.entity = _b.sent();
                            // 利便性的にどうなのか、悩む。
                            Libraries_20.default.SlimScroll(this.InnerDiv, {
                                height: 'calc(100vh - 73px)',
                                wheelStep: 60
                            });
                            this.MopidyBlock.SetSettings(this.store, this.entity);
                            this.DbBlock.SetSettings(this.store, this.entity);
                            this.ScanProgressBlock.SetSettings(this.store, this.entity);
                            this.details.push(this.MopidyBlock);
                            this.details.push(this.DbBlock);
                            this.details.push(this.ScanProgressBlock);
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Settings.prototype.GetIsPermitLeave = function () {
            // DBリフレッシュ中はページ移動NGにする。
            return true;
        };
        Settings.prototype.InitContent = function () {
        };
        Settings.prototype.ShowContentDetail = function (args) {
            switch (args.Detail) {
                case IContentDetail_4.ContentDetails.SetMopidy:
                    this.HideAllDetails();
                    this.MopidyBlock.Show();
                    break;
                case IContentDetail_4.ContentDetails.Database:
                    this.HideAllDetails();
                    this.DbBlock.Show();
                    break;
                case IContentDetail_4.ContentDetails.ScanProgress:
                    this.HideAllDetails();
                    this.ScanProgressBlock.Show();
                    break;
                default:
                    Exception_15.default.Throw('Unexpected ContentDetail');
            }
        };
        // #endregion
        Settings.prototype.OnShow = function () {
            this.ScanProgressBlock.SetTrackScanProgress();
        };
        Settings.prototype.OnSettingsUpdated = function () {
            this.DbBlock.OnSettingsUpdated();
        };
        Settings.prototype.InitialScan = function () {
            this.DbBlock.InitialScan();
        };
        Settings.prototype.ShowProgress = function (args) {
            this.DbBlock.ShowProgress(args);
        };
        Settings = __decorate([
            vue_class_component_21.default({
                template: "<section class=\"content h-100 tab-pane fade\"\n    id=\"tab-settings\"\n    role=\"tabpanel\"\n    aria-labelledby=\"nav-settings\">\n    <div class=\"w-100 h-100\"\n        ref=\"InnerDiv\">\n        <mopidy-block\n            ref=\"MopidyBlock\"\n            @SettingsUpdated=\"OnSettingsUpdated\" />\n        <db-block\n            ref=\"DbBlock\" />\n        <scan-progress-block\n            ref=\"ScanProgressBlock\" />\n    </div>\n</section>",
                components: {
                    'mopidy-block': MopidyBlock_1.default,
                    'db-block': DbBlock_1.default,
                    'scan-progress-block': ScanProgressBlock_1.default,
                }
            })
        ], Settings);
        return Settings;
    }(ContentBase_3.default));
    exports.default = Settings;
});
define("Models/Mopidies/Monitor", ["require", "exports", "Utils/Dump", "Models/Bases/JsonRpcQueryableBase", "Models/Settings/Settings"], function (require, exports, Dump_8, JsonRpcQueryableBase_4, Settings_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MonitorEvents = {
        TrackChanged: 'TrackChanged',
        PlayerStateChanged: 'PlayerStateChanged',
        ProgressChanged: 'ProgressChanged',
        VolumeChanged: 'VolumeChanged',
        ShuffleChanged: 'ShuffleChanged',
        RepeatChanged: 'RepeatChanged'
    };
    var PlayerState;
    (function (PlayerState) {
        PlayerState["Playing"] = "playing";
        PlayerState["Stopped"] = "stopped";
        PlayerState["Paused"] = "paused";
    })(PlayerState = exports.PlayerState || (exports.PlayerState = {}));
    var Monitor = /** @class */ (function (_super) {
        __extends(Monitor, _super);
        function Monitor() {
            var _this = _super.call(this) || this;
            _this._settingsEntity = null;
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
            _this._isShuffle = false;
            _this._nowOnPollingProsess = false;
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
                Volume: 0,
                IsShuffle: false,
                IsRepeat: false
            };
            _this._settingsEntity = Settings_2.default.Entity;
            return _this;
        }
        Object.defineProperty(Monitor.prototype, "TlId", {
            get: function () {
                return this._tlId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monitor.prototype, "PlayerState", {
            get: function () {
                return this._playerState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monitor.prototype, "IsPlaying", {
            get: function () {
                return this._isPlaying;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monitor.prototype, "TrackName", {
            get: function () {
                return this._trackName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monitor.prototype, "TrackLength", {
            get: function () {
                return this._trackLength;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monitor.prototype, "TrackProgress", {
            get: function () {
                return this._trackProgress;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monitor.prototype, "ArtistName", {
            get: function () {
                return this._artistName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monitor.prototype, "ImageUri", {
            get: function () {
                return this._imageUri;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monitor.prototype, "Year", {
            get: function () {
                return this._year;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monitor.prototype, "Volume", {
            get: function () {
                return this._volume;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monitor.prototype, "IsShuffle", {
            get: function () {
                return this._isShuffle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monitor.prototype, "IsRepeat", {
            get: function () {
                return this._isRepeat;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Monitor.prototype, "ImageFullUri", {
            get: function () {
                return (!this._imageUri || this._imageUri == '')
                    ? location.protocol + "//" + location.host + "/img/nullImage.jpg"
                    : location.protocol + "//" + location.host + this._imageUri;
            },
            enumerable: true,
            configurable: true
        });
        Monitor.prototype.StartPolling = function () {
            var _this = this;
            if (this._timer !== null)
                this.StopPolling();
            this.Update();
            this._timer = setInterval(function () {
                _this.Update();
            }, Monitor.PollingMsec);
        };
        Monitor.prototype.StopPolling = function () {
            try {
                clearInterval(this._timer);
            }
            catch (e) {
                // 握りつぶす。
            }
            this._timer = null;
        };
        Monitor.prototype.Update = function () {
            return __awaiter(this, void 0, void 0, function () {
                var resState, resTrack, tlTrack, resTs, resVol, resRandom, resRepeat, ex_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this._nowOnPollingProsess
                                || this._settingsEntity.IsBusy
                                || !this._settingsEntity.IsMopidyConnectable) {
                                return [2 /*return*/];
                            }
                            this._nowOnPollingProsess = true;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 14, , 15]);
                            this.SetBackupValues();
                            return [4 /*yield*/, this.JsonRpcRequest(Monitor.Methods.GetState)];
                        case 2:
                            resState = _a.sent();
                            if (resState.result) {
                                this._playerState = resState.result;
                                this._isPlaying = (this._playerState === PlayerState.Playing);
                            }
                            return [4 /*yield*/, this.JsonRpcRequest(Monitor.Methods.GetCurrentTlTrack)];
                        case 3:
                            resTrack = _a.sent();
                            if (!resTrack.result) return [3 /*break*/, 6];
                            tlTrack = resTrack.result;
                            if (!(this._tlId !== tlTrack.tlid)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.SetTrackInfo(tlTrack)];
                        case 4:
                            _a.sent();
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
                        case 7:
                            if (!this._isPlaying) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.JsonRpcRequest(Monitor.Methods.GetTimePosition)];
                        case 8:
                            resTs = _a.sent();
                            this._trackProgress = (resTs.result)
                                ? parseInt(resTs.result, 10)
                                : 0;
                            return [3 /*break*/, 10];
                        case 9:
                            this._trackProgress = 0;
                            _a.label = 10;
                        case 10: return [4 /*yield*/, this.JsonRpcRequest(Monitor.Methods.GetVolume)];
                        case 11:
                            resVol = _a.sent();
                            this._volume = (resVol.result)
                                ? resVol.result
                                : 0;
                            return [4 /*yield*/, this.JsonRpcRequest(Monitor.Methods.GetRandom)];
                        case 12:
                            resRandom = _a.sent();
                            this._isShuffle = (resRandom.result)
                                ? resRandom.result
                                : false;
                            return [4 /*yield*/, this.JsonRpcRequest(Monitor.Methods.GetRepeat)];
                        case 13:
                            resRepeat = _a.sent();
                            this._isRepeat = (resRepeat.result)
                                ? resRepeat.result
                                : false;
                            this.DetectChanges();
                            return [3 /*break*/, 15];
                        case 14:
                            ex_1 = _a.sent();
                            Dump_8.default.Error('Polling Error', ex_1);
                            return [3 /*break*/, 15];
                        case 15:
                            this._nowOnPollingProsess = false;
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Monitor.prototype.SetTrackInfo = function (tlTrack) {
            return __awaiter(this, void 0, void 0, function () {
                var track, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            track = tlTrack.track;
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
                            if (!track.album) return [3 /*break*/, 3];
                            if (!(track.album.images && 0 < track.album.images.length)) return [3 /*break*/, 1];
                            this._imageUri = track.album.images[0];
                            return [3 /*break*/, 3];
                        case 1:
                            if (!track.album.uri) return [3 /*break*/, 3];
                            _a = this;
                            return [4 /*yield*/, this.GetAlbumImageUri(track.album.uri)];
                        case 2:
                            _a._imageUri = _b.sent();
                            _b.label = 3;
                        case 3: return [2 /*return*/, true];
                    }
                });
            });
        };
        Monitor.prototype.GetAlbumImageUri = function (uri) {
            return __awaiter(this, void 0, void 0, function () {
                var response, results, images;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcRequest(Monitor.Methods.GetImages, {
                                uris: [uri]
                            })];
                        case 1:
                            response = _a.sent();
                            if (!response || !response.result)
                                return [2 /*return*/, null];
                            results = response.result;
                            images = results[uri];
                            if (!images || images.length < 0)
                                return [2 /*return*/, null];
                            return [2 /*return*/, images[0]];
                    }
                });
            });
        };
        Monitor.prototype.SetBackupValues = function () {
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
                Volume: this.Volume,
                IsShuffle: this.IsShuffle,
                IsRepeat: this.IsRepeat
            };
        };
        Monitor.prototype.DetectChanges = function () {
            if (this._backupValues.TlId !== this.TlId)
                this.DispatchEvent(exports.MonitorEvents.TrackChanged);
            if (this._backupValues.PlayerState !== this.PlayerState)
                this.DispatchEvent(exports.MonitorEvents.PlayerStateChanged);
            if (this._backupValues.TrackProgress !== this.TrackProgress)
                this.DispatchEvent(exports.MonitorEvents.ProgressChanged);
            if (this._backupValues.Volume !== this.Volume)
                this.DispatchEvent(exports.MonitorEvents.VolumeChanged);
            if (this._backupValues.IsShuffle !== this.IsShuffle)
                this.DispatchEvent(exports.MonitorEvents.ShuffleChanged);
            if (this._backupValues.IsRepeat !== this.IsRepeat)
                this.DispatchEvent(exports.MonitorEvents.RepeatChanged);
        };
        Monitor.prototype.Dispose = function () {
            clearInterval(this._timer);
        };
        Monitor.PollingMsec = 2000;
        Monitor.Methods = {
            GetState: 'core.playback.get_state',
            GetCurrentTlTrack: 'core.playback.get_current_tl_track',
            GetTimePosition: 'core.playback.get_time_position',
            GetImages: 'core.library.get_images',
            GetVolume: 'core.mixer.get_volume',
            GetRandom: 'core.tracklist.get_random',
            GetRepeat: 'core.tracklist.get_repeat'
        };
        return Monitor;
    }(JsonRpcQueryableBase_4.default));
    exports.default = Monitor;
});
define("Models/Mopidies/Player", ["require", "exports", "Models/Bases/JsonRpcQueryableBase", "Models/Mopidies/Monitor"], function (require, exports, JsonRpcQueryableBase_5, Monitor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        function Player() {
            var _this = _super.call(this) || this;
            _this._monitor = new Monitor_1.default();
            return _this;
        }
        Object.defineProperty(Player.prototype, "Monitor", {
            get: function () {
                return this._monitor;
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.Play = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this._monitor.PlayerState === Monitor_1.PlayerState.Playing)
                                return [2 /*return*/, true];
                            if (!this._monitor.TlId)
                                return [2 /*return*/, false];
                            if (!(this._monitor.PlayerState === Monitor_1.PlayerState.Paused)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.JsonRpcNotice(Player.Methods.Resume)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2:
                            if (!(this._monitor.PlayerState === Monitor_1.PlayerState.Stopped)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.JsonRpcNotice(Player.Methods.Play, {
                                    tlid: this._monitor.TlId
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
                            if (this._monitor.PlayerState !== Monitor_1.PlayerState.Playing)
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
                                time_position: timePosition // eslint-disable-line
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
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcNotice(Player.Methods.SetVolume, {
                                volume: volume
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Player.prototype.SetShuffle = function (isShuffle) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcNotice(Player.Methods.SetRandom, {
                                value: isShuffle
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Player.prototype.SetRepeat = function (isRepeat) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.JsonRpcNotice(Player.Methods.SetRepeat, {
                                value: isRepeat
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Player.prototype.Dispose = function () {
            this._monitor.Dispose();
            this._monitor = null;
        };
        Player.Methods = {
            Play: 'core.playback.play',
            Resume: 'core.playback.resume',
            Pause: 'core.playback.pause',
            Stop: 'core.playback.stop',
            Next: 'core.playback.next',
            Previous: 'core.playback.previous',
            Seek: 'core.playback.seek',
            SetVolume: 'core.mixer.set_volume',
            SetRandom: 'core.tracklist.set_random',
            SetRepeat: 'core.tracklist.set_repeat'
        };
        return Player;
    }(JsonRpcQueryableBase_5.default));
    exports.default = Player;
});
define("Views/Sidebars/PlayerPanel", ["require", "exports", "vue-class-component", "Libraries", "Models/Mopidies/Monitor", "Models/Mopidies/Player", "Views/Bases/ViewBase"], function (require, exports, vue_class_component_22, Libraries_21, Monitor_2, Player_1, ViewBase_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PlayerPanelEvents = {
        Operated: 'Operated'
    };
    var PlayerPanel = /** @class */ (function (_super) {
        __extends(PlayerPanel, _super);
        function PlayerPanel() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.player = new Player_1.default();
            _this.monitor = _this.player.Monitor;
            return _this;
        }
        PlayerPanel_1 = PlayerPanel;
        Object.defineProperty(PlayerPanel.prototype, "ButtonShuffle", {
            get: function () {
                return this.$refs.ButtonShuffle;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerPanel.prototype, "ButtonRepeat", {
            get: function () {
                return this.$refs.ButtonRepeat;
            },
            enumerable: true,
            configurable: true
        });
        PlayerPanel.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    _super.prototype.Initialize.call(this);
                    this.volumeSlider = Libraries_21.default.$(this.$refs.Slider).ionRangeSlider({
                        onFinish: function (data) {
                            // スライダー操作完了時のイベント
                            _this.player.SetVolume(data.from);
                        }
                    });
                    this.volumeData = this.volumeSlider.data('ionRangeSlider');
                    this.monitor.AddEventListener(Monitor_2.MonitorEvents.VolumeChanged, function () {
                        _this.volumeData.update({
                            from: _this.monitor.Volume
                        });
                    });
                    this.monitor.AddEventListener(Monitor_2.MonitorEvents.ShuffleChanged, function () {
                        var enabled = !_this.ButtonShuffle.classList.contains(PlayerPanel_1.ClassDisabled);
                        if (_this.monitor.IsShuffle && !enabled)
                            _this.ButtonShuffle.classList.remove(PlayerPanel_1.ClassDisabled);
                        else if (!_this.monitor.IsShuffle && enabled)
                            _this.ButtonShuffle.classList.add(PlayerPanel_1.ClassDisabled);
                    });
                    this.monitor.AddEventListener(Monitor_2.MonitorEvents.RepeatChanged, function () {
                        var enabled = !_this.ButtonRepeat.classList.contains(PlayerPanel_1.ClassDisabled);
                        if (_this.monitor.IsRepeat && !enabled)
                            _this.ButtonRepeat.classList.remove(PlayerPanel_1.ClassDisabled);
                        else if (!_this.monitor.IsRepeat && enabled)
                            _this.ButtonRepeat.classList.add(PlayerPanel_1.ClassDisabled);
                    });
                    return [2 /*return*/, true];
                });
            });
        };
        PlayerPanel.prototype.StartMonitor = function () {
            // ポーリング一時停止するときは、ここをコメントアウト
            this.monitor.StartPolling();
        };
        PlayerPanel.prototype.StopMonitor = function () {
            this.monitor.StopPolling();
        };
        PlayerPanel.prototype.GetPlayPauseIconClass = function () {
            return (this.monitor.PlayerState === Monitor_2.PlayerState.Playing)
                ? 'fa fa-pause'
                : 'fa fa-play';
        };
        PlayerPanel.prototype.OnClickVolumeMin = function () {
            this.volumeData.update({
                from: 0
            });
            this.player.SetVolume(0);
            this.$emit(exports.PlayerPanelEvents.Operated);
        };
        PlayerPanel.prototype.OnClickVolumeMax = function () {
            this.volumeData.update({
                from: 100
            });
            this.player.SetVolume(100);
            this.$emit(exports.PlayerPanelEvents.Operated);
        };
        PlayerPanel.prototype.OnClickPrevious = function () {
            this.player.Previous();
            this.$emit(exports.PlayerPanelEvents.Operated);
        };
        PlayerPanel.prototype.OnClickPlayPause = function () {
            if (this.monitor.PlayerState === Monitor_2.PlayerState.Playing) {
                this.player.Pause();
            }
            else {
                this.player.Play();
            }
            this.$emit(exports.PlayerPanelEvents.Operated);
        };
        PlayerPanel.prototype.OnClickNext = function () {
            this.player.Next();
            this.$emit(exports.PlayerPanelEvents.Operated);
        };
        PlayerPanel.prototype.OnClickShuffle = function () {
            var enabled = !this.ButtonShuffle.classList.contains(PlayerPanel_1.ClassDisabled);
            this.player.SetShuffle(!enabled);
            this.$emit(exports.PlayerPanelEvents.Operated);
        };
        PlayerPanel.prototype.OnClickRepeat = function () {
            var enabled = !this.ButtonRepeat.classList.contains(PlayerPanel_1.ClassDisabled);
            this.player.SetRepeat(!enabled);
            this.$emit(exports.PlayerPanelEvents.Operated);
        };
        var PlayerPanel_1;
        PlayerPanel.ClassDisabled = 'disabled';
        PlayerPanel = PlayerPanel_1 = __decorate([
            vue_class_component_22.default({
                template: "<div class=\"card siderbar-control pb-10\">\n    <div class=\"card-body\">\n        <img v-bind:src=\"monitor.ImageFullUri\" class=\"albumart\" />\n        <h6 class=\"card-title\">{{ monitor.TrackName }}</h6>\n        <span>{{ monitor.ArtistName }}{{ (monitor.Year) ? '(' + monitor.Year + ')' : '' }}</span>\n        <div class=\"player-box btn-group btn-group-sm w-100 mt-2\" role=\"group\">\n            <button type=\"button\"\n                class=\"btn btn-warning\"\n                @click=\"OnClickPrevious\">\n                <i class=\"fa fa-fast-backward\" />\n            </button>\n            <button type=\"button\"\n                class=\"btn btn-warning\"\n                @click=\"OnClickPlayPause\">\n                <i v-bind:class=\"GetPlayPauseIconClass()\" ref=\"PlayPauseIcon\"/>\n            </button>\n            <button type=\"button\"\n                class=\"btn btn-warning\"\n                @click=\"OnClickNext\">\n                <i class=\"fa fa-fast-forward\" />\n            </button>\n        </div>\n\n        <div class=\"btn-group btn-group-sm w-100 mt-2\" role=\"group\">\n            <button type=\"button\"\n                class=\"btn btn-warning disabled\"\n                ref=\"ButtonShuffle\"\n                @click=\"OnClickShuffle\">\n                <i class=\"fa fa fa-random\" />\n            </button>\n            <button type=\"button\"\n                class=\"btn btn-warning disabled\"\n                ref=\"ButtonRepeat\"\n                @click=\"OnClickRepeat\" >\n                <i class=\"fa fa-retweet\" />\n            </button>\n        </div>\n\n        <div class=\"row volume-box w-100 mt-2\">\n            <div class=\"col-1 volume-button volume-min\">\n                <a @click=\"OnClickVolumeMin\">\n                    <i class=\"fa fa-volume-off\" />\n                </a>\n            </div>\n            <div class=\"col-10\">\n                <input type=\"text\"\n                    data-type=\"single\"\n                    data-min=\"0\"\n                    data-max=\"100\"\n                    data-from=\"100\"\n                    data-grid=\"true\"\n                    data-hide-min-max=\"true\"\n                    ref=\"Slider\" />\n            </div>\n            <div class=\"col-1 volume-button volume-max\">\n                <a @click=\"OnClickVolumeMax\">\n                    <i class=\"fa fa-volume-up\" />\n                </a>\n            </div>\n        </div>\n    </div>\n</div>"
            })
        ], PlayerPanel);
        return PlayerPanel;
    }(ViewBase_12.default));
    exports.default = PlayerPanel;
});
define("Views/Sidebars/Sidebar", ["require", "exports", "vue-class-component", "Libraries", "Utils/Exception", "Views/Bases/IContent", "Views/Bases/TabBase", "Views/Bases/ViewBase", "Views/Events/BootstrapEvents", "Views/Sidebars/PlayerPanel"], function (require, exports, vue_class_component_23, Libraries_22, Exception_16, IContent_2, TabBase_2, ViewBase_13, BootstrapEvents_3, PlayerPanel_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SideBarEvents = {
        Operated: 'Operated',
        ContentOrdered: 'ContentOrdered',
        TabEventRecieved: 'TabEventRecieved'
    };
    exports.NavigationAriaControls = {
        Finder: 'tab-finder',
        Playlists: 'tab-playlists',
        Settings: 'tab-settings'
    };
    var SideBar = /** @class */ (function (_super) {
        __extends(SideBar, _super);
        function SideBar() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SideBar_1 = SideBar;
        Object.defineProperty(SideBar.prototype, "SideBarSection", {
            get: function () {
                return this.$refs.SideBarSection;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SideBar.prototype, "NavigationFinder", {
            get: function () {
                return this.$refs.NavigationFinder;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SideBar.prototype, "NavigationPlaylists", {
            get: function () {
                return this.$refs.NavigationPlaylists;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SideBar.prototype, "NavigationSettings", {
            get: function () {
                return this.$refs.NavigationSettings;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SideBar.prototype, "PlayerPanel", {
            get: function () {
                return this.$refs.PlayerPanel;
            },
            enumerable: true,
            configurable: true
        });
        SideBar.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    _super.prototype.Initialize.call(this);
                    Libraries_22.default.SlimScroll(this.SideBarSection, {
                        height: 'calc(100%)'
                    });
                    this.navigationAnchors = Libraries_22.default.$([
                        this.NavigationFinder,
                        this.NavigationPlaylists,
                        this.NavigationSettings
                    ]);
                    this.navigationAnchors.on(BootstrapEvents_3.TabEvents.Show, function (args) {
                        _this.EmitTabEvent(TabBase_2.TabEvents.Show, args);
                    });
                    this.navigationAnchors.on(BootstrapEvents_3.TabEvents.Shown, function (args) {
                        _this.EmitTabEvent(TabBase_2.TabEvents.Shown, args);
                    });
                    this.navigationAnchors.on(BootstrapEvents_3.TabEvents.Hide, function (args) {
                        _this.EmitTabEvent(TabBase_2.TabEvents.Hide, args);
                    });
                    this.navigationAnchors.on(BootstrapEvents_3.TabEvents.Hidden, function (args) {
                        _this.EmitTabEvent(TabBase_2.TabEvents.Hidden, args);
                    });
                    return [2 /*return*/, true];
                });
            });
        };
        SideBar.prototype.EmitTabEvent = function (eventName, args) {
            var anchor = args.currentTarget;
            var naviTypeString = anchor.getAttribute('aria-controls');
            var content;
            switch (naviTypeString) {
                case exports.NavigationAriaControls.Finder:
                    content = IContent_2.Contents.Finder;
                    break;
                case exports.NavigationAriaControls.Playlists:
                    content = IContent_2.Contents.Playlists;
                    break;
                case exports.NavigationAriaControls.Settings:
                    content = IContent_2.Contents.Settings;
                    break;
                default:
                    Exception_16.default.Throw('Unexpected Tab Kind', naviTypeString);
            }
            var emitArgs = {
                Event: eventName,
                Content: content
            };
            this.$emit(exports.SideBarEvents.TabEventRecieved, emitArgs);
        };
        SideBar.prototype.OnNavigationClicked = function (args) {
            var anchor = args.currentTarget;
            var naviTypeString = anchor.getAttribute('aria-controls');
            // クリックイベントではコンテンツを変更しない。
            args.preventDefault();
            args.stopPropagation();
            var content;
            switch (naviTypeString) {
                case exports.NavigationAriaControls.Finder:
                    content = IContent_2.Contents.Finder;
                    break;
                case exports.NavigationAriaControls.Playlists:
                    content = IContent_2.Contents.Playlists;
                    break;
                case exports.NavigationAriaControls.Settings:
                    content = IContent_2.Contents.Settings;
                    break;
                default:
                    Exception_16.default.Throw('Unexpected Tab Kind', naviTypeString);
            }
            var orderedArgs = {
                Content: content,
                Permitted: true
            };
            this.$emit(exports.SideBarEvents.ContentOrdered, orderedArgs);
            if (orderedArgs.Permitted === true)
                this.$emit(exports.SideBarEvents.Operated);
        };
        SideBar.prototype.SetNavigation = function (content) {
            switch (content) {
                case IContent_2.Contents.Finder:
                    Libraries_22.default.$(this.NavigationFinder).tab(SideBar_1.ShowTabMethod);
                    break;
                case IContent_2.Contents.Playlists:
                    Libraries_22.default.$(this.NavigationPlaylists).tab(SideBar_1.ShowTabMethod);
                    break;
                case IContent_2.Contents.Settings:
                    Libraries_22.default.$(this.NavigationSettings).tab(SideBar_1.ShowTabMethod);
                    break;
                default:
                    Exception_16.default.Throw('Unexpected Content Ordered.', content);
            }
        };
        SideBar.prototype.OnOperated = function () {
            this.$emit(exports.SideBarEvents.Operated);
        };
        SideBar.prototype.OnShown = function () {
            this.PlayerPanel.StartMonitor();
        };
        SideBar.prototype.OnCollapsed = function () {
            this.PlayerPanel.StopMonitor();
        };
        var SideBar_1;
        SideBar.ShowTabMethod = 'show';
        SideBar = SideBar_1 = __decorate([
            vue_class_component_23.default({
                template: "<aside class=\"main-sidebar sidebar-dark-warning elevation-4\">\n    <div class=\"brand-link navbar-secondary\">\n        <span class=\"brand-text font-weight-light\">Mopidy.Finder</span>\n    </div>\n    <section\n        class=\"sidebar\"\n        ref=\"SideBarSection\">\n        <div class=\"w-100 inner-sidebar\">\n            <nav class=\"mt-2\">\n                <ul class=\"nav nav-pills nav-sidebar flex-column\" role=\"tablist\">\n                    <li class=\"nav-item\">\n                        <a class=\"nav-link\"\n                            id=\"nav-finder\"\n                            href=\"#tab-finder\"\n                            role=\"tab\"\n                            data-toggle=\"tab\"\n                            aria-controls=\"tab-finder\"\n                            aria-selected=\"false\"\n                            ref=\"NavigationFinder\"\n                            @click=\"OnNavigationClicked\" >\n                            <i class=\"fa fa-search nav-icon\" />\n                            <p>Finder</p>\n                        </a>\n                    </li>\n                    <li class=\"nav-item\">\n                        <a class=\"nav-link\"\n                            id=\"nav-playlists\"\n                            href=\"#tab-playlists\"\n                            role=\"tab\"\n                            data-toggle=\"tab\"\n                            aria-controls=\"tab-playlists\"\n                            aria-selected=\"false\"\n                            ref=\"NavigationPlaylists\"\n                            @click=\"OnNavigationClicked\" >\n                            <i class=\"fa fa-bookmark nav-icon\" />\n                            <p>Playlists</p>\n                        </a>\n                    </li>\n                    <li class=\"nav-item\">\n                        <a class=\"nav-link\"\n                            id=\"nav-settings\"\n                            href=\"#tab-settings\"\n                            role=\"tab\"\n                            data-toggle=\"tab\"\n                            aria-controls=\"tab-settings\"\n                            aria-selected=\"false\"\n                            ref=\"NavigationSettings\"\n                            @click=\"OnNavigationClicked\" >\n                            <i class=\"fa fa-cog nav-icon\" />\n                            <p>Settings</p>\n                        </a>\n                    </li>\n                </ul>\n            </nav>\n            <div class=\"row mt-2\">\n                <div class=\"col-12\">\n                    <player-panel\n                        ref=\"PlayerPanel\"\n                        @Operated=\"OnOperated\"/>\n                </div>\n            </div>\n        </div>\n    </section>\n</aside>",
                components: {
                    'player-panel': PlayerPanel_2.default
                }
            })
        ], SideBar);
        return SideBar;
    }(ViewBase_13.default));
    exports.default = SideBar;
});
define("Views/RootView", ["require", "exports", "vue-class-component", "Views/Bases/ViewBase", "Views/Finders/Finder", "Views/HeaderBars/HeaderBar", "Views/Playlists/Playlists", "Views/Settings/Settings", "Views/Sidebars/Sidebar"], function (require, exports, vue_class_component_24, ViewBase_14, Finder_1, HeaderBar_1, Playlists_1, Settings_3, SideBar_2) {
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
        Object.defineProperty(RootView.prototype, "SideBar", {
            get: function () {
                return this.$refs.SideBar;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RootView.prototype, "Finder", {
            get: function () {
                return this.$refs.Finder;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RootView.prototype, "Playlists", {
            get: function () {
                return this.$refs.Playlists;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RootView.prototype, "Settings", {
            get: function () {
                return this.$refs.Settings;
            },
            enumerable: true,
            configurable: true
        });
        RootView.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, _super.prototype.Initialize.call(this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        RootView = __decorate([
            vue_class_component_24.default({
                template: "<div class=\"wrapper\" style=\"height: 100%; min-height: 100%;\">\n    <header-bar\n        ref=\"HeaderBar\" />\n    <sidebar\n        ref=\"SideBar\" />\n    <div class=\"content-wrapper h-100 pt-3 tab-content\">\n        <finder\n            ref=\"Finder\" />\n        <playlists\n            ref=\"Playlists\" />\n        <settings\n            ref=\"Settings\" />\n    </div>\n</div>",
                components: {
                    'header-bar': HeaderBar_1.default,
                    'sidebar': SideBar_2.default,
                    'finder': Finder_1.default,
                    'playlists': Playlists_1.default,
                    'settings': Settings_3.default
                }
            })
        ], RootView);
        return RootView;
    }(ViewBase_14.default));
    exports.default = RootView;
});
define("Controllers/ContentController", ["require", "exports", "Utils/Exception", "Views/Bases/IContent", "Views/Bases/TabBase", "Views/Finders/Finder", "Views/HeaderBars/HeaderBar", "Views/Playlists/Playlists", "Views/Settings/Settings"], function (require, exports, Exception_17, IContent_3, TabBase_3, Finder_2, HeaderBar_2, Playlists_2, Settings_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ContentController = /** @class */ (function () {
        function ContentController(rootView) {
            var _this = this;
            this._headerBar = null;
            this._sideBar = null;
            this._finder = null;
            this._playlists = null;
            this._settings = null;
            this._currentContent = null;
            this._allContents = [];
            this._headerBar = rootView.HeaderBar;
            this._sideBar = rootView.SideBar;
            this._finder = rootView.Finder;
            this._playlists = rootView.Playlists;
            this._settings = rootView.Settings;
            this._allContents.push(this._finder);
            this._allContents.push(this._playlists);
            this._allContents.push(this._settings);
            this._headerBar.$on(HeaderBar_2.HeaderBarEvents.DetailOrdered, function (args) {
                _this.GetContent(args.Content).ShowContentDetail(args);
            });
            this._finder.$on(Finder_2.FinderEvents.PlaylistUpdated, function () {
                _this._playlists.RefreshPlaylist();
            });
            this._playlists.$on(Playlists_2.PlaylistsEvents.PlaylistsUpdated, function () {
                _this._finder.RefreshPlaylist();
            });
            this._settings.$on(Settings_4.SettingsEvents.ServerFound, function () {
                _this._finder.ForceRefresh();
                _this._playlists.RefreshPlaylist();
            });
        }
        ContentController.prototype.EmitTabEvent = function (args) {
            switch (args.Event) {
                case TabBase_3.TabEvents.Show:
                    this.GetContent(args.Content).OnShow();
                    break;
                case TabBase_3.TabEvents.Shown:
                    this.GetContent(args.Content).OnShown();
                    break;
                case TabBase_3.TabEvents.Hide:
                    this.GetContent(args.Content).OnHide();
                    break;
                case TabBase_3.TabEvents.Hidden:
                    this.GetContent(args.Content).OnHidden();
                    break;
                default:
                    Exception_17.default.Throw('Unexpected TabEvent.', args);
            }
        };
        ContentController.prototype.GetContent = function (content) {
            switch (content) {
                case IContent_3.Contents.Finder:
                    return this._finder;
                case IContent_3.Contents.Playlists:
                    return this._playlists;
                case IContent_3.Contents.Settings:
                    return this._settings;
                default:
                    Exception_17.default.Throw('Unexpected Content.', content);
            }
        };
        ContentController.prototype.SetCurrentContent = function (content) {
            this._sideBar.SetNavigation(content);
            var headerArgs = {
                Content: content
            };
            this._headerBar.SetHeader(headerArgs);
            this._currentContent = this.GetContent(content);
            this._currentContent.InitContent();
        };
        ContentController.prototype.CanLeave = function () {
            return (!this._currentContent)
                ? true
                : this._currentContent.GetIsPermitLeave();
        };
        ContentController.prototype.ContentToFullscreen = function () {
            for (var i = 0; i < this._allContents.length; i++)
                this._allContents[i].SetDetailToFulscreen();
        };
        ContentController.prototype.ContentToColumn = function () {
            for (var i = 0; i < this._allContents.length; i++)
                this._allContents[i].SetDetailToColumn();
        };
        ContentController.prototype.ShowSettingsDbProgress = function (updateProgress) {
            if (this._currentContent !== this._settings)
                this.SetCurrentContent(IContent_3.Contents.Settings);
            this._settings.ShowProgress(updateProgress);
        };
        ContentController.prototype.ShowSettingsInitialScan = function () {
            if (this._currentContent !== this._settings)
                this.SetCurrentContent(IContent_3.Contents.Settings);
            this._settings.InitialScan();
        };
        return ContentController;
    }());
    exports.default = ContentController;
});
define("Controllers/NavigationController", ["require", "exports", "Libraries", "Models/Settings/SettingsStore", "Views/Bases/IContent", "Views/HeaderBars/HeaderBar", "Views/Sidebars/Sidebar"], function (require, exports, Libraries_23, SettingsStore_2, IContent_4, HeaderBar_3, SideBar_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NavigationController = /** @class */ (function () {
        function NavigationController(contentController, rootView) {
            var _this = this;
            this._content = null;
            this._headerBar = null;
            this._sideBar = null;
            this._viewport = Libraries_23.default.ResponsiveBootstrapToolkit;
            this._content = contentController;
            this._headerBar = rootView.HeaderBar;
            this._sideBar = rootView.SideBar;
            Libraries_23.default.$(window).resize(this._viewport.changed(function () {
                _this.AdjustScreen();
            }));
            this._headerBar.$on(HeaderBar_3.HeaderBarEvents.SideBarShown, function () {
                _this._sideBar.OnShown();
            });
            this._headerBar.$on(HeaderBar_3.HeaderBarEvents.SideBarCollapsed, function () {
                _this._sideBar.OnCollapsed();
            });
            this._sideBar.$on(SideBar_3.SideBarEvents.ContentOrdered, function (args) {
                // カレント画面の移動に支障がある場合は移動しない。
                args.Permitted = _this._content.CanLeave();
                if (!args.Permitted)
                    return;
                _this._content.SetCurrentContent(args.Content);
            });
            // Bootstrap-Tabイベントのプロキシ
            this._sideBar.$on(SideBar_3.SideBarEvents.TabEventRecieved, function (args) {
                _this._content.EmitTabEvent(args);
            });
            this._sideBar.$on(SideBar_3.SideBarEvents.Operated, function () {
                if (_this._viewport.is('<=lg'))
                    _this._headerBar.SetSideBarClose();
            });
            this.AdjustScreen();
            (this._headerBar.GetIsSideBarVisible())
                ? this._sideBar.OnShown()
                : this._sideBar.OnCollapsed();
            this.InitialNavigation();
        }
        NavigationController.prototype.InitialNavigation = function () {
            return __awaiter(this, void 0, void 0, function () {
                var store, isConnectable, updateProgress, isDbUpdating, content, existsData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            store = new SettingsStore_2.default();
                            return [4 /*yield*/, store.TryConnect()];
                        case 1:
                            isConnectable = _a.sent();
                            return [4 /*yield*/, store.GetDbUpdateProgress()];
                        case 2:
                            updateProgress = _a.sent();
                            isDbUpdating = (updateProgress.UpdateType !== 'None');
                            content = (store.Entity.IsMopidyConnectable !== true || isDbUpdating !== false)
                                ? IContent_4.Contents.Settings
                                : IContent_4.Contents.Finder;
                            this._content.SetCurrentContent(content);
                            if (!isDbUpdating) return [3 /*break*/, 3];
                            this._content.ShowSettingsDbProgress(updateProgress);
                            return [3 /*break*/, 5];
                        case 3:
                            if (!store.Entity.IsMopidyConnectable) return [3 /*break*/, 5];
                            return [4 /*yield*/, store.ExistsData()];
                        case 4:
                            existsData = _a.sent();
                            if (!existsData)
                                this._content.ShowSettingsInitialScan();
                            _a.label = 5;
                        case 5: return [2 /*return*/, true];
                    }
                });
            });
        };
        NavigationController.prototype.AdjustScreen = function () {
            // コンテンツは、smサイズを基点にカラム<-->フルスクリーンを切り替える。
            if (this._viewport.is('<=sm')) {
                this._content.ContentToFullscreen();
            }
            else if (this._viewport.is('>sm')) {
                this._content.ContentToColumn();
            }
            // サイドバーは、lgサイズを基点に常時表示<-->操作終了で非表示化を切り替える。
            if (this._viewport.is('<=lg')) {
                this._headerBar.SetSideBarClose();
            }
            else if (this._viewport.is('>lg')) {
                this._headerBar.SetSideBarOpen();
            }
        };
        return NavigationController;
    }());
    exports.default = NavigationController;
});
define("Controllers/RootController", ["require", "exports", "Views/RootView", "Controllers/NavigationController", "Controllers/ContentController"], function (require, exports, RootView_1, NavigationController_1, ContentController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RootController = /** @class */ (function () {
        function RootController() {
            this.Initialize();
        }
        RootController.prototype.Initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this._rootView = new RootView_1.default();
                            this._rootView.$mount(RootController.RootId);
                            return [4 /*yield*/, this._rootView.Initialize()];
                        case 1:
                            _a.sent();
                            this._content = new ContentController_1.default(this._rootView);
                            this._navigation = new NavigationController_1.default(this._content, this._rootView);
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        RootController.RootId = '#root';
        return RootController;
    }());
    exports.default = RootController;
});
define("Main", ["require", "exports", "Libraries", "Controllers/RootController"], function (require, exports, Libraries_24, RootController_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Main = /** @class */ (function () {
        function Main() {
        }
        Main.prototype.Init = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    Libraries_24.default.Initialize();
                    this._root = new RootController_1.default();
                    return [2 /*return*/, this];
                });
            });
        };
        return Main;
    }());
    var main = (new Main()).Init(); // eslint-disable-line
});
//# sourceMappingURL=tsout.js.map