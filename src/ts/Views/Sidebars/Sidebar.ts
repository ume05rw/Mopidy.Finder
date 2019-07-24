import * as _ from 'lodash';
import Component from 'vue-class-component';
import Libraries from '../../Libraries';
import Exception from '../../Utils/Exception';
import { Contents, IContentArgs, IContentOrderedArgs } from '../Bases/IContent';
import { TabEvents } from '../Bases/TabBase';
import ViewBase from '../Bases/ViewBase';
import { TabEvents as BsTabEvents } from '../Events/BootstrapEvents';
import PlayerPanel from './PlayerPanel';

export interface ITabEventRecievedArgs extends IContentArgs {
    Event: string;
}

export const SideBarEvents = {
    Operated: 'Operated',
    ContentOrdered: 'ContentOrdered',
    TabEventRecieved: 'TabEventRecieved'
};

export const NavigationAriaControls = {
    Finder: 'tab-finder',
    Playlists: 'tab-playlists',
    Settings: 'tab-settings'
};

@Component({
    template: `<aside class="main-sidebar sidebar-dark-warning elevation-4">
    <div class="brand-link navbar-secondary">
        <span class="brand-text font-weight-light">Mopidy.Finder</span>
    </div>
    <section
        class="sidebar"
        ref="SideBarSection">
        <div class="w-100 inner-sidebar">
            <nav class="mt-2">
                <ul class="nav nav-pills nav-sidebar flex-column" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link"
                            id="nav-finder"
                            href="#tab-finder"
                            role="tab"
                            data-toggle="tab"
                            aria-controls="tab-finder"
                            aria-selected="false"
                            ref="NavigationFinder"
                            @click="OnNavigationClicked" >
                            <i class="fa fa-search nav-icon" />
                            <p>Finder</p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link"
                            id="nav-playlists"
                            href="#tab-playlists"
                            role="tab"
                            data-toggle="tab"
                            aria-controls="tab-playlists"
                            aria-selected="false"
                            ref="NavigationPlaylists"
                            @click="OnNavigationClicked" >
                            <i class="fa fa-bookmark nav-icon" />
                            <p>Playlists</p>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link"
                            id="nav-settings"
                            href="#tab-settings"
                            role="tab"
                            data-toggle="tab"
                            aria-controls="tab-settings"
                            aria-selected="false"
                            ref="NavigationSettings"
                            @click="OnNavigationClicked" >
                            <i class="fa fa-cog nav-icon" />
                            <p>Settings</p>
                        </a>
                    </li>
                </ul>
            </nav>
            <div class="row mt-2">
                <div class="col-12">
                    <player-panel
                        ref="PlayerPanel"
                        @Operated="OnOperated"/>
                </div>
            </div>
        </div>
    </section>
</aside>`,
    components: {
        'player-panel': PlayerPanel
    }
})
export default class SideBar extends ViewBase {

    private static readonly ShowTabMethod = 'show';

    private navigationAnchors: JQuery;

    private get SideBarSection(): HTMLTableSectionElement {
        return this.$refs.SideBarSection as HTMLTableSectionElement;
    }
    public get NavigationFinder(): HTMLAnchorElement {
        return this.$refs.NavigationFinder as HTMLAnchorElement;
    }
    public get NavigationPlaylists(): HTMLAnchorElement {
        return this.$refs.NavigationPlaylists as HTMLAnchorElement;
    }
    public get NavigationSettings(): HTMLAnchorElement {
        return this.$refs.NavigationSettings as HTMLAnchorElement;
    }
    private get PlayerPanel(): PlayerPanel {
        return this.$refs.PlayerPanel as PlayerPanel;
    }

    public async Initialize(): Promise<boolean> {
        super.Initialize();

        Libraries.SlimScroll(this.SideBarSection, {
            height: 'calc(100%)'
        });

        this.navigationAnchors = Libraries.$([
            this.NavigationFinder,
            this.NavigationPlaylists,
            this.NavigationSettings
        ]);

        this.navigationAnchors.on(BsTabEvents.Show, (args: Event) => {
            this.EmitTabEvent(TabEvents.Show, args);
        });
        this.navigationAnchors.on(BsTabEvents.Shown, (args: Event) => {
            this.EmitTabEvent(TabEvents.Shown, args);
        });
        this.navigationAnchors.on(BsTabEvents.Hide, (args: Event) => {
            this.EmitTabEvent(TabEvents.Hide, args);
        });
        this.navigationAnchors.on(BsTabEvents.Hidden, (args: Event) => {
            this.EmitTabEvent(TabEvents.Hidden, args);
        });

        return true;
    }

    private EmitTabEvent(eventName: string, args: Event): void {
        const anchor = args.currentTarget as HTMLAnchorElement;
        const naviTypeString = anchor.getAttribute('aria-controls');

        let content: Contents;
        switch (naviTypeString) {
            case NavigationAriaControls.Finder:
                content = Contents.Finder;
                break;
            case NavigationAriaControls.Playlists:
                content = Contents.Playlists;
                break;
            case NavigationAriaControls.Settings:
                content = Contents.Settings;
                break;
            default:
                Exception.Throw('Unexpected Tab Kind', naviTypeString);
        }

        const emitArgs: ITabEventRecievedArgs = {
            Event: eventName,
            Content: content
        };
        this.$emit(SideBarEvents.TabEventRecieved, emitArgs);
    }

    private OnNavigationClicked(args: MouseEvent): void {
        const anchor = args.currentTarget as HTMLAnchorElement;
        const naviTypeString = anchor.getAttribute('aria-controls');

        // クリックイベントではコンテンツを変更しない。
        args.preventDefault();
        args.stopPropagation();

        let content: Contents;
        switch (naviTypeString) {
            case NavigationAriaControls.Finder:
                content = Contents.Finder;
                break;
            case NavigationAriaControls.Playlists:
                content = Contents.Playlists;
                break;
            case NavigationAriaControls.Settings:
                content = Contents.Settings;
                break;
            default:
                Exception.Throw('Unexpected Tab Kind', naviTypeString);
        }

        const orderedArgs: IContentOrderedArgs = {
            Content: content,
            Permitted: true
        };
        this.$emit(SideBarEvents.ContentOrdered, orderedArgs);

        if (orderedArgs.Permitted === true)
            this.$emit(SideBarEvents.Operated);
    }

    public SetNavigation(content: Contents): void {
        switch (content) {
            case Contents.Finder:
                Libraries.$(this.NavigationFinder).tab(SideBar.ShowTabMethod);
                break;
            case Contents.Playlists:
                Libraries.$(this.NavigationPlaylists).tab(SideBar.ShowTabMethod);
                break;
            case Contents.Settings:
                Libraries.$(this.NavigationSettings).tab(SideBar.ShowTabMethod);
                break;
            default:
                Exception.Throw('Unexpected Content Ordered.', content);
        }
    }

    private OnOperated(): void {
        this.$emit(SideBarEvents.Operated);
    }

    public OnShown(): void {
        this.PlayerPanel.StartMonitor();
    }

    public OnCollapsed(): void {
        this.PlayerPanel.StopMonitor();
    }
}
