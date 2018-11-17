import * as ko from "knockout";
import { Repository } from "./repository";

import { firebaseConnection } from "./firebaseConnection";
import ViewModelBase from "./components/ViewModelBase";

export class MainViewModel extends ViewModelBase {
  repository = new Repository();
  lastScannedId = ko.observable().extend({ throttle: 100 });
  loading = ko.observable(true);
  items = ko.observableArray<any>([]);

  currentComponent = ko
    .observable<string>()
    .syncWith("currentComponent", false);
  currentProduct = ko
    .observable<Models.Product>()
    .syncWith("currentProduct", false);
  currentStore = ko.observable<Models.Store>().syncWith("currentStore", false);
  wishlistitems = ko
    .observableArray<Models.WishlistItem>([])
    .syncWith("wishlistitems", true, false);
  orders = ko
    .observableArray<{ product: Models.Product; store: string }>([])
    .syncWith("orders", true, false);
  couponRetrieved = ko
    .observable<boolean>(false)
    .syncWith("couponRetrieved", true, false);

  serviceApiAccessToken = ko
    .observable<string>("")
    .syncWith("serviceApiAccessToken", true, false);

  testLoadItem = async (code: string) => {
    if (code != "") {
      code = "SKU-44466536";
    }
    debugger;
    var product = await this.repository.product(code);
    if (product) {
      this.currentProduct(product);
      this.currentComponent("product-detail-page");
    }
  };

  clickAddToWishlist = (product: Models.Product) => {
    var exists = false;
    ko.utils.arrayForEach(this.wishlistitems(), function(item) {
      if (product.code === item.product.code) {
        exists = true;
        return;
      }
    });

    if (exists) {
      alert(product.title + " already in wishlist");
      return;
    }
    var store = this.currentStore();
    this.wishlistitems.push({ product: product, store: store });
  };

  constructor() {
    super();

    this.initialize();

    this.setDefaultCurrentStore();

    this.currentComponent("login-page");
    this.lastScannedId.subscribe((newScannedId: string) => {
      //this.load(newScannedId);
    });
  }

  initialize = async () => {
    const serviceTokenPromise = this.repository.getServiceApiToken();
    const pagePromise = this.repository.getPageContent(7);

    Promise.all([serviceTokenPromise, pagePromise]).then(function(values) {
      debugger;
      console.log(values);

      this.serviceApiAccessToken(values[0]);
    });
  };

  setDefaultCurrentStore = async () => {
    var store = await this.repository.store(1);
    if (store) {
      this.currentStore(store);
    }
  };

  productScanned = async (code: string) => {
    const userInfo = firebaseConnection.getLoggedInUserInfo();
    firebaseConnection.app
      .database()
      .ref("active-users/" + userInfo.displayName)
      .set({
        userInfo: userInfo,
        lastActive: new Date().getTime()
      });

    var product = await this.repository.product(code);
    if (product) {
      firebaseConnection.app
        .database()
        .ref("events/")
        .push({
          userInfo: userInfo,
          product: product,
          message: "Product scanned. Code: " + code,
          timestamp: new Date().getTime()
        });

      this.currentProduct(product);
      this.currentComponent("product-detail-page");
      if (!this.couponRetrieved()) {
        ko.postbox.publish("ShowDialogTopic");
        this.couponRetrieved(true);

        firebaseConnection.app
          .database()
          .ref("events/")
          .push(<Models.UserEvent>{
            userInfo: userInfo,
            product: product,
            message: "Coupon code retrieved",
            timestamp: new Date().getTime()
          });
      }
    }
  };
}
