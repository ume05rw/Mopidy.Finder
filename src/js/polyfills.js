import * as es6Promise from 'es6-promise';
import * as smoothscroll from 'smoothscroll-polyfill';
import objectAssign from 'object.assign';

es6Promise.polyfill();
smoothscroll.polyfill();

if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: objectAssign
    });
}
