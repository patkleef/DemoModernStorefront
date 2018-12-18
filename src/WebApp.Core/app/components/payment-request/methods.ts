export const googlePay = {
  supportedMethods: ["https://google.com/pay"],
  data: {
    environment: "TEST",
    apiVersion: 2,
    apiVersionMinor: 0,
    merchantInfo: {
      merchantName: "Quicksilver"
    },
    allowedPaymentMethods: [
      {
        type: "CARD",
        parameters: {
          allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
          allowedCardNetworks: ["AMEX", "DISCOVER", "JCB", "MASTERCARD", "VISA"]
        },
        tokenizationSpecification: {
          type: "PAYMENT_GATEWAY",
          parameters: {
            gateway: "example",
            gatewayMerchantId: "exampleGatewayMerchantId"
          }
        }
      }
    ]
  }
};

export const samsungPay = {
  supportedMethods: ["https://spay.samsung.com"],
  data: {
    version: "1",
    productId: "",
    merchantGatewayParameter: { userId: "" },
    allowedCardNetworks: ["mastercard", "visa"],
    merchantName: "Shop Samsung (demo)",
    orderNumber: "1233123"
  }
};
