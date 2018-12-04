/// <amd-dependency path="text!./wishlist-page.html" />
import * as ko from "knockout";
import { EventTypes } from "../models/EventTypes";
import { repositoryFactory } from "../repositories/repositoryFactory";
import { trackingFactory } from "../repositories/trackingFactory";

export class WishlistViewModel {
  items = ko.observableArray<any>([]);
  wishlistitems = ko
    .observableArray<Models.WishlistItem>([])
    .syncWith("wishlistitems", true, false);
  currentCustomer = ko
    .observable<Models.Contact>()
    .syncWith("currentCustomer", true, false);
  repository = repositoryFactory.get();
  tracking = trackingFactory.get();

  constructor() {}

  removeFromWishlist = (obj: Models.WishlistItem) => {
    this.wishlistitems.remove(obj);
    this.tracking.trackEvent(
      this.currentCustomer(),
      EventTypes.removeFromWishlist,
      "Removed product " + obj.product.code + " from the wishlist"
    );
  };
}
