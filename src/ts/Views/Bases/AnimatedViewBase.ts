import ViewBase from './ViewBase';

export const AnimatedViewEvents = {
    AnimationEnd: 'animationend'
};

export default abstract class AnimatedViewBase extends ViewBase {

    protected abstract AnimationClassIn: string;
    protected abstract AnimationClassOut: string;
    protected AnimationClassSpeed: string = 'faster';
    private readonly AnimationClassAnimated: string = 'animated';
    private readonly AnimationClassHide: string = 'd-none';

    private _resolver: (value: boolean) => void = null;

    protected get Element(): HTMLElement {
        return this.$el as HTMLElement;
    }

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        this.Element.addEventListener(AnimatedViewEvents.AnimationEnd, () => {
            this.PostAnimated();

            if (this._resolver) {
                this._resolver(true);
                this._resolver = null;
            }
            //this.$emit(AnimatedViewEvents.AnimationEnd);
        });

        return true;
    }

    private PostAnimated(): void {
        const classes = this.Element.classList;

        if (classes.contains(this.AnimationClassAnimated))
            classes.remove(this.AnimationClassAnimated);

        if (classes.contains(this.AnimationClassSpeed))
            classes.remove(this.AnimationClassSpeed);

        if (classes.contains(this.AnimationClassIn)) {
            // 表示化
            classes.remove(this.AnimationClassIn);
        } else if (classes.contains(this.AnimationClassOut)) {
            // 非表示化
            classes.remove(this.AnimationClassOut);
            classes.add(this.AnimationClassHide);
        }
    }

    public Show(): Promise<boolean> {
        if (this._resolver) {
            this._resolver(false);
            this._resolver = null;
        }

        return new Promise((resolve: (value: boolean) => void): void => {
            this._resolver = resolve;

            const classes = this.Element.classList;

            if (classes.contains(this.AnimationClassHide))
                classes.remove(this.AnimationClassHide);

            if (classes.contains(this.AnimationClassOut))
                classes.remove(this.AnimationClassOut);

            if (!classes.contains(this.AnimationClassAnimated))
                classes.add(this.AnimationClassAnimated);

            if (!classes.contains(this.AnimationClassIn))
                classes.add(this.AnimationClassIn);

            if (
                this.AnimationClassSpeed
                && 0 < this.AnimationClassSpeed.length
                && !classes.contains(this.AnimationClassSpeed)
            ) {
                classes.add(this.AnimationClassSpeed);
            }
        });
    }

    public Hide(): Promise<boolean> {
        if (this._resolver) {
            this._resolver(false);
            this._resolver = null;
        }

        return new Promise((resolve: (value: boolean) => void): void => {
            this._resolver = resolve;

            const classes = this.Element.classList;

            if (classes.contains(this.AnimationClassHide))
                classes.remove(this.AnimationClassHide);

            if (classes.contains(this.AnimationClassIn))
                classes.remove(this.AnimationClassIn);

            if (!classes.contains(this.AnimationClassAnimated))
                classes.add(this.AnimationClassAnimated);

            if (!classes.contains(this.AnimationClassOut))
                classes.add(this.AnimationClassOut);

            if (
                this.AnimationClassSpeed
                && 0 < this.AnimationClassSpeed.length
                && !classes.contains(this.AnimationClassSpeed)
            ) {
                classes.add(this.AnimationClassSpeed);
            }
        });
    }
}
