import ViewBase from '../Bases/ViewBase';
import Component from 'vue-class-component';

@Component({
    template: `<aside class="main-sidebar">
    <ul class="sidebar-menu tree" data-widget="tree">
        <li class="active treeview">
            <a href="#">
                <i class="fa fa-dashboard" />
                <span>Main</span>
                <span class="pull-right-container">
                    <i class="fa fa-angle-left pull-right" />
                </span>
            </a>
            <ul>
                <li>
                    <a href="#">
                        <i class="fa fa-circle-o" />Finder
                    </a>
                </li>
                <li>
                    <a href="#">
                        <i class="fa fa-circle-o" />Playlists
                    </a>
                </li>
            </ul>
        </li>
        <li class="treeview">
            <a href="#">
                <i class="fa fa-dashboard" />
                <span>Settings</span>
                <span class="pull-right-container">
                    <i class="fa fa-angle-left pull-right" />
                </span>
            </a>
            <ul>
                <li>
                    <a href="#">
                        <i class="fa fa-circle-o" />Server
                    </a>
                </li>
                <li>
                    <a href="#">
                        <i class="fa fa-circle-o" />Refresh
                    </a>
                </li>
            </ul>
        </li>
    </ul>
</aside>`
})
export default class Sidebar extends ViewBase {

}
