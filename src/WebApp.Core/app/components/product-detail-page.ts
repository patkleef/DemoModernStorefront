/// <amd-dependency path="text!./product-detail-page.html" />
import * as ko from "knockout";
export class ProductDetailPageViewModel {
    product = ko.observable<Models.Product>().syncWith("currentProduct", true, true);
    wishlistitems = ko.observableArray<Models.WishlistItem>([]).syncWith("wishlistitems", true, false);
    inWishList = ko.pureComputed(()=>{
        const items = this.wishlistitems();
        const product = this.product();
        return items.findIndex((item) => { return item.product.code === product.code;}) !== -1;
    });
 
    constructor() {
    }
}