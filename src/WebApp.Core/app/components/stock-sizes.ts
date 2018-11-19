/// <amd-dependency path="text!./stock-sizes.html" />
import * as ko from "knockout";
import { Repository } from "../repository";
import ViewModelBase from "./ViewModelBase";
import { EventTypes } from "../models/EventTypes";

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

  clickSelectSize = (size: Models.Size) => {
    this.selectedSize(new SelectedSizeViewModel(size));
  };

  clickOrder = (store: StoreStockViewModel) => {
    if (store instanceof StoreStockViewModel) {
      const order = this.repo.createOrder(
        { id: store.storeid, name: store.storename },
        this.product(),
        this.selectedSize().size
      );
      this.orders.unshift(order);
    } else {
      const order = this.repo.createOrder(
        this.currentStore(),
        this.product(),
        this.selectedSize().size
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
    this.stock = sizeModel.stock.map(storeStock => {
      return new StoreStockViewModel(storeStock);
    });
  }
}
