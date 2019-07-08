import 'animate.css/animate.css';
import 'font-awesome/css/font-awesome.css';
import 'admin-lte/dist/css/adminlte.css';
import '../css/site.css';
import jQuery from 'jquery';
import 'admin-lte/dist/js/adminlte.js';
import * as _ from 'lodash';
import Axios from 'axios';
import * as qs from 'qs';
import * as Enumerable from 'linq';
import Vue from 'vue';
import VueClassComponent from 'vue-class-component';
import * as VuePropertyDecorator from 'vue-property-decorator';
import InfiniteLoading from 'vue-infinite-loading';

window.__globals = {
    'jquery': jQuery,
    'lodash': _,
    'axios': Axios,
    'qs': qs,
    'linq': Enumerable,
    'vue': Vue,
    'vue-class-component': VueClassComponent,
    'vue-property-decorator': VuePropertyDecorator,
    'vue-infinite-loading': InfiniteLoading
};
