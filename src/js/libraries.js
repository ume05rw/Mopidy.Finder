import '../css/site.css';
import 'vue2-admin-lte/src/lib/css';
import 'vue2-admin-lte/src/lib/script';
import * as es6Promise from 'es6-promise';
import * as _ from 'lodash';
import Axios from 'axios';
import * as qs from 'qs';
import * as Enumerable from 'linq';
import Vue from 'vue';
import VueClassComponent from 'vue-class-component';
import * as VuePropertyDecorator from 'vue-property-decorator';

window.__globals = {
    'es6-promise': es6Promise,
    'lodash': _,
    'axios': Axios,
    'qs': qs,
    'linq': Enumerable,
    'vue': Vue,
    'vue-class-component': VueClassComponent,
    'vue-property-decorator': VuePropertyDecorator
};
