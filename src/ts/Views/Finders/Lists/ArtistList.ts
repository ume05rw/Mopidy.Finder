/// <reference path="../../../../../types/adminlte/index.d.ts" />
import * as AdminLte from 'admin-lte/dist/js/adminlte';
import * as _ from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import Libraries from '../../../Libraries';
import Artist from '../../../Models/Artists/Artist';
import ArtistStore from '../../../Models/Artists/ArtistStore';
import ViewBase from '../../Bases/ViewBase';
import { WidgetEvents } from '../../Events/AdminLteEvents';
import { Events, ISelectionChangedArgs } from '../../Events/FinderEvents';
import SelectionItem from '../../Shared/SelectionItem';

Vue.use(InfiniteLoading);

@Component({
    template: `<div class="col-md-3">
    <div id="artistList" class="card">
        <div class="card-header with-border bg-info">
            <h3 class="card-title">Artists</h3>
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
                <infinite-loading @infinite="OnInfinite" ref="InfiniteLoading"></infinite-loading>
            </ul>
        </div>
    </div>
</div>`,
    components: {
        'selection-item': SelectionItem
    }
})
export default class ArtistList extends ViewBase {

    private store: ArtistStore = new ArtistStore();
    private page: number = 1;
    private genreIds: number[] = [];
    private entities: Artist[] = [];
    private viewport = Libraries.ResponsiveBootstrapToolkit;
    private boxWidget: AdminLte.Widget;
    private isExpanded: boolean = true;

    private get InfiniteLoading(): InfiniteLoading {
        return this.$refs.InfiniteLoading as InfiniteLoading;
    }

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

        return true;
    }

    private OnCollapleClick(): void {
        this.boxWidget.toggle();
    }

    private async OnInfinite($state: StateChanger): Promise<boolean> {
        
        var result = await this.store.GetList(this.genreIds, this.page);

        if (0 < result.ResultList.length)
            this.entities = this.entities.concat(result.ResultList);

        if (this.entities.length < result.TotalLength) {
            $state.loaded();
            this.page++;
        } else {
            $state.complete();
        }

        return true;
    }

    private OnClickRefresh(): void {
        this.Refresh();
        this.$emit(Events.Refreshed);
    }

    private OnSelectionChanged(args: ISelectionChangedArgs): void {
        this.$emit(Events.SelectionChanged, args);
    }

    private Refresh(): void {
        this.page = 1;
        this.entities = [];
        this.$nextTick(() => {
            this.InfiniteLoading.stateChanger.reset();
            (this.InfiniteLoading as any).attemptLoad();
        });
    }

    private ToggleListByViewport(): void {
        if (this.viewport.is('<=sm') && this.isExpanded) {
            this.boxWidget.collapse();
        } else if (this.viewport.is('>sm') && !this.isExpanded) {
            this.boxWidget.expand();
        }
    }

    private HasGenre(genreId: number): boolean {
        return (0 <= _.indexOf(this.genreIds, genreId));
    }

    public AddFilterGenreId(genreId: number): void {
        if (!this.HasGenre(genreId)) {
            this.genreIds.push(genreId);
            this.Refresh();
        }
    }

    public RemoveFilterGenreId(genreId: number): void {
        if (this.HasGenre(genreId)) {
            _.pull(this.genreIds, genreId);
            this.Refresh();
        }
    }

    public RemoveAllFilters(): void {
        if (0 < this.genreIds.length) {
            this.genreIds = [];
            this.Refresh();
        }
    }
}
