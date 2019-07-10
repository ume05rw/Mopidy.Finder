// Ion.Ra.geSlider 
// 使いそうなインタフェースのみ定義
// http://ionden.com/a/plugins/ion.rangeSlider/api.html

interface JQuery {
    ionRangeSlider(options?: IonRangeSliderOpsion): JQuery;
}

interface IonRangeSliderOpsion {
    skin?: string;
    type?: string;
    min?: number;
    max?: number;
    from?: number;
    to?: number;
    step?: number;
    values?: number[];
    keyboard?: boolean;
    grid?: boolean;
    grid_margin?: boolean;
    grid_num?: number;
    grid_snap?: boolean;
    onStart?: (data: IIonRangeSliderData) => void;
    onChange?: (data: IIonRangeSliderData) => void;
    onFinish?: (data: IIonRangeSliderData) => void;
    onUpdate?: (data: IIonRangeSliderData) => void;
}

interface IIonRangeSliderData {
    input: JQuery;
    slider: JQuery;
    min: number;
    max: number;
    from: number;
    from_percent: number;
    from_value: number[];
    to: number;
    to_percent: number;
    to_value: number[];
    //min_pretty: any;
    //max_pretty: any;
    //from_pretty: any;
    //to_pretty: any;
}
