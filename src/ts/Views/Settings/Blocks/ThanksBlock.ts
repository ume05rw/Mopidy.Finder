import Component from 'vue-class-component';
import Libraries from '../../../Libraries';
import { default as SettingsEntity } from '../../../Models/Settings/Settings';
import { default as SettingsStore, IUpdateProgress } from '../../../Models/Settings/SettingsStore';
import ContentDetailBase from '../../Bases/ContentDetailBase';
import { Contents } from '../../Bases/IContent';
import { ContentDetailEvents, ContentDetails, IContentSwipeArgs, SwipeDirection } from '../../Bases/IContentDetail';
import { SwipeEvents } from '../../Events/HammerEvents';
import { ConfirmType, default as ConfirmDialog } from '../../Shared/Dialogs/ConfirmDialog';
import ProgressDialog from '../../Shared/Dialogs/ProgressDialog';

@Component({
    template: `<div class="row content-detail">
    <div class="col-12 card-wrapper">
        <div class="card settings thanks">
            <div class="card-header with-border bg-warning">
                <h3 class="card-title">
                    <i class="fa fa-handshake-o" />
                    Thanks for all OSS Contributes
                </h3>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-12">
                        <p>
                            Mopidy.Finder is made up of many OSS and free implementations.<br/>
                            THANKS A LOT!
                        </p>
                        <div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">Mopidy</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://www.mopidy.com" target="_blank" title="Mopidy">
                                        https://www.mopidy.com
                                    </a><br/>
                                    Created By <a href="https://github.com/mopidy" target="_blank" title="GitHub">
                                        Stein Magnus Jodal and Contributors.
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">Bootstrap4 Theme Neon Glow</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://hackerthemes.com/bootstrap-themes/demo/neon-glow/" target="_blank" title="Bootstrap4 Theme Neon Glow">
                                        https://hackerthemes.com/bootstrap-themes/demo/neon-glow/
                                    </a><br/>
                                    Created By Alexander Rechsteiner
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">Bootstrap4</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://getbootstrap.com" target="_blank" title="Bootstrap4">
                                        https://getbootstrap.com
                                    </a><br/>
                                    Created By <a href="https://getbootstrap.com/docs/4.3/about/team/" target="_blank" title="Bootstrap Team">
                                        the Bootstrap team with the help of Contributors.
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">responsive-bootstrap-toolkit</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://github.com/maciej-gurban/responsive-bootstrap-toolkit" target="_blank" title="responsive-bootstrap-toolkit">
                                        https://github.com/maciej-gurban/responsive-bootstrap-toolkit
                                    </a><br/>
                                    Created By <a href="https://github.com/maciej-gurban/responsive-bootstrap-toolkit/graphs/contributors" target="_blank" title="responsive-bootstrap-toolkit Creators">
                                        responsive-bootstrap-toolkit Creators
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">Smashicons</h5>
                                </div>
                                <div class="card-body">
                                    Icons made by <a href="https://www.flaticon.com/authors/smashicons" target="_blank" title="Smashicons">Smashicons</a> from 
                                    <a href="https://www.flaticon.com/" target="_blank" title="Flaticon">www.flaticon.com</a> is licensed by 
                                    <a href="http://creativecommons.org/licenses/by/3.0/" target="_blank" title="Creative Commons BY 3.0">CC 3.0 BY</a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">Animate.css</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://daneden.github.io/animate.css/" target="_blank" title="Animate.css">
                                        https://daneden.github.io/animate.css/
                                    </a><br/>
                                    Created By <a href="https://daneden.me/" target="_blank" title="Daniel Eden">
                                        Daniel Eden.
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">Admin LTE ver3</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://adminlte.io/themes/dev/AdminLTE/index.html" target="_blank" title="Admin LTE ver3">
                                        https://adminlte.io/themes/dev/AdminLTE/index.html
                                    </a><br/>
                                    Created By <a href="http://adminlte.io/" target="_blank" title="AdminLTE.io">AdminLTE.io</a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">Font Awesome 4</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://fontawesome.com/v4.7.0/icons/" target="_blank" title="Font Awesome 4">
                                        https://fontawesome.com/v4.7.0/icons/
                                    </a><br/>
                                    Create By <a href="https://fontawesome.com/" target="_blank" title="Font Awesome">
                                        Font Awesome
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">jQuery</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://jquery.com" target="_blank" title="jQuery">
                                        https://jquery.com
                                    </a><br/>
                                    Created By <a href="https://jquery.org/team/" target="_blank" title="jQuery foundation">
                                        jQuery foundation
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">Ion.RangeSlider</h5>
                                </div>
                                <div class="card-body">
                                    <a href="http://ionden.com/a/plugins/ion.rangeSlider/" target="_blank" title="Ion.RangeSlider">
                                        http://ionden.com/a/plugins/ion.rangeSlider/
                                    </a><br/>
                                    Created By <a href="https://github.com/IonDen/ion.rangeSlider/graphs/contributors" target="_blank" title="Ion.RangeSlider Creators">
                                        Ion.RangeSlider Creators
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">SweetAlert2</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://sweetalert2.github.io" target="_blank" title="SweetAlert2">
                                        https://sweetalert2.github.io
                                    </a><br/>
                                    Created By <a href="https://github.com/sweetalert2/sweetalert2/graphs/contributors" target="_blank" title="SweetAlert2 Creators">
                                        SweetAlert2 Creators
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">Vue.js</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://jp.vuejs.org/index.html" target="_blank" title="">
                                        https://jp.vuejs.org/index.html
                                    </a><br/>
                                    Created By <a href="https://jp.vuejs.org/v2/guide/team.html" target="_blank" title="Vue team">
                                        Vue team
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">vue-infinite-loading</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://github.com/PeachScript/vue-infinite-loading" target="_blank" title="">
                                        https://github.com/PeachScript/vue-infinite-loading
                                    </a><br/>
                                    Created By <a href="https://github.com/PeachScript/vue-infinite-loading/graphs/contributors" target="_blank" title="vue-infinite-loading Creators">
                                        vue-infinite-loading Creators
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">Axios</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://github.com/axios/axios" target="_blank" title="Axios">
                                        https://github.com/axios/axios
                                    </a><br/>
                                    Created By <a href="https://github.com/orgs/axios/people" target="_blank" title="Axios Creators">
                                        Axios Creators
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">HAMMER.JS</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://hammerjs.github.io" target="_blank" title="HAMMER.JS">
                                        https://hammerjs.github.io
                                    </a><br/>
                                    Created By <a href="https://github.com/orgs/hammerjs/people" target="_blank" title="HAMMER.JS Creators">
                                        HAMMER.JS Creators
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">linq.js</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://unpkg.com/browse/linq@3.2.0/" target="_blank" title="linq.js">
                                        https://unpkg.com/browse/linq@3.2.0/
                                    </a><br/>
                                    Created By <a href="https://mjackson.me" target="_blank" title="Michael Jackson">
                                        Michael Jackson
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">lodash</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://lodash.com" target="_blank" title="lodash">
                                        https://lodash.com
                                    </a><br/>
                                    Created By <a href="https://github.com/orgs/lodash/people" target="_blank" title="lodash Creators">
                                        lodash Creators
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">qs</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://github.com/ljharb/qs" target="_blank" title="qs">
                                        https://github.com/ljharb/qs
                                    </a><br/>
                                    Created By <a href="https://github.com/ljharb/qs/graphs/contributors" target="_blank" title="qs Creators">
                                        qs Creators
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">SortableJS</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://github.com/SortableJS/Sortable" target="_blank" title="">
                                        https://github.com/SortableJS/Sortable
                                    </a><br/>
                                    Created By <a href="https://github.com/orgs/SortableJS/people" target="_blank" title="SortableJS Creators">
                                        SortableJS Creators
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">es6-promise</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://github.com/stefanpenner/es6-promise" target="_blank" title="es6-promise">
                                        https://github.com/stefanpenner/es6-promise
                                    </a><br/>
                                    Created By <a href="https://github.com/stefanpenner/es6-promise/graphs/contributors" target="_blank" title="es6-promise Creators">
                                        es6-promise Creators
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">object.assign</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://github.com/ljharb/object.assign" target="_blank" title="">
                                        https://github.com/ljharb/object.assign
                                    </a><br/>
                                    Created By <a href="https://github.com/ljharb/object.assign/graphs/contributors" target="_blank" title="object.assign Creators">
                                        object.assign Creators
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">smoothscroll-polyfill</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://github.com/iamdustan/smoothscroll" target="_blank" title="smoothscroll-polyfill">
                                        https://github.com/iamdustan/smoothscroll
                                    </a><br/>
                                    Created By <a href="https://github.com/iamdustan/smoothscroll/graphs/contributors" target="_blank" title="smoothscroll-polyfill Creators">
                                        smoothscroll-polyfill Creators
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">RequireJS</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://requirejs.org" target="_blank" title="RequireJS">
                                        https://requirejs.org
                                    </a><br/>
                                    Created By <a href="https://github.com/requirejs/requirejs/graphs/contributors" target="_blank" title="RequireJS Creators">
                                        RequireJS Creators
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">webpack</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://webpack.js.org" target="_blank" title="webpack">
                                        https://webpack.js.org
                                    </a><br/>
                                    Created By <a href="https://github.com/webpack/webpack/graphs/contributors" target="_blank" title="webpack Creators">
                                        webpack Creators
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">mocha</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://github.com/mochajs/mocha" target="_blank" title="mocha">
                                        https://github.com/mochajs/mocha
                                    </a><br/>
                                    Created By <a href="https://github.com/mochajs/mocha/graphs/contributors" target="_blank" title="mocha Creators">
                                        mocha Creators
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">chai</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://github.com/chaijs/chai" target="_blank" title="chai">
                                        https://github.com/chaijs/chai
                                    </a><br/>
                                    Created By <a href="https://github.com/chaijs/chai/graphs/contributors" target="_blank" title="chai Creators">
                                        chai Creators
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">ESLint</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://eslint.org" target="_blank" title="ESLint">
                                        https://eslint.org
                                    </a><br/>
                                    Created By <a href="https://eslint.org/team" target="_blank" title="ESLint Team">
                                        ESLint Team
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">ASP.NET Core 2.2</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-2.2" target="_blank" title="ASP.NET Core 2.2">
                                        https://docs.microsoft.com/en-us/aspnet/core/?view=aspnetcore-2.2
                                    </a><br/>
                                    Created By <a href="https://github.com/aspnet/AspNetCore/graphs/contributors" target="_blank" title="Microsoft and Contributers">
                                        Microsoft and Contributers
                                    </a>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header with-border bg-warning">
                                    <h5 class="card-title">Typescript 3.4</h5>
                                </div>
                                <div class="card-body">
                                    <a href="https://www.typescriptlang.org" target="_blank" title="Typescript">
                                        https://www.typescriptlang.org
                                    </a><br/>
                                    Created By <a href="https://github.com/microsoft/TypeScript/graphs/contributors" target="_blank" title="Microsoft and Contoributers">
                                        Microsoft and Contoributers
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>`
})
export default class ThanksBlock extends ContentDetailBase {

    protected readonly tabId: string = 'subtab-thanks';
    protected readonly linkId: string = 'nav-thanks';
    private swipeDetector: HammerManager;

    public async Initialize(): Promise<boolean> {
        super.Initialize();

        this.swipeDetector = new Libraries.Hammer(this.$el as HTMLElement);
        this.swipeDetector.get('swipe').set({
            direction: Libraries.Hammer.DIRECTION_HORIZONTAL
        });
        this.swipeDetector.on(SwipeEvents.Left, (): void => {
            const args: IContentSwipeArgs = {
                Content: Contents.Settings,
                ContentDetail: null,
                Direction: SwipeDirection.Left
            };
            this.$emit(ContentDetailEvents.Swiped, args);
        });

        this.swipeDetector.on(SwipeEvents.Right, (): void => {
            const args: IContentSwipeArgs = {
                Content: Contents.Settings,
                ContentDetail: ContentDetails.ScanProgress,
                Direction: SwipeDirection.Right
            };
            this.$emit(ContentDetailEvents.Swiped, args);
        });

        return true;
    }
}
