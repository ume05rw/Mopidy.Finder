import 'animate.css/animate.css';
import 'font-awesome/css/font-awesome.css';
import 'admin-lte/dist/css/adminlte.css';
import 'admin-lte/plugins/ion-rangeSlider/css/ion.rangeSlider.css';
import '../css/site.css';

import jQuery from 'jquery';
import ResponsiveBootstrapToolkit from 'responsive-toolkit/dist/bootstrap-toolkit';
import * as Bootstrap from 'admin-lte/plugins/bootstrap/js/bootstrap';
import * as _ from 'lodash';
import Axios from 'axios';
import * as qs from 'qs';
import * as Enumerable from 'linq';
import * as AdminLte from 'admin-lte/dist/js/adminlte';
import Vue from 'vue';
import VueClassComponent from 'vue-class-component';
import * as VuePropertyDecorator from 'vue-property-decorator';
import InfiniteLoading from 'vue-infinite-loading';
import * as Mopidy from 'mopidy';

import 'admin-lte/plugins/ion-rangeslider/js/ion.rangeSlider';

window.__globals = {
    'jquery': jQuery,
    'admin-lte/plugins/bootstrap/js/bootstrap': Bootstrap,
    'responsive-toolkit/dist/bootstrap-toolkit': ResponsiveBootstrapToolkit,
    'lodash': _,
    'axios': Axios,
    'qs': qs,
    'linq': Enumerable,
    'mopidy': Mopidy,
    'admin-lte/dist/js/adminlte': AdminLte,
    'vue': Vue,
    'vue-class-component': VueClassComponent,
    'vue-property-decorator': VuePropertyDecorator,
    'vue-infinite-loading': InfiniteLoading
};
