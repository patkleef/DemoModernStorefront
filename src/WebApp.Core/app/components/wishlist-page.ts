/// <amd-dependency path="text!./wishlist-page.html" />
import * as ko from "knockout";
import { Repository } from "../repository";
import { EventTypes } from "../models/EventTypes";

export class WishlistViewModel {
  items = ko.observableArray<any>([]);
  wishlistitems = ko
    .observableArray<Models.WishlistItem>([])
    .syncWith("wishlistitems", true, false);
  currentCustomer = ko
    .observable<Models.Contact>()
    .syncWith("currentCustomer", true, false);
  repository = new Repository();

  constructor() {}

  removeFromWishlist = (obj: Models.WishlistItem) => {
    this.wishlistitems.remove(obj);
    this.repository.trackEvent(
      this.currentCustomer(),
      EventTypes.removeFromWishlist,
      obj.product.code
    );
  };
}
