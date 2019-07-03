import ViewBase from '../Bases/ViewBase';
import Component from 'vue-class-component';

@Component({
    template: `<aside class="main-sidebar sidebar-dark-primary">
    <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview">
        <li class="nav-item has-treeview">
            <a href="#" class="nav-link">
                <i class="nav-icon fa fa-dashboard" />
                <p>
                    Main
                    <i class="fa fa-angle-left right" />
                </p>
            </a>
            <ul class="nav nav-treeview">
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fa fa-circle-o nav-icon" />
                        <p>Finder</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fa fa-circle-o nav-icon" />
                        <p>Playlists</p>
                    </a>
                </li>
            </ul>
        </li>
        <li class="nav-item has-treeview">
            <a href="#" class="nav-link">
                <i class="nav-icon fa fa-dashboard" />
                <p>
                    Settings
                    <i class="fa fa-angle-left right" />
                </p>
            </a>
            <ul class="nav nav-treeview">
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fa fa-circle-o nav-icon" />
                        <p>Server</p>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="#" class="nav-link">
                        <i class="fa fa-circle-o nav-icon" />
                        <p>Refresh</p>
                    </a>
                </li>
            </ul>
        </li>
    </ul>
</aside>`
})
export default class Sidebar extends ViewBase {

}
