import * as Enumerable from 'linq';
import * as jQuery from 'jquery';
import * as ResponsiveBootstrapToolkit from 'responsive-toolkit/dist/bootstrap-toolkit';
import * as VueSlider from 'vue-slider-component';

/**
 * VS開発時のステップデバッグ環境を維持するため、開発環境ではAMD形式で
 * ライブラリをexportしている。
 * AMD形式では、単一名かつdefault-export無しのライブラリがexport出来ないため、
 * 強制的にdefault-exportしている。
 * プロダクションビルドでは書いた通りで動くため、その差分を吸収するためのロジック。
 */
const Libraries = {
    // linq.jsのバージョンは3.1.1に固定する。最新版の型定義がes5に対応しなくなったため。
    Enumerable: (((Enumerable as any).default)
        ? (Enumerable as any).default
        : Enumerable) as typeof Enumerable,
    jQuery: (((jQuery as any).default)
        ? (jQuery as any).default
        : jQuery) as typeof jQuery,
    $: (((jQuery as any).default)
        ? (jQuery as any).default
        : jQuery) as typeof jQuery,
    ResponsiveBootstrapToolkit: (((ResponsiveBootstrapToolkit as any).default)
        ? (ResponsiveBootstrapToolkit as any).default
        : ResponsiveBootstrapToolkit) as typeof ResponsiveBootstrapToolkit,
    VueSlider: VueSlider as Vue.Component,
};

// ResponsiveBootstrapToolkitをbootstrap4に対応させる
// https://github.com/maciej-gurban/responsive-bootstrap-toolkit/issues/52
ResponsiveBootstrapToolkit.use('bs4', {
    'xs': Libraries.$('<div class="d-xs-block d-sm-none d-md-none d-lg-none d-xl-none"></div>'),
    'sm': Libraries.$('<div class="d-none d-sm-block d-md-none d-lg-none d-xl-none"></div>'),
    'md': Libraries.$('<div class="d-none d-md-block d-sm-none d-lg-none d-xl-none"></div>'),
    'lg': Libraries.$('<div class="d-none d-lg-block d-sm-none d-md-none d-xl-none"></div>'),
    'xl': Libraries.$('<div class="d-none d-xl-block d-sm-none d-md-none d-lg-none"></div>')
});

export default Libraries;
