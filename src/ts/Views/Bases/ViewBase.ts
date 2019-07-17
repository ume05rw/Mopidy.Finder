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

        const promises: Promise<boolean>[] = [];
        _.each(this.$children, (view): void => {
            if (view instanceof ViewBase)
                promises.push((view as ViewBase).Initialize());
        });

        await Promise.all(promises);

        return true;
    }

    public GetIsInitialized(): boolean {
        return this.initialized;
    }
}
