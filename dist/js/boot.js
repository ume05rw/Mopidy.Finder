
// windowに指定フォーマットで出力したライブラリ群を読み込む。
// 出力内容は src/js/libraries.js を参照のこと。
// ** defineの引数functionは実際に使用されるまで実行されないため、
// ** for文などのループで定義出来ない。

// ダミーのCSS
define('../css/site.css', ["exports"], function (exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {};
});

// es6-promise
define('es6-promise', ["exports"], function (exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = window.__globals['es6-promise'];
});

// lodash
define('lodash', ["exports"], function (exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var instance = window.__globals['lodash'];
    for (var key in instance) {
        var val = instance[key];
        exports[key] = val;
    }
});

// Axios
define('axios', ["exports"], function (exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = window.__globals['axios'];
});

// qs
define('qs', ["exports"], function (exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var instance = window.__globals['qs'];
    for (var key in instance) {
        var val = instance[key];
        exports[key] = val;
    }
});

// linq.js
define('linq', ["exports"], function (exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = window.__globals['linq'];
});


// AMD出力されたTSロジックを起動する。
var app = require(['Main']);
