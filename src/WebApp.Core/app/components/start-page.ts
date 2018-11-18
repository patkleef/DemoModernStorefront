/// <amd-dependency path="text!./start-page.html" />
import * as $ from "jquery";
import * as ko from "knockout";
import { Repository } from "../repository";

export class StartPageViewModel {
  repository = new Repository();

  showIntroductionTour = ko
    .observable<boolean>(true)
    .syncWith("showIntroductionTour", true, false);
  products = ko.observableArray<any>([]);
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

  constructor() {
    $(".single-item").slick({
      dots: true
    });

    const response = this.repository.getProducts();

    response.then(products => {
      products.forEach((product: Models.Product) => {
        this.products.push(product);
      });
    });
  }

  skipIntroductionTour = () => {
    this.showIntroductionTour(false);
  };

  scanProduct = () => {
    alert("Product scanned");
  };
}
