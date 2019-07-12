import Exception from './Exception';

export class DelayedOnceExecuter {
    public static MonitorInterval: number = 10000;
    public static DelayThreshold: number = 3000;
    public static SuppressThreshold: number = 100;

    private _delay: number;
    public get Delay(): number {
        return this._delay;
    }
    public set Delay(value: number) {
        this._delay = value;
    }

    private _timeout: number;
    public get Timeout(): number {
        return this._timeout;
    }
    public set Timeout(value: number) {
        this._timeout = value;
    }

    public Name: string = '';


    private _startTime: Date;
    private _timer: number;
    private _callback: (passing: any) => any;

    private _isActive: boolean;
    private _suppressCount: number;
    private _timeoutExecStartTime: Date;

    public constructor(
        callback: (passing: any) => void,
        delay: number = 100,
        timeout: number = -1,
        isMonitor: boolean = false
    ) {
        this._callback = callback;
        this._delay = delay;
        this._timeout = timeout;
        this._startTime = null;
        this._timer = null;

        this._isActive = false;
        this._suppressCount = 0;
        this._timeoutExecStartTime = null;

        if (isMonitor) {
            setInterval((): void => {
                if (!this._isActive)
                    return;

                if (this._startTime || this._timeoutExecStartTime) {
                    const now = new Date();
                    const elapsed = (this._timeoutExecStartTime)
                        ? now.getTime() - this._timeoutExecStartTime.getTime()
                        : now.getTime() - this._startTime.getTime();

                    if (DelayedOnceExecuter.DelayThreshold < elapsed) {
                        // Delay閾値より長い時間の間、一度も実行されていない。
                        // 無限ループの可能性がある。
                        Exception.Dump(
                            '＊＊＊無限ループの可能性があります＊＊＊',
                            `${this.Name}: 経過時間(msec) = ` + elapsed
                        );
                    }
                }

                if (DelayedOnceExecuter.SuppressThreshold < this._suppressCount) {
                    // Suppress閾値より多くの回数分、実行が抑制されている。
                    // 呼び出し回数が多すぎる可能性がある。
                    Exception.Dump(
                        '＊＊＊呼び出し回数が多すぎます＊＊＊',
                        `${this.Name}: 抑制回数 = ` + this._suppressCount
                    );
                }
            }, DelayedOnceExecuter.MonitorInterval);
        }
    }

    public Exec(args?: any): void {

        this._isActive = true;

        if (this._timer === null) {
            // これから開始するとき
            this._startTime = new Date();
            this._suppressCount = 0;
        } else {
            // 既に開始中のとき
            clearInterval(this._timer);
            this._timer = null;
            this._suppressCount++;
        }

        const now = new Date();
        const elapsed = (now.getTime() - this._startTime.getTime());

        if (0 < this._timeout && elapsed > this._timeout) {
            // タイムアウト実行が連続するときの、最初の開始時間を保持しておく。
            if (this._timeoutExecStartTime === null)
                this._timeoutExecStartTime = this._startTime;

            this.InnerExec(args);
        } else {
            this._timer = setTimeout((): void => {
                this._timeoutExecStartTime = null;
                this.InnerExec(args);
            }, this._delay);
        }
    }

    private InnerExec(args?: any): void {
        try {
            this._callback(args);
        } catch (ex) {
            Exception.Dump('Callback FAILED!!', ex);
        }

        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }

        this._startTime = null;
        this._suppressCount = 0;
        this._isActive = false;
    }
}

export default class Delay {

    public static Wait(msec: number): Promise<boolean> {
        return new Promise((resolve: (value: boolean) => void): void => {
            window.setTimeout((): void => {
                try {
                    resolve(true);
                } catch (ex) {
                    Exception.Throw('Delay Exception.', ex);
                }
            }, msec);
        });
    }

    public static DelayedOnce(
        callback: (args: any) => void,
        delay: number = 100,
        timeout: number = -1,
        isMonitor: boolean = false
    ): DelayedOnceExecuter {
        return new DelayedOnceExecuter(callback, delay, timeout, isMonitor);
    }
}
