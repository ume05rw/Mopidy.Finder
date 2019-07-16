import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import ViewBase from '../Bases/ViewBase';

export const SelectionItemEvents = {
    SelectionOrdered: 'SelectionOrdered',
    SelectionChanged: 'SelectionChanged'
}

export interface ISelectionChangedArgs<TEntity> {
    Entity: TEntity;
    Selected: boolean;
}
export interface ISelectionOrderedArgs<TEntity> extends ISelectionChangedArgs<TEntity> {
    Permitted: boolean;
}


@Component({
    template: `<li class="nav-item"
                   ref="Li" >
    <span class="d-block w-100 text-nowrap text-truncate"
       @click="OnClick" >
        {{ (entity.Name == ' ') ? '[blank]' : entity.Name }}
    </span>
</li>`
})
export default class SelectionItem<TEntity> extends ViewBase {

    private static readonly SelectedColor: string = 'selected';

    @Prop()
    private entity!: TEntity;

    private selected: boolean = false;

    private get Li(): HTMLLIElement {
        return this.$refs.Li as HTMLLIElement;
    }

    private OnClick(): void {
        const orderedArgs: ISelectionOrderedArgs<TEntity> = {
            Entity: this.entity,
            Selected: !this.selected,
            Permitted: true
        };
        this.$emit(SelectionItemEvents.SelectionOrdered, orderedArgs);

        if (orderedArgs.Permitted !== true)
            return;

        this.selected = !this.selected;
        this.SetClassBySelection();

        const changedArgs: ISelectionChangedArgs<TEntity> = {
            Entity: this.entity,
            Selected: this.selected
        };
        this.$emit(SelectionItemEvents.SelectionChanged, changedArgs);
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
