import * as _ from 'lodash';
import Dump from './Dump';

export enum Speed {
    Slower = 'slower',
    Slow = 'slow',
    Normal = '',
    Fast = 'fast',
    Faster = 'faster'
}

export enum Animation {
    Bounce = 'bounce',
    BounceIn = 'bounceIn',
    BounceInDown = 'bounceInDown',
    BounceInLeft = 'bounceInLeft',
    BounceInRight = 'bounceInRight',
    BounceInUp = 'bounceInUp',
    BounceOut = 'bounceOut',
    BounceOutDown = 'bounceOutDown',
    BounceOutLeft = 'bounceOutLeft',
    BounceOutRight = 'bounceOutRight',
    BounceOutUp = 'bounceOutUp',
    FadeIn = 'fadeIn',
    FadeInDown = 'fadeInDown',
    FadeInDownBig = 'fadeInDownBig',
    FadeInLeft = 'fadeInLeft',
    FadeInLeftBig = 'fadeInLeftBig',
    FadeInRight = 'fadeInRight',
    FadeInRightBig = 'fadeInRightBig',
    FadeInUp = 'fadeInUp',
    FadeInUpBig = 'fadeInUpBig',
    FadeOut = 'fadeOut',
    FadeOutDown = 'fadeOutDown',
    FadeOutDownBig = 'fadeOutDownBig',
    FadeOutLeft = 'fadeOutLeft',
    FadeOutLeftBig = 'fadeOutLeftBig',
    FadeOutRight = 'fadeOutRight',
    FadeOutRightBig = 'fadeOutRightBig',
    FadeOutUp = 'fadeOutUp',
    FadeOutUpBig = 'fadeOutUpBig',
    Flash = 'flash',
    FlipInX = 'flipInX',
    FlipInY = 'flipInY',
    FlipOutX = 'flipOutX',
    FlipOutY = 'flipOutY',
    HeadShake = 'headShake',
    HeartBeat = 'heartBeat',
    Hinge = 'hinge',
    JackInTheBox = 'jackInTheBox',
    Jello = 'jello',
    LightSpeedIn = 'lightSpeedIn',
    LightSpeedOut = 'lightSpeedOut',
    Pulse = 'pulse',
    RollIn = 'rollIn',
    RollOut = 'rollOut',
    RotateIn = 'rotateIn',
    RotateInDownLeft = 'rotateInDownLeft',
    RotateInDownRight = 'rotateInDownRight',
    RotateInUpLeft = 'rotateInUpLeft',
    RotateInUpRight = 'rotateInUpRight',
    RotateOut = 'rotateOut',
    RotateOutDownLeft = 'rotateOutDownLeft',
    RotateOutDownRight = 'rotateOutDownRight',
    RotateOutUpLeft = 'rotateOutUpLeft',
    RotateOutUpRight = 'rotateOutUpRight',
    RubberBand = 'rubberBand',
    Shake = 'shake',
    SlideInDown = 'slideInDown',
    SlideInLeft = 'slideInLeft',
    SlideInRight = 'slideInRight',
    SlideInUp = 'slideInUp',
    SlideOutDown = 'slideOutDown',
    SlideOutLeft = 'slideOutLeft',
    SlideOutRight = 'slideOutRight',
    SlideOutUp = 'slideOutUp',
    Swing = 'swing',
    Tada = 'tada',
    Wobble = 'wobble',
    ZoomIn = 'zoomIn',
    ZoomInDown = 'zoomInDown',
    ZoomInLeft = 'zoomInLeft',
    ZoomInRight = 'zoomInRight',
    ZoomInUp = 'zoomInUp',
    ZoomOut = 'zoomOut',
    ZoomOutDown = 'zoomOutDown',
    ZoomOutLeft = 'zoomOutLeft',
    ZoomOutRight = 'zoomOutRight',
    ZoomOutUp = 'zoomOutUp'
}

const ToHideAnimations: { [name: string]: boolean} = {
    'bounceOut': true,
    'bounceOutDown': true,
    'bounceOutLeft': true,
    'bounceOutRight': true,
    'bounceOutUp': true,
    'fadeOut': true,
    'fadeOutDown': true,
    'fadeOutDownBig': true,
    'fadeOutLeft': true,
    'fadeOutLeftBig': true,
    'fadeOutRight': true,
    'fadeOutRightBig': true,
    'fadeOutUp': true,
    'fadeOutUpBig': true,
    'flipOutX': true,
    'flipOutY': true,
    'hinge': true,
    'lightSpeedOut': true,
    'rollOut': true,
    'rotateOut': true,
    'rotateOutDownLeft': true,
    'rotateOutDownRight': true,
    'rotateOutUpLeft': true,
    'rotateOutUpRight': true,
    'slideOutDown': true,
    'slideOutLeft': true,
    'slideOutRight': true,
    'slideOutUp': true,
    'zoomOut': true,
    'zoomOutDown': true,
    'zoomOutLeft': true,
    'zoomOutRight': true,
    'zoomOutUp': true,
};

export default class Animate {

