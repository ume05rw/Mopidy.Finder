import ViewBase from '../Bases/ViewBase';
import Component from 'vue-class-component';
import AlbumStore from '../../Models/Albums/AlbumStore';
import SelectionItem from '../Shared/SelectionItem';
import Album from 'src/ts/Models/Albums/Album';
import Vue from 'vue';
import { default as InfiniteLoading, StateChanger } from 'vue-infinite-loading';

Vue.use(InfiniteLoading);

@Component({
    template: `<div class="col-md-2 h-100">
    <div class="card h-100">
        <div class="card-header with-border bg-warning">
            <h3 class="card-title">Albums</h3>
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
export default class AlbumList extends ViewBase {

    private store: AlbumStore = new AlbumStore();
    private page: number = 1;
    private genreIds: number[] = [];
    private artistIds: number[] = [];
    private entities: Album[] = [];

    public async OnInfinite($state: StateChanger): Promise<boolean> {

        var result = await this.store.GetList(this.genreIds, this.artistIds, this.page);

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
