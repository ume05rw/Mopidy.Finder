import * as _ from 'lodash';
import Vue from 'vue';
import Dump from '../../Utils/Dump';

export default abstract class ViewBase extends Vue {

    private initialized: boolean = false;

    public constructor(options?: any) {
        super(options);
    }

    public async Initialize(): Promise<boolean> {

        if (this.initialized)
            return true;

        _.each(this.$children, (view): void => {
            if (view instanceof ViewBase) {
                try {
                    (view as ViewBase).Initialize();
                } catch (ex) {
                    Dump.Error('Initialize Error', ex);
                }
            }
        });

        this.initialized = true;

        return true;
    }

    public GetIsInitialized(): boolean {
        return this.initialized;
    }
}
