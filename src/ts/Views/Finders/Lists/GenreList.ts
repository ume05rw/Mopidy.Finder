/// <reference path="../../../../../types/adminlte/index.d.ts" />
import * as AdminLte from 'admin-lte/dist/js/adminlte.js';
import * as _ from 'lodash';
import Component from 'vue-class-component';
import Libraries from '../../../Libraries';
import Genre from '../../../Models/Genres/Genre';
import GenreStore from '../../../Models/Genres/GenreStore';
import ViewBase from '../../Bases/ViewBase';
import { WidgetEvents } from '../../Events/AdminLteEvents';
import { Events, ISelectionChangedArgs } from '../../Events/FinderEvents';
import SelectionItem from '../../Shared/SelectionItem';

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
    private viewport = Libraries.ResponsiveBootstrapToolkit;
    private boxWidget: AdminLte.Widget;
    private isExpanded: boolean = true;

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

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
                this.ToggleListByViewport();
            })
        );

        _.delay(() => {
            this.ToggleListByViewport();
        }, 1000);

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

    private ToggleListByViewport(): void {
        if (this.viewport.is('<=sm') && this.isExpanded) {
            this.boxWidget.collapse();
        } else if (this.viewport.is('>sm') && !this.isExpanded) {
            this.boxWidget.expand();
        }
    }
}
