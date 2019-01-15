/// <amd-dependency path="text!./start-page.html" />
import * as $ from "jquery";
import * as ko from "knockout";
import { repositoryFactory } from "../repositories/repositoryFactory";
import { EventTypes } from "../models/EventTypes";
import { trackingFactory } from "../repositories/trackingFactory";

ko.bindingHandlers.slick = {
  init: function(element, valueAccessor, allBindingsAccessor) {
    $(element).empty();
    var items = ko.unwrap(valueAccessor());
    if (items) {
      items.forEach(function(item) {
        const div = $("<div>");
        const strong = $("<strong>");
        const p = $("<p>");
        p.html(item.mainBody.value);
        strong.html(item.title.value);
        const image = $("<img>");
        image.attr("src", item.mainImage.value);
        div.append(strong);
        div.append(p);
        div.append(image);
        $(element).append(div);
      });
    }

    var options = allBindingsAccessor().slickOptions || {};

    $(element).slick(options);

    ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
      $(element).slick("unslick");
    });
  },

  update: function(element, valueAccessor) {
    var images = ko.unwrap(valueAccessor());
  }
};

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
    const response = this.repository.getProducts();

    const store = this.currentStore();
    if (store) {
      this.tracking.trackEvent(
        this.currentCustomer(),
        EventTypes.storeVisit,
        "Visited store " + store.name,
        store
      );

      this.tracking
        .getNumberOfVisitsThisMonth(this.currentCustomer(), store)
        .then(data => {
          this.numberOfStoreVisits(data.total);
        });
    }

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
