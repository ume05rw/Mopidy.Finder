import ViewBase from './ViewBase';
import IContentDetail from './IContentDetail';
import { default as Animate, Animation, Speed } from '../../Utils/Animate';

export default abstract class ContentDetailBase extends ViewBase implements IContentDetail {
    protected abstract readonly tabId: string;
    protected abstract readonly linkId: string;

    private static readonly DisplayNone: string = 'd-none';
    private static readonly PositionStatic: string = 'position: static;';
    private static readonly PositionAbsolute: string = 'position: absolute;';
    private animate: Animate;
    private elClasses: DOMTokenList;

    protected AnimationSlideInRight: Animation = Animation.SlideInRight;
    protected AnimationSlideOutRight: Animation = Animation.SlideOutRight;
    protected AnimationSlideInLeft: Animation = Animation.SlideInLeft;
    protected AnimationSlideOutLeft: Animation = Animation.SlideOutLeft;
    protected AnimationSpeed: Speed = Speed.Faster;

    public async Initialize(): Promise<boolean> {
        super.Initialize();

        this.animate = new Animate(this.$el as HTMLElement);
        this.elClasses = this.$el.classList;

        return true;
    }

    public GetIsVisible(): boolean {
        return !this.elClasses.contains(ContentDetailBase.DisplayNone);
    }

    public ToPositionStatic(): void {
        this.$el.setAttribute('style', ContentDetailBase.PositionStatic);
    }

    public ToPositionAbsolute(): void {
        this.$el.setAttribute('style', ContentDetailBase.PositionAbsolute);
    }

    public ToVisible(): void {
        if (this.elClasses.contains(ContentDetailBase.DisplayNone))
            this.elClasses.remove(ContentDetailBase.DisplayNone);
    }
    public ToHide(): void {
        if (!this.elClasses.contains(ContentDetailBase.DisplayNone))
            this.elClasses.add(ContentDetailBase.DisplayNone);
    }

    public async SlideInRight(): Promise<boolean> {
        this.ToVisible();
        await this.animate.Execute(this.AnimationSlideInRight, this.AnimationSpeed);
        this.animate.Clear();
        this.ToVisible();

        return true;
    }

    public async SlideInLeft(): Promise<boolean> {
        this.ToVisible();
        await this.animate.Execute(this.AnimationSlideInLeft, this.AnimationSpeed);
        this.animate.Clear();
        this.ToVisible();

        return true;
    }

    public async SlideOutRight(): Promise<boolean> {
        this.ToVisible();
        await this.animate.Execute(this.AnimationSlideOutRight, this.AnimationSpeed);
        this.animate.Clear();
        this.ToHide();

        return true;
    }

    public async SlideOutLeft(): Promise<boolean> {
        this.ToVisible();
        await this.animate.Execute(this.AnimationSlideOutLeft, this.AnimationSpeed);
        this.animate.Clear();
        this.ToHide();

        return true;
    }
}
