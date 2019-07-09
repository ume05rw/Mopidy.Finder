import ViewBase from './Bases/ViewBase';
import HeaderBar from './HeaderBars/HeaderBar';
import Sidebar from './Sidebars/Sidebar';
import Finder from './Finders/Finder';
import Playlists from './Playlists/Playlists';
import Settings from './Settings/Settings'

export default class RootView extends ViewBase {

    public constructor() {
        super({
            template: `<div class="wrapper" style="height: 100%; min-height: 100%;">
    <header-bar ref="HeaderBar" />
    <sidebar ref="Sidebar" />
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
        });
    }
}
