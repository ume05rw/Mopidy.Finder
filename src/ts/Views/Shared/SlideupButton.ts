import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import Libraries from '../../Libraries';
import { Animation, default as AnimatedBase } from '../Bases/AnimatedBase';

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
export default class SlideupButtom extends AnimatedBase {
    protected AnimationIn: Animation = Animation.FadeInUp
    protected AnimationOut: Animation = Animation.FadeOutDown;

    @Prop()
    protected hideOnInit: boolean;

    @Prop()
    protected iconClass: string;

    @Prop()
    protected tooltip: string;

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        if (this.hideOnInit === true)
            this.HideNow();

        if (this.tooltip && 0 < this.tooltip.length)
            Libraries.SetTooltip(this.$el as HTMLElement, this.tooltip);

        return true;
    }

    private OnClick(): void {
        this.$emit(SlideupButtonEvents.Clicked);
    }
}
