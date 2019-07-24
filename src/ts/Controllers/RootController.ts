import RootView from '../Views/RootView';
import NavigationController from './NavigationController';
import ContentController from './ContentController';

export default class RootController {

    private static readonly RootId: string = '#root';
    private _rootView: RootView;
    private _navigation: NavigationController;
    private _content: ContentController;

    public constructor() {
        this.Initialize();
    }

    private async Initialize(): Promise<boolean> {
        this._rootView = new RootView();
        this._rootView.$mount(RootController.RootId);
        await this._rootView.Initialize();

        this._content = new ContentController(this._rootView);
        this._navigation = new NavigationController(this._content, this._rootView);
        
        return true;
    }
}
