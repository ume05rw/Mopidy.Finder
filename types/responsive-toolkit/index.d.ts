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

// "export default"でなく、"export ="がミソ。
// グローバル空間に名前が決め打ちで存在するインスタンスの場合は、
// import時に取得するのはクラスでなくインスタンス。
// クラスの場合は命名自由だが、インスタンスの場合は名前を固定してexportする。
// ...というのが現状での理解。
export = ResponsiveBootstrapToolkit;

