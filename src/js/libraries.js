/**
 * --------------------------------------------------
 * CSS
 * --------------------------------------------------
 */
import 'animate.css/animate.css';
import 'font-awesome/css/font-awesome.css';
import '../css/adminlte.css';
import 'admin-lte/plugins/ion-rangeslider/css/ion.rangeSlider.css';
import 'admin-lte/plugins/sweetalert2/sweetalert2.css';
import '../css/bootstrap4-neon-glow.css';
import '../css/site.css';

/**
 * --------------------------------------------------
 * JQuery本体とJQuery依存ライブラリ
 * --------------------------------------------------
 */
import jQuery from 'jquery';
import ResponsiveBootstrapToolkit from 'responsive-toolkit/dist/bootstrap-toolkit';
import * as Bootstrap from 'admin-lte/plugins/bootstrap/js/bootstrap.bundle';
import * as AdminLte from 'admin-lte/dist/js/adminlte';
import 'admin-lte/plugins/ion-rangeslider/js/ion.rangeSlider';
import 'jquery-slimscroll';

/**
 * --------------------------------------------------
 * 独立したライブラリ
 * --------------------------------------------------
 */
import Swal from 'admin-lte/plugins/sweetalert2/sweetalert2';
import * as _ from 'lodash';
import Axios from 'axios';
import * as qs from 'qs';
import * as Enumerable from 'linq';
import Sortable from 'sortablejs/modular/sortable.complete.esm';
import * as Hammer from 'hammerjs';

/**
 * --------------------------------------------------
 * Vue本体とプラグイン
 * --------------------------------------------------
 */
import Vue from 'vue';
import VueClassComponent from 'vue-class-component';
import * as VuePropertyDecorator from 'vue-property-decorator';
import InfiniteLoading from 'vue-infinite-loading';


/**
 * --------------------------------------------------
 * AMDモジュール定義への受け渡し用
 * --------------------------------------------------
 */
window.__globals = {
    // --------------------------------------------------
    // JQuery本体とJQuery依存ライブラリ
    // --------------------------------------------------
    'jquery': jQuery,
    'admin-lte/plugins/bootstrap/js/bootstrap.bundle': Bootstrap,
    'responsive-toolkit/dist/bootstrap-toolkit': ResponsiveBootstrapToolkit,
    'admin-lte/dist/js/adminlte': AdminLte,

    // --------------------------------------------------
    // 独立したライブラリ
    // --------------------------------------------------
    'admin-lte/plugins/sweetalert2/sweetalert2': Swal,
    'lodash': _,
    'axios': Axios,
    'qs': qs,
    'linq': Enumerable,
    'sortablejs/modular/sortable.complete.esm': Sortable,
    'hammerjs': Hammer,

    // --------------------------------------------------
    // Vue本体とプラグイン
    // --------------------------------------------------
    'vue': Vue,
    'vue-class-component': VueClassComponent,
    'vue-property-decorator': VuePropertyDecorator,
    'vue-infinite-loading': InfiniteLoading
};

//console.log('libraries.js');
//console.log(Swal);
