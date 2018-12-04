/// <amd-dependency path="text!./start-page.html" />
import * as $ from "jquery";
import * as ko from "knockout";
import { repositoryFactory } from "../repositories/repositoryFactory";
import { EventTypes } from "../models/EventTypes";
import { trackingFactory } from "../repositories/trackingFactory";

export class StartPageViewModel {
  repository = repositoryFactory.get();
  tracking = trackingFactory.get();

  showIntroductionTour = ko
    .observable<boolean>(true)
    .syncWith("showIntroductionTour", true, false);
  products = ko.observableArray<Models.Product>([]);
  wishlistitems = ko
    .observableArray<Models.WishlistItem>([])
    .syncWith("wishlistitems", true, false);
  orders = ko.observableArray<Models.Order>([]).syncWith("orders", true, false);
  currentStore = ko
    .observable<Models.Store>()
    .subscribeTo("currentStore", true);
  currentStorePage = ko
    .observable<Models.StorePage>()
    .syncWith("currentStorePage", true);
  currentCustomer = ko
    .observable<Models.Contact>()
    .subscribeTo("currentCustomer", true);
  numberOfStoreVisits = ko.observable<string>();

  constructor() {
    $(".single-item").slick({
      dots: true
    });

    const response = this.repository.getProducts();

    this.tracking.trackEvent(
      this.currentCustomer(),
      EventTypes.storeVisit,
      "Visited store " + this.currentStore().name,
      this.currentStore()
    );

    this.tracking
      .getNumberOfVisitsThisMonth(this.currentCustomer(), this.currentStore())
      .then(data => {
        this.numberOfStoreVisits(data.total);
      });

    response.then(products => {
      products.forEach((product: Models.Product) => {
        this.products.push(product);
      });
    });
  }

  skipIntroductionTour = () => {
    this.showIntroductionTour(false);
  };
}
