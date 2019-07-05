import ViewBase from '../Bases/ViewBase';
import Component from 'vue-class-component';
import ArtistStore from '../../Models/Artists/ArtistStore';
import SelectionItem from '../Shared/SelectionItem';
import Artist from 'src/ts/Models/Artists/Artist';
import Vue from 'vue';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';

Vue.use(InfiniteLoading);

@Component({
    template: `<div class="col-md-2 h-100">
    <div class="card h-100">
        <div class="card-header with-border bg-info">
            <h3 class="card-title">Artists</h3>
            <div class="card-tools">
                <button type="button"
                        class="btn btn-tool"
                        @click="OnClickRemove" >
                    <i class="fa fa-remove" />
                </button>
            </div>
        </div>
        <div class="card-body list-scrollable">
            <ul class="nav nav-pills h-100 d-flex flex-column flex-nowrap">
                <template v-for="entity in entities">
                <selection-item
                    ref="Items"
                    v-bind:entity="entity"
                    @click="OnClickItem" />
                </template>
                <infinite-loading @infinite="OnInfinite"></infinite-loading>
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

    private OnClickRemove(): void {

    }

    private OnClickItem(): void {

    }
}
