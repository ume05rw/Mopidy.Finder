import ViewBase from '../Bases/ViewBase';
import Component from 'vue-class-component';
import { Pages, IContentChanged } from '../Sidebars/Sidebar';

@Component({
    template: `<nav class="main-header navbar navbar-expand border-bottom">
    <ul class="navbar-nav">
        <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu" href="javascript:void(0)">
                <i class="fa fa-bars" />
            </a>
        </li>
        <li class="nav-item">
            <h3>{{ title }}</h3>
        </li>
    </ul>
</nav>`
})
export default class HeaderBar extends ViewBase {
    private title: string = Pages.Finder.toString();

    public SetHeader(args: IContentChanged): void {
        this.title = args.Page.toString();
    }
}
