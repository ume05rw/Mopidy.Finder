import 'animate.css/animate.css';
import 'font-awesome/css/font-awesome.css';
import 'admin-lte/dist/css/adminlte.css';
import 'admin-lte/plugins/ion-rangeslider/css/ion.rangeSlider.css';
import '../css/site.css';

import * as jQuery from 'jquery';

// 先にJQueryを読ませておく。
import 'admin-lte/dist/js/adminlte';
import 'admin-lte/plugins/bootstrap/js/bootstrap';
import 'admin-lte/plugins/ion-rangeslider/js/ion.rangeSlider';

import * as ResponsiveBootstrapToolkit from 'responsive-toolkit/dist/bootstrap-toolkit';
import * as Enumerable from 'linq';

/**
 * VS開発時のステップデバッグ環境を維持するため、開発環境ではAMD形式で
 * ライブラリをexportしている。
 * AMD形式では、単一名かつdefault-export無しのライブラリがexport出来ないため、
 * 強制的にdefault-exportしている。
 * プロダクションビルドでは書いた通りで動くため、その差分を吸収するためのロジック。
 */
export default class Libraries {

    /**
     * linq.js
     * ※バージョンは3.1.1に固定する。最新版の型定義がes5に対応しなくなったため。
     */
    public static readonly Enumerable = (((Enumerable as any).default)
        ? (Enumerable as any).default
        : Enumerable) as typeof Enumerable;

    /**
     * JQuery: Admin-LTE, Bootsrapが依存している。
     */
    public static readonly jQuery = (((jQuery as any).default)
        ? (jQuery as any).default
        : jQuery) as typeof jQuery;
    public static readonly $ = Libraries.jQuery;

    /**
     * Bootstrap Toolkit
     * 画面サイズ切替判定で使用
     */
    public static readonly ResponsiveBootstrapToolkit = (((ResponsiveBootstrapToolkit as any).default)
        ? (ResponsiveBootstrapToolkit as any).default
        : ResponsiveBootstrapToolkit) as typeof ResponsiveBootstrapToolkit;


    public static Initialize(): void {
        // ResponsiveBootstrapToolkitをbootstrap4に対応させる
        // https://github.com/maciej-gurban/responsive-bootstrap-toolkit/issues/52
        Libraries.ResponsiveBootstrapToolkit.use('bs4', {
            'xs': Libraries.$('<div class="d-xs-block d-sm-none d-md-none d-lg-none d-xl-none"></div>'),
            'sm': Libraries.$('<div class="d-none d-sm-block d-md-none d-lg-none d-xl-none"></div>'),
            'md': Libraries.$('<div class="d-none d-md-block d-sm-none d-lg-none d-xl-none"></div>'),
            'lg': Libraries.$('<div class="d-none d-lg-block d-sm-none d-md-none d-xl-none"></div>'),
            'xl': Libraries.$('<div class="d-none d-xl-block d-sm-none d-md-none d-lg-none"></div>')
        });
    }
};
