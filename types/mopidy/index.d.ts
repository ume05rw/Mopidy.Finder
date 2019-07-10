//declare class Mopidy extends EventEmitter {
declare class Mopidy {
    constructor(settings?: Mopidy.ISettings);
    connect(): void;
    close(): void;

    playback: Mopidy.IPlayback;


    // 型定義ファイルのインポート方法が分からない。
    // 以下、@types/node/events.d.tsのコピペ
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
    on(event: string | symbol, listener?: (...args: any[]) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    off(event: string | symbol, listener: (...args: any[]) => void): this;
    removeAllListeners(event?: string | symbol): this;
    setMaxListeners(n: number): this;
    getMaxListeners(): number;
    listeners(event: string | symbol): Function[];
    rawListeners(event: string | symbol): Function[];
    emit(event: string | symbol, ...args: any[]): boolean;
    eventNames(): Array<string | symbol>;
    listenerCount(type: string | symbol): number;
}

declare namespace Mopidy {
    interface ISettings {
        webSocketUrl?: string;
        autoConnect?: boolean;
        backoffDelayMin?: number;
        backoffDelayMax?: number;
        callingConvention?: string;
        console?: Console;
    }

    interface IPlayback {
        play(playArgs?: IPlaybackPlayArgs): Promise<any>;
        next(): Promise<any>;
        previous(): Promise<any>;
        stop(): Promise<any>;
        pause(): Promise<any>;
        resume(): Promise<any>;
        seek(timePosition: number): Promise<any>;
        getCurrentTlTrack(): Promise<any>;
        getCurrentTrack(): Promise<any>;
        getStreamTitle(): Promise<any>;
        getTimePosition(): Promise<any>;
        getState(): Promise<any>;
        setState(state: string): Promise<any>;
    }

    interface IPlaybackPlayArgs {
        tl_track?: any;
        tlid?: number;
    }
}

export = Mopidy;
export as namespace Mopidy;
