
export declare interface IWidgetOptions {
    animationSpeed?: number;
    collapseTrigger?: string;
    removeTrigger?: string;
}

export declare class Widget {
    constructor(element: JQuery, settings?: IWidgetOptions);
    toggle(): void;
    expand(): void;
    collapse(): void;
    remove(): void;

    /**
     * イベントが発生するのは渡し値のJQueryオブジェクト。
     * ここではon/off出来ない
     * 
     * @param eventName ['expanded.lte.widget', 'collapsed.lte.widget', 'maximized.lte.widget', 'minimized.lte.widget', 'removed.lte.widget']
     * @param handler
     */
    //on(eventName: string, handler: (event: Event, extraParams?: any) => void);
    //off(eventName: string, handler?: (event: Event, extraParams?: any) => void);
}

export declare interface IPushMenuOptions {
    autoCollapseSize?: number | false;
    screenCollapseSize?: number;
}

export declare class PushMenu {
    constructor(element: JQuery, options?: IPushMenuOptions);
    show(): void;
    collapse(): void;
    isShown(): boolean;
    toggle(): void;
    autoCollapse(): void;
}
