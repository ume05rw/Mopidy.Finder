import Component from 'vue-class-component';
import Genre from '../../../Models/Genres/Genre';
import GenreStore from '../../../Models/Genres/GenreStore';
import ViewBase from '../../Bases/ViewBase';
import SelectionItem from '../../Shared/SelectionItem';
import { Events, ISelectionChangedArgs, IListAppendedArgs } from '../../Events/ListEvents';

@Component({
    template: `<div class="col-md-3">
    <div class="card">
        <div class="card-header with-border bg-green">
            <h3 class="card-title">Genres</h3>
            <div class="card-tools">
                <button class="btn btn-tool" data-widget="collapse">
                    <i class="fa fa-repeat" />
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

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        this.entities = (await this.store.GetList())
            .toArray();

        this.$emit(Events.ListAppended, {
            entities: this.entities
        } as IListAppendedArgs);

        return true;
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
        this.Initialize();
    }
}
