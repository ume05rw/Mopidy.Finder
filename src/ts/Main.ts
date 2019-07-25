import RootController from './Controllers/RootController';
import Libraries from './Libraries';

class Main {

    private _root: RootController;

    public async Init(): Promise<Main> {
        Libraries.Initialize();

        this._root = new RootController();

        return this;
    }
}

const main = (new Main()).Init(); // eslint-disable-line
