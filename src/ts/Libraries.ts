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
import jQuery = require('jquery');
import * as ResponsiveBootstrapToolkit from 'responsive-toolkit/dist/bootstrap-toolkit';
import 'admin-lte/plugins/bootstrap/js/bootstrap.bundle';
import * as AdminLte from 'admin-lte/dist/js/adminlte';
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
import * as Hammer from 'hammerjs';
import Swal from 'admin-lte/plugins/sweetalert2/sweetalert2';
import Vue from 'vue';
import SettingsStore from './Models/Settings/SettingsStore';

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

    public static readonly JQueryEventBinds: {
        On: (element: HTMLElement | Vue, eventName: string, handler: (ev: any) => void) => void;
        Off: (element: HTMLElement | Vue, eventName: string, handler: (ev: any) => void) => void;
        OffAll: (element: HTMLElement | Vue, eventName: string) => void;
    } = {
        On: (element: HTMLElement | Vue, eventName: string, handler: (ev: any) => void): void => {
            const elem = Libraries.GetElement(element);
            Libraries.$(elem).on(eventName, handler);
        },
        Off: (element: HTMLElement | Vue, eventName: string, handler: (ev: any) => void): void => {
            const elem = Libraries.GetElement(element);
            Libraries.$(elem).off(eventName, handler);
        },
        OffAll: (element: HTMLElement | Vue, eventName: string): void => {
            const elem = Libraries.GetElement(element);
            Libraries.$(elem).off(eventName);
        }
    }

    /**
     * Bootstrap Toolkit
     * 画面サイズ切替判定で使用
     */
    public static readonly ResponsiveBootstrapToolkit = (((ResponsiveBootstrapToolkit as any).default)
        ? (ResponsiveBootstrapToolkit as any).default
        : ResponsiveBootstrapToolkit) as typeof ResponsiveBootstrapToolkit;

    /**
     * Hammer
     */
    public static readonly Hammer = (((Hammer as any).default)
        ? (Hammer as any).default
        : Hammer) as typeof Hammer;

    // Androidでスワイプが反応しない現象への対応を入れたが、
    // Androidでは修正されるもののPC等で反応しなくなった。
    // スクローラブルな要素に touch-action: pan-y; を入れることで解決した。
    // https://github.com/hammerjs/hammer.js/issues/1065
    //public static readonly CreateHorizontalSwipeDetector: (element: Element) => HammerManager
    //    = (element: Element) => {
    //        const result = new Libraries.Hammer(element as HTMLElement, {
    //            touchAction: 'auto',
    //            inputClass: Libraries.Hammer.SUPPORT_POINTER_EVENTS
    //                ? Libraries.Hammer.PointerEventInput
    //                : Libraries.Hammer.TouchInput,
    //            recognizers: [
    //                [
    //                    Libraries.Hammer.Swipe, {
    //                        direction: Libraries.Hammer.DIRECTION_HORIZONTAL
    //                    }
    //                ]
    //            ]
    //        });
    //        result.get('swipe').set({
    //            direction: Libraries.Hammer.DIRECTION_HORIZONTAL
    //        });
    //        return result;
    //    };

    /**
     * AdminLTE
     */
    public static readonly AdminLte = AdminLte;

    /**
     * SlimScroll (on JQuery)
     */
    /* eslint-disable @typescript-eslint/indent */
    public static readonly SlimScroll: (element: HTMLElement, opstions?: ISlimScrollOption) => void
        = (element: HTMLElement, opstions?: ISlimScrollOption): void => {
            Libraries.$(element).slimScroll(opstions);
        };
    /* eslint-enable @typescript-eslint/indent */

    /**
     * Popper (on JQuery)
     */
    /* eslint-disable @typescript-eslint/indent */
    public static readonly SetTooltip: (element: HTMLElement, message: string) => void
        = (element: HTMLElement, message: string): void => {
            // タッチスクリーンの場合はツールティップを作らない。
            // 自動で非表示化出来そうなら戻す。
            if (Libraries.SettingsStore.Entity.IsTouchScreen)
                return;

            Libraries.$(element).tooltip({
                placement: 'top',
                title: message,
                trigger: 'hover',
                delay: {
                    show: 1000,
                    hide: 100
                }
            });
        };
    /* eslint-enable @typescript-eslint/indent */

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

    /* eslint-disable @typescript-eslint/indent */
    private static readonly InnerShowToast: (toastType: Swal.SweetAlertType, message: string) => void
        = (toastType, message): void => {
            Libraries.Toast.fire({
                type: toastType,
                title: message
            });
        };
    /* eslint-enable @typescript-eslint/indent */

    private static GetElement(arg: HTMLElement | Vue): HTMLElement {
        return (arg instanceof Vue)
            ? (arg as Vue).$el as HTMLElement
            : arg as HTMLElement;
    }

    /**
     * SweerAlert2のToast表示メソッド
     * 型定義が冗長なのはなんとかならんのか
     */
    public static readonly ShowToast: {
        Success: (message: string) => void;
        Info: (message: string) => void;
        Question: (message: string) => void;
        Warning: (message: string) => void;
        Error: (message: string) => void;
    } = {
        Success: (message: string): void => Libraries.InnerShowToast('success', message),
        Info: (message: string): void => Libraries.InnerShowToast('info', message),
        Question: (message: string): void => Libraries.InnerShowToast('question', message),
        Warning: (message: string): void => Libraries.InnerShowToast('warning', message),
        Error: (message: string): void => Libraries.InnerShowToast('error', message)
    }

    public static readonly Modal: {
        Show: (arg: HTMLElement | Vue) => void;
        Hide: (arg: HTMLElement | Vue) => void;
    } = {
        Show: (arg: HTMLElement | Vue): void => {
            const elem = Libraries.GetElement(arg);
            Libraries.$(elem).modal('show');
        },
        Hide: (arg: HTMLElement | Vue): void => {
            const elem = Libraries.GetElement(arg);
            Libraries.$(elem).modal('hide');
        }
    }

    private static SettingsStore: SettingsStore = null;

    public static Initialize(): void {
        Libraries.SettingsStore = new SettingsStore();
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

