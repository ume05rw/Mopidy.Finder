import '../css/site.css';
import * as es6Promise from 'es6-promise';
import * as _ from 'lodash';
import Axios from 'axios';
import * as linq from 'linq';
try {
    es6Promise.polyfill();
    console.log('Promise Polyfill OK.');
} catch (ex) {
    console.log('Promise Poliyfill Error!');
}


window.__globals = {
    'lodash': _,
    'axios': Axios,
    'linq': linq
};
