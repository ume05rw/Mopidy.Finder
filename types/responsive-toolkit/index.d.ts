/**
 * responsive-toolkitの型定義
 * 
 * https://github.com/maciej-gurban/responsive-bootstrap-toolkit
 *
 * クラス、インタフェース、名前空間の書き分けがわかんねえ...。
 */
declare namespace ResponsiveBootstrapToolkit {
    /**
     * Size Comparison
     * @param compareString ex) 'xs', '>=sm', '<md'...
     */
    function is(complareString: string): boolean;

    /**
     * 
     * @param callback
     * @param waitMsec
     */
    function changed(callback: () => void, waitMsec?: number): void;

    /**
     * Current Breakpoint String
     */
    function current(): string;

    function use(framewrokName: string, breadpoints: { [breadkpoint: string]: JQuery }): void;
}

export default ResponsiveBootstrapToolkit;
