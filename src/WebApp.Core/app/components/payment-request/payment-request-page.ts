/// <amd-dependency path="text!./payment-request-page.html" />
import ViewModelBase from "../ViewModelBase";
import { repositoryFactory } from "../../repositories/repositoryFactory";
import { googlePay } from "./methods";

export class PaymentRequestPageViewModel extends ViewModelBase {
  repository = repositoryFactory.get();
  paymentRequest: PaymentRequest;
  shippingOptions: PaymentShippingOption[];
  totalPrice: number;

  constructor() {
    super();
    this.initPayment();
  }

  payClicked = async () => {
    this.initPayment();
  };

  initPayment = async () => {
    this.totalPrice = await this.getTotal();
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
      },
      googlePay
    ];

    const paymentOptions = {
      requestShipping: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
      requestPayerName: true,
      shippingType: "shipping"
    };

    const paymentMethodDetails = await this.getPaymentMethodDetails();
    this.paymentRequest = new PaymentRequest(
      paymentMethods,
      paymentMethodDetails,
      paymentOptions
    );

    const canMakePayment = await (this.paymentRequest as any).canMakePayment();
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

    this.paymentRequest
      .show()
      .then((response: any) => {
        console.log("Payment succesfull");
        console.log(response);
        response.complete("success");
      })
      .catch(err => {
        console.error("Payment Request API error: ", err);
      });

    setTimeout(() => {
      this.paymentRequest
        .abort()
        .then(() => { })
        .catch(err => {
          console.log("abort() Error: ", err);
        });
    }, 100000);
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

  getTotal = async (): Promise<number> => {
    const products = await this.repository.getProducts();
    let totalPrice = 0;
    const displayItems = [];
    products.forEach((product: Models.Product) => {
      const productPrice =
        product.salePrice !== undefined ? product.salePrice : product.price;
      displayItems.push({
        label: product.title,
        amount: {
          currency: "USD",
          value: productPrice
        }
      });
      totalPrice += productPrice;
    });
    return totalPrice;
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
}
