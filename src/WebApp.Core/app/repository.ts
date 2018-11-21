import * as ko from "knockout";
import { config } from "./config";

export class Repository {
  private baseUrl: string = "http://modernstorefront-quicksilver.localtest.me/";
  private baseContentDeliveryApiUrl: string =
    this.baseUrl + "api/episerver/v2.0/content/";
  private baseServiceApiUrl: string = this.baseUrl + "episerverapi/";
  private baseTrackingApiUrl: string =
    "https://track-emea01.profilestore.episerver.net/api/v1.0/";

  private serviceApiAccessToken = ko
    .observable<string>()
    .subscribeTo("serviceApiAccessToken", true);

  public getData(url: string): Promise<JSON> {
    return window
      .fetch(`https://physicalstoreintegrationapi.azurewebsites.net${url}`)
      .then(response => {
        return response.json();
      });
  }

  public async products(): Promise<Models.Product[]> {
    var response = await window.fetch(`/data/products.json`);
    return response.json();
  }

  public async product(code: string): Promise<Models.Product> {
    var products = await this.products();
    return products.find(product => {
      return product.code === code;
    });
  }

  public async stores(): Promise<Models.Store[]> {
    var response = await window.fetch(`/data/stores.json`);
    return response.json();
  }

  public async store(id: number): Promise<Models.Store> {
    var stores = await this.stores();
    return stores.find(store => {
      return store.id === id;
    });
  }

  public createOrder(
    store: Models.Store,
    product: Models.Product,
    size: number
  ): Models.Order {
    return {
      orderNumber: Math.ceil(Math.random() * 1000),
      size: size,

      store: store,
      product: product
    };
  }

  /* SERVICE API */
  public async getServiceApiToken(): Promise<any> {
    const response = await fetch(this.baseServiceApiUrl + "token", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body:
        "grant_type=password&username=" +
        config.serviceApiUser +
        "&password=" +
        config.serviceApiPassword
    });

    return response.json();
  }

  public async getCurrentCustomer(contactId: string): Promise<Models.Contact> {
    const response = await fetch(
      this.baseServiceApiUrl + "commerce/customers/contact/" + contactId,
      {
        mode: "cors",
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + this.serviceApiAccessToken()
        }
      }
    );
    return response.json();
  }

  public async getProducts(): Promise<Models.Product[]> {
    const response = await fetch(
      this.baseServiceApiUrl + "commerce/catalog/products/",
      {
        mode: "cors",
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        headers: {
          "Content-Type": "application/json",
          Authorization: "bearer " + this.serviceApiAccessToken()
        }
      }
    );
    return response.json();
  }

  /* CONTENT DELIVERY API */
  public async getPageContent(page: number): Promise<any> {
    const response = await fetch(this.baseContentDeliveryApiUrl + page, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en"
      }
    });
    return response.json();
  }

  /* TRACKING API */
  public async trackEvent(
    contact: Models.Contact,
    eventType: string,
    value?: string
  ): Promise<any> {
    const request = {
      user: {
        name: contact.firstName + " " + contact.lastName,
        email: contact.email
      },
      payload: {},
      remoteAddress: "127.0.0.1",
      clientId: contact.primaryKeyId,
      deviceId: "123",
      eventType: eventType,
      value: value !== undefined ? value : eventType,
      trackId: this.guid(),
      scope: "c909a277-5aad-449a-8a9f-6fe7c265680b",
      eventTime: new Date().toISOString()
    };
    const response = await fetch(this.baseTrackingApiUrl + "Track", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en",
        Authorization: "epi-single " + config.trackApiKey
      },
      body: JSON.stringify(request)
    });
    return response;
  }

  public guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }
}
