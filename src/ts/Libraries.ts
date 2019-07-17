/**
 * --------------------------------------------------
 * CSS
 * --------------------------------------------------
 */
import 'animate.css/animate.css';
import 'font-awesome/css/font-awesome.css';
import 'admin-lte/dist/css/adminlte.css';
import 'admin-lte/plugins/ion-rangeslider/css/ion.rangeSlider.css';
import 'admin-lte/plugins/sweetalert2/sweetalert2.css';
import '../css/site.css';

/**
 * --------------------------------------------------
 * JQuery本体とJQuery依存ライブラリ
 * --------------------------------------------------
 */
import jQuery = require('jquery');
import * as ResponsiveBootstrapToolkit from 'responsive-toolkit/dist/bootstrap-toolkit';
import 'admin-lte/plugins/bootstrap/js/bootstrap.bundle';
//import * as AdminLte from 'admin-lte/dist/js/adminlte';
import 'admin-lte/plugins/ion-rangeslider/js/ion.rangeSlider';
import 'jquery-slimscroll';

/**
 * --------------------------------------------------
 * 独立したライブラリ
 * --------------------------------------------------
 * ※defaultエクスポート変換しているもののみ、ここで
 * ※実体取得ロジックを挟む。
 * --------------------------------------------------
 */
import * as Enumerable from 'linq';
import * as Mopidy from 'mopidy';
import Swal from 'admin-lte/plugins/sweetalert2/sweetalert2';

// SweetAlert2 は個別読み込みOK.
//import Swal from 'admin-lte/plugins/sweetalert2/sweetalert2';

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

    /**
     * Mopidy
     */
    public static readonly Mopidy = (((Mopidy as any).default)
        ? (Mopidy as any).default
        : Mopidy) as typeof Mopidy;


    public static readonly SetTooltip: (element: HTMLElement, message: string) => void = (element: HTMLElement, message: string): void => {
        Libraries.$(element).tooltip({
            placement: 'top',
            title: message
        });
    };

    /**
     * SweetAlert2 - Toast
     *
     * type: 'success' | 'error' | 'warning' | 'info' | 'question'
     * ex) Toast.fire({ type: 'success', title: 'any message here.' });
     */
    private static readonly Toast: Swal = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });

    private static readonly InnerShowToast: (toastType: Swal.SweetAlertType, message: string) => void = (toastType, message): void => {
        Libraries.Toast.fire({
            type: toastType,
            title: message
        });
    };

    /**
     * SweerAlert2のToast表示メソッド
     * 型定義を書く補完が使えなくなるので、しないでおく。
     * ↓多分何かが間違っている...
     * ShowToast: {[toastType: string]: (message: string) => void }
     */
    public static readonly ShowToast = { // eslint-disable-line
        Success: (message: string): void => Libraries.InnerShowToast('success', message),
        Info: (message: string): void => Libraries.InnerShowToast('info', message),
        Question: (message: string): void => Libraries.InnerShowToast('question', message),
        Warning: (message: string): void => Libraries.InnerShowToast('warning', message),
        Error: (message: string): void => Libraries.InnerShowToast('error', message)
    }

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
}

