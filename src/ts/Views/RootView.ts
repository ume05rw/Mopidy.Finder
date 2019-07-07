import ViewBase from './Bases/ViewBase';
import HeaderBar from './HeaderBars/HeaderBar';
import Sidebar from './Sidebars/Sidebar';
import Finder from './Finders/Finder';

export default class RootView extends ViewBase {

    public constructor() {
        super({
            template: `<div class="wrapper" style="height: 100%; min-height: 100%;">
    <header-bar ref="HeaderBar" />
    <sidebar ref="Sidebar" />
    <div class="content-wrapper h-100">
        <section class="content-header">
            <h1 ref="ContentTitle">{{ contentTitleString }}</h1>
        </section>
        <finder ref="Finder" />
    </div>
</div>`,
            components: {
                'header-bar': HeaderBar,
                'sidebar': Sidebar,
                'finder': Finder
            }
        });
    }

    private contentTitleString: string = 'Finder';

}
