import ViewBase from '../Bases/ViewBase';
import Component from 'vue-class-component';
import GenreStore from '../../Models/Genres/GenreStore';
import SelectionItem from '../Shared/SelectionItem';
import Genre from 'src/ts/Models/Genres/Genre';

@Component({
    template: `<div class="col-md-3">
    <div class="box box-solid">
        <div class="box-header with-border bg-green">
            <h3 class="box-title">Genre</h3>
            <div class="box-tools pull-right">
                <button type="button"
                        class="btn btn-box-tool"
                        @click="OnClickRemove" >
                    <i class="fa fa-remove" />
                </button>
            </div>
        </div>
        <div class="box-footer no-padding">
            <ul class="nav nav-stacked">
            <template v-for="genre in genres">
                <selection-item
                    ref="Items"
                    v-bind:entity="genre"
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

    private genreStore: GenreStore = new GenreStore();
    private genres: Genre[] = [];

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        this.genres = (await this.genreStore.GetList())
            .orderBy(e => e.Name)
            .toArray();

        return true;
    }

    private OnClickRemove(): void {

    }
}
