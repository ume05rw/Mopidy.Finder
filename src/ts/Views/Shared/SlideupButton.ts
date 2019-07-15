import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { default as AnimatedViewBase, Animation } from '../Bases/AnimatedViewBase';

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
    protected AnimationIn: Animation = Animation.FadeInUp
    protected AnimationOut: Animation = Animation.FadeOutDown;

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
