import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import AnimatedViewBase from '../Bases/AnimatedViewBase';

export const SlideupButtonEvents = {
    Clicked: 'Clicked'
};

@Component({
    template: `<button
    class="btn btn-tool"
    @click="OnClick">
        <i v-bind:class="iconClass" />
</button>`
})
export default class SlideupButtom extends AnimatedViewBase {
    protected AnimationClassIn: string = 'fadeInUp';
    protected AnimationClassOut: string = 'fadeOutDown';

    @Prop()
    protected hideOnInit: boolean;

    @Prop()
    protected iconClass: string;

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        if (this.hideOnInit === true)
            this.HideNow();

        return true;
    }

    private OnClick(): void {
        this.$emit(SlideupButtonEvents.Clicked);
    }
}
