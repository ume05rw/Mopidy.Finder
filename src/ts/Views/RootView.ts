import Component from 'vue-class-component';
import ViewBase from './Bases/ViewBase';
import Finder from './Finders/Finder';
import HeaderBar from './HeaderBars/HeaderBar';
import Playlists from './Playlists/Playlists';
import Settings from './Settings/Settings';
import { default as Sidebar, IContentChanged } from './Sidebars/Sidebar';

@Component({
    template: `<div class="wrapper" style="height: 100%; min-height: 100%;">
    <header-bar ref="HeaderBar" />
    <sidebar
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

    private get HeaderBar(): HeaderBar {
        return this.$refs.HeaderBar as HeaderBar;
    }

    private OnContentChanged(args: IContentChanged): void {
        this.HeaderBar.SetTitle(args.Name);
    }
}
