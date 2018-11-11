/// <amd-dependency path="text!./stock-sizes.html" />
import * as ko from "knockout";
import ViewModelBase from "./ViewModelBase";

export class MenuCartViewModel extends ViewModelBase {
    count = ko.observable(0); 
    
    constructor(params: { item: any }) {
        super();
        ko.postbox.subscribe("AddToCart",
            () => {
                this.count(this.count() + 1);
            });
    }
}
