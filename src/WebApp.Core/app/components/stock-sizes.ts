/// <amd-dependency path="text!./stock-sizes.html" />
import * as ko from "knockout";
import ViewModelBase from "./ViewModelBase";
import { EventTypes } from "../models/EventTypes";
import { repositoryFactory } from "../repositories/repositoryFactory";

declare var window: any;

export class StockSizesViewModel extends ViewModelBase {
  repository = repositoryFactory.get();
  paymentRequest: PaymentRequest;
  shippingOptions: PaymentShippingOption[];
  totalPrice: number;

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

  constructor(params: { item: Models.StoreStock[] }) {
    super();
    this.items(params.item);
  }

  calculateInStock() {
    const selectedSize = this.selectedSize();
    const currentStore = this.currentStore();

    if (selectedSize != null) {
      const stock = selectedSize.stock.find(item => {
        return item.storeCode === currentStore.code;
      });
      return stock && stock.available > 0;
    }
    return false;
  }
  isInStock = ko.computed(this.calculateInStock, this);
  paymentRequestApiEnabled = ko.observable<boolean>(
    window.PaymentRequest !== undefined && window.PaymentRequest !== null
  );

  clickSelectSize = (size: Models.Size) => {
    this.selectedSize(new SelectedSizeViewModel(size));
  };

  clickOrder = (store: StoreStockViewModel) => {
    this.createOrder(store, Models.OrderType.ClickAndCollect);
  };

  clickPayNow = async (store: StoreStockViewModel) => {
    const googlePayPaymentMethod = this.getGooglePayMethod();
    this.totalPrice =
      this.product().salePrice !== undefined
        ? this.product().salePrice
        : this.product().price;

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
      //googlePayPaymentMethod
    ];

    const paymentMethodDetails = await this.getPaymentMethodDetails();

    var paymentOptions = {
      requestShipping: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
      requestPayerName: true,
      shippingType: "delivery"
    };
    debugger;
    this.paymentRequest = new PaymentRequest(
      paymentMethods,
      paymentMethodDetails,
      paymentOptions
    );

    const canMakePayment = await this.paymentRequest.canMakePayment();
    if (!canMakePayment) {
      alert("No supported payment methods, customer can't do payment");
    }

    this.paymentRequest.addEventListener(
      "shippingaddresschange",
      this.shippingAddressChange
    );
    this.paymentRequest.addEventListener(
      "shippingoptionchange",
      this.shippingOptionChange
    );

    this.paymentRequest.show().then((response: any) => {
      // [process payment]
      // send to a PSP etc.
      this.createOrder(store, Models.OrderType.Standard);

      response.complete("success");
    });
  };

  shippingAddressChange = (event: any) => {
    console.log("Shipping address change");
    console.log(this.paymentRequest.shippingAddress);
    console.log(event);

    const shippingOptionsPromise = this.repository
      .getShippingOptions()
      .then((data: PaymentShippingOption[]) => {
        this.shippingOptions = data;
        return {
          ...this.getPaymentMethodDetails(),
          shippingOptions: data
        };
      });

    event.updateWith(shippingOptionsPromise);
  };

  shippingOptionChange = (event: any) => {
    console.log("Shipping option change");
    console.log(event);

    const prInstance = event.target;
    const selectedId = prInstance.shippingOption;

    this.shippingOptions.forEach(option => {
      option.selected = option.id === selectedId;
    });

    event.updateWith({
      ...this.getPaymentMethodDetails(),
      shippingOptions: this.shippingOptions
    });
  };

  getPaymentMethodDetails = (): any => {
    let shippingCosts = 0;
    if (this.shippingOptions) {
      const selectedShippingOption = this.shippingOptions.find(x => x.selected);
      if (
        selectedShippingOption !== null &&
        selectedShippingOption !== undefined
      ) {
        shippingCosts = parseInt(selectedShippingOption.amount.value);
      }
    }

    const allDisplayItems = [
      {
        label: "Subtotal",
        amount: {
          currency: "USD",
          value: this.totalPrice
        }
      },
      {
        label: "Shipping costs",
        amount: {
          currency: "USD",
          value: shippingCosts
        }
      }
    ];

    const paymentDetails = {
      total: this.getTotalLine(shippingCosts),
      displayItems: allDisplayItems
    };
    return paymentDetails;
  };

  getTotalLine = (shippingCosts: number = 0) => {
    return {
      label: "Total",
      amount: { currency: "USD", value: this.totalPrice + shippingCosts }
    };
  };

  getGooglePayMethod = () => {
    const googlePayPaymentMethod = {
      supportedMethods: ["https://google.com/pay"],
      data: {
        environment: "TEST",
        apiVersion: 1,
        allowedPaymentMethods: ["CARD", "TOKENIZED_CARD"],
        paymentMethodTokenizationParameters: {
          tokenizationType: "PAYMENT_GATEWAY",
          // Check with your payment gateway on the parameters to pass.
          parameters: {}
        },
        cardRequirements: {
          allowedCardNetworks: ["AMEX", "DISCOVER", "MASTERCARD", "VISA"],
          billingAddressRequired: true,
          billingAddressFormat: "MIN"
        },
        phoneNumberRequired: true,
        emailRequired: true,
        shippingAddressRequired: true
      }
    };
    return googlePayPaymentMethod;
  };

  createOrder = (store: StoreStockViewModel, orderType: Models.OrderType) => {
    if (store instanceof StoreStockViewModel) {
      const order = this.repository.createOrder(
        { code: store.storeCode, name: store.storeName },
        this.product(),
        this.selectedSize().size,
        orderType
      );
      this.orders.unshift(order);
    } else {
      const order = this.repository.createOrder(
        this.currentStore(),
        this.product(),
        this.selectedSize().size,
        orderType
      );
      this.orders.unshift(order);
    }
    this.repository.trackEvent(this.currentCustomer(), EventTypes.orderPlaced);

    this.currentComponent("myorders-page");
  };
}

class StoreStockViewModel implements Models.StoreStock {
  storePageId: number;
  available: number;
  storeCode: string;
  storeName: string;
  showInfo = ko.observable(false);

  clickToggleInfo = () => {
    this.showInfo(!this.showInfo());
  };

  constructor(storeStock: Models.StoreStock) {
    Object.assign(this, storeStock);
  }
}

class SelectedSizeViewModel {
  size: string;
  stock: StoreStockViewModel[];

  constructor(public sizeModel: Models.Size) {
    this.size = sizeModel.size;
    this.stock = sizeModel.stock.map((storeStock: any) => {
      return new StoreStockViewModel(storeStock);
    });
  }
}
