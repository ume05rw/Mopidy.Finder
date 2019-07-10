import * as _ from 'lodash';

// EventEmitterとしてmittを試したが、モジュール実装と型定義の違いが解決しなかった。
// https://github.com/developit/mitt/issues/60

export interface IEventable {
    AddEventListener(
        name: string,
        handler: (e: any) => void,
        bindTarget?: any
    ): void;

    RemoveEventListener(
        name: string,
        handler?: (e: any) => void
    ): void;

    DispatchEvent(name: string, value?: any): void;
}

export class EventReference {
    public Name: string;
    public Handler: (e: any) => void;
    public BindTarget: any;
}

/**
 * イベント機能実装の抽象クラス
 */
export default abstract class EventableBase implements IEventable {

    private eventHandlers: EventReference[] = [];

    public AddEventListener(
        name: string,
        handler: (e: any) => void,
        bindTarget?: any
    ): void {
        const eRef = new EventReference();
        eRef.Name = name;
        eRef.Handler = handler;
        // デフォルトでthisバインド、をやめる。
        eRef.BindTarget = bindTarget;
        //eRef.BindTarget = (!bindTarget)
        //    ? this
        //    : bindTarget;

        this.eventHandlers.push(eRef);
    }

    public RemoveEventListener(
        name: string,
        handler?: (e: any) => void
    ): void {
        if (handler) {
            // handlerが指定されているとき
            let key = -1;
            const eRef = _.find(this.eventHandlers, (er, idx) => {
                key = idx;
                // ※注意※
                // 関数は継承関係のプロトタイプ参照都合で同一オブジェクトになりやすい。
                // Mittでも同じ実装だった...。
                return (er.Name === name
                    && er.Handler === handler);
            });

            if (key >= 0) {
                this.eventHandlers.splice(key, 1);
                eRef.Handler = null;
                eRef.Name = null;
            }
        } else {
            // handlerが指定されないとき
            const eRefs: EventReference[] = [];
            _.each(this.eventHandlers, (er) => {
                if (er.Name === name)
                    eRefs.push(er);
            });
            _.each(eRefs, (eRef) => {
                const idx = this.eventHandlers.indexOf(eRef);
                this.eventHandlers.splice(idx, 1);
                eRef.Handler = null;
                eRef.Name = null;
            });
        }
    }

    public DispatchEvent(name: string, params: any = null): void {
        _.each(this.eventHandlers, (er: EventReference) => {
            if (er.Name === name) {
                try {
                    // デフォルトでthisバインド、をやめる。
                    //// thisをバインドして実行。そのままだとEventReferenceがthisになる。
                    //er.Handler.bind(er.BindTarget)(params);
                    (er.BindTarget)
                        ? er.Handler.bind(er.BindTarget)(params)
                        : er.Handler(params);
                } catch (e) {
                    console.error(e);
                }
            }
        });
    }

    public Dispose(): void {
        _.each(this.eventHandlers, (eRef, index) => {
            eRef.Handler = null;
            eRef.Name = null;
            delete this.eventHandlers[index];
        });
        this.eventHandlers = null;
        this.AddEventListener = null;
        this.RemoveEventListener = null;
        this.DispatchEvent = null;
    }
}

