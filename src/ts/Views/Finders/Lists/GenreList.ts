import Component from 'vue-class-component';
import Genre from '../../../Models/Genres/Genre';
import GenreStore from '../../../Models/Genres/GenreStore';
import ViewBase from '../../Bases/ViewBase';
import SelectionItem from '../../Shared/SelectionItem';

@Component({
    template: `<div class="col-md-2 h-100">
    <div class="card h-100">
        <div class="card-header with-border bg-green">
            <h3 class="card-title">Genres</h3>
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
export default class GenreList extends ViewBase {

    private store: GenreStore = new GenreStore();
    private entities: Genre[] = [];

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
