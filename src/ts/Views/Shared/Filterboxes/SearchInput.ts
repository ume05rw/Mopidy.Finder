import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import AnimatedViewBase from '../../Bases/AnimatedViewBase';

export const SearchInputEvents = {
    Input: 'Input',
    Blur: 'Blur'
};

@Component({
    template: `<input class="form-control form-control-navbar form-control-sm text-filter d-none"
        type="search"
        v-bind:placeholder="placeHolder"
        v-bind:aria-label="placeHolder"
        @input="OnInput"
        @blur="OnBlur">
</input>`
})
export default class SearchInput extends AnimatedViewBase {
    protected AnimationClassIn: string = 'fadeInUp';
    protected AnimationClassOut: string = 'fadeOutDown';

    @Prop()
    private placeHolder: string;

    private OnInput(): void {
        this.$emit(SearchInputEvents.Input);
    }

    private OnBlur(): void {
        this.$emit(SearchInputEvents.Blur);
    }

    public Clear(): void {
        (this.$el as HTMLInputElement).value = '';
    }

    public Focus(): void {
        (this.$el as HTMLInputElement).focus();
    }

    public GetValue(): string {
        return (this.$el as HTMLInputElement).value;
    }
}
