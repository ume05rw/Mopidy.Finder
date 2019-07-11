import ViewBase from './Bases/ViewBase';
import Component from 'vue-class-component';
import HeaderBar from './HeaderBars/HeaderBar';
import { default as Sidebar, SidebarEvents, IContentChanged } from './Sidebars/Sidebar';
import Finder from './Finders/Finder';
import Playlists from './Playlists/Playlists';
import Settings from './Settings/Settings'

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
