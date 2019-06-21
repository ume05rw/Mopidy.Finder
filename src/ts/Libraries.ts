import Axios from 'axios';
import * as Enumerable from 'linq';
import * as es6Promise from 'es6-promise';

/**
 * VS開発時のステップデバッグ環境を維持するため、開発環境ではAMD形式で
 * ライブラリをexportしている。
 * AMD形式では、単一名かつdefault-export無しのライブラリがexport出来ないため、
 * 強制的にdefault-exportしている。
 * プロダクションビルドでは書いた通りで動くため、その差分を吸収するためのロジック。
 */
const Libraries = {
    Axios: Axios,

    // linq.jsのバージョンは3.1.1に固定する。最新版の型定義がes5に対応しなくなったため。
    Enumerable: (((Enumerable as any).default)
        ? (Enumerable as any).default
        : Enumerable) as typeof Enumerable,

    es6Promise: (((es6Promise as any).default)
        ? (es6Promise as any).default
        : es6Promise) as typeof es6Promise,
};
export default Libraries;
