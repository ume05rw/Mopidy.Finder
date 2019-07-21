import * as _ from 'lodash';
import Vue from 'vue';

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
                } catch (e) {
                    console.error('Initialize Error');
                    console.error(e);
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
