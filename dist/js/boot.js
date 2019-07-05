
// windowに指定フォーマットで出力したライブラリ群を読み込む。
// 出力内容は src/js/libraries.js を参照のこと。
// ** defineの引数functionは実際に使用されるまで実行されないため、
// ** for文などのループで定義出来ない。

// es6-promise
define('es6-promise', ["exports"], function (exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = window.__globals['es6-promise'];
});

// jquery
define('jquery', ["exports"], function (exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = window.__globals['jquery'];
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

// vue
define('vue', ["exports"], function (exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = window.__globals['vue'];
});

// vue-class-component
define('vue-class-component', ["exports"], function (exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = window.__globals['vue-class-component'];
});

// vue-property-decorator
define('vue-property-decorator', ["exports"], function (exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var instance = window.__globals['vue-property-decorator'];
    for (var key in instance) {
        var val = instance[key];
        exports[key] = val;
    }
});

// vue-infinite-loading
define('vue-infinite-loading', ["exports"], function (exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = window.__globals['vue-infinite-loading'];
});



// ダミー: site.css
define('../css/site.css', ["exports"], function (exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {};
});

// ダミー: animate.css/animate.css
define('animate.css/animate.css', ["exports"], function (exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {};
});

// ダミー: font-awesome/css/font-awesome.css
define('font-awesome/css/font-awesome.css', ["exports"], function (exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {};
});

// ダミー: admin-lte/dist/css/adminlte.css
define('admin-lte/dist/css/adminlte.css', ["exports"], function (exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {};
});

// ダミー: admin-lte/dist/js/adminlte.js
define('admin-lte/dist/js/adminlte.js', ["exports"], function (exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {};
});

// AMD出力されたTSロジックを起動する。
var app = require(['Main']);
