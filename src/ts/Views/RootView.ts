import Component from 'vue-class-component';
import ViewBase from './Bases/ViewBase';
import Finder from './Finders/Finder';
import HeaderBar from './HeaderBars/HeaderBar';
import Playlists from './Playlists/Playlists';
import Settings from './Settings/Settings';
import SideBar from './SideBars/SideBar';

@Component({
    template: `<div class="wrapper" style="height: 100%; min-height: 100%;">
    <header-bar
        ref="HeaderBar" />
    <sidebar
        ref="SideBar" />
    <div class="content-wrapper h-100 pt-3 tab-content">
        <finder
            ref="Finder" />
        <playlists
            ref="Playlists" />
        <settings
            ref="Settings" />
    </div>
</div>`,
    components: {
        'header-bar': HeaderBar,
        'sidebar': SideBar,
        'finder': Finder,
        'playlists': Playlists,
        'settings': Settings
    }
})
export default class RootView extends ViewBase {

    public get HeaderBar(): HeaderBar {
        return this.$refs.HeaderBar as HeaderBar;
    }
    public get SideBar(): SideBar {
        return this.$refs.SideBar as SideBar;
    }
    public get Finder(): Finder {
        return this.$refs.Finder as Finder;
    }
    public get Playlists(): Playlists {
        return this.$refs.Playlists as Playlists;
    }
    public get Settings(): Settings {
        return this.$refs.Settings as Settings;
    }

    public async Initialize(): Promise<boolean> {
        await super.Initialize();

        return true;
    }
}
