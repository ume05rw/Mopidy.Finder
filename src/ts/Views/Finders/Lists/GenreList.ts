/// <reference path="../../../../../types/adminlte/index.d.ts" />
import Component from 'vue-class-component';
import Genre from '../../../Models/Genres/Genre';
import GenreStore from '../../../Models/Genres/GenreStore';
import ViewBase from '../../Bases/ViewBase';
import { Events, ISelectionChangedArgs } from '../../Events/FinderEvents';
import SelectionItem from '../../Shared/SelectionItem';
import ResponsiveBootstrapToolkit from 'responsive-toolkit';
import * as AdminLte from 'admin-lte/dist/js/adminlte.js';
import { WidgetEvents } from '../../Events/AdminLteEvents';
import Libraries from '../../../Libraries';

@Component({
    template: `<div class="col-md-3">
    <div class="card">
        <div class="card-header with-border bg-green">
            <h3 class="card-title">Genres</h3>
            <div class="card-tools">
                <button
                    class="btn btn-tool d-inline d-md-none collapse"
                    ref="ButtonCollaple"
                    @click="OnCollapleClick" >
                    <i class="fa fa-minus" />
                </button>
                <button type="button"
                        class="btn btn-tool"
                        @click="OnClickRefresh" >
                    <i class="fa fa-repeat" />
                </button>
            </div>
        </div>
        <div class="card-body list-scrollable">
            <ul class="nav nav-pills h-100 d-flex flex-column flex-nowrap">
            <template v-for="entity in entities">
                <selection-item
                    ref="Items"
                    v-bind:entity="entity"
                    @SelectionChanged="OnSelectionChanged" />
            </template>
            </ul>
        </div>
    </div>
</div>`,
    components: {
        'selection-item': SelectionItem
    }
})
export default class GenreList extends ViewBase {

    private store: GenreStore = new GenreStore();
    private entities: Genre[] = [];
    private viewport = ResponsiveBootstrapToolkit;
    private boxWidget: AdminLte.Widget;
    private isExpanded: boolean = true;

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        // ResponsiveBootstrapToolkitをbootstrap4に対応させる
        // https://github.com/maciej-gurban/responsive-bootstrap-toolkit/issues/52
        this.viewport.use('bs4', {
            'xs': Libraries.$('<div class="d-xs-block d-sm-none d-md-none d-lg-none d-xl-none"></div>'),
            'sm': Libraries.$('<div class="d-none d-sm-block d-md-none d-lg-none d-xl-none"></div>'),
            'md': Libraries.$('<div class="d-none d-md-block d-sm-none d-lg-none d-xl-none"></div>'),
            'lg': Libraries.$('<div class="d-none d-lg-block d-sm-none d-md-none d-xl-none"></div>'),
            'xl': Libraries.$('<div class="d-none d-xl-block d-sm-none d-md-none d-lg-none"></div>')
        });

        const button = Libraries.$(this.$refs.ButtonCollaple as HTMLElement);

        this.boxWidget = new AdminLte.Widget(button);

        button.on(WidgetEvents.Collapsed, () => {
            this.isExpanded = false;
        });
        button.on(WidgetEvents.Expanded, () => {
            this.isExpanded = true;
        });

        (Libraries.$(window) as any).resize(
            this.viewport.changed(() => {
                if (this.viewport.is('<=sm') && this.isExpanded) {
                    this.boxWidget.collapse();
                } else if (this.viewport.is('>sm') && !this.isExpanded) {
                    this.boxWidget.expand();
                }
            })
        );

        this.Refresh();

        return true;
    }

    private OnCollapleClick(): void {
        this.boxWidget.toggle();
    }

    private OnClickRefresh(): void {
        this.Refresh();
        this.$emit(Events.Refreshed);
    }

    private OnSelectionChanged(args: ISelectionChangedArgs): void {
        this.$emit(Events.SelectionChanged, args);
    }

    public Refresh(): void {
        this.entities = [];

        this.store.GetList()
            .then((en) => {
                this.entities = en.toArray();
            });
    }
}
