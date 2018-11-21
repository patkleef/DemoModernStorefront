/// <amd-dependency path="text!./stock-sizes.html" />
import * as ko from "knockout";
import { Repository } from "../repository";
import ViewModelBase from "./ViewModelBase";
import { EventTypes } from "../models/EventTypes";

declare var window: any;

export class StockSizesViewModel extends ViewModelBase {
  repo = new Repository();

  currentComponent = ko
    .observable<string>()
    .publishOn("currentComponent", true);
  product = ko
    .observable<Models.Product>()
    .syncWith("currentProduct", true, true);
  currentStore = ko
    .observable<Models.Store>()
    .subscribeTo("currentStore", true);
  orders = ko.observableArray<Models.Order>().syncWith("orders", true, true);
  currentCustomer = ko
    .observable<Models.Contact>()
    .syncWith("currentCustomer", true, false);

  items = ko.observable<Models.StoreStock[]>();
  selectedSize = ko.observable<SelectedSizeViewModel>();
  calculateInStock() {
    const selectedSize = this.selectedSize();
    const currentStore = this.currentStore();

    return (
      selectedSize != null &&
      selectedSize.stock.find(item => {
        return item.storeid === currentStore.id;
      }) == null
    );
  }
  showNotInStock = ko.computed(this.calculateInStock, this);
  paymentRequestApiEnabled = ko.observable<boolean>(
    window.PaymentRequest !== undefined && window.PaymentRequest !== null
  );

  clickSelectSize = (size: Models.Size) => {
    this.selectedSize(new SelectedSizeViewModel(size));
  };

  clickOrder = (store: StoreStockViewModel) => {
    this.createOrder(store, Models.OrderType.Standard);
  };

  clickPayNow = (store: StoreStockViewModel) => {
    const customer = this.currentCustomer();
    const product = this.product();
    const productPrice =
      product.salePrice !== undefined ? product.salePrice : product.price;

    const paymentMethods: PaymentMethodData[] = [
      {
        supportedMethods: ["basic-card"],
        data: {
          supportedNetworks: [
            "visa",
            "mastercard",
            "amex",
            "discover",
            "diners",
            "jcb",
            "unionpay"
          ]
        }
      }
    ];

    const paymentDetails = {
      displayItems: [
        {
          label: product.title,
          amount: {
            currency: "USD",
            value: productPrice
          }
        }
      ],
      total: {
        label: "Total due",
        amount: { currency: "USD", value: productPrice }
      }
    };

    var paymentOptions = {
      requestShipping: false,
      requestPayerEmail: false,
      requestPayerPhone: false,
      requestPayerName: false,
      shippingType: "delivery"
    };

    const request = new PaymentRequest(
      paymentMethods,
      paymentDetails,
      paymentOptions
    );

    request.show().then((response: any) => {
      // [process payment]
      // send to a PSP etc.
      this.createOrder(store, Models.OrderType.Standard);

      response.complete("success");
    });
  };

  createOrder = (store: StoreStockViewModel, orderType: Models.OrderType) => {
    if (store instanceof StoreStockViewModel) {
      const order = this.repo.createOrder(
        { id: store.storeid, name: store.storename },
        this.product(),
        this.selectedSize().size,
        orderType
      );
      this.orders.unshift(order);
    } else {
      const order = this.repo.createOrder(
        this.currentStore(),
        this.product(),
        this.selectedSize().size,
        orderType
      );
      this.orders.unshift(order);
    }
    this.repo.trackEvent(this.currentCustomer(), EventTypes.orderPlaced);

    this.currentComponent("myorders-page");
  };

  constructor(params: { item: Models.StoreStock[] }) {
    super();
    this.items(params.item);
  }
}

class StoreStockViewModel implements Models.StoreStock {
  storeid: number;
  storename: string;
  showInfo = ko.observable(false);

  clickToggleInfo = () => {
    this.showInfo(!this.showInfo());
  };

  constructor(storeStock: Models.StoreStock) {
    Object.assign(this, storeStock);
  }
}

class SelectedSizeViewModel {
  size: number;
  stock: StoreStockViewModel[];

  constructor(public sizeModel: Models.Size) {
    this.size = sizeModel.size;
    this.stock = sizeModel.stock.map((storeStock: any) => {
      return new StoreStockViewModel(storeStock);
    });
  }
}
