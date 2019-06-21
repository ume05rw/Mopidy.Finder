import '../css/site.css';
import * as es6Promise from 'es6-promise';
import * as _ from 'lodash';
import Axios from 'axios';
import * as Enumerable from 'linq';
try {
    es6Promise.polyfill();
    console.log('Promise Polyfill OK.');
} catch (ex) {
    console.log('Promise Poliyfill Error!');
}


window.__globals = {
    'es6-promise': es6Promise,
    'lodash': _,
    'axios': Axios,
    'linq': Enumerable
};
