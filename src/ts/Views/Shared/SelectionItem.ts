import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import ViewBase from '../Bases/ViewBase';

export const SelectionItemEvents = {
    SelectionChanged: 'SelectionChanged'
}

export interface ISelectionChangedArgs<TEntity> {
    Entity: TEntity;
    Selected: boolean;
}

@Component({
    template: `<li class="nav-item"
                   ref="Li" >
    <a href="javascript:void(0)" class="d-inline-block w-100 text-nowrap text-truncate"
       @click="OnClick" >
        {{ entity.Name }}
    </a>
</li>`
})
export default class SelectionItem<TEntity> extends ViewBase {

    private static readonly SelectedColor: string = 'bg-gray';

    @Prop()
    public entity!: TEntity;

    private selected: boolean = false;

    private get Li(): HTMLLIElement {
        return this.$refs.Li as HTMLLIElement;
    }

    private OnClick(): void {
        if (this.selected) {
            if (this.Li.classList.contains(SelectionItem.SelectedColor))
                this.Li.classList.remove(SelectionItem.SelectedColor);

            this.selected = false;
        } else {
            if (!this.Li.classList.contains(SelectionItem.SelectedColor))
                this.Li.classList.add(SelectionItem.SelectedColor);

            this.selected = true;
        }
        this.$emit(SelectionItemEvents.SelectionChanged, {
            Entity: this.entity,
            Selected: this.selected
        } as ISelectionChangedArgs<TEntity>);
    }

    public IsSelected(): boolean {
        return this.selected;
    }
}
