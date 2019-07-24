import Libraries from './Libraries';
import RootView from './Views/RootView';
import RootController from './Controllers/RootController';

class Main {

    private _root: RootController;

    public async Init(): Promise<Main> {
        Libraries.Initialize();

        this._root = new RootController();

        return this;
    }
}

const main = (new Main()).Init(); // eslint-disable-line
