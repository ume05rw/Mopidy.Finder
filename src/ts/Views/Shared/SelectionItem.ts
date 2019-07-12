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
    private entity!: TEntity;

    private selected: boolean = false;

    private get Li(): HTMLLIElement {
        return this.$refs.Li as HTMLLIElement;
    }

    private OnClick(): void {
        this.selected = !this.selected;
        this.SetClassBySelection();

        const args: ISelectionChangedArgs<TEntity> = {
            Entity: this.entity,
            Selected: this.selected
        };
        this.$emit(SelectionItemEvents.SelectionChanged, args);
    }

    private SetClassBySelection(): void {
        if (this.selected) {
            if (!this.Li.classList.contains(SelectionItem.SelectedColor))
                this.Li.classList.add(SelectionItem.SelectedColor);
        } else {
            if (this.Li.classList.contains(SelectionItem.SelectedColor))
                this.Li.classList.remove(SelectionItem.SelectedColor);
        }
    }

    public GetSelected(): boolean {
        return this.selected;
    }

    public GetEntity(): TEntity {
        return this.entity;
    }

    public SetSelected(selected: boolean): void {
        this.selected = selected;
        this.SetClassBySelection();
    }
}
