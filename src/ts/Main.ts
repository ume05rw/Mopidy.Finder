import 'animate.css/animate.css';
import 'font-awesome/css/font-awesome.css';
import 'admin-lte/dist/css/adminlte.css';
import 'vue-slider-component/theme/antd.css';
import 'admin-lte/plugins/ion-rangeslider/css/ion.rangeSlider.css';
import '../css/site.css';
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
