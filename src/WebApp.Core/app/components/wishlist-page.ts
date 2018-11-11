/// <amd-dependency path="text!./wishlist-page.html" />
import * as ko from "knockout";
import { RepositoryStub } from "../repositoryStub";

export class WishlistViewModel {

    items = ko.observableArray<any>([]);
    wishlistitems = ko.observableArray<Models.WishlistItem>([]).syncWith("wishlistitems", true, false);

    constructor() {

    } 

    removeFromWishlist = (obj: Models.WishlistItem) => {
        this.wishlistitems.remove(obj);
    }
}