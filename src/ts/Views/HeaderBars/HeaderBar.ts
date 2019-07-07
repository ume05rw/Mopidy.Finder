import ViewBase from '../Bases/ViewBase';
import Component from 'vue-class-component';

@Component({
    template: `<nav class="main-header navbar navbar-expand navbar-white navbar-light border-bottom">
    <ul class="navbar-nav">
        <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="#">
                <i class="fa fa-bars" />
            </a>
        </li>
    </ul>
    <ul class="navbar-nav ml-auto">
        <li class="nav-item">
            <button type="button" class="btn btn-default btn-sm">
                <i class="fa fa-backward" />
            </button>
        </li>
        <li class="nav-item">
            <button type="button" class="btn btn-default btn-sm">
                <i class="fa fa-play" />
            </button>
        </li>
        <li class="nav-item">
            <button type="button" class="btn btn-default btn-sm">
                <i class="fa fa-forward" />
            </button>
        </li>
    </ul>
</nav>`
})
export default class HeaderBar extends ViewBase {

}
