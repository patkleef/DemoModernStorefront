/// <amd-dependency path="text!./nav-menu.html" />
import * as ko from "knockout";
import ViewModelBase from "./ViewModelBase";
export class NavMenuViewModel  extends ViewModelBase {
    currentComponent = ko.observable().syncWith("currentComponent", true, true);
    
    clickNavigate = (newPage: string) => {
        this.currentComponent(newPage);
    }
}