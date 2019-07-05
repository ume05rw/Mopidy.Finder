import * as _ from 'lodash';
import Vue from 'vue';
import Component from 'vue-class-component';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';
import { Events, ISelectionChangedArgs, IListAppendedArgs } from '../../Events/ListEvents';
import Artist from '../../../Models/Artists/Artist';
import ArtistStore from '../../../Models/Artists/ArtistStore';
import ViewBase from '../../Bases/ViewBase';
import SelectionItem from '../../Shared/SelectionItem';

Vue.use(InfiniteLoading);

@Component({
    template: `<div class="col-md-2 h-100">
    <div class="card h-100">
        <div class="card-header with-border bg-info">
            <h3 class="card-title">Artists</h3>
            <div class="card-tools">
                <button type="button"
                        class="btn btn-tool"
                        @click="OnClickRefresh" >
                    <i class="fa fa-redo" />
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

    private get InfiniteLoading(): InfiniteLoading {
        return this.$refs.InfiniteLoading as InfiniteLoading;
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

        if (0 < result.ResultList.length) {
            this.$emit(Events.ListAppended, {
                entities: result.ResultList
            } as IListAppendedArgs);
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
