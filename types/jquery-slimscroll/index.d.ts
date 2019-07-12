/**
 * jQuery slimScroll
 */

interface JQuery {
    slimScroll(options?: ISlimScrollOption): JQuery;
}

interface ISlimScrollOption {
    width?: string;
    height?: string;
    size?: string;
    position?: string;
    color?: string;
    alwaysVisible?: boolean;
    distance?: string;
    start?: JQuery;
    railVisible?: boolean;
    railColor?: string;
    railOpacity?: number;
    wheelStep?: number;
    allowPageScroll?: boolean;
    disableFadeOut?: boolean;
}
