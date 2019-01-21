import { googlePay } from "../methods";

const run = () => {
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

  const paymentDetails = {
    displayItems: [
      {
        label: "Subtotal",
        amount: {
          currency: "USD",
          value: "180"
        }
      },
      {
        label: "Shipping costs",
        amount: {
          currency: "USD",
          value: "20"
        }
      }
    ],
    total: {
      label: "Total",
      amount: { currency: "USD", value: "200" }
    }
  };

  const paymentOptions = {
    requestShipping: true,
    requestPayerEmail: true,
    requestPayerPhone: true,
    requestPayerName: true,
    shippingType: "shipping"
  };

  const paymentRequest = new PaymentRequest(
    paymentMethods,
    paymentDetails,
    paymentOptions
  );

  const canMakePayment = paymentRequest.canMakePayment();
  if (!canMakePayment) {
    alert("No supported payment methods, customer can't do payment");
  }

  paymentRequest.addEventListener(
    "shippingaddresschange",
    this.shippingAddressChange
  );
  paymentRequest.addEventListener(
    "shippingoptionchange",
    this.shippingOptionChange
  );

  paymentRequest
    .show()
    .then((response: any) => {
      response.complete("success");
    })
    .catch(err => {
      console.error("Payment Request API error: ", err);
    });
};
