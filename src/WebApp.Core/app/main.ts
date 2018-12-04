import * as ko from "knockout";

import ViewModelBase from "./components/ViewModelBase";
import { EventTypes } from "./models/EventTypes";
import { repositoryFactory } from "./repositories/repositoryFactory";
import { config } from "./config";

export class MainViewModel extends ViewModelBase {
  repository = repositoryFactory.get();
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
  currentStorePage = ko
    .observable<Models.StorePage>()
    .syncWith("currentStorePage", false);
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
  currentCustomer = ko
    .observable<Models.Contact>(null)
    .syncWith("currentCustomer", false);

  loadProductByCode = async (code: string) => {
    var product = await this.repository.getProduct(code);

    this.loadProduct(product);
  };

  loadProduct = (product: Models.Product) => {
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
    this.repository.trackEvent(
      this.currentCustomer(),
      EventTypes.addToWishlist,
      "Added product " + product.code + " to the wishlist"
    );
  };

  constructor() {
    super();

    this.currentComponent("start-page");

    this.initialize();
  }

  initialize = async () => {
    const serviceTokenPromise = this.repository
      .getServiceApiToken()
      .then(data => {
        this.serviceApiAccessToken(data.access_token);

        const pagePromise = this.repository.getPageContent(config.storePageId);

        Promise.all([pagePromise]).then(values => {
          this.currentStorePage(values[0]);

          this.completedInitialization();
        });
      });

    this.readNfc();
  };

  completedInitialization = () => {
    this.setDefaultCurrentStore();

    this.currentComponent.subscribe((value: string) => {
      if (this.currentCustomer() !== null) {
        this.repository.trackEvent(
          this.currentCustomer(),
          "page-view",
          "Visited page " + value
        );
      }
    });

    this.currentComponent("login-page");
    this.lastScannedId.subscribe((newScannedId: string) => {
      //this.load(newScannedId);
    });
  };

  setDefaultCurrentStore = async () => {
    var store = await this.repository.getStore(config.store);
    if (store) {
      this.currentStore(store);
    }
  };

  readNfc() {
    if ("nfc" in navigator) {
      (navigator as any).nfc
        .watch(
          message => {
            console.log("NFC message received", message);
            var items = message.records || message.data;
            items.forEach(record => {
              if (record.recordType == "text") {
                console.log("Record type text: " + record.data);
                this.productScanned(record.data);
              } else {
                console.log("Record type unknown: " + record.data);
              }
            });
            $("#message-list li")[0].scrollIntoView();
          },
          { mode: "any" }
        )
        .then(() => console.log("Added a watch."))
        .catch(err => console.log("Adding watch failed: " + err.name));
    } else {
      console.log("NFC API not supported.");
    }
  }

  productScanned = async (code: string) => {
    var product = await this.repository.getProduct(code);
    if (product) {
      this.repository.trackEvent(
        this.currentCustomer(),
        EventTypes.productScanned,
        "Scanned product '" + product.title + "'"
      );

      this.currentProduct(product);
      this.currentComponent("product-detail-page");
      if (config.showCouponCode && !this.couponRetrieved()) {
        ko.postbox.publish("ShowDialogTopic");
        this.couponRetrieved(true);

        this.repository.trackEvent(
          this.currentCustomer(),
          EventTypes.couponRetrieved,
          "Retrieved coupon code"
        );
      }
    }
  };
}
