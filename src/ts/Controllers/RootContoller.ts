import RootView from '../Views/RootView';

export default class RootContoller {

    private _view: RootView;

    public async Init(): Promise<boolean> {

        this._view = new RootView();
        this._view.$mount('#root');
        await this._view.Initialize();

        return true;
    }
}
