import { Animation, default as Animate, Speed } from '../../Utils/Animate';
import Exception from '../../Utils/Exception';
import ViewBase from './ViewBase';

export { Animation, Speed } from '../../Utils/Animate';

export default abstract class AnimatedBase extends ViewBase {

    protected abstract AnimationIn: Animation;
    protected abstract AnimationOut: Animation;
    protected Speed: Speed = Speed.Faster;
    protected ClassHide: string = 'd-none';
    private animate: Animate;

    protected get Element(): HTMLElement {
        return this.$el as HTMLElement;
    }

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        if (!this.AnimationIn || Animate.IsHideAnimation(this.AnimationIn))
            Exception.Throw('Invalid In-Animation', this.AnimationIn);

        if (!this.AnimationOut || !Animate.IsHideAnimation(this.AnimationOut))
            Exception.Throw('Invalid Out-Animation', this.AnimationOut);

        this.animate = new Animate(this.$el as HTMLElement);

        return true;
    }

    protected ClearAllClasses(): void {
        Animate.ClearAnimation(this.Element);
    }

    public ShowNow(): void {
        this.ClearAllClasses();

        if (this.$el.classList.contains(this.ClassHide))
            this.$el.classList.remove(this.ClassHide);
    }

    public async Show(): Promise<boolean> {
        if (this.$el.classList.contains(this.ClassHide))
            this.$el.classList.remove(this.ClassHide);

        await this.animate.Execute(this.AnimationIn, this.Speed);

        return true;
    }

    public HideNow(): void {
        this.ClearAllClasses();
        this.$el.classList.add(this.ClassHide);
    }

    public async Hide(): Promise<boolean> {
        if (this.$el.classList.contains(this.ClassHide))
            this.$el.classList.remove(this.ClassHide);

        await this.animate.Execute(this.AnimationOut, this.Speed);

        this.$el.classList.add(this.ClassHide);

        return true;
    }

    public GetIsVisible(): boolean {
        return !this.Element.classList.contains(this.ClassHide);
    }
}