    public static readonly ClassAnimated = 'animated';
    public static readonly AnimationEndEvent = 'animationend';

    public static ClearAnimation(elem: HTMLElement): void {
        const classes = elem.classList;
        if (!classes.contains(Animate.ClassAnimated))
            classes.remove(Animate.ClassAnimated);

        _.each(_.toPairs(Speed), (vals): void => {
            const className = vals[1];
            if (className === '')
                return;

            if (classes.contains(className))
                classes.remove(className);
        });

        _.each(_.toPairs(Animation), (vals): void => {
            const className = vals[1];
            if (classes.contains(className))
                classes.remove(className);
        })
    }

    public static async Exec(elem: HTMLElement, animation: Animation, speed: Speed = Speed.Normal): Promise<boolean> {
        const anim = new Animate(elem);
        await anim.Execute(animation, speed);
        anim.Dispose();

        return true;
    }

    public static GetClassString(animation: Animation, speed: Speed = Speed.Normal): string {
        const result = ` ${Animate.ClassAnimated} ${animation.toString()} `
            + ((speed === Speed.Normal)
                ? ''
                : `${speed.toString()} `);

        return result;
    }

    public static IsHideAnimation(animation: Animation): boolean {
        return (ToHideAnimations[animation.toString()]);
    }


    protected HiddenClassName: string = 'd-none';
    private _isHidingAnimation: boolean = false;
    private _resolver: (value: boolean) => void = null;
    private _elem: HTMLElement = null;
    private _classes: DOMTokenList = null;

    public constructor(elem: HTMLElement) {
        this._elem = elem;
        this._classes = this._elem.classList;

        this.OnAnimationEnd = this.OnAnimationEnd.bind(this);
    }

    public Execute(animation: Animation, speed: Speed = Speed.Normal): Promise<boolean> {
        return new Promise((resolve: (value: boolean) => void): void => {
            this._resolver = resolve;
            this._elem.addEventListener(Animate.AnimationEndEvent, this.OnAnimationEnd);

            // 同じ内容のアニメーションが既に設定済みか否か
            const needsDefer = (
                this._classes.contains(Animate.ClassAnimated)
                && this._classes.contains(animation.toString())
            );

            Animate.ClearAnimation(this._elem);

            (needsDefer)
                //既にアニメーションセット済みのとき: 一度クリアしたあとで遅延実行
                ? _.defer((): void => {
                    this.InnerExecute(animation, speed)
                })
                // プレーン状態のとき: 即時アニメーション実行
                : this.InnerExecute(animation, speed);
        });
    }

    private InnerExecute(animation: Animation, speed: Speed = Speed.Normal): void {
        this._isHidingAnimation = Animate.IsHideAnimation(animation);

        if (!this.GetIsVisible())
            this.ShowNow();

        this._classes.add(Animate.ClassAnimated);
        this._classes.add(animation.toString());
        if (speed !== Speed.Normal)
            this._classes.add(speed.toString());

        // animationendイベントタイムアウト: 100ms加算。
        let endTime = -1;
        switch (speed) {
            case Speed.Slower: endTime = 3100; break;
            case Speed.Slow: endTime = 2100; break;
            case Speed.Normal: endTime = 1100; break;
            case Speed.Fast: endTime = 900; break;
            case Speed.Faster: endTime = 600; break;
        }

        setTimeout((): void => {
            if (this._resolver)
                this.Resolve(false);
        }, endTime);
    }

    private OnAnimationEnd(): Animate {
        this.Resolve(true);

        return this;
    }

    private Resolve(result: boolean): void {
        if (this._isHidingAnimation === true && this.GetIsVisible())
            this.HideNow();

        this._isHidingAnimation = false;

        if (this._resolver) {
            try {
                this._resolver(result);
            } catch (ex) {
                Dump.Error('Animated.Resolve: Unexpected Error on Resolve', ex);
            }
        }

        this._resolver = null;
    }

    public Clear(): Animate {
        Animate.ClearAnimation(this._elem);

        return this;
    }

    public GetIsVisible(): boolean {
        if (
            (this.HiddenClassName)
            && 0 < this.HiddenClassName.length
        ) {
            return !this._classes.contains(this.HiddenClassName);
        }

        return true;
    }

    public HideNow(): Animate {
        if (
            (this.HiddenClassName)
            && 0 < this.HiddenClassName.length
            && !this._classes.contains(this.HiddenClassName)
        ) {
            this._classes.add(this.HiddenClassName);
        }

        return this;
    }

    public ShowNow(): Animate {
        if (
            (this.HiddenClassName)
            && 0 < this.HiddenClassName.length
            && this._classes.contains(this.HiddenClassName)
        ) {
            this._classes.remove(this.HiddenClassName);
        }

        return this;
    }

    public Dispose(): void {
        Animate.ClearAnimation(this._elem);

        try {
            this._elem.removeEventListener(Animate.AnimationEndEvent, this.OnAnimationEnd);
        } catch (e) {
            // 握りつぶす。
        }

        if (this._resolver)
            this._resolver(false);

        this._resolver = null;
        this._elem = null;
        this._classes = null;
    }
}
