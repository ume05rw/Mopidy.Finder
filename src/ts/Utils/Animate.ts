import * as _ from 'lodash';

export enum Speed {
    Slower = 'slower',
    Slow = 'slow',
    Normal = '',
    Fast = 'fast',
    Faster = 'faster'
};

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

    public static Exec(elem: HTMLElement, animation: Animation, speed: Speed = Speed.Normal): Promise<boolean> {
        return (new Animate(elem)).Execute(animation, speed, true);
    }

    public static GetClassString(animation: Animation, speed: Speed = Speed.Normal): string {
        const result = ` ${Animate.ClassAnimated} ${animation.toString()} `
            + ((speed === Speed.Normal)
                ? ''
                : `${speed.toString()} `);

        return result;
    }

    private _resolver: (value: boolean) => void = null;
    private _elem: HTMLElement = null;
    private _classes: DOMTokenList = null;

    public constructor(elem: HTMLElement) {
        this._elem = elem;
        this._classes = this._elem.classList;

        this.OnAnimationEnd.bind(this);
    }

    public Execute(animation: Animation, speed: Speed = Speed.Normal, afterDispose: boolean = false): Promise<boolean> {
        return new Promise((resolve: (value: boolean) => void): void => {
            this._resolver = resolve;
            this._elem.addEventListener(Animate.AnimationEndEvent, this.OnAnimationEnd);

            // 同じ内容のアニメーションが設定済みのとき、一度クリアしたあとで遅延実行する。
            const needsDefer = (
                this._classes.contains(Animate.ClassAnimated)
                && this._classes.contains(animation.toString())
            );

            Animate.ClearAnimation(this._elem);

            (needsDefer)
                ? _.defer((): void => {
                    this.InnerExecute(animation, speed, afterDispose)
                })
                : this.InnerExecute(animation, speed, afterDispose);
        });
    }

    private InnerExecute(animation: Animation, speed: Speed = Speed.Normal, afterDispose: boolean = false) {

        this._classes.add(Animate.ClassAnimated);
        this._classes.add(animation.toString());
        if (speed !== Speed.Normal)
            this._classes.add(speed.toString());

        // animationendイベントタイムアウト: 500ms加算。
        let endTime = 3500;
        switch (speed) {
            case Speed.Slower: endTime = 3500; break;
            case Speed.Slow: endTime = 2500; break;
            case Speed.Normal: endTime = 1500; break;
            case Speed.Fast: endTime = 1300; break;
            case Speed.Faster: endTime = 1000; break;
        }

        setTimeout((): void => {
            if (this._resolver) {
                this._resolver(false);
                this._resolver = null;
            }
            if (afterDispose)
                this.Dispose();

        }, endTime);
    }

    public Clear(): Animate {
        Animate.ClearAnimation(this._elem);

        return this;
    }

    public SetDisplayNone(): Animate {
        if (!this._classes.contains('d-none'))
            this._classes.add('d-none');

        return this;
    }

    public RemoveDisplayNone(): Animate {
        if (this._classes.contains('d-none'))
            this._classes.remove('d-none');

        return this;
    }

    private OnAnimationEnd(): Animate {
        try {
            this._elem.removeEventListener(Animate.AnimationEndEvent, this.OnAnimationEnd);
        } catch (e) {
            // 握りつぶす。
        }
        
        if (this._resolver) {
            this._resolver(true);
            this._resolver = null;
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
