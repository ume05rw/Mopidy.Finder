import Libraries from './Libraries';
import RootContoller from './Controllers/RootContoller';

class Main {

    private _rootController: RootContoller;

    public async Init(): Promise<Main> {
        console.log('TS Start');

        Libraries.Initialize();

        this._rootController = new RootContoller();
        await this._rootController.Init();

        return this;
    }
}

const main = (new Main()).Init();
