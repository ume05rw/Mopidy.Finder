/**
 * responsive-toolkitの型定義
 * 
 * https://github.com/maciej-gurban/responsive-bootstrap-toolkit
 *
 * クラス、インタフェース、名前空間の書き分けがわかんねえ...。
 */
interface IResponsiveBootstrapToolkit {
    /**
     * Size Comparison
     * @param compareString ex) 'xs', '>=sm', '<md'...
     */
    is(complareString: string): boolean;

    /**
     * 
     * @param callback
     * @param waitMsec
     */
    changed(callback: () => void, waitMsec?: number): void;

    /**
     * Current Breakpoint String
     */
    current(): string;

    use(framewrokName: string, breadpoints: { [breadkpoint: string]: JQuery }): void;
}
declare const ResponsiveBootstrapToolkit: IResponsiveBootstrapToolkit;
export = ResponsiveBootstrapToolkit;
