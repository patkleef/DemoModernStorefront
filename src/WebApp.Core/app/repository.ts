import * as ko from "knockout";

export class Repository {
  private baseUrl: string = "http://modernstorefront-quicksilver.localtest.me/";
  private baseContentDeliveryApiUrl: string =
    this.baseUrl + "api/episerver/v2.0/content/";
  private baseServiceApiUrl: string = this.baseUrl + "episerverapi/";

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
      body: "grant_type=password&username=apiUser&password=Episerver#15" // body data type must match "Content-Type" header
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
      method: "GET", // *GET, POST, PUT, DELETE, etc.

      headers: {
        "Content-Type": "application/json",
        "Accept-Language": "en"
      }
    });
    return response.json();
  }
}
