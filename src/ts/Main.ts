import 'animate.css/animate.css';
import 'font-awesome/css/font-awesome.css';
import 'vue2-admin-lte/src/lib/css';
import 'vue2-admin-lte/src/lib/script';
import '../css/site.css';
import RootContoller from './Controllers/RootContoller';
import Libraries from './Libraries';

class Main {

    private _rootController: RootContoller;

    public async Init(): Promise<Main> {
        console.log('TS Start');

        this.PolyfillPromise();
        await this.InitControllers();

        return this;
    }

    private PolyfillPromise(): void {
        try {
            Libraries.es6Promise.polyfill();
            //console.log('Promise Polyfill OK.');
        } catch (ex) {
            throw new Error('Promise Poliyfill Error!');
        }
    }

    private async InitControllers(): Promise<boolean> {
        this._rootController = new RootContoller();
        await this._rootController.Init();

        return true;
    }
}

const main = (new Main()).Init();
