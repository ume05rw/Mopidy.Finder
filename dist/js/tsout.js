define("Libraries", ["require", "exports", "axios", "linq", "es6-promise"], function (require, exports, axios_1, Enumerable, es6Promise) {
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
        Axios: axios_1.default,
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
            console.log("hello");
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
define("Main", ["require", "exports", "Models/Entities/Song", "Libraries", "../css/site.css"], function (require, exports, Song_1, Libraries_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    try {
        Libraries_1.default.es6Promise.polyfill();
        console.log('Promise Polyfill OK.');
    }
    catch (ex) {
        console.log('Promise Poliyfill Error!');
    }
    try {
        //console.log('TS Start');
        var song1 = new Song_1.default('01', 'new york, new york');
        var song2 = new Song_1.default(null, 'stranger in the night');
        console.log(song1);
        console.log(song2);
        var En = Libraries_1.default.Enumerable;
    }
    catch (ex) {
        //console.log(ex);
    }
});
define("Models/Stores/SongStore", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SongStore = /** @class */ (function () {
        function SongStore() {
        }
        return SongStore;
    }());
    exports.default = SongStore;
});
//# sourceMappingURL=tsout.js.map