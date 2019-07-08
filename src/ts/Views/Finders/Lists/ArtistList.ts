/// <reference path="../../../../../types/adminlte/index.d.ts" />
import * as AdminLte from 'admin-lte/dist/js/adminlte.js';
import * as _ from 'lodash';
import ResponsiveBootstrapToolkit from 'responsive-toolkit';
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
    private viewport = ResponsiveBootstrapToolkit;
    private boxWidget: AdminLte.Widget;
    private isExpanded: boolean = true;

    private get InfiniteLoading(): InfiniteLoading {
        return this.$refs.InfiniteLoading as InfiniteLoading;
    }

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
            console.log('button.lte.collapsed!');
            this.isExpanded = false;
        });
        button.on(WidgetEvents.Expanded, () => {
            console.log('button.lte.expanded!');
            this.isExpanded = true;
        });

        (Libraries.$(window) as any).resize(
            this.viewport.changed(() => {
                console.log('Current breakpoint: ', this.viewport.current());

                if (this.viewport.is('<=sm') && this.isExpanded) {
                    this.boxWidget.collapse();
                } else if (this.viewport.is('>sm') && !this.isExpanded) {
                    this.boxWidget.expand();
                }
            })
        );

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
