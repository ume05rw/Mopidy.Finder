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
define("Main", ["require", "exports", "Models/Entities/Song"], function (require, exports, Song_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    try {
        console.log('TS Start');
        var song1 = new Song_1.default('01', 'new york, new york');
        var song2 = new Song_1.default(null, 'stranger in the night');
        console.log(song1);
        console.log(song2);
    }
    catch (ex) {
        console.log(ex);
    }
});
//# sourceMappingURL=tsout.js.map