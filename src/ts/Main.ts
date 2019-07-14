import Libraries from './Libraries';
import RootView from './Views/RootView';

class Main {

    private _view: RootView;

    public async Init(): Promise<Main> {
        Libraries.Initialize();

        this._view = new RootView();
        this._view.$mount('#root');
        await this._view.Initialize();

        return this;
    }
}

const main = (new Main()).Init(); // eslint-disable-line
