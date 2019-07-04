import ViewBase from '../Bases/ViewBase';
import Component from 'vue-class-component';
import ArtistStore from '../../Models/Artists/ArtistStore';
import SelectionItem from '../Shared/SelectionItem';
import Artist from 'src/ts/Models/Artists/Artist';

@Component({
    template: `<div class="col-md-3 h-100">
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
    private entities: Artist[] = [];

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        this.entities = (await this.store.GetList())
            .orderBy(e => e.Name)
            .toArray();

        return true;
    }

    private OnClickRemove(): void {

    }

    private OnClickItem(): void {

    }
}
