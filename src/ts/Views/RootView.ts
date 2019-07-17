import Component from 'vue-class-component';
import ViewBase from './Bases/ViewBase';
import { IContentView } from './Bases/ContentViewBase';
import Finder from './Finders/Finder';
import HeaderBar from './HeaderBars/HeaderBar';
import Playlists from './Playlists/Playlists';
import Settings from './Settings/Settings';
import { default as Sidebar, Pages, IContentChanged, IContentOrdered } from './Sidebars/Sidebar';
import Exception from '../Utils/Exception';

@Component({
    template: `<div class="wrapper" style="height: 100%; min-height: 100%;">
    <header-bar ref="HeaderBar" />
    <sidebar
        @ContentOrdered="OnContentOrdered"
        @ContentChanged="OnContentChanged"
        ref="Sidebar" />
    <div class="content-wrapper h-100 pt-3 tab-content">
        <finder ref="Finder" />
        <playlists ref="Playlists" />
        <settings ref="Settings" />
    </div>
</div>`,
    components: {
        'header-bar': HeaderBar,
        'sidebar': Sidebar,
        'finder': Finder,
        'playlists': Playlists,
        'settings': Settings
    }
})
export default class RootView extends ViewBase {

    private get Finder(): IContentView {
        return this.$refs.Finder as IContentView;
    }
    private get Playlists(): IContentView {
        return this.$refs.Playlists as IContentView;
    }
    private get Settings(): IContentView {
        return this.$refs.Settings as IContentView;
    }

    private activeContent: IContentView = this.Finder;

    private get HeaderBar(): HeaderBar {
        return this.$refs.HeaderBar as HeaderBar;
    }

    private OnContentOrdered(args: IContentOrdered): void {
        args.Permitted = this.activeContent.GetIsPermitLeave();
    }

    private OnContentChanged(args: IContentChanged): void {
        switch (args.Page) {
            case Pages.Finder:
                this.activeContent = this.Finder;
                break;
            case Pages.Playlists:
                this.activeContent = this.Playlists;
                break;
            case Pages.Settings:
                this.activeContent = this.Settings;
                break;
            default:
                Exception.Throw('Unexpected Page.', args);
        }
        this.HeaderBar.SetHeader(args);
    }
}
