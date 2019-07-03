import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import ISelectionItem from '../../Models/Bases/ISelectionItem';
import ViewBase from '../Bases/ViewBase';

@Component({
    template: `<li  class=""
                    ref="Li" >
    <a  href="javascript:void(0)"
        @click="OnClick" >
        {{ entity.Name }}
    </a>
</li>`
})
export default class SelectionItem extends ViewBase {

    private static readonly SelectedColor: string = 'bg-gray';

    @Prop()
    public entity!: ISelectionItem;

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
    }

    public IsSelected(): boolean {
        return this.selected;
    }
}
