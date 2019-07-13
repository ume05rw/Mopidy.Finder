import Component from 'vue-class-component';
import AnimatedViewBase from '../../../Bases/AnimatedViewBase';

export const AddButtonEvents = {
    Clicked: 'Clicked'
};

@Component({
    template: `<button
    class="btn btn-tool"
    @click="OnClick">
        <i class="fa fa-search" />
</button>`
})
export default class AddButton extends AnimatedViewBase {
    protected AnimationClassIn: string = 'fadeInUp';
    protected AnimationClassOut: string = 'fadeOutDown';

    private OnClick(): void {
        this.$emit(AddButtonEvents.Clicked);
    }
}
